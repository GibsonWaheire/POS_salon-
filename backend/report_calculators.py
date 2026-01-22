"""
Report calculation functions for the POS Salon backend.
"""
from datetime import datetime, date, timedelta
from sqlalchemy import func
from models import Sale, Payment, Expense, CommissionPayment
from utils import get_demo_filter


def _calculate_services_products_revenue(sales):
    """
    Calculate revenue breakdown from sales (services vs products).
    
    Args:
        sales: List of Sale objects
    
    Returns:
        tuple: (services_revenue, products_revenue, total_revenue)
    """
    services_revenue = 0
    products_revenue = 0
    
    for sale in sales:
        # Revenue from services
        for sale_service in sale.sale_services:
            services_revenue += sale_service.total_price
        
        # Revenue from products
        for sale_product in sale.sale_products:
            products_revenue += sale_product.total_price
    
    total_revenue = services_revenue + products_revenue
    return services_revenue, products_revenue, total_revenue


def calculate_daily_sales_report(target_date, demo_filter, db_session):
    """
    Calculate daily sales report (Z-report).
    
    Args:
        target_date: date object for the report date
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Report data
    """
    # Get all completed sales for the date
    start_datetime = datetime.combine(target_date, datetime.min.time())
    end_datetime = datetime.combine(target_date, datetime.max.time())
    
    sales = db_session.query(Sale).filter(
        Sale.status == 'completed',
        Sale.created_at >= start_datetime,
        Sale.created_at <= end_datetime,
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    # Calculate totals from sales - separate services and products
    services_revenue, products_revenue, total_revenue = _calculate_services_products_revenue(sales)
    
    total_commission = sum(sale.commission_amount for sale in sales)  # Commission only from services
    
    # Payment method breakdown - get from payments
    payment_methods = {}
    payments_list = []
    for sale in sales:
        payment = sale.payment if hasattr(sale, 'payment') and sale.payment else db_session.query(Payment).filter_by(sale_id=sale.id).first()
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
    
    return {
        'date': target_date.isoformat(),
        'total_revenue': round(total_revenue, 2),
        'services_revenue': round(services_revenue, 2),
        'products_revenue': round(products_revenue, 2),
        'revenue_before_vat': round(revenue_before_vat, 2),
        'vat_amount': round(vat_amount, 2),
        'vat_rate': vat_rate,
        'total_commission': round(total_commission, 2),
        'transaction_count': transaction_count,
        'payment_methods': {k: round(v, 2) for k, v in payment_methods.items()},
        'payments': [p.to_dict() for p in payments_list]
    }


def calculate_commission_payout_report(start_date, end_date, staff_id, demo_filter, db_session):
    """
    Calculate commission payout report for staff.
    
    Args:
        start_date: datetime object for start date
        end_date: datetime object for end date
        staff_id: Optional staff ID to filter by
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Report data
    """
    # Get completed sales in date range
    query = db_session.query(Sale).filter(
        Sale.status == 'completed',
        Sale.created_at >= start_date,
        Sale.created_at <= end_date,
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
    
    # Round values and subtract paid commissions
    for staff_id_key in staff_commissions:
        staff_commissions[staff_id_key]['total_sales'] = round(staff_commissions[staff_id_key]['total_sales'], 2)
        staff_commissions[staff_id_key]['total_commission'] = round(staff_commissions[staff_id_key]['total_commission'], 2)
        
        # Get paid commissions for this staff
        paid_commissions = db_session.query(func.sum(CommissionPayment.amount_paid)).filter(
            CommissionPayment.staff_id == staff_id_key,
            CommissionPayment.is_demo == demo_filter['is_demo']
        ).scalar() or 0
        
        staff_commissions[staff_id_key]['paid_amount'] = round(paid_commissions, 2)
        staff_commissions[staff_id_key]['pending_amount'] = round(
            staff_commissions[staff_id_key]['total_commission'] - paid_commissions, 2
        )
    
    total_commission = sum(s['total_commission'] for s in staff_commissions.values())
    total_paid = sum(s['paid_amount'] for s in staff_commissions.values())
    total_pending = sum(s['pending_amount'] for s in staff_commissions.values())
    
    return {
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'staff_commissions': list(staff_commissions.values()),
        'total_commission_payout': round(total_commission, 2),
        'total_commission_paid': round(total_paid, 2),
        'total_commission_pending': round(total_pending, 2),
        'total_staff': len(staff_commissions)
    }


def calculate_financial_summary(start_date, end_date, demo_filter, db_session):
    """
    Calculate financial summary (P&L, cash flow).
    
    Args:
        start_date: datetime object for start date
        end_date: datetime object for end date
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Summary data
    """
    # Revenue from completed sales - separate services and products
    sales = db_session.query(Sale).filter(
        Sale.status == 'completed',
        Sale.created_at >= start_date,
        Sale.created_at <= end_date,
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    services_revenue, products_revenue, total_revenue = _calculate_services_products_revenue(sales)
    
    vat_rate = 0.16
    vat_amount = total_revenue * vat_rate / (1 + vat_rate)
    revenue_before_vat = total_revenue - vat_amount
    
    # Expenses
    expenses = db_session.query(Expense).filter(
        Expense.expense_date >= start_date,
        Expense.expense_date <= end_date,
        Expense.is_demo == demo_filter['is_demo']
    ).all()
    
    total_expenses = sum(e.amount for e in expenses)
    
    # Expenses by category
    expenses_by_category = {}
    for expense in expenses:
        category = expense.category or 'other'
        expenses_by_category[category] = expenses_by_category.get(category, 0) + expense.amount
    
    # Commission from sales (earned)
    total_commission_earned = sum(sale.commission_amount for sale in sales)
    
    # Commission paid (from CommissionPayment table)
    commission_payments = db_session.query(CommissionPayment).filter(
        CommissionPayment.is_demo == demo_filter['is_demo']
    ).all()
    total_commission_paid = sum(cp.amount_paid for cp in commission_payments)
    total_commission_pending = total_commission_earned - total_commission_paid
    
    # Profit calculation: Revenue - Expenses - Commission Earned
    # Using total_revenue (including VAT) as requested
    net_profit = total_revenue - total_expenses - total_commission_earned
    profit_margin = round((net_profit / total_revenue * 100) if total_revenue > 0 else 0, 2)
    
    return {
        'period': {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat()
        },
        'revenue': {
            'total_revenue': round(total_revenue, 2),
            'services_revenue': round(services_revenue, 2),
            'products_revenue': round(products_revenue, 2),
            'revenue_before_vat': round(revenue_before_vat, 2),
            'vat_amount': round(vat_amount, 2),
            'vat_rate': vat_rate
        },
        'costs': {
            'total_commission_earned': round(total_commission_earned, 2),
            'total_commission_paid': round(total_commission_paid, 2),
            'total_commission_pending': round(total_commission_pending, 2),
            'total_expenses': round(total_expenses, 2),
            'expenses_by_category': {k: round(v, 2) for k, v in expenses_by_category.items()}
        },
        'profit': {
            'net_profit': round(net_profit, 2),
            'profit_margin': profit_margin,
            'calculation': 'Revenue - Expenses - Commission Earned'
        }
    }


def calculate_tax_report(month, demo_filter, db_session):
    """
    Calculate tax report for KRA filing.
    
    Args:
        month: str in format 'YYYY-MM' or None for current month
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Tax report data
    """
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
    
    # Get all completed sales for the month
    sales = db_session.query(Sale).filter(
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
    
    return {
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
    }
