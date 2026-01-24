"""Add category to services

Revision ID: add_service_category
Revises: e4b4ad54e06a
Create Date: 2026-01-24 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = 'add_service_category'
down_revision = 'e4b4ad54e06a'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    if 'services' not in tables:
        return
    columns = [col['name'] for col in inspector.get_columns('services')]
    if 'category' in columns:
        return
    with op.batch_alter_table('services', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category', sa.String(length=50), nullable=True))


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    if 'services' not in tables:
        return
    columns = [col['name'] for col in inspector.get_columns('services')]
    if 'category' not in columns:
        return
    with op.batch_alter_table('services', schema=None) as batch_op:
        batch_op.drop_column('category')
