"""
Product/Inventory routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Product
from db import db
from datetime import datetime

bp_products = Blueprint('products', __name__)


@bp_products.route('/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    category = request.args.get('category')
    low_stock = request.args.get('low_stock', 'false').lower() == 'true'
    
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    if low_stock:
        query = query.filter(Product.stock_quantity <= Product.min_stock_level)
    
    products = query.all()
    return jsonify([product.to_dict() for product in products])


@bp_products.route('/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.get_json()
    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        category=data.get('category'),
        sku=data.get('sku'),
        unit_price=data.get('unit_price', 0),
        selling_price=data.get('selling_price'),
        stock_quantity=data.get('stock_quantity', 0),
        min_stock_level=data.get('min_stock_level', 5),
        unit=data.get('unit', 'piece'),
        supplier=data.get('supplier')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@bp_products.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    """Get a specific product"""
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())


@bp_products.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    """Update a product"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.sku = data.get('sku', product.sku)
    product.unit_price = data.get('unit_price', product.unit_price)
    product.selling_price = data.get('selling_price', product.selling_price)
    product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
    product.min_stock_level = data.get('min_stock_level', product.min_stock_level)
    product.unit = data.get('unit', product.unit)
    product.supplier = data.get('supplier', product.supplier)
    product.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(product.to_dict())


@bp_products.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    """Delete a product"""
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200


@bp_products.route('/products/<int:id>/adjust-stock', methods=['POST'])
def adjust_stock(id):
    """Adjust product stock (add or subtract)"""
    product = Product.query.get_or_404(id)
    data = request.get_json()
    adjustment = data.get('adjustment', 0)  # Positive to add, negative to subtract
    product.stock_quantity = max(0, product.stock_quantity + adjustment)
    product.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(product.to_dict())
