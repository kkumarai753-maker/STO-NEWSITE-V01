"""Admin dashboard request/response schemas."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.models.contact import ContactStatus
from app.schemas.contact import UtcDatetime

PASSWORD_MIN = 8
PASSWORD_MAX = 128


class AdminRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    last_login_at: UtcDatetime | None
    password_changed_at: UtcDatetime


class AdminMe(AdminRead):
    # Zone the dashboard uses for "today" / "this month"; the UI formats dates in it too.
    timezone: str


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    # Not stripped: whitespace can be part of a password.
    password: str = Field(min_length=1, max_length=PASSWORD_MAX)

    @field_validator("email")
    @classmethod
    def normalise_email(cls, value: str) -> str:
        return value.strip().lower()


class LoginResponse(BaseModel):
    token: str
    expires_at: UtcDatetime
    admin: AdminRead


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=PASSWORD_MAX)
    new_password: str = Field(min_length=PASSWORD_MIN, max_length=PASSWORD_MAX)

    @model_validator(mode="after")
    def check_new_password(self) -> "ChangePasswordRequest":
        if self.new_password == self.current_password:
            raise ValueError("The new password must be different from the current one.")
        if not any(c.isalpha() for c in self.new_password) or not any(c.isdigit() for c in self.new_password):
            raise ValueError("The new password must contain at least one letter and one number.")
        return self


class StatusCount(BaseModel):
    status: ContactStatus
    count: int


class SourceCount(BaseModel):
    source: str
    count: int


class DayCount(BaseModel):
    date: date
    count: int


class ContactTotals(BaseModel):
    total: int
    today: int
    yesterday: int
    this_week: int
    this_month: int
    last_month: int
    last_7_days: int
    last_30_days: int
    unique_senders: int


class DashboardStats(BaseModel):
    timezone: str
    generated_at: datetime
    latest_submission_at: datetime | None
    totals: ContactTotals
    by_status: list[StatusCount]
    by_source: list[SourceCount]
    daily: list[DayCount]
