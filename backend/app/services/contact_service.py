"""Database operations for contact submissions."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import distinct, func, or_, select
from sqlalchemy.orm import Session

from app.models.contact import ContactStatus, ContactSubmission
from app.schemas.admin import ContactTotals, DashboardStats, DayCount, SourceCount, StatusCount
from app.schemas.contact import ContactCreate
from app.services.periods import Period, get_timezone, period_range, start_of_today

DAILY_CHART_DAYS = 14


def create_contact(db: Session, data: ContactCreate) -> ContactSubmission:
    contact = ContactSubmission(**data.model_dump(exclude={"phone"}), phone=data.phone or None)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def _escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def list_contacts(
    db: Session,
    *,
    limit: int,
    offset: int,
    status: ContactStatus | None = None,
    search: str | None = None,
    period: Period | None = None,
) -> tuple[list[ContactSubmission], int]:
    query = select(ContactSubmission)
    if status is not None:
        query = query.where(ContactSubmission.status == status)
    if search:
        pattern = f"%{_escape_like(search)}%"
        query = query.where(
            or_(
                *(
                    column.ilike(pattern, escape="\\")
                    for column in (
                        ContactSubmission.name,
                        ContactSubmission.email,
                        ContactSubmission.phone,
                        ContactSubmission.message,
                    )
                )
            )
        )
    if period is not None:
        start, end = period_range(period, get_timezone())
        query = query.where(ContactSubmission.created_at >= start)
        if end is not None:
            query = query.where(ContactSubmission.created_at < end)
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    rows = db.scalars(
        query.order_by(ContactSubmission.created_at.desc(), ContactSubmission.id.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return list(rows), total


def get_contact(db: Session, contact_id: int) -> ContactSubmission | None:
    return db.get(ContactSubmission, contact_id)


def update_status(db: Session, contact: ContactSubmission, status: ContactStatus) -> ContactSubmission:
    contact.status = status
    db.commit()
    db.refresh(contact)
    return contact


def _as_utc(value: datetime) -> datetime:
    # SQLite returns naive datetimes; they are stored in UTC.
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


def contact_stats(db: Session) -> DashboardStats:
    """Counts for the admin dashboard, all computed from the database."""
    tz = get_timezone()
    now = datetime.now(timezone.utc)
    created = ContactSubmission.created_at

    def count_in(period: Period):
        start, end = period_range(period, tz, now)
        condition = created >= start if end is None else (created >= start) & (created < end)
        return func.count().filter(condition)

    row = db.execute(
        select(
            func.count().label("total"),
            count_in(Period.today).label("today"),
            count_in(Period.yesterday).label("yesterday"),
            count_in(Period.week).label("this_week"),
            count_in(Period.month).label("this_month"),
            count_in(Period.last_month).label("last_month"),
            count_in(Period.last_7_days).label("last_7_days"),
            count_in(Period.last_30_days).label("last_30_days"),
            func.count(distinct(func.lower(ContactSubmission.email))).label("unique_senders"),
            func.max(created).label("latest"),
        )
    ).one()

    status_counts = dict(
        db.execute(select(ContactSubmission.status, func.count()).group_by(ContactSubmission.status)).all()
    )
    source_rows = db.execute(
        select(ContactSubmission.source, func.count().label("n"))
        .group_by(ContactSubmission.source)
        .order_by(func.count().desc(), ContactSubmission.source)
    ).all()

    # Per-day counts for the chart, bucketed by local date.
    today = start_of_today(tz, now)
    first_day = (today - timedelta(days=DAILY_CHART_DAYS - 1)).date()
    chart_start = datetime(first_day.year, first_day.month, first_day.day, tzinfo=tz).astimezone(timezone.utc)
    per_day: dict = {}
    for (value,) in db.execute(select(created).where(created >= chart_start)):
        day = _as_utc(value).astimezone(tz).date()
        per_day[day] = per_day.get(day, 0) + 1
    daily = [
        DayCount(date=day, count=per_day.get(day, 0))
        for day in (first_day + timedelta(days=i) for i in range(DAILY_CHART_DAYS))
    ]

    return DashboardStats(
        timezone=str(tz),
        generated_at=now,
        latest_submission_at=_as_utc(row.latest) if row.latest else None,
        totals=ContactTotals(
            total=row.total,
            today=row.today,
            yesterday=row.yesterday,
            this_week=row.this_week,
            this_month=row.this_month,
            last_month=row.last_month,
            last_7_days=row.last_7_days,
            last_30_days=row.last_30_days,
            unique_senders=row.unique_senders,
        ),
        by_status=[StatusCount(status=s, count=status_counts.get(s, 0)) for s in ContactStatus],
        by_source=[SourceCount(source=source, count=n) for source, n in source_rows],
        daily=daily,
    )
