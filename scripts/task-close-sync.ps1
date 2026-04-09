#!/usr/bin/env pwsh
<#!
.SYNOPSIS
    End-of-task sync macro: align Docker memory + refresh master prompt.

.USAGE
    pwsh scripts/task-close-sync.ps1
    pwsh scripts/task-close-sync.ps1 -HydrateLanes

.NOTES
    Sequence:
      1) optional strict hydration session (skip preflight)
      2) refresh startup context + regenerate docs/NEW_CHAT_MASTER_PROMPT.md
         without rerunning hydration/bootstrap
#>

param(
    [switch]$HydrateLanes
)

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
Write-Host "  ELECTRICAL-WEBSITE — TASK CLOSE SYNC" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan

if ($HydrateLanes) {
    Write-Step "Step 1/2 — Syncing observations via strict hydration session..."
    try {
        node scripts/migration-active-lanes-hydrate.mjs
        Write-OK "Active-lane memory sync complete."
    } catch {
        Write-Fail "Hydration sync failed: $_"
        exit 1
    }
} else {
    Write-Step "Step 1/2 — Skipping lane hydration (lean close-sync mode)..."
    Write-Host "[SKIP] Lane hydration skipped. Use -HydrateLanes when lane content changes." -ForegroundColor DarkYellow
}

Write-Step "Step 2/2 — Refreshing new-chat master prompt from current state..."
try {
    pwsh scripts/new-chat-startup.ps1 -SkipPreflight -SkipPlaywrightBootstrap
    Write-OK "Master prompt refresh complete."
} catch {
    Write-Fail "Master prompt refresh failed: $_"
    exit 1
}

Write-Host ""
Write-Host "Done. Docker memory and docs/NEW_CHAT_MASTER_PROMPT.md are aligned." -ForegroundColor Cyan
Write-Host ""
