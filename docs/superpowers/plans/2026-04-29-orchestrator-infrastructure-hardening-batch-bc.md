# Orchestrator Infrastructure Hardening — Batch B/C Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add active enforcement hooks (PostToolUse guard, context pre-check, Docker validation) and fix the race condition in memory lane file writes.

**Architecture:** Six self-contained tasks across two batches. Batch B adds enforcement signals to existing hooks — no new subsystems. Batch C fixes data integrity by making writes idempotent and atomic, then removes the background fork from the git hook. Each task is independently committable and testable.

**Tech Stack:** Node.js ESM scripts, Claude Code hook system (`.claude/settings.json`), Vitest for unit tests, `fs.renameSync` atomic pattern, bash git hooks.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `.claude/settings.json` | Modify | Add PostToolUse hook entry |
| `.claude/hooks/post-tool-use-guard.mjs` | **Create** | PostToolUse enforcement: warn on large edits without skill invocation |
| `.claude/hooks/session-start-v2.mjs` | Modify | Pre-injection context % check; pass `--tier1-only` when >55% |
| `scripts/memory-rehydrate.mjs` | Modify | Honour `--tier1-only` flag — skip Tiers 2–4 |
| `scripts/memory-lane-stop.mjs` | Modify | Validate Docker `create_entities` response; retry once on `createdCount: 0` |
| `scripts/memory-lane-activate.mjs` | Modify | Idempotency guard + atomic `writeJson` via temp-rename |
| `.git/hooks/post-checkout` | Modify | Remove background `&` — run synchronously |
| `__tests__/scripts/memory-lane-activate.test.ts` | **Create** | Unit tests: idempotency + atomic write |
| `__tests__/scripts/memory-lane-stop.test.ts` | **Create** | Unit tests: Docker validation + retry |
| `__tests__/hooks/post-tool-use-guard.test.ts` | **Create** | Unit tests: LOC threshold detection |

---

## Batch B

### Task B1: PostToolUse LOC Guard Hook

Fires after Edit/Write tool calls. If the diff adds >50 lines, emits a `systemMessage` warning reminding the orchestrator that large edits require a superpowers skill. Non-blocking — warning only.

**Files:**
- Create: `.claude/hooks/post-tool-use-guard.mjs`
- Modify: `.claude/settings.json:6-61`
- Create: `__tests__/hooks/post-tool-use-guard.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/hooks/post-tool-use-guard.test.ts
import { describe, it, expect } from 'vitest';
import { countAddedLines, buildWarning } from '../../.claude/hooks/post-tool-use-guard.mjs';

describe('post-tool-use-guard', () => {
  it('counts added lines in a unified diff', () => {
    const diff = '+line1\n+line2\n+line3\n context\n-removed';
    expect(countAddedLines(diff)).toBe(3);
  });

  it('returns null warning when added lines <= 50', () => {
    expect(buildWarning('Edit', 10)).toBeNull();
  });

  it('returns warning string when added lines > 50', () => {
    const w = buildWarning('Edit', 51);
    expect(w).toContain('ORCHESTRATOR');
    expect(w).toContain('51');
  });

  it('returns null for non-file-modifying tools', () => {
    expect(buildWarning('Read', 999)).toBeNull();
  });

  it('returns null for Bash tool regardless of LOC', () => {
    // Bash output is not a diff — guard skips it
    expect(buildWarning('Bash', 999)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose __tests__/hooks/post-tool-use-guard.test.ts
```

Expected: FAIL — `Cannot find module '../../.claude/hooks/post-tool-use-guard.mjs'`

- [ ] **Step 3: Create the hook script**

```javascript
// .claude/hooks/post-tool-use-guard.mjs
// PostToolUse hook — warns on large edits without prior skill invocation

const FILE_MODIFYING_TOOLS = new Set(['Edit', 'Write', 'NotebookEdit']);
const LOC_THRESHOLD = 50;

export function countAddedLines(diff) {
  if (!diff || typeof diff !== 'string') return 0;
  return diff.split('\n').filter(l => l.startsWith('+')).length;
}

export function buildWarning(toolName, addedLines) {
  if (!FILE_MODIFYING_TOOLS.has(toolName)) return null;
  if (addedLines <= LOC_THRESHOLD) return null;
  return `ORCHESTRATOR: Large edit detected (${addedLines} lines added via ${toolName}). Per orchestrator contract, >50 LOC changes require a superpowers skill invocation first (TDD, writing-plans, or subagent-driven-development). Was this intentional?`;
}

async function main() {
  let input = {};
  try {
    let raw = '';
    process.stdin.setEncoding('utf8');
    for await (const chunk of process.stdin) raw += chunk;
    input = JSON.parse(raw.trim());
  } catch { /* missing stdin is fine */ }

  const toolName = input?.tool_name ?? '';
  const toolOutput = input?.tool_response ?? '';
  const addedLines = countAddedLines(typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput));
  const warning = buildWarning(toolName, addedLines);

  if (warning) {
    process.stdout.write(JSON.stringify({ systemMessage: warning }));
  } else {
    process.stdout.write('{}');
  }
  process.exit(0);
}

main().catch(() => { process.stdout.write('{}'); process.exit(0); });
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose __tests__/hooks/post-tool-use-guard.test.ts
```

Expected: 5/5 PASS

- [ ] **Step 5: Register the hook in `.claude/settings.json`**

Add after the existing `Stop` block (line 29), inside the `"hooks"` object:

```json
"PostToolUse": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "node \".claude/hooks/post-tool-use-guard.mjs\"",
        "timeout": 3
      }
    ]
  }
],
```

- [ ] **Step 6: Smoke test the hook manually**

```bash
echo '{"tool_name":"Edit","tool_response":"'"$(printf '+%.0s' {1..60} | sed 's/+/+line\n/g')"'"}' | node .claude/hooks/post-tool-use-guard.mjs
```

Expected output: JSON with `systemMessage` containing "ORCHESTRATOR: Large edit detected"

- [ ] **Step 7: Commit**

```bash
git add .claude/hooks/post-tool-use-guard.mjs .claude/settings.json __tests__/hooks/post-tool-use-guard.test.ts
git commit -m "feat: PostToolUse LOC guard hook — warn on large edits without skill invocation"
```

---

### Task B2: Context Pre-Check in SessionStart

`memory-rehydrate.mjs` currently always injects up to 3000 tokens. When context is already >55%, this injection overshoots the hard-stop threshold before the user sends their first message. Fix: `session-start-v2.mjs` reads the transcript to compute context %, then passes `--tier1-only` to `memory-rehydrate.mjs` when >55%.

**Files:**
- Modify: `.claude/hooks/session-start-v2.mjs:21-55` (add context pre-check before rehydrate call)
- Modify: `scripts/memory-rehydrate.mjs` (honour `--tier1-only` flag)

- [ ] **Step 1: Read current session-start-v2.mjs to identify injection point**

```bash
node -e "const s=require('fs').readFileSync('.claude/hooks/session-start-v2.mjs','utf8'); console.log(s.slice(0,200))"
```

Locate the line that calls `memory-rehydrate.mjs` — it uses `execSync('node scripts/memory-rehydrate.mjs ...')`.

- [ ] **Step 2: Read memory-rehydrate.mjs to identify tier-skip locations**

The tiers are in the `main()` function. Tier 1 = project state + active lane entity. Tiers 2–4 = learnings, decisions, last session. Confirm by reading `scripts/memory-rehydrate.mjs` lines 140–260.

- [ ] **Step 3: Add `--tier1-only` flag to memory-rehydrate.mjs**

In `scripts/memory-rehydrate.mjs`, after line 14 (`const VERBOSE = ...`):

```javascript
const TIER1_ONLY = process.argv.includes('--tier1-only');
```

Then in `main()`, wrap the Tier 2–4 calls:

```javascript
// Tier 2: Active lane entity
if (!TIER1_ONLY) {
  // ... existing tier 2 code ...
}

// Tier 3: Learnings + decisions
if (!TIER1_ONLY) {
  // ... existing tier 3 code ...
}

// Tier 4: Last session
if (!TIER1_ONLY) {
  // ... existing tier 4 code ...
}
```

Add a warning line in the output block when `TIER1_ONLY` is true:

```javascript
if (TIER1_ONLY) {
  injectionLines.push('> CONTEXT PRE-CHECK: >55% at session start — memory truncated to Tier 1 only to avoid context overflow.');
}
```

- [ ] **Step 4: Add context pre-check in session-start-v2.mjs**

After the `import` block and before calling `memory-rehydrate.mjs`, add:

```javascript
// Context pre-check — compute % before injecting memory
async function getContextPct(transcriptPath) {
  if (!transcriptPath) return null;
  try {
    const { createReadStream } = await import('fs');
    const { createInterface } = await import('readline');
    const LIMIT = 200_000;
    return await new Promise((resolve) => {
      const seen = new Map();
      const rl = createInterface({ input: createReadStream(transcriptPath, { encoding: 'utf8' }), crlfDelay: Infinity });
      rl.on('line', (line) => {
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'assistant' && obj.requestId && obj.message?.usage) seen.set(obj.requestId, obj);
        } catch { /* skip */ }
      });
      rl.on('close', () => {
        if (!seen.size) { resolve(null); return; }
        const u = [...seen.values()].at(-1).message.usage;
        const total = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        resolve(Math.min(100, (total / LIMIT) * 100));
      });
      rl.on('error', () => resolve(null));
      setTimeout(() => { rl.close(); resolve(null); }, 3000);
    });
  } catch { return null; }
}
```

Then in `main()`, before the `execSync('node scripts/memory-rehydrate.mjs ...')` call:

```javascript
const transcriptPath = input?.transcript_path ?? null;
const contextPct = await getContextPct(transcriptPath);
const tier1Only = contextPct !== null && contextPct > 55;
const rehydrateFlags = tier1Only ? '--verbose --tier1-only' : '--verbose';
// then pass rehydrateFlags into the execSync call
```

- [ ] **Step 5: Verify manually**

```bash
node scripts/memory-rehydrate.mjs --verbose --tier1-only 2>&1 | head -20
```

Expected: output contains only Tier 1 (project state) and the context warning, NOT learnings/decisions/last session.

- [ ] **Step 6: Commit**

```bash
git add .claude/hooks/session-start-v2.mjs scripts/memory-rehydrate.mjs
git commit -m "feat: context pre-check in SessionStart — --tier1-only flag prevents memory overflow at >55% context"
```

---

### Task B3: Docker Response Validation in memory-lane-stop.mjs

`create_entities` can silently return `{ entities: [] }` or `null` when Docker drops the call. Currently the script writes `active-memory-lanes.json` whether or not Docker succeeded. Fix: validate the response, retry once on failure, log a warning if still no entities — but never block session end.

**Files:**
- Modify: `scripts/memory-lane-stop.mjs:179-194` (Step 5: Create session entity block)
- Create: `__tests__/scripts/memory-lane-stop.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// __tests__/scripts/memory-lane-stop.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateCreateEntitiesResponse, buildRetryMessage } from '../../scripts/memory-lane-stop.mjs';

describe('Docker response validation', () => {
  it('returns true when entities array is non-empty', () => {
    expect(validateCreateEntitiesResponse({ entities: [{ name: 'x' }] })).toBe(true);
  });

  it('returns true for content wrapper with entities', () => {
    expect(validateCreateEntitiesResponse({ content: [{ type: 'json', json: { entities: [{}] } }] })).toBe(true);
  });

  it('returns false for null response', () => {
    expect(validateCreateEntitiesResponse(null)).toBe(false);
  });

  it('returns false for empty entities array', () => {
    expect(validateCreateEntitiesResponse({ entities: [] })).toBe(false);
  });

  it('returns false for missing entities key', () => {
    expect(validateCreateEntitiesResponse({ ok: true })).toBe(false);
  });

  it('buildRetryMessage includes entity name', () => {
    const msg = buildRetryMessage('session-2026-04-29-001');
    expect(msg).toContain('session-2026-04-29-001');
    expect(msg).toContain('[memory:stop]');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test -- --reporter=verbose __tests__/scripts/memory-lane-stop.test.ts
```

Expected: FAIL — `validateCreateEntitiesResponse` not exported

- [ ] **Step 3: Add exported helpers to memory-lane-stop.mjs**

After the `extractEntities` function (line ~72), add:

```javascript
export function validateCreateEntitiesResponse(result) {
  if (!result) return false;
  // Direct entities array
  if (Array.isArray(result?.entities) && result.entities.length > 0) return true;
  // Content wrapper (Docker gateway format)
  const inner = result?.content?.[0]?.json;
  if (Array.isArray(inner?.entities) && inner.entities.length > 0) return true;
  return false;
}

export function buildRetryMessage(entityName) {
  return `[memory:stop] WARNING: create_entities returned no confirmation for "${entityName}" — Docker may have dropped the write. Config NOT updated to avoid false sync state.`;
}
```

- [ ] **Step 4: Use the helpers in the create_entities call (lines 181–194)**

Replace the existing `await mcpCall('create_entities', {...})` block with:

```javascript
// Step 5: Create session entity — validate response, retry once
const createArgs = {
  entities: [{
    name: sessionName,
    entityType: 'session',
    observations: [
      `work_completed: ${gitLog.slice(0, 200).replace(/\n/g, ' | ')}`,
      `branch: ${currentBranch}`,
      `build_status: unknown`,
      `next_tasks: check git log for continuation`,
      `session_end_at: ${now}`,
      `docker_synced: true`,
    ],
  }],
};
let entityCreated = false;
let createResult = await mcpCall('create_entities', createArgs);
if (validateCreateEntitiesResponse(createResult)) {
  entityCreated = true;
} else {
  // Retry once after 500ms
  await new Promise(r => setTimeout(r, 500));
  createResult = await mcpCall('create_entities', createArgs);
  if (validateCreateEntitiesResponse(createResult)) {
    entityCreated = true;
  } else {
    console.warn(buildRetryMessage(sessionName));
  }
}
```

Then gate the `active-memory-lanes.json` update (Step 9) to only run when `entityCreated` is true:

```javascript
// Step 9: Update active-memory-lanes.json — only when Docker confirmed entity
if (entityCreated) {
  lanesConfig.lastSyncedAt = now;
  lanesConfig.emergencySummary = buildEmergencySummary(currentBranch, workSummary);
  writeJson(activeLanesPath, lanesConfig);
  console.log(`[memory:stop] local config updated. emergencySummary: ${lanesConfig.emergencySummary.slice(0, 80)}...`);
} else {
  console.warn('[memory:stop] Skipping config update — Docker entity creation unconfirmed.');
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose __tests__/scripts/memory-lane-stop.test.ts
```

Expected: 6/6 PASS

- [ ] **Step 6: Manual smoke test**

```bash
node scripts/memory-lane-stop.mjs --manual 2>&1
```

Expected: `[memory:stop] Session synced to Docker: session-YYYY-MM-DD-NNN` and `[memory:stop] local config updated.`

- [ ] **Step 7: Commit**

```bash
git add scripts/memory-lane-stop.mjs __tests__/scripts/memory-lane-stop.test.ts
git commit -m "feat: Docker response validation in memory-lane-stop — retry once, skip config update on unconfirmed write"
```

---

## Batch C

### Task C1: Idempotency Check in memory-lane-activate.mjs

If the `post-checkout` hook fires twice (race) or `session-start-v2.mjs` also calls activate, the second call currently re-writes all files for the same branch. Fix: if `activeLanes.currentBranch` already matches the current git branch, exit early with no file writes.

**Files:**
- Modify: `scripts/memory-lane-activate.mjs:65-72` (start of `main()`)
- Create: `__tests__/scripts/memory-lane-activate.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/scripts/memory-lane-activate.test.ts
import { describe, it, expect } from 'vitest';
import { isAlreadyActive } from '../../scripts/memory-lane-activate.mjs';

describe('isAlreadyActive', () => {
  it('returns true when currentBranch matches activeLanes.currentBranch', () => {
    expect(isAlreadyActive('main', { currentBranch: 'main', status: 'active' })).toBe(true);
  });

  it('returns false when branches differ', () => {
    expect(isAlreadyActive('main', { currentBranch: 'feat/other', status: 'active' })).toBe(false);
  });

  it('returns false when activeLanes is null', () => {
    expect(isAlreadyActive('main', null)).toBe(false);
  });

  it('returns false when activeLanes has no currentBranch', () => {
    expect(isAlreadyActive('main', { status: 'active' })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose __tests__/scripts/memory-lane-activate.test.ts
```

Expected: FAIL — `isAlreadyActive` not exported

- [ ] **Step 3: Add exported helper and idempotency guard to memory-lane-activate.mjs**

After the `writeJson` function (line ~56), add:

```javascript
export function isAlreadyActive(currentBranch, activeLanes) {
  if (!activeLanes?.currentBranch) return false;
  return activeLanes.currentBranch === currentBranch;
}
```

Then in `main()` (line ~65), after detecting `currentBranch`, add:

```javascript
// Idempotency guard — skip all writes if this branch is already active
const activeLanesEarly = readJson(activeLanesPath);
if (isAlreadyActive(currentBranch, activeLanesEarly)) {
  console.log(`[lane:activate] Already active on "${currentBranch}" — no-op.`);
  process.exit(0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test -- --reporter=verbose __tests__/scripts/memory-lane-activate.test.ts
```

Expected: 4/4 PASS

- [ ] **Step 5: Verify manually — two consecutive calls**

```bash
node scripts/memory-lane-activate.mjs && node scripts/memory-lane-activate.mjs
```

Expected: First call activates normally. Second call outputs `Already active on "..." — no-op.` with no file changes.

- [ ] **Step 6: Commit**

```bash
git add scripts/memory-lane-activate.mjs __tests__/scripts/memory-lane-activate.test.ts
git commit -m "feat: idempotency guard in memory-lane-activate — skip all writes when branch already active"
```

---

### Task C2: Atomic writeJson via Temp-Rename Pattern

Both `memory-lane-activate.mjs` and `memory-lane-stop.mjs` use raw `writeFileSync` — no atomicity guarantee. Replace with write-to-`.tmp`-then-`renameSync` in both files. `renameSync` is atomic on POSIX and near-atomic on Windows NTFS (single-volume).

**Files:**
- Modify: `scripts/memory-lane-activate.mjs:54-56` (`writeJson` function)
- Modify: `scripts/memory-lane-stop.mjs:52-54` (`writeJson` function)

- [ ] **Step 1: Write the test**

Add to `__tests__/scripts/memory-lane-activate.test.ts`:

```typescript
import { writeJsonAtomic } from '../../scripts/memory-lane-activate.mjs';
import { writeFileSync, renameSync, unlinkSync, existsSync } from 'fs';
import { vi } from 'vitest';

describe('writeJsonAtomic', () => {
  it('writes valid JSON to the target path', () => {
    const tmpPath = '/tmp/test-atomic-write.json';
    const data = { key: 'value', nested: { a: 1 } };
    writeJsonAtomic(tmpPath, data);
    const written = JSON.parse(require('fs').readFileSync(tmpPath, 'utf8'));
    expect(written).toEqual(data);
    unlinkSync(tmpPath);
  });

  it('uses renameSync (atomic) not direct writeFileSync', () => {
    const renameSpy = vi.spyOn(require('fs'), 'renameSync');
    writeJsonAtomic('/tmp/test-rename.json', { x: 1 });
    expect(renameSpy).toHaveBeenCalled();
    renameSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --reporter=verbose __tests__/scripts/memory-lane-activate.test.ts
```

Expected: FAIL — `writeJsonAtomic` not exported

- [ ] **Step 3: Replace writeJson in memory-lane-activate.mjs**

```javascript
import { readFileSync, writeFileSync, renameSync } from 'fs';

export function writeJsonAtomic(path, data) {
  const tmp = `${path}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    renameSync(tmp, path);
  } catch (err) {
    try { renameSync(tmp, path); } catch { /* already renamed or write failed */ }
  }
}

// Keep writeJson as an alias so existing callers still work
function writeJson(path, data) { writeJsonAtomic(path, data); }
```

- [ ] **Step 4: Apply the same pattern to memory-lane-stop.mjs**

Replace the existing `writeJson` function (lines 52-54) in `memory-lane-stop.mjs`:

```javascript
import { readFileSync, writeFileSync, renameSync } from 'fs';

function writeJson(path, data) {
  const tmp = `${path}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
    renameSync(tmp, path);
  } catch { /* ignore — never fail Stop hook */ }
}
```

- [ ] **Step 5: Run full test suite to check no regressions**

```bash
pnpm test 2>&1 | tail -8
```

Expected: All existing tests pass

- [ ] **Step 6: Commit**

```bash
git add scripts/memory-lane-activate.mjs scripts/memory-lane-stop.mjs __tests__/scripts/memory-lane-activate.test.ts
git commit -m "feat: atomic writeJson via temp-rename in memory-lane-activate and memory-lane-stop"
```

---

### Task C3: Synchronous post-checkout Hook

The `&` at the end of the `post-checkout` hook forks a background process. This creates a race: `session-start-v2.mjs` can also call `memory-lane-activate.mjs` if it detects a mismatch, and both write `active-memory-lanes.json` simultaneously. Fix: remove `&` and let it run synchronously. The 2-3 second penalty is acceptable for a git hook.

**Files:**
- Modify: `.git/hooks/post-checkout` (single line change)

> **Note:** `.git/hooks/` is not tracked by git — apply this change, then document it in `scripts/hooks-install.mjs` or the equivalent install script so it persists after `git clone`.

- [ ] **Step 1: Identify the install script**

```bash
grep -r "post-checkout" scripts/ package.json --include="*.mjs" --include="*.json" -l
```

Find the script that writes `.git/hooks/post-checkout`.

- [ ] **Step 2: Read the current hook content**

```bash
cat .git/hooks/post-checkout
```

Expected current content:
```bash
#!/usr/bin/env bash
# memory-lane-activate — installed by pnpm hooks:install
if [ "$3" != "1" ]; then exit 0; fi
if ! command -v node >/dev/null 2>&1; then exit 0; fi
node "$(git rev-parse --show-toplevel)/scripts/memory-lane-activate.mjs" "$1" "$2" "$3" \
  >/tmp/memory-lane-activate.log 2>&1 &
exit 0
```

- [ ] **Step 3: Write new synchronous hook**

```bash
cat > .git/hooks/post-checkout << 'EOF'
#!/usr/bin/env bash
# memory-lane-activate — installed by pnpm hooks:install
# Runs synchronously (no &) to prevent concurrent writes with session-start-v2.mjs
if [ "$3" != "1" ]; then exit 0; fi
if ! command -v node >/dev/null 2>&1; then exit 0; fi
node "$(git rev-parse --show-toplevel)/scripts/memory-lane-activate.mjs" "$1" "$2" "$3" \
  >/tmp/memory-lane-activate.log 2>&1
exit 0
EOF
chmod +x .git/hooks/post-checkout
```

- [ ] **Step 4: Update the install script so the fix persists after re-install**

Find the `hooks:install` script (from Step 1). Replace the hook template inside it — change the line:

```
>/tmp/memory-lane-activate.log 2>&1 &
```

to:

```
>/tmp/memory-lane-activate.log 2>&1
```

- [ ] **Step 5: Verify timing on a branch switch**

```bash
time git checkout -b test/sync-hook-timing 2>&1 && git checkout fix/memory-lane-corruption-and-branch-mismatch && git branch -d test/sync-hook-timing
```

Expected: Checkout completes in ~2-4 seconds (hook runs synchronously). `active-memory-lanes.json` reflects the correct branch immediately after.

- [ ] **Step 6: Commit the install script change**

> Note: `.git/hooks/post-checkout` is not committable (git-excluded). Only commit the install script.

```bash
# Replace <install-script-path> with the file found in Step 1
git add <install-script-path>
git commit -m "fix: post-checkout hook runs synchronously — remove & to prevent concurrent writes with session-start"
```

---

## Run the Full Test Suite After All Tasks

- [ ] **Final verification**

```bash
pnpm test 2>&1 | tail -8
```

Expected: All existing tests pass + new tests added in B1, B3, C1, C2 also pass.

```bash
pnpm typecheck && pnpm build 2>&1 | grep -E "(TYPECHECK_PASSED|BUILD_GATE_PASSED|error)" | head -10 && echo "BUILD_GATE_PASSED"
```

Expected: Clean typecheck, 59/59 pages built.

---

## Commit History Target

```
feat: PostToolUse LOC guard hook — warn on large edits without skill invocation        (B1)
feat: context pre-check in SessionStart — --tier1-only flag prevents memory overflow   (B2)
feat: Docker response validation in memory-lane-stop — retry once, skip config on fail (B3)
feat: idempotency guard in memory-lane-activate — skip writes when branch already active (C1)
feat: atomic writeJson via temp-rename in memory-lane-activate and memory-lane-stop    (C2)
fix: post-checkout hook runs synchronously — remove & to prevent concurrent writes     (C3)
```

---

## Known Constraints

- Hook scripts are >50 LOC — acknowledged exception (infrastructure running outside orchestrator visibility). Document this pragmatic exception in `CLAUDE.md` if not already noted.
- `.git/hooks/` is not tracked by git. The fix in C3 must live in the install script to survive `git clone`.
- The PostToolUse hook (B1) fires on the tool output diff, not the file diff. If `Edit` returns a unified diff in its output, `countAddedLines` works correctly. Verify the actual tool response format when implementing — adjust if Edit returns something other than a unified diff.
