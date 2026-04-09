# Skill Builder Sub-Agent

## Summary

The skill builder agent generates production-ready skills, audits existing skills for quality, and proposes high-impact improvements. It ensures all skills meet governance standards and follow Claude Code best practices.

## Key Responsibilities

- Skill Generation — Create complete production-ready SKILL.md files from discovery interview results with full specifications
- Quality Auditing — Run comprehensive quality audits against existing skills with scored findings and prioritized fix lists
- Optimization Analysis — Propose 3–5 high-impact improvements (ultrathink markers, context injection, performance enhancements) with before/after diffs
- Standards Enforcement — Ensure all skills meet governance standards, frontmatter validation, worked-examples requirements
- Error Handling — Provide recovery steps for incomplete input, invalid names, and missing files

## Confidence Level

High (92%+) — Skill generation follows Claude Code spec and proven patterns. Quality auditing is comprehensive and actionable. Limitation: skills with novel patterns may require manual review for optimization suggestions.

## Purpose

The skill-builder sub-agent is a **specialized task executor** for the `/skill-builder` skill. It handles three intensive subtasks that require focused reasoning:

1. **Build mode:** Generate complete production-ready SKILL.md files from discovery interview results
2. **Audit mode:** Run comprehensive quality audits against existing skills and return scored findings
3. **Optimize mode:** Propose high-impact improvements (ultrathink markers, context injection, etc.) with before/after diffs

The agent does not interact with users directly. It is only called by the `/skill-builder` skill via the Agent tool.

## When It's Called

The `/skill-builder` skill delegates to this agent when:

- A user wants to **create a new skill** → After the 6-round discovery interview completes, the skill calls this agent to generate the full SKILL.md
- A user wants to **audit an existing skill** → The skill sends the skill content; the agent runs the full checklist and returns scored findings
- A user wants to **optimize a skill** → The skill sends existing content; the agent identifies 3–5 high-impact improvements with diffs

## Input / Output Contract

**Input:** Structured JSON object with:
- `mode`: "build" | "audit" | "optimize"
- `skill_name`: The name of the skill being built/audited/optimized
- `skill_content`: Current SKILL.md text (audit/optimize modes)
- `discovery_results`: Interview summary (build mode only)
- `constraints`: Project conventions or edge cases
- `reference_files`: Optional paths to supporting docs

**Output:** Structured markdown or JSON:
- **Build:** Complete SKILL.md file ready to write
- **Audit:** Checklist table + prioritized fix list + confidence score
- **Optimize:** Before/after diffs for 3–5 proposals

See AGENT.md for full specifications.

## How the Skill Calls This Agent

The `/skill-builder` skill invokes this agent via:

```
Call .claude/agents/skill-builder/AGENT.md with:
{
  "mode": "build|audit|optimize",
  "skill_name": "[name]",
  "skill_content": "...",
  "discovery_results": "...",
  "constraints": "..."
}
```

The skill manages:
- User interviews (6-round discovery for build mode)
- File I/O (reading skills, writing generated SKILL.md)
- User-facing presentation (showing audit findings, explaining optimizations)
- Decision-making (which optimizations to apply)

The agent manages:
- Content generation (structured, high-quality SKILL.md)
- Quality evaluation (comprehensive audit checklist)
- Improvement proposals (specific, high-impact diffs)

## When NOT to Use

This agent should **not** be called for:
- **Trivial one-liner skills** — Use direct skill editing instead
- **Emergency hotfixes** — This agent takes time; use manual edits if urgent
- **User interviews** — The parent skill handles discovery; don't skip that step
- **File operations** — Always delegate file I/O to the parent skill
- **Direct user requests** — This agent only works via `/skill-builder` skill

## Error Recovery

If the agent encounters an error (incomplete input, invalid names, missing files), it returns structured error messages with recovery steps. The parent skill reads these and either:
- Asks the user for clarification (incomplete discovery)
- Retries with corrected input
- Falls back to manual editing guidance

See AGENT.md "Error Handling" section for scenario-by-scenario recovery procedures.

## Key Characteristics

| Aspect | Detail |
|--------|--------|
| **Invocation** | Via Agent tool, from `/skill-builder` skill only |
| **Input type** | Structured JSON (mode + content) |
| **Output type** | Markdown (build, audit) or JSON (audit findings, optimize diffs) |
| **Token efficiency** | Concise, compressed output; minimal prose |
| **File writes** | None — parent skill handles all I/O |
| **User interaction** | None — all user communication via parent skill |
| **Specialization** | Single-responsibility: build/audit/optimize only |

## Integration Points

**Upstream (receives from):**
- `/skill-builder` skill — structured JSON request + discovery results

**Downstream (returns to):**
- `/skill-builder` skill — generated SKILL.md, audit findings, or optimization proposals

**Coordination:**
- Parent skill synthesizes agent output, presents to user, executes approved changes
- Agent stays focused on generation/evaluation; parent handles orchestration and user interaction

## File Locations

- **Agent prompt:** `.claude/agents/skill-builder/AGENT.md` (executable prompt, second-person format)
- **Documentation:** `.claude/agents/skill-builder/README.md` (this file, for reference only)
- **Referenced by:** `.claude/skills/skill-builder/SKILL.md` (the parent skill)
