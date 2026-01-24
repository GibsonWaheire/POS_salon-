"""
Utility function for user-friendly error messages.
Can be imported by other route files for consistent error handling.
"""
from flask import current_app
from sqlalchemy.exc import OperationalError, DatabaseError


def get_user_friendly_error(error, is_debug=None):
    """
    Convert technical errors to user-friendly messages.
    
    Args:
        error: Exception object or error string
        is_debug: Boolean indicating if debug mode is enabled. 
                 If None, will try to get from current_app
    
    Returns:
        str: User-friendly error message
    """
    if is_debug is None:
        try:
            is_debug = current_app.debug if current_app else False
        except RuntimeError:
            is_debug = False
    
    error_str = str(error).lower()
    
    # Database schema errors (missing columns, tables, etc.)
    if 'no such column' in error_str or 'no such table' in error_str:
        if is_debug:
            return 'Database schema is out of date. Please contact support or run database migration.'
        return 'System maintenance required. Please contact support.'
    
    # Database connection/locking errors
    if 'database' in error_str and ('locked' in error_str or 'connection' in error_str or 'unavailable' in error_str):
        if is_debug:
            return 'Database is temporarily unavailable. Please try again in a moment.'
        return 'Service temporarily unavailable. Please try again.'
    
    # Generic database/SQL errors
    if 'database' in error_str or 'sql' in error_str or 'operationalerror' in error_str:
        if is_debug:
            return 'A database error occurred. Please try again or contact support.'
        return 'An error occurred. Please try again.'
    
    # Integrity/constraint errors
    if 'unique' in error_str or 'constraint' in error_str or 'integrity' in error_str:
        if is_debug:
            return 'This record already exists or conflicts with existing data.'
        return 'This action cannot be completed. The information may already exist.'
    
    # Permission/authentication errors
    if 'permission' in error_str or 'unauthorized' in error_str or 'forbidden' in error_str:
        return 'You do not have permission to perform this action.'
    
    # Default - show technical details only in debug mode
    if is_debug:
        return f'An error occurred: {str(error)}'
    return 'An unexpected error occurred. Please try again.'


def handle_database_error(error, rollback_session=None):
    """
    Handle database errors consistently across routes.
    
    Args:
        error: Exception object
        rollback_session: SQLAlchemy session to rollback if provided
    
    Returns:
        tuple: (error_message, status_code)
    """
    if rollback_session:
        try:
            rollback_session.rollback()
        except Exception:
            pass
    
    # Log technical details server-side
    import traceback
    print(f"Database error: {str(error)}")
    try:
        if current_app and current_app.debug:
            traceback.print_exc()
    except RuntimeError:
        pass
    
    is_debug = False
    try:
        is_debug = current_app.debug if current_app else False
    except RuntimeError:
        pass
    
    return get_user_friendly_error(error, is_debug), 500
