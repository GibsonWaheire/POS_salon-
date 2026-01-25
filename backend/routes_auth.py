"""
Authentication routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app, session
from models import User, Subscription
from db import db
from datetime import datetime
from auth_helpers import require_auth, require_admin
from sqlalchemy.exc import OperationalError, DatabaseError
from error_helpers import get_user_friendly_error, handle_database_error

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
        
        # Check database connection
        try:
            db.session.execute(db.text('SELECT 1'))
        except Exception as db_conn_error:
            return jsonify({
                'success': False,
                'error': get_user_friendly_error(db_conn_error, current_app.debug)
            }), 500
        
        # Check if users table exists
        try:
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            if 'users' not in tables:
                return jsonify({
                    'success': False,
                    'error': get_user_friendly_error('Database not initialized', current_app.debug)
                }), 500
        except Exception as db_check_error:
            # If we can't check, continue and let the query fail with a better error
            pass
        
        # Find user by email - handle missing columns gracefully
        try:
            user = User.query.filter_by(email=email.lower().strip()).first()
        except (OperationalError, DatabaseError) as query_error:
            # Log technical details server-side only
            import traceback
            print(f"Database query error: {str(query_error)}")
            if current_app.debug:
                traceback.print_exc()
            
            # Return user-friendly error
            return jsonify({
                'success': False,
                'error': get_user_friendly_error(query_error, current_app.debug)
            }), 500
        except Exception as query_error:
            import traceback
            print(f"Unexpected error during login: {str(query_error)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({
                'success': False,
                'error': get_user_friendly_error(query_error, current_app.debug)
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
        except (OperationalError, DatabaseError) as commit_error:
            db.session.rollback()
            import traceback
            print(f"Database commit error: {str(commit_error)}")
            if current_app.debug:
                traceback.print_exc()
            # Don't fail login if we can't update last_login
            pass
        except Exception as commit_error:
            db.session.rollback()
            import traceback
            print(f"Error updating last login: {str(commit_error)}")
            if current_app.debug:
                traceback.print_exc()
            # Don't fail login if we can't update last_login
            pass
        
        # Store user ID in session for subsequent requests (if session is available)
        try:
            session['user_id'] = user.id
        except RuntimeError:
            # Session not available (outside request context or not configured)
            pass
        
        # Return user data (without password)
        try:
            user_dict = user.to_dict()
        except (OperationalError, DatabaseError) as dict_error:
            import traceback
            print(f"Error serializing user data: {str(dict_error)}")
            if current_app.debug:
                traceback.print_exc()
            # Fallback user dict if to_dict fails due to missing columns
            user_dict = {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_active': user.is_active
            }
        except Exception as dict_error:
            import traceback
            print(f"Unexpected error serializing user: {str(dict_error)}")
            if current_app.debug:
                traceback.print_exc()
            # Fallback user dict if to_dict fails
            user_dict = {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'is_active': user.is_active
            }
        
        return jsonify({
            'success': True,
            'user': user_dict
        }), 200
        
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Database error in login: {error_msg}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': get_user_friendly_error(e, current_app.debug)
        }), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Error in login: {error_msg}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': get_user_friendly_error(e, current_app.debug)
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
        plan = (data.get('plan') or 'free').strip().lower()
        if plan not in ('free', 'essential', 'advance', 'expert'):
            plan = 'free'

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
        db.session.flush()
        if plan == 'free':
            sub = Subscription(
                user_id=new_user.id,
                plan_name='free',
                status='active',
                stripe_customer_id=None,
                stripe_subscription_id=None,
            )
            db.session.add(sub)
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
        
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Database error in signup: {error_msg}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': get_user_friendly_error(e, current_app.debug)
        }), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Error in signup: {error_msg}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': get_user_friendly_error(e, current_app.debug)
        }), 500
