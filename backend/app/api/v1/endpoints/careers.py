"""Careers API. Private records always require an authenticated admin session."""

import threading
import time
from collections import OrderedDict
from datetime import datetime, date, timezone
from typing import Literal
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse
from pydantic import ValidationError
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from app.api.deps import DbSession, CurrentAdminSession
from app.core.security import require_api_key
from app.models.careers import CareerRole, CareerApplication
from app.schemas.careers import Candidate, RoleEdit, ApplicationEdit
from app.services import careers as service

router = APIRouter(tags=["careers"], dependencies=[Depends(require_api_key)])
_attempts = OrderedDict()
_lock = threading.Lock()


def limit_requests(key):
    now = time.monotonic()
    with _lock:
        while _attempts and next(iter(_attempts.values()))[0] < now - 600:
            _attempts.popitem(last=False)
        started, count = _attempts.get(key, (now, 0))
        if count >= 8:
            raise HTTPException(429, "Too many attempts. Please try again in 10 minutes.")
        _attempts[key] = (started, count + 1)
        if len(_attempts) > 10000:
            _attempts.popitem(last=False)


@router.get("/careers")
def public_roles(db: DbSession):
    roles = db.scalars(
        select(CareerRole).where(CareerRole.status == "Open").order_by(CareerRole.display_order)
    ).all()
    configuration = service.configuration(db)
    return {
        "roles": [service.role_view(r) for r in roles],
        "applications_enabled": configuration["applications_enabled"],
        "email_enabled": configuration["email_enabled"],
        "retention_days": configuration["retention_days"],
    }


@router.post("/careers/applications")
async def apply(
    db: DbSession,
    request: Request,
    candidate: str = Form(..., max_length=12000),
    submission_token: str = Form(..., max_length=64),
    route: Literal["whatsapp", "email"] = Form(...),
    started_at: float = Form(...),
    website: str = Form("", max_length=200),
    resume: UploadFile | None = File(None),
):
    # Trusted Next.js gateway provides the client key; the API is key-protected.
    key = request.headers.get("X-Recruitment-Client", request.client.host if request.client else "unknown")[
        :128
    ]
    limit_requests(key)
    if website or not 2500 <= time.time() * 1000 - started_at <= 24 * 60 * 60 * 1000:
        raise HTTPException(422, "Please review the form and try again.")
    try:
        person = Candidate.model_validate_json(candidate)
    except ValidationError as exc:
        errors = [{"field": ".".join(str(v) for v in e["loc"]), "message": e["msg"]} for e in exc.errors()]
        raise HTTPException(422, detail=errors)
    data = await resume.read(service.MAX_CV + 1) if resume else b""
    if resume:
        await resume.close()
    record = service.save_application(
        db, person, data, resume.filename if resume else "", submission_token, route, key
    )
    if route == "whatsapp":
        record.whatsapp_handoff_at = datetime.now(timezone.utc)
        db.commit()
    email_status = service.submit_email(db, record) if route == "email" else record.email_status
    return {
        "id": record.id,
        "saved": True,
        "has_resume": bool(record.cv_key),
        "email_status": email_status,
        "message": service.contact_message(record),
        "whatsapp_handoff": route == "whatsapp",
    }


@router.get("/admin/careers")
def admin_roles(_: CurrentAdminSession, db: DbSession):
    return {
        "roles": [
            service.role_view(r, True)
            for r in db.scalars(select(CareerRole).order_by(CareerRole.display_order)).all()
        ],
        "configuration": service.configuration(db),
    }


@router.post("/admin/careers/roles/{role_id}")
def update_role(role_id: str, payload: RoleEdit, _: CurrentAdminSession, db: DbSession):
    role = db.get(CareerRole, role_id)
    if not role:
        raise HTTPException(404, "Role not found.")
    data = payload.model_dump()
    role.status = data.pop("status")
    role.slug = data.pop("slug")
    role.display_order = data.pop("display_order")
    data["visual_note"] = role.content.get("visual_note", "")
    role.content = data
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Another role already uses that slug.")
    return service.role_view(role, True)


@router.get("/admin/careers/applications")
def inbox(
    _: CurrentAdminSession,
    db: DbSession,
    role: str | None = None,
    category: str | None = None,
    status: str | None = None,
    after: date | None = None,
    before: date | None = None,
    kind: Literal["role", "general"] | None = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(30, ge=1, le=100),
):
    filters = []
    if role:
        filters.append(CareerApplication.role_id == role)
    if category:
        filters.append(CareerApplication.category == category)
    if status:
        filters.append(CareerApplication.status == status)
    if kind:
        filters.append(CareerApplication.kind == kind)
    if after:
        filters.append(func.date(CareerApplication.created_at) >= after)
    if before:
        filters.append(func.date(CareerApplication.created_at) <= before)
    total = db.scalar(select(func.count()).select_from(CareerApplication).where(*filters))
    records = db.scalars(
        select(CareerApplication)
        .where(*filters)
        .order_by(CareerApplication.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return {"items": [service.application_view(r) for r in records], "total": total}


def get_record(db, application_id):
    record = db.get(CareerApplication, application_id)
    if not record:
        raise HTTPException(404, "Application not found.")
    return record


@router.get("/admin/careers/applications/{application_id}")
def application(application_id: str, _: CurrentAdminSession, db: DbSession):
    return service.application_view(get_record(db, application_id))


@router.post("/admin/careers/applications/{application_id}")
def edit_application(application_id: str, payload: ApplicationEdit, _: CurrentAdminSession, db: DbSession):
    record = get_record(db, application_id)
    record.status = payload.status
    record.notes = payload.notes
    db.commit()
    return service.application_view(record)


@router.post("/admin/careers/applications/{application_id}/delete")
def delete_application(application_id: str, _: CurrentAdminSession, db: DbSession):
    service.delete_application(db, get_record(db, application_id))
    return {"deleted": True}


@router.post("/admin/careers/purge")
def purge(_: CurrentAdminSession, db: DbSession):
    return {"deleted": service.purge_expired(db)}


@router.post("/admin/careers/applications/{application_id}/download-ticket")
def ticket(application_id: str, session: CurrentAdminSession, db: DbSession):
    record = get_record(db, application_id)
    if not record.cv_key:
        raise HTTPException(404, "No resume attached.")
    return {"ticket": service.download_ticket(record.id, session.id), "expires_in": 90}


@router.get("/admin/careers/applications/{application_id}/resume")
def resume(
    application_id: str, session: CurrentAdminSession, db: DbSession, ticket: str = Query(..., max_length=100)
):
    record = get_record(db, application_id)
    if not service.verify_ticket(ticket, application_id, session.id):
        raise HTTPException(403, "Download link has expired.")
    if not record.cv_key:
        raise HTTPException(404, "No resume attached.")
    if record.expires_at.replace(tzinfo=timezone.utc) <= datetime.now(timezone.utc):
        raise HTTPException(410, "The resume retention period has expired.")
    path = service.cv_path(record.cv_key)
    if not path.is_file():
        raise HTTPException(404, "Resume is unavailable.")
    return FileResponse(
        path,
        media_type="application/octet-stream",
        filename="resume" + path.suffix,
        headers={
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "sandbox",
        },
    )
