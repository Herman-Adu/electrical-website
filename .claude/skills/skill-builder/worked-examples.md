# Skill Builder — Worked Examples

Complete examples for all 4 skill-builder modes. Reference from SKILL.md.

## Complete Example: meeting-notes Skill (Mode 1 Build)

A minimal but complete skill you can use as a starting template.

**File:** `.claude/skills/[skill-name]/SKILL.md` (example: `meeting-notes`)

```yaml
---
name: meeting-notes
description: Use when someone asks to summarize meeting notes, recap a meeting, or format meeting minutes.
argument-hint: "[topic or date]"
---

## What This Skill Does

Takes raw meeting notes and produces a structured summary with action items.

## Steps

1. Ask the user to paste their raw meeting notes (or provide a file path).
2. Extract the following from the notes:
   - **Attendees** -- Who was in the meeting
   - **Key decisions** -- What was decided
   - **Action items** -- Who owes what, with deadlines if mentioned
   - **Open questions** -- Anything unresolved
3. Format the output using the template below.
4. If $ARGUMENTS is provided, use it as the meeting title. Otherwise, infer a title from the content.

## Output Template

# Meeting: [title]
**Date:** [date if mentioned, otherwise "Not specified"]
**Attendees:** [comma-separated list]

## Key Decisions
- [decision]

## Action Items
- [ ] [person]: [task] (due: [date or "TBD"])

## Open Questions
- [question]

## Notes

- Keep summaries concise. Don't add commentary or embellish.
- If notes are too vague to extract action items, flag that to the user instead of making them up.
```

## Mode 4 Evaluation Example

```
/skill-builder evaluate research

Test cases:
1. Happy path: "Research TypeScript performance improvements 2026"
   Expected: 5+ sources, synthesis, key findings, recommendations

2. Edge case 1: "Research [empty]"
   Expected: Skill asks for research topic, doesn't error

3. Edge case 2: "Research with 100+ sources"
   Expected: Handles efficiently, maybe delegates to agent
```

**Output:** Evaluation report with score (X/N passing), failure analysis, priority improvements.
