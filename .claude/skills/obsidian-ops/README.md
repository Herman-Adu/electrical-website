# Obsidian Ops Skill

Reads and writes to the Obsidian vault via the Docker-hosted `obsidian` MCP proxy — write notes, search the vault, sync feature documentation, and mirror Docker memory entities to Obsidian.

## When to Use

Use this skill WHENEVER you need to interact with the Obsidian vault from a Claude Code session. It handles the health check and Docker proxy automatically.

**Trigger phrases:**
- "Save this to Obsidian"
- "Write a note to the vault"
- "Search Obsidian for context on X"
- "Sync this feature to Obsidian"
- "Mirror this plan to Obsidian"
- "Document in vault"
- `/obsidian-ops [write | search | sync-feature | mirror-plan]`

## How It Works

```
1. Health-check the Obsidian proxy at http://localhost:3100/obsidian/health
2. If Obsidian desktop is offline: warn, log pending_obsidian_sync on project state, skip
3. Execute the vault operation via the Docker MCP proxy
4. Return result to caller
```

## Operations

### Health Check (always run first)

```bash
curl -s http://localhost:3100/obsidian/health
# ONLINE: {"status":"ok","obsidian":"online"}
# OFFLINE: {"obsidian":"offline"} — open Obsidian desktop app first
```

### Write a Note

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "write_note", "arguments": {"path": "PATH/IN/VAULT.md", "content": "# Note title\n\nContent..."}}'
```

### Search the Vault

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "search", "arguments": {"query": "SEARCH_TERM"}}'
```

Returns a list of matching notes with file paths and snippets.

### List All Notes

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "list_notes", "arguments": {}}'
```

### Read a Note

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "read_note", "arguments": {"path": "PATH/IN/VAULT.md"}}'
```

## Mirroring a Feature to Obsidian

When syncing a feature from Docker memory to Obsidian (the standard pattern used by `plan-sync`):

```
1. Search Docker for the feature entity: mcp__memory__search_nodes with entity name
2. Extract observations to build note content
3. Write feature doc to Projects/nexgen-electrical-innovations/FEATURE_NAME.md
4. Write cross-linked plan to Plans/FEATURE_NAME-plan.md
```

### Vault Path Conventions

| Content type | Vault path |
|-------------|-----------|
| Feature documentation | `Projects/nexgen-electrical-innovations/FEATURE_NAME.md` |
| Implementation plans | `Plans/FEATURE_NAME-plan.md` |
| Daily notes | `Projects/Nexgen Electrical Innovations/Daily Notes/YYYY-MM-DD.md` |
| Decision logs | `Projects/Nexgen Electrical Innovations/Decisions/decide-NAME.md` |
| Session notes | `Projects/Nexgen Electrical Innovations/Sessions/session-YYYY-MM-DD-NNN.md` |

## Usage Examples

### Example 1: Sync a Feature After Planning

```
/obsidian-ops "sync-feature — feat-emergency-section-hero"
```

Steps:
1. Load `feat-emergency-section-hero` from Docker memory
2. Build note content from observations (status, plan_file, batches, tasks)
3. Write to `Projects/nexgen-electrical-innovations/emergency-section-hero.md`
4. Write plan crosslink to `Plans/emergency-section-hero-plan.md`

### Example 2: Write a Decision Log

```
/obsidian-ops "write — decision log for decide-animation-library-framer"
```

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "write_note",
    "arguments": {
      "path": "Projects/Nexgen Electrical Innovations/Decisions/decide-animation-library-framer.md",
      "content": "# Decision: decide-animation-library-framer\n\n## Choice\nUse Framer Motion..."
    }
  }'
```

### Example 3: Search for Prior Context

```
/obsidian-ops "search — hero section animation"
```

Returns all matching notes, giving context about prior decisions and patterns before starting work.

## Offline Fallback

If Obsidian is offline:

1. Write `pending_obsidian_sync: ENTITY_NAME` as an observation on the Docker project state entity
2. Continue the session without blocking
3. At next session start, the orchestrator checks for `pending_obsidian_sync` observations and retries

This ensures no data is lost when Obsidian is temporarily unavailable.

## Integration

- **Invoked by:** `plan-sync` (mandatory Step 6 — mirrors plan to Obsidian), `session-lifecycle end` (optional session note), `obsidian-second-brain` (uses this proxy for REST calls)
- **Never replaces:** Docker memory — Obsidian is the long-form readable archive; Docker is the structured session store
- **Vault repo:** `https://github.com/Herman-Adu/obsidian-vault` (sibling repo at `C:\Users\herma\source\repository\obsidian-vault\`)

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Obsidian offline | Log `pending_obsidian_sync: ENTITY_NAME` to Docker project state; skip gracefully |
| Docker proxy not running | Run `docker compose -f docker-compose.mcp.yml up --no-deps -d obsidian`; retry health check |
| Note path has spaces | URL-encode spaces: `Daily Notes/` → `Daily%20Notes/` in REST paths |
| Write fails (404) | Parent folder may not exist — create note in root first, then move in Obsidian |

## When NOT to Use

- Do NOT use Obsidian as primary session memory — Docker is always primary
- Do NOT block work on Obsidian availability — log pending_obsidian_sync and continue
- For structured entities and session rehydration, use `knowledge-memory` (Docker) not this skill

## Related Files

- **SKILL.md:** `.claude/skills/obsidian-ops/SKILL.md` — full execution instructions with REST examples
- **Related skill:** `obsidian-second-brain` — full vault integration (daily notes, research, decisions, sessions)
- **Related skill:** `plan-sync` — calls obsidian-ops as its final step
- **Docker compose:** `docker-compose.mcp.yml` — Obsidian proxy service definition
