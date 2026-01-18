from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import Customer, Service, Staff, Appointment, AppointmentService, Payment
from db import db
from datetime import datetime
import re

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
        role=data.get('role'),
        pin=data.get('pin')  # PIN is optional, must be set separately if needed
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

# Staff authentication
@bp.route('/staff/login', methods=['POST'])
def staff_login():
    # #region agent log
    import json
    import os
    try:
        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({"id":"log_staff_login_entry","timestamp":int(__import__('time').time()*1000),"location":"routes.py:137","message":"Staff login endpoint called","data":{"method":request.method},"sessionId":"debug-session","runId":"run1","hypothesisId":"A,B,C,D"}) + '\n')
    except: pass
    # #endregion
    data = request.get_json()
    staff_id = data.get('staff_id')
    pin = data.get('pin')
    
    # #region agent log
    try:
        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({"id":"log_staff_login_data","timestamp":int(__import__('time').time()*1000),"location":"routes.py:142","message":"Received login data","data":{"staff_id":str(staff_id) if staff_id else None,"pin_length":len(pin) if pin else 0,"pin_preview":pin[:1]+"***" if pin and len(pin)>1 else None},"sessionId":"debug-session","runId":"run1","hypothesisId":"A,B,C,D"}) + '\n')
    except: pass
    # #endregion
    
    # Validate required fields
    if not staff_id:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:145","message":"Validation failed: Staff ID missing","data":{},"sessionId":"debug-session","runId":"run1","hypothesisId":"D"}) + '\n')
        except: pass
        # #endregion
        return jsonify({'success': False, 'error': 'Staff ID is required'}), 400
    
    if not pin:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:149","message":"Validation failed: PIN missing","data":{},"sessionId":"debug-session","runId":"run1","hypothesisId":"B"}) + '\n')
        except: pass
        # #endregion
        return jsonify({'success': False, 'error': 'PIN is required'}), 400
    
    # Validate PIN format: 5 characters, at least one digit and one special character
    if len(pin) != 5:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:153","message":"Validation failed: PIN length incorrect","data":{"pin_length":len(pin)},"sessionId":"debug-session","runId":"run1","hypothesisId":"B"}) + '\n')
        except: pass
        # #endregion
        return jsonify({'success': False, 'error': 'PIN must be exactly 5 characters'}), 400
    
    # Check if PIN contains at least one digit and one special character
    has_digit = bool(re.search(r'\d', pin))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
    
    # #region agent log
    try:
        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({"id":"log_staff_login_pin_check","timestamp":int(__import__('time').time()*1000),"location":"routes.py:157","message":"PIN format validation","data":{"has_digit":has_digit,"has_special":has_special},"sessionId":"debug-session","runId":"run1","hypothesisId":"B"}) + '\n')
    except: pass
    # #endregion
    
    if not (has_digit and has_special):
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:160","message":"Validation failed: PIN format invalid","data":{"has_digit":has_digit,"has_special":has_special},"sessionId":"debug-session","runId":"run1","hypothesisId":"B"}) + '\n')
        except: pass
        # #endregion
        return jsonify({'success': False, 'error': 'PIN must contain at least one digit and one special character'}), 400
    
    # Convert staff_id to integer if it's numeric
    try:
        staff_id_int = int(staff_id)
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_id_convert","timestamp":int(__import__('time').time()*1000),"location":"routes.py:165","message":"Staff ID converted to int","data":{"staff_id_original":str(staff_id),"staff_id_int":staff_id_int},"sessionId":"debug-session","runId":"run1","hypothesisId":"D"}) + '\n')
        except: pass
        # #endregion
    except (ValueError, TypeError) as e:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:167","message":"Validation failed: Staff ID conversion error","data":{"error":str(e)},"sessionId":"debug-session","runId":"run1","hypothesisId":"D"}) + '\n')
        except: pass
        # #endregion
        return jsonify({'success': False, 'error': 'Invalid Staff ID format'}), 400
    
    # Lookup staff by BOTH ID and PIN - both must match the same staff member
    # In production, compare hashed PIN using bcrypt or similar
    # #region agent log
    try:
        all_staff_count = Staff.query.count()
        staff_by_id = Staff.query.filter(Staff.id == staff_id_int).first()
        staff_by_id_pin = Staff.query.filter(Staff.id == staff_id_int, Staff.pin == pin).first()
        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({"id":"log_staff_login_db_check","timestamp":int(__import__('time').time()*1000),"location":"routes.py:171","message":"Database lookup before query","data":{"total_staff_count":all_staff_count,"staff_by_id_exists":staff_by_id is not None,"staff_by_id_pin_exists":staff_by_id_pin is not None,"staff_id_searched":staff_id_int},"sessionId":"debug-session","runId":"run1","hypothesisId":"A,E"}) + '\n')
    except Exception as db_err:
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_db_error","timestamp":int(__import__('time').time()*1000),"location":"routes.py:171","message":"Database error during lookup","data":{"error":str(db_err)},"sessionId":"debug-session","runId":"run1","hypothesisId":"E"}) + '\n')
        except: pass
    # #endregion
    
    staff = Staff.query.filter(
        Staff.id == staff_id_int,
        Staff.pin == pin
    ).first()
    
    if staff:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_success","timestamp":int(__import__('time').time()*1000),"location":"routes.py:175","message":"Staff login successful","data":{"staff_id":staff.id,"staff_name":staff.name,"staff_role":staff.role},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
        except: pass
        # #endregion
        # Return staff data without PIN for security
        staff_dict = staff.to_dict()
        staff_dict.pop('pin', None)  # Don't send PIN back to client
        return jsonify({
            'success': True,
            'staff': staff_dict
        }), 200
    else:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_staff_login_failed","timestamp":int(__import__('time').time()*1000),"location":"routes.py:184","message":"Staff login failed: no match found","data":{"staff_id_searched":staff_id_int},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
        except: pass
        # #endregion
        # Return generic error (don't reveal if Staff ID exists but PIN is wrong, or vice versa)
        return jsonify({
            'success': False,
            'error': 'Invalid Staff ID or PIN'
        }), 401

# Staff statistics endpoint
@bp.route('/staff/<int:id>/stats', methods=['GET'])
def get_staff_stats(id):
    staff = Staff.query.get_or_404(id)
    today = datetime.now().date()
    
    # Get today's appointments for this staff
    today_appointments = Appointment.query.filter(
        Appointment.staff_id == id,
        func.date(Appointment.appointment_date) == today
    ).all()
    
    # Get today's completed appointments
    completed_today = [apt for apt in today_appointments if apt.status == 'completed']
    clients_served_today = len(completed_today)
    
    # Calculate revenue and commission from completed appointments
    revenue_today = 0
    commission_today = 0
    default_commission_rate = 0.50  # 50% commission rate
    
    for appointment in completed_today:
        # Calculate total from appointment services
        appointment_total = 0
        for apt_service in appointment.services:
            if apt_service.service:
                appointment_total += apt_service.service.price
        
        revenue_today += appointment_total
        commission_today += appointment_total * default_commission_rate
    
    # Count transactions (payments) for today
    payments_today = Payment.query.filter(
        Payment.appointment_id.in_([apt.id for apt in today_appointments])
    ).count()
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'clients_served_today': clients_served_today,
        'transactions_today': payments_today,
        'revenue_today': round(revenue_today, 2),
        'commission_today': round(commission_today, 2)
    }), 200

# Staff commission history endpoint
@bp.route('/staff/<int:id>/commission-history', methods=['GET'])
def get_staff_commission_history(id):
    staff = Staff.query.get_or_404(id)
    
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    payment_method = request.args.get('payment_method')
    
    # Get all completed appointments for this staff
    query = Appointment.query.filter(
        Appointment.staff_id == id,
        Appointment.status == 'completed'
    )
    
    # Apply date filters
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(Appointment.appointment_date >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(Appointment.appointment_date <= end_dt)
    
    appointments = query.order_by(Appointment.appointment_date.desc()).all()
    
    # Filter by payment method if specified
    if payment_method:
        payment_ids = [p.appointment_id for p in Payment.query.filter_by(payment_method=payment_method).all()]
        appointments = [apt for apt in appointments if apt.id in payment_ids]
    
    # Build commission history
    history = []
    default_commission_rate = 0.50  # 50% commission rate
    
    for appointment in appointments:
        # Get payment for this appointment
        payment = Payment.query.filter_by(appointment_id=appointment.id).first()
        
        # Calculate commission from services
        appointment_total = 0
        services_list = []
        
        for apt_service in appointment.services:
            if apt_service.service:
                service_price = apt_service.service.price
                appointment_total += service_price
                services_list.append({
                    'name': apt_service.service.name,
                    'price': service_price
                })
        
        commission_amount = appointment_total * default_commission_rate
        
        history.append({
            'id': appointment.id,
            'date': appointment.appointment_date.strftime('%Y-%m-%d') if appointment.appointment_date else None,
            'time': appointment.appointment_date.strftime('%H:%M') if appointment.appointment_date else None,
            'datetime': appointment.appointment_date.isoformat() if appointment.appointment_date else None,
            'client_name': appointment.customer.name if appointment.customer else 'Walk-in',
            'client_phone': appointment.customer.phone if appointment.customer else None,
            'services': services_list,
            'total_amount': round(appointment_total, 2),
            'tax': round(appointment_total * 0.08, 2),
            'grand_total': round(appointment_total * 1.08, 2),
            'commission': round(commission_amount, 2),
            'payment_method': payment.payment_method if payment else None,
            'payment_status': payment.status if payment else None,
            'receipt_number': f"RCP-{appointment.id:06d}"
        })
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'transactions': history,
        'total_count': len(history),
        'total_commission': round(sum(t['commission'] for t in history), 2)
    }), 200

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

