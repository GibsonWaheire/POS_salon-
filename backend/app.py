from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_compress import Compress
from dotenv import load_dotenv
import os
from db import db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///pos_salon.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
# Production settings - use environment variables
app.config['SESSION_COOKIE_SECURE'] = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
app.config['SESSION_COOKIE_HTTPONLY'] = True
# For cross-domain Railway/Vercel deployments use SameSite=None (requires Secure=True)
# For local dev, default to Lax
app.config['SESSION_COOKIE_SAMESITE'] = os.getenv('SESSION_COOKIE_SAMESITE', 'None' if os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true' else 'Lax')

# Initialize db with app
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize Flask-Compress for gzip compression
Compress(app)

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
    return jsonify({'status': 'ok', 'message': 'Salonyst API is running'})

# Enable CORS for all routes - MUST be after routes are registered
# This handles all CORS including preflight OPTIONS requests
# In production, set CORS_ORIGINS environment variable to restrict origins
allowed_origins = os.getenv('CORS_ORIGINS', '').split(',') if os.getenv('CORS_ORIGINS') else ['http://localhost:5173', 'http://127.0.0.1:5173']
CORS(app, 
     origins=allowed_origins,  # Use environment variable or allow localhost in development
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  # All HTTP methods
     allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "X-User-Id"],  # All needed headers including custom auth header
     supports_credentials=True,  # Enable credentials for session support
     max_age=3600  # Cache preflight requests for 1 hour
     )

# Ensure CORS headers are always present, even in error responses
@app.after_request
def after_request(response):
    """Add CORS headers to all responses, including errors"""
    origin = request.headers.get('Origin')
    if not origin:
        return response

    allowed = ['http://localhost:5173', 'http://127.0.0.1:5173']
    env_origins = os.getenv('CORS_ORIGINS', '').strip()
    if env_origins:
        allowed.extend([o.strip() for o in env_origins.split(',')])

    # If wildcard is configured, allow any origin
    if '*' in allowed or origin in allowed:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, X-User-Id'
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
    
    origin = request.headers.get('Origin')
    if origin:
        allowed = ['http://localhost:5173', 'http://127.0.0.1:5173']
        env_origins = os.getenv('CORS_ORIGINS', '').strip()
        if env_origins:
            allowed.extend([o.strip() for o in env_origins.split(',')])
        if '*' in allowed or origin in allowed:
            response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, X-User-Id'

    return response

# Catch all exceptions to ensure CORS headers are always present
@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all exceptions with CORS headers"""
    from flask import make_response
    import traceback

    print(f"Exception: {str(e)}")
    if app.debug:
        traceback.print_exc()

    if hasattr(e, 'code') and e.code == 500:
        return handle_500(e)

    response = make_response(jsonify({
        'error': 'An error occurred',
        'message': str(e) if app.debug else 'An error occurred'
    }), 500)

    origin = request.headers.get('Origin')
    if origin:
        allowed = ['http://localhost:5173', 'http://127.0.0.1:5173']
        env_origins = os.getenv('CORS_ORIGINS', '').strip()
        if env_origins:
            allowed.extend([o.strip() for o in env_origins.split(',')])
        if '*' in allowed or origin in allowed:
            response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, X-User-Id'

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
    # Use PORT environment variable (Railway provides this) or default to 5001
    port = int(os.getenv('PORT', 5001))
    host = os.getenv('HOST', '0.0.0.0')

    print(f"\n Starting Flask server on http://{host}:{port}")
    print(f" API available at http://{host}:{port}/api")
    print(f" Note: Run 'flask db upgrade' to apply database migrations")
    app.run(debug=False, port=port, host=host)

