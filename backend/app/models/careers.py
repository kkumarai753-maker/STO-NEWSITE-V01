"""Recruitment records are separate from customer enquiries. CV keys never leave the API."""

from datetime import datetime
from sqlalchemy import String, Text, DateTime, JSON, Integer, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class CareerRole(Base):
    __tablename__ = "career_roles"
    id: Mapped[str] = mapped_column(String(12), primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True)
    status: Mapped[str] = mapped_column(String(12), default="Draft")
    content: Mapped[dict] = mapped_column(JSON)
    display_order: Mapped[int] = mapped_column(Integer)


class CareerApplication(Base):
    __tablename__ = "career_applications"
    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    # A browser-generated unguessable retry secret, stored only as a hash.
    submission_hash: Mapped[str] = mapped_column(String(64), unique=True)
    payload_hash: Mapped[str] = mapped_column(String(64))
    role_id: Mapped[str | None] = mapped_column(String(12), index=True)
    category: Mapped[str] = mapped_column(String(64), index=True)
    kind: Mapped[str] = mapped_column(String(20))
    candidate: Mapped[dict] = mapped_column(JSON)
    role_title: Mapped[str] = mapped_column(String(160))
    cv_key: Mapped[str | None] = mapped_column(String(80))
    cv_type: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(24), default="Received", index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    route: Mapped[str] = mapped_column(String(12))
    email_status: Mapped[str] = mapped_column(String(20), default="not_requested")
    email_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    whatsapp_handoff_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    consent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
