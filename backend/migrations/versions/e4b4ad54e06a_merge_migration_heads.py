"""Merge migration heads

Revision ID: e4b4ad54e06a
Revises: a140a81ac04f, add_phone_to_users
Create Date: 2026-01-24 11:50:40.293127

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e4b4ad54e06a'
down_revision = ('a140a81ac04f', 'add_phone_to_users')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
