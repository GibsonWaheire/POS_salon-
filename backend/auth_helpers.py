"""
Authentication and authorization helpers for the POS Salon backend.
"""
from functools import wraps
from flask import request, jsonify, g, session
from models import User
from db import db


def get_current_user():
    """
    Get current user from request.
    First checks session, then request headers, then query params.
    In production, use JWT tokens or proper session management.
    """
    # Try session first (if using Flask sessions)
    try:
        user_id = session.get('user_id')
    except RuntimeError:
        # Session not available (outside request context)
        user_id = None
    
    # Try headers
    if not user_id:
        user_id = request.headers.get('X-User-Id')
    
    # Try query params (for development/testing)
    if not user_id:
        user_id = request.args.get('user_id')
    
    # Try JSON body (for some endpoints)
    if not user_id and request.is_json:
        try:
            user_id = request.get_json().get('user_id')
        except:
            pass
    
    if not user_id:
        return None
    
    try:
        return User.query.get(int(user_id))
    except (ValueError, TypeError, RuntimeError):
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function


def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        if not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function


def require_manager_or_admin(f):
    """Decorator to require manager or admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        if not user.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        if not (user.is_admin() or user.is_manager()):
            return jsonify({'error': 'Manager or admin access required'}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function


def can_manage_user(current_user, target_user):
    """
    Check if current user can manage target user.
    Admin can manage everyone, managers cannot manage other managers.
    """
    if current_user.is_admin():
        return True
    if current_user.is_manager() and target_user.is_manager():
        return False
    return False
