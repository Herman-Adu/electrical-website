---
title: Error Recovery & Blocker Strategies
description: How to handle analysis conflicts, ambiguous requirements, build failures, and agent timeouts
category: reference
status: active
last-updated: 2026-04-16
---

# Error Recovery & Blocker Strategies

## Common Issues & Recovery Paths

| Issue | Root Cause | Recovery |
|-------|-----------|----------|
| **Analysis conflict** | Two or more SME agents provide conflicting recommendations (e.g., security vs. performance) | Document the trade-off explicitly, present options to user with reasoning, proceed with chosen path |
| **Ambiguous requirements** | User request is unclear or missing details | Synthesizer asks for clarification BEFORE proceeding to implementation |
| **Build gate fails** | Code doesn't compile or build errors occur | Investigate root cause (type error, module missing, syntax error), fix implementation, re-run gate |
| **Test fails** | Unit or integration tests fail after implementation | Debug with QA SME, identify root cause (logic error, edge case, missing mock), fix implementation, re-run |
| **Agent times out** | Agent dispatch exceeds latency SLA (>10 min) | Retry with reduced scope, or ask user for manual input to unblock |
| **Memory missing** | Session starts without prior context (new conversation) | Proceed without memory; capture learnings during this session for next time |

## Graceful Degradation

When dependencies fail:

1. **Report the failure clearly** — Include error message, affected step, context
2. **Suggest actionable recovery** — Provide specific steps to unblock
3. **Offer workaround** — Can we proceed without this agent/tool?
4. **Never silent-fail** — Always communicate blockers to user

## Delegation Retry Logic

If an agent fails:

- **First failure:** Log error, provide context to agent, retry once
- **Second failure:** Ask user for clarification or manual override
- **Persistent failure:** Escalate and document in session memory for future reference

## Build Gate Strategy

Before deploying code:

```bash
pnpm typecheck  # Strict TypeScript check
pnpm build      # Production build test
pnpm test       # Run test suite
```

If ANY gate fails:
1. Stop execution
2. Read error message carefully
3. Identify root cause (type mismatch, missing import, broken test)
4. Fix implementation
5. Re-run gate
6. Document fix in commit message

## No Bypass Policy

Never:
- Skip `pnpm typecheck` (types are contracts)
- Skip `pnpm build` (build can catch issues before production)
- Use `--no-verify` or other bypass flags
- Merge code with failing gates

Bypass requests are symptoms of deeper issues — investigate root cause instead.
