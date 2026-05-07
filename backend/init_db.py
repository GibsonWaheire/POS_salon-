"""
Startup script: handles both fresh and existing databases.
- Checks for actual app tables (not just alembic_version)
- Fresh/corrupt DB: db.create_all() + stamp head
- Existing DB with tables: run pending migrations
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
    print(f"Tables found: {tables}")

    # Check for core app tables (not just alembic_version)
    core_tables_exist = 'staff' in tables and 'payments' in tables

    if not core_tables_exist:
        print("Core tables missing - creating fresh database schema...")
        db.create_all()
        print("All tables created from models.")

        # Clear any stale alembic state and stamp as head
        if 'alembic_version' in tables:
            print("Clearing stale alembic_version...")
            with db.engine.connect() as conn:
                conn.execute(text("DELETE FROM alembic_version"))
                conn.commit()

        from flask_migrate import stamp
        stamp()
        print("Alembic stamped at head.")
    else:
        print("Core tables exist - applying pending migrations...")
        from flask_migrate import upgrade
        upgrade()
        print("Migrations applied.")

    seed_demo_staff_if_needed()

print("DB init complete. Starting server...")
