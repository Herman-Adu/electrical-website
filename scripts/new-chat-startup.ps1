#!/usr/bin/env pwsh
<#
.SYNOPSIS
    One-command startup macro for a new chat session on electrical-website.
    Runs MCP readiness, optional active-lane hydration, Playwright bootstrap,
    git status, and opens active memory nodes in a single pass.

.USAGE
    From repo root:
        pwsh scripts/new-chat-startup.ps1

    To skip Docker preflight (services already up):
        pwsh scripts/new-chat-startup.ps1 -SkipPreflight

#>
param(
    [switch]$SkipPreflight,
    [switch]$HydrateLanes,
    [switch]$SkipPlaywrightBootstrap,
    [string]$MemoryKeysFile = "config/active-memory-lanes.json"
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

function Get-ActiveMemoryKeys {
    param(
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        throw "Active memory keys file not found: $Path"
    }

    try {
        $raw = Get-Content -Path $Path -Raw -Encoding UTF8
        $json = $raw | ConvertFrom-Json
        $configured = @($json.memoryKeys | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
        if ($configured.Count -eq 0) {
            throw "Active memory keys file is empty: $Path"
        }

        return @($configured | Select-Object -Unique)
    } catch {
        throw "Failed parsing active memory keys file: $Path"
    }
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

    $activeLaneEntity = $Entities | Where-Object { $_.entityType -eq "next_task" } | Select-Object -First 1
    $activeLaneName = if ($null -ne $activeLaneEntity) {
        $activeLaneEntity.name
    } else {
        "(no active next_task lane found)"
    }

    $activeLaneObjective = "Restate lane objective from memory and execute the smallest high-impact batch."
    if ($null -ne $activeLaneEntity -and $null -ne $activeLaneEntity.observations -and $activeLaneEntity.observations.Count -gt 0) {
        $activeLaneObjective = $activeLaneEntity.observations[0]
    }

    $laneBacklogLines = @()
    if ($null -ne $activeLaneEntity -and $null -ne $activeLaneEntity.observations -and $activeLaneEntity.observations.Count -gt 0) {
        for ($index = 0; $index -lt $activeLaneEntity.observations.Count; $index++) {
            $item = $activeLaneEntity.observations[$index]
            $laneBacklogLines += "- B$($index + 1): $item"
        }
    } else {
        $laneBacklogLines += "- B1: Define lane objective and acceptance criteria."
        $laneBacklogLines += "- B2: Pick smallest high-impact implementation batch."
        $laneBacklogLines += "- B3: Run gates and record checkpoint evidence."
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
        "This performs MCP readiness checks, Playwright runtime bootstrap, git baseline capture, and active memory-node open.",
        "Lane hydration is opt-in only (use full startup when lane sync is needed).",
        "",
        "No-forget task execution wrapper:",
        'Command: pnpm orchestrator:task -Task "<your-task-command>"',
        "(Runs startup lifecycle first, your task second, and sync:task-close in finally.)",
        "",
        "## First Bounded Batch (Default Intake)",
        "",
        "When a fresh chat does not know where to start, execute this exact sequence before coding:",
        "1. Run strict preflight: clean git status, active lane hydration, MCP smoke health.",
        "2. Open active memory nodes and restate the current lane objective.",
        "3. Produce a concise remaining-work list grouped by impact and dependency.",
        "4. Implement only the smallest high-impact batch, then run required gates.",
        "",
        "Deterministic starter command:",
        'Command: pnpm orchestrator:task -Task "pnpm startup:new-chat:full"',
        "",
        "## Active Lane Next Action Card",
        "",
        "- Active lane: $activeLaneName",
        "- Immediate objective: $activeLaneObjective",
        "- Execution rule: choose one bounded batch only; no side-lane drift.",
        "- Validation rule: run tsc + pnpm test + build + MCP smoke before PR merge.",
        "",
        "### Lane Backlog Seed (From Memory)",
        ""
    )

    $markdown += $laneBacklogLines

    $markdown += @(
        "",
        "## Lane Closure Readiness",
        "",
        "Use this map to decide whether the current lane can be closed:",
        "- COMPLETED: merged bounded batches with validation evidence and memory checkpoints.",
        "- DEFERRED: items intentionally postponed with explicit rationale.",
        "- OPEN: remaining in-scope items for this lane.",
        "",
        "Closure gate (all required):",
        "1. Every in-scope backlog item is either COMPLETED or DEFERRED.",
        "2. Final PR for this lane is merged and local main is clean.",
        "3. Post-merge and closure checkpoints are written to memory.",
        "",
        "Next recommended lane stub:",
        "agent:v1:next-task:YYYY-MM-DD-<short-workstream-id>",
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
        "- youtube transcript: use the routed youtube service in the local Docker MCP stack (/youtube).",
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
        "1. Append/update observations in the active timeline lane memory keys.",
        "2. Refresh startup context and master prompt without rehydrating completed lanes:",
        "",
        "Command: pnpm startup:new-chat:refresh",
        "",
        "3. Run full lane hydration only when lane content changed and needs canonical resync:",
        "",
        "Command: pnpm startup:new-chat:full",
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

# Step 1: MCP readiness + optional lane hydration
# ────────────────────────────────────────────────────────────────────────────
Write-Step "Step 1/4 — Verifying MCP readiness and optional lane hydration..."
if ($SkipPreflight) {
    Write-Host "[SKIP] MCP readiness skipped (-SkipPreflight)." -ForegroundColor DarkYellow
} else {
    try {
        pnpm docker:mcp:ready
        Write-OK "MCP readiness complete."
    } catch {
        Write-Fail "MCP readiness failed: $_"
        exit 1
    }
}

if ($HydrateLanes) {
    try {
        node scripts/migration-active-lanes-hydrate.mjs $MemoryKeysFile
        Write-OK "Active-lane hydration complete."
    } catch {
        Write-Fail "Active-lane hydration failed: $_"
        exit 1
    }
} else {
    Write-Host "[SKIP] Lane hydration skipped by default (use -HydrateLanes when needed)." -ForegroundColor DarkYellow
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

$memoryKeys = @(Get-ActiveMemoryKeys -Path $MemoryKeysFile)

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
if ($HydrateLanes) {
    Write-Host "  Hydration: lane hydration executed" -ForegroundColor White
} else {
    Write-Host "  Hydration: skipped (default lean mode)" -ForegroundColor White
}
Write-Host "  MCP     : readiness verified"                                  -ForegroundColor White
Write-Host "  Memory  : $($memoryKeys.Count) active nodes loaded"            -ForegroundColor White
Write-Host ""
Write-Host "  Paste summary into new chat, then describe your next task." -ForegroundColor Cyan
Write-Host ""
