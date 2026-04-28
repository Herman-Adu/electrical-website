#!/usr/bin/env bash
# SessionStart hook — lean rehydration
# Output: hookSpecificOutput.additionalContext (Claude Code format)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# JSON escape helper (backslash first to avoid double-escaping)
escape_json() {
    local s="$1"
    s="${s//\\/\\\\}"; s="${s//\"/\\\"}"; s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"; s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

# 1. Docker health (2s timeout via Node — no curl dependency)
DOCKER_STATUS="offline"
if command -v node >/dev/null 2>&1; then
    STATUS=$(node -e "
const h=require('http'),r=h.get('http://localhost:3100/health',res=>{process.stdout.write(res.statusCode===200?'ok':'down');res.resume();});
r.on('error',()=>process.stdout.write('down'));r.setTimeout(2000,()=>{r.destroy();process.stdout.write('down');});
" 2>/dev/null || echo "down")
    [ "$STATUS" = "ok" ] && DOCKER_STATUS="online"
fi

# 2. Git state
BRANCH=$(cd "$PROJECT_ROOT" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
GIT_LOG=$(cd "$PROJECT_ROOT" && git log --oneline -3 2>/dev/null || echo "no commits")
GIT_SHORT=$(cd "$PROJECT_ROOT" && git status --short 2>/dev/null | head -5 || echo "")

# 3. Memory keys (from config if present, else default)
MEMORY_KEY="electrical-website-state"
if [ -f "$PROJECT_ROOT/config/active-memory-lanes.json" ]; then
    KEY=$(cat "$PROJECT_ROOT/config/active-memory-lanes.json" 2>/dev/null | \
        node -e "try{const c=JSON.parse(require('fs').readFileSync(0,'utf-8'));console.log((c.memoryKeys||[])[0]||'')}catch{console.log('')}" 2>/dev/null || echo "")
    [ -n "$KEY" ] && MEMORY_KEY="$KEY"
fi

# 4. Build preflight message
if [ "$DOCKER_STATUS" = "online" ]; then
    PREFLIGHT="MANDATORY SESSION START — Docker online.

1. Load memory: curl -sX POST http://localhost:3100/mcp/tools/call -H 'Content-Type: application/json' -d '{\"name\":\"memory_reference__search_nodes\",\"arguments\":{\"query\":\"${MEMORY_KEY}\"}}'
2. Open returned entity with memory_reference__open_nodes
3. Run: git status && git log --oneline -5

Branch: ${BRANCH}
Recent commits:
${GIT_LOG}
Working tree: ${GIT_SHORT:-clean}

STOP — report 3-bullet summary (branch, build status, next tasks) to user and wait for instruction before doing anything else."
else
    PREFLIGHT="MANDATORY SESSION START — Docker OFFLINE (localhost:3100 unreachable).

1. Read .claude/CLAUDE.md ## Session State for last known state
2. Run: git status && git log --oneline -10

Branch: ${BRANCH}
Recent commits:
${GIT_LOG}
Working tree: ${GIT_SHORT:-clean}

STOP — report what you found (git state + CLAUDE.md fallback note) and wait for user instruction. Do not create .md memory files."
fi

ESCAPED=$(escape_json "$PREFLIGHT")

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}' "$ESCAPED"
exit 0
