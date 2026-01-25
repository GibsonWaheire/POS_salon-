"""
Main routes file - registers all blueprints.
"""
from flask import Blueprint

# Import all route blueprints
from routes_auth import bp_auth
from routes_users import bp_users
from routes_customers import bp_customers
from routes_services import bp_services
from routes_staff import bp_staff
from routes_sales import bp_sales
from routes_products import bp_products
from routes_payments import bp_payments
from routes_commissions import bp_commissions
from routes_reports import bp_reports
from routes_expenses import bp_expenses
from routes_shifts import bp_shifts
from routes_dashboard import bp_dashboard
from routes_appointments import bp_appointments
from routes_settings import bp_settings
from routes_slot_blockers import bp_slot_blockers
from routes_checkout import bp_checkout
from routes_webhooks import bp_webhooks

# Create main blueprint
bp = Blueprint('api', __name__, url_prefix='/api')

# Register all blueprints
bp.register_blueprint(bp_auth)
bp.register_blueprint(bp_checkout)
bp.register_blueprint(bp_webhooks)
bp.register_blueprint(bp_users)
bp.register_blueprint(bp_customers)
bp.register_blueprint(bp_services)
bp.register_blueprint(bp_staff)
bp.register_blueprint(bp_sales)
bp.register_blueprint(bp_products)
bp.register_blueprint(bp_payments)
bp.register_blueprint(bp_commissions)
bp.register_blueprint(bp_reports)
bp.register_blueprint(bp_expenses)
bp.register_blueprint(bp_shifts)
bp.register_blueprint(bp_dashboard)
bp.register_blueprint(bp_appointments)
bp.register_blueprint(bp_settings)
bp.register_blueprint(bp_slot_blockers)