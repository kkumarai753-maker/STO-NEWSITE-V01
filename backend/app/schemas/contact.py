"""Request/response schemas. Rules mirror sunrise/lib/validation/contact.ts."""

from datetime import datetime, timezone
from typing import Annotated

from pydantic import AfterValidator, BaseModel, ConfigDict, Field, field_validator

from app.models.contact import ContactStatus

EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
# Optional; when given, exactly 10 digits (ASCII 0-9 only — no +, spaces or decimals).
PHONE_LENGTH = 10
PHONE_PATTERN = rf"^$|^[0-9]{{{PHONE_LENGTH}}}$"

# Timestamps are stored in UTC; SQLite hands them back without a zone.
UtcDatetime = Annotated[
    datetime, AfterValidator(lambda v: v.replace(tzinfo=timezone.utc) if v.tzinfo is None else v)
]


class ContactCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=254, pattern=EMAIL_PATTERN)
    phone: str = Field(default="", max_length=PHONE_LENGTH, pattern=PHONE_PATTERN)
    message: str = Field(min_length=10, max_length=4000)
    source: str = Field(default="website", max_length=50)
    ip_address: str | None = Field(default=None, max_length=45)
    user_agent: str | None = Field(default=None, max_length=512)
    # The website flags suspected spam instead of dropping it, so nothing is lost.
    status: ContactStatus = ContactStatus.new

    @field_validator("status")
    @classmethod
    def only_new_or_spam(cls, value: ContactStatus) -> ContactStatus:
        if value not in (ContactStatus.new, ContactStatus.spam):
            raise ValueError("A new submission can only be 'new' or 'spam'.")
        return value

    @field_validator("user_agent", mode="before")
    @classmethod
    def truncate_user_agent(cls, value: str | None) -> str | None:
        return value[:512] if isinstance(value, str) else value


class ContactUpdate(BaseModel):
    status: ContactStatus


class ContactRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str | None
    message: str
    status: ContactStatus
    source: str
    created_at: UtcDatetime
    updated_at: UtcDatetime


class ContactList(BaseModel):
    items: list[ContactRead]
    total: int
    limit: int
    offset: int
