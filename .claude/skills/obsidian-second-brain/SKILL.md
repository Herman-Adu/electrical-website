---
name: obsidian-second-brain
description: Use this skill WHENEVER you need to interact with an Obsidian vault during a Claude Code session — reading notes, writing daily notes, capturing decisions, appending research, or syncing Obsidian content with Docker memory. Trigger on phrases like "open my vault", "write to Obsidian", "daily note", "capture in Obsidian", "search my notes", "create a decision log", "append to research", "sync to Obsidian", "read from vault", "mirror this to Obsidian", or "check what's in my vault". Also trigger when the user asks to record long-form context, journal entries, or project research that does not belong in Docker memory. Never use this skill as the primary session rehydration source — Docker memory is primary; Obsidian is the long-form complement.
argument-hint: "[daily-note|create|read|search|append|capture|sync-to-docker]"
disable-model-invocation: true
compatibility: Requires Obsidian running with Local REST API plugin (port 27124), OBSIDIAN_API_KEY in .env.local
---

# Obsidian Second Brain Skill

## Purpose

Connects Claude Code sessions to an Obsidian vault via the Local REST API community plugin. Use this skill to read notes, write daily notes, capture decisions and learnings in human-readable markdown, and mirror Docker memory entities to Obsidian for long-form context.

**Obsidian is NOT a replacement for Docker memory.** Docker is primary for structured session rehydration; Obsidian handles long-form research, journals, and human-readable archives.

**Agent dispatch:** `Agent(subagent_type="general-purpose")` — never implement code changes from within this skill. This skill is vault operations only.

---

## Health Check (Run Before Every Operation)

Always verify Obsidian is running and the plugin is active before any API call:

```bash
curl -sf http://localhost:27124/ \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  && echo "ONLINE" || echo "OFFLINE"
```

**If OFFLINE:** Warn the user — "Obsidian must be running with the Local REST API plugin enabled. Start Obsidian and confirm the plugin is active in Community Plugins settings." Do not hard-fail; log the warning and continue the session without vault operations.

**Never log or expose the value of `OBSIDIAN_API_KEY`.** Reference the variable name only.

---

## Layer 1 — Vault Operations (CRUD)

All requests use `http://localhost:27124` with the header `Authorization: Bearer $OBSIDIAN_API_KEY`.

### list_files — List all notes in the vault

```bash
curl -s http://localhost:27124/vault/ \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

Returns a JSON array of relative file paths within the vault.

---

### read_note — Read a note by path

```bash
# Replace {path} with the relative path inside the vault, e.g. "Daily Notes/2026-04-29.md"
curl -s "http://localhost:27124/vault/{path}" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
# URL-encode spaces in path segments: "Daily Notes/..." → "Daily%20Notes/..."
```

Returns the raw markdown content of the note.

---

### create_or_update_note — Create or overwrite a note

```bash
# Full overwrite — use PUT
curl -s -X PUT "http://localhost:27124/vault/{path}" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-raw "# Note title

Content goes here."
```

If the note does not exist it is created. If it exists the full content is replaced.

---

### delete_note — Delete a note

```bash
curl -s -X DELETE "http://localhost:27124/vault/{path}" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
# URL-encode spaces in path segments: "Daily Notes/..." → "Daily%20Notes/..."
```

---

### search_vault — Full-text search across the vault

```bash
curl -s -X POST \
  "http://localhost:27124/search/simple/?query=electrical-website+current+feature&contextLength=100" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

Returns an array of matches with file path, score, and surrounding context. Use `contextLength` to control how many characters of surrounding text are returned per match.

---

### append_to_note — Append content to an existing note

```bash
# Uses POST — appends rather than overwrites
curl -s -X POST "http://localhost:27124/vault/{path}" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/plain" \
  --data-raw "

## Appended section

New content here."
```

If the note does not exist, it is created with the appended content as the full body.

---

### open_in_obsidian — Open a note in the running Obsidian UI

```bash
# Replace {path} with URL-encoded relative path
curl -s -X POST "http://localhost:27124/open/{path}" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

Opens the note in the Obsidian desktop application. Requires Obsidian to be running with the UI visible.

---

## Layer 2 — Thinking & Daily Notes

### Daily Note

Create or append to today's daily note at `Daily Notes/YYYY-MM-DD.md`.

Get today's date:
```bash
node -e "console.log(new Date().toISOString().slice(0,10))"
# e.g. 2026-04-29
```

Create the daily note (PUT — full create or overwrite):
```bash
DATE=$(node -e "console.log(new Date().toISOString().slice(0,10))")

curl -s -X PUT "http://localhost:27124/vault/Daily%20Notes/${DATE}.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-raw "# ${DATE}

## Work
- Branch:
- Commits:

## Decisions
-

## Learnings
-

## Next
-
"
```

Append a work entry to an existing daily note:
```bash
DATE=$(node -e "console.log(new Date().toISOString().slice(0,10))")

curl -s -X POST "http://localhost:27124/vault/Daily%20Notes/${DATE}.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/plain" \
  --data-raw "
- feat/batch-bc-orchestrator-hardening — completed memory-lane stop hook"
```

---

### Session Note

Create a session note that links to the corresponding Docker memory session entity. Path convention: `Sessions/session-YYYY-MM-DD-NNN.md`.

```bash
SESSION_ID="session-YYYY-MM-DD-001"  # replace with actual session entity name from Docker

curl -s -X PUT "http://localhost:27124/vault/Sessions/${SESSION_ID}.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-raw "---
dockerEntity: ${SESSION_ID}
date: 2026-04-29
branch: feat/batch-bc-orchestrator-hardening
---

# Session: ${SESSION_ID}

## Work Completed
-

## Decisions Made
-

## Learnings
-

## Next Tasks
-

## Docker Entity
See \`${SESSION_ID}\` in Docker memory for structured handoff context.
"
```

---

### Decision Log

Create a decision log at `Decisions/decide-{kebab-name}.md` as a human-readable mirror of a Docker `decide-*` entity.

```bash
ENTITY="decide-DOMAIN-CHOICE"  # replace with actual entity name, e.g. decide-auth-jwt-vs-session

curl -s -X PUT "http://localhost:27124/vault/Decisions/${ENTITY}.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-raw "---
dockerEntity: ${ENTITY}
date: 2026-04-29
status: active
---

# Decision: ${ENTITY}

## Choice
Use Docker memory-reference graph as the sole persistent store for session context.

## Rationale
Docker graph is queryable by LLM, structured, and avoids .md file sprawl.

## Alternatives Considered
- .md files in .claude/ — rejected: not queryable, bloats repo
- SQLite — rejected: requires additional tooling

## See Also
Docker entity: \`${ENTITY}\`
"
```

---

### Research Scratch

Append long-form research to `Research/{topic}.md`. Use for notes too verbose for a Docker observation.

```bash
curl -s -X POST "http://localhost:27124/vault/Research/memory-lane-architecture.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/plain" \
  --data-raw "

## 2026-04-29 — Stop hook behaviour

When the Stop hook fires, memory-lane-stop.mjs updates lastSyncedAt and writes emergencySummary to the lane config JSON. This is the only permitted file write outside Docker memory."
```

---

## Layer 3 — Context Loading

Load vault context at session start alongside Docker memory. Vault provides long-form detail; Docker provides structured graph.

**Step 1 — Search for relevant notes:**
```bash
curl -s -X POST \
  "http://localhost:27124/search/simple/?query=electrical-website+current+feature&contextLength=200" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

**Step 2 — Read active project note (if it exists):**
```bash
curl -s "http://localhost:27124/vault/Projects/electrical-website.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

**Step 3 — Read today's daily note:**
```bash
DATE=$(node -e "console.log(new Date().toISOString().slice(0,10))")
curl -s "http://localhost:27124/vault/Daily%20Notes/${DATE}.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

Load order at session start:
1. Docker memory (primary — structured, required): `pnpm docker:mcp:memory:search` + `pnpm docker:mcp:memory:open`
2. Obsidian vault (secondary — long-form, optional): search + read project note + read daily note
3. Git state: `git status && git log --oneline -5`

If Obsidian is OFFLINE at session start, skip vault steps and note it in session context. Never block session startup on vault availability.

---

## Layer 4 — Docker Memory Bridge

Obsidian and Docker memory serve different purposes and must never duplicate each other.

| Content type | Store in | Why |
|---|---|---|
| Long-form research | Obsidian only | Markdown + backlinks, not queryable by LLM |
| Structured decisions | Docker entity + Obsidian mirror | Queryable (Docker) + human-readable (Obsidian) |
| Daily notes / journals | Obsidian only | Chronological; not suitable as Docker entities |
| Session handoffs | Docker entity (primary) + Obsidian link | Rehydration is Docker-first |
| Code patterns / gotchas | Docker `learn-*` entity | Searchable by LLM; keep Obsidian mirror optional. If mirroring, use path `Learnings/learn-{kebab-name}.md` |
| Session state mid-work | Docker `add_observations` only | Never write mid-session state to Obsidian |

### Pattern: Mirror a Docker Decision to Obsidian

After creating a `decide-*` entity in Docker, create the corresponding Obsidian mirror:

```bash
# 1. Create Docker entity (via knowledge-memory skill or mcp-memory-call.mjs)
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "decide-auth-strategy-clerk",
    "entityType": "decision",
    "observations": [
      "Choice: Use Clerk for authentication",
      "Rationale: Built-in Next.js App Router support, edge-compatible middleware",
      "Alternatives considered: NextAuth, Auth.js, custom JWT"
    ]
  }]
}'

# 2. Mirror to Obsidian (PUT /vault/Decisions/decide-auth-strategy-clerk.md)
curl -s -X PUT \
  "http://localhost:27124/vault/Decisions/decide-auth-strategy-clerk.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-raw "---
dockerEntity: decide-auth-strategy-clerk
date: 2026-04-29
status: active
---

# Decision: decide-auth-strategy-clerk

## Choice
Use Clerk for authentication.

## Rationale
Built-in Next.js App Router support, edge-compatible middleware, managed session handling.

## Alternatives Considered
- NextAuth — rejected: more configuration overhead
- Auth.js — rejected: same as NextAuth, different name
- Custom JWT — rejected: maintenance burden

## Docker Entity
\`decide-auth-strategy-clerk\` — use \`pnpm docker:mcp:memory:open decide-auth-strategy-clerk\` to load.
"
```

### Pattern: Link a Session Note Back to Docker

After creating a session entity in Docker, link it from the Obsidian session note:

```bash
# Append Docker link to existing session note
curl -s -X POST \
  "http://localhost:27124/vault/Sessions/session-2026-04-29-001.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/plain" \
  --data-raw "
## Docker Memory
Entity: \`session-2026-04-29-001\`
Load: \`pnpm docker:mcp:memory:open session-2026-04-29-001\`"
```

---

## Prohibitions

- Never store Docker session entity content verbatim in Obsidian — Obsidian holds the human-readable narrative, Docker holds the structured graph
- Never use Obsidian as the primary session rehydration source — Docker is always primary
- Never hard-fail on Obsidian OFFLINE — log the warning and continue without vault operations
- Never log or expose the value of `OBSIDIAN_API_KEY` — reference the variable name only
- Never write daily notes or journals as Docker entities — those belong in Obsidian only
- Never create Obsidian notes for mid-session state — use Docker `add_observations` for that

---

## Setup and Prerequisites

Complete this setup once before using the skill:

1. **Install Obsidian** from [obsidian.md](https://obsidian.md) and open or create a vault.

2. **Install Local REST API plugin:**
   - Open Obsidian Settings > Community Plugins > Browse
   - Search "Local REST API" — install and enable it
   - In plugin settings: disable HTTPS (use HTTP only for localhost), note the API key shown

3. **Add the API key to `.env.local`** (already gitignored):
   ```
   OBSIDIAN_API_KEY=your-key-from-plugin-settings
   ```
   Reference the variable name `OBSIDIAN_API_KEY` — never paste the value into any file other than `.env.local`.

4. **Vault location:** `obsidian-vault/` in the project root. Confirm this path is excluded from the repo:
   ```bash
   grep obsidian-vault .gitignore
   ```
   Add it if missing: `echo "obsidian-vault/" >> .gitignore`

5. **GitHub sync (optional):** Install the Git community plugin in Obsidian, configure it with a private GitHub remote, and set auto-push interval (recommended: 30 minutes). This keeps vault history without including it in the main project repo.

6. **Verify the setup:**
   ```bash
   source .env.local && \
   curl -sf http://localhost:27124/ \
     -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
     && echo "READY" || echo "CHECK OBSIDIAN + PLUGIN"
   ```

---

## Session Integration Checklist

- [ ] Run health check before first vault operation — confirm ONLINE or warn and skip
- [ ] Load Docker memory first, then Obsidian context (Docker is primary)
- [ ] Create daily note at session start if it does not exist
- [ ] Append work summary to daily note at session end
- [ ] Mirror any new `decide-*` Docker entities to `Decisions/` in vault
- [ ] Create session note in `Sessions/` and link to Docker session entity
- [ ] Append long-form research to `Research/{topic}.md` — not to Docker
- [ ] Never expose `OBSIDIAN_API_KEY` value in logs, outputs, or files other than `.env.local`
- [ ] Confirm Obsidian OFFLINE does not block session end or Docker memory sync

---

## See Also

- [Knowledge Memory Skill](../knowledge-memory/SKILL.md) — Docker entity creation patterns
- [Session Lifecycle Skill](../session-lifecycle/SKILL.md) — Session start, sync, and end workflow
- [Docker Memory Policy](../../rules/memory-policy.md) — Entity types and observation schema

**Last Updated:** 2026-04-29
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
