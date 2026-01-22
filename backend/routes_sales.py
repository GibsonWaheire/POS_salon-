# Sale routes to be added to routes.py
# ============================================================================
# SALE ROUTES - Kenyan Salon Walk-in Transaction Flow (No Appointments)
# ============================================================================

@bp.route('/sales', methods=['POST'])
def create_sale():
    """Create a new sale (walk-in transaction)"""
    data = request.get_json()
    staff_id = data.get('staff_id')
    
    if not staff_id:
        return jsonify({'error': 'Staff ID is required'}), 400
    
    # Generate unique sale number: SALE-YYYYMMDD-XXX
    today = datetime.now().strftime('%Y%m%d')
    # Get count of sales today to generate sequence number
    today_sales_count = Sale.query.filter(
        func.date(Sale.created_at) == date.today()
    ).count()
    sale_number = f"SALE-{today}-{today_sales_count + 1:03d}"
    
    # Create or get customer if name/phone provided
    customer_id = None
    if data.get('customer_name') or data.get('customer_phone'):
        # Try to find existing customer by phone
        if data.get('customer_phone'):
            existing_customer = Customer.query.filter_by(phone=data.get('customer_phone')).first()
            if existing_customer:
                customer_id = existing_customer.id
            else:
                # Create new customer
                new_customer = Customer(
                    name=data.get('customer_name') or "Walk-in Customer",
                    phone=data.get('customer_phone'),
                    email=data.get('customer_email')
                )
                db.session.add(new_customer)
                db.session.flush()
                customer_id = new_customer.id
    
    # Create sale
    sale = Sale(
        sale_number=sale_number,
        staff_id=staff_id,
        customer_id=customer_id,
        customer_name=data.get('customer_name'),
        customer_phone=data.get('customer_phone'),
        status='pending',
        notes=data.get('notes')
    )
    db.session.add(sale)
    db.session.flush()
    
    # Add services to sale
    services = data.get('services', [])
    for service_data in services:
        service_id = service_data.get('service_id') or service_data.get('id')
        quantity = service_data.get('quantity', 1)
        
        service = Service.query.get(service_id)
        if service:
            unit_price = service.price
            total_price = unit_price * quantity
            commission_rate = service_data.get('commission_rate', 0.50)
            commission_amount = total_price * commission_rate
            
            sale_service = SaleService(
                sale_id=sale.id,
                service_id=service_id,
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
                stock_deducted=False  # Stock will be deducted on completion
            )
            db.session.add(sale_product)
    
    # Calculate totals
    subtotal = sum(ss.total_price for ss in sale.sale_services) + sum(sp.total_price for sp in sale.sale_products)
    tax_amount = subtotal * 0.16  # 16% VAT
    total_amount = subtotal + tax_amount
    commission_amount = sum(ss.commission_amount for ss in sale.sale_services)
    
    sale.subtotal = subtotal
    sale.tax_amount = tax_amount
    sale.total_amount = total_amount
    sale.commission_amount = commission_amount
    
    db.session.commit()
    
    return jsonify(sale.to_dict()), 201

@bp.route('/sales/<int:id>/complete', methods=['POST'])
def complete_sale(id):
    """Complete a sale - deduct stock, finalize commission, create payment"""
    sale = Sale.query.get_or_404(id)
    data = request.get_json()
    
    if sale.status == 'completed':
        return jsonify({'error': 'Sale already completed'}), 400
    
    payment_method = data.get('payment_method')
    transaction_code = data.get('transaction_code')  # For M-Pesa
    
    if not payment_method:
        return jsonify({'error': 'Payment method is required'}), 400
    
    try:
        # STEP 1: Deduct product stock
        for sale_product in sale.sale_products:
            if not sale_product.stock_deducted:
                product = sale_product.product
                if product.stock_quantity < sale_product.quantity:
                    return jsonify({
                        'error': f'Insufficient stock for {product.name}. Available: {product.stock_quantity}, Required: {sale_product.quantity}'
                    }), 400
                
                product.stock_quantity -= sale_product.quantity
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
            appointment_id=None,  # Explicitly set to None for sale-based payments
            amount=sale.total_amount,
            payment_method=payment_method.lower().replace("-", "_"),
            status='completed',
            transaction_code=transaction_code,
            receipt_number=receipt_number
        )
        db.session.add(payment)
        
        # STEP 4: Mark sale as completed and finalize commission
        sale.status = 'completed'
        sale.completed_at = datetime.utcnow()
        # Commission is already calculated and stored in sale.commission_amount
        
        # STEP 5: Update customer stats if customer exists
        if sale.customer_id:
            customer = sale.customer
            customer.total_visits += 1
            customer.total_spent += sale.total_amount
            customer.last_visit = datetime.utcnow()
        
        db.session.commit()
        
        # Return sale with payment info
        sale_dict = sale.to_dict()
        sale_dict['payment'] = payment.to_dict()
        sale_dict['receipt_number'] = receipt_number
        
        return jsonify(sale_dict), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/sales/<int:id>', methods=['GET'])
def get_sale(id):
    """Get sale details"""
    sale = Sale.query.get_or_404(id)
    sale_dict = sale.to_dict()
    sale_dict['services'] = [ss.to_dict() for ss in sale.sale_services]
    sale_dict['products'] = [sp.to_dict() for sp in sale.sale_products]
    if sale.payment:
        sale_dict['payment'] = sale.payment.to_dict()
    return jsonify(sale_dict)

@bp.route('/sales', methods=['GET'])
def get_sales():
    """Get all sales with optional filters"""
    staff_id = request.args.get('staff_id', type=int)
    status = request.args.get('status')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Sale.query
    
    if staff_id:
        query = query.filter(Sale.staff_id == staff_id)
    if status:
        query = query.filter(Sale.status == status)
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= datetime.fromisoformat(start_date).date())
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= datetime.fromisoformat(end_date).date())
    
    sales = query.order_by(Sale.created_at.desc()).limit(100).all()
    return jsonify([sale.to_dict() for sale in sales])
