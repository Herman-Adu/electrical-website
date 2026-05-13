---
title: Skill Builder — Governance Checks Reference
description: The 9/9 governance checks for the nexgen-electrical-innovations skill ecosystem
category: reference
status: active
last-updated: 2026-05-13
---

# Governance Standards: The 9/9 Checks

This 10-skill ecosystem enforces 9 governance checks. Run them manually via the checklist below to prevent quality debt and architectural decay:

| Check                          | What It Validates                                                  | Why It Matters                                                  |
| ------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| **1. Agent Location**          | All AGENT.md live in `.claude/agents/`, never in `.claude/skills/` | Prevents agent orphaning; enables central agent governance      |
| **2. Agent Pairs**             | Each agent has BOTH AGENT.md + README.md                           | Documentation completeness; prevents incomplete agents          |
| **3. Agent Delegation Syntax** | Agent calls use body text, not `agent:` frontmatter field          | Ensures proper invocation; prevents deprecated syntax           |
| **4. Skill Structure**         | Each skill has BOTH SKILL.md + README.md                           | Full documentation; prevents stubs                              |
| **5. Size Limits**             | All SKILL.md < 500 lines                                           | Enforces modularity; prevents bloat; indicates refactoring need |
| **6. Stale Paths**             | No dead links in AGENT.md files                                    | Prevents broken references; keeps documentation accurate        |
| **7. Script Existence**        | All scripts referenced in skills actually exist                    | Prevents runtime failures; catches missing files                |
| **8. Frontmatter Compliance**  | Only official Claude Code keys used (no unsupported keys)          | Prevents silent failures from ignored frontmatter               |
| **9. Quality Gate**            | All worked-examples.md ≥ 150 lines                                 | Ensures example quality; prevents hollow documentation          |

**Enforcement:** Run through the 9 checks manually before committing new or modified skills.

## Mode 4: Evaluate — Claude A/Claude B Loop

The evaluation loop design is documented in [`worked-examples.md`](worked-examples.md). Key steps:

1. Design test matrix (3+ cases: happy path + edge cases + A/B)
2. Simulate Claude B execution — treat skill as the only source of truth
3. Grade each test case: PASS / PARTIAL / FAIL
4. Identify improvement candidates: which skill line caused each failure
5. Produce evaluation report with score (X/N passing) and priority improvements

**Input schema additions (Mode 4):**

```json
{
  "mode": "evaluate",
  "skill_name": "[name]",
  "skill_content": "[full SKILL.md]",
  "test_cases": [
    { "name": "Happy path", "prompt": "...", "expected_behavior": "..." },
    { "name": "Edge case 1", "prompt": "...", "expected_behavior": "..." }
  ],
  "context": "[optional: prior evaluation results]"
}
```

See [`worked-examples.md`](worked-examples.md) for a full evaluation example.
