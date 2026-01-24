"""Add phone field to users table

Revision ID: add_phone_to_users
Revises: add_managed_by_field
Create Date: 2026-01-22 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_phone_to_users'
down_revision = 'add_managed_by_field'
branch_labels = None
depends_on = None


def upgrade():
    # Check if phone column already exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    if 'users' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('users')]
        if 'phone' not in columns:
            op.add_column('users', sa.Column('phone', sa.String(length=20), nullable=True))


def downgrade():
    # Check if phone column exists before dropping
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    if 'users' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('users')]
        if 'phone' in columns:
            op.drop_column('users', 'phone')
