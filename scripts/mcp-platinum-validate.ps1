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
    3) youtube transcript routed-service availability
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

    Write-Step "Step 3/5 — youtube_transcript routed-service availability check..."
    $youtubeHealth = Invoke-RestMethod -Uri "http://127.0.0.1:3100/youtube/health" -Method Get
    if ($null -eq $youtubeHealth) {
        throw "youtube_transcript health response was empty"
    }
    Write-OK "youtube_transcript routed service available."

    Write-Step "Step 4/5 — TypeScript noEmit gate..."
    pnpm exec tsc --noEmit
    Write-OK "TypeScript gate passed."

    Write-Step "Step 5/5 — Production build gate..."
    pnpm build
    Write-OK "Build gate passed."

    Write-Host ""
    Write-Host "Manual confirmation:" -ForegroundColor Cyan
    Write-Host "  Run one youtube transcript call through the routed service/tooling path." -ForegroundColor White
    Write-Host ""
    Write-Host "MCP platinum validation complete." -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Fail "MCP platinum validation failed: $_"
    exit 1
}
