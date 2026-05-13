---
name: obsidian-ops
description: Use this skill WHENEVER you need to write notes to the Obsidian vault, sync feature documentation, search Obsidian for context, create linked notes, or mirror Docker memory to Obsidian. Trigger phrases: "save to Obsidian", "write a note", "sync to vault", "Obsidian note", "mirror to Obsidian", "document in vault".
argument-hint: "[write | search | sync-feature | mirror-plan]"
disable-model-invocation: true
---

# Obsidian Ops

Reads and writes to the Obsidian vault via the Docker-hosted `obsidian` MCP proxy.

## Health check

```bash
curl -s http://localhost:3100/obsidian/health
```

Response: `{"status":"ok","obsidian":"online"}` = ready.
Response: `{"obsidian":"offline"}` = Obsidian desktop app not running. Open Obsidian first.

## Writing a note

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "write_note", "arguments": {"path": "PATH/IN/VAULT.md", "content": "..."}}'
```

## Searching the vault

```bash
curl -s -X POST http://localhost:3100/obsidian/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "search", "arguments": {"query": "SEARCH_TERM"}}'
```

## Mirroring a feature to Obsidian (standard pattern)

When syncing a feature from Docker memory to Obsidian:

1. Search Docker for the feature entity: `mcp__memory__search_nodes` with entity name
2. Build note content from observations
3. Write to `Projects/nexgen-electrical-innovations/FEATURE_NAME.md`
4. Write cross-linked plan to `Plans/FEATURE_NAME-plan.md`

## Offline fallback

If Obsidian is offline, write `pending_obsidian_sync: ENTITY_NAME` as an observation on the Docker project state entity. The orchestrator checks this at next session start and retries.
