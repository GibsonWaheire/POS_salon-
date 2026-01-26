"""Add Google OAuth fields to users table

Revision ID: add_google_oauth
Revises: add_user_model
Create Date: 2026-01-26 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_google_oauth'
down_revision = 'add_phone_to_users'  # Update this based on your latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Make password_hash nullable for Google OAuth users
    op.alter_column('users', 'password_hash',
                    existing_type=sa.String(length=255),
                    nullable=True)
    
    # Add Google OAuth fields
    op.add_column('users', sa.Column('google_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('google_email', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('auth_provider', sa.String(length=20), server_default='email', nullable=False))
    
    # Create unique index on google_id
    op.create_unique_constraint('uq_users_google_id', 'users', ['google_id'])


def downgrade():
    # Remove unique constraint
    op.drop_constraint('uq_users_google_id', 'users', type_='unique')
    
    # Remove Google OAuth fields
    op.drop_column('users', 'auth_provider')
    op.drop_column('users', 'google_email')
    op.drop_column('users', 'google_id')
    
    # Make password_hash non-nullable again (may fail if there are Google users)
    # In production, you'd want to handle this more carefully
    op.alter_column('users', 'password_hash',
                    existing_type=sa.String(length=255),
                    nullable=False)
