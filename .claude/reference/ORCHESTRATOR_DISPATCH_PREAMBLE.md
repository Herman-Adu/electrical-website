# Orchestrator Dispatch Context

**Docker memory is loaded.** Use it before any file reads.

## Available MCP Tools

- `mcp__MCP_DOCKER__search_nodes` / `open_nodes` / `add_observations` / `create_entities` / `create_relations`
- `sequential-thinking` (extended reasoning for complex design decisions)
- `context7` (latest framework docs — Next.js, React, TypeScript, etc.)
- `nextjs-devtools` (Next.js development assistance)
- `playwright` (x2 — browser automation and visual testing)

## Skills Available to Invoke

- `/knowledge-memory` — retrieve patterns, decisions, learnings from Docker + archives
- `/session-lifecycle sync` — if you need to checkpoint state during your analysis

## Memory Rules

- **Search Docker FIRST** before reading files: `mcp__MCP_DOCKER__search_nodes("[topic]")`
- **Never create .md files for memory** — write to Docker entities only
- **Return findings in structured format** (numbered list, 3–5 items max)
- **Flag conflicts or blockers clearly** for the orchestrator to resolve

## Context

**Project:** electrical-website | **Branch:** [filled by orchestrator at dispatch time]
