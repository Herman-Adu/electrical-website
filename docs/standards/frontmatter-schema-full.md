# Frontmatter Schema

This file defines the YAML frontmatter structure for `.claude` metadata files: `SKILL.md`, `AGENT.md`, and documentation files.

## SKILL.md Frontmatter

Every skill **must** have frontmatter with these fields:

```yaml
---
name: skill-name
description: Clear, pushy description of when to use (80–200 words)
argument-hint: "[suggested argument format]"
disable-model-invocation: true
compatibility: Optional; list dependencies or required tools
---
```

### Required Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | string | Skill identifier (lowercase, kebab-case) | `planning`, `code-generation` |
| `description` | string | **When to use** + triggers (MUST be "pushy"; see note below) | "Use this skill WHENEVER someone mentions goals..." |
| `argument-hint` | string | Suggested argument format for the user | `"[goal or timeframe]"`, `"[build\|audit\|optimize]"` |
| `disable-model-invocation` | boolean | Set to `true` for orchestrator-mode skills (prevents auto-invocation loop) | `true` |

### Optional Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `compatibility` | string | Tools/frameworks required | `"Requires Node.js 18+, pnpm"` |
| `version` | string | Skill version (semantic versioning) | `"1.0.0"`, `"2.1.0-beta"` |
| `tags` | array | Searchable tags | `["planning", "orchestration", "multi-step"]` |

### Description Quality Requirements

**The `description` field is the primary trigger mechanism.** A good description:

1. **Starts with action:** "Use this skill WHENEVER..." or "Use when..."
2. **Lists use cases explicitly:** Avoid "plans goals" — say "breaking down projects, creating timelines, estimating effort"
3. **Adds trigger phrases:** Include keywords the user might use. Pushy versions include "even if they don't explicitly ask for..."
4. **Shows intent, not just syntax:** Focus on the problem the skill solves, not the command name

**Bad description:**
```yaml
description: For planning goals
```

**Good description:**
```yaml
description: Use this skill WHENEVER someone mentions goals, timelines, tasks, or deadlines — even if they don't explicitly ask for a "plan". Use for: breaking down projects, creating timelines, estimating effort. Trigger on any statement involving "how should I", "in what order", "what's the timeline".
```

---

## AGENT.md Frontmatter

Agents (sub-agents dispatched by orchestrator) **must** have frontmatter:

```yaml
---
name: agent-name
mode: analyze|research|execute|validate|synthesize
role: "What this agent is responsible for"
trigger: "When orchestrator should dispatch this agent"
return-format: structured|prose|list
---
```

### Required Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | string | Agent identifier (kebab-case) | `architecture-sme`, `validation-sme` |
| `mode` | string | Type of work: `analyze`, `research`, `execute`, `validate`, `synthesize` | `analyze` |
| `role` | string | What this agent owns (1–2 sentences) | "Architecture review and component hierarchy design" |
| `trigger` | string | When orchestrator invokes this (required context) | "When designing new features or refactoring components" |

### Optional Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `return-format` | string | Output structure expected by orchestrator | `structured`, `prose`, `list` |
| `sla-seconds` | number | Target latency for this agent | `300` (5 minutes) |
| `dependencies` | array | Other agents this depends on | `["validation-sme"]` |

### Example AGENT.md

```yaml
---
name: architecture-sme
mode: analyze
role: Analyzes component hierarchy, data flow, and API contracts for new features
trigger: When building features that span multiple components or require architectural decisions
return-format: structured
sla-seconds: 300
---

# Architecture SME Agent

## Context You'll Receive
- Feature spec
- Current codebase structure
- Component tree
- Data flow diagrams

## Your Job
1. Design component hierarchy
2. Map data flow
3. Identify shared state and lifting patterns
4. Flag performance concerns
5. Return 3–5 recommendations

## Output Format
- Findings as numbered list
- Each finding includes: title, rationale, implementation note
```

---

## Documentation File Frontmatter

Reference docs and guides use simpler frontmatter:

```yaml
---
title: Page or Guide Title
description: One-line summary
category: guides|reference|playbook|example
status: active|draft|archived
last-updated: YYYY-MM-DD
---
```

### Example: Playbook

```yaml
---
title: Multi-Step Form Pattern
description: Standard pattern for multi-step forms with server-side validation and CAPTCHA
category: playbook
status: active
last-updated: 2026-04-15
---

# Multi-Step Form Pattern

[content...]
```

---

## Validation Rules

### For SKILL.md

- ✅ `name` is lowercase, kebab-case, no spaces
- ✅ `description` starts with "Use this skill..." or "Use when..."
- ✅ `description` includes 3+ trigger phrases (keywords the user might say)
- ✅ `argument-hint` provides a helpful example
- ✅ `disable-model-invocation: true` (prevents infinite loops)
- ❌ No "Optional" in description (field is required, so just list the triggers)
- ❌ Description is not a duplicate of another skill's description

### For AGENT.md

- ✅ `name` is lowercase, kebab-case
- ✅ `mode` is one of: `analyze`, `research`, `execute`, `validate`, `synthesize`
- ✅ `role` is clear and concise (max 2 sentences)
- ✅ `trigger` explains orchestrator context
- ✅ `return-format` matches what orchestrator expects to receive

### For Documentation

- ✅ `title` is descriptive and matches H1
- ✅ `description` is one line, summarizes the page
- ✅ `category` is one of the valid values
- ✅ `status` is one of: `active`, `draft`, `archived`
- ✅ `last-updated` is YYYY-MM-DD format

---

## Checklist for Creating New Skills/Agents

### Before Creating

- [ ] Decide: SKILL (user-invocable) or AGENT (sub-agent)?
- [ ] Choose a descriptive name (kebab-case)
- [ ] Write 2–3 example use cases
- [ ] If SKILL: draft a "pushy" description with trigger phrases

### While Creating

- [ ] Complete all required frontmatter fields
- [ ] For SKILL: include `disable-model-invocation: true`
- [ ] For AGENT: include `mode` and `trigger`
- [ ] Test: description should be obvious when scanning available skills

### Before Merging

- [ ] Validate frontmatter against this schema (no missing required fields)
- [ ] Review description for clarity and trigger comprehensiveness
- [ ] Check name for consistency with existing skills
- [ ] Confirm file is valid YAML (no syntax errors)

---

## Tools for Validation

### Manual Check (Quick)

```bash
# Validate YAML syntax
python -c "import yaml; yaml.safe_load(open('.claude/skills/my-skill/SKILL.md'))"

# Check for required fields
grep -E "^(name|description|argument-hint):" .claude/skills/my-skill/SKILL.md
```

### Automated Check (Proposed)

A future CI/CD rule can validate:

```json
{
  "skill": {
    "required_fields": ["name", "description", "argument-hint", "disable-model-invocation"],
    "name_pattern": "^[a-z0-9-]+$",
    "description_min_length": 80,
    "description_must_start_with": "Use this skill|Use when"
  },
  "agent": {
    "required_fields": ["name", "mode", "role", "trigger"],
    "mode_values": ["analyze", "research", "execute", "validate", "synthesize"],
    "role_max_sentences": 2
  }
}
```

---

**Last Updated:** 2026-04-15  
**Status:** Ready for adoption  
**Next Steps:** Create CI/CD validation rule based on this schema
