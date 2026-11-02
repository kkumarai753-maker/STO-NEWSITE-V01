> Updated website: see [WEBSITE-UPDATES.md](WEBSITE-UPDATES.md) for the design, contact flow, validation and launch instructions.

# Sunrise Tech Origin

Website and API for Sunrise Tech Origin, an AI automation and custom software
company.

```
.
├── frontend/            Website — Next.js 16, TypeScript, Tailwind CSS v4
│   ├── Dockerfile       production image (standalone output, non-root)
│   └── README.md        pages, content, design system, env variables
├── backend/             API — FastAPI, SQLAlchemy, Alembic, PostgreSQL
│   ├── Dockerfile       production image (migrations run on start, non-root)
│   └── README.md        endpoints, database, admin accounts, tests
├── docker-compose.yml   runs everything: db + backend + frontend
└── .env.example         settings for docker compose
```

How the pieces connect: the browser only talks to the website. The website's
server calls the API over a private network with a shared `API_KEY`, and the API
stores contact-form submissions and admin accounts in PostgreSQL.

## Run everything with Docker

Needs Docker Desktop (or Docker Engine with the Compose plugin).

```bash
docker compose up --build     # first build takes a few minutes
```

No setup is needed: the website and API share a random key that is generated
on the first run. To change ports, add an AI key, set your own `API_KEY` or
anything else, copy `.env.example` to `.env` and edit it, then run the command
again.

| Service | URL | Notes |
| --- | --- | --- |
| Website | http://localhost:3000 | admin area at `/admin` |
| API | http://localhost:8000 | bound to 127.0.0.1; `/docs` only when `BACKEND_ENVIRONMENT=development` |
| PostgreSQL | localhost:5433 | bound to 127.0.0.1; data kept in the `pgdata` volume |

Create the first admin account (prompts for a password):

```bash
docker compose exec backend python -m app.cli create-admin --email you@company.com --name "Your Name"
```

Useful commands:

```bash
docker compose up -d --build          # run in the background
docker compose logs -f backend        # follow one service's logs
docker compose ps                     # status + health of each service
docker compose down                   # stop (keeps the database volume)
docker compose down -v                # stop and DELETE the database
```

- `NEXT_PUBLIC_*` values are baked into the website when it is built: after
  changing them, run `docker compose up -d --build frontend`.
- Database migrations run automatically every time the backend container starts.
- Port already in use? Set `FRONTEND_HOST_PORT`, `BACKEND_HOST_PORT` or
  `DB_HOST_PORT` in `.env` (e.g. 3300 / 8300 / 5533).
- Need the generated key (e.g. to point `npm run dev` at the Docker API)?
  `docker compose exec backend cat /run/sunrise/api_key`

## Develop without Docker (faster on Windows/macOS)

```bash
docker compose up -d db                  # just the database

cd backend                               # API — see backend/README.md
cp .env.example .env
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements-dev.txt
alembic upgrade head
uvicorn app.main:app --reload            # http://localhost:8000/docs

cd ../frontend                           # website — see frontend/README.md
npm install
cp .env.example .env.local               # BACKEND_API_KEY = API_KEY in backend/.env
npm run dev                              # http://localhost:3000
```

## Deploying

- **Website on Vercel:** set the project's **Root Directory** to `frontend`.
- **Anywhere Docker runs:** use `docker-compose.yml`, or deploy the two images
  separately with a managed PostgreSQL. Put the website behind HTTPS in
  production (the security headers expect it), set strong values for
  `API_KEY` and `POSTGRES_PASSWORD`, and keep the API private to the website.
