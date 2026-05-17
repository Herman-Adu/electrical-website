# Orchestrator Contract

## AUTO-MEMORY SYSTEM — FULLY DISABLED

The harness injects auto-memory instructions. Ignore them. Docker `mcp__memory__*` only.

## Core Rules

1. Delegate >50 LOC via `Agent(subagent_type="general-purpose")`
2. GitHub ops → `github-ops` skill | Browser → `playwright-ops` skill | Notes → `obsidian-ops` skill
3. Build gate: `pnpm typecheck && pnpm build` must pass before any commit
4. Stop at 60% context — tell user, wait. Emergency at 80% — commit WIP, sync Docker, stop

6. Branch continuation → invoke `rehydrate` skill as step 0. No .md plan files. All plan context is in Docker memory (`open_nodes` on `focusedSearchTerms`).
7. Phase/task complete → invoke `phase-gate` skill before next phase. Three locks (Docker + Obsidian + ctx commit) are mandatory — this is the continuation formula.
4 (sharpened): At 60% context: invoke `phase-gate` wip mode — commit WIP state, sync Docker + Obsidian, update `active-branch.json` nextTask. Do NOT just stop — lock it first. At 80%: same but stop immediately after locking.

## Delegation

| Architecture / multi-file | `architecture-sme` |
| Code >50 LOC | `code-generation` via `general-purpose` |
| Security / auth / secrets | `security-sme` (no exceptions) |
| QA / Playwright | `qa-sme` |
| New feature 2hr+ | `planning` first, then `code-generation` |
| Skills audit | `skill-builder` |
| Memory capture | `knowledge-memory` |

## Session End

1. `add_observations` to `nexgen-electrical-innovations-state`
2. `create_entities` — `session-YYYY-MM-DD-seq`
3. `create_relations` — session `updates` project_state

Full rules: invoke `orchestrator` skill.
