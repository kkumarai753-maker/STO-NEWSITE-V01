"""Declarative base. Import every model here so Alembic autogenerate sees it."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
