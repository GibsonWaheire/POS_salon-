from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db import db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///pos_salon.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Enable CORS for all routes - allow all origins for development
CORS(app, 
     resources={r"/api/*": {
         "origins": "*",
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"]
     }},
     supports_credentials=True)

# Initialize db with app
db.init_app(app)

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

# Handle OPTIONS requests for CORS preflight
@app.after_request
def after_request(response):
    # Add CORS headers to all responses
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def seed_demo_staff_if_needed():
    """Seed demo staff users on startup if they don't exist"""
    try:
        from models import Staff
        # Check if any staff with demo email pattern exists
        existing_staff = Staff.query.filter(
            Staff.email.like('%@salon.demo')
        ).first()
        
        if not existing_staff:
            # Demo staff users - PINs follow format: 4 digits + 1 special character
            DEMO_STAFF = [
                {'name': 'Jane Wanjiru', 'phone': '+254 712 345 678', 'email': 'jane.wanjiru@salon.demo', 'role': 'stylist', 'pin': '1234@'},
                {'name': 'Sarah Akinyi', 'phone': '+254 723 456 789', 'email': 'sarah.akinyi@salon.demo', 'role': 'stylist', 'pin': '5678!'},
                {'name': 'Mary Nyambura', 'phone': '+254 734 567 890', 'email': 'mary.nyambura@salon.demo', 'role': 'nail_technician', 'pin': '9012#'},
                {'name': 'Grace Muthoni', 'phone': '+254 745 678 901', 'email': 'grace.muthoni@salon.demo', 'role': 'facial_specialist', 'pin': '3456$'},
                {'name': 'Lucy Wambui', 'phone': '+254 756 789 012', 'email': 'lucy.wambui@salon.demo', 'role': 'receptionist', 'pin': '7890%'}
            ]
            
            for staff_data in DEMO_STAFF:
                existing = Staff.query.filter_by(email=staff_data['email']).first()
                if not existing:
                    staff = Staff(**staff_data)
                    db.session.add(staff)
            
            db.session.commit()
            print("✓ Demo staff users seeded successfully")
    except Exception as e:
        print(f"Note: Could not seed demo staff: {e}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_demo_staff_if_needed()
    app.run(debug=True, port=5000, host='0.0.0.0')

