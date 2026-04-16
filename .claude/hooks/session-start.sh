#!/usr/bin/env bash
# SessionStart hook — electrical-website orchestrator
# Injects Docker preflight instructions before Claude's first response.
# Output: hookSpecificOutput.additionalContext (Claude Code format)
#
# Execution context: Git Bash on Windows 11 Pro
# No Python dependency (uses Node.js for Docker health check)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ── Docker health probe (fast, 2s timeout) ──────────────────────────────────
DOCKER_OK=false
if command -v node >/dev/null 2>&1; then
    STATUS=$(node -e "
const http = require('http');
const req = http.get('http://localhost:3100/health', res => {
    process.stdout.write(res.statusCode === 200 ? 'ok' : 'down');
    res.resume();
});
req.on('error', () => process.stdout.write('down'));
req.setTimeout(2000, () => { req.destroy(); process.stdout.write('down'); });
" 2>/dev/null || echo "down")
    [ "$STATUS" = "ok" ] && DOCKER_OK=true
fi

# ── Build the preflight message ─────────────────────────────────────────────
if $DOCKER_OK; then
    PREFLIGHT="<session-preflight-required>
MANDATORY SESSION START — execute all steps before responding to user:

STEP 1 — DOCKER REHYDRATION (~50 tokens, ~5 seconds):
  a. mcp__MCP_DOCKER__search_nodes(\"electrical-website-state\")
  b. mcp__MCP_DOCKER__open_nodes([returned_entity_id])
  c. Read from entity: current_branch, active_phase, next_tasks, blockers

STEP 2 — GIT STATE:
  git status && git log --oneline -5

STEP 3 — CONTEXT CHECK:
  Check .claude/CLAUDE.md ## Session State section for any Docker-down fallback notes.
  If notes exist: incorporate them, then clear them (Docker is now available).

STEP 4 — CONFIRM AND PROCEED:
  Report rehydrated state: \"[Session ready — Branch: X | Phase: Y | Next: Z]\"
  Then immediately address the user's first request.

RULES:
- Docker is the SINGLE SOURCE OF TRUTH. No .md file reads for session context.
- If Docker returns no entities: create electrical-website-state entity NOW via mcp__MCP_DOCKER__create_entities.
- If Docker times out or errors: write one-line fallback to .claude/CLAUDE.md ## Session State, then continue.
- Available MCP tools: mcp__MCP_DOCKER__, sequential-thinking, context7, nextjs-devtools, playwright (x2).
- Do NOT ask the user to provide context that Docker should have.
</session-preflight-required>"
else
    # Docker unavailable — provide minimal fallback instructions
    PREFLIGHT="<session-preflight-required>
MANDATORY SESSION START — Docker memory unavailable (health check failed):

STEP 1 — FALLBACK REHYDRATION:
  a. Read .claude/CLAUDE.md ## Session State for last known state
  b. git status && git log --oneline -10
  c. Report: \"[Docker DOWN — using git+CLAUDE.md fallback]\"

STEP 2 — PROCEED WITH CAUTION:
  - Do not create .md memory files as substitutes for Docker
  - Write ONE fallback note to .claude/CLAUDE.md ## Session State if doing significant work
  - Retry Docker at: mcp__MCP_DOCKER__search_nodes(\"electrical-website-state\") — it may recover

STEP 3 — CONTINUE:
  Address the user's first request using git history as the source of truth for implementation details.
</session-preflight-required>"
fi

# ── JSON escape helper (pure bash, no external deps) ────────────────────────
escape_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

ESCAPED=$(escape_json "$PREFLIGHT")

# ── Output (Claude Code hookSpecificOutput format) ───────────────────────────
printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$ESCAPED"

exit 0
