---
name: skill-builder
description: Use when someone asks to scaffold a new skill, audit existing skill quality, optimize skill prompts, or evaluate skill behavior.
argument-hint: "[build|audit|optimize|evaluate] [skill-name or target]"
disable-model-invocation: true
---

# Skill Builder Skill

## What This Skill Does

Creates, audits, optimizes, and evaluates `.claude` skill scaffolds while enforcing frontmatter and file conventions.

## Steps

1. Parse request mode: `build`, `audit`, `optimize`, or `evaluate`.
2. Load target skill files and project constraints.
3. Delegate focused analysis/generation to `.claude/agents/skill-builder/AGENT.md`.
4. Validate output for naming, frontmatter, references, and required sections.
5. Return a structured result and explicit follow-up actions.

## Output

- Build: full `SKILL.md` draft with required frontmatter.
- Audit: checklist table + prioritized fixes.
- Optimize: before/after proposals.
- Evaluate: test matrix + failure analysis.

## Notes

- Keep all generated content aligned with orchestrator-only behavior.
- Do not introduce raw destructive commands in skill guidance.
- Prefer links to `.claude/reference/` for examples and playbooks.
