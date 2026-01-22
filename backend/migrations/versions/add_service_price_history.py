"""Add service price history table

Revision ID: add_service_price_history
Revises: add_user_model
Create Date: 2026-01-22 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'add_service_price_history'
down_revision = 'add_user_model'
branch_labels = None
depends_on = None


def upgrade():
    # Check if table already exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if 'service_price_history' not in tables:
        # Create service_price_history table
        op.create_table('service_price_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('old_price', sa.Float(), nullable=False),
        sa.Column('new_price', sa.Float(), nullable=False),
        sa.Column('changed_at', sa.DateTime(), nullable=False),
        sa.Column('changed_by', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['changed_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ),
        sa.PrimaryKeyConstraint('id')
        )


def downgrade():
    op.drop_table('service_price_history')
