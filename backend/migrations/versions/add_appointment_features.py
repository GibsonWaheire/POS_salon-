"""Add appointment features (slot blockers, resources, notes, recurring, colors)

Revision ID: add_appointment_features
Revises: add_settings_table
Create Date: 2026-01-25 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = 'add_appointment_features'
down_revision = 'add_settings_table'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # Add new columns to appointments table using batch mode for SQLite
    if 'appointments' in tables:
        columns = [col['name'] for col in inspector.get_columns('appointments')]
        
        with op.batch_alter_table('appointments', schema=None) as batch_op:
            if 'color' not in columns:
                batch_op.add_column(sa.Column('color', sa.String(length=20), nullable=True))
            if 'recurring_pattern' not in columns:
                batch_op.add_column(sa.Column('recurring_pattern', sa.String(length=50), nullable=True))
            if 'recurring_end_date' not in columns:
                batch_op.add_column(sa.Column('recurring_end_date', sa.DateTime(), nullable=True))
            if 'parent_appointment_id' not in columns:
                batch_op.add_column(sa.Column('parent_appointment_id', sa.Integer(), nullable=True))
            if 'resource_id' not in columns:
                batch_op.add_column(sa.Column('resource_id', sa.Integer(), nullable=True))
            if 'popup_notes' not in columns:
                batch_op.add_column(sa.Column('popup_notes', sa.Text(), nullable=True))
            if 'last_modified_by' not in columns:
                batch_op.add_column(sa.Column('last_modified_by', sa.Integer(), nullable=True))
        
        # Create foreign keys separately (SQLite batch mode doesn't support FK in batch)
        fks = [fk['name'] for fk in inspector.get_foreign_keys('appointments')]
        if 'parent_appointment_id' in columns or 'parent_appointment_id' not in [col['name'] for col in inspector.get_columns('appointments')]:
            # Check again after batch operation
            columns_after = [col['name'] for col in inspector.get_columns('appointments')]
            if 'parent_appointment_id' in columns_after and 'fk_appointments_parent' not in fks:
                try:
                    op.create_foreign_key('fk_appointments_parent', 'appointments', 'appointments', ['parent_appointment_id'], ['id'])
                except:
                    pass  # SQLite may not support this, skip
        if 'last_modified_by' in columns or 'last_modified_by' not in [col['name'] for col in inspector.get_columns('appointments')]:
            columns_after = [col['name'] for col in inspector.get_columns('appointments')]
            if 'last_modified_by' in columns_after and 'fk_appointments_modified_by' not in fks:
                try:
                    op.create_foreign_key('fk_appointments_modified_by', 'appointments', 'users', ['last_modified_by'], ['id'])
                except:
                    pass
    
    # Create slot_blockers table
    if 'slot_blockers' not in tables:
        op.create_table(
            'slot_blockers',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('staff_id', sa.Integer(), nullable=True),
            sa.Column('start_date', sa.DateTime(), nullable=False),
            sa.Column('end_date', sa.DateTime(), nullable=False),
            sa.Column('reason', sa.String(length=100), nullable=True),
            sa.Column('is_recurring', sa.Boolean(), nullable=True, default=False),
            sa.Column('recurring_pattern', sa.String(length=50), nullable=True),
            sa.Column('is_demo', sa.Boolean(), nullable=True, default=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['staff_id'], ['staff.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_slot_blockers_staff_id', 'slot_blockers', ['staff_id'])
        op.create_index('ix_slot_blockers_start_date', 'slot_blockers', ['start_date'])
        op.create_index('ix_slot_blockers_end_date', 'slot_blockers', ['end_date'])
    
    # Create resources table
    if 'resources' not in tables:
        op.create_table(
            'resources',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('type', sa.String(length=50), nullable=True),
            sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
            sa.Column('is_demo', sa.Boolean(), nullable=True, default=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_resources_is_active', 'resources', ['is_active'])
    
    # Create appointment_notes table
    if 'appointment_notes' not in tables:
        op.create_table(
            'appointment_notes',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('appointment_id', sa.Integer(), nullable=False),
            sa.Column('note_text', sa.Text(), nullable=False),
            sa.Column('created_by', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['appointment_id'], ['appointments.id'], ),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_appointment_notes_appointment_id', 'appointment_notes', ['appointment_id'])
    
    # Add foreign key for resource_id in appointments (after resources table is created)
    # Note: SQLite doesn't support adding foreign keys after table creation easily
    # The relationship will work at application level even without DB-level FK constraint


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()
    
    # Drop foreign keys first (if they exist)
    if 'appointments' in tables:
        try:
            fks = [fk['name'] for fk in inspector.get_foreign_keys('appointments')]
            if 'fk_appointments_resource' in fks:
                op.drop_constraint('fk_appointments_resource', 'appointments', type_='foreignkey')
            if 'fk_appointments_modified_by' in fks:
                op.drop_constraint('fk_appointments_modified_by', 'appointments', type_='foreignkey')
            if 'fk_appointments_parent' in fks:
                op.drop_constraint('fk_appointments_parent', 'appointments', type_='foreignkey')
        except:
            pass  # SQLite may not have these constraints
    
    # Drop appointment_notes table
    if 'appointment_notes' in tables:
        op.drop_index('ix_appointment_notes_appointment_id', table_name='appointment_notes')
        op.drop_table('appointment_notes')
    
    # Drop resources table
    if 'resources' in tables:
        op.drop_index('ix_resources_is_active', table_name='resources')
        op.drop_table('resources')
    
    # Drop slot_blockers table
    if 'slot_blockers' in tables:
        op.drop_index('ix_slot_blockers_end_date', table_name='slot_blockers')
        op.drop_index('ix_slot_blockers_start_date', table_name='slot_blockers')
        op.drop_index('ix_slot_blockers_staff_id', table_name='slot_blockers')
        op.drop_table('slot_blockers')
    
    # Remove columns from appointments table using batch mode
    if 'appointments' in tables:
        columns = [col['name'] for col in inspector.get_columns('appointments')]
        
        with op.batch_alter_table('appointments', schema=None) as batch_op:
            if 'last_modified_by' in columns:
                batch_op.drop_column('last_modified_by')
            if 'popup_notes' in columns:
                batch_op.drop_column('popup_notes')
            if 'resource_id' in columns:
                batch_op.drop_column('resource_id')
            if 'parent_appointment_id' in columns:
                batch_op.drop_column('parent_appointment_id')
            if 'recurring_end_date' in columns:
                batch_op.drop_column('recurring_end_date')
            if 'recurring_pattern' in columns:
                batch_op.drop_column('recurring_pattern')
            if 'color' in columns:
                batch_op.drop_column('color')
