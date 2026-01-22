"""
User management routes for admin to manage managers.
"""
from flask import Blueprint, request, jsonify, g
from models import User
from db import db
from datetime import datetime
from auth_helpers import require_auth, require_admin, get_current_user
import bcrypt

bp_users = Blueprint('users', __name__)


@bp_users.route('/users', methods=['GET'])
@require_auth
def get_users():
    """Get all users - Admin sees all, Manager sees only themselves"""
    current_user = g.current_user
    
    if current_user.is_admin():
        # Admin can see all users
        users = User.query.all()
    else:
        # Manager can only see themselves
        users = [current_user]
    
    return jsonify({
        'success': True,
        'users': [user.to_dict() for user in users]
    }), 200


@bp_users.route('/users/managers', methods=['GET'])
@require_admin
def get_managers():
    """Get all managers - Admin only"""
    managers = User.query.filter_by(role='manager').all()
    return jsonify({
        'success': True,
        'managers': [manager.to_dict() for manager in managers]
    }), 200


@bp_users.route('/users', methods=['POST'])
@require_admin
def create_user():
    """Create a new manager - Admin only"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'manager')
        
        # Validate required fields
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        # Only admin can create users, and can only create managers
        if role != 'manager':
            return jsonify({'error': 'Only manager role can be created'}), 400
        
        # Check if email already exists
        existing = User.query.filter_by(email=email.lower().strip()).first()
        if existing:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new manager
        user = User(
            email=email.lower().strip(),
            name=name,
            role='manager',
            managed_by=g.current_user.id,  # Managed by the admin who created them
            is_active=data.get('is_active', True),
            is_demo=data.get('is_demo', False)
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp_users.route('/users/<int:user_id>', methods=['GET'])
@require_auth
def get_user(user_id):
    """Get a specific user"""
    current_user = g.current_user
    user = User.query.get_or_404(user_id)
    
    # Admin can see anyone, Manager can only see themselves
    if not current_user.is_admin() and user.id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200


@bp_users.route('/users/<int:user_id>', methods=['PUT'])
@require_auth
def update_user(user_id):
    """Update a user - Admin can update anyone, Manager can only update themselves"""
    try:
        current_user = g.current_user
        user = User.query.get_or_404(user_id)
        
        # Check permissions
        if not current_user.is_admin() and user.id != current_user.id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Managers cannot change their role or managed_by
        if not current_user.is_admin():
            if 'role' in request.get_json():
                return jsonify({'error': 'Cannot change role'}), 403
            if 'managed_by' in request.get_json():
                return jsonify({'error': 'Cannot change manager assignment'}), 403
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            new_email = data['email'].lower().strip()
            if new_email != user.email:
                existing = User.query.filter_by(email=new_email).first()
                if existing:
                    return jsonify({'error': 'Email already in use'}), 400
                user.email = new_email
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        if 'is_active' in data and current_user.is_admin():
            user.is_active = data['is_active']
        if 'role' in data and current_user.is_admin():
            user.role = data['role']
        if 'managed_by' in data and current_user.is_admin():
            user.managed_by = data['managed_by']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp_users.route('/users/<int:user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id):
    """Delete a user - Admin only"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Cannot delete yourself
        if user.id == g.current_user.id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        # Cannot delete if they manage other managers
        managed_count = User.query.filter_by(managed_by=user.id).count()
        if managed_count > 0:
            return jsonify({
                'error': f'Cannot delete user. They manage {managed_count} manager(s). Reassign them first.'
            }), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
