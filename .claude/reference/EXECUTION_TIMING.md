---
title: Execution Timing & Resource Expectations
description: Latency, resource costs, and timing allocation for orchestrator agents and skills
category: reference
status: active
last-updated: 2026-04-16
---

# Execution Timing & Resource Expectations

## Agent Latency & Resource Cost

| Agent | Typical Latency | Resource Cost | When to Use |
|-------|-----------------|----------------|------------|
| **Architecture SME** | 2–5 min | Medium (reasoning) | Structural decisions, API design |
| **Validation SME** | 1–3 min | Low (simple checks) | Schema design, error handling |
| **Security SME** | 2–5 min | Medium (reasoning) | Auth, secrets, input validation |
| **QA SME** | 1–3 min | Low (test planning) | Test coverage, edge cases |
| **Planning Agent** | 2–10 min | Low-Medium | Task breakdown, estimation, risks |
| **Code-Gen Agent** | 5–30 min | High (code synthesis) | Implementation, TDD, refactoring |

## Task Execution Timeline (Typical Feature)

| Phase | Time | Activity |
|-------|------|----------|
| **Preflight** | 5 min | Load memory, check git status, review standards |
| **Analysis** | 15–30 min | Run 4 SME agents in parallel |
| **Synthesis** | 10–15 min | Combine findings, resolve conflicts, create plan |
| **Implementation** | 30–60 min | Execute plan, delegate complex tasks, verify gates |
| **Verification** | 5–10 min | Typecheck, build, test, security review |
| **Sync** | 5 min | Update memory, document decisions, close task |

**Total:** 60–120 min for a complete feature using orchestrator pattern.

## Parallel Execution Safety

✅ **All 4 SME agents are independent and parallel-safe**
- Run simultaneously to save ~15 min per task
- Collect all findings before synthesis phase
- No blocking dependencies between agents

✅ **Planning agent is reusable**
- Can be dispatched for estimation without full analysis

⚠️ **Code-Gen agent is sequential**
- Depends on synthesis plan
- Run after all other agents complete

## Cost Optimization

**Run 4 SME agents in parallel:** 15–30 min (instead of 30–60 min sequential)

**Skip delegation for simple tasks:**
- Single-file, <50 lines, obvious intent → direct implementation OK
- No agent dispatch needed for bug fixes <30 min

**Reuse planning agent:**
- Multiple features can share same planning output
- Planning is domain-agnostic and reusable
