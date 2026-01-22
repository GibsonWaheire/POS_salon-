"""
Shift management routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Shift
from db import db
from datetime import datetime, date

bp_shifts = Blueprint('shifts', __name__)


@bp_shifts.route('/shifts', methods=['GET'])
def get_shifts():
    """Get all shifts with optional filtering"""
    staff_id = request.args.get('staff_id', type=int)
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Shift.query
    if staff_id:
        query = query.filter_by(staff_id=staff_id)
    if start_date:
        start_dt = datetime.fromisoformat(start_date).date()
        query = query.filter(Shift.shift_date >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date).date()
        query = query.filter(Shift.shift_date <= end_dt)
    
    shifts = query.order_by(Shift.shift_date.desc(), Shift.start_time).all()
    return jsonify([shift.to_dict() for shift in shifts])


@bp_shifts.route('/shifts', methods=['POST'])
def create_shift():
    """Create a new shift"""
    data = request.get_json()
    shift = Shift(
        staff_id=data.get('staff_id'),
        shift_date=datetime.fromisoformat(data.get('shift_date')).date() if data.get('shift_date') else date.today(),
        start_time=datetime.strptime(data.get('start_time'), '%H:%M').time(),
        end_time=datetime.strptime(data.get('end_time'), '%H:%M').time(),
        notes=data.get('notes')
    )
    db.session.add(shift)
    db.session.commit()
    return jsonify(shift.to_dict()), 201


@bp_shifts.route('/shifts/<int:id>/clock-in', methods=['POST'])
def clock_in(id):
    """Clock in for a shift"""
    shift = Shift.query.get_or_404(id)
    shift.clock_in = datetime.utcnow()
    shift.status = 'active'
    db.session.commit()
    return jsonify(shift.to_dict())


@bp_shifts.route('/shifts/<int:id>/clock-out', methods=['POST'])
def clock_out(id):
    """Clock out from a shift"""
    shift = Shift.query.get_or_404(id)
    shift.clock_out = datetime.utcnow()
    shift.status = 'completed'
    db.session.commit()
    return jsonify(shift.to_dict())
