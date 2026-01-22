"""Add professional commission payment structure

Revision ID: add_professional_commission_structure
Revises: add_user_model
Create Date: 2026-01-22 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'add_professional_commission_structure'
down_revision = 'add_user_model'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # 1. Add base_pay column to staff table
    if 'staff' in tables:
        # Check if column already exists
        columns = [col['name'] for col in inspector.get_columns('staff')]
        if 'base_pay' not in columns:
            op.add_column('staff', sa.Column('base_pay', sa.Float(), nullable=True))
    
    # 2. Create commission_payment_items table
    if 'commission_payment_items' not in tables:
        op.create_table('commission_payment_items',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('commission_payment_id', sa.Integer(), nullable=False),
            sa.Column('item_type', sa.String(length=20), nullable=False),
            sa.Column('item_name', sa.String(length=100), nullable=False),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('is_percentage', sa.Boolean(), nullable=True, server_default='0'),
            sa.Column('percentage_of', sa.String(length=50), nullable=True),
            sa.Column('display_order', sa.Integer(), nullable=True, server_default='0'),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('sale_id', sa.Integer(), nullable=True),
            sa.Column('sale_service_id', sa.Integer(), nullable=True),
            sa.Column('service_name', sa.String(length=100), nullable=True),
            sa.Column('sale_number', sa.String(length=50), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['commission_payment_id'], ['commission_payments.id'], ),
            sa.ForeignKeyConstraint(['sale_id'], ['sales.id'], ),
            sa.ForeignKeyConstraint(['sale_service_id'], ['sale_services.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
    
    # 3. Add new columns to commission_payments table
    if 'commission_payments' in tables:
        columns = [col['name'] for col in inspector.get_columns('commission_payments')]
        
        if 'base_pay' not in columns:
            op.add_column('commission_payments', sa.Column('base_pay', sa.Float(), nullable=True))
        
        if 'gross_pay' not in columns:
            op.add_column('commission_payments', sa.Column('gross_pay', sa.Float(), nullable=True))
        
        if 'total_deductions' not in columns:
            op.add_column('commission_payments', sa.Column('total_deductions', sa.Float(), nullable=True))
        
        if 'net_pay' not in columns:
            op.add_column('commission_payments', sa.Column('net_pay', sa.Float(), nullable=True))
        
        # Migrate existing data: set net_pay = amount_paid for existing payments
        conn.execute(sa.text("""
            UPDATE commission_payments 
            SET net_pay = amount_paid 
            WHERE net_pay IS NULL
        """))


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # Remove columns from commission_payments table
    if 'commission_payments' in tables:
        columns = [col['name'] for col in inspector.get_columns('commission_payments')]
        
        if 'net_pay' in columns:
            op.drop_column('commission_payments', 'net_pay')
        
        if 'total_deductions' in columns:
            op.drop_column('commission_payments', 'total_deductions')
        
        if 'gross_pay' in columns:
            op.drop_column('commission_payments', 'gross_pay')
        
        if 'base_pay' in columns:
            op.drop_column('commission_payments', 'base_pay')
    
    # Drop commission_payment_items table
    if 'commission_payment_items' in tables:
        op.drop_table('commission_payment_items')
    
    # Remove base_pay from staff table
    if 'staff' in tables:
        columns = [col['name'] for col in inspector.get_columns('staff')]
        if 'base_pay' in columns:
            op.drop_column('staff', 'base_pay')
