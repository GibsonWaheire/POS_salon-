"""
Authentication routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app, session
from models import User
from db import db
from datetime import datetime
from auth_helpers import require_auth, require_admin

bp_auth = Blueprint('auth', __name__)


@bp_auth.route('/auth/login', methods=['POST'])
def login():
    """Authenticate manager/admin user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Invalid request data'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        # Check if users table exists
        try:
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            if 'users' not in inspector.get_table_names():
                return jsonify({
                    'success': False,
                    'error': 'Database not initialized. Please run: flask db upgrade'
                }), 500
        except Exception as db_check_error:
            # If we can't check, continue and let the query fail with a better error
            pass
        
        # Find user by email
        try:
            user = User.query.filter_by(email=email.lower().strip()).first()
        except Exception as query_error:
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': f'Database error: {str(query_error)}. Please run: flask db upgrade'
            }), 500
        
        if not user:
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'error': 'Account is inactive'}), 403
        
        # Verify password
        if not user.check_password(password):
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        # Update last login
        try:
            user.last_login = datetime.utcnow()
            db.session.commit()
        except Exception as commit_error:
            db.session.rollback()
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': f'Database error: {str(commit_error)}'
            }), 500
        
        # Store user ID in session for subsequent requests (if session is available)
        try:
            session['user_id'] = user.id
        except RuntimeError:
            # Session not available (outside request context or not configured)
            pass
        
        # Return user data (without password)
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Error in login: {error_msg}")
        traceback.print_exc()
        if current_app.debug:
            return jsonify({
                'success': False,
                'error': f'An error occurred during login: {error_msg}'
            }), 500
        return jsonify({
            'success': False,
            'error': 'An error occurred during login. Please try again.'
        }), 500


@bp_auth.route('/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
    from flask import g
    return jsonify({
        'success': True,
        'user': g.current_user.to_dict()
    }), 200


@bp_auth.route('/auth/logout', methods=['POST'])
def logout():
    """Logout user (client-side session cleanup)"""
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200


@bp_auth.route('/auth/signup', methods=['POST'])
def signup():
    """Register a new user (manager account)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Invalid request data'}), 400
        
        email = data.get('email', '').lower().strip()
        password = data.get('password')
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        
        # Validation
        if not email or not password or not name:
            return jsonify({'success': False, 'error': 'Email, password, and name are required'}), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'error': 'Email already registered'}), 400
        
        # Create new user (default role is 'manager')
        new_user = User(
            email=email,
            name=name,
            phone=phone if phone else None,
            role='manager',  # New signups are managers by default
            is_active=True,
            is_demo=False
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Store user ID in session
        try:
            session['user_id'] = new_user.id
        except RuntimeError:
            pass
        
        return jsonify({
            'success': True,
            'user': new_user.to_dict(),
            'message': 'Account created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Error in signup: {error_msg}")
        traceback.print_exc()
        if current_app.debug:
            return jsonify({
                'success': False,
                'error': f'An error occurred during signup: {error_msg}'
            }), 500
        return jsonify({
            'success': False,
            'error': 'An error occurred during signup. Please try again.'
        }), 500
