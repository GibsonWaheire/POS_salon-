"""
Startup script: handles both fresh and existing databases.
- Checks for core app tables to detect fresh vs existing DB
- Fresh/corrupt DB: db.create_all() + stamp head (skips broken ALTER migrations)
- Existing DB: run pending migrations, then create_all for any new tables
- Seeds demo staff after tables are ready
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, seed_demo_staff_if_needed
from sqlalchemy import inspect, text

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Existing tables: {tables}")

    # Check for core app tables (not just alembic_version)
    core_tables_exist = 'staff' in tables and 'payments' in tables

    if not core_tables_exist:
        print("Core tables missing - creating fresh database schema...")

        # Clear stale alembic state if it exists
        if 'alembic_version' in tables:
            print("Clearing stale alembic_version entries...")
            with db.engine.connect() as conn:
                conn.execute(text("DELETE FROM alembic_version"))
                conn.commit()

        # Create all tables from current models
        db.create_all()
        print("All tables created from models.")

        # Stamp alembic as head so future migrations apply correctly
        from flask_migrate import stamp
        stamp()
        print("Alembic stamped at head.")
    else:
        print("Core tables exist - applying any pending migrations...")
        from flask_migrate import upgrade
        upgrade()
        # Ensure any new tables from models are created too
        db.create_all()
        print("Migrations and table sync complete.")

    seed_demo_staff_if_needed()

print("DB init complete. Starting server...")
