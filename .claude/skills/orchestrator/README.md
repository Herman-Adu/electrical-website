# Orchestrator Skill

Session startup and delegation router: loads project state, reports status, and enforces all code quality and delegation standards for the Nexgen Electrical Innovations project.

## When to Use

Invoke this skill at the START of every new Claude Code session. It is the single entry point for session startup — do not paste long prompts or try to reload context manually.

**Trigger phrases:**
- "Start session"
- "New session"
- "What were we doing?"
- "Resume work"
- "Where were we?"
- "What's the status?"
- "Load project state"
- `/orchestrator [optional: feature name or focus area]`

## How It Works

```
1. Invoke docker-preflight skill → reads Session Memory block, reports 3-bullet status
2. Run git log --oneline -5 && git status → show recent commits and working tree
3. Report git summary (branch, last commit, build/test status)
4. STOP — wait for user instruction
```

After startup, the orchestrator stays active as the rules enforcer for the entire session.

## Startup Report Format

After Steps 1–3, the orchestrator delivers:

```
[docker-preflight 3-bullet report]

Branch: feat/emergency-hero-copy | Last commit: abc1234 feat: add hero section
Build: passing | Tests: 142/142 passing
```

Then: **Do not proceed. Wait for user instruction.**

## Orchestrator Rules (Always Active After Startup)

### Delegation

Never implement code >50 LOC directly. Always delegate:

```
Agent(subagent_type="general-purpose", prompt="[full context + task]")
```

The general-purpose agent spawns specialized sub-agents as needed.

| Need | Delegate to |
|------|------------|
| Architecture / component design | `architecture-sme` |
| Code (>50 LOC) | `code-generation` via general-purpose |
| Security / auth | `security-sme` |
| QA / E2E testing | `qa-sme` |
| Planning (2hr+ features) | `planning` first, then `code-generation` |
| Skills audit | `skill-builder` |
| Docker memory capture | `knowledge-memory` |

### MCP First

| Task | Use | Never use |
|------|-----|-----------|
| GitHub PRs, merges, CI | `mcp__MCP_DOCKER__github_official__*` | `gh` CLI |
| Session memory | `mcp__MCP_DOCKER__memory_reference__*` | .md files |
| Browser testing | `mcp__MCP_DOCKER__playwright__*` + `PLAYWRIGHT_REUSE_SERVER=true` | Manual browser |

### Context Limits

- At 60%: Stop. Tell user. Wait for decision.
- At 80%: Emergency — commit WIP, sync Docker memory, then stop.

### Code Standards

Every agent prompt dispatched via `Agent(...)` must include:
- React 19 features first (`useTransition`, `useOptimistic`, `useActionState`, `useFormStatus`, `use()`, Server Components, Server Actions, Suspense, Error Boundaries, PPR, ISR)
- No `useEffect` when React 19 alternative exists — add comment if truly required
- Default to Server Components; `"use client"` only for browser interactivity
- All code generation uses Super Powers workflow: brainstorm → plan (TDD) → execute → verify
- Tests written before implementation

### Verification Gate

Before reporting any task done:
```bash
pnpm typecheck && pnpm build && pnpm test
```

### Plan-Sync Gate

Before dispatching any implementation agent, check:
```bash
cat C:\tmp\pending-plan-sync.txt 2>/dev/null
```

If a path is returned: run `plan-sync` skill with that path before proceeding. Clear the file after sync. Implementation cannot begin on an unsynced plan.

## Session End (Always)

Before ending any session:
1. `add_observations` to `nexgen-electrical-innovations-state` — branch, build, next tasks
2. `create_entities` — `session-YYYY-MM-DD-seq` entity
3. `create_relations` — session `updates` project_state

## Integration

- **First action of every session** — always invoked before any work begins
- **Invokes:** `docker-preflight` (startup), then delegates all real work via Agent tool
- **Enforces:** All project code standards and memory policies throughout the session
- **Contracts:** Full rules in `.claude/CLAUDE.md` (orchestrator contract)

## Example Session Flow

```
User: /orchestrator

Orchestrator:
→ docker-preflight: Branch: feat/hero-copy | Lane: active | Docker: online
→ Phase: Phase 5 | Build: passing | Next: implement hero headline A/B

git log:
→ abc123 feat: add emergency hero section
→ def456 fix: contact form timeout

Status: ready. What shall we work on?

---

User: Continue with the hero A/B component

Orchestrator:
→ Dispatches: Agent(subagent_type="general-purpose", prompt="Build A/B hero variant...")
→ Verification gate after implementation
→ Session end: Docker memory updated, session entity created
```

## Related Files

- **SKILL.md:** `.claude/skills/orchestrator/SKILL.md` — full execution steps and code standards
- **Contract:** `.claude/CLAUDE.md` — orchestrator contract and memory policy
- **Invokes:** `docker-preflight`, all SME agents, `code-generation`, `planning`, `skill-builder`
