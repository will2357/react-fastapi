"""Add confirmation_token to users.

Revision ID: 002
Revises: 001_initial
Create Date: 2026-02-14

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "002"
down_revision: str | Sequence[str] | None = "001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("confirmation_token", sa.String(255), nullable=True),
    )
    op.create_index("ix_users_confirmation_token", "users", ["confirmation_token"], unique=True)
    op.add_column(
        "users",
        sa.Column("confirmation_token_expires", sa.DateTime(timezone=True), nullable=True),
    )
    op.alter_column("users", "is_active", server_default="false", existing_server_default="true")


def downgrade() -> None:
    op.alter_column("users", "is_active", server_default="true", existing_server_default="false")
    op.drop_column("users", "confirmation_token_expires")
    op.drop_index("ix_users_confirmation_token", table_name="users")
    op.drop_column("users", "confirmation_token")
