#!/usr/bin/env bash
# SessionStart hook — electrical-website orchestrator
# Injects Docker preflight instructions before Claude's first response.
# Output: hookSpecificOutput.additionalContext (Claude Code format)
#
# Execution context: Git Bash on Windows 11 Pro
# No Python dependency (uses Node.js for Docker health check)
#
# Refinements (2026-04-17):
# - Complete JSON escaping (control chars: \b, \f, \0, etc.)
# - Path validation (directory traversal prevention)
# - Secrets redaction in git output (branch, commit messages)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
HOOKS_DIR="${SCRIPT_DIR}"

# ── Helper: Complete JSON escape ────────────────────────────────────────────
# Must escape backslash FIRST to avoid double-escaping
escape_json() {
    local s="$1"
    # Escape backslash first
    s="${s//\\/\\\\}"
    # Then escape remaining special chars
    s="${s//\"/\\\"}"
    s="${s//$'\b'/\\b}"      # Backspace
    s="${s//$'\f'/\\f}"      # Form feed
    s="${s//$'\n'/\\n}"      # Newline
    s="${s//$'\r'/\\r}"      # Carriage return
    s="${s//$'\t'/\\t}"      # Tab
    # NULL character handling (only if present)
    if [[ "$s" == *$'\0'* ]]; then
        s="${s//$'\0'/\\u0000}"
    fi
    printf '%s' "$s"
}

# ── Helper: Sanitize branch name ────────────────────────────────────────────
# Returns original branch if safe; "[branch-name-redacted]" if secrets detected
sanitizeBranchName() {
    local branch="$1"
    
    # Check for API keys, tokens, passwords, AWS keys, GitHub tokens, NPM tokens
    if echo "$branch" | grep -qiE '(api[_-]?key|password|token|secret|aws|github|npm|stripe)'; then
        printf '[branch-name-redacted]'
    else
        printf '%s' "$branch"
    fi
}

# ── Helper: Sanitize commit message ─────────────────────────────────────────
# Applies 8 redaction patterns to remove secrets
sanitizeCommitMessage() {
    local msg="$1"
    
    # Pattern 1: API Keys (api_key=ABC123...)
    msg=$(echo "$msg" | sed -E 's/([a-zA-Z_]*api[_-]?key\s*=\s*)[a-zA-Z0-9._\-]{20,}/\1[REDACTED]/gi')
    
    # Pattern 2: Database URLs (postgres://, mysql://, etc.)
    msg=$(echo "$msg" | sed -E 's/(mongodb|mysql|postgres|postgresql|redis):\/\/[^\s]+/[REDACTED]/gi')
    
    # Pattern 3: OAuth/Bearer tokens (bearer ABC...)
    msg=$(echo "$msg" | sed -E 's/(oauth|bearer|token)\s+[a-zA-Z0-9._\-]{30,}/\1 [REDACTED]/gi')
    
    # Pattern 4: AWS Access Keys (AKIA...)
    msg=$(echo "$msg" | sed -E 's/AKIA[0-9A-Z]{16}/[REDACTED]/g')
    
    # Pattern 5: Passwords (password=ABC...)
    msg=$(echo "$msg" | sed -E 's/(password|passwd|pwd)\s*[:=]\s*[^\s]+/\1 [REDACTED]/gi')
    
    # Pattern 6: GitHub tokens (ghp_, gho_, ghu_)
    msg=$(echo "$msg" | sed -E 's/(gh[pou]_[a-zA-Z0-9_]{36,255})/[REDACTED]/g')
    
    # Pattern 7: NPM tokens (npm_)
    msg=$(echo "$msg" | sed -E 's/(npm_[a-zA-Z0-9]{36,})/[REDACTED]/g')
    
    # Pattern 8: Generic secrets (secret=ABC..., private_key=..., etc.)
    msg=$(echo "$msg" | sed -E 's/(secret|app[_-]?secret|private[_-]?key)\s*[:=]\s*[a-zA-Z0-9!@#$%^&*._\-]{16,}/\1 [REDACTED]/gi')
    
    printf '%s' "$msg"
}

# ── Helper: Validate project directory ──────────────────────────────────────
# Prevents directory traversal attacks; checks against whitelist
validateProjectDir() {
    local input="${1:-.}"
    local resolved
    
    # Resolve relative paths to absolute
    resolved=$(cd "$input" 2>/dev/null && pwd || echo "")
    
    if [ -z "$resolved" ] || [ ! -d "$resolved" ]; then
        echo "" >&2  # Silent failure; caller will use default
        return 1
    fi
    
    # Check whitelist: home dir, /tmp, /var/tmp, current dir
    local homedir
    local is_safe=false
    
    homedir=$(eval echo ~)
    
    if [[ "$resolved" == "$homedir"* ]] || \
       [[ "$resolved" == "/tmp"* ]] || \
       [[ "$resolved" == "/var/tmp"* ]] || \
       [[ "$resolved" == "$PROJECT_ROOT"* ]]; then
        is_safe=true
    fi
    
    # Check custom whitelist (if it exists)
    if [ -f "$HOOKS_DIR/../security/CLAUDE_PROJECT_DIR_WHITELIST.txt" ]; then
        while IFS= read -r line; do
            # Skip comments and empty lines
            [[ "$line" =~ ^# ]] && continue
            [ -z "$line" ] && continue
            
            if [[ "$resolved" == "$line"* ]]; then
                is_safe=true
                break
            fi
        done < "$HOOKS_DIR/../security/CLAUDE_PROJECT_DIR_WHITELIST.txt"
    fi
    
    if [ "$is_safe" = true ]; then
        printf '%s' "$resolved"
        return 0
    else
        echo "" >&2  # Silent failure
        return 1
    fi
}

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

# ── Get git state (with sanitization) ───────────────────────────────────────
BRANCH=""
COMMIT=""
if [ -d "$PROJECT_ROOT/.git" ]; then
    BRANCH=$(cd "$PROJECT_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    BRANCH=$(sanitizeBranchName "$BRANCH")
    
    COMMIT=$(cd "$PROJECT_ROOT" && git log --oneline -1 2>/dev/null || echo "unknown")
    COMMIT=$(sanitizeCommitMessage "$COMMIT")
fi

# ── Load selective rehydration (memory-lane aware) ─────────────────────────────
SELECTIVE_LOAD=""
if command -v node >/dev/null 2>&1; then
    SELECTIVE_LOAD=$(node "${PROJECT_ROOT}/scripts/load-active-memory-lane.mjs" 2>/dev/null | tail -1)
fi

# Fallback to default if selective load fails
if [ -z "$SELECTIVE_LOAD" ]; then
    SELECTIVE_LOAD='mcp__MCP_DOCKER__search_nodes("electrical-website-state")'
fi

# ── Build the preflight message ─────────────────────────────────────────────
if $DOCKER_OK; then
    PREFLIGHT="<session-preflight-required>
MANDATORY SESSION START — execute all steps before responding to user:

STEP 1 — DOCKER REHYDRATION (~30-50 tokens, ~5 seconds):
  a. $SELECTIVE_LOAD
  b. mcp__MCP_DOCKER__open_nodes([returned_entity_id]) [or selective entities from above]
  c. Read from entity: current_branch, active_phase, next_tasks, blockers

STEP 2 — GIT STATE:
  git status && git log --oneline -5

STEP 3 — CONTEXT CHECK:
  Check .claude/CLAUDE.md ## Session State section for any Docker-down fallback notes.
  If notes exist: incorporate them, then clear them (Docker is now available).

STEP 4 — CONFIRM AND PROCEED:
  Report rehydrated state: \"[Session ready — Branch: $BRANCH | Phase: Y | Next: Z]\"
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

# ── JSON escape and output ──────────────────────────────────────────────────
ESCAPED=$(escape_json "$PREFLIGHT")

# ── Output (Claude Code hookSpecificOutput format) ───────────────────────────
printf '{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "%s"
  }
}
' "$ESCAPED"

exit 0
