"""
Utility functions for the POS Salon backend.
"""
from datetime import datetime, date, timedelta
from models import Staff, Sale, SlotBlocker, Appointment
from sqlalchemy import func, and_, or_
from db import db


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


def get_current_week_range():
    """
    Get Monday and Sunday dates for the current week.
    
    Returns:
        tuple: (monday_date, sunday_date) as date objects
    """
    today = date.today()
    # Monday is 0, Sunday is 6
    days_since_monday = today.weekday()
    monday = today - timedelta(days=days_since_monday)
    sunday = monday + timedelta(days=6)
    return monday, sunday


def parse_date(date_string, default=None):
    """
    Safely parse a date string.
    
    Args:
        date_string: Date string in ISO format (YYYY-MM-DD)
        default: Default date to return if parsing fails
    
    Returns:
        date: Parsed date object or default
    """
    if not date_string:
        return default
    
    try:
        if isinstance(date_string, str):
            return datetime.fromisoformat(date_string).date()
        elif isinstance(date_string, date):
            return date_string
        elif isinstance(date_string, datetime):
            return date_string.date()
        return default
    except (ValueError, AttributeError):
        return default


def generate_sale_number():
    """
    Generate unique sale number: SALE-YYYYMMDD-HHMMSS-XXX
    
    Returns:
        str: Unique sale number
    """
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
    
    return sale_number


def format_currency(amount):
    """
    Format amount as Kenyan Shillings.
    
    Args:
        amount: Numeric amount
    
    Returns:
        str: Formatted currency string (e.g., "KES 1,234.56")
    """
    return f"KES {amount:,.2f}"


def calculate_gross_pay(earnings_items):
    """
    Calculate gross pay from earnings items.
    
    Args:
        earnings_items: List of CommissionPaymentItem objects with item_type='earning'
    
    Returns:
        float: Total gross pay
    """
    total = 0.0
    if not earnings_items:
        return total
    for item in earnings_items:
        if hasattr(item, 'amount') and item.amount is not None:
            if not item.is_percentage:
                total += float(item.amount)
            # Note: Percentage-based earnings would need a base amount to calculate from
            # For now, we assume all earnings are fixed amounts
    return round(total, 2)


def calculate_total_deductions(deduction_items, gross_pay=None, base_pay=None):
    """
    Calculate total deductions from deduction items.
    
    Args:
        deduction_items: List of CommissionPaymentItem objects with item_type='deduction'
        gross_pay: Gross pay amount (for percentage calculations)
        base_pay: Base pay amount (for percentage calculations)
    
    Returns:
        float: Total deductions
    """
    total = 0.0
    if not deduction_items:
        return total
    for item in deduction_items:
        if hasattr(item, 'amount') and item.amount is not None:
            if item.is_percentage:
                if item.percentage_of == 'gross_pay' and gross_pay:
                    calculated_amount = gross_pay * (item.amount / 100.0)
                    total += calculated_amount
                elif item.percentage_of == 'base_pay' and base_pay:
                    calculated_amount = base_pay * (item.amount / 100.0)
                    total += calculated_amount
                # If percentage_of is not recognized or base is None, skip
            else:
                total += float(item.amount)
    return round(total, 2)


def calculate_net_pay(gross_pay, total_deductions):
    """
    Calculate net pay.
    
    Args:
        gross_pay: Total gross pay
        total_deductions: Total deductions
    
    Returns:
        float: Net pay (gross_pay - total_deductions)
    """
    gross_pay = float(gross_pay) if gross_pay is not None else 0.0
    total_deductions = float(total_deductions) if total_deductions is not None else 0.0
    return round(gross_pay - total_deductions, 2)


def check_slot_availability(staff_id, start_time, end_time, exclude_appointment_id=None, is_demo=False):
    """
    Check if a time slot is available (not blocked by slot blockers).
    
    Args:
        staff_id: Staff ID (can be None for all staff)
        start_time: Start datetime
        end_time: End datetime
        exclude_appointment_id: Appointment ID to exclude from conflict check
        is_demo: Whether to check demo blockers
    
    Returns:
        tuple: (is_available: bool, blocker: SlotBlocker or None, error_message: str or None)
    """
    try:
        # Check slot blockers that overlap with the requested time
        query = SlotBlocker.query.filter(
            SlotBlocker.is_demo == is_demo,
            or_(
                SlotBlocker.staff_id == staff_id,
                SlotBlocker.staff_id.is_(None)  # Applies to all staff
            ),
            and_(
                SlotBlocker.start_date < end_time,
                SlotBlocker.end_date > start_time
            )
        )
        
        blocker = query.first()
        
        if blocker:
            reason = blocker.reason or "Time slot is blocked"
            return False, blocker, reason
        
        return True, None, None
    
    except Exception as e:
        return False, None, f"Error checking slot availability: {str(e)}"


def generate_recurring_appointments(pattern, start_date, end_date, template_appointment_data):
    """
    Generate list of dates for recurring appointments.
    
    Args:
        pattern: 'daily', 'weekly', or 'monthly'
        start_date: Start datetime
        end_date: End datetime
        template_appointment_data: Dict with appointment data template
    
    Returns:
        list: List of datetime objects for recurring appointments
    """
    dates = []
    current = start_date
    
    delta_map = {
        'daily': timedelta(days=1),
        'weekly': timedelta(weeks=1),
        'monthly': timedelta(days=30)  # Approximate
    }
    
    delta = delta_map.get(pattern.lower())
    if not delta:
        return dates  # Invalid pattern
    
    while current <= end_date:
        dates.append(current)
        if pattern.lower() == 'monthly':
            # For monthly, try to add exactly one month
            try:
                if current.month == 12:
                    current = current.replace(year=current.year + 1, month=1)
                else:
                    current = current.replace(month=current.month + 1)
            except:
                # Fallback to approximate 30 days
                current += timedelta(days=30)
        else:
            current += delta
    
    return dates


def export_appointments_ical(appointments):
    """
    Generate iCal format string for appointments.
    
    Args:
        appointments: List of Appointment objects
    
    Returns:
        str: iCal format string
    """
    ical_lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Salonyst//Appointments//EN",
        "CALSCALE:GREGORIAN"
    ]
    
    for apt in appointments:
        ical_lines.extend([
            "BEGIN:VEVENT",
            f"UID:appointment-{apt.id}@salonyst",
            f"DTSTART:{apt.appointment_date.strftime('%Y%m%dT%H%M%S')}",
            f"DTEND:{(apt.appointment_date + timedelta(hours=1)).strftime('%Y%m%dT%H%M%S')}",  # Assume 1 hour duration
            f"SUMMARY:{apt.customer.name if apt.customer else 'Appointment'}",
            f"DESCRIPTION:Appointment #{apt.id}",
            f"STATUS:{apt.status.upper()}",
            "END:VEVENT"
        ])
    
    ical_lines.append("END:VCALENDAR")
    return "\r\n".join(ical_lines)


def export_appointments_csv(appointments):
    """
    Generate CSV format string for appointments.
    
    Args:
        appointments: List of Appointment objects
    
    Returns:
        str: CSV format string
    """
    import csv
    from io import StringIO
    
    output = StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'ID', 'Date', 'Time', 'Customer', 'Phone', 'Staff', 'Services', 
        'Status', 'Location', 'Resource', 'Color', 'Notes'
    ])
    
    # Rows
    for apt in appointments:
        services = ', '.join([s.service.name for s in apt.services if s.service]) if apt.services else ''
        writer.writerow([
            apt.id,
            apt.appointment_date.strftime('%Y-%m-%d') if apt.appointment_date else '',
            apt.appointment_date.strftime('%H:%M') if apt.appointment_date else '',
            apt.customer.name if apt.customer else '',
            apt.customer.phone if apt.customer else '',
            apt.staff.name if apt.staff else '',
            services,
            apt.status,
            apt.service_location or 'salon',
            apt.resource.name if apt.resource else '',
            apt.color or '',
            apt.notes or ''
        ])
    
    return output.getvalue()
