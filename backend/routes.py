from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import Customer, Service, Staff, Appointment, AppointmentService, Payment, StaffLoginLog, Product, ProductUsage, Expense, Shift, Sale, SaleService, SaleProduct
from db import db
from datetime import datetime, date, timedelta
import re

bp = Blueprint('api', __name__, url_prefix='/api')

# Customer routes
@bp.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers])

@bp.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        # Check if customer with same phone already exists
        if data.get('phone'):
            existing = Customer.query.filter_by(phone=data.get('phone')).first()
            if existing:
                return jsonify({'error': 'Customer with this phone number already exists', 'customer': existing.to_dict()}), 200
        
        customer = Customer(
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email')
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

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
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    # Validate PIN if provided
    pin = data.get('pin')
    if pin:
        if len(pin) != 5:
            return jsonify({'error': 'PIN must be exactly 5 characters'}), 400
        has_digit = bool(re.search(r'\d', pin))
        has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
        if not (has_digit and has_special):
            return jsonify({'error': 'PIN must contain at least one digit and one special character'}), 400
    
    staff = Staff(
        name=data.get('name'),
        phone=data.get('phone') or None,
        email=data.get('email') or None,
        role=data.get('role', 'stylist'),
        pin=pin or None,
        is_active=data.get('is_active', True)
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
    if 'is_active' in data:
        staff.is_active = data.get('is_active')
    if 'pin' in data and data.get('pin'):
        # Validate PIN format if provided
        pin = data.get('pin')
        if len(pin) != 5:
            return jsonify({'error': 'PIN must be exactly 5 characters'}), 400
        has_digit = bool(re.search(r'\d', pin))
        has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
        if not (has_digit and has_special):
            return jsonify({'error': 'PIN must contain at least one digit and one special character'}), 400
        staff.pin = pin
    db.session.commit()
    return jsonify(staff.to_dict())

@bp.route('/staff/<int:id>', methods=['DELETE'])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff member deleted'}), 200

@bp.route('/staff/<int:id>/login-history', methods=['GET'])
def get_staff_login_history(id):
    """Get login history for a staff member"""
    staff = Staff.query.get_or_404(id)
    
    # Get query parameters for filtering
    limit = request.args.get('limit', type=int, default=50)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = StaffLoginLog.query.filter_by(staff_id=id)
    
    # Apply date filters
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(StaffLoginLog.login_time >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(StaffLoginLog.login_time <= end_dt)
    
    login_logs = query.order_by(StaffLoginLog.login_time.desc()).limit(limit).all()
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'login_history': [log.to_dict() for log in login_logs],
        'total_count': len(login_logs)
    }), 200

@bp.route('/staff/<int:id>/role', methods=['PUT'])
def update_staff_role(id):
    """Update staff role"""
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    
    new_role = data.get('role')
    if not new_role:
        return jsonify({'success': False, 'error': 'Role is required'}), 400
    
    # Validate role (optional - you can add more validation)
    valid_roles = ['manager', 'stylist', 'receptionist', 'nail_technician', 'facial_specialist', 'admin']
    if new_role.lower() not in valid_roles:
        return jsonify({'success': False, 'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    
    staff.role = new_role.lower()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'staff': staff.to_dict()
    }), 200

@bp.route('/staff/<int:id>/performance', methods=['GET'])
def get_staff_performance(id):
    """Get staff sales and commission summary"""
    staff = Staff.query.get_or_404(id)
    
    # Get query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    today_only = request.args.get('today_only', 'false').lower() == 'true'
    
    from datetime import date
    today = date.today()
    
    # Build query
    query = Appointment.query.filter(
        Appointment.staff_id == id,
        Appointment.status == 'completed'
    )
    
    if today_only:
        query = query.filter(func.date(Appointment.appointment_date) == today)
    else:
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Appointment.appointment_date >= start_dt)
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(Appointment.appointment_date <= end_dt)
    
    appointments = query.all()
    
    # Calculate totals
    total_revenue = 0
    total_commission = 0
    transaction_count = 0
    default_commission_rate = 0.50
    
    for appointment in appointments:
        payment = Payment.query.filter_by(appointment_id=appointment.id, status='completed').first()
        if payment:
            appointment_total = 0
            for apt_service in appointment.services:
                if apt_service.service:
                    appointment_total += apt_service.service.price
            
            total_revenue += appointment_total
            total_commission += appointment_total * default_commission_rate
            transaction_count += 1
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'total_revenue': round(total_revenue, 2),
        'total_commission': round(total_commission, 2),
        'transaction_count': transaction_count,
        'period': 'today' if today_only else f'{start_date or "all"} to {end_date or "now"}'
    }), 200

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
        
        # Log login event
        ip_address = request.remote_addr
        login_log = StaffLoginLog(
            staff_id=staff.id,
            login_time=datetime.utcnow(),
            ip_address=ip_address
        )
        db.session.add(login_log)
        
        # Update staff last_login
        staff.last_login = datetime.utcnow()
        
        db.session.commit()
        
        # Return staff data without PIN for security, include login_log_id for logout
        staff_dict = staff.to_dict()
        staff_dict.pop('pin', None)  # Don't send PIN back to client
        return jsonify({
            'success': True,
            'staff': staff_dict,
            'login_log_id': login_log.id  # Include login log ID for logout tracking
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

# Staff logout endpoint
@bp.route('/staff/logout', methods=['POST'])
def staff_logout():
    """Log staff logout event"""
    data = request.get_json()
    login_log_id = data.get('login_log_id')
    staff_id = data.get('staff_id')
    
    if not login_log_id and not staff_id:
        return jsonify({'success': False, 'error': 'login_log_id or staff_id is required'}), 400
    
    try:
        if login_log_id:
            # Find the login log by ID
            login_log = StaffLoginLog.query.filter_by(id=login_log_id, logout_time=None).first()
        else:
            # Find the most recent active login for this staff
            login_log = StaffLoginLog.query.filter_by(
                staff_id=staff_id,
                logout_time=None
            ).order_by(StaffLoginLog.login_time.desc()).first()
        
        if login_log:
            logout_time = datetime.utcnow()
            login_log.logout_time = logout_time
            
            # Calculate session duration in seconds
            if login_log.login_time:
                duration = (logout_time - login_log.login_time).total_seconds()
                login_log.session_duration = int(duration)
            
            db.session.commit()
            return jsonify({'success': True, 'message': 'Logout logged successfully'}), 200
        else:
            return jsonify({'success': False, 'error': 'No active login session found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Staff statistics endpoint
@bp.route('/staff/<int:id>/stats', methods=['GET'])
def get_staff_stats(id):
    staff = Staff.query.get_or_404(id)
    today = datetime.now().date()
    
    # Get today's completed sales (new sale-based flow)
    today_sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) == today,
        Sale.status == 'completed'
    ).all()
    
    # Get today's appointments (backward compatibility)
    today_appointments = Appointment.query.filter(
        Appointment.staff_id == id,
        func.date(Appointment.appointment_date) == today
    ).all()
    completed_appointments = [apt for apt in today_appointments if apt.status == 'completed']
    
    # Calculate from sales (primary)
    clients_served_today = len(today_sales)
    revenue_today = sum(sale.subtotal for sale in today_sales)
    commission_today = sum(sale.commission_amount for sale in today_sales)
    
    # Add appointments data (backward compatibility)
    default_commission_rate = 0.50
    for appointment in completed_appointments:
        appointment_total = 0
        for apt_service in appointment.services:
            if apt_service.service:
                appointment_total += apt_service.service.price
        revenue_today += appointment_total
        commission_today += appointment_total * default_commission_rate
        clients_served_today += 1
    
    # Count transactions for today
    transactions_today = len(today_sales) + len(completed_appointments)
    
    # Calculate weekly commission (last 7 days)
    from datetime import timedelta
    week_start = today - timedelta(days=6)  # Include today, so 6 days back
    
    # Sales (primary)
    week_sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) >= week_start,
        Sale.status == 'completed'
    ).all()
    commission_weekly = sum(sale.commission_amount for sale in week_sales)
    
    # Appointments (backward compatibility)
    week_appointments = Appointment.query.filter(
        Appointment.staff_id == id,
        func.date(Appointment.appointment_date) >= week_start,
        Appointment.status == 'completed'
    ).all()
    for appointment in week_appointments:
        appointment_total = 0
        for apt_service in appointment.services:
            if apt_service.service:
                appointment_total += apt_service.service.price
        commission_weekly += appointment_total * default_commission_rate
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'clients_served_today': clients_served_today,
        'transactions_today': transactions_today,
        'revenue_today': round(revenue_today, 2),
        'commission_today': round(commission_today, 2),
        'commission_weekly': round(commission_weekly, 2)
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

# Dashboard statistics endpoint
@bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics for admin/manager"""
    from datetime import date, timedelta
    
    today = date.today()
    
    # Today's sales revenue (from completed appointments - subtotal before VAT)
    today_appointments = Appointment.query.filter(
        func.date(Appointment.appointment_date) == today,
        Appointment.status == 'completed'
    ).all()
    
    today_revenue = 0
    for appointment in today_appointments:
        appointment_subtotal = 0
        for apt_service in appointment.services:
            if apt_service.service:
                appointment_subtotal += apt_service.service.price
        today_revenue += appointment_subtotal
    
    # Total commission to be paid today (50% of revenue before VAT)
    total_commission = today_revenue * 0.50
    
    # Active staff count (staff with is_active=True)
    active_staff_count = Staff.query.filter(Staff.is_active == True).count()
    total_staff_count = Staff.query.count()
    
    # Staff currently logged in (staff with active login sessions in last 2 hours)
    two_hours_ago = datetime.utcnow() - timedelta(hours=2)
    active_logins = StaffLoginLog.query.filter(
        StaffLoginLog.login_time >= two_hours_ago,
        StaffLoginLog.logout_time.is_(None)
    ).all()
    currently_logged_in = [log.staff_id for log in active_logins]
    active_staff_list = Staff.query.filter(Staff.id.in_(currently_logged_in)).all() if currently_logged_in else []
    
    # Recent transactions (last 10 completed payments)
    recent_payments = Payment.query.join(Appointment).filter(
        Payment.status == 'completed'
    ).order_by(Payment.created_at.desc()).limit(10).all()
    
    recent_transactions = []
    for payment in recent_payments:
        appointment = payment.appointment
        staff = appointment.staff if appointment else None
        # Calculate commission from appointment services (subtotal), not payment amount (which includes VAT)
        appointment_subtotal = 0
        if appointment:
            for apt_service in appointment.services:
                if apt_service.service:
                    appointment_subtotal += apt_service.service.price
        commission = appointment_subtotal * 0.50
        recent_transactions.append({
            'id': payment.id,
            'staff_name': staff.name if staff else 'N/A',
            'staff_id': staff.id if staff else None,
            'amount': round(payment.amount, 2),
            'commission': round(commission, 2),
            'payment_method': payment.payment_method,
            'created_at': payment.created_at.isoformat() if payment.created_at else None,
            'appointment_id': payment.appointment_id
        })
    
    # Staff performance summary (today's sales and commission per staff)
    staff_performance = []
    staff_ids = set([apt.staff_id for apt in Appointment.query.filter(
        func.date(Appointment.appointment_date) == today,
        Appointment.status == 'completed'
    ).all() if apt.staff_id])
    
    for staff_id in staff_ids:
        staff = Staff.query.get(staff_id)
        if staff:
            staff_appointments = Appointment.query.filter(
                Appointment.staff_id == staff_id,
                func.date(Appointment.appointment_date) == today,
                Appointment.status == 'completed'
            ).all()
            staff_revenue = 0
            for appointment in staff_appointments:
                appointment_subtotal = 0
                for apt_service in appointment.services:
                    if apt_service.service:
                        appointment_subtotal += apt_service.service.price
                staff_revenue += appointment_subtotal
            staff_commission = staff_revenue * 0.50
            
            staff_performance.append({
                'staff_id': staff.id,
                'staff_name': staff.name,
                'sales_today': round(staff_revenue, 2),
                'commission_today': round(staff_commission, 2),
                'transactions_count': len(staff_appointments)
            })
    
    # Recent staff logins (last 24 hours)
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_logins = StaffLoginLog.query.filter(
        StaffLoginLog.login_time >= yesterday
    ).order_by(StaffLoginLog.login_time.desc()).limit(20).all()
    
    recent_login_history = []
    for log in recent_logins:
        staff = log.staff
        recent_login_history.append({
            'staff_id': staff.id if staff else None,
            'staff_name': staff.name if staff else 'Unknown',
            'login_time': log.login_time.isoformat() if log.login_time else None,
            'logout_time': log.logout_time.isoformat() if log.logout_time else None,
            'session_duration': log.session_duration
        })
    
    return jsonify({
        'today_revenue': round(today_revenue, 2),
        'total_commission': round(total_commission, 2),
        'active_staff_count': active_staff_count,
        'total_staff_count': total_staff_count,
        'currently_logged_in': [staff.to_dict() for staff in active_staff_list],
        'recent_transactions': recent_transactions,
        'staff_performance': staff_performance,
        'recent_login_history': recent_login_history
    }), 200

# Dashboard statistics endpoint - DEMO MODE
@bp.route('/dashboard/stats/demo', methods=['GET'])
def get_dashboard_stats_demo():
    """Get demo dashboard statistics for showcasing"""
    from datetime import datetime, timedelta
    
    # Demo data that looks realistic for a salon
    demo_stats = {
        'today_revenue': 45250.00,
        'total_commission': 22625.00,
        'active_staff_count': 4,
        'total_staff_count': 6,
        'currently_logged_in': [
            {'id': 1, 'name': 'Jane Wanjiru', 'role': 'stylist', 'is_active': True},
            {'id': 2, 'name': 'Mary Nyambura', 'role': 'nail_technician', 'is_active': True},
            {'id': 3, 'name': 'Grace Muthoni', 'role': 'facial_specialist', 'is_active': True}
        ],
        'recent_transactions': [
            {
                'id': 1,
                'staff_name': 'Jane Wanjiru',
                'staff_id': 1,
                'amount': 2500.00,
                'commission': 1250.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                'appointment_id': 1
            },
            {
                'id': 2,
                'staff_name': 'Mary Nyambura',
                'staff_id': 2,
                'amount': 1800.00,
                'commission': 900.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
                'appointment_id': 2
            },
            {
                'id': 3,
                'staff_name': 'Grace Muthoni',
                'staff_id': 3,
                'amount': 3200.00,
                'commission': 1600.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(minutes=45)).isoformat(),
                'appointment_id': 3
            },
            {
                'id': 4,
                'staff_name': 'Jane Wanjiru',
                'staff_id': 1,
                'amount': 1500.00,
                'commission': 750.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                'appointment_id': 4
            },
            {
                'id': 5,
                'staff_name': 'Lucy Wambui',
                'staff_id': 4,
                'amount': 2800.00,
                'commission': 1400.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'appointment_id': 5
            },
            {
                'id': 6,
                'staff_name': 'Jane Wanjiru',
                'staff_id': 1,
                'amount': 2200.00,
                'commission': 1100.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(hours=3)).isoformat(),
                'appointment_id': 6
            },
            {
                'id': 7,
                'staff_name': 'Mary Nyambura',
                'staff_id': 2,
                'amount': 1950.00,
                'commission': 975.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                'appointment_id': 7
            },
            {
                'id': 8,
                'staff_name': 'Grace Muthoni',
                'staff_id': 3,
                'amount': 3100.00,
                'commission': 1550.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(hours=5)).isoformat(),
                'appointment_id': 8
            }
        ],
        'staff_performance': [
            {
                'staff_id': 1,
                'staff_name': 'Jane Wanjiru',
                'sales_today': 12500.00,
                'commission_today': 6250.00,
                'transactions_count': 5
            },
            {
                'staff_id': 2,
                'staff_name': 'Mary Nyambura',
                'sales_today': 9800.00,
                'commission_today': 4900.00,
                'transactions_count': 4
            },
            {
                'staff_id': 3,
                'staff_name': 'Grace Muthoni',
                'sales_today': 11200.00,
                'commission_today': 5600.00,
                'transactions_count': 3
            },
            {
                'staff_id': 4,
                'staff_name': 'Lucy Wambui',
                'sales_today': 11750.00,
                'commission_today': 5875.00,
                'transactions_count': 4
            }
        ],
        'recent_login_history': [
            {
                'staff_id': 1,
                'staff_name': 'Jane Wanjiru',
                'login_time': (datetime.utcnow() - timedelta(hours=3)).isoformat(),
                'logout_time': None,
                'session_duration': None
            },
            {
                'staff_id': 2,
                'staff_name': 'Mary Nyambura',
                'login_time': (datetime.utcnow() - timedelta(hours=2, minutes=30)).isoformat(),
                'logout_time': None,
                'session_duration': None
            },
            {
                'staff_id': 3,
                'staff_name': 'Grace Muthoni',
                'login_time': (datetime.utcnow() - timedelta(hours=1, minutes=45)).isoformat(),
                'logout_time': None,
                'session_duration': None
            },
            {
                'staff_id': 4,
                'staff_name': 'Lucy Wambui',
                'login_time': (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                'logout_time': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'session_duration': 7200
            },
            {
                'staff_id': 1,
                'staff_name': 'Jane Wanjiru',
                'login_time': (datetime.utcnow() - timedelta(hours=6)).isoformat(),
                'logout_time': (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                'session_duration': 7200
            }
        ]
    }
    
    return jsonify(demo_stats), 200

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
        status=data.get('status', 'pending'),
        transaction_code=data.get('transaction_code'),
        receipt_number=data.get('receipt_number')
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
    payment.transaction_code = data.get('transaction_code', payment.transaction_code)
    payment.receipt_number = data.get('receipt_number', payment.receipt_number)
    db.session.commit()
    return jsonify(payment.to_dict())

# ============ INVENTORY ENDPOINTS ============

@bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    category = request.args.get('category')
    low_stock = request.args.get('low_stock', 'false').lower() == 'true'
    
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    if low_stock:
        query = query.filter(Product.stock_quantity <= Product.min_stock_level)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products])

@bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.get_json()
    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        category=data.get('category'),
        sku=data.get('sku'),
        unit_price=data.get('unit_price', 0),
        selling_price=data.get('selling_price'),
        stock_quantity=data.get('stock_quantity', 0),
        min_stock_level=data.get('min_stock_level', 5),
        unit=data.get('unit', 'piece'),
        supplier=data.get('supplier')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    """Get a specific product"""
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    """Update a product"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.sku = data.get('sku', product.sku)
    product.unit_price = data.get('unit_price', product.unit_price)
    product.selling_price = data.get('selling_price', product.selling_price)
    product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
    product.min_stock_level = data.get('min_stock_level', product.min_stock_level)
    product.unit = data.get('unit', product.unit)
    product.supplier = data.get('supplier', product.supplier)
    product.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(product.to_dict())

@bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    """Delete a product"""
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200

@bp.route('/products/<int:id>/adjust-stock', methods=['POST'])
def adjust_stock(id):
    """Adjust product stock (add or subtract)"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    adjustment = data.get('adjustment', 0)  # Positive to add, negative to subtract
    product.stock_quantity = max(0, product.stock_quantity + adjustment)
    product.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(product.to_dict())

# ============ EXPENSE ENDPOINTS ============

@bp.route('/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses with optional date filtering"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    
    query = Expense.query
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(Expense.expense_date >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(Expense.expense_date <= end_dt)
    if category:
        query = query.filter_by(category=category)
    
    expenses = query.order_by(Expense.expense_date.desc()).all()
    return jsonify([expense.to_dict() for expense in expenses])

@bp.route('/expenses', methods=['POST'])
def create_expense():
    """Create a new expense"""
    data = request.get_json()
    expense = Expense(
        category=data.get('category'),
        description=data.get('description'),
        amount=data.get('amount'),
        expense_date=datetime.fromisoformat(data.get('expense_date')) if data.get('expense_date') else datetime.utcnow(),
        receipt_number=data.get('receipt_number'),
        paid_by=data.get('paid_by'),
        created_by=data.get('created_by')
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201

@bp.route('/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    """Get a specific expense"""
    expense = Expense.query.get_or_404(id)
    return jsonify(expense.to_dict())

@bp.route('/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    """Update an expense"""
    expense = Expense.query.get_or_404(id)
    data = request.get_json()
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)
    expense.amount = data.get('amount', expense.amount)
    if data.get('expense_date'):
        expense.expense_date = datetime.fromisoformat(data.get('expense_date'))
    expense.receipt_number = data.get('receipt_number', expense.receipt_number)
    expense.paid_by = data.get('paid_by', expense.paid_by)
    db.session.commit()
    return jsonify(expense.to_dict())

@bp.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    """Delete an expense"""
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted'}), 200

# ============ REPORTS ENDPOINTS ============

@bp.route('/reports/daily-sales', methods=['GET'])
def get_daily_sales_report():
    """Get daily sales report (Z-report)"""
    from datetime import date, timedelta
    
    report_date = request.args.get('date')
    if report_date:
        target_date = datetime.fromisoformat(report_date).date()
    else:
        target_date = date.today()
    
    # Get all completed payments for the date
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = datetime.combine(target_date, datetime.max.time())
    
    payments = Payment.query.join(Appointment).filter(
        Payment.status == 'completed',
        Appointment.appointment_date >= start_datetime,
        Appointment.appointment_date <= end_datetime
    ).all()
    
    # Calculate totals
    total_revenue = sum(p.amount for p in payments)
    total_commission = total_revenue * 0.50
    
    # Payment method breakdown
    payment_methods = {}
    for payment in payments:
        method = payment.payment_method or 'cash'
        payment_methods[method] = payment_methods.get(method, 0) + payment.amount
    
    # Transaction count
    transaction_count = len(payments)
    
    # VAT calculation (16%)
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    return jsonify({
        'date': target_date.isoformat(),
        'total_revenue': round(total_revenue, 2),
        'revenue_before_vat': round(revenue_before_vat, 2),
        'vat_amount': round(vat_amount, 2),
        'vat_rate': vat_rate,
        'total_commission': round(total_commission, 2),
        'transaction_count': transaction_count,
        'payment_methods': {k: round(v, 2) for k, v in payment_methods.items()},
        'payments': [p.to_dict() for p in payments]
    }), 200

@bp.route('/reports/commission-payout', methods=['GET'])
def get_commission_payout_report():
    """Get commission payout report for staff"""
    from datetime import date, timedelta
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    staff_id = request.args.get('staff_id', type=int)
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
    else:
        start_dt = datetime.combine(date.today() - timedelta(days=30), datetime.min.time())
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
    else:
        end_dt = datetime.combine(date.today(), datetime.max.time())
    
    # Get completed appointments in date range
    query = Appointment.query.filter(
        Appointment.status == 'completed',
        Appointment.appointment_date >= start_dt,
        Appointment.appointment_date <= end_dt
    )
    
    if staff_id:
        query = query.filter(Appointment.staff_id == staff_id)
    
    appointments = query.all()
    
    # Calculate commission by staff
    staff_commissions = {}
    default_commission_rate = 0.50
    
    for appointment in appointments:
        if not appointment.staff_id:
            continue
        
        appointment_total = 0
        for apt_service in appointment.services:
            if apt_service.service:
                appointment_total += apt_service.service.price
        
        commission = appointment_total * default_commission_rate
        
        if appointment.staff_id not in staff_commissions:
            staff_commissions[appointment.staff_id] = {
                'staff_id': appointment.staff_id,
                'staff_name': appointment.staff.name if appointment.staff else 'Unknown',
                'total_sales': 0,
                'total_commission': 0,
                'transaction_count': 0
            }
        
        staff_commissions[appointment.staff_id]['total_sales'] += appointment_total
        staff_commissions[appointment.staff_id]['total_commission'] += commission
        staff_commissions[appointment.staff_id]['transaction_count'] += 1
    
    # Round values
    for staff_id in staff_commissions:
        staff_commissions[staff_id]['total_sales'] = round(staff_commissions[staff_id]['total_sales'], 2)
        staff_commissions[staff_id]['total_commission'] = round(staff_commissions[staff_id]['total_commission'], 2)
    
    total_commission = sum(s['total_commission'] for s in staff_commissions.values())
    
    return jsonify({
        'start_date': start_dt.isoformat(),
        'end_date': end_dt.isoformat(),
        'staff_commissions': list(staff_commissions.values()),
        'total_commission_payout': round(total_commission, 2),
        'total_staff': len(staff_commissions)
    }), 200

@bp.route('/reports/financial-summary', methods=['GET'])
def get_financial_summary():
    """Get financial summary (P&L, cash flow)"""
    from datetime import date, timedelta
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
    else:
        start_dt = datetime.combine(date.today() - timedelta(days=30), datetime.min.time())
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
    else:
        end_dt = datetime.combine(date.today(), datetime.max.time())
    
    # Revenue from completed payments
    payments = Payment.query.join(Appointment).filter(
        Payment.status == 'completed',
        Appointment.appointment_date >= start_dt,
        Appointment.appointment_date <= end_dt
    ).all()
    
    total_revenue = sum(p.amount for p in payments)
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    # Expenses
    expenses = Expense.query.filter(
        Expense.expense_date >= start_dt,
        Expense.expense_date <= end_dt
    ).all()
    
    total_expenses = sum(e.amount for e in expenses)
    
    # Expenses by category
    expenses_by_category = {}
    for expense in expenses:
        category = expense.category or 'other'
        expenses_by_category[category] = expenses_by_category.get(category, 0) + expense.amount
    
    # Commission
    total_commission = total_revenue * 0.50
    
    # Profit calculation
    gross_profit = revenue_before_vat - total_commission
    net_profit = gross_profit - total_expenses
    
    return jsonify({
        'period': {
            'start_date': start_dt.isoformat(),
            'end_date': end_dt.isoformat()
        },
        'revenue': {
            'total_revenue': round(total_revenue, 2),
            'revenue_before_vat': round(revenue_before_vat, 2),
            'vat_amount': round(vat_amount, 2),
            'vat_rate': vat_rate
        },
        'costs': {
            'total_commission': round(total_commission, 2),
            'total_expenses': round(total_expenses, 2),
            'expenses_by_category': {k: round(v, 2) for k, v in expenses_by_category.items()}
        },
        'profit': {
            'gross_profit': round(gross_profit, 2),
            'net_profit': round(net_profit, 2),
            'profit_margin': round((net_profit / revenue_before_vat * 100) if revenue_before_vat > 0 else 0, 2)
        }
    }), 200

@bp.route('/reports/tax-report', methods=['GET'])
def get_tax_report():
    """Get tax report for KRA filing"""
    from datetime import date
    
    month = request.args.get('month')  # Format: YYYY-MM
    if month:
        year, month_num = map(int, month.split('-'))
        start_dt = datetime(year, month_num, 1)
        if month_num == 12:
            end_dt = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_dt = datetime(year, month_num + 1, 1) - timedelta(days=1)
    else:
        # Current month
        today = date.today()
        start_dt = datetime(today.year, today.month, 1)
        if today.month == 12:
            end_dt = datetime(today.year + 1, 1, 1) - timedelta(days=1)
        else:
            end_dt = datetime(today.year, today.month + 1, 1) - timedelta(days=1)
    
    # Get all completed payments
    payments = Payment.query.join(Appointment).filter(
        Payment.status == 'completed',
        Appointment.appointment_date >= start_dt,
        Appointment.appointment_date <= end_dt
    ).all()
    
    total_revenue = sum(p.amount for p in payments)
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    return jsonify({
        'period': {
            'start_date': start_dt.isoformat(),
            'end_date': end_dt.isoformat(),
            'month': month or f"{date.today().year}-{date.today().month:02d}"
        },
        'sales': {
            'total_sales': round(total_revenue, 2),
            'sales_before_vat': round(revenue_before_vat, 2),
            'vat_collected': round(vat_amount, 2),
            'vat_rate': vat_rate
        },
        'transaction_count': len(payments),
        'kra_pin': 'P051234567K'  # Should be configurable
    }), 200

# ============ SHIFT ENDPOINTS ============

@bp.route('/shifts', methods=['GET'])
def get_shifts():
    """Get all shifts with optional filtering"""
    staff_id = request.args.get('staff_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Shift.query
    if staff_id:
        query = query.filter_by(staff_id=staff_id)
    if start_date:
        start_dt = datetime.fromisoformat(start_date).date()
        query = query.filter(Shift.shift_date >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date).date()
        query = query.filter(Shift.shift_date <= end_dt)
    
    shifts = query.order_by(Shift.shift_date.desc(), Shift.start_time).all()
    return jsonify([shift.to_dict() for shift in shifts])

@bp.route('/shifts', methods=['POST'])
def create_shift():
    """Create a new shift"""
    data = request.get_json()
    shift = Shift(
        staff_id=data.get('staff_id'),
        shift_date=datetime.fromisoformat(data.get('shift_date')).date() if data.get('shift_date') else date.today(),
        start_time=datetime.strptime(data.get('start_time'), '%H:%M').time(),
        end_time=datetime.strptime(data.get('end_time'), '%H:%M').time(),
        notes=data.get('notes')
    )
    db.session.add(shift)
    db.session.commit()
    return jsonify(shift.to_dict()), 201

@bp.route('/shifts/<int:id>/clock-in', methods=['POST'])
def clock_in(id):
    """Clock in for a shift"""
    shift = Shift.query.get_or_404(id)
    shift.clock_in = datetime.utcnow()
    shift.status = 'active'
    db.session.commit()
    return jsonify(shift.to_dict())

@bp.route('/shifts/<int:id>/clock-out', methods=['POST'])
def clock_out(id):
    """Clock out from a shift"""
    shift = Shift.query.get_or_404(id)
    shift.clock_out = datetime.utcnow()
    shift.status = 'completed'
    db.session.commit()
    return jsonify(shift.to_dict())

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
    
    # Generate unique sale number: SALE-YYYYMMDD-HHMMSS-XXX
    # Use timestamp to ensure uniqueness even with concurrent requests
    now = datetime.now()
    today = now.strftime('%Y%m%d')
    time_part = now.strftime('%H%M%S')
    # Get count of sales today to generate sequence number
    today_sales_count = Sale.query.filter(
        func.date(Sale.created_at) == date.today()
    ).count()
    # Add timestamp to ensure uniqueness
    sale_number = f"SALE-{today}-{time_part}-{today_sales_count + 1:03d}"
    
    # Ensure uniqueness by checking if sale_number already exists (retry if needed)
    max_retries = 5
    retry_count = 0
    while Sale.query.filter_by(sale_number=sale_number).first() and retry_count < max_retries:
        today_sales_count += 1
        sale_number = f"SALE-{today}-{time_part}-{today_sales_count + 1:03d}"
        retry_count += 1
    
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
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create sale: {str(e)}'}), 500
    
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
    limit = request.args.get('limit', type=int, default=100)
    
    query = Sale.query
    
    if staff_id:
        query = query.filter(Sale.staff_id == staff_id)
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
