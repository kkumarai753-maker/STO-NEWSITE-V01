"""Only documented role facts and candidate fields are accepted."""

from typing import Literal
import re
from pydantic import BaseModel, ConfigDict, Field, field_validator

CATEGORIES = [
    "website-development",
    "software-development",
    "ai-automation",
    "social-media-marketing-branding",
]
CATEGORY_NAMES = [
    "Website Development",
    "Software Development",
    "AI Automation & AI Agents",
    "Social Media Marketing & Branding",
]
HIRING_STATUSES = [
    "Received",
    "Reviewing",
    "Shortlisted",
    "Interview",
    "Selected",
    "Not Selected",
    "Withdrawn",
]


class Candidate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=254)
    phone: str = Field(min_length=7, max_length=30)
    city: str = Field(min_length=2, max_length=120)
    category: str
    role_id: str | None = Field(default=None, max_length=12)
    kind: Literal["role", "general"] = "role"
    experience: float = Field(ge=0, le=80)
    portfolio: str = Field(default="", max_length=1000)
    availability: str = Field(default="", max_length=200)
    introduction: str = Field(default="", max_length=2000)
    office_acknowledged: Literal[True]
    consent: Literal[True]
    privacy_version: Literal["careers-v1"]

    @field_validator("email")
    @classmethod
    def email_valid(cls, value):
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]{2,}", value):
            raise ValueError("Enter a valid email.")
        return value

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, value):
        if not re.fullmatch(r"\+[0-9 ()-]+", value) or not 7 <= len(re.sub(r"\D", "", value)) <= 15:
            raise ValueError("Include a country code, for example +91.")
        return value

    @field_validator("category")
    @classmethod
    def category_valid(cls, value):
        if value not in CATEGORIES:
            raise ValueError("Select a valid category.")
        return value

    @field_validator("portfolio")
    @classmethod
    def portfolio_valid(cls, value):
        if value and (not re.match(r"^https?://[^\s/]+", value) or any(x in value for x in ["\r", "\n"])):
            raise ValueError("Use a valid https or http URL.")
        return value


class RoleEdit(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    status: Literal["Draft", "Open", "Closed"]
    title: str = Field(min_length=2, max_length=160)
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=160)
    category: str
    function: Literal["Sales", "Operations", "Development", "Marketing"]
    headline: str = Field(min_length=2, max_length=250)
    summary: str = Field(min_length=10, max_length=2000)
    responsibilities: list[str] = Field(min_length=1, max_length=20)
    skills: list[str] = Field(min_length=1, max_length=20)
    work_samples: str = Field(max_length=1500)
    image: str = Field(default="", max_length=250)
    display_order: int = Field(ge=1, le=100)

    @field_validator("category")
    @classmethod
    def category_valid(cls, value):
        if value not in CATEGORIES:
            raise ValueError("Unknown category.")
        return value

    @field_validator("image")
    @classmethod
    def image_valid(cls, value):
        if value and (not re.fullmatch(r"/careers/[a-zA-Z0-9_-]+\.(svg|webp|png|jpg)", value)):
            raise ValueError("Use approved artwork from /careers/.")
        return value

    @field_validator("title", "headline", "summary", "responsibilities", "skills", "work_samples")
    @classmethod
    def fixed_facts(cls, value):
        text = " ".join(value) if isinstance(value, list) else value
        if re.search(
            r"\b(salary|ctc|compensation|incentives?|pay range|remote|hybrid|work.from.home)\b|[₹$€]",
            text,
            re.I,
        ):
            raise ValueError("Keep the fixed office-work policy and omit compensation content.")
        if isinstance(value, list) and any(len(x) > 1500 or not x.strip() for x in value):
            raise ValueError("List items must be nonempty and at most 1500 characters.")
        return value


class ApplicationEdit(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: Literal[
        "Received", "Reviewing", "Shortlisted", "Interview", "Selected", "Not Selected", "Withdrawn"
    ]
    notes: str = Field(default="", max_length=10000)
