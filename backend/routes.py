from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import Customer, Service, Staff, Payment, StaffLoginLog, Product, ProductUsage, Expense, Shift, Sale, SaleService, SaleProduct
from db import db
from datetime import datetime, date, timedelta
import re

bp = Blueprint('api', __name__, url_prefix='/api')

# Helper function to determine demo filter based on user context
def get_demo_filter(user=None, request_obj=None):
    """
    Returns SQLAlchemy filter condition for demo/live data based on user context.
    
    Args:
        user: Staff object or dict with is_demo flag
        request_obj: Flask request object to check demo_mode parameter
    
    Returns:
        dict: Filter condition {'is_demo': True/False}
    """
    # Check if user is a demo user
    is_demo_user = False
    if user:
        if isinstance(user, Staff):
            is_demo_user = user.is_demo if hasattr(user, 'is_demo') else False
        elif isinstance(user, dict):
            is_demo_user = user.get('is_demo', False)
        elif hasattr(user, 'is_demo'):
            is_demo_user = user.is_demo
    
    # If demo user, only show demo data
    if is_demo_user:
        return {'is_demo': True}
    
    # Check request parameter for demo mode toggle (for admin/manager)
    if request_obj:
        demo_mode = request_obj.args.get('demo_mode', '').lower()
        if demo_mode == 'true':
            return {'is_demo': True}
    
    # Otherwise show live data (not demo)
    return {'is_demo': False}

# Customer routes
@bp.route('/customers', methods=['GET'])
def get_customers():
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    customers = Customer.query.filter(Customer.is_demo == demo_filter['is_demo']).all()
    return jsonify([customer.to_dict() for customer in customers])

@bp.route('/customers', methods=['POST'])
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
    
    # Build query - use Sales instead of Appointments
    query = Sale.query.filter(
        Sale.staff_id == id,
        Sale.status == 'completed'
    )
    
    if today_only:
        query = query.filter(func.date(Sale.created_at) == today)
    else:
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Sale.created_at >= start_dt)
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(Sale.created_at <= end_dt)
    
    sales = query.all()
    
    # Calculate totals from sales
    total_revenue = sum(sale.subtotal for sale in sales)
    total_commission = sum(sale.commission_amount for sale in sales)
    transaction_count = len(sales)
    
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
    data = request.get_json()
    staff_id = data.get('staff_id')
    pin = data.get('pin')
    
    # Validate required fields
    if not staff_id:
        return jsonify({'success': False, 'error': 'Staff ID is required'}), 400
    
    if not pin:
        return jsonify({'success': False, 'error': 'PIN is required'}), 400
    
    # Validate PIN format: 5 characters, at least one digit and one special character
    if len(pin) != 5:
        return jsonify({'success': False, 'error': 'PIN must be exactly 5 characters'}), 400
    
    # Check if PIN contains at least one digit and one special character
    has_digit = bool(re.search(r'\d', pin))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
    
    if not (has_digit and has_special):
        return jsonify({'success': False, 'error': 'PIN must contain at least one digit and one special character'}), 400
    
    # Convert staff_id to integer if it's numeric
    try:
        staff_id_int = int(staff_id)
    except (ValueError, TypeError) as e:
        return jsonify({'success': False, 'error': 'Invalid Staff ID format'}), 400
    
    # Lookup staff by BOTH ID and PIN - both must match the same staff member
    # In production, compare hashed PIN using bcrypt or similar
    staff = Staff.query.filter(
        Staff.id == staff_id_int,
        Staff.pin == pin
    ).first()
    
    if staff:
        # Log login event
        ip_address = request.remote_addr
        login_time = datetime.utcnow()
        
        # Check if this is a demo user
        is_demo_user = staff.is_demo if hasattr(staff, 'is_demo') else False
        
        # Set demo session expiration (5 minutes from now)
        demo_session_expires_at = None
        if is_demo_user:
            demo_session_expires_at = login_time + timedelta(minutes=5)
        
        login_log = StaffLoginLog(
            staff_id=staff.id,
            login_time=login_time,
            ip_address=ip_address,
            demo_session_expires_at=demo_session_expires_at
        )
        db.session.add(login_log)
        
        # Update staff last_login
        staff.last_login = login_time
        
        db.session.commit()
        
        # Return staff data without PIN for security, include login_log_id for logout
        staff_dict = staff.to_dict()
        staff_dict.pop('pin', None)  # Don't send PIN back to client
        return jsonify({
            'success': True,
            'staff': staff_dict,
            'login_log_id': login_log.id,  # Include login log ID for logout tracking
            'is_demo': is_demo_user,  # Include demo flag
            'demo_session_expires_at': demo_session_expires_at.isoformat() if demo_session_expires_at else None
        }), 200
    else:
        # Return generic error (don't reveal if Staff ID exists but PIN is wrong, or vice versa)
        return jsonify({
            'success': False,
            'error': 'Invalid Staff ID or PIN'
        }), 401

# Staff logout endpoint
@bp.route('/staff/logout', methods=['POST'])
def staff_logout():
    """Log staff logout event and cleanup demo data if demo user"""
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
            
            # Get staff to check if demo user
            staff = Staff.query.get(login_log.staff_id)
            is_demo_user = staff.is_demo if staff and hasattr(staff, 'is_demo') and staff.is_demo else False
            
            # Cleanup demo data if demo user
            if is_demo_user and staff:
                # Delete all demo sales created by this staff
                demo_sales = Sale.query.filter(
                    Sale.staff_id == staff.id,
                    Sale.is_demo == True
                ).all()
                
                for sale in demo_sales:
                    # Delete related SaleServices
                    SaleService.query.filter_by(sale_id=sale.id).delete()
                    # Delete related SaleProducts
                    SaleProduct.query.filter_by(sale_id=sale.id).delete()
                    # Delete related ProductUsage
                    ProductUsage.query.filter_by(sale_id=sale.id).delete()
                    # Delete related Payments
                    Payment.query.filter_by(sale_id=sale.id).delete()
                    # Delete the sale
                    db.session.delete(sale)
                
                # Delete demo customers created during this session
                # (customers created by this staff in demo mode)
                demo_customers = Customer.query.filter(
                    Customer.is_demo == True
                ).all()
                # Only delete customers that have no non-demo sales
                for customer in demo_customers:
                    non_demo_sales = Sale.query.filter(
                        Sale.customer_id == customer.id,
                        Sale.is_demo == False
                    ).count()
                    if non_demo_sales == 0:
                        db.session.delete(customer)
                
                # Delete demo expenses created by this staff
                Expense.query.filter(
                    Expense.created_by == staff.id,
                    Expense.is_demo == True
                ).delete()
                
                # Note: We don't reset product stock changes as products are shared
                # Demo product modifications would affect live data
            
            db.session.commit()
            return jsonify({
                'success': True, 
                'message': 'Logout logged successfully',
                'demo_data_cleaned': is_demo_user
            }), 200
        else:
            return jsonify({'success': False, 'error': 'No active login session found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Staff session check endpoint (for demo auto-logout)
@bp.route('/staff/check-session', methods=['GET'])
def check_staff_session():
    """Check if demo session has expired"""
    login_log_id = request.args.get('login_log_id', type=int)
    staff_id = request.args.get('staff_id', type=int)
    
    if not login_log_id and not staff_id:
        return jsonify({'error': 'login_log_id or staff_id is required'}), 400
    
    try:
        if login_log_id:
            login_log = StaffLoginLog.query.filter_by(id=login_log_id).first()
        else:
            login_log = StaffLoginLog.query.filter_by(
                staff_id=staff_id,
                logout_time=None
            ).order_by(StaffLoginLog.login_time.desc()).first()
        
        if not login_log:
            return jsonify({'expired': True, 'error': 'Session not found'}), 404
        
        # Check if demo session has expired
        if login_log.demo_session_expires_at:
            now = datetime.utcnow()
            if now >= login_log.demo_session_expires_at:
                return jsonify({
                    'expired': True,
                    'expires_at': login_log.demo_session_expires_at.isoformat()
                }), 200
            else:
                return jsonify({
                    'expired': False,
                    'expires_at': login_log.demo_session_expires_at.isoformat(),
                    'seconds_remaining': int((login_log.demo_session_expires_at - now).total_seconds())
                }), 200
        
        # Not a demo session
        return jsonify({'expired': False, 'is_demo': False}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Staff toggle demo mode endpoint (for admin/manager)
@bp.route('/staff/<int:id>/toggle-demo-mode', methods=['POST'])
def toggle_demo_mode(id):
    """Toggle demo mode preference for admin/manager"""
    staff = Staff.query.get_or_404(id)
    
    # Only allow toggle for admin/manager roles
    if staff.role not in ['admin', 'manager']:
        return jsonify({'error': 'Only admin and manager can toggle demo mode'}), 403
    
    data = request.get_json()
    demo_mode = data.get('demo_mode')
    
    if demo_mode is None:
        # Toggle current preference
        staff.demo_mode_preference = not (staff.demo_mode_preference or False)
    else:
        staff.demo_mode_preference = bool(demo_mode)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'demo_mode': staff.demo_mode_preference,
        'staff': staff.to_dict()
    }), 200

# Staff statistics endpoint
@bp.route('/staff/<int:id>/stats', methods=['GET'])
def get_staff_stats(id):
    staff = Staff.query.get_or_404(id)
    today = datetime.now().date()
    
    # Get demo filter based on staff and request
    demo_filter = get_demo_filter(staff, request)
    
    # Get today's completed sales (filtered by demo status)
    today_sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) == today,
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    # Calculate from sales
    clients_served_today = len(today_sales)
    revenue_today = sum(sale.subtotal for sale in today_sales)
    commission_today = sum(sale.commission_amount for sale in today_sales)
    
    # Count transactions for today
    transactions_today = len(today_sales)
    
    # Calculate weekly commission (last 7 days)
    from datetime import timedelta
    week_start = today - timedelta(days=6)  # Include today, so 6 days back
    
    # Sales (filtered by demo status)
    week_sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) >= week_start,
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    commission_weekly = sum(sale.commission_amount for sale in week_sales)
    
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
    try:
        staff = Staff.query.get_or_404(id)
        
        # Get query parameters for filtering
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        payment_method = request.args.get('payment_method')
        
        # Get all completed sales for this staff
        query = Sale.query.filter(
            Sale.staff_id == id,
            Sale.status == 'completed'
        )
        
        # Apply demo filter
        demo_filter = get_demo_filter(staff, request)
        query = query.filter(Sale.is_demo == demo_filter['is_demo'])
        
        # Apply date filters
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(Sale.created_at >= start_dt)
            except (ValueError, AttributeError) as e:
                return jsonify({'error': f'Invalid start_date format: {start_date}'}), 400
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(Sale.created_at <= end_dt)
            except (ValueError, AttributeError) as e:
                return jsonify({'error': f'Invalid end_date format: {end_date}'}), 400
        
        sales = query.order_by(Sale.created_at.desc()).all()
        
        # Filter by payment method if specified
        if payment_method:
            # Get sale IDs that have payments with the specified payment method
            sale_ids_with_payment = [p.sale_id for p in Payment.query.filter_by(
                payment_method=payment_method
            ).all() if p.sale_id]
            sales = [sale for sale in sales if sale.id in sale_ids_with_payment]
        
        # Build commission history
        history = []
        
        for sale in sales:
            try:
                # Get payment for this sale - use relationship first, fallback to query
                payment = sale.payment if hasattr(sale, 'payment') and sale.payment else Payment.query.filter_by(sale_id=sale.id).first()
                
                # Get services from sale
                services_list = []
                for sale_service in sale.sale_services:
                    # Use service relationship if available, otherwise use SaleService data
                    if sale_service.service:
                        # Service relationship exists - use it
                        services_list.append({
                            'name': sale_service.service.name,
                            'price': sale_service.total_price
                        })
                    else:
                        # Service relationship is None - use SaleService data directly
                        # Try to get service name from Service table by service_id
                        service = Service.query.get(sale_service.service_id)
                        if service:
                            services_list.append({
                                'name': service.name,
                                'price': sale_service.total_price
                            })
                        else:
                            # Fallback: use service_id as identifier if service doesn't exist
                            services_list.append({
                                'name': f'Service #{sale_service.service_id}',
                                'price': sale_service.total_price
                            })
                
                # Safely access customer data
                customer_name = sale.customer_name
                if not customer_name and sale.customer:
                    customer_name = sale.customer.name
                if not customer_name:
                    customer_name = 'Walk-in'
                
                customer_phone = sale.customer_phone
                if not customer_phone and sale.customer:
                    customer_phone = sale.customer.phone
                
                history.append({
                    'id': sale.id,
                    'date': sale.created_at.strftime('%Y-%m-%d') if sale.created_at else None,
                    'time': sale.created_at.strftime('%H:%M') if sale.created_at else None,
                    'datetime': sale.created_at.isoformat() if sale.created_at else None,
                    'client_name': customer_name,
                    'client_phone': customer_phone,
                    'services': services_list,
                    'total_amount': round(sale.subtotal, 2) if sale.subtotal else 0,
                    'tax': round(sale.tax_amount, 2) if sale.tax_amount else 0,
                    'grand_total': round(sale.total_amount, 2) if sale.total_amount else 0,
                    'commission': round(sale.commission_amount, 2) if sale.commission_amount else 0,
                    'payment_method': payment.payment_method if payment else None,
                    'payment_status': payment.status if payment else None,
                    'receipt_number': payment.receipt_number if payment else f"RCP-{sale.sale_number}"
                })
            except Exception as e:
                # Skip this sale and continue with others
                continue
        
        return jsonify({
            'staff_id': id,
            'staff_name': staff.name,
            'transactions': history,
            'total_count': len(history),
            'total_commission': round(sum(t['commission'] for t in history), 2)
        }), 200
    except Exception as e:
        import traceback
        print(f"Error in get_staff_commission_history: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e), 'message': 'Failed to fetch commission history'}), 500

# Staff weekly transactions endpoint
@bp.route('/staff/<int:id>/weekly-transactions', methods=['GET'])
def get_staff_weekly_transactions(id):
    """Get weekly transaction list for a staff member"""
    staff = Staff.query.get_or_404(id)
    
    from datetime import timedelta
    today = datetime.now().date()
    week_start = today - timedelta(days=6)  # Last 7 days including today
    
    # Get all completed sales for this staff in the last 7 days
    demo_filter = get_demo_filter(staff, request)
    sales = Sale.query.filter(
        Sale.staff_id == id,
        Sale.status == 'completed',
        func.date(Sale.created_at) >= week_start,
        Sale.is_demo == demo_filter['is_demo']
    ).order_by(Sale.created_at.desc()).all()
    
    transactions = []
    for sale in sales:
        payment = sale.payment if hasattr(sale, 'payment') and sale.payment else Payment.query.filter_by(sale_id=sale.id).first()
        
        # Get services from sale
        services_list = []
        for sale_service in sale.sale_services:
            if sale_service.service:
                services_list.append({
                    'name': sale_service.service.name,
                    'price': sale_service.total_price
                })
        
        transactions.append({
            'id': sale.id,
            'sale_number': sale.sale_number,
            'date': sale.created_at.strftime('%Y-%m-%d') if sale.created_at else None,
            'time': sale.created_at.strftime('%H:%M') if sale.created_at else None,
            'datetime': sale.created_at.isoformat() if sale.created_at else None,
            'client_name': sale.customer_name or (sale.customer.name if sale.customer else 'Walk-in'),
            'client_phone': sale.customer_phone or (sale.customer.phone if sale.customer else None),
            'services': services_list,
            'subtotal': round(sale.subtotal, 2),
            'tax': round(sale.tax_amount, 2),
            'total_amount': round(sale.total_amount, 2),
            'commission': round(sale.commission_amount, 2),
            'payment_method': payment.payment_method if payment else None,
            'payment_status': payment.status if payment else None,
            'receipt_number': payment.receipt_number if payment else f"RCP-{sale.sale_number}"
        })
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'week_start': week_start.isoformat(),
        'week_end': today.isoformat(),
        'transactions': transactions,
        'total_count': len(transactions),
        'total_revenue': round(sum(t['subtotal'] for t in transactions), 2),
        'total_commission': round(sum(t['commission'] for t in transactions), 2)
    }), 200

# Dashboard statistics endpoint
@bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics for admin/manager"""
    from datetime import date, timedelta
    
    today = date.today()
    
    # Get demo filter from request (admin/manager use query parameter)
    demo_filter = get_demo_filter(None, request)
    
    # Today's sales revenue (from completed sales - subtotal before VAT)
    today_sales = Sale.query.filter(
        func.date(Sale.created_at) == today,
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    today_revenue = sum(sale.subtotal for sale in today_sales)
    
    # Total commission to be paid today (from sales)
    total_commission = sum(sale.commission_amount for sale in today_sales)
    
    # Active staff count (staff with is_active=True, exclude demo staff if not in demo mode)
    if demo_filter['is_demo']:
        active_staff_count = Staff.query.filter(Staff.is_active == True, Staff.is_demo == True).count()
        total_staff_count = Staff.query.filter(Staff.is_demo == True).count()
    else:
        active_staff_count = Staff.query.filter(Staff.is_active == True, Staff.is_demo == False).count()
        total_staff_count = Staff.query.filter(Staff.is_demo == False).count()
    
    # Staff currently logged in (staff with active login sessions in last 2 hours)
    two_hours_ago = datetime.utcnow() - timedelta(hours=2)
    active_logins = StaffLoginLog.query.filter(
        StaffLoginLog.login_time >= two_hours_ago,
        StaffLoginLog.logout_time.is_(None)
    ).all()
    currently_logged_in = [log.staff_id for log in active_logins]
    active_staff_list = Staff.query.filter(Staff.id.in_(currently_logged_in)).all() if currently_logged_in else []
    
    # Filter active staff by demo status
    if not demo_filter['is_demo']:
        active_staff_list = [s for s in active_staff_list if not (hasattr(s, 'is_demo') and s.is_demo)]
    else:
        active_staff_list = [s for s in active_staff_list if hasattr(s, 'is_demo') and s.is_demo]
    
    # Recent transactions (last 10 completed sales with payments)
    recent_sales = Sale.query.filter(
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).order_by(Sale.created_at.desc()).limit(10).all()
    
    recent_transactions = []
    for sale in recent_sales:
        payment = sale.payment  # Access payment through relationship
        staff = sale.staff if sale else None
        # Use sale commission amount
        commission = sale.commission_amount if sale else 0
        if payment:  # Only include sales that have payments
            recent_transactions.append({
                'id': payment.id,
                'staff_name': staff.name if staff else 'N/A',
                'staff_id': staff.id if staff else None,
                'amount': round(payment.amount, 2),
                'commission': round(commission, 2),
                'payment_method': payment.payment_method,
                'created_at': payment.created_at.isoformat() if payment.created_at else None,
                'sale_id': sale.id
            })
    
    # Staff performance summary (today's sales and commission per staff)
    staff_performance = []
    staff_ids = set([sale.staff_id for sale in today_sales if sale.staff_id])
    
    for staff_id in staff_ids:
        staff = Staff.query.get(staff_id)
        if staff:
            # Skip if staff demo status doesn't match filter
            if demo_filter['is_demo'] and not (hasattr(staff, 'is_demo') and staff.is_demo):
                continue
            if not demo_filter['is_demo'] and (hasattr(staff, 'is_demo') and staff.is_demo):
                continue
            
            staff_sales = [sale for sale in today_sales if sale.staff_id == staff_id]
            staff_revenue = sum(sale.subtotal for sale in staff_sales)
            staff_commission = sum(sale.commission_amount for sale in staff_sales)
            
            staff_performance.append({
                'staff_id': staff.id,
                'staff_name': staff.name,
                'sales_today': round(staff_revenue, 2),
                'commission_today': round(staff_commission, 2),
                'transactions_count': len(staff_sales)
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


# Payment routes
@bp.route('/payments', methods=['GET'])
def get_payments():
    """Get all payments - only sale-based payments"""
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    
    payments = Payment.query.filter(
        Payment.sale_id.isnot(None),
        Payment.is_demo == demo_filter['is_demo']
    ).order_by(Payment.created_at.desc()).all()
    
    # Include sale and staff information
    result = []
    for payment in payments:
        payment_dict = payment.to_dict()
        # Access sale through relationship (backref from Sale model)
        if hasattr(payment, 'sale') and payment.sale:
            payment_dict['sale'] = {
                'id': payment.sale.id,
                'sale_number': payment.sale.sale_number,
                'customer_name': payment.sale.customer_name or (payment.sale.customer.name if payment.sale.customer else 'Walk-in'),
                'staff_name': payment.sale.staff.name if payment.sale.staff else None
            }
        else:
            # Fallback: query sale directly if relationship not loaded
            sale = Sale.query.get(payment.sale_id) if payment.sale_id else None
            if sale:
                payment_dict['sale'] = {
                    'id': sale.id,
                    'sale_number': sale.sale_number,
                    'customer_name': sale.customer_name or (sale.customer.name if sale.customer else 'Walk-in'),
                    'staff_name': sale.staff.name if sale.staff else None
                }
        result.append(payment_dict)
    
    return jsonify(result)

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
    
    # Get all completed sales for the date
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = datetime.combine(target_date, datetime.max.time())
    
    sales = Sale.query.filter(
        Sale.status == 'completed',
        Sale.created_at >= start_datetime,
        Sale.created_at <= end_datetime
    ).all()
    
    # Calculate totals from sales
    total_revenue = sum(sale.total_amount for sale in sales)
    total_commission = sum(sale.commission_amount for sale in sales)
    
    # Payment method breakdown - get from payments
    payment_methods = {}
    payments_list = []
    for sale in sales:
        payment = sale.payment if hasattr(sale, 'payment') and sale.payment else Payment.query.filter_by(sale_id=sale.id).first()
        if payment:
            method = payment.payment_method or 'cash'
            payment_methods[method] = payment_methods.get(method, 0) + payment.amount
            payments_list.append(payment)
    
    # Transaction count
    transaction_count = len(sales)
    
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
        'payments': [p.to_dict() for p in payments_list]
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
    
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    
    # Get completed sales in date range
    query = Sale.query.filter(
        Sale.status == 'completed',
        Sale.created_at >= start_dt,
        Sale.created_at <= end_dt,
        Sale.is_demo == demo_filter['is_demo']
    )
    
    if staff_id:
        query = query.filter(Sale.staff_id == staff_id)
    
    sales = query.all()
    
    # Calculate commission by staff
    staff_commissions = {}
    
    for sale in sales:
        if not sale.staff_id:
            continue
        
        if sale.staff_id not in staff_commissions:
            staff_commissions[sale.staff_id] = {
                'staff_id': sale.staff_id,
                'staff_name': sale.staff.name if sale.staff else 'Unknown',
                'total_sales': 0,
                'total_commission': 0,
                'transaction_count': 0
            }
        
        staff_commissions[sale.staff_id]['total_sales'] += sale.subtotal
        staff_commissions[sale.staff_id]['total_commission'] += sale.commission_amount
        staff_commissions[sale.staff_id]['transaction_count'] += 1
    
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
    
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    
    # Revenue from completed sales
    sales = Sale.query.filter(
        Sale.status == 'completed',
        Sale.created_at >= start_dt,
        Sale.created_at <= end_dt,
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    total_revenue = sum(sale.total_amount for sale in sales)
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    # Expenses
    expenses = Expense.query.filter(
        Expense.expense_date >= start_dt,
        Expense.expense_date <= end_dt,
        Expense.is_demo == demo_filter['is_demo']
    ).all()
    
    total_expenses = sum(e.amount for e in expenses)
    
    # Expenses by category
    expenses_by_category = {}
    for expense in expenses:
        category = expense.category or 'other'
        expenses_by_category[category] = expenses_by_category.get(category, 0) + expense.amount
    
    # Commission from sales
    total_commission = sum(sale.commission_amount for sale in sales)
    
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
    
    # Get demo filter from request
    demo_filter = get_demo_filter(None, request)
    
    # Get all completed sales for the month
    sales = Sale.query.filter(
        Sale.status == 'completed',
        Sale.created_at >= start_dt,
        Sale.created_at <= end_dt,
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    total_revenue = sum(sale.total_amount for sale in sales)
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    transaction_count = len(sales)
    
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
        'transaction_count': transaction_count,
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
                    # SQLite allows inserting with specific ID if it doesn't conflict
                    service = Service(
                        id=service_id,  # Try to use the ID from frontend
                        name=service_name,
                        price=service_price,
                        duration=duration
                    )
                    db.session.add(service)
                    db.session.flush()  # Flush to get the service ID
                except Exception:
                    # If setting ID fails (e.g., ID already exists or auto-increment issue),
                    # create without ID and let database assign it
                    db.session.rollback()
                    # Try to find by name to avoid duplicates
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
                # If no name/price provided, skip this service
                continue
        
        # Use price from frontend if provided, otherwise use database price
        unit_price = service_price if service_price is not None else service.price
        total_price = unit_price * quantity
        commission_amount = total_price * commission_rate
        
        # Always create SaleService record
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
        
        # STEP 3: Create payment with demo flag matching sale
        payment = Payment(
            sale_id=sale.id,
            appointment_id=None,  # Explicitly set to None for sale-based payments
            amount=sale.total_amount,
            payment_method=payment_method.lower().replace("-", "_"),
            status='completed',
            transaction_code=transaction_code,
            receipt_number=receipt_number,
            is_demo=sale.is_demo if hasattr(sale, 'is_demo') else False
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
        # Get staff to check demo status
        staff = Staff.query.get(staff_id)
        demo_filter = get_demo_filter(staff, request)
    else:
        # No staff_id, use request parameter
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
