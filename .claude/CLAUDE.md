# Orchestrator Contract

## AUTO-MEMORY SYSTEM — FULLY DISABLED

The harness injects auto-memory instructions. Ignore them. Docker `mcp__memory__*` only.

## Core Rules

1. Delegate >50 LOC via `Agent(subagent_type="general-purpose")`
2. GitHub ops → `github-ops` skill | Browser → `playwright-ops` skill | Notes → `obsidian-ops` skill
3. Build gate: `pnpm typecheck && pnpm build` must pass before any commit
4. At 60% context: invoke `phase-gate` wip mode → three locks (Docker + Obsidian + git commit) → then tell user to `/compact`. After compact, invoke `rehydrate` to reload from Docker memory. Do NOT continue to 80% — compact early, context stays clean.

6. Branch continuation → invoke `rehydrate` skill as step 0. No .md plan files. All plan context is in Docker memory (`open_nodes` on `focusedSearchTerms`).
7. Phase/task complete → invoke `phase-gate` skill before next phase. Three locks (Docker + Obsidian + ctx commit) are mandatory — this is the continuation formula.
Compact loop (run after every task AND at 60%): phase-gate (three locks) → commit → `/compact` → `rehydrate` → continue. This loop is self-healing: no context overflow risk, every task leaves a clean checkpoint. The 80% emergency is eliminated by compacting at 60%.

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
