"""
Service routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Service, ServicePriceHistory
from db import db

bp_services = Blueprint('services', __name__)


@bp_services.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.to_dict() for service in services])


def _normalize_category(cat):
    if cat is None or (isinstance(cat, str) and not cat.strip()):
        return None
    s = str(cat).strip().lower()
    return s if s else None


@bp_services.route('/services', methods=['POST'])
def create_service():
    data = request.get_json()
    category = _normalize_category(data.get('category'))
    service = Service(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        duration=data.get('duration'),
        category=category
    )
    db.session.add(service)
    db.session.commit()
    return jsonify(service.to_dict()), 201


@bp_services.route('/services/<int:id>', methods=['GET'])
def get_service(id):
    service = Service.query.get_or_404(id)
    service_dict = service.to_dict()
    # Include price history if requested
    if request.args.get('include_history', '').lower() == 'true':
        service_dict['price_history'] = [ph.to_dict() for ph in service.price_history]
    return jsonify(service_dict)


@bp_services.route('/services/<int:id>', methods=['PUT'])
def update_service(id):
    try:
        service = Service.query.get_or_404(id)
        data = request.get_json()
        
        old_price = service.price
        new_price = data.get('price', service.price)
        
        # Update service fields
        service.name = data.get('name', service.name)
        service.description = data.get('description', service.description)
        service.duration = data.get('duration', service.duration)
        if 'category' in data:
            service.category = _normalize_category(data['category'])
        
        # Track price change if price is being updated
        if 'price' in data and old_price != new_price:
            # Get user ID from request (if available - could be from session/token)
            # For now, we'll use None or get from a header/query param
            changed_by = request.args.get('user_id', type=int) or None
            
            # Create price history record
            price_history = ServicePriceHistory(
                service_id=service.id,
                old_price=old_price,
                new_price=new_price,
                changed_by=changed_by,
                notes=data.get('price_change_notes')
            )
            db.session.add(price_history)
            
            # Update the price
            service.price = new_price
        
        db.session.commit()
        return jsonify(service.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@bp_services.route('/services/<int:id>', methods=['DELETE'])
def delete_service(id):
    try:
        service = Service.query.get_or_404(id)
        
        # Check if service is used in any sales (optional - you may want to prevent deletion)
        # For now, we'll allow deletion but warn if there are sales
        
        db.session.delete(service)
        db.session.commit()
        return jsonify({'message': 'Service deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
