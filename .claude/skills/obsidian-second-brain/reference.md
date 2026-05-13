---
title: Obsidian ↔ Docker Mirroring Patterns
description: Reference patterns for mirroring Docker memory entities to Obsidian and linking session notes back to Docker
category: reference
status: active
last-updated: 2026-05-13
---

# Obsidian ↔ Docker Mirroring Patterns

## Pattern: Mirror a Docker Decision to Obsidian

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
  "http://localhost:27124/vault/Projects/Nexgen%20Electrical%20Innovations/Decisions/decide-auth-strategy-clerk.md" \
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

## Pattern: Link a Session Note Back to Docker

After creating a session entity in Docker, link it from the Obsidian session note:

```bash
# Append Docker link to existing session note
curl -s -X POST \
  "http://localhost:27124/vault/Projects/Nexgen%20Electrical%20Innovations/Sessions/session-2026-04-29-001.md" \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  -H "Content-Type: text/plain" \
  --data-raw "
## Docker Memory
Entity: \`session-2026-04-29-001\`
Load: \`pnpm docker:mcp:memory:open session-2026-04-29-001\`"
```

## Content Storage Matrix

| Content type | Store in | Why |
|---|---|---|
| Long-form research | Obsidian only | Markdown + backlinks, not queryable by LLM |
| Structured decisions | Docker entity + Obsidian mirror | Queryable (Docker) + human-readable (Obsidian) |
| Daily notes / journals | Obsidian only | Chronological; not suitable as Docker entities |
| Session handoffs | Docker entity (primary) + Obsidian link | Rehydration is Docker-first |
| Code patterns / gotchas | Docker `learn-*` entity | Searchable by LLM; keep Obsidian mirror optional |
| Session state mid-work | Docker `add_observations` only | Never write mid-session state to Obsidian |
