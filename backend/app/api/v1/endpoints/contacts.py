"""Contact form endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import DbSession
from app.core.security import require_api_key
from app.models.contact import ContactStatus
from app.schemas.contact import ContactCreate, ContactList, ContactRead, ContactUpdate
from app.services import contact_service

router = APIRouter(prefix="/contacts", tags=["contacts"], dependencies=[Depends(require_api_key)])


@router.post("", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate, db: DbSession):
    """Store a submission from the website contact form."""
    return contact_service.create_contact(db, payload)


@router.get("", response_model=ContactList)
def list_contacts(
    db: DbSession,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status_filter: ContactStatus | None = Query(None, alias="status"),
):
    items, total = contact_service.list_contacts(db, limit=limit, offset=offset, status=status_filter)
    return ContactList(items=items, total=total, limit=limit, offset=offset)


@router.get("/{contact_id}", response_model=ContactRead)
def get_contact(contact_id: int, db: DbSession):
    contact = contact_service.get_contact(db, contact_id)
    if contact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Contact submission not found.")
    return contact


@router.patch("/{contact_id}", response_model=ContactRead)
def update_contact(contact_id: int, payload: ContactUpdate, db: DbSession):
    contact = contact_service.get_contact(db, contact_id)
    if contact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Contact submission not found.")
    return contact_service.update_status(db, contact, payload.status)
