"""
Dashboard routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Sale, CommissionPayment, Staff, StaffLoginLog, Payment
from db import db
from sqlalchemy import func
from datetime import datetime, date, timedelta
from utils import get_demo_filter

bp_dashboard = Blueprint('dashboard', __name__)


@bp_dashboard.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics for admin/manager"""
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
    
    # Total commission earned (all time from completed sales, filtered by demo)
    all_sales = Sale.query.filter(
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    total_commission_earned = sum(sale.commission_amount for sale in all_sales)
    
    # Total commission paid (from CommissionPayment table, filtered by demo)
    total_commission_paid = db.session.query(func.sum(CommissionPayment.amount_paid)).filter(
        CommissionPayment.is_demo == demo_filter['is_demo']
    ).scalar() or 0
    
    # Total commission pending (earned - paid) - this is what's actually owed
    total_commission = max(0, total_commission_earned - total_commission_paid)  # Ensure non-negative
    
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


@bp_dashboard.route('/dashboard/stats/demo', methods=['GET'])
def get_dashboard_stats_demo():
    """Get demo dashboard statistics for showcasing"""
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
                'sale_id': 1
            },
            {
                'id': 2,
                'staff_name': 'Mary Nyambura',
                'staff_id': 2,
                'amount': 1800.00,
                'commission': 900.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
                'sale_id': 2
            },
            {
                'id': 3,
                'staff_name': 'Grace Muthoni',
                'staff_id': 3,
                'amount': 3200.00,
                'commission': 1600.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(minutes=45)).isoformat(),
                'sale_id': 3
            },
            {
                'id': 4,
                'staff_name': 'Jane Wanjiru',
                'staff_id': 1,
                'amount': 1500.00,
                'commission': 750.00,
                'payment_method': 'cash',
                'created_at': (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                'sale_id': 4
            },
            {
                'id': 5,
                'staff_name': 'Lucy Wambui',
                'staff_id': 4,
                'amount': 2800.00,
                'commission': 1400.00,
                'payment_method': 'm_pesa',
                'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'sale_id': 5
            }
        ],
        'staff_performance': [
            {'staff_id': 1, 'staff_name': 'Jane Wanjiru', 'sales_today': 12500.00, 'commission_today': 6250.00, 'transactions_count': 5},
            {'staff_id': 2, 'staff_name': 'Mary Nyambura', 'sales_today': 9800.00, 'commission_today': 4900.00, 'transactions_count': 4},
            {'staff_id': 3, 'staff_name': 'Grace Muthoni', 'sales_today': 15200.00, 'commission_today': 7600.00, 'transactions_count': 6},
            {'staff_id': 4, 'staff_name': 'Lucy Wambui', 'sales_today': 7750.00, 'commission_today': 3875.00, 'transactions_count': 3}
        ],
        'recent_login_history': [
            {'staff_id': 1, 'staff_name': 'Jane Wanjiru', 'login_time': (datetime.utcnow() - timedelta(hours=3)).isoformat(), 'logout_time': None, 'session_duration': None},
            {'staff_id': 2, 'staff_name': 'Mary Nyambura', 'login_time': (datetime.utcnow() - timedelta(hours=2)).isoformat(), 'logout_time': None, 'session_duration': None},
            {'staff_id': 3, 'staff_name': 'Grace Muthoni', 'login_time': (datetime.utcnow() - timedelta(hours=1)).isoformat(), 'logout_time': None, 'session_duration': None}
        ]
    }
    
    return jsonify(demo_stats), 200


@bp_dashboard.route('/staff/<int:id>/weekly-transactions', methods=['GET'])
def get_staff_weekly_transactions(id):
    """Get weekly transaction list for a staff member"""
    staff = Staff.query.get_or_404(id)
    
    from datetime import timedelta
    today = date.today()
    week_start = today - timedelta(days=6)  # Last 7 days including today
    
    # Get demo filter
    demo_filter = get_demo_filter(staff, request)
    
    # Get completed sales for the week
    sales = Sale.query.filter(
        Sale.staff_id == id,
        func.date(Sale.created_at) >= week_start,
        Sale.status == 'completed',
        Sale.is_demo == demo_filter['is_demo']
    ).order_by(Sale.created_at.desc()).all()
    
    transactions = []
    for sale in sales:
        payment = sale.payment if hasattr(sale, 'payment') and sale.payment else Payment.query.filter_by(sale_id=sale.id).first()
        transactions.append({
            'id': sale.id,
            'date': sale.created_at.strftime('%Y-%m-%d') if sale.created_at else None,
            'time': sale.created_at.strftime('%H:%M') if sale.created_at else None,
            'customer_name': sale.customer_name or (sale.customer.name if sale.customer else 'Walk-in'),
            'total_amount': round(sale.total_amount, 2),
            'commission': round(sale.commission_amount, 2),
            'payment_method': payment.payment_method if payment else None,
            'receipt_number': payment.receipt_number if payment else None
        })
    
    return jsonify({
        'staff_id': id,
        'staff_name': staff.name,
        'week_start': week_start.isoformat(),
        'week_end': today.isoformat(),
        'transactions': transactions,
        'total_count': len(transactions),
        'total_revenue': round(sum(t['total_amount'] for t in transactions), 2),
        'total_commission': round(sum(t['commission'] for t in transactions), 2)
    }), 200
