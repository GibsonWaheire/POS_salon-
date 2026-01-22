"""
Staff routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app
from models import Staff, StaffLoginLog, Sale, Payment, Service, Customer
from db import db
from sqlalchemy import func
from datetime import datetime, date, timedelta
from utils import get_demo_filter
from validators import validate_pin_format, validate_staff_id
from auth_helpers import require_manager_or_admin

bp_staff = Blueprint('staff', __name__)


@bp_staff.route('/staff', methods=['GET'])
def get_staff():
    staff_list = Staff.query.all()
    return jsonify([staff.to_dict() for staff in staff_list])


@bp_staff.route('/staff', methods=['POST'])
@require_manager_or_admin
def create_staff():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    # Validate PIN if provided
    pin = data.get('pin')
    if pin:
        is_valid, error = validate_pin_format(pin)
        if not is_valid:
            return jsonify({'error': error}), 400
    
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


@bp_staff.route('/staff/<int:id>', methods=['GET'])
def get_staff_member(id):
    staff = Staff.query.get_or_404(id)
    return jsonify(staff.to_dict())


@bp_staff.route('/staff/<int:id>', methods=['PUT'])
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
        is_valid, error = validate_pin_format(data.get('pin'))
        if not is_valid:
            return jsonify({'error': error}), 400
        staff.pin = data.get('pin')
    db.session.commit()
    return jsonify(staff.to_dict())


@bp_staff.route('/staff/<int:id>', methods=['DELETE'])
@require_manager_or_admin
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff member deleted'}), 200


@bp_staff.route('/staff/<int:id>/login-history', methods=['GET'])
def get_staff_login_history(id):
    """Get login history for a staff member"""
    staff = Staff.query.get_or_404(id)
    
    limit = request.args.get('limit', type=int, default=50)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = StaffLoginLog.query.filter_by(staff_id=id)
    
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


@bp_staff.route('/staff/<int:id>/role', methods=['PUT'])
def update_staff_role(id):
    """Update staff role"""
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    
    new_role = data.get('role')
    if not new_role:
        return jsonify({'success': False, 'error': 'Role is required'}), 400
    
    valid_roles = ['manager', 'stylist', 'receptionist', 'nail_technician', 'facial_specialist', 'admin']
    if new_role.lower() not in valid_roles:
        return jsonify({'success': False, 'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    
    staff.role = new_role.lower()
    db.session.commit()
    
    return jsonify({
        'success': True,
        'staff': staff.to_dict()
    }), 200


@bp_staff.route('/staff/<int:id>/performance', methods=['GET'])
def get_staff_performance(id):
    """Get staff sales and commission summary"""
    staff = Staff.query.get_or_404(id)
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    today_only = request.args.get('today_only', 'false').lower() == 'true'
    
    today = date.today()
    
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


@bp_staff.route('/staff/login', methods=['POST'])
def staff_login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
            
        staff_id = data.get('staff_id')
        pin = data.get('pin')
        
        # Validate required fields
        if not staff_id:
            return jsonify({'success': False, 'error': 'Staff ID is required'}), 400
        
        if not pin:
            return jsonify({'success': False, 'error': 'PIN is required'}), 400
        
        # Validate PIN format
        is_valid, error = validate_pin_format(pin)
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # Validate and convert staff_id to integer
        is_valid, staff_id_int, error = validate_staff_id(staff_id)
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # Lookup staff by BOTH ID and PIN
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
            
            # Return staff data without PIN
            staff_dict = staff.to_dict()
            staff_dict.pop('pin', None)
            return jsonify({
                'success': True,
                'staff': staff_dict,
                'login_log_id': login_log.id,
                'is_demo': is_demo_user,
                'demo_session_expires_at': demo_session_expires_at.isoformat() if demo_session_expires_at else None
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid Staff ID or PIN'
            }), 401
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in staff_login: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'An error occurred during login. Please try again.',
            'debug_message': str(e) if current_app.debug else None
        }), 500


@bp_staff.route('/staff/logout', methods=['POST'])
def staff_logout():
    """Log staff logout event and cleanup demo data if demo user"""
    from models import SaleService, SaleProduct, ProductUsage, Expense
    data = request.get_json()
    login_log_id = data.get('login_log_id')
    staff_id = data.get('staff_id')
    
    if not login_log_id and not staff_id:
        return jsonify({'success': False, 'error': 'login_log_id or staff_id is required'}), 400
    
    try:
        if login_log_id:
            login_log = StaffLoginLog.query.filter_by(id=login_log_id, logout_time=None).first()
        else:
            login_log = StaffLoginLog.query.filter_by(
                staff_id=staff_id,
                logout_time=None
            ).order_by(StaffLoginLog.login_time.desc()).first()
        
        if login_log:
            logout_time = datetime.utcnow()
            login_log.logout_time = logout_time
            
            if login_log.login_time:
                duration = (logout_time - login_log.login_time).total_seconds()
                login_log.session_duration = int(duration)
            
            staff = Staff.query.get(login_log.staff_id)
            is_demo_user = staff.is_demo if staff and hasattr(staff, 'is_demo') and staff.is_demo else False
            
            # Cleanup demo data if demo user
            if is_demo_user and staff:
                demo_sales = Sale.query.filter(
                    Sale.staff_id == staff.id,
                    Sale.is_demo == True
                ).all()
                
                for sale in demo_sales:
                    SaleService.query.filter_by(sale_id=sale.id).delete()
                    SaleProduct.query.filter_by(sale_id=sale.id).delete()
                    ProductUsage.query.filter_by(sale_id=sale.id).delete()
                    Payment.query.filter_by(sale_id=sale.id).delete()
                    db.session.delete(sale)
                
                demo_customers = Customer.query.filter(Customer.is_demo == True).all()
                for customer in demo_customers:
                    non_demo_sales = Sale.query.filter(
                        Sale.customer_id == customer.id,
                        Sale.is_demo == False
                    ).count()
                    if non_demo_sales == 0:
                        db.session.delete(customer)
                
                Expense.query.filter(
                    Expense.created_by == staff.id,
                    Expense.is_demo == True
                ).delete()
            
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


@bp_staff.route('/staff/check-session', methods=['GET'])
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
        
        return jsonify({'expired': False, 'is_demo': False}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp_staff.route('/staff/<int:id>/toggle-demo-mode', methods=['POST'])
def toggle_demo_mode(id):
    """Toggle demo mode preference for admin/manager"""
    staff = Staff.query.get_or_404(id)
    
    if staff.role not in ['admin', 'manager']:
        return jsonify({'error': 'Only admin and manager can toggle demo mode'}), 403
    
    data = request.get_json()
    demo_mode = data.get('demo_mode')
    
    if demo_mode is None:
        staff.demo_mode_preference = not (staff.demo_mode_preference or False)
    else:
        staff.demo_mode_preference = bool(demo_mode)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'demo_mode': staff.demo_mode_preference,
        'staff': staff.to_dict()
    }), 200


@bp_staff.route('/staff/<int:id>/stats', methods=['GET'])
def get_staff_stats(id):
    staff = Staff.query.get_or_404(id)
    today = datetime.now().date()
    
    demo_filter = get_demo_filter(staff, request)
    
    today_sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) == today,
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    clients_served_today = len(today_sales)
    revenue_today = sum(sale.subtotal for sale in today_sales)
    commission_today = sum(sale.commission_amount for sale in today_sales)
    transactions_today = len(today_sales)
    
    week_start = today - timedelta(days=6)
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


@bp_staff.route('/staff/<int:id>/commission-history', methods=['GET'])
def get_staff_commission_history(id):
    try:
        staff = Staff.query.get_or_404(id)
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        payment_method = request.args.get('payment_method')
        
        query = Sale.query.filter(
            Sale.staff_id == id,
            Sale.status == 'completed'
        )
        
        demo_filter = get_demo_filter(staff, request)
        query = query.filter(Sale.is_demo == demo_filter['is_demo'])
        
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
        
        if payment_method:
            sale_ids_with_payment = [p.sale_id for p in Payment.query.filter_by(
                payment_method=payment_method
            ).all() if p.sale_id]
            sales = [sale for sale in sales if sale.id in sale_ids_with_payment]
        
        history = []
        for sale in sales:
            try:
                payment = sale.payment if hasattr(sale, 'payment') and sale.payment else Payment.query.filter_by(sale_id=sale.id).first()
                
                services_list = []
                for sale_service in sale.sale_services:
                    if sale_service.service:
                        services_list.append({
                            'name': sale_service.service.name,
                            'price': sale_service.total_price
                        })
                    else:
                        service = Service.query.get(sale_service.service_id)
                        if service:
                            services_list.append({
                                'name': service.name,
                                'price': sale_service.total_price
                            })
                        else:
                            services_list.append({
                                'name': f'Service #{sale_service.service_id}',
                                'price': sale_service.total_price
                            })
                
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


@bp_staff.route('/staff/<int:id>/base-pay', methods=['GET'])
def get_staff_base_pay(id):
    """Get staff base pay"""
    staff = Staff.query.get_or_404(id)
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'base_pay': staff.base_pay
    }), 200


@bp_staff.route('/staff/<int:id>/base-pay', methods=['PUT'])
def update_staff_base_pay(id):
    """Update staff base pay"""
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    
    base_pay = data.get('base_pay')
    if base_pay is None:
        return jsonify({'error': 'base_pay is required'}), 400
    
    try:
        base_pay_float = float(base_pay)
        if base_pay_float < 0:
            return jsonify({'error': 'base_pay must be non-negative'}), 400
        
        staff.base_pay = base_pay_float
        db.session.commit()
        
        return jsonify({
            'success': True,
            'staff_id': id,
            'staff_name': staff.name,
            'base_pay': staff.base_pay
        }), 200
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid base_pay value'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
