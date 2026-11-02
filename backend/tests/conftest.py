"""Tests run against a real PostgreSQL database (TEST_DATABASE_URL).

Start one with `docker compose up -d db` (from the repo root); the tests create and drop a
separate `sunrise_test` database's tables, never the main one.
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("API_KEY", "test-key")

from app.db.session import get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base  # noqa: E402

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+psycopg://sunrise:sunrise@localhost:5433/sunrise_test"
)


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture()
def client(engine):
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, headers={"X-API-Key": "test-key"}) as c:
        yield c
    app.dependency_overrides.clear()
    with engine.begin() as conn:
        if engine.dialect.name == "postgresql":
            conn.exec_driver_sql("TRUNCATE career_applications, career_roles, contact_submissions, admin_sessions, admin_users RESTART IDENTITY")
        else:  # SQLite (handy for a quick local run): ids restart once a table is empty
            for table in reversed(Base.metadata.sorted_tables):
                conn.execute(table.delete())


ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "correct-horse-1"


@pytest.fixture()
def admin_client(client, engine):
    """A client signed in as an admin (Authorization header set)."""
    from app.services import admin_service

    with sessionmaker(bind=engine)() as db:
        admin_service.create_or_reset_admin(db, ADMIN_EMAIL, ADMIN_PASSWORD, "Ada Admin")
    res = client.post("/api/v1/admin/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert res.status_code == 200, res.text
    client.headers["Authorization"] = f"Bearer {res.json()['token']}"
    return client
