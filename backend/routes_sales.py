"""
Sales routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app, send_file
from models import Sale, SaleService, SaleProduct, Customer, Staff, Service, Product, ProductUsage, Payment
from db import db
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from datetime import datetime, date
from utils import get_demo_filter, generate_sale_number
from validators import validate_mpesa_code
from pdf_generators import generate_sales_receipt_pdf

bp_sales = Blueprint('sales', __name__)


@bp_sales.route('/sales', methods=['POST'])
def create_sale():
    """Create a new sale (walk-in transaction)"""
    data = request.get_json()
    staff_id = data.get('staff_id')
    
    if not staff_id:
        return jsonify({'error': 'Staff ID is required'}), 400
    
    # Generate unique sale number
    sale_number = generate_sale_number()
    
    # Create or get customer if name/phone provided
    customer_id = None
    # Get staff to check demo status
    staff = Staff.query.get(staff_id)
    is_demo_user = staff.is_demo if staff and hasattr(staff, 'is_demo') and staff.is_demo else False
    
    if data.get('customer_name') or data.get('customer_phone'):
        # Try to find existing customer by phone (only if same demo status)
        if data.get('customer_phone'):
            existing_customer = Customer.query.filter_by(
                phone=data.get('customer_phone'),
                is_demo=is_demo_user
            ).first()
            if existing_customer:
                customer_id = existing_customer.id
            else:
                # Create new customer with demo flag
                new_customer = Customer(
                    name=data.get('customer_name') or "Walk-in Customer",
                    phone=data.get('customer_phone'),
                    email=data.get('customer_email'),
                    is_demo=is_demo_user
                )
                db.session.add(new_customer)
                db.session.flush()
                customer_id = new_customer.id
    
    # Create sale with demo flag
    sale = Sale(
        sale_number=sale_number,
        staff_id=staff_id,
        customer_id=customer_id,
        customer_name=data.get('customer_name'),
        customer_phone=data.get('customer_phone'),
        status='pending',
        notes=data.get('notes'),
        is_demo=is_demo_user
    )
    db.session.add(sale)
    db.session.flush()
    
    # Add services to sale
    services = data.get('services', [])
    for service_data in services:
        service_id = service_data.get('service_id') or service_data.get('id')
        quantity = service_data.get('quantity', 1)
        service_name = service_data.get('name')
        service_price = service_data.get('price')
        commission_rate = service_data.get('commission_rate', 0.50)
        
        # Get or create Service record
        service = Service.query.get(service_id)
        if not service:
            # Service doesn't exist in database - create it with frontend data
            if service_name and service_price is not None:
                # Get duration from frontend if provided, default to 30 minutes
                duration = service_data.get('duration', 30)
                try:
                    # Try to create service with the specified ID
                    service = Service(
                        id=service_id,  # Try to use the ID from frontend
                        name=service_name,
                        price=service_price,
                        duration=duration
                    )
                    db.session.add(service)
                    db.session.flush()
                except Exception:
                    # If setting ID fails, create without ID
                    db.session.rollback()
                    existing_service = Service.query.filter_by(name=service_name).first()
                    if existing_service:
                        service = existing_service
                    else:
                        service = Service(
                            name=service_name,
                            price=service_price,
                            duration=duration
                        )
                        db.session.add(service)
                        db.session.flush()
            else:
                continue
        
        # Use price from frontend if provided, otherwise use database price
        unit_price = service_price if service_price is not None else service.price
        total_price = unit_price * quantity
        # Commission is calculated on subtotal (excluding tax)
        subtotal_price = round(total_price / 1.16, 2)
        commission_amount = round(subtotal_price * commission_rate, 2)
        
        sale_service = SaleService(
            sale_id=sale.id,
            service_id=service.id,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            commission_rate=commission_rate,
            commission_amount=commission_amount
        )
        db.session.add(sale_service)
    
    # Add products to sale (stock NOT deducted yet)
    products = data.get('products', [])
    for product_data in products:
        product_id = product_data.get('product_id') or product_data.get('id')
        quantity = product_data.get('quantity', 1)
        
        product = Product.query.get(product_id)
        if product:
            unit_price = product.selling_price or product.unit_price
            total_price = unit_price * quantity
            
            sale_product = SaleProduct(
                sale_id=sale.id,
                product_id=product_id,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price,
                stock_deducted=False
            )
            db.session.add(sale_product)
    
    # Calculate totals
    total_amount = sum(ss.total_price for ss in sale.sale_services) + sum(sp.total_price for sp in sale.sale_products)
    subtotal = round(total_amount / 1.16, 2)
    tax_amount = round(total_amount - subtotal, 2)
    commission_amount = sum(ss.commission_amount for ss in sale.sale_services)
    
    sale.subtotal = subtotal
    sale.tax_amount = tax_amount
    sale.total_amount = total_amount
    sale.commission_amount = commission_amount
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create sale: {str(e)}'}), 500
    
    return jsonify(sale.to_dict()), 201


@bp_sales.route('/sales/<int:id>/complete', methods=['POST'])
def complete_sale(id):
    """Complete a sale - deduct stock, finalize commission, create payment"""
    sale = Sale.query.options(joinedload(Sale.sale_products).joinedload(SaleProduct.product)).get_or_404(id)
    data = request.get_json()
    
    if sale.status == 'completed':
        return jsonify({'error': 'Sale already completed'}), 400
    
    payment_method = data.get('payment_method')
    transaction_code = data.get('transaction_code')
    
    if not payment_method:
        return jsonify({'error': 'Payment method is required'}), 400
    
    # Validate M-Pesa transaction code format if provided
    if payment_method.lower() in ['m_pesa', 'm-pesa', 'mpesa'] and transaction_code:
        is_valid, error, normalized_code = validate_mpesa_code(transaction_code)
        if not is_valid:
            return jsonify({'error': error}), 400
        transaction_code = normalized_code
    
    try:
        # STEP 1: Deduct product stock (if any products in sale)
        if sale.sale_products:
            for sale_product in sale.sale_products:
                if not sale_product.stock_deducted:
                    try:
                        product = sale_product.product
                    except AttributeError:
                        # Product relationship not loaded, query it directly
                        product = Product.query.get(sale_product.product_id)
                    
                    if not product:
                        return jsonify({
                            'error': f'Product not found for sale product ID {sale_product.id} (product_id: {sale_product.product_id}). Product may have been deleted.'
                        }), 400
                    
                    # Handle None stock_quantity (default to 0)
                    current_stock = product.stock_quantity if product.stock_quantity is not None else 0
                    if current_stock < sale_product.quantity:
                        return jsonify({
                            'error': f'Insufficient stock for {product.name}. Available: {current_stock}, Required: {sale_product.quantity}'
                        }), 400
                    
                    product.stock_quantity = current_stock - sale_product.quantity
                    sale_product.stock_deducted = True
                    
                    # Record product usage
                    product_usage = ProductUsage(
                        product_id=product.id,
                        sale_id=sale.id,
                        quantity_used=sale_product.quantity,
                        used_at=datetime.utcnow()
                    )
                    db.session.add(product_usage)
        
        # STEP 2: Generate receipt number
        receipt_number = data.get('receipt_number') or f"RCP-{sale.sale_number.replace('SALE-', '')}"
        
        # STEP 3: Create payment
        payment = Payment(
            sale_id=sale.id,
            appointment_id=None,
            amount=sale.total_amount,
            payment_method=payment_method.lower().replace("-", "_"),
            status='completed',
            transaction_code=transaction_code,
            receipt_number=receipt_number
        )
        db.session.add(payment)
        
        # STEP 4: Mark sale as completed
        sale.status = 'completed'
        sale.completed_at = datetime.utcnow()
        
        # STEP 5: Update customer stats if customer exists
        if sale.customer_id:
            customer = sale.customer
            customer.total_visits += 1
            customer.total_spent += sale.total_amount
            customer.last_visit = datetime.utcnow()
            
            # Award loyalty points: 1 point per KES 100 spent
            points_earned = int(sale.total_amount / 100)
            if points_earned > 0:
                customer.loyalty_points = (customer.loyalty_points or 0) + points_earned
        
        db.session.commit()
        
        # Return sale with payment info
        sale_dict = sale.to_dict()
        sale_dict['payment'] = payment.to_dict()
        sale_dict['receipt_number'] = receipt_number
        
        return jsonify(sale_dict), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in complete_sale: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'error': 'Failed to complete sale',
            'message': str(e) if current_app.debug else 'An error occurred while completing the sale'
        }), 500


@bp_sales.route('/sales/<int:id>', methods=['GET'])
def get_sale(id):
    """Get sale details"""
    sale = Sale.query.get_or_404(id)
    sale_dict = sale.to_dict()
    sale_dict['services'] = [ss.to_dict() for ss in sale.sale_services]
    sale_dict['products'] = [sp.to_dict() for sp in sale.sale_products]
    if sale.payment:
        sale_dict['payment'] = sale.payment.to_dict()
    return jsonify(sale_dict)


@bp_sales.route('/sales/<int:id>/receipt', methods=['GET'])
def download_receipt_pdf(id):
    """Download sales receipt as PDF"""
    sale = Sale.query.options(
        joinedload(Sale.staff),
        joinedload(Sale.customer),
        joinedload(Sale.payment),
        joinedload(Sale.sale_services).joinedload(SaleService.service),
        joinedload(Sale.sale_products).joinedload(SaleProduct.product)
    ).get_or_404(id)
    
    # Generate PDF
    pdf_buffer = generate_sales_receipt_pdf(
        sale=sale,
        staff=sale.staff,
        customer=sale.customer,
        payment=sale.payment
    )
    
    # Generate filename
    receipt_number = sale.payment.receipt_number if sale.payment and sale.payment.receipt_number else sale.sale_number
    filename = f"receipt_{receipt_number.replace(' ', '_')}.pdf"
    
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )


@bp_sales.route('/sales', methods=['GET'])
def get_sales():
    """Get all sales with optional filters"""
    staff_id = request.args.get('staff_id', type=int)
    status = request.args.get('status')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = request.args.get('limit', type=int, default=100)
    
    query = Sale.query
    
    if staff_id:
        query = query.filter(Sale.staff_id == staff_id)
        staff = Staff.query.get(staff_id)
        demo_filter = get_demo_filter(staff, request)
    else:
        demo_filter = get_demo_filter(None, request)
    
    # Apply demo filter
    query = query.filter(Sale.is_demo == demo_filter['is_demo'])
    
    if status:
        query = query.filter(Sale.status == status)
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= datetime.fromisoformat(start_date).date())
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= datetime.fromisoformat(end_date).date())
    
    sales = query.order_by(Sale.created_at.desc()).limit(limit).all()
    
    # Include payment information in response
    result = []
    for sale in sales:
        sale_dict = sale.to_dict()
        # Add payment information if available
        if sale.payment:
            sale_dict['payment_method'] = sale.payment.payment_method
            sale_dict['receipt_number'] = sale.payment.receipt_number
        # Add computed fields for frontend compatibility
        sale_dict['grand_total'] = sale.total_amount
        sale_dict['commission'] = sale.commission_amount
        sale_dict['client_name'] = sale.customer_name
        sale_dict['time'] = sale.created_at.strftime('%H:%M') if sale.created_at else ''
        result.append(sale_dict)
    
    return jsonify(result)
