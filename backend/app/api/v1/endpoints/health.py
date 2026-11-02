"""Liveness / readiness check."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.api.deps import DbSession

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: DbSession):
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Database unavailable.") from exc
    return {"status": "ok"}
