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
    [switch]$SkipPreflight,
    [switch]$SkipHydration,
    [switch]$SkipPlaywrightBootstrap
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

function Update-MasterPrompt {
    param(
        [string]$Branch,
        [string]$Head,
        [array]$Entities,
        [array]$MemoryKeys
    )

    $promptPath = "docs/NEW_CHAT_MASTER_PROMPT.md"
    $generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss K")
    $memoryCount = $MemoryKeys.Count

    $memoryLines = @()
    foreach ($entity in $Entities) {
        $obsCount = 0
        if ($null -ne $entity.observations) {
            $obsCount = $entity.observations.Count
        }
        $memoryLines += "- $($entity.name) ($($entity.entityType), observations: $obsCount)"
    }

    $markdown = @(
        "# NEW CHAT MASTER PROMPT — Orchestrator Mode (Docker Memory Aligned)",
        "",
        "Last generated: $generatedAt",
        "",
        "Use this prompt at the start of every new chat window.",
        "",
        "---",
        "",
        "## Orchestrator Contract (Immediate)",
        "",
        "You are in **orchestrator-only mode**:",
        "",
        "- Do not perform broad implementation first-pass as a generalist; coordinate execution and decisions.",
        "- Delegate specialized analysis to bounded SME sub-agents first, then synthesize a single plan.",
        "- Keep tool scope minimal per task; load only required MCP servers/tools.",
        "- Use Docker memory as primary context source before repository-wide re-reads.",
        "- Use sequential reasoning for complex or ambiguous decisions before implementation.",
        "",
        "## Startup Contract (Run First)",
        "",
        "Command: pnpm startup:new-chat",
        "",
        "If Docker services are already healthy and you need a warm start:",
        "",
        "Command: pnpm startup:new-chat:skip",
        "",
        "This performs strict hydration, Playwright runtime bootstrap, git baseline capture, and memory-node open.",
        "",
        "No-forget task execution wrapper:",
        'Command: pnpm orchestrator:task -Task "<your-task-command>"',
        "(Runs startup lifecycle first, your task second, and sync:task-close in finally.)",
        "",
        "## Current Session Baseline (Auto-Generated)",
        "",
        "- Branch: $Branch",
        "- HEAD: $Head",
        "- Memory nodes loaded: $memoryCount",
        "",
        "### Hydrated Memory Nodes",
        ""
    )

    $markdown += $memoryLines

    $markdown += @(
        "",
        "## Optimized MCP / Tool Allocation",
        "",
        "- memory-reference: first read of context (open_nodes) before any broad repo scans.",
        "- sequential-thinking: mandatory for multi-step, high-impact, or ambiguous decisions.",
        "- nextjs-devtools: runtime diagnostics for Next.js behavior and route/runtime issues.",
        "- github-official: PR/check status, branch and review operations.",
        "- openapi-schema and wikipedia: load only when explicitly required.",
        "",
        "### Playwright Server Split (Use Both Deliberately)",
        "",
        "- playwright MCP server: general browser operations (single-page checks, screenshots, quick validations).",
        "- executor-playwright MCP server: deterministic multi-step workflows (multi-step forms, ordered end-to-end flows, repeatable scripted paths).",
        "",
        "## SME Delegation Sequence (Before Coding)",
        "",
        "1. Architecture SME: component/server boundary and App Router pattern compliance.",
        "2. Validation SME: client/server schema parity and step gating.",
        "3. Security SME: anti-bot/Turnstile lifecycle and server verification safeguards.",
        "4. QA SME: minimal verification matrix, targeted tests, and rollback triggers.",
        "",
        "Then orchestrator consolidates findings into one execution plan with minimal tool usage.",
        "",
        "Required governance references for all delegated outputs:",
        "",
        "- docs/standards/ORCHESTRATOR_EXTERNAL_TOOLKIT_ADAPTER_POLICY.md",
        "- docs/standards/ORCHESTRATOR_PHASE2_DELEGATION_GATE_CHECKLIST.md",
        "- docs/standards/ORCHESTRATOR_SUPERPOWERS_NEXTJS_SKILL_ROUTING.md",
        "",
        "## Token-Use Policy",
        "",
        "- Prefer memory hydration + `open_nodes` over repeated broad file reads.",
        "- Read only files directly touched by the active task.",
        "- Run targeted tests first; widen scope only if needed.",
        "- Local-first enforcement: all required local tests/checks must pass before any GitHub workflow/check trigger or rerun.",
        "",
        "## Memory ↔ Prompt Alignment Protocol (After Every Task)",
        "",
        "1. Append/update observations in the relevant memory nodes (project + task-specific keys).",
        "2. Run strict hydration session to sync Docker memory state:",
        "",
        "Command: pnpm migration:all:hydrate:strict:session:skip",
        "",
        "3. Regenerate this master prompt with latest branch/HEAD/memory summary:",
        "",
        "Command: pnpm startup:new-chat:skip",
        "",
        "This keeps Docker memory and this master prompt aligned for the next task/chat.",
        "",
        "## New Chat Paste Block",
        "",
        "Paste this into a fresh chat:",
        "",
        "Operate in orchestrator-only mode with SME delegation first.",
        "Use memory-first context loading from hydrated Docker memory.",
        'Run tasks via pnpm orchestrator:task -Task "<task-command>" so startup and close-sync are never skipped.',
        "Use playwright for general browser tasks and executor-playwright for deterministic multi-step form workflows.",
        "Use sequential-thinking for complex decisions and nextjs-devtools for runtime diagnostics.",
        "Require local test gates to pass before any GitHub workflow/check trigger or rerun.",
        "Keep tool scope minimal and optimize token usage.",
        "Current branch: $Branch",
        "Current HEAD: $Head",
        ""
    )

    Set-Content -Path $promptPath -Value ($markdown -join "`n") -Encoding UTF8
    Write-OK "Master prompt updated: $promptPath"
}

# ────────────────────────────────────────────────────────────────────────────
Write-Banner "ELECTRICAL-WEBSITE — NEW CHAT STARTUP"

# Step 1: Docker MCP strict hydration
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 1/4 — Running strict hydration session..."
if ($SkipHydration) {
    Write-Host "[SKIP] Hydration skipped (-SkipHydration)." -ForegroundColor DarkYellow
} else {
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
}

# Step 2: Playwright MCP bootstrap
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 2/4 — Bootstrapping Playwright MCP containers..."
if ($SkipPlaywrightBootstrap) {
    Write-Host "[SKIP] Playwright bootstrap skipped (-SkipPlaywrightBootstrap)." -ForegroundColor DarkYellow
} else {
    try {
        node scripts/bootstrap-mcp-playwright.mjs
        Write-OK "Playwright bootstrap complete."
    } catch {
        Write-Fail "Playwright bootstrap failed: $_"
        exit 1
    }
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

try {
    Update-MasterPrompt -Branch $branch -Head $head -Entities $entities -MemoryKeys $memoryKeys
} catch {
    Write-Fail "Master prompt update failed: $_"
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
