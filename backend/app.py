from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from db import db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///pos_salon.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize db with app
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Import models
from models import *


# Import routes
from routes import bp
app.register_blueprint(bp)

# Register CLI commands
try:
    from commands import register_commands
    register_commands(app)
except ImportError:
    pass  # Commands module is optional

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Salon POS API is running'})

# Enable CORS for all routes - MUST be after routes are registered
# This handles all CORS including preflight OPTIONS requests
CORS(app, 
     origins="*",  # Allow all origins
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  # All HTTP methods
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],  # All needed headers
     supports_credentials=False,  # No credentials needed
     max_age=3600  # Cache preflight requests for 1 hour
     )

# Ensure CORS headers are always present, even in error responses
@app.after_request
def after_request(response):
    """Add CORS headers to all responses, including errors"""
    # Only add if not already present (CORS should have added them, but ensure they're there)
    if 'Access-Control-Allow-Origin' not in response.headers:
        response.headers['Access-Control-Allow-Origin'] = '*'
    if 'Access-Control-Allow-Methods' not in response.headers:
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    if 'Access-Control-Allow-Headers' not in response.headers:
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
    return response

# Error handler to ensure proper error responses with CORS
@app.errorhandler(500)
def handle_500(e):
    """Handle 500 errors with CORS headers"""
    from flask import make_response
    import traceback
    
    # Log the error for debugging
    print(f"500 Error: {str(e)}")
    if app.debug:
        traceback.print_exc()
    
    response = make_response(jsonify({
        'error': 'Internal server error',
        'message': str(e) if app.debug else 'An error occurred'
    }), 500)
    
    # Ensure CORS headers are present
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
    
    return response

# Catch all exceptions to ensure CORS headers are always present
@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all exceptions with CORS headers"""
    from flask import make_response
    import traceback
    
    # Log the error for debugging
    print(f"Exception: {str(e)}")
    if app.debug:
        traceback.print_exc()
    
    # If it's already a 500 error, let the specific handler deal with it
    if hasattr(e, 'code') and e.code == 500:
        return handle_500(e)
    
    response = make_response(jsonify({
        'error': 'An error occurred',
        'message': str(e) if app.debug else 'An error occurred'
    }), 500)
    
    # Ensure CORS headers are present
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
    
    return response


def seed_demo_staff_if_needed():
    """Seed demo staff users on startup if they don't exist"""
    try:
        import json
        import os
        from models import Staff
        
        # Check if any staff with demo email pattern exists
        existing_staff = Staff.query.filter(
            Staff.email.like('%@salon.demo')
        ).first()
        
        if not existing_staff:
            # Load demo staff from JSON file
            json_path = os.path.join(os.path.dirname(__file__), 'demo_staff.json')
            try:
                with open(json_path, 'r') as f:
                    data = json.load(f)
                    DEMO_STAFF = data.get('demo_staff', [])
            except (FileNotFoundError, json.JSONDecodeError) as e:
                print(f"Warning: Could not load demo_staff.json: {e}")
                DEMO_STAFF = []
            
            created_count = 0
            for staff_data in DEMO_STAFF:
                # Remove 'id' from staff_data as it's auto-generated
                staff_data_clean = {k: v for k, v in staff_data.items() if k != 'id'}
                # Ensure is_active is set (default to True if not specified)
                if 'is_active' not in staff_data_clean:
                    staff_data_clean['is_active'] = True
                existing = Staff.query.filter_by(email=staff_data_clean['email']).first()
                if not existing:
                    staff = Staff(**staff_data_clean)
                    db.session.add(staff)
                    created_count += 1
            
            db.session.commit()
            print("✓ Demo staff users seeded successfully")
    except Exception as e:
        print(f"Note: Could not seed demo staff: {e}")

if __name__ == '__main__':
    with app.app_context():
        # Database migrations are handled by Flask-Migrate
        # Run 'flask db upgrade' to apply migrations
        seed_demo_staff_if_needed()
    app.run(debug=True, port=5001, host='0.0.0.0')

