#!/usr/bin/env pwsh
<#!
.SYNOPSIS
    Orchestrator task wrapper to enforce startup and close-sync lifecycle.

.USAGE
    pnpm orchestrator:task -Task "pnpm build"

    Optional:
      -SkipStartup    (skip pnpm startup:new-chat)
      -SkipCloseSync  (skip pnpm sync:task-close)
            -HydrateLanes   (run full lane hydration during startup)
#>

param(
    [switch]$SkipStartup,
    [switch]$SkipCloseSync,
        [switch]$HydrateLanes,
    [string]$Task,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$TaskCommand
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

if (-not $Task) {
    $remaining = @($TaskCommand | Where-Object { $_ -ne "--" })
    if ($remaining.Count -gt 0) {
        $Task = ($remaining -join " ").Trim()
    }
}

if (-not $Task) {
    Write-Fail "No task command provided. Example: pnpm orchestrator:task -Task \"pnpm build\""
    exit 1
}

$task = $Task.Trim()

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "  ELECTRICAL-WEBSITE — ORCHESTRATOR TASK WRAPPER" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan

$taskExitCode = 0

try {
    if ($SkipStartup) {
        Write-Host "[SKIP] Startup skipped (-SkipStartup)." -ForegroundColor DarkYellow
    } else {
        if ($HydrateLanes) {
            Write-Step "Startup lifecycle — lean startup with explicit lane hydration..."
            pwsh scripts/new-chat-startup.ps1 -HydrateLanes
        } else {
            Write-Step "Startup lifecycle — lean startup (active lanes only)..."
            pnpm startup:new-chat
        }
        Write-OK "Startup lifecycle complete."
    }

    Write-Step "Running task command: $task"
    Invoke-Expression $task
    $taskExitCode = $LASTEXITCODE
    if ($taskExitCode -ne 0) {
        throw "Task command failed with exit code $taskExitCode"
    }
    Write-OK "Task command complete."
}
catch {
    if ($taskExitCode -eq 0) {
        $taskExitCode = 1
    }
    Write-Fail "Task execution failed: $_"
}
finally {
    if ($SkipCloseSync) {
        Write-Host "[SKIP] Close sync skipped (-SkipCloseSync)." -ForegroundColor DarkYellow
    } else {
        try {
            Write-Step "Close lifecycle — syncing Docker memory + prompt..."
            pnpm sync:task-close
            Write-OK "Close lifecycle complete."
        } catch {
            Write-Fail "Close lifecycle failed: $_"
            if ($taskExitCode -eq 0) {
                $taskExitCode = 1
            }
        }
    }
}

if ($taskExitCode -ne 0) {
    exit $taskExitCode
}

Write-Host ""
Write-Host "Done. Lifecycle enforced (startup + task + close-sync)." -ForegroundColor Cyan
Write-Host ""
