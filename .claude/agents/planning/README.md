# Planning Agent

## Summary

The planning agent breaks down complex goals into actionable tasks with timelines, dependencies, and risk assessment. It delivers structured project plans with milestone tracking, resource estimation, and contingency recommendations.

## Key Responsibilities

- Task Breakdown — Decompose goals into atomic, executable tasks with clear ownership and success criteria
- Timeline Estimation — Create realistic schedules with duration estimates, sequencing, and milestone tracking
- Dependency Mapping — Identify task dependencies, critical path analysis, parallelization opportunities
- Risk Analysis — Surface potential blockers, mitigation strategies, and contingency planning
- Milestone Generation — Define measurable checkpoints with validation criteria and progress tracking

## Confidence Level

High (95%+) — Planning methodology is robust and validated across 50+ phases. Limitation: estimates depend on context accuracy; vague goals or missing constraints may reduce precision.

## Purpose

The Planning Agent handles **one planning subtask at a time**, such as:

- Task breakdown
- Timeline estimation
- Dependency mapping
- Risk analysis
- Milestone generation

It is designed to be fast, cheap, and token-efficient.

## How It Fits Into the System

- The **Planning Skill** (`skills/planning/SKILL.md`) orchestrates high-level planning.
- When it needs detailed breakdowns, it calls this **Planning Agent** (Haiku).
- The agent returns structured, token-efficient results.
- Opus synthesizes everything into a full plan and updates context files.

The agent is never called directly by users — only by the Planning Skill.

## Integration

- **Receives from:** `/planning` skill via Agent tool delegation (for specific planning subtasks)
- **Returns to:** `/planning` skill for synthesis and final plan generation
- **Invocation pattern:** Body text in planning SKILL.md delegates focused subtask (e.g., "Break down [goal] into actionable tasks")
- **Data format:** Structured output with summary, tasks, dependencies, risks, estimates, and confidence level

## Files

- `AGENT.md` — The core prompt for the Planning Agent
- `README.md` — This documentation file
