"""
Validation functions for the POS Salon backend.
"""
import re
from datetime import datetime


def validate_mpesa_code(code):
    """
    Validate M-Pesa transaction code format.
    
    Args:
        code: Transaction code string
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None, normalized_code: str or None)
    """
    if not code:
        return False, None, None
    
    # M-Pesa codes are 10 alphanumeric characters (uppercase)
    mpesa_pattern = re.compile(r'^[A-Z0-9]{10}$')
    normalized_code = code.upper()
    
    if not mpesa_pattern.match(normalized_code):
        return False, 'Invalid M-Pesa transaction code format. Must be exactly 10 alphanumeric characters (e.g., QGH7X2K9L8)', None
    
    return True, None, normalized_code


def validate_pin_format(pin):
    """
    Validate PIN format: 5 characters, at least one digit and one special character.
    
    Args:
        pin: PIN string
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    if not pin:
        return False, 'PIN is required'
    
    if len(pin) != 5:
        return False, 'PIN must be exactly 5 characters'
    
    # Check if PIN contains at least one digit and one special character
    has_digit = bool(re.search(r'\d', pin))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
    
    if not (has_digit and has_special):
        return False, 'PIN must contain at least one digit and one special character'
    
    return True, None


def validate_date_format(date_string, format_type='iso'):
    """
    Validate and parse date string.
    
    Args:
        date_string: Date string to validate
        format_type: Expected format ('iso' for YYYY-MM-DD)
    
    Returns:
        tuple: (is_valid: bool, parsed_date: datetime.date or None, error_message: str or None)
    """
    if not date_string:
        return False, None, 'Date is required'
    
    try:
        if format_type == 'iso':
            parsed_date = datetime.fromisoformat(date_string).date()
        else:
            # Try generic parsing
            parsed_date = datetime.strptime(date_string, format_type).date()
        
        return True, parsed_date, None
    except (ValueError, AttributeError) as e:
        return False, None, f'Invalid date format. Use YYYY-MM-DD: {str(e)}'


def validate_staff_id(staff_id):
    """
    Validate and convert staff ID to integer.
    
    Args:
        staff_id: Staff ID (can be string or int)
    
    Returns:
        tuple: (is_valid: bool, parsed_id: int or None, error_message: str or None)
    """
    if not staff_id:
        return False, None, 'Staff ID is required'
    
    try:
        staff_id_int = int(staff_id)
        return True, staff_id_int, None
    except (ValueError, TypeError) as e:
        return False, None, f'Invalid Staff ID format: {str(e)}'
