"""Application settings, read from environment variables (or a .env file)."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Sunrise Tech Origin API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"

    # postgresql+psycopg://USER:PASSWORD@HOST:PORT/DB
    database_url: str = "postgresql+psycopg://sunrise:sunrise@localhost:5433/sunrise"

    # Shared secret the Next.js server sends in the X-API-Key header.
    # Empty disables the check (development only).
    api_key: str = ""

    # Browser origins allowed by CORS. The website calls the API server-to-server,
    # so this is only needed for an admin UI or local tooling.
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    # How long an admin dashboard sign-in lasts.
    admin_session_hours: int = Field(default=12, ge=1, le=24 * 30)

    # IANA time zone that defines "today" and "this month" on the dashboard.
    timezone: str = "Asia/Kolkata"

    # Recruitment stays inactive until private durable storage and reviewed policies exist.
    careers_enabled: bool = False
    careers_storage_dir: str = ""
    careers_retention_days: int = Field(default=0, ge=0, le=3650)
    careers_privacy_approved: bool = False
    careers_retention_schedule_confirmed: bool = False
    careers_email_enabled: bool = False
    careers_templates_approved: bool = False
    careers_sender: str = ""
    careers_resend_api_key: str = ""

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
