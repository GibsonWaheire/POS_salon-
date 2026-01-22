"""Add user model for admin/manager authentication

Revision ID: add_user_model
Revises: a1b2c3d4e5f6
Create Date: 2026-01-22 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'add_user_model'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # Check if table already exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if 'users' not in tables:
        # Create users table
        op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='manager'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='1'),
        sa.Column('is_demo', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
        )
    
    # Check if default user already exists
    result = conn.execute(sa.text("SELECT COUNT(*) FROM users WHERE email = 'manager@salon.com'")).scalar()
    
    if result == 0:
        # Create default admin user (password: demo123)
        import bcrypt
        password_hash = bcrypt.hashpw('demo123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insert default user using raw SQL with proper datetime
        conn.execute(sa.text(f"""
            INSERT INTO users (email, password_hash, name, role, is_active, is_demo, created_at)
            VALUES ('manager@salon.com', :password_hash, 'Manager', 'manager', 1, 1, datetime('now'))
        """), {'password_hash': password_hash})


def downgrade():
    op.drop_table('users')
