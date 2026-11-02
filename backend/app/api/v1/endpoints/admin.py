"""Admin dashboard endpoints: sign-in, account settings, stats and records.

Every route needs the X-API-Key header (only the Next.js server has it); all
routes except login also need an admin session token.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.deps import CurrentAdminSession, DbSession
from app.core.passwords import verify_password
from app.core.security import require_api_key
from app.models.contact import ContactStatus
from app.schemas.admin import AdminMe, AdminRead, ChangePasswordRequest, DashboardStats, LoginRequest, LoginResponse
from app.schemas.contact import ContactList
from app.services import admin_service, contact_service
from app.services.periods import Period, get_timezone

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_api_key)])


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: DbSession):
    admin = admin_service.authenticate(db, payload.email, payload.password)
    if admin is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password.")
    token, session = admin_service.create_session(db, admin)
    return LoginResponse(token=token, expires_at=session.expires_at, admin=AdminRead.model_validate(admin))


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(session: CurrentAdminSession, db: DbSession):
    admin_service.end_session(db, session)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/auth/me", response_model=AdminMe)
def me(session: CurrentAdminSession):
    data = AdminRead.model_validate(session.admin).model_dump()
    return AdminMe(**data, timezone=str(get_timezone()))


@router.post("/auth/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(payload: ChangePasswordRequest, session: CurrentAdminSession, db: DbSession):
    admin = session.admin
    if not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Your current password is incorrect.")
    admin_service.change_password(db, admin, payload.new_password, keep_session_id=session.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/stats", response_model=DashboardStats)
def stats(_: CurrentAdminSession, db: DbSession):
    return contact_service.contact_stats(db)


@router.get("/contacts", response_model=ContactList)
def list_contacts(
    _: CurrentAdminSession,
    db: DbSession,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status_filter: ContactStatus | None = Query(None, alias="status"),
    q: str | None = Query(None, max_length=200),
    period: Period | None = Query(None),
):
    items, total = contact_service.list_contacts(
        db, limit=limit, offset=offset, status=status_filter, search=(q or "").strip() or None, period=period
    )
    return ContactList(items=items, total=total, limit=limit, offset=offset)
