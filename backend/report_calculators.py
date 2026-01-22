"""
Report calculation functions for the POS Salon backend.
"""
from datetime import datetime, date, timedelta
from sqlalchemy import func, or_, and_
from models import Sale, Payment, Expense, CommissionPayment, CommissionPaymentItem, Staff
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


def calculate_commission_payout_report(start_date, end_date, staff_id, demo_filter, db_session, use_detailed=False):
    """
    Calculate commission payout report for staff.
    
    Args:
        start_date: datetime object for start date
        end_date: datetime object for end date
        staff_id: Optional staff ID to filter by
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
        use_detailed: If True, use detailed structure with earnings/deductions breakdown
    
    Returns:
        dict: Report data
    """
    if use_detailed:
        return calculate_detailed_commission_payout_report(start_date, end_date, staff_id, demo_filter, db_session)
    
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
    # Use gross_pay if available, otherwise fall back to amount_paid
    for staff_id_key in staff_commissions:
        staff_commissions[staff_id_key]['total_sales'] = round(staff_commissions[staff_id_key]['total_sales'], 2)
        staff_commissions[staff_id_key]['total_commission'] = round(staff_commissions[staff_id_key]['total_commission'], 2)
        
        # Get paid commissions - prefer gross_pay if available, otherwise use amount_paid
        paid_query = db_session.query(CommissionPayment).filter(
            CommissionPayment.staff_id == staff_id_key,
            CommissionPayment.is_demo == demo_filter['is_demo']
        )
        
        # Calculate paid amount using gross_pay if available
        paid_commissions = 0
        payments = paid_query.all()
        for payment in payments:
            if payment.gross_pay is not None:
                paid_commissions += payment.gross_pay
            else:
                paid_commissions += payment.amount_paid
        
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


def calculate_detailed_commission_payout_report(start_date, end_date, staff_id, demo_filter, db_session):
    """
    Calculate detailed commission payout report with earnings/deductions breakdown.
    
    Args:
        start_date: datetime object for start date
        end_date: datetime object for end date
        staff_id: Optional staff ID to filter by
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Detailed report data with earnings/deductions breakdown
    """
    # Get commission payments in date range (filter by payment_date or period)
    query = db_session.query(CommissionPayment).filter(
        CommissionPayment.is_demo == demo_filter['is_demo'],
        or_(
            and_(
                CommissionPayment.payment_date >= start_date,
                CommissionPayment.payment_date <= end_date
            ),
            and_(
                CommissionPayment.period_start <= end_date.date(),
                CommissionPayment.period_end >= start_date.date()
            )
        )
    )
    
    if staff_id:
        query = query.filter(CommissionPayment.staff_id == staff_id)
    
    payments = query.order_by(CommissionPayment.period_start, CommissionPayment.staff_id).all()
    
    # Group by staff
    staff_data = {}
    
    for payment in payments:
        staff_id_key = payment.staff_id
        
        if staff_id_key not in staff_data:
            staff = Staff.query.get(staff_id_key)
            staff_data[staff_id_key] = {
                'staff_id': staff_id_key,
                'staff_name': staff.name if staff else f'Staff {staff_id_key}',
                'payments': [],
                'totals': {
                    'total_gross_pay': 0,
                    'total_deductions': 0,
                    'total_net_pay': 0,
                    'total_base_pay': 0,
                    'total_commissions': 0,
                    'total_bonuses': 0,
                    'total_tips': 0
                }
            }
        
        # Get earnings and deductions breakdown
        earnings_items = [item for item in payment.items if item.item_type == 'earning'] if payment.items else []
        deductions_items = [item for item in payment.items if item.item_type == 'deduction'] if payment.items else []
        
        # Organize earnings breakdown
        earnings_breakdown = {
            'base_pay': payment.base_pay or 0,
            'commissions': [],
            'bonuses': 0,
            'tips': 0,
            'other': []
        }
        
        total_commissions = 0
        for item in earnings_items:
            if 'Commission' in item.item_name:
                total_commissions += item.amount
                earnings_breakdown['commissions'].append({
                    'sale_number': item.sale_number,
                    'service': item.service_name or item.item_name,
                    'amount': round(item.amount, 2)
                })
            elif 'Bonus' in item.item_name:
                earnings_breakdown['bonuses'] += item.amount
            elif 'Tip' in item.item_name:
                earnings_breakdown['tips'] += item.amount
            else:
                earnings_breakdown['other'].append({
                    'name': item.item_name,
                    'amount': round(item.amount, 2)
                })
        
        earnings_breakdown['bonuses'] = round(earnings_breakdown['bonuses'], 2)
        earnings_breakdown['tips'] = round(earnings_breakdown['tips'], 2)
        
        # Organize deductions breakdown
        deductions_breakdown = {}
        for item in deductions_items:
            item_name_lower = item.item_name.lower()
            if 'nssf' in item_name_lower:
                deductions_breakdown['nssf'] = round(item.amount if not item.is_percentage else 
                    (payment.gross_pay * item.amount / 100.0 if payment.gross_pay else 0), 2)
            elif 'nhif' in item_name_lower:
                deductions_breakdown['nhif'] = round(item.amount if not item.is_percentage else 
                    (payment.gross_pay * item.amount / 100.0 if payment.gross_pay else 0), 2)
            elif 'paye' in item_name_lower or 'tax' in item_name_lower:
                deductions_breakdown['paye'] = round(item.amount if not item.is_percentage else 
                    (payment.gross_pay * item.amount / 100.0 if payment.gross_pay else 0), 2)
            else:
                key = item.item_name.lower().replace(' ', '_')
                deductions_breakdown[key] = round(item.amount if not item.is_percentage else 
                    (payment.gross_pay * item.amount / 100.0 if payment.gross_pay else 0), 2)
        
        payment_data = {
            'payment_id': payment.id,
            'receipt_number': payment.receipt_number,
            'period_start': payment.period_start.isoformat() if payment.period_start else None,
            'period_end': payment.period_end.isoformat() if payment.period_end else None,
            'payment_date': payment.payment_date.isoformat() if payment.payment_date else None,
            'base_pay': round(payment.base_pay or 0, 2),
            'gross_pay': round(payment.gross_pay or payment.amount_paid or 0, 2),
            'total_deductions': round(payment.total_deductions or 0, 2),
            'net_pay': round(payment.net_pay or payment.amount_paid or 0, 2),
            'earnings_breakdown': earnings_breakdown,
            'deductions_breakdown': deductions_breakdown
        }
        
        staff_data[staff_id_key]['payments'].append(payment_data)
        
        # Update totals
        totals = staff_data[staff_id_key]['totals']
        totals['total_gross_pay'] += payment_data['gross_pay']
        totals['total_deductions'] += payment_data['total_deductions']
        totals['total_net_pay'] += payment_data['net_pay']
        totals['total_base_pay'] += payment_data['base_pay']
        totals['total_commissions'] += total_commissions
        totals['total_bonuses'] += earnings_breakdown['bonuses']
        totals['total_tips'] += earnings_breakdown['tips']
    
    # Round totals
    for staff_id_key in staff_data:
        totals = staff_data[staff_id_key]['totals']
        for key in totals:
            totals[key] = round(totals[key], 2)
    
    # Calculate summary totals
    summary_totals = {
        'total_gross_pay': round(sum(s['totals']['total_gross_pay'] for s in staff_data.values()), 2),
        'total_deductions': round(sum(s['totals']['total_deductions'] for s in staff_data.values()), 2),
        'total_net_pay': round(sum(s['totals']['total_net_pay'] for s in staff_data.values()), 2),
        'total_staff': len(staff_data)
    }
    
    # Determine period type
    period_type = 'custom'
    if payments:
        first_payment = payments[0]
        period_days = (first_payment.period_end - first_payment.period_start).days + 1
        if period_days == 7:
            period_type = 'weekly'
        elif period_days >= 28 and period_days <= 31:
            period_type = 'monthly'
    
    return {
        'period': {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'period_type': period_type
        },
        'staff_commissions': list(staff_data.values()),
        'summary': summary_totals
    }


def calculate_financial_summary(start_date, end_date, demo_filter, db_session, compare_with_previous=False):
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
    
    # Commission from sales (earned) - this is what staff earned from sales
    total_commission_earned = sum(sale.commission_amount for sale in sales)
    
    # Commission payments made in this period (use gross_pay for accurate cost calculation)
    commission_payments = db_session.query(CommissionPayment).filter(
        CommissionPayment.is_demo == demo_filter['is_demo'],
        CommissionPayment.payment_date >= start_date,
        CommissionPayment.payment_date <= end_date
    ).all()
    
    # Calculate accurate commission costs using new structure
    total_base_pay = 0
    total_commissions_paid = 0
    total_bonuses_paid = 0
    total_tips_paid = 0
    total_gross_pay = 0
    total_deductions = 0
    total_net_paid = 0
    
    for payment in commission_payments:
        if payment.gross_pay is not None:
            total_gross_pay += payment.gross_pay
        else:
            total_gross_pay += payment.amount_paid
        
        if payment.base_pay:
            total_base_pay += payment.base_pay
        
        if payment.total_deductions:
            total_deductions += payment.total_deductions
        
        if payment.net_pay:
            total_net_paid += payment.net_pay
        else:
            total_net_paid += payment.amount_paid
        
        # Breakdown from items if available
        if payment.items:
            for item in payment.items:
                if item.item_type == 'earning':
                    if 'Commission' in item.item_name:
                        total_commissions_paid += item.amount
                    elif 'Bonus' in item.item_name:
                        total_bonuses_paid += item.amount
                    elif 'Tip' in item.item_name:
                        total_tips_paid += item.amount
    
    # Fallback: if no detailed structure, use amount_paid
    if total_gross_pay == 0:
        total_gross_pay = sum(cp.amount_paid for cp in commission_payments)
        total_net_paid = total_gross_pay
    
    total_commission_pending = total_commission_earned - total_commissions_paid
    
    # Calculate cash flow
    cash_flow_data = calculate_cash_flow(start_date, end_date, demo_filter, db_session, 
                                         total_expenses, total_gross_pay)
    
    # Profit calculation: Revenue - Expenses - Total Labor Costs (gross pay)
    # Labor costs = gross pay (includes base pay, commissions, bonuses, before deductions)
    net_profit = total_revenue - total_expenses - total_gross_pay
    profit_margin = round((net_profit / total_revenue * 100) if total_revenue > 0 else 0, 2)
    
    # Additional metrics
    transaction_count = len(sales)
    avg_transaction_value = round(total_revenue / transaction_count, 2) if transaction_count > 0 else 0
    
    # Get unique staff count
    unique_staff = set(sale.staff_id for sale in sales if sale.staff_id)
    revenue_per_staff = round(total_revenue / len(unique_staff), 2) if unique_staff else 0
    
    commission_rate = round((total_commission_earned / total_revenue * 100) if total_revenue > 0 else 0, 2)
    operating_margin = profit_margin
    
    result = {
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
            'commission_costs': {
                'total_base_pay': round(total_base_pay, 2),
                'total_commissions': round(total_commissions_paid, 2),
                'total_bonuses': round(total_bonuses_paid, 2),
                'total_tips': round(total_tips_paid, 2),
                'total_deductions': round(total_deductions, 2),
                'total_gross_pay': round(total_gross_pay, 2),
                'total_net_paid': round(total_net_paid, 2)
            },
            'total_commission_earned': round(total_commission_earned, 2),
            'total_commission_paid': round(total_commissions_paid, 2),
            'total_commission_pending': round(total_commission_pending, 2),
            'total_expenses': round(total_expenses, 2),
            'expenses_by_category': {k: round(v, 2) for k, v in expenses_by_category.items()}
        },
        'cash_flow': cash_flow_data,
        'profit': {
            'net_profit': round(net_profit, 2),
            'profit_margin': profit_margin,
            'calculation': 'Revenue - Expenses - Total Labor Costs (Gross Pay)'
        },
        'metrics': {
            'transaction_count': transaction_count,
            'avg_transaction_value': avg_transaction_value,
            'revenue_per_staff': revenue_per_staff,
            'commission_rate': commission_rate,
            'operating_margin': operating_margin
        }
    }
    
    # Add period comparison if requested
    if compare_with_previous:
        period_days = (end_date.date() - start_date.date()).days + 1
        prev_start = start_date - timedelta(days=period_days)
        prev_end = start_date - timedelta(days=1)
        comparison_data = calculate_period_comparison(
            result, prev_start, prev_end, demo_filter, db_session
        )
        result['comparison'] = comparison_data
    
    return result


def calculate_cash_flow(start_date, end_date, demo_filter, db_session, total_expenses, total_commission_costs):
    """
    Calculate cash flow analysis.
    
    Args:
        start_date: datetime object for start date
        end_date: datetime object for end date
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
        total_expenses: Total expenses for the period
        total_commission_costs: Total commission costs (gross pay) for the period
    
    Returns:
        dict: Cash flow data
    """
    # Cash in: Total payments received
    payments = db_session.query(Payment).filter(
        Payment.created_at >= start_date,
        Payment.created_at <= end_date,
        Payment.status == 'completed'
    ).join(Sale).filter(
        Sale.is_demo == demo_filter['is_demo']
    ).all()
    
    cash_in = sum(p.amount for p in payments)
    
    # Payment method breakdown
    payment_methods = {}
    for payment in payments:
        method = payment.payment_method or 'cash'
        payment_methods[method] = payment_methods.get(method, 0) + payment.amount
    
    # Cash out: Expenses + Commission payments made
    cash_out = total_expenses + total_commission_costs
    
    # Net cash flow
    net_cash_flow = cash_in - cash_out
    
    # Daily breakdown
    daily_breakdown = []
    current_date = start_date.date()
    end_date_only = end_date.date()
    
    while current_date <= end_date_only:
        day_start = datetime.combine(current_date, datetime.min.time())
        day_end = datetime.combine(current_date, datetime.max.time())
        
        day_payments = db_session.query(Payment).filter(
            Payment.created_at >= day_start,
            Payment.created_at <= day_end,
            Payment.status == 'completed'
        ).join(Sale).filter(
            Sale.is_demo == demo_filter['is_demo']
        ).all()
        
        day_expenses = db_session.query(Expense).filter(
            Expense.expense_date >= day_start,
            Expense.expense_date <= day_end,
            Expense.is_demo == demo_filter['is_demo']
        ).all()
        
        day_commissions = db_session.query(CommissionPayment).filter(
            CommissionPayment.payment_date >= day_start,
            CommissionPayment.payment_date <= day_end,
            CommissionPayment.is_demo == demo_filter['is_demo']
        ).all()
        
        day_cash_in = sum(p.amount for p in day_payments)
        day_cash_out = sum(e.amount for e in day_expenses) + sum(
            cp.gross_pay if cp.gross_pay else cp.amount_paid for cp in day_commissions
        )
        
        daily_breakdown.append({
            'date': current_date.isoformat(),
            'cash_in': round(day_cash_in, 2),
            'cash_out': round(day_cash_out, 2),
            'net_flow': round(day_cash_in - day_cash_out, 2)
        })
        
        current_date += timedelta(days=1)
    
    return {
        'cash_in': round(cash_in, 2),
        'cash_out': round(cash_out, 2),
        'net_cash_flow': round(net_cash_flow, 2),
        'payment_methods': {k: round(v, 2) for k, v in payment_methods.items()},
        'daily_breakdown': daily_breakdown
    }


def calculate_period_comparison(current_data, prev_start, prev_end, demo_filter, db_session):
    """
    Calculate period-over-period comparison.
    
    Args:
        current_data: Current period financial summary data
        prev_start: Previous period start date
        prev_end: Previous period end date
        demo_filter: dict with 'is_demo' key for filtering
        db_session: SQLAlchemy session
    
    Returns:
        dict: Comparison data with variances
    """
    prev_summary = calculate_financial_summary(prev_start, prev_end, demo_filter, db_session, compare_with_previous=False)
    
    def calculate_variance(current, previous):
        if previous == 0:
            return {'amount': current, 'percentage': 100.0 if current > 0 else 0.0}
        variance = current - previous
        percentage = (variance / previous) * 100
        return {
            'amount': round(variance, 2),
            'percentage': round(percentage, 2)
        }
    
    return {
        'previous_period': {
            'start_date': prev_start.isoformat(),
            'end_date': prev_end.isoformat(),
            'revenue': prev_summary['revenue']['total_revenue'],
            'expenses': prev_summary['costs']['total_expenses'],
            'commission_costs': prev_summary['costs']['commission_costs']['total_gross_pay'],
            'net_profit': prev_summary['profit']['net_profit']
        },
        'variance': {
            'revenue': calculate_variance(
                current_data['revenue']['total_revenue'],
                prev_summary['revenue']['total_revenue']
            ),
            'expenses': calculate_variance(
                current_data['costs']['total_expenses'],
                prev_summary['costs']['total_expenses']
            ),
            'commission_costs': calculate_variance(
                current_data['costs']['commission_costs']['total_gross_pay'],
                prev_summary['costs']['commission_costs']['total_gross_pay']
            ),
            'net_profit': calculate_variance(
                current_data['profit']['net_profit'],
                prev_summary['profit']['net_profit']
            )
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
