"""
Commission routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, send_file, current_app
from models import CommissionPayment, CommissionPaymentItem, Staff, Sale, SaleService, User
from db import db
from sqlalchemy import func, and_, or_
from datetime import datetime, date
from utils import get_demo_filter, get_current_week_range, parse_date, calculate_gross_pay, calculate_total_deductions, calculate_net_pay
from validators import validate_mpesa_code, validate_date_format
from pdf_generators import generate_commission_receipt_pdf

bp_commissions = Blueprint('commissions', __name__)


@bp_commissions.route('/commissions/pending', methods=['GET'])
def get_pending_commissions():
    """Get unpaid commissions by staff"""
    try:
        demo_filter = get_demo_filter(None, request)
        
        # Get date range from query params (default to all time)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Query completed sales
        query = Sale.query.filter(
            Sale.status == 'completed',
            Sale.is_demo == demo_filter['is_demo']
        )
        
        if start_date:
            is_valid, parsed_date, error = validate_date_format(start_date)
            if not is_valid:
                return jsonify({'error': error}), 400
            query = query.filter(func.date(Sale.created_at) >= parsed_date)
        
        if end_date:
            is_valid, parsed_date, error = validate_date_format(end_date)
            if not is_valid:
                return jsonify({'error': error}), 400
            query = query.filter(func.date(Sale.created_at) <= parsed_date)
        
        sales = query.all()
        
        # Group by staff and calculate totals
        staff_commissions = {}
        for sale in sales:
            if sale.staff_id not in staff_commissions:
                staff = Staff.query.get(sale.staff_id)
                staff_commissions[sale.staff_id] = {
                    'staff_id': sale.staff_id,
                    'staff_name': staff.name if staff else f'Staff {sale.staff_id}',
                    'total_sales': 0,
                    'total_commission': 0,
                    'transaction_count': 0
                }
            
            staff_commissions[sale.staff_id]['total_sales'] += sale.subtotal
            staff_commissions[sale.staff_id]['total_commission'] += sale.commission_amount
            staff_commissions[sale.staff_id]['transaction_count'] += 1
        
        # Subtract already paid commissions
        for staff_id in staff_commissions:
            paid_amount = db.session.query(func.sum(CommissionPayment.amount_paid)).filter(
                CommissionPayment.staff_id == staff_id,
                CommissionPayment.is_demo == demo_filter['is_demo']
            ).scalar() or 0
            
            staff_commissions[staff_id]['paid_amount'] = round(paid_amount, 2)
            staff_commissions[staff_id]['pending_amount'] = round(
                staff_commissions[staff_id]['total_commission'] - paid_amount, 2
            )
            staff_commissions[staff_id]['total_sales'] = round(staff_commissions[staff_id]['total_sales'], 2)
            staff_commissions[staff_id]['total_commission'] = round(staff_commissions[staff_id]['total_commission'], 2)
        
        # Filter out staff with zero pending
        pending_commissions = [
            {**comm, 'pending_amount': comm['pending_amount']}
            for comm in staff_commissions.values()
            if comm['pending_amount'] > 0
        ]
        
        return jsonify({
            'pending_commissions': pending_commissions,
            'total_pending': round(sum(c['pending_amount'] for c in pending_commissions), 2)
        }), 200
        
    except Exception as e:
        import traceback
        print(f"Error in get_pending_commissions: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_commissions.route('/commissions/payments', methods=['GET'])
def get_commission_payments():
    """Get all commission payments"""
    try:
        demo_filter = get_demo_filter(None, request)
        staff_id = request.args.get('staff_id', type=int)
        
        query = CommissionPayment.query.filter(
            CommissionPayment.is_demo == demo_filter['is_demo']
        )
        
        if staff_id:
            query = query.filter(CommissionPayment.staff_id == staff_id)
        
        payments = query.order_by(CommissionPayment.payment_date.desc()).all()
        
        return jsonify([payment.to_dict() for payment in payments]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp_commissions.route('/commissions/pay', methods=['POST'])
def create_commission_payment():
    """Create a professional commission payment with earnings and deductions"""
    try:
        data = request.get_json()
        
        staff_id = data.get('staff_id')
        period_start = data.get('period_start')
        period_end = data.get('period_end')
        payment_method = data.get('payment_method')
        transaction_reference = data.get('transaction_reference')
        notes = data.get('notes')
        paid_by = data.get('paid_by')  # User ID who made the payment
        
        # Validate required fields
        if not staff_id:
            return jsonify({'error': 'Staff ID is required'}), 400
        
        # Check if staff exists
        staff = Staff.query.get(staff_id)
        if not staff:
            return jsonify({'error': 'Staff not found'}), 404
        
        # Get demo status from staff
        is_demo = staff.is_demo if hasattr(staff, 'is_demo') else False
        
        # Default period to Monday-Sunday of current week if not provided
        if not period_start or not period_end:
            monday, sunday = get_current_week_range()
            period_start_date = monday
            period_end_date = sunday
        else:
            is_valid, period_start_date, error = validate_date_format(period_start)
            if not is_valid:
                return jsonify({'error': error}), 400
            
            is_valid, period_end_date, error = validate_date_format(period_end)
            if not is_valid:
                return jsonify({'error': error}), 400
        
        # Get base pay (from request or staff default)
        base_pay_override = data.get('base_pay')
        base_pay = base_pay_override if base_pay_override is not None else staff.base_pay
        
        # Get earnings and deductions arrays
        earnings_data = data.get('earnings', [])
        deductions_data = data.get('deductions', [])
        auto_populate_commissions = data.get('auto_populate_commissions', True)
        
        # Auto-populate commission items from sales if requested
        if auto_populate_commissions:
            # Query completed sales for this staff in the period
            # Use completed_at if available, otherwise use created_at
            date_filter = or_(
                and_(
                    Sale.completed_at.isnot(None),
                    func.date(Sale.completed_at) >= period_start_date,
                    func.date(Sale.completed_at) <= period_end_date
                ),
                and_(
                    Sale.completed_at.is_(None),
                    func.date(Sale.created_at) >= period_start_date,
                    func.date(Sale.created_at) <= period_end_date
                )
            )
            
            sales = Sale.query.filter(
                Sale.staff_id == staff_id,
                Sale.status == 'completed',
                Sale.is_demo == is_demo,
                date_filter
            ).all()
            
            # Create commission items for each sale/service
            commission_items_added = False
            for sale in sales:
                for sale_service in sale.sale_services:
                    if sale_service.commission_amount and sale_service.commission_amount > 0:
                        service_name = sale_service.service.name if sale_service.service else f"Service #{sale_service.service_id}"
                        commission_item = {
                            'item_name': f"Commission - {service_name}",
                            'amount': sale_service.commission_amount,
                            'is_percentage': False,
                            'sale_id': sale.id,
                            'sale_service_id': sale_service.id,
                            'service_name': service_name,
                            'sale_number': sale.sale_number
                        }
                        earnings_data.append(commission_item)
                        commission_items_added = True
        
        # Generate receipt number
        receipt_number = data.get('receipt_number') or f"COMM-{datetime.now().strftime('%Y%m%d')}-{CommissionPayment.query.count() + 1:04d}"
        
        # Validate M-Pesa transaction reference format if provided
        if payment_method and payment_method.lower() in ['m_pesa', 'm-pesa', 'mpesa'] and transaction_reference:
            is_valid, error, normalized_code = validate_mpesa_code(transaction_reference)
            if not is_valid:
                return jsonify({'error': error}), 400
            transaction_reference = normalized_code
        
        # Create commission payment (without calculated fields first)
        payment = CommissionPayment(
            staff_id=staff_id,
            amount_paid=0.0,  # Temporary value, will be updated after calculations
            base_pay=base_pay,
            payment_date=datetime.utcnow(),
            period_start=period_start_date,
            period_end=period_end_date,
            payment_method=payment_method.lower().replace("-", "_") if payment_method else None,
            transaction_reference=transaction_reference,
            receipt_number=receipt_number,
            paid_by=paid_by,
            notes=notes,
            is_demo=is_demo
        )
        
        db.session.add(payment)
        db.session.flush()  # Get payment.id
        
        # Create earnings items
        earnings_items = []
        display_order = 0
        for earning in earnings_data:
            item = CommissionPaymentItem(
                commission_payment_id=payment.id,
                item_type='earning',
                item_name=earning.get('item_name', 'Earning'),
                amount=float(earning.get('amount', 0)),
                is_percentage=earning.get('is_percentage', False),
                percentage_of=earning.get('percentage_of'),
                display_order=display_order,
                notes=earning.get('notes'),
                sale_id=earning.get('sale_id'),
                sale_service_id=earning.get('sale_service_id'),
                service_name=earning.get('service_name'),
                sale_number=earning.get('sale_number')
            )
            earnings_items.append(item)
            db.session.add(item)
            display_order += 1
        
        # Create deductions items
        deductions_items = []
        display_order = 0
        for deduction in deductions_data:
            item = CommissionPaymentItem(
                commission_payment_id=payment.id,
                item_type='deduction',
                item_name=deduction.get('item_name', 'Deduction'),
                amount=float(deduction.get('amount', 0)),
                is_percentage=deduction.get('is_percentage', False),
                percentage_of=deduction.get('percentage_of'),
                display_order=display_order,
                notes=deduction.get('notes')
            )
            deductions_items.append(item)
            db.session.add(item)
            display_order += 1
        
        # Calculate gross pay, total deductions, and net pay
        gross_pay = calculate_gross_pay(earnings_items)
        total_deductions = calculate_total_deductions(deductions_items, gross_pay=gross_pay, base_pay=base_pay)
        net_pay = calculate_net_pay(gross_pay, total_deductions)
        
        # Ensure net_pay is never None
        if net_pay is None:
            net_pay = 0.0
        
        # Update payment with calculated values
        payment.gross_pay = gross_pay
        payment.total_deductions = total_deductions
        payment.net_pay = net_pay
        payment.amount_paid = net_pay  # For backward compatibility
        
        db.session.commit()
        
        return jsonify(payment.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in create_commission_payment: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_commissions.route('/commissions/payments/<int:id>/receipt', methods=['GET'])
def get_commission_payment_receipt(id):
    """Generate PDF receipt for commission payment"""
    try:
        payment = CommissionPayment.query.get_or_404(id)
        staff = Staff.query.get(payment.staff_id)
        payer = User.query.get(payment.paid_by) if payment.paid_by else None
        
        # Generate PDF buffer
        pdf_buffer = generate_commission_receipt_pdf(payment, staff, payer)
        
        # Return PDF
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'commission_receipt_{payment.receipt_number}.pdf'
        )
        
    except Exception as e:
        import traceback
        print(f"Error generating PDF receipt: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
