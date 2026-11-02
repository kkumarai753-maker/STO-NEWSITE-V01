@echo off
rem Start the backend for local development: database, migrations, API server.
cd /d "%~dp0"

rem Docker Desktop must be running for the database container.
docker info >nul 2>&1
if not errorlevel 1 goto docker_ready
echo Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
set tries=0

:wait_docker
timeout /t 3 /nobreak >nul
docker info >nul 2>&1
if not errorlevel 1 goto docker_ready
set /a tries+=1
if %tries% lss 60 goto wait_docker
echo Docker did not start. Open Docker Desktop manually and try again.
exit /b 1

:docker_ready
rem The database is defined in the shared docker-compose.yml at the repo root.
docker compose -f ..\docker-compose.yml up -d --wait db || exit /b 1
.venv\Scripts\alembic upgrade head || exit /b 1
.venv\Scripts\uvicorn app.main:app --reload
