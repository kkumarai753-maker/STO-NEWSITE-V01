"""create contact_submissions

Revision ID: 0001
Revises:
Create Date: 2026-10-06
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

contact_status = sa.Enum("new", "contacted", "closed", "spam", name="contact_status")


def upgrade() -> None:
    op.create_table(
        "contact_submissions",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", contact_status, nullable=False, server_default="new"),
        sa.Column("source", sa.String(50), nullable=False, server_default="website"),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("user_agent", sa.String(512), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_contact_submissions_email", "contact_submissions", ["email"])
    op.create_index(
        "ix_contact_submissions_status_created_at", "contact_submissions", ["status", "created_at"]
    )


def downgrade() -> None:
    op.drop_index("ix_contact_submissions_status_created_at", table_name="contact_submissions")
    op.drop_index("ix_contact_submissions_email", table_name="contact_submissions")
    op.drop_table("contact_submissions")
    contact_status.drop(op.get_bind(), checkfirst=True)
