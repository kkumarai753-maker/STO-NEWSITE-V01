"""API key check for server-to-server calls from the Next.js site."""

import secrets

from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

from app.core.config import settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def require_api_key(api_key: str | None = Security(api_key_header)) -> None:
    if not settings.api_key:
        if settings.is_production:
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "API key is not configured.")
        return
    if not api_key or not secrets.compare_digest(api_key, settings.api_key):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or missing API key.")
