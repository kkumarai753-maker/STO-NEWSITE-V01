"""contact_submissions table — one row per message sent from the website form."""

import enum
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, Index, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ContactStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    closed = "closed"
    spam = "spam"


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    # BIGSERIAL on PostgreSQL; plain INTEGER on SQLite so local tooling can autoincrement.
    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True
    )
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(254))
    phone: Mapped[str | None] = mapped_column(String(32))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[ContactStatus] = mapped_column(
        Enum(ContactStatus, name="contact_status"),
        default=ContactStatus.new,
        server_default=ContactStatus.new.value,
    )
    source: Mapped[str] = mapped_column(String(50), default="website", server_default="website")
    ip_address: Mapped[str | None] = mapped_column(String(45))
    user_agent: Mapped[str | None] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        Index("ix_contact_submissions_email", "email"),
        Index("ix_contact_submissions_status_created_at", "status", "created_at"),
        Index("ix_contact_submissions_created_at", "created_at"),
    )
