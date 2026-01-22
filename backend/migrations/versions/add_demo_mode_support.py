"""Add demo mode support with is_demo flags

Revision ID: a1b2c3d4e5f6
Revises: 9727230072df
Create Date: 2026-01-22 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '9727230072df'
branch_labels = None
depends_on = None


def upgrade():
    # Add is_demo column to customers table
    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo column to sales table
    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo column to payments table
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo column to products table
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo column to expenses table
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo column to shifts table
    with op.batch_alter_table('shifts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))

    # Add is_demo and demo_mode_preference columns to staff table
    with op.batch_alter_table('staff', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_demo', sa.Boolean(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('demo_mode_preference', sa.Boolean(), nullable=False, server_default='0'))

    # Add demo_session_expires_at column to staff_login_logs table
    with op.batch_alter_table('staff_login_logs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('demo_session_expires_at', sa.DateTime(), nullable=True))


def downgrade():
    # Remove demo columns
    with op.batch_alter_table('staff_login_logs', schema=None) as batch_op:
        batch_op.drop_column('demo_session_expires_at')

    with op.batch_alter_table('staff', schema=None) as batch_op:
        batch_op.drop_column('demo_mode_preference')
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('shifts', schema=None) as batch_op:
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.drop_column('is_demo')

    with op.batch_alter_table('customers', schema=None) as batch_op:
        batch_op.drop_column('is_demo')
