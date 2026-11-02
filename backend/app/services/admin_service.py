"""Admin accounts and sign-in sessions."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.passwords import DUMMY_HASH, hash_password, hash_token, new_session_token, verify_password
from app.models.admin import AdminSession, AdminUser


def get_admin_by_email(db: Session, email: str) -> AdminUser | None:
    return db.scalar(select(AdminUser).where(func.lower(AdminUser.email) == email.strip().lower()))


def authenticate(db: Session, email: str, password: str) -> AdminUser | None:
    admin = get_admin_by_email(db, email)
    if admin is None:
        verify_password(password, DUMMY_HASH)  # same timing as a wrong password
        return None
    if not verify_password(password, admin.password_hash) or not admin.is_active:
        return None
    return admin


def create_session(db: Session, admin: AdminUser) -> tuple[str, AdminSession]:
    now = datetime.now(timezone.utc)
    # Housekeeping: drop this admin's expired sessions.
    db.execute(delete(AdminSession).where(AdminSession.admin_id == admin.id, AdminSession.expires_at <= now))
    token = new_session_token()
    session = AdminSession(
        admin_id=admin.id,
        token_hash=hash_token(token),
        expires_at=now + timedelta(hours=settings.admin_session_hours),
    )
    admin.last_login_at = now
    db.add(session)
    db.commit()
    db.refresh(session)
    db.refresh(admin)
    return token, session


def get_session(db: Session, token: str) -> AdminSession | None:
    return db.scalar(
        select(AdminSession)
        .join(AdminSession.admin)
        .where(
            AdminSession.token_hash == hash_token(token),
            AdminSession.expires_at > datetime.now(timezone.utc),
            AdminUser.is_active.is_(True),
        )
    )


def end_session(db: Session, session: AdminSession) -> None:
    db.delete(session)
    db.commit()


def change_password(db: Session, admin: AdminUser, new_password: str, keep_session_id: int) -> None:
    """Set a new password and sign out every other browser."""
    admin.password_hash = hash_password(new_password)
    admin.password_changed_at = datetime.now(timezone.utc)
    db.execute(
        delete(AdminSession).where(AdminSession.admin_id == admin.id, AdminSession.id != keep_session_id)
    )
    db.commit()
    db.refresh(admin)


def create_or_reset_admin(db: Session, email: str, password: str, name: str = "") -> tuple[AdminUser, bool]:
    """Used by the CLI. Returns (admin, created)."""
    admin = get_admin_by_email(db, email)
    created = admin is None
    if admin is None:
        admin = AdminUser(email=email.strip().lower(), name=name, password_hash=hash_password(password))
        db.add(admin)
    else:
        admin.password_hash = hash_password(password)
        admin.password_changed_at = datetime.now(timezone.utc)
        admin.is_active = True
        if name:
            admin.name = name
        db.execute(delete(AdminSession).where(AdminSession.admin_id == admin.id))
    db.commit()
    db.refresh(admin)
    return admin, created
