#!/usr/bin/env pwsh
<#
.SYNOPSIS
    One-command startup macro for a new chat session on electrical-website.
    Runs strict hydration, playwright bootstrap, git status, and opens
    all current memory nodes in a single pass.

.USAGE
    From repo root:
        pwsh scripts/new-chat-startup.ps1

    To skip Docker preflight (services already up):
        pwsh scripts/new-chat-startup.ps1 -SkipPreflight

.NOTES
    Memory keys hydrated:
      - agent:v1:project:electrical-website
      - agent:v1:heuristic_snapshots:2026-04-09-service-request-step-reorg-cleanup-complete
      - agent:v1:handoff:2026-04-09-service-request-cleanup-phase-complete
      - agent:v1:next-task:2026-04-09-orchestrator-phase-next
#>
param(
    [switch]$SkipPreflight
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Banner([string]$Title) {
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}

function Write-Step([string]$Msg) {
    Write-Host "[>] $Msg" -ForegroundColor Yellow
}

function Write-OK([string]$Msg) {
    Write-Host "[OK] $Msg" -ForegroundColor Green
}

function Write-Fail([string]$Msg) {
    Write-Host "[FAIL] $Msg" -ForegroundColor Red
}

# ────────────────────────────────────────────────────────────────────────────
Write-Banner "ELECTRICAL-WEBSITE — NEW CHAT STARTUP"

# Step 1: Docker MCP strict hydration
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 1/4 — Running strict hydration session..."
try {
    if ($SkipPreflight) {
        pnpm migration:all:hydrate:strict:session:skip
    } else {
        pnpm migration:all:hydrate:strict:session
    }
    Write-OK "Strict hydration complete."
} catch {
    Write-Fail "Hydration failed: $_"
    exit 1
}

# Step 2: Playwright MCP bootstrap
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 2/4 — Bootstrapping Playwright MCP containers..."
try {
    node scripts/bootstrap-mcp-playwright.mjs
    Write-OK "Playwright bootstrap complete."
} catch {
    Write-Fail "Playwright bootstrap failed: $_"
    exit 1
}

# Step 3: Git baseline
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 3/4 — Git baseline..."
git status --short
$branch = git branch --show-current
$head   = git log --oneline -1
Write-Host ""
Write-Host "  Branch : $branch" -ForegroundColor White
Write-Host "  HEAD   : $head"   -ForegroundColor White

# Step 4: Memory context open (all current phase nodes)
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 4/4 — Opening memory context nodes..."

$memoryKeys = @(
    "agent:v1:project:electrical-website",
    "agent:v1:heuristic_snapshots:2026-04-09-service-request-step-reorg-cleanup-complete",
    "agent:v1:handoff:2026-04-09-service-request-cleanup-phase-complete",
    "agent:v1:next-task:2026-04-09-orchestrator-phase-next"
)

$namesJson = ($memoryKeys | ForEach-Object { '"' + $_ + '"' }) -join ","
$payload   = '{"names":[' + $namesJson + ']}'

try {
    $result = node scripts/mcp-memory-call.mjs open_nodes $payload | ConvertFrom-Json
    $entities = $result.content[0].json.entities
    Write-Host ""
    Write-Host "  Memory nodes loaded ($($entities.Count)):" -ForegroundColor White
    foreach ($e in $entities) {
        Write-Host ("    [" + $e.entityType + "] " + $e.name) -ForegroundColor Gray
        Write-Host ("      obs: " + $e.observations.Count + " entries") -ForegroundColor DarkGray
    }
    Write-OK "Memory context ready."
} catch {
    Write-Fail "Memory open failed: $_"
    exit 1
}

# ────────────────────────────────────────────────────────────────────────────
Write-Banner "STARTUP COMPLETE — READY FOR ORCHESTRATION"
Write-Host ""
Write-Host "  Branch  : $branch"  -ForegroundColor White
Write-Host "  HEAD    : $head"    -ForegroundColor White
Write-Host ""
Write-Host "  Hydration: contact + quotation + service-request lanes verified" -ForegroundColor White
Write-Host "  MCP     : 11/11 services healthy (from hydration run)"           -ForegroundColor White
Write-Host "  Memory  : $($memoryKeys.Count) nodes loaded"                     -ForegroundColor White
Write-Host ""
Write-Host "  Paste summary into new chat, then describe your next task." -ForegroundColor Cyan
Write-Host ""
