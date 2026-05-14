# MCP Invocation — Authoritative Reference

## Port Map

| Port | Service | What it is |
|------|---------|-----------|
| `localhost:3100` | Caddy gateway | Entry point to ALL Docker MCP services |
| `localhost:3000` | Next.js dev server | Application only — no MCP services |

Never use port 3000 for MCP operations. Never confuse these two.

## Tool Namespaces — What Works

| Service | Primary MCP tool | Curl fallback path |
|---------|-----------------|-------------------|
| Memory (knowledge graph) | `mcp__memory__*` | `curl localhost:3100/memory/tools/call` |
| GitHub | `mcp__MCP_DOCKER__github_official__*` | `curl localhost:3100/github/tools/call` |
| Obsidian | `mcp__MCP_DOCKER__obsidian_*` | `curl localhost:3100/obsidian/tools/call` |
| Playwright | `mcp__MCP_DOCKER__playwright__*` | `curl localhost:3100/playwright/tools/call` |

**`mcp__MCP_DOCKER__memory_reference__*` does not exist. Never reference it.**

## Curl Invocation Pattern

All Docker MCP services accept the same POST format:

```bash
curl -s -X POST http://localhost:3100/{service}/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"tool_name","arguments":{...}}'
```

Health check for any service:
```bash
curl -s http://localhost:3100/memory/health
curl -s http://localhost:3100/health
```

## Fail-Fast Rule

1. Try the primary MCP tool once.
2. If it fails: go immediately to the curl fallback. Do not try a different MCP namespace. Do not retry the same tool.
3. If curl also returns non-200 or connection refused: STOP. Tell the user the exact error. Offer options: restart Docker or skip. Never guess, never silently proceed.

## Bring-User-In Trigger

If any memory operation fails after the curl fallback:

> "Memory service error: [exact error]. Options: (1) run `pnpm docker:mcp:ready` and I retry, (2) skip memory sync this session and note manually, (3) investigate the Docker logs."

Wait for user response. Do not decide unilaterally.

## Session End — Exact Sequence

```bash
# 1. Verify service is up
curl -s http://localhost:3100/memory/health

# 2. Update project state (use mcp__memory__add_observations or curl)
# 3. Create session entity (use mcp__memory__create_entities or curl)
# 4. Wire relations (use mcp__memory__create_relations or curl)
# 5. Verify — search for session entity to confirm it was written
curl -s -X POST http://localhost:3100/memory/search_nodes \
  -H "Content-Type: application/json" \
  -d '{"query":"session-YYYY-MM-DD"}'
```

Never claim memory sync is complete without a confirming response from step 5.
