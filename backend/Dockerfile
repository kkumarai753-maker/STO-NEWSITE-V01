# syntax=docker/dockerfile:1
# Sunrise Tech Origin — API (FastAPI + PostgreSQL).
# Build:  docker build -t sunrise-backend ./backend
# Run:    see ../docker-compose.yml (needs DATABASE_URL and API_KEY)

ARG PYTHON_VERSION=3.12

# ---- 1. Install dependencies into a virtualenv -------------------------------
FROM python:${PYTHON_VERSION}-slim AS builder
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install -r requirements.txt

# ---- 2. Runtime --------------------------------------------------------------
FROM python:${PYTHON_VERSION}-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    ENVIRONMENT=production

RUN groupadd --system --gid 1001 app && useradd --system --uid 1001 --gid app --no-create-home app
WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY --chown=app:app alembic.ini ./
COPY --chown=app:app alembic ./alembic
COPY --chown=app:app app ./app
COPY --chown=app:app docker-entrypoint.sh ./
# Tolerate a Windows (CRLF) checkout of the entrypoint script.
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

USER app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health', timeout=4).status == 200 else 1)"

# The entrypoint applies database migrations, then runs this command.
# Scale with WEB_CONCURRENCY (uvicorn's default for --workers).
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
