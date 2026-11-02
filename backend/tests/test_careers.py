import io
import json
import time
import uuid
import zipfile
from datetime import datetime, timedelta, timezone
import pytest
from pypdf import PdfWriter
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.careers import CareerApplication, CareerRole
from app.services import careers as service
from app.api.v1.endpoints.careers import _attempts


@pytest.fixture
def careers(admin_client, engine, tmp_path, monkeypatch):
    for key, value in {
        "careers_enabled": True,
        "careers_storage_dir": str(tmp_path),
        "careers_retention_days": 30,
        "careers_privacy_approved": True,
        "careers_retention_schedule_confirmed": True,
        "careers_email_enabled": False,
        "careers_templates_approved": False,
    }.items():
        monkeypatch.setattr(settings, key, value)
    _attempts.clear()
    with sessionmaker(bind=engine)() as db:
        service.seed_roles(db)
    return admin_client


def open_role(engine, role_id="WEB-03"):
    with sessionmaker(bind=engine)() as db:
        role = db.get(CareerRole, role_id)
        role.status = "Open"
        db.commit()


def pdf():
    output = io.BytesIO()
    writer = PdfWriter()
    writer.add_blank_page(width=100, height=100)
    writer.write(output)
    return output.getvalue()


def person(**overrides):
    return {
        "name": "Test Candidate",
        "email": "candidate@example.com",
        "phone": "+91 98765 43210",
        "city": "Pune",
        "category": "website-development",
        "role_id": "WEB-03",
        "kind": "role",
        "experience": 0,
        "portfolio": "https://example.com/work",
        "availability": "To discuss",
        "introduction": "Test application",
        "office_acknowledged": True,
        "consent": True,
        "privacy_version": "careers-v1",
        **overrides,
    }


def apply(client, token=None, payload=None, content=None, filename="resume.pdf", route="whatsapp"):
    return client.post(
        "/api/v1/careers/applications",
        data={
            "candidate": json.dumps(payload or person()),
            "submission_token": token or str(uuid.uuid4()),
            "route": route,
            "started_at": str(time.time() * 1000 - 5000),
            "website": "",
        },
        files={"resume": (filename, pdf() if content is None else content, "application/octet-stream")},
    )


def test_seed_is_draft_ordered_and_private(careers, engine):
    result = careers.get("/api/v1/admin/careers").json()
    assert len(result["roles"]) == 13
    assert [r["id"] for r in result["roles"]] == [
        "WEB-01",
        "WEB-02",
        "WEB-03",
        "SW-01",
        "SW-02",
        "SW-03",
        "AI-01",
        "AI-02",
        "AI-03",
        "SM-01",
        "SM-02",
        "SM-03",
        "SM-04",
    ]
    assert all(r["status"] == "Draft" for r in result["roles"])
    assert careers.get("/api/v1/careers").json()["roles"] == []
    assert apply(careers).status_code == 409
    open_role(engine)
    published = careers.get("/api/v1/careers").json()["roles"]
    assert len(published) == 1 and published[0]["title"] == "Website Developer"
    assert "visual_note" not in published[0]
    assert (
        published[0]["work_mode"] == "Work from Office"
        and published[0]["location"] == "Nagpur, Maharashtra, India"
    )


def test_saved_resume_private_and_duplicate_retry(careers, engine):
    open_role(engine)
    token = str(uuid.uuid4())
    result = apply(careers, token=token)
    assert result.status_code == 200, result.text
    data = result.json()
    assert data["saved"] and data["whatsapp_handoff"]
    assert data["id"] in data["message"] and "Website Developer" in data["message"]
    repeated = apply(careers, token=token)
    assert repeated.json()["id"] == data["id"]
    switch = apply(careers, token=token, route="email")
    assert switch.json()["id"] == data["id"] and switch.json()["email_status"] == "not_configured"
    assert apply(careers, token=token, payload=person(name="Changed Name")).status_code == 409
    inbox = careers.get("/api/v1/admin/careers/applications").json()
    assert inbox["total"] == 1
    record = inbox["items"][0]
    assert record["candidate"]["phone"] == "+91 98765 43210" and record["candidate"]["experience"] == 0
    assert "cv_key" not in record and record["has_resume"]
    base = "/api/v1/admin/careers/applications/" + data["id"]
    ticket = careers.post(base + "/download-ticket").json()["ticket"]
    assert careers.get(base + "/resume", params={"ticket": ticket}).content == pdf()
    assert careers.get(base + "/resume", params={"ticket": "0.bad"}).status_code == 403
    saved_headers = dict(careers.headers)
    careers.headers.pop("Authorization")
    assert careers.get(base).status_code == 401
    assert careers.get(base + "/resume", params={"ticket": ticket}).status_code == 401
    careers.headers.update(saved_headers)
    assert careers.post(base, json={"status": "Reviewing", "notes": "Interview review"}).status_code == 200
    assert (
        careers.get(
            "/api/v1/admin/careers/applications?status=Reviewing&category=website-development&role=WEB-03"
        ).json()["total"]
        == 1
    )
    assert careers.post(base + "/delete").status_code == 200
    assert careers.get(base).status_code == 404
    assert list(__import__("pathlib").Path(settings.careers_storage_dir).iterdir()) == []


@pytest.mark.parametrize(
    "changes",
    [
        {"consent": False},
        {"office_acknowledged": False},
        {"experience": -1},
        {"email": "bad"},
        {"phone": "9876543210"},
        {"category": "other"},
        {"portfolio": "javascript:alert(1)"},
        {"salary": "example"},
    ],
)
def test_validation_rejects_invalid_fields(careers, engine, changes):
    open_role(engine)
    assert apply(careers, payload=person(**changes)).status_code == 422


@pytest.mark.parametrize(
    "content,filename",
    [
        (b"fake", "resume.pdf"),
        (b"<script>bad</script>", "resume.docx"),
        (b"%PDF-1.0 invalid", "resume.pdf"),
        (b"a" * (5 * 1024 * 1024 + 1), "resume.pdf"),
    ],
)
def test_actual_document_validation(careers, engine, content, filename):
    open_role(engine)
    assert apply(careers, content=content, filename=filename).status_code == 422


def test_valid_docx_and_closed_role(careers, engine):
    open_role(engine)
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "[Content_Types].xml",
            '<Types><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
        )
        archive.writestr("word/document.xml", "<document><body/></document>")
    assert apply(careers, content=output.getvalue(), filename="resume.docx").status_code == 200
    with sessionmaker(bind=engine)() as db:
        role = db.get(CareerRole, "WEB-03")
        role.status = "Closed"
        db.commit()
    assert apply(careers).status_code == 409


def test_missing_configuration_blocks_collection(careers, engine, monkeypatch):
    open_role(engine)
    monkeypatch.setattr(settings, "careers_privacy_approved", False)
    assert not careers.get("/api/v1/careers").json()["applications_enabled"]
    assert apply(careers).status_code == 503
    assert careers.get("/api/v1/admin/careers/applications").json()["total"] == 0


def test_general_interest_optional_cv_and_expiry(careers, engine):
    data = {
        "candidate": json.dumps(person(kind="general", role_id=None)),
        "submission_token": str(uuid.uuid4()),
        "route": "whatsapp",
        "started_at": str(time.time() * 1000 - 5000),
    }
    result = careers.post("/api/v1/careers/applications", data=data)
    assert result.status_code == 200, result.text
    assert careers.get("/api/v1/admin/careers/applications?kind=general").json()["total"] == 1
    with sessionmaker(bind=engine)() as db:
        record = db.get(CareerApplication, result.json()["id"])
        record.expires_at = datetime.now(timezone.utc) - timedelta(days=1)
        db.commit()
    assert careers.post("/api/v1/admin/careers/purge").json()["deleted"] == 1


def test_owner_edit_preserves_id_and_fixed_facts(careers):
    role = careers.get("/api/v1/admin/careers").json()["roles"][0]
    payload = {k: v for k, v in role.items() if k not in ["id", "work_mode", "location", "visual_note"]}
    payload["status"] = "Open"
    assert careers.post("/api/v1/admin/careers/roles/WEB-01", json=payload).status_code == 200
    assert careers.get("/api/v1/careers").json()["roles"][0]["id"] == "WEB-01"
    payload["summary"] = "Remote work and salary information."
    assert careers.post("/api/v1/admin/careers/roles/WEB-01", json=payload).status_code == 422


def test_email_acceptance_is_not_delivery_and_is_idempotent(careers, engine, monkeypatch):
    open_role(engine)
    for key, value in {
        "careers_email_enabled": True,
        "careers_templates_approved": True,
        "careers_resend_api_key": "test-only",
        "careers_sender": "careers@sunrisetechorigin.com",
    }.items():
        monkeypatch.setattr(settings, key, value)
    calls = []

    class Response:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

        def read(self):
            return b'{"id":"provider-test-id"}'

    def send(req, timeout):
        calls.append(json.loads(req.data))
        assert req.headers["Idempotency-key"].startswith("career-STO-")
        return Response()

    monkeypatch.setattr(service.request, "urlopen", send)
    token = str(uuid.uuid4())
    result = apply(careers, token=token, route="email")
    assert result.status_code == 200, result.text
    assert result.json()["email_status"] == "submitted"
    assert apply(careers, token=token, route="email").json()["id"] == result.json()["id"]
    assert len(calls) == 1 and calls[0]["reply_to"] == "candidate@example.com"
    assert (
        calls[0]["to"] == ["info@sunrisetechorigin.com"]
        and calls[0]["attachments"][0]["filename"] == "resume.pdf"
    )


def test_email_failure_retains_application_for_retry(careers, engine, monkeypatch):
    open_role(engine)
    for key, value in {
        "careers_email_enabled": True,
        "careers_templates_approved": True,
        "careers_resend_api_key": "test-only",
        "careers_sender": "careers@sunrisetechorigin.com",
    }.items():
        monkeypatch.setattr(settings, key, value)

    def fail(*args, **kwargs):
        raise OSError("provider unavailable")

    monkeypatch.setattr(service.request, "urlopen", fail)
    token = str(uuid.uuid4())
    result = apply(careers, token=token, route="email")
    assert result.json()["email_status"] == "failed"
    retry = apply(careers, token=token, route="whatsapp")
    assert retry.json()["id"] == result.json()["id"]
    assert careers.get("/api/v1/admin/careers/applications").json()["total"] == 1
