"""Calendar periods ("today", "this month", …) in the configured time zone.

Boundaries are computed in local wall-clock time and converted to UTC for
queries, so the same code works on PostgreSQL and SQLite.
"""

from datetime import datetime, timedelta, timezone, tzinfo
from enum import Enum
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.core.config import settings


class Period(str, Enum):
    today = "today"
    yesterday = "yesterday"
    week = "week"
    month = "month"
    last_month = "last_month"
    last_7_days = "7d"
    last_30_days = "30d"


def get_timezone() -> tzinfo:
    try:
        return ZoneInfo(settings.timezone)
    except (ZoneInfoNotFoundError, ValueError):
        return timezone.utc


def start_of_today(tz: tzinfo, now: datetime | None = None) -> datetime:
    now = (now or datetime.now(timezone.utc)).astimezone(tz)
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


def _local_midnight(day: datetime, tz: tzinfo) -> datetime:
    # Re-attach the zone so DST changes between two dates are respected.
    return datetime(day.year, day.month, day.day, tzinfo=tz)


def period_range(period: Period, tz: tzinfo, now: datetime | None = None) -> tuple[datetime, datetime | None]:
    """Return (start, end) in UTC; end is None for periods that run until now."""
    today = start_of_today(tz, now)
    month_start = today.replace(day=1)
    match period:
        case Period.today:
            start, end = today, None
        case Period.yesterday:
            start, end = _local_midnight(today - timedelta(days=1), tz), today
        case Period.week:
            start, end = _local_midnight(today - timedelta(days=today.weekday()), tz), None
        case Period.month:
            start, end = month_start, None
        case Period.last_month:
            start, end = _local_midnight(month_start - timedelta(days=1), tz).replace(day=1), month_start
        case Period.last_7_days:
            start, end = _local_midnight(today - timedelta(days=6), tz), None
        case Period.last_30_days:
            start, end = _local_midnight(today - timedelta(days=29), tz), None
    return start.astimezone(timezone.utc), end.astimezone(timezone.utc) if end else None
