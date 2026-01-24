"""Add appointment linking to sales

Revision ID: a140a81ac04f
Revises: add_professional_commission_structure
Create Date: 2026-01-24 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'a140a81ac04f'
down_revision = 'add_professional_commission_structure'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # Add fields to sales table
    if 'sales' in tables:
        columns = [col['name'] for col in inspector.get_columns('sales')]
        
        # Use batch operations for SQLite
        with op.batch_alter_table('sales', schema=None) as batch_op:
            if 'appointment_id' not in columns:
                batch_op.add_column(sa.Column('appointment_id', sa.Integer(), nullable=True))
                # Create foreign key constraint (SQLite will ignore if not supported)
                try:
                    batch_op.create_foreign_key('fk_sales_appointment', 'appointments', ['appointment_id'], ['id'])
                except Exception:
                    # SQLite doesn't support adding foreign keys via ALTER, skip it
                    pass
            
            if 'service_start_time' not in columns:
                batch_op.add_column(sa.Column('service_start_time', sa.DateTime(), nullable=True))
            
            if 'service_end_time' not in columns:
                batch_op.add_column(sa.Column('service_end_time', sa.DateTime(), nullable=True))
            
            if 'service_duration_minutes' not in columns:
                batch_op.add_column(sa.Column('service_duration_minutes', sa.Integer(), nullable=True))
            
            if 'service_location' not in columns:
                batch_op.add_column(sa.Column('service_location', sa.String(length=20), nullable=True))
            
            if 'home_service_address' not in columns:
                batch_op.add_column(sa.Column('home_service_address', sa.Text(), nullable=True))
    
    # Add fields to appointments table
    if 'appointments' in tables:
        columns = [col['name'] for col in inspector.get_columns('appointments')]
        
        # Use batch operations for SQLite
        with op.batch_alter_table('appointments', schema=None) as batch_op:
            if 'service_location' not in columns:
                batch_op.add_column(sa.Column('service_location', sa.String(length=20), nullable=True, server_default='salon'))
            
            if 'home_service_address' not in columns:
                batch_op.add_column(sa.Column('home_service_address', sa.Text(), nullable=True))
            
            if 'sale_id' not in columns:
                batch_op.add_column(sa.Column('sale_id', sa.Integer(), nullable=True))
                # Create foreign key constraint (SQLite will ignore if not supported)
                try:
                    batch_op.create_foreign_key('fk_appointments_sale', 'sales', ['sale_id'], ['id'])
                except Exception:
                    # SQLite doesn't support adding foreign keys via ALTER, skip it
                    pass


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # Remove fields from appointments table
    if 'appointments' in tables:
        columns = [col['name'] for col in inspector.get_columns('appointments')]
        
        with op.batch_alter_table('appointments', schema=None) as batch_op:
            if 'sale_id' in columns:
                try:
                    batch_op.drop_constraint('fk_appointments_sale', type_='foreignkey')
                except Exception:
                    pass
                batch_op.drop_column('sale_id')
            
            if 'home_service_address' in columns:
                batch_op.drop_column('home_service_address')
            
            if 'service_location' in columns:
                batch_op.drop_column('service_location')
    
    # Remove fields from sales table
    if 'sales' in tables:
        columns = [col['name'] for col in inspector.get_columns('sales')]
        
        with op.batch_alter_table('sales', schema=None) as batch_op:
            if 'home_service_address' in columns:
                batch_op.drop_column('home_service_address')
            
            if 'service_location' in columns:
                batch_op.drop_column('service_location')
            
            if 'service_duration_minutes' in columns:
                batch_op.drop_column('service_duration_minutes')
            
            if 'service_end_time' in columns:
                batch_op.drop_column('service_end_time')
            
            if 'service_start_time' in columns:
                batch_op.drop_column('service_start_time')
            
            if 'appointment_id' in columns:
                try:
                    batch_op.drop_constraint('fk_sales_appointment', type_='foreignkey')
                except Exception:
                    pass
                batch_op.drop_column('appointment_id')
