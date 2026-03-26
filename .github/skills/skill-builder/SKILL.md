---
name: skill-builder
description: "Meta-skill for scaffolding, auditing, and optimising agent skills. scaffold mode: creates TypeScript manifest + SKILL.md. audit mode: checks all skills for quality, parity, best-practice, and organisation. optimise mode: analyses routing, cost tiers, pool assignments, and server allocation."
---

# Skill Builder

This is a meta-skill for building, auditing, and optimising other skills in this repository.

It operates in three modes:

---

## `scaffold` mode

Generates the two mandatory files for a new skill:

- `agent/skills/<skill-id>.skill.ts`
- `.github/skills/<skill-id>/SKILL.md`

### When to use

- "Create a new skill for X"
- "Scaffold a new agent skill"
- "Turn this repeated workflow into a reusable skill"

### Required input fields

| Field              | Type       | Description                           |
| ------------------ | ---------- | ------------------------------------- |
| `skillId`          | `string`   | Kebab-case skill ID (e.g. `my-skill`) |
| `description`      | `string`   | Human-readable description            |
| `suggestedServers` | `string[]` | MCP server keys from `MCP.*`          |
| `dryRunCapable`    | `boolean`  | Whether to add dry-run guard          |

---

## `audit` mode

Runs a full multi-axis quality health-check across all registered skills.

### Checks performed

| Category        | Checks                                                            |
| --------------- | ----------------------------------------------------------------- |
| `parity`        | SKILL.md exists, registered in index.ts, constant in skill-ids.ts |
| `best-practice` | dryRunCapable on write skills, fitness() returns > 0              |
| `quality`       | Cost tier consistency, success rate, latency thresholds           |
| `organisation`  | Skill assigned to a named agent pool                              |

### Output

- `auditReport.score` — 0–100 health score
- `auditReport.findings` — per-skill findings with severity + remediation
- `auditReport.summary` — human-readable summary

### When to use

- "Audit all skills"
- "Check skill quality"
- "Run skill health check"
- "Show me skill best-practice violations"

---

## `optimise` mode

Analyses the system holistically for routing, pool-assignment, cost, and observability inefficiencies.

### Areas analysed

| Area                | What it checks                                                     |
| ------------------- | ------------------------------------------------------------------ |
| `routing`           | Skills with low heuristic scores after multiple observations       |
| `cost-tier`         | Cheap skills with high observed latency                            |
| `pool-assignment`   | Skills with no server deps that land on arbitrary pools            |
| `server-allocation` | Many skills sharing the same write server (memory contention risk) |
| `schema`            | Generic `z.object({})` input schemas with no type constraints      |
| `observability`     | Expensive skills with zero heuristic observations                  |

### When to use

- "Optimise the agent system"
- "How can I improve skill routing?"
- "Find inefficiencies in the skill system"
- "Run a skill optimisation audit"

---

## Improvement model

This skill does not self-modify blindly.

1. Persists observations and outcomes to `agent:v1:reasoning:skill-builder:*`
2. Compares new outcomes to prior patterns
3. Proposes a reviewed improvement diff
4. Only applies improvements after validation

## Guidelines

- Single responsibility per scaffolded skill.
- Always add dry-run support for write/destructive skills.
- Prefer typed contracts and Zod schemas.
- Every new skill must have a matching SKILL.md and registry entry.
- Improvements must be observable and auditable — never silent.

## Secret Safety (Non-Negotiable)

- Never print, echo, summarize, or quote secret values from `.env*`, terminal output, logs, screenshots, or tool results.
- Always mask sensitive tokens in all outputs (for example: `re_***`, `gQAA***`).
- Use secret variable names only (for example: `RESEND_API_KEY`) when discussing configuration.
- If credentials are exposed during a session, recommend immediate credential rotation before continuing.
