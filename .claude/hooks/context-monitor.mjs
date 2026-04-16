#!/usr/bin/env node
/**
 * UserPromptSubmit hook — context window monitor
 *
 * Reads the session transcript JSONL, calculates context usage against the
 * 200K token limit (Claude Haiku 4.5), and injects a systemMessage when
 * usage >= 70% instructing Claude to pause, ask user to confirm sync, and
 * generate an inline continuation prompt.
 *
 * Token calculation (verified empirically):
 *   context_used = last_assistant_message.usage.input_tokens
 *                + last_assistant_message.usage.cache_creation_input_tokens
 *                + last_assistant_message.usage.cache_read_input_tokens
 *   percentage = (context_used / 200000) * 100
 *
 * Deduplication: Multiple JSONL entries share the same requestId; only the
 * last entry per requestId is used (matches session-report plugin approach).
 *
 * Exit codes:
 *   0 — success (output is valid JSON or empty)
 *   0 — all error paths (never block on hook failure)
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import http from 'http';
import { execSync } from 'child_process';

const CONTEXT_LIMIT = 200_000;
const THRESHOLD_PCT = 70;

// ── Read stdin JSON ──────────────────────────────────────────────────────────
async function readStdin() {
    return new Promise((resolve) => {
        let raw = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', chunk => { raw += chunk; });
        process.stdin.on('end', () => {
            try { resolve(JSON.parse(raw)); }
            catch { resolve({}); }
        });
        process.stdin.on('error', () => resolve({}));
        // Timeout: don't hang if stdin is closed without data
        setTimeout(() => resolve({}), 3000);
    });
}

// ── Parse JSONL transcript ───────────────────────────────────────────────────
async function getContextPercentage(transcriptPath) {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) {
        return null; // No transcript yet (first message of new session)
    }

    return new Promise((resolve) => {
        const seen = new Map(); // requestId -> last assistant entry

        const rl = readline.createInterface({
            input: fs.createReadStream(transcriptPath, { encoding: 'utf8' }),
            crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
            if (!line.trim()) return;
            try {
                const obj = JSON.parse(line);
                if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) {
                    seen.set(obj.requestId, obj);
                }
            } catch { /* skip malformed lines */ }
        });

        rl.on('close', () => {
            if (seen.size === 0) {
                resolve(null); // No assistant messages yet
                return;
            }

            // Get last deduped entry (Map insertion order = chronological)
            const entries = [...seen.values()];
            const last = entries[entries.length - 1];
            const u = last.message.usage;

            const inputTokens = (u.input_tokens || 0)
                + (u.cache_creation_input_tokens || 0)
                + (u.cache_read_input_tokens || 0);

            const pct = (inputTokens / CONTEXT_LIMIT) * 100;
            resolve({ pct, inputTokens, totalLimit: CONTEXT_LIMIT });
        });

        rl.on('error', () => resolve(null));

        // Timeout guard: don't hang on large transcripts
        setTimeout(() => { rl.close(); resolve(null); }, 4000);
    });
}

// ── Docker health probe (to assess sync availability) ───────────────────────
function checkDocker() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3100/health', (res) => {
            res.resume();
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1500, () => { req.destroy(); resolve(false); });
    });
}

// ── Get git state for continuation prompt ────────────────────────────────────
function getGitState(projectDir) {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: projectDir, timeout: 3000, encoding: 'utf8'
        }).trim();
        const lastCommit = execSync('git log --oneline -1', {
            cwd: projectDir, timeout: 3000, encoding: 'utf8'
        }).trim();
        return { branch, lastCommit };
    } catch {
        return { branch: 'unknown', lastCommit: 'unknown' };
    }
}

// ── Build 70% warning message ────────────────────────────────────────────────
function buildWarningMessage(data, dockerOk, gitState) {
    const { pct, inputTokens, totalLimit } = data;
    const pctStr = pct.toFixed(1);
    const usedK = (inputTokens / 1000).toFixed(1);
    const limitK = (totalLimit / 1000).toFixed(0);
    const dockerStatus = dockerOk ? 'AVAILABLE' : 'UNAVAILABLE — use git fallback';
    const { branch, lastCommit } = gitState;
    const now = new Date().toISOString();

    const continuationPrompt = `---CONTINUATION PROMPT (paste as first message in new session)---

## Session Continuation — electrical-website
Synced: ${now} | Context at sync: ${pctStr}%
Context synced to Docker. Do not ask user to repeat.

### Preflight (run ALL before responding)
1. mcp__MCP_DOCKER__search_nodes("electrical-website-state") → open_nodes([id])
2. git status && git log --oneline -5
3. Report: "[Session ready — Branch: ${branch} | Phase: TBD | Next: TBD]"

### State at Sync
- Branch: ${branch}
- Last commit: ${lastCommit}
- Context: ${pctStr}% of ${limitK}K tokens (${usedK}K used)
- Docker entity updated: electrical-website-state ✓

### Continue From
[Specific next action — fill in exact task to resume]

### Available MCP Tools
mcp__MCP_DOCKER__* | sequential-thinking | context7 | nextjs-devtools | playwright (x2)

### Session Rules
- Orchestrator-only: coordinate + delegate; SME agents for analysis
- Gates: pnpm typecheck && pnpm build && pnpm test before done
- Context watch: pause + sync at 70% again if needed

---END CONTINUATION PROMPT---`;

    return `<context-window-warning>
CONTEXT WINDOW AT ${pctStr}% (${usedK}K / ${limitK}K tokens used).

ACTION REQUIRED — PAUSE BEFORE RESPONDING:

1. STOP. Do not continue the current task yet.

2. TELL THE USER:
   "Context window is at ${pctStr}%. I need to sync state to Docker memory before we run out of context. Can you confirm I should proceed with the sync? (Docker: ${dockerStatus})"

3. WAIT for user confirmation ("yes", "go ahead", "confirm", or similar).

4. AFTER CONFIRMATION — SYNC SEQUENCE:
   a. mcp__MCP_DOCKER__search_nodes("electrical-website-state") → get entity ID
   b. mcp__MCP_DOCKER__add_observations(entity_id, [{
        "category": "session_end",
        "timestamp": "${now}",
        "branch": "${branch}",
        "build_status": "unknown",
        "active_phase": "TBD",
        "next_tasks": ["<specific next action when continuing>"],
        "context_pct_at_sync": ${pctStr}
      }])
   c. git status → if uncommitted work: git commit -m "WIP: context-sync at ${pctStr}%"

5. GENERATE INLINE CONTINUATION PROMPT — include this exact block in your response:

${continuationPrompt}

6. INFORM USER: "Sync complete. You can continue in this session or paste the continuation prompt into a new session."

IMPORTANT: The continuation prompt must be copy-paste ready and self-contained.
If Docker is unavailable, write one-line fallback to .claude/CLAUDE.md ## Session State.
</context-window-warning>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    try {
        const input = await readStdin();
        const transcriptPath = input.transcript_path || null;
        const projectDir = process.env.CLAUDE_PROJECT_DIR || '.';

        // Get context percentage
        const contextData = await getContextPercentage(transcriptPath);

        if (!contextData) {
            // No transcript data — pass through silently
            process.stdout.write('{}');
            process.exit(0);
        }

        if (contextData.pct < THRESHOLD_PCT) {
            // Below threshold — no action
            process.stdout.write('{}');
            process.exit(0);
        }

        // At or above 70% — check Docker and inject warning
        const dockerOk = await checkDocker();
        const gitState = getGitState(projectDir);
        const message = buildWarningMessage(contextData, dockerOk, gitState);

        const output = JSON.stringify({ systemMessage: message });
        process.stdout.write(output);
        process.exit(0);

    } catch (err) {
        // Never fail the hook — silent error recovery
        process.stdout.write('{}');
        process.exit(0);
    }
}

main();
