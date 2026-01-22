"""Add commission payment table

Revision ID: add_commission_payment
Revises: add_service_price_history
Create Date: 2026-01-22 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'add_commission_payment'
down_revision = 'add_service_price_history'
branch_labels = None
depends_on = None


def upgrade():
    # Check if table already exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    if 'commission_payments' not in tables:
        # Create commission_payments table
        op.create_table('commission_payments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('staff_id', sa.Integer(), nullable=False),
        sa.Column('amount_paid', sa.Float(), nullable=False),
        sa.Column('payment_date', sa.DateTime(), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('payment_method', sa.String(length=50), nullable=True),
        sa.Column('transaction_reference', sa.String(length=100), nullable=True),
        sa.Column('receipt_number', sa.String(length=50), nullable=True),
        sa.Column('paid_by', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_demo', sa.Boolean(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['paid_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['staff_id'], ['staff.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('receipt_number')
        )


def downgrade():
    op.drop_table('commission_payments')
