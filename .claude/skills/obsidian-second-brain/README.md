# Obsidian Second Brain Skill

Platinum-standard Obsidian vault integration: read notes, write daily notes, capture decisions and learnings in human-readable markdown, and mirror Docker memory entities to the vault — all via the Local REST API plugin.

## When to Use

Use this skill WHENEVER you need rich, long-form vault interaction during a Claude Code session. It covers four distinct vault workflows: daily journalling, research scratch, decision mirroring, and context loading.

**Trigger phrases:**
- "Open my vault" / "Write to Obsidian"
- "Create today's daily note"
- "Capture this decision in Obsidian"
- "Append to research notes"
- "Sync this to Obsidian" / "Mirror to Obsidian"
- "Search my notes" / "Check what's in my vault"
- "Create a decision log"
- `/obsidian-second-brain [daily-note|create|read|search|append|capture|sync-to-docker]`

## Obsidian vs Docker Memory

Obsidian and Docker memory serve different roles and must never replace each other.

| Content type | Store in | Why |
|-------------|---------|-----|
| Long-form research | Obsidian only | Rich markdown + backlinks, not LLM-queryable |
| Structured decisions | Docker entity + Obsidian mirror | Queryable (Docker) + human-readable (Obsidian) |
| Daily notes / journals | Obsidian only | Chronological; not suitable as Docker entities |
| Session handoffs | Docker primary + Obsidian link | Rehydration is Docker-first |
| Code patterns / gotchas | Docker `learn-*` entity | Searchable by LLM |
| Mid-session state | Docker `add_observations` only | Never write mid-session to Obsidian |

**Docker is always primary for session rehydration.** Obsidian is the long-form human-readable complement.

## Prerequisites

- Obsidian running with the **Local REST API** community plugin enabled (port 27124)
- `OBSIDIAN_API_KEY=<your-key>` in `.env.local`
- Vault at `C:\Users\herma\source\repository\obsidian-vault\` (sibling to this repo)

**Health check:**
```bash
source .env.local && \
curl -sf http://localhost:27124/ \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  && echo "READY" || echo "CHECK OBSIDIAN + PLUGIN"
```

## Operations

### Layer 1 — CRUD

| Operation | Method | Path |
|-----------|--------|------|
| List all notes | `GET` | `/vault/` |
| Read a note | `GET` | `/vault/{path}` |
| Create/overwrite note | `PUT` | `/vault/{path}` |
| Append to note | `POST` | `/vault/{path}` |
| Delete a note | `DELETE` | `/vault/{path}` |
| Full-text search | `POST` | `/search/simple/?query=TERM` |
| Open in Obsidian UI | `POST` | `/open/{path}` |

All requests use `Authorization: Bearer $OBSIDIAN_API_KEY`. URL-encode spaces in paths.

### Layer 2 — Daily Notes and Session Notes

**Daily note** (create or append to today's work journal):

```bash
DATE=$(node -e "console.log(new Date().toISOString().slice(0,10))")
# Path: Projects/Nexgen Electrical Innovations/Daily Notes/${DATE}.md
```

Structure: Work (branch + commits), Decisions, Learnings, Next.

**Session note**: mirrors the Docker `session-YYYY-MM-DD-NNN` entity into `Sessions/session-YYYY-MM-DD-NNN.md`.

**Decision log**: human-readable mirror of a Docker `decide-*` entity at `Decisions/decide-{name}.md`.

**Research scratch**: long-form research appended to `Research/{topic}.md`.

### Layer 3 — Context Loading at Session Start

Load order (Docker is primary, Obsidian is secondary):
1. Docker memory: `pnpm docker:mcp:memory:search` + `pnpm docker:mcp:memory:open` (required)
2. Obsidian vault: search → read project note → read today's daily note (optional)
3. Git state: `git status && git log --oneline -5`

If Obsidian is OFFLINE at session start: skip vault steps and note it. Never block session startup on vault availability.

### Layer 4 — Docker Memory Bridge

Mirror a Docker decision to Obsidian (standard pattern):
```
1. Create Docker entity via knowledge-memory or mcp-memory-call.mjs
2. Write Obsidian mirror: PUT /vault/Projects/Nexgen.../Decisions/decide-NAME.md
```

The Obsidian note includes frontmatter `dockerEntity:` for cross-referencing.

## Usage Examples

### Example 1: Create Today's Daily Note

```
/obsidian-second-brain daily-note
```

Creates `Projects/Nexgen Electrical Innovations/Daily Notes/2026-05-13.md` with sections for Work, Decisions, Learnings, and Next.

### Example 2: Mirror a Decision

```
/obsidian-second-brain capture — decision: decided to use Clerk for auth
```

1. Creates `decide-auth-strategy-clerk` Docker entity via `knowledge-memory`
2. Mirrors to `Projects/Nexgen Electrical Innovations/Decisions/decide-auth-strategy-clerk.md`
3. Obsidian note includes `dockerEntity: decide-auth-strategy-clerk` frontmatter

### Example 3: Append Research Notes

```
/obsidian-second-brain append — topic: memory-lane-architecture
```

Appends long-form notes to `Research/memory-lane-architecture.md` — too verbose for a Docker observation, perfect for Obsidian.

### Example 4: Search the Vault

```
/obsidian-second-brain search — "hero section animation"
```

```bash
curl -s -X POST \
  "http://localhost:27124/search/simple/?query=hero+section+animation&contextLength=200" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY"
```

Returns matching notes with surrounding context, giving prior-session context before starting work.

## Vault Path Conventions

| Content | Path |
|---------|------|
| Daily notes | `Projects/Nexgen Electrical Innovations/Daily Notes/YYYY-MM-DD.md` |
| Session notes | `Projects/Nexgen Electrical Innovations/Sessions/session-YYYY-MM-DD-NNN.md` |
| Decision logs | `Projects/Nexgen Electrical Innovations/Decisions/decide-NAME.md` |
| Feature docs | `Projects/Nexgen Electrical Innovations/FEATURE_NAME.md` |
| Research | `Research/{topic}.md` |
| Learning mirrors | `Learnings/learn-{kebab-name}.md` |

## Prohibitions

- Never store Docker session entity content verbatim in Obsidian
- Never use Obsidian as the primary session rehydration source — Docker is always primary
- Never hard-fail on Obsidian OFFLINE — warn and continue
- Never log or expose the value of `OBSIDIAN_API_KEY`
- Never write daily notes or journals as Docker entities
- Never create Obsidian notes for mid-session state

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Obsidian OFFLINE | Warn user: "Obsidian must be running." Log warning and continue without vault ops |
| API key missing | Check `OBSIDIAN_API_KEY` in `.env.local`; reference variable name only |
| Path not found (404) | Check URL encoding of spaces; verify vault structure |
| Plugin not enabled | Open Obsidian Settings > Community Plugins > enable Local REST API |

## Integration

- **Works alongside:** `obsidian-ops` (thin proxy with less structure), `knowledge-memory` (Docker entities)
- **Invoked by:** `session-lifecycle end` (optional — creates session note), `plan-sync` (via obsidian-ops)
- **Related skill:** `obsidian-ops` — simpler proxy used by `plan-sync` for direct write/search
- **Vault repo:** `https://github.com/Herman-Adu/obsidian-vault`

## Related Files

- **SKILL.md:** `.claude/skills/obsidian-second-brain/SKILL.md` — full operation reference with curl examples
- **Knowledge Memory Skill:** `.claude/skills/knowledge-memory/SKILL.md` — Docker entity creation patterns
- **Session Lifecycle Skill:** `.claude/skills/session-lifecycle/SKILL.md` — session start/sync/end workflow
- **Docker Memory Policy:** `.claude/rules/memory-policy.md` — entity types and observation schema
