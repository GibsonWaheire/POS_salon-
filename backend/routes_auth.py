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
import os
import requests

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
        
        # Check if user is a Google OAuth user trying to use password
        if user.is_google_user():
            return jsonify({
                'success': False,
                'error': 'This account uses Google sign-in. Please use Google to login.'
            }), 401
        
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


@bp_auth.route('/auth/google', methods=['POST'])
def google_auth():
    """Authenticate user with Google OAuth token"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Invalid request data'}), 400
        
        id_token = data.get('id_token')
        if not id_token:
            return jsonify({'success': False, 'error': 'Google ID token is required'}), 400
        
        # Verify Google token
        try:
            # Verify token with Google
            verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            response = requests.get(verify_url, timeout=10)
            
            if response.status_code != 200:
                return jsonify({'success': False, 'error': 'Invalid Google token'}), 401
            
            google_data = response.json()
            
            # Extract user info
            google_id = google_data.get('sub')
            google_email = google_data.get('email', '').lower().strip()
            google_name = google_data.get('name', '').strip()
            
            if not google_id or not google_email:
                return jsonify({'success': False, 'error': 'Invalid Google token data'}), 400
            
            # Check database connection
            try:
                db.session.execute(db.text('SELECT 1'))
            except Exception as db_conn_error:
                return jsonify({
                    'success': False,
                    'error': get_user_friendly_error(db_conn_error, current_app.debug)
                }), 500
            
            # Find existing user by Google ID or email
            user = User.query.filter(
                (User.google_id == google_id) | (User.email == google_email)
            ).first()
            
            if user:
                # Update user info if needed
                if not user.google_id:
                    user.google_id = google_id
                if not user.google_email:
                    user.google_email = google_email
                if user.auth_provider != 'google':
                    user.auth_provider = 'google'
                if not user.name or user.name != google_name:
                    user.name = google_name
                user.last_login = datetime.utcnow()
                db.session.commit()
            else:
                # Create new user
                new_user = User(
                    email=google_email,
                    name=google_name,
                    google_id=google_id,
                    google_email=google_email,
                    auth_provider='google',
                    role='manager',
                    is_active=True,
                    is_demo=False,
                    password_hash=None  # No password for Google users
                )
                db.session.add(new_user)
                db.session.flush()
                
                # Create free subscription
                sub = Subscription(
                    user_id=new_user.id,
                    plan_name='free',
                    status='active',
                    stripe_customer_id=None,
                    stripe_subscription_id=None,
                )
                db.session.add(sub)
                db.session.commit()
                user = new_user
            
            # Store user ID in session
            try:
                session['user_id'] = user.id
            except RuntimeError:
                pass
            
            return jsonify({
                'success': True,
                'user': user.to_dict()
            }), 200
            
        except requests.RequestException as e:
            import traceback
            print(f"Google token verification error: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({
                'success': False,
                'error': 'Failed to verify Google token'
            }), 500
        
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        import traceback
        error_msg = str(e)
        print(f"Database error in Google auth: {error_msg}")
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
        print(f"Error in Google auth: {error_msg}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': get_user_friendly_error(e, current_app.debug)
        }), 500


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
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'success': False, 'error': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({'success': False, 'error': 'Password must be at least 6 characters'}), 400
        
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
                    'error': 'Database not initialized. Please contact support.'
                }), 500
        except Exception:
            pass
        
        # Check if email already exists
        try:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({'success': False, 'error': 'Email already registered. Please login instead.'}), 400
        except (OperationalError, DatabaseError) as query_error:
            import traceback
            print(f"Database query error: {str(query_error)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({
                'success': False,
                'error': get_user_friendly_error(query_error, current_app.debug)
            }), 500
        
        # Create new user (default role is 'manager')
        try:
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
            
            # Create subscription (free by default, will be upgraded after payment)
            sub = Subscription(
                user_id=new_user.id,
                plan_name=plan,
                status='active' if plan == 'free' else 'pending',  # Pending until payment
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
            
        except (OperationalError, DatabaseError) as commit_error:
            db.session.rollback()
            import traceback
            print(f"Database commit error: {str(commit_error)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({
                'success': False,
                'error': get_user_friendly_error(commit_error, current_app.debug)
            }), 500
        
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
