"""Private recruitment persistence, bounded document validation and explicit delivery states."""

import base64
import hashlib
import hmac
import io
import json
import os
import logging
import re
import secrets
import time
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib import request
from xml.etree import ElementTree
from pypdf import PdfReader
from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from app.core.config import settings
from app.models.admin import AdminUser
from app.models.careers import CareerRole, CareerApplication
from app.schemas.careers import CATEGORY_NAMES, CATEGORIES

logging.getLogger("pypdf").disabled = True

MAX_CV = 5 * 1024 * 1024
OFFICE = "Work from Office"
LOCATION = "Nagpur, Maharashtra, India"


def seed_roles(db):
    profiles = json.loads((Path(__file__).parents[1] / "career_profiles.json").read_text())
    for profile in profiles:
        if not db.get(CareerRole, profile["id"]):
            data = dict(profile)
            role_id, slug, status, order = [data.pop(k) for k in ("id", "slug", "status", "display_order")]
            db.add(CareerRole(id=role_id, slug=slug, status=status, display_order=order, content=data))
    db.commit()


def role_view(role, private=False):
    # Content is validated on writes; visual notes stay internal.
    data = {k: v for k, v in role.content.items() if k != "visual_note"}
    return {
        **data,
        "id": role.id,
        "slug": role.slug,
        "status": role.status,
        "display_order": role.display_order,
        "work_mode": OFFICE,
        "location": LOCATION,
        **({"visual_note": role.content.get("visual_note", "")} if private else {}),
    }


def configuration(db):
    private_path = Path(settings.careers_storage_dir) if settings.careers_storage_dir else None
    storage = bool(
        private_path
        and private_path.is_absolute()
        and private_path.is_dir()
        and os.access(private_path, os.W_OK)
    )
    admin = db.scalar(select(AdminUser.id).where(AdminUser.is_active.is_(True)).limit(1)) is not None
    active = bool(
        settings.careers_enabled
        and storage
        and admin
        and settings.careers_privacy_approved
        and settings.careers_retention_days
        and settings.careers_retention_schedule_confirmed
    )
    email_ready = bool(
        active
        and settings.careers_email_enabled
        and settings.careers_templates_approved
        and settings.careers_resend_api_key
        and re.fullmatch(r"[^\s@]+@sunrisetechorigin\.com", settings.careers_sender, re.I)
    )
    return {
        "applications_enabled": active,
        "email_enabled": email_ready,
        "retention_days": settings.careers_retention_days if settings.careers_privacy_approved else None,
        "checks": {
            "enabled": settings.careers_enabled,
            "private_storage": storage,
            "admin_access": admin,
            "privacy_approved": settings.careers_privacy_approved,
            "retention_configured": bool(settings.careers_retention_days),
            "retention_schedule_confirmed": settings.careers_retention_schedule_confirmed,
            "templates_approved": settings.careers_templates_approved,
            "email_configured": email_ready,
        },
    }


def validate_cv(data, filename):
    if not data or len(data) > MAX_CV:
        raise HTTPException(422, "Upload one PDF or DOCX up to 5 MB.")
    ext = Path(filename or "").suffix.lower()
    try:
        if ext == ".pdf" and data.startswith(b"%PDF-"):
            reader = PdfReader(io.BytesIO(data), strict=True)
            if reader.is_encrypted or not reader.pages:
                raise ValueError()
            # Only parse the document structure, never execute or render its content.
            return "application/pdf", ".pdf"
        if ext == ".docx" and data.startswith(b"PK"):
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                entries = archive.infolist()
                names = {item.filename for item in entries}
                if len(entries) > 1000 or sum(item.file_size for item in entries) > 25 * 1024 * 1024:
                    raise ValueError()
                if not {"[Content_Types].xml", "word/document.xml"} <= names:
                    raise ValueError()
                if any("vbaproject" in name.lower() for name in names):
                    raise ValueError()
                manifest = archive.read("[Content_Types].xml")
                if b"<!DOCTYPE" in manifest.upper() or b"<!ENTITY" in manifest.upper():
                    raise ValueError()
                root = ElementTree.fromstring(manifest)
                if not any(
                    item.get("PartName") == "/word/document.xml"
                    and item.get("ContentType")
                    == "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"
                    for item in root
                ):
                    raise ValueError()
                document = archive.read("word/document.xml")
                if b"<!DOCTYPE" in document.upper() or b"<!ENTITY" in document.upper():
                    raise ValueError()
                ElementTree.fromstring(document)
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"
    except Exception:
        # No document contents or filenames in logs or errors.
        pass
    raise HTTPException(
        422,
        "The file must be a readable, unencrypted PDF or a valid DOCX. Renaming another file does not change its type.",
    )


def cv_path(key):
    if not re.fullmatch(r"[a-f0-9]{48}\.(pdf|docx)", key or ""):
        raise HTTPException(404, "Resume not found.")
    return Path(settings.careers_storage_dir) / key


def save_application(db, candidate, cv, filename, token, route, requester):
    if not configuration(db)["applications_enabled"]:
        raise HTTPException(
            503, "Online applications are not active. Please contact the hiring team for questions."
        )
    if not re.fullmatch(r"[a-f0-9-]{32,64}", token):
        raise HTTPException(422, "Refresh the application form and try again.")
    cv_type, ext = validate_cv(cv, filename) if cv else (None, None)
    if candidate.kind == "role" and not cv:
        raise HTTPException(422, "Please upload your resume.")
    if candidate.kind == "general" and candidate.role_id:
        raise HTTPException(422, "General interest must not select a vacancy.")
    payload = candidate.model_dump()
    payload_hash = hashlib.sha256(
        (json.dumps(payload, sort_keys=True) + hashlib.sha256(cv or b"").hexdigest()).encode()
    ).hexdigest()
    submission_hash = hashlib.sha256(token.encode()).hexdigest()
    existing = db.scalar(
        select(CareerApplication).where(CareerApplication.submission_hash == submission_hash)
    )
    if existing:
        if existing.payload_hash != payload_hash:
            raise HTTPException(
                409, "This request was already saved. Start a new application to change its details."
            )
        return existing
    role = db.get(CareerRole, candidate.role_id) if candidate.role_id else None
    if candidate.kind == "role" and (
        not role or role.status != "Open" or role.content["category"] != candidate.category
    ):
        raise HTTPException(
            409, "This role is no longer open. Please return to Careers and choose an available role."
        )
    now = datetime.now(timezone.utc)
    key = secrets.token_hex(24) + ext if ext else None
    record = CareerApplication(
        id="STO-" + secrets.token_hex(12).upper(),
        submission_hash=submission_hash,
        payload_hash=payload_hash,
        role_id=role.id if role else None,
        category=candidate.category,
        kind=candidate.kind,
        candidate=payload,
        role_title=role.content["title"] if role else "General interest",
        cv_key=key,
        cv_type=cv_type,
        status="Received",
        notes="",
        route=route,
        email_status="not_requested",
        consent_at=now,
        expires_at=now + timedelta(days=settings.careers_retention_days),
    )
    try:
        if key:
            path = cv_path(key)
            with os.fdopen(os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "wb") as output:
                output.write(cv)
        db.add(record)
        db.commit()
        db.refresh(record)
    except IntegrityError:
        db.rollback()
        if key:
            cv_path(key).unlink(missing_ok=True)
        existing = db.scalar(
            select(CareerApplication).where(CareerApplication.submission_hash == submission_hash)
        )
        if existing and existing.payload_hash == payload_hash:
            return existing
        raise HTTPException(409, "Please retry using the original application details.")
    except Exception:
        db.rollback()
        if key:
            cv_path(key).unlink(missing_ok=True)
        raise HTTPException(503, "We could not save your application. Your form is unchanged; please retry.")
    return record


def contact_message(record):
    category = CATEGORY_NAMES[CATEGORIES.index(record.category)]
    return (
        f"Hello Team Sunrise Tech Origin, I would like to apply for {record.role_title} in {category}. My name is {record.candidate['name']}. My application reference is {record.id}. "
        + (
            "I have uploaded my resume through your Careers form."
            if record.cv_key
            else "I shared my profile for future consideration."
        )
    )


def submit_email(db, record):
    if not configuration(db)["email_enabled"]:
        return "not_configured"
    if record.email_status == "submitted":
        return "submitted"
    now = datetime.now(timezone.utc)
    # Atomic claim and provider idempotency prevent duplicate sends across concurrent retries.
    claimed = db.execute(
        update(CareerApplication)
        .where(
            CareerApplication.id == record.id,
            (CareerApplication.email_status.in_(["not_requested", "failed"]))
            | (
                (CareerApplication.email_status == "pending")
                & (CareerApplication.email_attempt_at < now - timedelta(minutes=2))
            ),
        )
        .values(email_status="pending", email_attempt_at=now)
    )
    db.commit()
    if not claimed.rowcount:
        db.refresh(record)
        return record.email_status
    db.refresh(record)
    person = record.candidate
    body = "\n".join(
        [
            f"Application reference: {record.id}",
            f"Role: {record.role_title}",
            f"Category: {CATEGORY_NAMES[CATEGORIES.index(record.category)]}",
            f"Work from Office | {LOCATION}",
            *(
                f"{key.replace('_',' ').title()}: {person.get(key,'')}"
                for key in [
                    "name",
                    "email",
                    "phone",
                    "city",
                    "experience",
                    "availability",
                    "portfolio",
                    "introduction",
                ]
            ),
            "",
            "Team Sunrise Tech Origin",
        ]
    )
    payload = {
        "from": settings.careers_sender,
        "to": ["info@sunrisetechorigin.com"],
        "reply_to": person["email"],
        "subject": f"Career Application | {record.role_title} | {person['name']} | {record.id}",
        "text": body,
    }
    if record.cv_key:
        try:
            payload["attachments"] = [
                {
                    "filename": "resume" + Path(record.cv_key).suffix,
                    "content": base64.b64encode(cv_path(record.cv_key).read_bytes()).decode(),
                }
            ]
        except OSError:
            record.email_status = "failed"
            db.commit()
            return "failed"
    req = request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": "Bearer " + settings.careers_resend_api_key,
            "Content-Type": "application/json",
            "Idempotency-Key": "career-" + record.id,
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=20) as response:
            result = json.loads(response.read())
            record.email_status = "submitted" if result.get("id") else "failed"
    except Exception:
        record.email_status = "failed"
    db.commit()
    return record.email_status


def application_view(record):
    return {
        "id": record.id,
        "role_id": record.role_id,
        "role_title": record.role_title,
        "category": record.category,
        "kind": record.kind,
        "candidate": record.candidate,
        "status": record.status,
        "notes": record.notes,
        "route": record.route,
        "email_status": record.email_status,
        "has_resume": bool(record.cv_key),
        "created_at": record.created_at,
        "consent_at": record.consent_at,
        "expires_at": record.expires_at,
        "email_attempt_at": record.email_attempt_at,
        "whatsapp_handoff_at": record.whatsapp_handoff_at,
    }


def download_ticket(record_id, session_id):
    expiry = int(time.time()) + 90
    value = f"{record_id}:{session_id}:{expiry}"
    signature = hmac.new(settings.api_key.encode(), value.encode(), hashlib.sha256).hexdigest()
    return f"{expiry}.{signature}"


def verify_ticket(ticket, record_id, session_id):
    try:
        expiry, signature = ticket.split(".")
        if not int(time.time()) <= int(expiry) <= int(time.time()) + 90:
            return False
        value = f"{record_id}:{session_id}:{expiry}"
        return hmac.compare_digest(
            signature, hmac.new(settings.api_key.encode(), value.encode(), hashlib.sha256).hexdigest()
        )
    except (ValueError, AttributeError):
        return False


def delete_application(db, record):
    if record.cv_key:
        cv_path(record.cv_key).unlink(missing_ok=True)
    db.delete(record)
    db.commit()


def purge_expired(db):
    records = db.scalars(
        select(CareerApplication).where(CareerApplication.expires_at <= datetime.now(timezone.utc))
    ).all()
    for record in records:
        delete_application(db, record)
    return len(records)
