"""merge google oauth and subscriptions heads

Revision ID: 72ac9f46f673
Revises: add_google_oauth, add_subscriptions
Create Date: 2026-05-07 12:55:54.802129

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72ac9f46f673'
down_revision = ('add_google_oauth', 'add_subscriptions')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
