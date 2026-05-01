# Orchestration Optimization + Platinum Second Brain Integration
**Date:** 2026-05-01  
**Branch:** feat/orchestration-optimization → feat/obsidian-integration  
**Status:** Approved for implementation  
**Architect:** Herman Adu + Claude Sonnet 4.6

---

## Executive Summary

Two sequential features that eliminate dual-truth between config JSON and Docker memory, then complete the three-layer Platinum Second Brain architecture (Hot Context + Docker Graph + Obsidian Vault). 

**feat/orchestration-optimization** delivers: 500-token session startup (down from ~3,000), Docker-canonical Stop hook with Obsidian stubs, PreCompact hook safety net, session cost tracking.

**feat/obsidian-integration** delivers: First session where Docker + Obsidian operate as one system. Stop hook writes daily notes, session notes, and decision mirrors to vault automatically. Rehydration optionally loads one Obsidian note (Tier 5, ≤600 tokens).

---

## Part 1: feat/orchestration-optimization

### Problem Statement

`config/active-memory-lanes.json` is a parallel state store alongside Docker memory. It contains: lane entity name, status, currentBranch, lastSyncedAt, emergencySummary, memoryKeys, and a `phaseSequence` array with stale historical data going back to Phase 8 (April 20th). This causes:
- Dual-truth: the same state exists in Docker AND the JSON file
- Race conditions: PostCheckout hook and Stop hook both write the file
- Token waste: the large JSON is read on every SessionStart even though most fields are stale
- Growing complexity: every new lane adds more JSON fields

The current `memory-rehydrate.mjs` makes 4 sequential Docker calls (Tier 1: project state, Tier 2: lane entity, Tier 3: N keyword searches, Tier 4: session search). `open_nodes` accepts an array — this can be 1-2 calls.

### Design

#### 1. Slim Config: `config/active-branch.json`

Replace `config/active-memory-lanes.json` with a single-purpose pointer file:

```json
{
  "branch": "feat/orchestration-optimization",
  "entity": "lane-feat-orchestration-optimization",
  "fallback": "09ca18d docs: 7 AI memory articles | aae15bb chore: lanes | 8082bda feat: Ladbrokes (#122)",
  "updatedAt": "2026-05-01T00:18:26.860Z"
}
```

- `branch`: current git branch (written by PostCheckout git hook)
- `entity`: Docker lane entity name to open at session start
- `fallback`: last N commit hashes — only used when Docker is offline (replaces emergencySummary)
- `updatedAt`: ISO timestamp of last write

**Migration**: All existing `config/memory-lanes/*.json` files are preserved as-is during migration. The PostCheckout hook updates `active-branch.json` on checkout. Old `active-memory-lanes.json` is deleted after validation. Lane lifecycle scripts updated to write slim format.

#### 2. Simplified Rehydration: `scripts/memory-rehydrate.mjs`

Replace 4-tier, N-query approach with 2-call approach:

```
Tier 1+2 combined: open_nodes(['electrical-website-state', laneEntityName])
  → One HTTP call, two entities. Target: ≤500 tokens total.

Tier 3 (conditional): ONE keyword search using branch name slug only.
  → IF budget > 300 tokens remaining. Target: ≤150 tokens.
  → Returns up to 2 learnings + 1 decision.

Tier 4 ELIMINATED: Session entity search removed.
  → Lane entity observation includes last session summary.
  → No session search needed.

Offline fallback: active-branch.json fallback field + git log --oneline -5.
```

Token target: ≤500 tokens Docker + ≤150 tokens Tier 3 = ≤650 tokens total. Leaving 2,350 tokens headroom.

#### 3. Docker-Canonical Stop Hook: `scripts/memory-lane-stop.mjs`

Redesign into named phases:

```
Phase 1: Read active-branch.json (slim pointer)
Phase 2: Git log + branch detection
Phase 3: Docker health check (3s timeout)
Phase 4: Resolve session name (search Docker for today's sessions)
Phase 5: Create session entity in Docker
         Observations include: token_count (from transcript), tool_uses, branch, git log
Phase 6: add_observations to lane entity + project state
Phase 7: create_relations (session → lane, session → project_state)
Phase 8: Update active-branch.json (fallback field only — not full state)

Phase 9 (STUB): writeObsidianSessionNote()
  → log "[obsidian:pending — implement in feat/obsidian-integration]"
  → return cleanly

Phase 10 (STUB): writeObsidianDailyNote()
  → log "[obsidian:pending — implement in feat/obsidian-integration]"
  → return cleanly

Phase 11 (STUB): mirrorDecisions()
  → log "[obsidian:pending — implement in feat/obsidian-integration]"
  → return cleanly
```

**Session cost tracking**: Stop hook reads `transcript_path` from stdin payload. Sum `usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens` across all assistant turns. Add to session entity: `token_count: {total} | tool_uses: {count} | branch: {branch}`.

#### 4. PreCompact Hook Enhancement: `.claude/hooks/precompact-safety.sh`

Replace no-op `{}` output with a system message:

```bash
#!/bin/bash
echo '{"systemMessage": "PRECOMPACT: Context compacting. Before accepting — run add_observations on electrical-website-state with: current branch, build status, next 2 tasks. Prevents context loss at compaction boundary."}'
exit 0
```

#### 5. Git Hook Migration (PostCheckout + PostCommit)

Update `.git/hooks/post-checkout` (installed via `pnpm hooks:install`) to:
- Write only `active-branch.json` slim pointer (branch, entity, fallback from git log, updatedAt)
- No writes to `active-memory-lanes.json`
- No writes to `config/memory-lanes/*.json` (those are managed by lane lifecycle scripts only)

Update `.git/hooks/post-commit` to:
- Append latest commit hash to `active-branch.json` fallback field only
- Keep the fallback to last 3 commits max

#### 6. Python Migration (Phase 2 of this branch)

Rewrite git hooks in Python after the JavaScript versions are validated:
- `post-checkout` → `scripts/memory_lane_checkout.py`
- `post-commit` → `scripts/memory_lane_commit.py`

Benefits: `pathlib.Path` for Windows-safe paths, clean `subprocess.run`, type hints, no ESM/CommonJS confusion. Keep `memory-rehydrate.mjs` and `memory-lane-stop.mjs` in JavaScript (too large to port in scope).

#### 7. Lane Entity Design

Each active lane gets a Docker entity `lane-{branch-slug}`:

```
Observations include:
- "status: active | branch: feat/orchestration-optimization"
- "plan_entity: plan-orchestration-optimization"
- "opened_at: 2026-05-01T00:03:20.224Z"
- "last_session: session-2026-05-01-003 | completed: docs: 7 AI memory articles, orchestration-optimization branch created"
- "next_tasks: write design spec, implement slim config, update hooks"
- "obsidian_note: Projects/Nexgen Electrical Innovations/feat-orchestration-optimization.md" (added when Obsidian integration lands)
```

The `last_session` observation replaces Tier 4 (session entity search). The lane entity self-describes.

### Validation

After each phase:
- `pnpm typecheck && pnpm build` (63/63 pages must pass)
- `node scripts/memory-lane-stop.mjs --manual` (manual Stop hook test)
- `node scripts/memory-rehydrate.mjs --verbose` (check token count output)
- `pnpm docker:mcp:smoke` (all services healthy)

After all phases:
- `PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test` (≥93 passed)
- Session startup token count must be ≤700 (measured via rehydrate --verbose)

---

## Part 2: feat/obsidian-integration

### Problem Statement

The Obsidian second brain (Layer 3 of the Platinum architecture) is 70% built but not wired:
- Vault exists at `C:/Users/herma/source/repository/obsidian-vault/`
- Local REST API plugin v3.6.1 installed, OBSIDIAN_API_KEY in .env.local
- Docker MCP proxy `docker/mcp-obsidian/server.mjs` coded (7 tools)
- Service defined in docker-compose.yml
- **Zero Stop hook writes to vault**
- **Zero rehydration reads from vault**
- **Zero PARA folders in vault** (no Sessions/, Learnings/, Areas/, Resources/, Archive/)

### Design

#### 1. Relation Model

**Docker → Obsidian pointer**: Add observation string to Docker entities:
```
obsidian_note: Decisions/decide-orchestration-config.md
```

**Obsidian → Docker back-pointer**: YAML frontmatter in every mirrored note:
```yaml
---
dockerEntity: decide-orchestration-config
entityType: decision
date: 2026-05-01
status: active
---
```

#### 2. Vault PARA Structure

Create under `obsidian-vault/Projects/Nexgen Electrical Innovations/`:
```
Sessions/          — session notes (Stop hook auto-writes)
Learnings/         — optional learn-* mirrors
Decisions/         — decide-* mirrors (Stop hook auto-writes for new entities)
Areas/
  performance-tracking.md  — running token count log
Resources/
  articles/        — symlink or copy of archives/content/
Archive/           — completed branches, merged PRs
```

#### 3. Stop Hook Obsidian Phases (fill stubs from orchestration-optimization)

```
Phase 9: writeObsidianSessionNote(sessionName, branch, gitLog, nextTasks)
  → PUT /vault/Sessions/{sessionName}.md
  → YAML frontmatter + markdown body
  → Failure: log warning, continue

Phase 10: writeObsidianDailyNote(branch, lastCommitMsg, sessionName)
  → POST /vault/Daily Notes/{date}.md (append)
  → "- {branch}: {lastCommitMsg} | session {sessionName}"
  → Failure: log warning, continue

Phase 11: mirrorDecisions(manifest)
  → Read /tmp/session-entities-{date}.json (written by PostToolUse)
  → For each decide-* entity: PUT /vault/Decisions/{name}.md
  → Failure: log warning, continue
```

#### 4. Rehydration Tier 5

After Tier 3 in `memory-rehydrate.mjs`:
```javascript
// Tier 5: Obsidian project note (optional)
if (!TIER1_ONLY && tokenBudgetRemaining > 600) {
  const obsidianNote = featureEntity?.observations
    ?.find(o => o.startsWith('obsidian_note:'))
    ?.split('obsidian_note:')[1]?.trim();
  
  if (obsidianNote) {
    const noteContent = await fetchObsidianNote(obsidianNote); // GET /vault/{path}
    if (noteContent) {
      const truncated = truncateToTokens(noteContent, 600);
      tokenBudgetRemaining -= countTokens(truncated);
      sections.push({ label: `Feature Context (Obsidian)`, text: truncated });
    }
  }
}
```

#### 5. Orchestrator Pre-Load Pattern

Before any agent dispatch, orchestrator checks plan/feature entity for `obsidian_note:` observation. If found and Obsidian online, loads note content (≤1,000 tokens) and embeds as `[OBSIDIAN CONTEXT]` section in dispatch prompt. Agent receives full context — zero mid-task vault reads.

#### 6. MCP Tools in CLAUDE.md

Add to MCP stack table:
```
| mcp__MCP_DOCKER__obsidian__* | Obsidian vault CRUD + search | curl localhost:27124 directly |
```

### Validation

- `pnpm docker:mcp:smoke` includes obsidian__health_check (ONLINE/OFFLINE, non-failing)
- Stop hook test: `node scripts/memory-lane-stop.mjs --manual` → check Sessions/ in vault
- Rehydration test: `node scripts/memory-rehydrate.mjs --verbose` with Obsidian online → confirm Tier 5 loads
- E2E: Website build unaffected (63/63 pages)

---

## Implementation Order

```
feat/orchestration-optimization:
  Day 1: active-branch.json + migrate lane scripts + git hooks (JavaScript)
  Day 2: Simplify memory-rehydrate.mjs (2-call approach)
  Day 3: Stop hook redesign (phases 1-11, stubs for 9-11)
  Day 4: PreCompact hook + session cost tracking
  Day 5: Python git hooks + validation + PR

feat/obsidian-integration:
  Day 1: Track B verification + PARA folder creation + plugins
  Day 2: PostToolUse manifest + Stop hook phases 9-11 (fill stubs)
  Day 3: Rehydration Tier 5 + obsidian_note: observations
  Day 4: Orchestrator pre-load pattern + CLAUDE.md updates
  Day 5: Retrospective entity notes + validation + PR
```

---

## Token Budget Targets

| Metric | Current | After orchestration-optimization | After obsidian-integration |
|--------|---------|----------------------------------|---------------------------|
| Session startup tokens | ~876 | ≤650 | ≤1,100 (with Tier 5) |
| Docker queries at startup | 4+ | 2 | 2 + 1 Obsidian |
| Config file size | ~3KB (growing) | ~200 bytes (fixed) | ~200 bytes (fixed) |
| Stop hook writes | Docker + JSON | Docker + JSON (slim) | Docker + JSON + Obsidian |
| Session entities tracked | Docker only | Docker only | Docker + Obsidian mirror |

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| Obsidian offline during Stop hook | Best-effort only, phases 9-11 log and skip, never block |
| Docker offline during PostCheckout | Git hook writes active-branch.json from git log, no Docker dependency |
| Lane entity missing (new branch) | Rehydration falls back to project_state entity only |
| Python not installed on Windows | Detect at pnpm hooks:install time, fall back to bash script |
| obsidian-git push conflicts | Merge strategy (not rebase), pull on boot. Desktop-only — no mobile |
| PostToolUse manifest race condition | Temp file is append-only per session date; concurrent writes from tools within one session are fine |

---

*Part of the ai-memory-architecture series. Implements the full 3-layer Platinum Second Brain: Hot Context + Docker Knowledge Graph + Obsidian Vault.*
