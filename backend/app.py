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
# This handles all CORS including preflight OPTIONS requests
CORS(app, 
     resources={
         r"/api/*": {
             "origins": "*",
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"]
         }
     })

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


def seed_demo_staff_if_needed():
    """Seed demo staff users on startup if they don't exist"""
    # #region agent log
    import json
    import os
    try:
        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
            f.write(json.dumps({"id":"log_seed_start","timestamp":int(__import__('time').time()*1000),"location":"app.py:47","message":"Seed demo staff function called","data":{},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
    except: pass
    # #endregion
    try:
        import json
        import os
        from models import Staff
        
        # Check if any staff with demo email pattern exists
        existing_staff = Staff.query.filter(
            Staff.email.like('%@salon.demo')
        ).first()
        
        # #region agent log
        try:
            total_staff_count = Staff.query.count()
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_seed_check","timestamp":int(__import__('time').time()*1000),"location":"app.py:58","message":"Checking existing demo staff","data":{"total_staff_count":total_staff_count,"demo_staff_exists":existing_staff is not None},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
        except: pass
        # #endregion
        
        if not existing_staff:
            # Load demo staff from JSON file
            json_path = os.path.join(os.path.dirname(__file__), 'demo_staff.json')
            try:
                with open(json_path, 'r') as f:
                    data = json.load(f)
                    DEMO_STAFF = data.get('demo_staff', [])
                # #region agent log
                try:
                    with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({"id":"log_seed_loaded","timestamp":int(__import__('time').time()*1000),"location":"app.py:66","message":"Demo staff JSON loaded","data":{"staff_count":len(DEMO_STAFF),"json_path":json_path},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
                except: pass
                # #endregion
            except (FileNotFoundError, json.JSONDecodeError) as e:
                print(f"Warning: Could not load demo_staff.json: {e}")
                DEMO_STAFF = []
                # #region agent log
                try:
                    with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                        f.write(json.dumps({"id":"log_seed_error","timestamp":int(__import__('time').time()*1000),"location":"app.py:68","message":"Failed to load demo_staff.json","data":{"error":str(e)},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
                except: pass
                # #endregion
            
            created_count = 0
            for staff_data in DEMO_STAFF:
                # Remove 'id' from staff_data as it's auto-generated
                staff_data_clean = {k: v for k, v in staff_data.items() if k != 'id'}
                existing = Staff.query.filter_by(email=staff_data_clean['email']).first()
                if not existing:
                    staff = Staff(**staff_data_clean)
                    db.session.add(staff)
                    created_count += 1
                    # #region agent log
                    try:
                        with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                            f.write(json.dumps({"id":"log_seed_creating","timestamp":int(__import__('time').time()*1000),"location":"app.py:76","message":"Creating staff member","data":{"name":staff_data_clean.get('name'),"email":staff_data_clean.get('email'),"pin_length":len(staff_data_clean.get('pin','')) if staff_data_clean.get('pin') else 0},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
                    except: pass
                    # #endregion
            
            db.session.commit()
            # #region agent log
            try:
                final_count = Staff.query.count()
                with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                    f.write(json.dumps({"id":"log_seed_complete","timestamp":int(__import__('time').time()*1000),"location":"app.py:79","message":"Seed complete","data":{"created_count":created_count,"final_staff_count":final_count},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
            except: pass
            # #endregion
            print("✓ Demo staff users seeded successfully")
        else:
            # #region agent log
            try:
                with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                    f.write(json.dumps({"id":"log_seed_skipped","timestamp":int(__import__('time').time()*1000),"location":"app.py:82","message":"Seed skipped - demo staff already exists","data":{},"sessionId":"debug-session","runId":"run1","hypothesisId":"A"}) + '\n')
            except: pass
            # #endregion
    except Exception as e:
        # #region agent log
        try:
            with open('/Users/apple/Desktop/sites/POS_salon/.cursor/debug.log', 'a') as f:
                f.write(json.dumps({"id":"log_seed_exception","timestamp":int(__import__('time').time()*1000),"location":"app.py:83","message":"Seed exception caught","data":{"error":str(e)},"sessionId":"debug-session","runId":"run1","hypothesisId":"A,E"}) + '\n')
        except: pass
        # #endregion
        print(f"Note: Could not seed demo staff: {e}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_demo_staff_if_needed()
    app.run(debug=True, port=5001, host='0.0.0.0')

