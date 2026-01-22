"""
Authentication routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app
from models import User
from db import db
from datetime import datetime

bp_auth = Blueprint('auth', __name__)


@bp_auth.route('/auth/login', methods=['POST'])
def login():
    """Authenticate manager/admin user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email.lower().strip()).first()
        
        if not user:
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'error': 'Account is inactive'}), 403
        
        # Verify password
        if not user.check_password(password):
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Return user data (without password)
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in login: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'An error occurred during login. Please try again.'
        }), 500
