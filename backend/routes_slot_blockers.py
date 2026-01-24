"""
Slot blocker and resource routes for appointment management.
"""
from flask import Blueprint, request, jsonify
from models import SlotBlocker, Resource, Staff
from db import db
from utils import get_demo_filter
from datetime import datetime
from sqlalchemy import and_, or_

bp_slot_blockers = Blueprint('slot_blockers', __name__)


@bp_slot_blockers.route('/slot-blockers', methods=['GET'])
def get_slot_blockers():
    """Get all slot blockers, optionally filtered by staff_id and date range"""
    try:
        staff_id = request.args.get('staff_id', type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        demo_filter = get_demo_filter(None, request)
        
        query = SlotBlocker.query.filter(SlotBlocker.is_demo == demo_filter['is_demo'])
        
        if staff_id:
            # Show blockers for this staff OR blockers for all staff (staff_id is None)
            query = query.filter(
                or_(
                    SlotBlocker.staff_id == staff_id,
                    SlotBlocker.staff_id.is_(None)
                )
            )
        
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(SlotBlocker.end_date >= start_dt)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(SlotBlocker.start_date <= end_dt)
            except ValueError:
                pass
        
        blockers = query.order_by(SlotBlocker.start_date.asc()).all()
        return jsonify([blocker.to_dict() for blocker in blockers]), 200
    
    except Exception as e:
        import traceback
        print(f"Error in get_slot_blockers: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/slot-blockers', methods=['POST'])
def create_slot_blocker():
    """Create a new slot blocker"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        demo_filter = get_demo_filter(None, request)
        is_demo = demo_filter['is_demo']
        
        staff_id = data.get('staff_id')  # Can be None for "all staff"
        if staff_id:
            staff = Staff.query.get(staff_id)
            if not staff:
                return jsonify({'error': 'Staff not found'}), 404
        
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        if not start_date_str or not end_date_str:
            return jsonify({'error': 'Start date and end date are required'}), 400
        
        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        if end_date <= start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        blocker = SlotBlocker(
            staff_id=staff_id,
            start_date=start_date,
            end_date=end_date,
            reason=data.get('reason'),
            is_recurring=data.get('is_recurring', False),
            recurring_pattern=data.get('recurring_pattern'),
            is_demo=is_demo
        )
        
        db.session.add(blocker)
        db.session.commit()
        
        return jsonify(blocker.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in create_slot_blocker: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/slot-blockers/<int:id>', methods=['PUT'])
def update_slot_blocker(id):
    """Update a slot blocker"""
    try:
        blocker = SlotBlocker.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        if 'staff_id' in data:
            staff_id = data['staff_id']
            if staff_id:
                staff = Staff.query.get(staff_id)
                if not staff:
                    return jsonify({'error': 'Staff not found'}), 404
            blocker.staff_id = staff_id
        
        if 'start_date' in data:
            try:
                blocker.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid start date format'}), 400
        
        if 'end_date' in data:
            try:
                blocker.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid end date format'}), 400
        
        if blocker.end_date <= blocker.start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        if 'reason' in data:
            blocker.reason = data['reason']
        
        if 'is_recurring' in data:
            blocker.is_recurring = data['is_recurring']
        
        if 'recurring_pattern' in data:
            blocker.recurring_pattern = data['recurring_pattern']
        
        db.session.commit()
        return jsonify(blocker.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in update_slot_blocker: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/slot-blockers/<int:id>', methods=['DELETE'])
def delete_slot_blocker(id):
    """Delete a slot blocker"""
    try:
        blocker = SlotBlocker.query.get_or_404(id)
        db.session.delete(blocker)
        db.session.commit()
        return jsonify({'message': 'Slot blocker deleted'}), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in delete_slot_blocker: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# Resource routes
@bp_slot_blockers.route('/resources', methods=['GET'])
def get_resources():
    """Get all resources"""
    try:
        demo_filter = get_demo_filter(None, request)
        is_active = request.args.get('is_active', type=bool)
        
        query = Resource.query.filter(Resource.is_demo == demo_filter['is_demo'])
        
        if is_active is not None:
            query = query.filter(Resource.is_active == is_active)
        
        resources = query.order_by(Resource.name.asc()).all()
        return jsonify([resource.to_dict() for resource in resources]), 200
    
    except Exception as e:
        import traceback
        print(f"Error in get_resources: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/resources', methods=['POST'])
def create_resource():
    """Create a new resource"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        if not data.get('name'):
            return jsonify({'error': 'Resource name is required'}), 400
        
        demo_filter = get_demo_filter(None, request)
        is_demo = demo_filter['is_demo']
        
        resource = Resource(
            name=data['name'],
            type=data.get('type'),
            is_active=data.get('is_active', True),
            is_demo=is_demo
        )
        
        db.session.add(resource)
        db.session.commit()
        
        return jsonify(resource.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in create_resource: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/resources/<int:id>', methods=['PUT'])
def update_resource(id):
    """Update a resource"""
    try:
        resource = Resource.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        if 'name' in data:
            resource.name = data['name']
        
        if 'type' in data:
            resource.type = data['type']
        
        if 'is_active' in data:
            resource.is_active = data['is_active']
        
        db.session.commit()
        return jsonify(resource.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in update_resource: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_slot_blockers.route('/resources/<int:id>', methods=['DELETE'])
def delete_resource(id):
    """Delete a resource"""
    try:
        resource = Resource.query.get_or_404(id)
        
        # Check if resource is used in appointments
        if resource.appointments:
            return jsonify({'error': 'Cannot delete resource that is assigned to appointments'}), 400
        
        db.session.delete(resource)
        db.session.commit()
        return jsonify({'message': 'Resource deleted'}), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in delete_resource: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
