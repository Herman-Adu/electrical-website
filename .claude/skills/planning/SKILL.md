---
name: planning
description: Use this skill WHENEVER breaking down goals into tasks, creating implementation roadmaps, estimating effort, defining milestones, or sequencing work. Trigger on: "how should I approach", "what's the plan", "in what order", "how long will this take", "what are the steps". Always precedes code-generation for features 2hr+.
argument-hint: "[goal or feature to plan]"
disable-model-invocation: true
---

# Planning Skill

## Session Preflight

1. `pnpm docker:mcp:memory:search "electrical-website-state"` — load project state
2. `pnpm docker:mcp:memory:open electrical-website-state` — read active phase, blockers, next tasks
3. `git log --oneline -5 && git status` — confirm code state

---

## Planning Workflow

1. **Understand scope** — read current Docker state, clarify requirements, identify edge cases
2. **Research** (if needed) — use Context7 for library docs:
   - `mcp__plugin_context7_context7__resolve-library-id` → get library ID
   - `mcp__plugin_context7_context7__query-docs` → fetch relevant docs
3. **Design** — component hierarchy, data flow, API surface, test structure
4. **Sequence** — order tasks by dependency, estimate effort per task
5. **Output** — write plan inline AND persist as Docker entity (see below)
6. **Delegate** — for implementation: `Agent(subagent_type="general-purpose", prompt="...")` → spawns code-generation

## Plan Output Format

Every plan includes:
- **Context:** why this change is needed, what problem it solves
- **Approach:** recommended implementation (one option, not all alternatives)
- **Files:** specific files to create/modify with line-level detail where needed
- **Reuse:** existing utilities/patterns to leverage (search codebase first)
- **Sequence:** ordered steps, each 2hr or less to implement
- **Verification:** how to test end-to-end

---

## Docker Persistence

After generating a plan, create a Docker entity:

```
node scripts/mcp-memory-call.mjs create_entities '{
  "entities": [{
    "name": "plan-[domain]-[goal]",
    "entityType": "plan",
    "observations": [
      "Goal: [one line description]",
      "Approach: [summary]",
      "Files affected: [list]",
      "Sequence: [ordered steps]",
      "Status: draft"
    ]
  }]
}'
```

Then link it:

```
node scripts/mcp-memory-call.mjs create_relations '{
  "relations": [{
    "from": "plan-[domain]-[goal]",
    "to": "electrical-website-state",
    "relationType": "derives_from"
  }]
}'
```

Never write plans to `archives/plans/*.md` or `context/*.md` — Docker entities only.

---

## Agent Dispatch Pattern

For implementation after planning:
- `Agent(subagent_type="general-purpose")` → spawns specialised agents (code-generation, architecture-sme, etc.)
- Never implement code directly in this skill
- For large features: plan → architecture-sme review → code-generation

---

## Best Practices

- Read Docker state first — understand active phase and existing decisions before planning
- Search for existing patterns before designing new ones (grep codebase)
- One plan per Docker entity — no plan archives in .md files
- Plans expire — update Docker entity status when implementation begins
- Surface assumptions as questions to user before committing to approach
