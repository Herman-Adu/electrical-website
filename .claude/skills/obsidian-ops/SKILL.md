---
name: obsidian-ops
description: Use this skill WHENEVER you need to write notes to the Obsidian vault, sync feature documentation, search Obsidian for context, create linked notes, or mirror Docker memory to Obsidian. Trigger phrases: "save to Obsidian", "write a note", "sync to vault", "Obsidian note", "mirror to Obsidian", "document in vault".
argument-hint: "[write | search | sync-feature | mirror-plan]"
disable-model-invocation: true
---

# Obsidian Ops

Reads and writes to the Obsidian vault via the Docker-hosted `obsidian` MCP proxy.

## CRITICAL — Vault path structure

**ALL nexgen notes MUST go inside `Projects/Nexgen Electrical Innovations/`.**
Never write to vault root. Never use lowercase or hyphenated project folder names.

| Note type | Correct path |
|-----------|-------------|
| Sessions  | `Projects/Nexgen Electrical Innovations/Sessions/session-YYYY-MM-DD-NNN.md` |
| Plans     | `Projects/Nexgen Electrical Innovations/Plans/plan-FEATURE-NAME.md` |
| Features  | `Projects/Nexgen Electrical Innovations/Features/feat-FEATURE-NAME.md` |
| Learnings | `Projects/Nexgen Electrical Innovations/Learnings/learn-TOPIC.md` |
| Decisions | `Projects/Nexgen Electrical Innovations/Decisions/decide-TOPIC.md` |
| Architecture | `Projects/Nexgen Electrical Innovations/Architecture/TOPIC.md` |

**Wrong:** `sessions/`, `plans/`, `Projects/nexgen-electrical-innovations/`
**Right:** `Projects/Nexgen Electrical Innovations/Sessions/`

## Health check

The health endpoint may return `"obsidian":"offline"` even when Obsidian IS running.
**Do not trust the health check.** Always attempt the write directly using `mcp__MCP_DOCKER__obsidian_append_content`. If it succeeds, Obsidian is online.

```bash
curl -s http://localhost:3100/obsidian/health
```

## Writing a note — use MCP tools directly

Use `mcp__MCP_DOCKER__obsidian_append_content` (creates or appends):
- `filepath`: path relative to vault root (always start with `Projects/Nexgen Electrical Innovations/`)
- `content`: markdown content

Use `mcp__MCP_DOCKER__obsidian_get_file_contents` to read.
Use `mcp__MCP_DOCKER__obsidian_delete_file` to delete (requires `confirm: true`).
Use `mcp__MCP_DOCKER__obsidian_list_files_in_dir` to list.
Use `mcp__MCP_DOCKER__obsidian_simple_search` to search.

## Mirroring a feature to Obsidian (standard pattern)

When syncing a feature from Docker memory to Obsidian:

1. Search Docker for the feature entity via HTTP or `mcp__MCP_DOCKER__search_nodes`
2. Build note content from observations
3. Write to `Projects/Nexgen Electrical Innovations/Features/feat-FEATURE-NAME.md`
4. Write cross-linked plan to `Projects/Nexgen Electrical Innovations/Plans/plan-FEATURE-NAME.md`

## Offline fallback

If writes fail, write `pending_obsidian_sync: ENTITY_NAME` as an observation on the Docker project state entity. The orchestrator retries at next session start.
