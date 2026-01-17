from flask import Blueprint, request, jsonify
from models import Customer, Service, Staff, Appointment, AppointmentService, Payment
from db import db
from datetime import datetime

bp = Blueprint('api', __name__, url_prefix='/api')

# Customer routes
@bp.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers])

@bp.route('/customers', methods=['POST'])
def create_customer():
    data = request.get_json()
    customer = Customer(
        name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email')
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify(customer.to_dict()), 201

@bp.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.to_dict())

@bp.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.email = data.get('email', customer.email)
    db.session.commit()
    return jsonify(customer.to_dict())

@bp.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Customer deleted'}), 200

# Service routes
@bp.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.to_dict() for service in services])

@bp.route('/services', methods=['POST'])
def create_service():
    data = request.get_json()
    service = Service(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        duration=data.get('duration')
    )
    db.session.add(service)
    db.session.commit()
    return jsonify(service.to_dict()), 201

@bp.route('/services/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get_or_404(id)
    return jsonify(service.to_dict())

@bp.route('/services/<int:id>', methods=['PUT'])
def update_service(id):
    service = Service.query.get_or_404(id)
    data = request.get_json()
    service.name = data.get('name', service.name)
    service.description = data.get('description', service.description)
    service.price = data.get('price', service.price)
    service.duration = data.get('duration', service.duration)
    db.session.commit()
    return jsonify(service.to_dict())

@bp.route('/services/<int:id>', methods=['DELETE'])
def delete_service(id):
    service = Service.query.get_or_404(id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service deleted'}), 200

# Staff routes
@bp.route('/staff', methods=['GET'])
def get_staff():
    staff_list = Staff.query.all()
    return jsonify([staff.to_dict() for staff in staff_list])

@bp.route('/staff', methods=['POST'])
def create_staff():
    data = request.get_json()
    staff = Staff(
        name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email'),
        role=data.get('role')
    )
    db.session.add(staff)
    db.session.commit()
    return jsonify(staff.to_dict()), 201

@bp.route('/staff/<int:id>', methods=['GET'])
def get_staff_member(id):
    staff = Staff.query.get_or_404(id)
    return jsonify(staff.to_dict())

@bp.route('/staff/<int:id>', methods=['PUT'])
def update_staff(id):
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    staff.name = data.get('name', staff.name)
    staff.phone = data.get('phone', staff.phone)
    staff.email = data.get('email', staff.email)
    staff.role = data.get('role', staff.role)
    db.session.commit()
    return jsonify(staff.to_dict())

@bp.route('/staff/<int:id>', methods=['DELETE'])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff member deleted'}), 200

# Appointment routes
@bp.route('/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([appointment.to_dict() for appointment in appointments])

@bp.route('/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    appointment = Appointment(
        customer_id=data.get('customer_id'),
        staff_id=data.get('staff_id'),
        appointment_date=datetime.fromisoformat(data.get('appointment_date')) if data.get('appointment_date') else None,
        status=data.get('status', 'scheduled'),
        notes=data.get('notes')
    )
    db.session.add(appointment)
    db.session.flush()
    
    # Add services to appointment
    service_ids = data.get('service_ids', [])
    for service_id in service_ids:
        appointment_service = AppointmentService(
            appointment_id=appointment.id,
            service_id=service_id
        )
        db.session.add(appointment_service)
    
    db.session.commit()
    return jsonify(appointment.to_dict()), 201

@bp.route('/appointments/<int:id>', methods=['GET'])
def get_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    return jsonify(appointment.to_dict())

@bp.route('/appointments/<int:id>', methods=['PUT'])
def update_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    data = request.get_json()
    appointment.customer_id = data.get('customer_id', appointment.customer_id)
    appointment.staff_id = data.get('staff_id', appointment.staff_id)
    if data.get('appointment_date'):
        appointment.appointment_date = datetime.fromisoformat(data.get('appointment_date'))
    appointment.status = data.get('status', appointment.status)
    appointment.notes = data.get('notes', appointment.notes)
    db.session.commit()
    return jsonify(appointment.to_dict())

@bp.route('/appointments/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({'message': 'Appointment deleted'}), 200

# Payment routes
@bp.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify([payment.to_dict() for payment in payments])

@bp.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    payment = Payment(
        appointment_id=data.get('appointment_id'),
        amount=data.get('amount'),
        payment_method=data.get('payment_method'),
        status=data.get('status', 'pending')
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.to_dict()), 201

@bp.route('/payments/<int:id>', methods=['GET'])
def get_payment(id):
    payment = Payment.query.get_or_404(id)
    return jsonify(payment.to_dict())

@bp.route('/payments/<int:id>', methods=['PUT'])
def update_payment(id):
    payment = Payment.query.get_or_404(id)
    data = request.get_json()
    payment.amount = data.get('amount', payment.amount)
    payment.payment_method = data.get('payment_method', payment.payment_method)
    payment.status = data.get('status', payment.status)
    db.session.commit()
    return jsonify(payment.to_dict())

