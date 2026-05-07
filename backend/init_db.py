"""
Startup script: handles both fresh and existing databases.
- Fresh DB: creates all tables via db.create_all(), stamps alembic head
- Existing DB: runs pending migrations via flask db upgrade
- Seeds demo staff after tables are ready
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, seed_demo_staff_if_needed
from sqlalchemy import inspect

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()

    if 'alembic_version' not in tables:
        # Fresh database - create all tables from current models
        print("Fresh database detected - creating tables from models...")
        db.create_all()
        print("All tables created.")

        # Stamp as head so future migrations apply correctly
        from flask_migrate import stamp
        stamp()
        print("Alembic head stamped.")
    else:
        # Existing database - apply any pending migrations
        print("Existing database - applying pending migrations...")
        from flask_migrate import upgrade
        upgrade()
        print("Migrations complete.")

    # Seed demo staff now that tables exist
    seed_demo_staff_if_needed()

print("DB init complete. Starting server...")
