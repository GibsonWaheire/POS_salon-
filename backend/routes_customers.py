"""
Customer routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Customer, Staff
from db import db
from utils import get_demo_filter

bp_customers = Blueprint('customers', __name__)


@bp_customers.route('/customers', methods=['GET'])
def get_customers():
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    customers = Customer.query.filter(Customer.is_demo == demo_filter['is_demo']).all()
    return jsonify([customer.to_dict() for customer in customers])


@bp_customers.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        # Get demo filter - check if staff_id provided or use request parameter
        staff_id = data.get('staff_id')
        is_demo = False
        if staff_id:
            staff = Staff.query.get(staff_id)
            if staff and hasattr(staff, 'is_demo') and staff.is_demo:
                is_demo = True
        else:
            # Check request parameter for demo mode
            demo_filter = get_demo_filter(None, request)
            is_demo = demo_filter['is_demo']
        
        # Check if customer with same phone already exists (same demo status)
        if data.get('phone'):
            existing = Customer.query.filter_by(
                phone=data.get('phone'),
                is_demo=is_demo
            ).first()
            if existing:
                return jsonify({'error': 'Customer with this phone number already exists', 'customer': existing.to_dict()}), 200
        
        customer = Customer(
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email'),
            is_demo=is_demo
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@bp_customers.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.to_dict())


@bp_customers.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.email = data.get('email', customer.email)
    db.session.commit()
    return jsonify(customer.to_dict())


@bp_customers.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Customer deleted'}), 200
