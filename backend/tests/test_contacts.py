VALID = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "phone": "9876543210",
    "message": "We'd like to automate our invoicing process.",
}


def test_create_contact_stores_row(client):
    res = client.post("/api/v1/contacts", json=VALID)
    assert res.status_code == 201
    body = res.json()
    assert body["id"] == 1
    assert body["status"] == "new"
    assert body["email"] == VALID["email"]

    listed = client.get("/api/v1/contacts").json()
    assert listed["total"] == 1
    assert listed["items"][0]["name"] == VALID["name"]


def test_suspected_spam_is_stored_not_dropped(client):
    res = client.post("/api/v1/contacts", json={**VALID, "status": "spam"})
    assert res.status_code == 201
    assert res.json()["status"] == "spam"
    assert client.get("/api/v1/contacts?status=spam").json()["total"] == 1


def test_new_submission_cannot_skip_ahead_in_status(client):
    res = client.post("/api/v1/contacts", json={**VALID, "status": "contacted"})
    assert res.status_code == 422
    assert [err["loc"][-1] for err in res.json()["detail"]] == ["status"]


def test_empty_phone_is_stored_as_null(client):
    res = client.post("/api/v1/contacts", json={**VALID, "phone": ""})
    assert res.status_code == 201
    assert res.json()["phone"] is None


def test_invalid_payload_is_rejected(client):
    res = client.post("/api/v1/contacts", json={**VALID, "email": "nope", "message": "short"})
    assert res.status_code == 422
    fields = {err["loc"][-1] for err in res.json()["detail"]}
    assert fields == {"email", "message"}


def test_missing_api_key_is_rejected(client):
    res = client.post("/api/v1/contacts", json=VALID, headers={"X-API-Key": "wrong"})
    assert res.status_code == 401


def test_update_status(client):
    contact_id = client.post("/api/v1/contacts", json=VALID).json()["id"]
    res = client.patch(f"/api/v1/contacts/{contact_id}", json={"status": "contacted"})
    assert res.status_code == 200
    assert res.json()["status"] == "contacted"
    assert client.get("/api/v1/contacts?status=contacted").json()["total"] == 1
    assert client.get("/api/v1/contacts/999").status_code == 404


def test_phone_must_be_ten_digits_only(client):
    for bad in ["98765", "98765432101", "+919876543210", "98765.43210", "98765 43210", "987654321a"]:
        res = client.post("/api/v1/contacts", json={**VALID, "phone": bad})
        assert res.status_code == 422, bad
        assert [err["loc"][-1] for err in res.json()["detail"]] == ["phone"], bad
