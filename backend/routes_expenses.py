"""
Expense routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from models import Expense
from db import db
from datetime import datetime

bp_expenses = Blueprint('expenses', __name__)


@bp_expenses.route('/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses with optional date filtering"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    
    query = Expense.query
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(Expense.expense_date >= start_dt)
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(Expense.expense_date <= end_dt)
    if category:
        query = query.filter_by(category=category)
    
    expenses = query.order_by(Expense.expense_date.desc()).all()
    return jsonify([expense.to_dict() for expense in expenses])


@bp_expenses.route('/expenses', methods=['POST'])
def create_expense():
    """Create a new expense"""
    data = request.get_json()
    expense = Expense(
        category=data.get('category'),
        description=data.get('description'),
        amount=data.get('amount'),
        expense_date=datetime.fromisoformat(data.get('expense_date')) if data.get('expense_date') else datetime.utcnow(),
        receipt_number=data.get('receipt_number'),
        paid_by=data.get('paid_by'),
        created_by=data.get('created_by')
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201


@bp_expenses.route('/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    """Get a specific expense"""
    expense = Expense.query.get_or_404(id)
    return jsonify(expense.to_dict())


@bp_expenses.route('/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    """Update an expense"""
    expense = Expense.query.get_or_404(id)
    data = request.get_json()
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)
    expense.amount = data.get('amount', expense.amount)
    if data.get('expense_date'):
        expense.expense_date = datetime.fromisoformat(data.get('expense_date'))
    expense.receipt_number = data.get('receipt_number', expense.receipt_number)
    expense.paid_by = data.get('paid_by', expense.paid_by)
    db.session.commit()
    return jsonify(expense.to_dict())


@bp_expenses.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    """Delete an expense"""
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted'}), 200
