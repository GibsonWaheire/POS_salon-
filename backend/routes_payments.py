"""
Payment routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Payment, Sale
from db import db
from utils import get_demo_filter
from sqlalchemy.orm import joinedload

bp_payments = Blueprint('payments', __name__)


@bp_payments.route('/payments', methods=['GET'])
def get_payments():
    """Get all payments - only sale-based payments"""
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    
    # Filter payments by sale's demo status (since Payment doesn't have is_demo field)
    payments = Payment.query.join(Sale).filter(
        Payment.sale_id.isnot(None),
        Sale.is_demo == demo_filter['is_demo']
    ).options(
        joinedload(Payment.sale).joinedload(Sale.staff),
        joinedload(Payment.sale).joinedload(Sale.customer),
        joinedload(Payment.sale).joinedload(Sale.sale_services),
        joinedload(Payment.sale).joinedload(Sale.sale_products)
    ).order_by(Payment.created_at.desc()).all()
    
    # Include sale and staff information
    result = []
    for payment in payments:
        payment_dict = payment.to_dict()
        # Access sale through relationship (backref from Sale model)
        if hasattr(payment, 'sale') and payment.sale:
            sale = payment.sale
            payment_dict['sale'] = {
                'id': sale.id,
                'sale_number': sale.sale_number,
                'customer_name': sale.customer_name or (sale.customer.name if sale.customer else 'Walk-in'),
                'staff_name': sale.staff.name if sale.staff else None,
                'sale_services': [ss.to_dict() for ss in sale.sale_services],
                'sale_products': [sp.to_dict() for sp in sale.sale_products]
            }
        else:
            # Fallback: query sale directly if relationship not loaded
            sale = Sale.query.get(payment.sale_id) if payment.sale_id else None
            if sale:
                payment_dict['sale'] = {
                    'id': sale.id,
                    'sale_number': sale.sale_number,
                    'customer_name': sale.customer_name or (sale.customer.name if sale.customer else 'Walk-in'),
                    'staff_name': sale.staff.name if sale.staff else None,
                    'sale_services': [ss.to_dict() for ss in sale.sale_services],
                    'sale_products': [sp.to_dict() for sp in sale.sale_products]
                }
        result.append(payment_dict)
    
    return jsonify(result)


@bp_payments.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    payment = Payment(
        appointment_id=data.get('appointment_id'),
        amount=data.get('amount'),
        payment_method=data.get('payment_method'),
        status=data.get('status', 'pending'),
        transaction_code=data.get('transaction_code'),
        receipt_number=data.get('receipt_number')
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.to_dict()), 201


@bp_payments.route('/payments/<int:id>', methods=['GET'])
def get_payment(id):
    payment = Payment.query.get_or_404(id)
    return jsonify(payment.to_dict())


@bp_payments.route('/payments/<int:id>', methods=['PUT'])
def update_payment(id):
    payment = Payment.query.get_or_404(id)
    data = request.get_json()
    payment.amount = data.get('amount', payment.amount)
    payment.payment_method = data.get('payment_method', payment.payment_method)
    payment.status = data.get('status', payment.status)
    payment.transaction_code = data.get('transaction_code', payment.transaction_code)
    payment.receipt_number = data.get('receipt_number', payment.receipt_number)
    db.session.commit()
    return jsonify(payment.to_dict())
