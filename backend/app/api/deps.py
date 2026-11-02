"""Shared FastAPI dependencies."""

from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.admin import AdminSession
from app.services import admin_service

DbSession = Annotated[Session, Depends(get_db)]

bearer = HTTPBearer(auto_error=False)


def get_admin_session(
    db: DbSession, credentials: HTTPAuthorizationCredentials | None = Security(bearer)
) -> AdminSession:
    """The signed-in admin's session, from `Authorization: Bearer <token>`."""
    session = admin_service.get_session(db, credentials.credentials) if credentials else None
    if session is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Your session has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return session


CurrentAdminSession = Annotated[AdminSession, Depends(get_admin_session)]
