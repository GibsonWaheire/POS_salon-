"""
Initialize database with all tables
This will create all tables including the payments table with sale_id column
"""
from app import app, db
from models import *

with app.app_context():
    print("Creating all database tables...")
    db.create_all()
    print("✓ Database tables created successfully!")
    
    # Verify payments table has sale_id column
    import sqlite3
    import os
    # Get the actual database path from SQLAlchemy engine
    db_url = str(db.engine.url)
    if db_url.startswith('sqlite:///'):
        db_path = db_url.replace('sqlite:///', '')
    elif db_url.startswith('sqlite://'):
        db_path = db_url.replace('sqlite://', '')
    else:
        # Fallback to env variable
        db_path = os.getenv('DATABASE_URL', 'sqlite:///pos_salon.db')
        if db_path.startswith('sqlite:///'):
            db_path = db_path.replace('sqlite:///', '')
        elif db_path.startswith('sqlite://'):
            db_path = db_path.replace('sqlite://', '')
        if not os.path.isabs(db_path):
            db_path = os.path.join(os.path.dirname(__file__), db_path)
    
    print(f"Connecting to database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(payments)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"\nPayments table columns: {', '.join(columns)}")
    
    if 'sale_id' in columns:
        print("✓ sale_id column exists in payments table")
    else:
        print("✗ sale_id column missing - adding it...")
        cursor.execute("ALTER TABLE payments ADD COLUMN sale_id INTEGER")
        conn.commit()
        print("✓ sale_id column added")
    
    conn.close()
    print("\n✓ Database initialization complete!")
