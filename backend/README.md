# Sunrise Tech Origin — Backend API

FastAPI + PostgreSQL service that stores contact-form submissions from the
website (`../frontend`). The Next.js server action calls this API
server-to-server with a shared API key, so nothing secret reaches the browser.

## Folder structure

```
backend/
  app/
    main.py                     FastAPI app factory, CORS, router mount
    core/
      config.py                 settings from env / .env (pydantic-settings)
      security.py               X-API-Key check
      passwords.py              scrypt password hashing, session tokens
    db/
      base.py                   SQLAlchemy declarative Base
      session.py                engine + get_db() session dependency
    models/
      contact.py                contact_submissions table
      admin.py                  admin_users + admin_sessions tables
    schemas/
      contact.py                request/response models (mirror the frontend zod rules)
    services/
      contact_service.py        database operations (incl. dashboard stats)
      admin_service.py          admin sign-in, sessions, password changes
      periods.py                "today" / "this month" boundaries in TIMEZONE
    cli.py                      `python -m app.cli create-admin`
    api/
      deps.py                   shared dependencies (DbSession)
      v1/
        router.py               mounts v1 endpoints under /api/v1
        endpoints/
          contacts.py           /contacts endpoints
          admin.py              /admin endpoints (dashboard)
          health.py             /health
  alembic/                      database migrations
    versions/0001_create_contact_submissions.py
    versions/0002_create_admin_tables.py
  tests/                        pytest suite (runs against PostgreSQL)
  scripts/init-test-db.sql      creates the sunrise_test database in Docker
  Dockerfile                    production image (migrations run on start)
  docker-entrypoint.sh          API_KEY check → alembic upgrade head → uvicorn
  requirements.txt / requirements-dev.txt
  .env.example
```

## Database table: `contact_submissions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | BIGSERIAL | primary key |
| `name` | VARCHAR(100) | required, 2–100 chars |
| `email` | VARCHAR(254) | required, indexed |
| `phone` | VARCHAR(32) | optional (empty → NULL) |
| `message` | TEXT | required, 10–4000 chars |
| `status` | enum `contact_status` | `new` (default) · `contacted` · `closed` · `spam` |
| `source` | VARCHAR(50) | default `website` |
| `ip_address` | VARCHAR(45) | from the visitor's request |
| `user_agent` | VARCHAR(512) | from the visitor's request |
| `created_at`, `updated_at` | TIMESTAMPTZ | set by the database |

## Run locally

The database (and the whole stack) is defined in the shared
`docker-compose.yml` at the repo root.

```bash
docker compose up -d db              # from the repo root: PostgreSQL on localhost:5433

cd backend
cp .env.example .env                 # set API_KEY to a random value
python -m venv .venv
.venv\Scripts\activate               # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt

alembic upgrade head                 # create the tables
uvicorn app.main:app --reload        # http://localhost:8000/docs
```

On Windows, `run.bat` does the database + migrations + server steps for you.

Or run everything (database, API and website) in Docker from the repo root:
`docker compose up --build` — see the root README.

Then connect the website — in `frontend/.env.local`:

```
BACKEND_API_URL=http://localhost:8000
BACKEND_API_KEY=<same value as API_KEY in backend/.env>
```

Submit the contact form and the row appears in `contact_submissions`:

```bash
docker compose exec db psql -U sunrise -c "SELECT id, name, email, status, created_at FROM contact_submissions ORDER BY id DESC;"
```

(Run `docker compose …` commands from the repo root.)

## API (all `/contacts` routes require the `X-API-Key` header)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | API + database check |
| POST | `/api/v1/contacts` | store a submission (used by the website) |
| GET | `/api/v1/contacts?limit=50&offset=0&status=new` | list, newest first |
| GET | `/api/v1/contacts/{id}` | one submission |
| PATCH | `/api/v1/contacts/{id}` | update `status` |

## Admin dashboard

The website has an admin area at `/admin` (sign in, dashboard counts, records,
change password). It talks to the `/api/v1/admin` endpoints below. Create the
first admin after `alembic upgrade head`:

```bash
python -m app.cli create-admin --email you@company.com --name "Your Name"
```

In Docker: `docker compose exec backend python -m app.cli create-admin --email you@company.com --name "Your Name"`.

It prompts for the password (or reads `ADMIN_PASSWORD`). Running it again for an
existing email resets that admin's password and signs out their sessions — use
this if a password is forgotten.

- Passwords are hashed with scrypt; sessions are random tokens stored as SHA-256
  hashes in `admin_sessions`, valid for `ADMIN_SESSION_HOURS` (default 12).
- "Today" / "this month" counts use the `TIMEZONE` setting (IANA name, default `UTC`).
- Changing the password signs out every other session.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/admin/auth/login` | API key | email + password → session token |
| POST | `/api/v1/admin/auth/logout` | API key + Bearer | end this session |
| GET | `/api/v1/admin/auth/me` | API key + Bearer | current admin (+ time zone) |
| POST | `/api/v1/admin/auth/change-password` | API key + Bearer | `current_password`, `new_password` |
| GET | `/api/v1/admin/stats` | API key + Bearer | dashboard counts |
| GET | `/api/v1/admin/contacts?limit=&offset=&status=&q=&period=` | API key + Bearer | search / filter / paginate submissions |

`period` is one of `today`, `yesterday`, `week`, `month`, `last_month`, `7d`, `30d`.

## Tests

```bash
docker compose up -d db              # from the repo root
cd backend && pytest
```

Tests use the `sunrise_test` database (created by `scripts/init-test-db.sql`
on the container's first start), never the main one. Override with
`TEST_DATABASE_URL`.

## Schema changes

Edit the model in `app/models/`, then:

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Production

- Set `ENVIRONMENT=production` (hides `/docs`, requires `API_KEY`).
- Use a managed PostgreSQL and set `DATABASE_URL`.
- Keep the API private to the Next.js server where possible; always use HTTPS.
