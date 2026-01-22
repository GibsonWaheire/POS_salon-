"""Add managed_by field to users table for admin-manager relationship

Revision ID: add_managed_by_field
Revises: add_professional_commission_structure
Create Date: 2026-01-22 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_managed_by_field'
down_revision = 'add_professional_commission_structure'
branch_labels = None
depends_on = None


def upgrade():
    # Add managed_by column to users table
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    # Check if column already exists
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'managed_by' not in columns:
        op.add_column('users', sa.Column('managed_by', sa.Integer(), nullable=True))
        op.create_foreign_key(
            'fk_users_managed_by',
            'users', 'users',
            ['managed_by'], ['id'],
            ondelete='SET NULL'
        )
    
    # Update existing manager user to have role 'admin' if it's the first user
    # This ensures the first user becomes admin
    result = conn.execute(sa.text("SELECT COUNT(*) FROM users WHERE role = 'admin'")).scalar()
    if result == 0:
        # Update the first user to be admin
        conn.execute(sa.text("""
            UPDATE users 
            SET role = 'admin' 
            WHERE id = (SELECT MIN(id) FROM users)
        """))


def downgrade():
    # Remove foreign key constraint
    op.drop_constraint('fk_users_managed_by', 'users', type_='foreignkey')
    # Remove managed_by column
    op.drop_column('users', 'managed_by')
