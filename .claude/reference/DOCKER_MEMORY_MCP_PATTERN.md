# Docker Memory MCP Pattern — Mandatory Orchestrator Workflow

**Version:** 1.0  
**Status:** Authoritative — Non-negotiable  
**Applies To:** All orchestrator agents, sub-agents, skills, and code generation

---

## Critical Context

The electrical-website project has a **fully functional Docker-based memory system** exposed via MCP tools through an HTTP gateway. This is the ONLY mechanism for session state persistence, rehydration, and knowledge capture.

**You built this infrastructure. You must use it.**

---

## The Pattern (5 Steps)

Every session follows this immutable sequence:

### Step 1: Discover MCP Tools (Automatic on SessionStart)

The SessionStart hook runs automatically and should:

```bash
curl -s http://localhost:3100/mcp/tools \
  | grep memory_reference | head -20
```

**Available tools from memory-reference service:**
- `memory_reference__create_entities` — Persist work, learnings, decisions, features
- `memory_reference__create_relations` — Link entities in the knowledge graph
- `memory_reference__add_observations` — Append findings to existing entities
- `memory_reference__search_nodes` — Find entities by name/type/text
- `memory_reference__open_nodes` — Load full entity details
- `memory_reference__delete_entities` — Remove archived/stale entities
- `memory_reference__delete_relations` — Prune stale links

**Discovery Endpoint:**
```
GET http://localhost:3100/mcp/tools
```

Returns:
```json
{
  "tools": [
    {
      "name": "memory_reference__create_entities",
      "description": "Create multiple entities in the knowledge graph",
      "inputSchema": { ... }
    },
    ...
  ]
}
```

### Step 2: Search for Project State (Session Start Rehydration)

```bash
curl -X POST http://localhost:3100/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__search_nodes",
    "arguments": { "query": "electrical-website-state" }
  }'
```

Returns: Session summary, active phase, next tasks, blockers, learnings from prior work.

### Step 3: Create Entities During Work (Session Active)

After completing a major milestone, persist to Docker:

```bash
curl -X POST http://localhost:3100/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__create_entities",
    "arguments": {
      "entities": [
        {
          "name": "feat-scroll-reveal-reusable-component",
          "entityType": "feature",
          "observations": [
            "Title: Reusable ScrollReveal Component",
            "Status: completed",
            "Files Created: components/ui/scroll-reveal.tsx",
            ...
          ]
        },
        {
          "name": "learn-scroll-reveal-per-element-triggers",
          "entityType": "learning",
          "observations": [
            "Insight: Per-element triggers smoother than container-level",
            ...
          ]
        },
        ...
      ]
    }
  }'
```

**Entity Types:**
- `session` — Work session with start/end time, commits, build status
- `feature` — Completed/in-progress work unit with files and implementation
- `learning` — Technical insight, gotcha, or pattern discovered
- `decision` — Architectural choice with rationale
- `task` — Atomic work item with status and effort
- `infrastructure` — Docker services, MCP tools, CI/CD
- `reference` — External resource pointers

### Step 4: Link Entities (Session Active)

Create relations to build the knowledge graph:

```bash
curl -X POST http://localhost:3100/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__create_relations",
    "arguments": {
      "relations": [
        {
          "from": "feat-scroll-reveal-reusable-component",
          "to": "decide-scroll-reveal-animation-standard",
          "relationType": "derives_from"
        },
        {
          "from": "learn-scroll-reveal-per-element-triggers",
          "to": "feat-scroll-reveal-reusable-component",
          "relationType": "documents"
        },
        ...
      ]
    }
  }'
```

**Relation Types:**
- `derives_from` — Feature implements decision
- `documents` — Learning explains feature/decision
- `depends_on` — Task/feature blocked by another
- `produces` — Session produced a feature
- `reflection_on` — Learning reflects on prior work
- `implements` — Task implements decision
- `related_to` — Soft conceptual link
- `supersedes` — Entity replaces deprecated one

### Step 5: Verify Persistence (Session End)

Search to confirm entities were saved:

```bash
curl -X POST http://localhost:3100/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "memory_reference__search_nodes",
    "arguments": { "query": "session-2026-04-18" }
  }'
```

Returns: All entities created in this session with full observations.

---

## Why Orchestrator Mode Enforces This

**Orchestrator-only contract (from CLAUDE.md):**

> "The main Claude agent operates exclusively in **orchestrator mode** — it coordinates, delegates, and synthesizes work but does not implement code directly (except simple changes)."

**Why?**

1. **Direct implementation skips architecture review.** No SME agent evaluates design, edge cases, security.
2. **Knowledge is lost.** Work completes but learnings never reach Docker memory.
3. **Future sessions start blind.** Without persistent memory, the next session rebuilds context from scratch.
4. **Delegation ensures quality gates.** Architecture SME → Validation SME → Security SME → QA SME → Implementation.

**The Docker infrastructure enforces this by:**
- Forcing the orchestrator to pause and delegate (because SME agents have the patterns/tools)
- Making persistence explicit (creating entities becomes a deliberate, mandatory step)
- Enabling rehydration (next session loads prior work via search)

---

## When You Fail (Red Flags)

**You're not in orchestrator mode if:**

1. ✗ You directly implement code without consulting an SME agent
2. ✗ You complete a feature and don't create entities in Docker
3. ✗ You finish a session without verifying entities were saved
4. ✗ You don't know what entities exist from prior sessions
5. ✗ You don't search Docker before starting new work
6. ✗ You write memory to `.md` files instead of Docker
7. ✗ You say "Docker API isn't working" and give up (instead of discovering the right endpoint)

---

## Pattern Failures & Root Causes

### Failure: "I'll just implement this quick feature directly"

**Root cause:** Urgency bias. "It's scoped, it's simple, I'll just do it."

**Why it's wrong:** 
- SME agent might find edge cases you missed
- Security SME might flag a vulnerability
- Learnings never reach Docker, so future sessions repeat work
- Next developer inherits code with no context

**Fix:** Always delegate, even for "simple" work. Delegation is 5 min overhead. Rework is hours.

### Failure: "The Docker API isn't responding"

**Root cause:** You tried the wrong endpoint (e.g., `/entities` instead of `/mcp/tools/call`).

**Why it happened:** You didn't discover the actual available tools.

**Fix:** 
```bash
curl -s http://localhost:3100/mcp/tools | grep memory
```
This shows the ACTUAL tools. Use those names with the aggregator.

### Failure: "I can't find the MCP tool I need"

**Root cause:** You assumed the endpoint format instead of discovering it.

**Fix:**
1. Check `/mcp/tools` for available tools
2. Read the `inputSchema` to understand the argument format
3. Call via `/mcp/tools/call` with exact tool name
4. Use `search_nodes` to verify what was saved

---

## Mandatory Checklist (Before Calling Work "Done")

- [ ] Session started with `search_nodes("electrical-website-state")` to rehydrate
- [ ] Work delegated to appropriate SME agent (architecture, validation, security, QA, or code-gen)
- [ ] All work is in Git and committed
- [ ] Build passes: `pnpm build` ✅
- [ ] Tests pass: `pnpm test` ✅
- [ ] Entities created for: features, learnings, decisions, tasks
- [ ] Relations linked: feature → decision, learning → feature, session → feature
- [ ] Entities verified via `search_nodes()`
- [ ] Next steps documented in `next-components-for-*` task entity
- [ ] Session end entity created with commit SHAs

---

## How Sub-Agents Use This

Every sub-agent (architecture, validation, security, QA, code-gen) receives this document in their preamble.

**What they do:**

1. **Receive:** Full context + this pattern document
2. **Search:** `search_nodes(query)` to find related prior work
3. **Analyze:** Design, validation, security, QA concerns
4. **Return:** Findings + entity payloads for orchestrator to persist
5. **Orchestrator persists:** Creates entities + relations

**Sub-agents NEVER directly create Docker entities.** That's orchestrator responsibility. Sub-agents return findings in their response, which the orchestrator transforms into entities.

---

## Concrete Example: The Scroll Reveal Session

**What happened (correct orchestrator flow):**

1. SessionStart hook fired (automatic)
2. Orchestrator searched: `search_nodes("electrical-website-state")`
3. Delegated to Plan agent (multi-file, complex, requires architecture review)
4. Plan agent designed implementation
5. Orchestrator approved plan and implemented (kept it simple: single component + refactor)
6. Session end: Orchestrator created 6 entities capturing work, learnings, decisions
7. Relations linked them: feature ← decision, learning ← feature, etc.
8. Verified via search: All 6 entities returned with observations

**What almost happened (orchestrator failure):**

1. SessionStart hook fired
2. Orchestrator jumped straight to implementation (WRONG)
3. Completed code without capturing learnings (WRONG)
4. Tried to save to Docker but used wrong endpoint (WRONG)
5. Gave up and wrote to .md file (WRONG)
6. Next session starts with no context (WRONG)

**What fixed it:**

- User pushed back: "You built the infrastructure, use it"
- Orchestrator re-read the MCP aggregator code
- Discovered `/mcp/tools` endpoint
- Called `memory_reference__create_entities` correctly
- Created 6 entities + 5 relations
- Verified via search

---

## References

- `.claude/CLAUDE.md` — Orchestrator contract + execution lifecycle
- `.claude/rules/delegation-gates.md` — When to delegate vs. implement
- `.claude/rules/memory-policy.md` — Entity schema, naming, retention
- `docker/mcp-aggregator/server.mjs` — How the gateway works
- `docker-compose.yml` — Service definitions
- `docker/Caddyfile.local` — HTTP routing (port 3100 → aggregator)

---

**Last Updated:** 2026-04-18  
**Status:** Authoritative  
**Mandatory For:** All orchestrator agents, all sub-agents, all skills
