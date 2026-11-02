from datetime import datetime, timedelta, timezone

from sqlalchemy import update
from sqlalchemy.orm import sessionmaker

from app.models.contact import ContactSubmission
from tests.conftest import ADMIN_EMAIL, ADMIN_PASSWORD

LOGIN = "/api/v1/admin/auth/login"
CONTACT = {
    "name": "Grace Hopper",
    "email": "grace@example.com",
    "phone": "",
    "message": "Please help us automate our reports.",
}


def _add_contact(client, **overrides) -> int:
    res = client.post("/api/v1/contacts", json={**CONTACT, **overrides})
    assert res.status_code == 201
    return res.json()["id"]


def _set_created_at(engine, contact_id: int, value: datetime) -> None:
    with sessionmaker(bind=engine)() as db:
        db.execute(update(ContactSubmission).where(ContactSubmission.id == contact_id).values(created_at=value))
        db.commit()


def test_login_rejects_wrong_password_and_unknown_email(admin_client):
    assert admin_client.post(LOGIN, json={"email": ADMIN_EMAIL, "password": "nope"}).status_code == 401
    assert admin_client.post(LOGIN, json={"email": "who@example.com", "password": "x"}).status_code == 401


def test_login_is_case_insensitive_on_email(admin_client):
    res = admin_client.post(LOGIN, json={"email": "  ADMIN@Example.com ", "password": ADMIN_PASSWORD})
    assert res.status_code == 200
    assert res.json()["admin"]["email"] == ADMIN_EMAIL


def test_routes_require_session_and_api_key(client, admin_client):
    assert admin_client.get("/api/v1/admin/auth/me").json()["email"] == ADMIN_EMAIL
    for path in ("/api/v1/admin/auth/me", "/api/v1/admin/stats", "/api/v1/admin/contacts"):
        assert client.get(path, headers={"Authorization": "Bearer bogus"}).status_code == 401
    assert admin_client.get("/api/v1/admin/stats", headers={"X-API-Key": "wrong"}).status_code == 401


def test_logout_revokes_the_token(admin_client):
    assert admin_client.post("/api/v1/admin/auth/logout").status_code == 204
    assert admin_client.get("/api/v1/admin/auth/me").status_code == 401


def test_change_password(admin_client):
    url = "/api/v1/admin/auth/change-password"
    other = admin_client.post(LOGIN, json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}).json()["token"]

    wrong = admin_client.post(url, json={"current_password": "bad", "new_password": "new-pass-123"})
    assert wrong.status_code == 400
    weak = admin_client.post(url, json={"current_password": ADMIN_PASSWORD, "new_password": "short"})
    assert weak.status_code == 422
    same = admin_client.post(url, json={"current_password": ADMIN_PASSWORD, "new_password": ADMIN_PASSWORD})
    assert same.status_code == 422

    ok = admin_client.post(url, json={"current_password": ADMIN_PASSWORD, "new_password": "new-pass-123"})
    assert ok.status_code == 204
    # This session survives; the other browser is signed out.
    assert admin_client.get("/api/v1/admin/auth/me").status_code == 200
    assert admin_client.get("/api/v1/admin/auth/me", headers={"Authorization": f"Bearer {other}"}).status_code == 401
    assert admin_client.post(LOGIN, json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}).status_code == 401
    assert admin_client.post(LOGIN, json={"email": ADMIN_EMAIL, "password": "new-pass-123"}).status_code == 200


def test_stats_counts_come_from_the_database(admin_client, engine):
    empty = admin_client.get("/api/v1/admin/stats").json()
    assert empty["totals"]["total"] == 0
    assert empty["latest_submission_at"] is None
    assert len(empty["daily"]) == 14

    now = datetime.now(timezone.utc)
    _add_contact(admin_client)
    _add_contact(admin_client, email="GRACE@example.com")  # same sender
    old = _add_contact(admin_client, email="old@example.com")
    _set_created_at(engine, old, now - timedelta(days=60))
    admin_client.patch(f"/api/v1/contacts/{old}", json={"status": "closed"})

    stats = admin_client.get("/api/v1/admin/stats").json()
    totals = stats["totals"]
    assert totals["total"] == 3
    assert totals["today"] == 2
    assert totals["this_month"] == 2
    assert totals["last_30_days"] == 2
    assert totals["unique_senders"] == 2
    by_status = {row["status"]: row["count"] for row in stats["by_status"]}
    assert by_status == {"new": 2, "contacted": 0, "closed": 1, "spam": 0}
    assert stats["by_source"] == [{"source": "website", "count": 3}]
    assert stats["daily"][-1]["count"] == 2


def test_admin_contact_listing_search_filter_and_paging(admin_client, engine):
    for i in range(5):
        _add_contact(admin_client, name=f"Person {i}", email=f"p{i}@example.com")
    _add_contact(admin_client, name="Zed 100%", email="zed@example.com", message="Needs a mobile app_build.")
    old = _add_contact(admin_client, name="Old Timer", email="old@example.com")
    _set_created_at(engine, old, datetime.now(timezone.utc) - timedelta(days=60))

    page = admin_client.get("/api/v1/admin/contacts?limit=3&offset=0").json()
    assert page["total"] == 7
    assert len(page["items"]) == 3

    assert admin_client.get("/api/v1/admin/contacts?q=zed").json()["total"] == 1
    assert admin_client.get("/api/v1/admin/contacts?q=100%25").json()["total"] == 1  # literal %
    assert admin_client.get("/api/v1/admin/contacts?q=app_b").json()["total"] == 1  # literal _
    assert admin_client.get("/api/v1/admin/contacts?period=today").json()["total"] == 6
    assert admin_client.get("/api/v1/admin/contacts?status=spam").json()["total"] == 0
    assert admin_client.get("/api/v1/admin/contacts?period=bogus").status_code == 422
