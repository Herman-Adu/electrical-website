@echo off
REM Orchestrator Bootstrap — Initialize Docker MCP + Memory for session consistency (Windows)
REM
REM Usage:
REM   scripts\orchestrator-bootstrap.bat [--skip-memory]

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo Orchestrator Bootstrap - Initialize Docker MCP + Memory
echo ============================================================
echo.

REM Step 1: Start Docker Compose
echo [1/4] Starting Docker Compose stack...
docker compose up -d > nul 2>&1
if errorlevel 1 (
    echo X Docker Compose failed. Is Docker running?
    exit /b 1
)
echo OK Docker Compose stack started

REM Step 2: Verify services health
echo [2/4] Verifying service health...
timeout /t 5 /nobreak > nul

for /f %%A in ('docker compose ps --format "table {{.Service}}\t{{.Status}}" ^| find /c "healthy"') do (
    echo OK All services healthy (%%A services)
)

REM Step 3: Verify Caddy gateway
echo [3/4] Verifying Caddy gateway...
for /f %%A in ('powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3100/health' -ErrorAction SilentlyContinue; $r.StatusCode } catch { 'error' }"') do (
    if "%%A"=="200" (
        echo OK Caddy gateway responsive at http://localhost:3100
    ) else (
        echo X Caddy gateway not responding
        exit /b 1
    )
)

REM Step 4: Bootstrap memory (optional)
if "%1"=="--skip-memory" (
    echo [4/4] Skipping memory bootstrap ^(--skip-memory flag^)
) else (
    echo [4/4] Bootstrapping animation memory lanes...
    node scripts\bootstrap-memory-animation.mjs > nul 2>&1
    if errorlevel 1 (
        echo X Memory bootstrap failed
        exit /b 1
    )
    echo OK Memory bootstrap complete
)

echo.
echo ============================================================
echo OK Orchestrator Bootstrap Complete
echo ============================================================
echo.
echo Docker Services:
echo   * Web app: http://localhost:3000
echo   * MCP gateway: http://localhost:3100
echo   * Memory API: http://localhost:3100/memory
echo.
echo Next Steps:
echo   1. Use NEXT_SESSION_PROMPT.md for Phase 3 continuation
echo   2. Stop stack: docker compose down
echo.
