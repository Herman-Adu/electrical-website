#!/usr/bin/env pwsh
<#!
.SYNOPSIS
    MCP platinum validation gate for orchestrator lane operations.

.USAGE
    pwsh scripts/mcp-platinum-validate.ps1

.NOTES
    Validates:
      1) docker MCP readiness
      2) active-lane memory hydration parity
      3) youtube transcript image availability (external MCP client prerequisite)
      4) TypeScript and production build gates
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step([string]$Msg) {
    Write-Host "[>] $Msg" -ForegroundColor Yellow
}

function Write-OK([string]$Msg) {
    Write-Host "[OK] $Msg" -ForegroundColor Green
}

function Write-Fail([string]$Msg) {
    Write-Host "[FAIL] $Msg" -ForegroundColor Red
}

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "  ELECTRICAL-WEBSITE — MCP PLATINUM VALIDATION" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan

try {
    Write-Step "Step 1/5 — Docker MCP readiness (gateway + routed services)..."
    pnpm docker:mcp:ready
    Write-OK "Docker MCP readiness passed."

    Write-Step "Step 2/5 — Active-lane hydration parity check..."
    pnpm migration:active:hydrate
    Write-OK "Active-lane hydration parity passed."

    Write-Step "Step 3/5 — External youtube_transcript image availability check..."
    docker image inspect mcp/youtube-transcript:latest *> $null
    if ($LASTEXITCODE -ne 0) {
        docker pull mcp/youtube-transcript:latest
    }
    Write-OK "youtube_transcript external image available."

    Write-Step "Step 4/5 — TypeScript noEmit gate..."
    pnpm exec tsc --noEmit
    Write-OK "TypeScript gate passed."

    Write-Step "Step 5/5 — Production build gate..."
    pnpm build
    Write-OK "Build gate passed."

    Write-Host ""
    Write-Host "Manual external-toolkit confirmation:" -ForegroundColor Cyan
    Write-Host "  Run one youtube transcript call via Docker MCP Toolkit client (get_video_info/get_transcript)." -ForegroundColor White
    Write-Host ""
    Write-Host "MCP platinum validation complete." -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Fail "MCP platinum validation failed: $_"
    exit 1
}
