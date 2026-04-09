# Workflow Template: Meeting Transcript to Summary

## Overview

A reusable workflow that converts raw meeting transcripts into structured summaries and archives them for future reference.

**Triggers:** "Summarize this meeting transcript", "Process meeting transcript", "Save meeting notes to archives"

---

## Workflow Design

### Goal
Transform unstructured meeting transcripts into organized, searchable summaries with action items and decisions, automatically archived and indexed.

### Steps

1. **Input Capture**
   - Accept meeting transcript (raw text or paste)
   - Extract/input meeting date (default: today)
   - Extract/input topic/title
   - Extract/input attendees (optional)

2. **Summary Generation**
   - Use Client Management Skill to structure the summary
   - Extract key elements:
     - **Executive Summary:** 2-3 sentence overview
     - **Decisions Made:** Bullet list of decisions
     - **Action Items:** With owners and deadlines
     - **Next Steps:** What happens next
     - **Follow-ups:** Any open questions or pending items

3. **File Creation**
   - Create summary file: `archives/meetings/{YYYY-MM-DD}_{topic-slug}.md`
   - Include metadata header:
     ```markdown
     # Meeting: {Topic}

     **Date:** {YYYY-MM-DD}
     **Attendees:** {Names}
     **Duration:** {estimated}
     ```
   - Add all summary sections below metadata

4. **Archive & Index**
   - Save file to `archives/meetings/`
   - Update `archives/meetings/index.md` with entry:
     ```markdown
     - [{Date}] {Topic} - {Attendees}
     ```
   - Confirm file path to user

### Tools & Skills Used

- **Client Management Skill** — Structures meeting summaries
- **Write Tool** — Creates summary file
- **Edit Tool** — Updates meeting index
- **File System** — Organizes and stores files

### Inputs / Outputs

**Inputs:**
- `transcript` (string) — Raw meeting transcript
- `date` (string, optional) — Meeting date (YYYY-MM-DD), defaults to today
- `topic` (string) — Meeting title/topic
- `attendees` (string, optional) — Comma-separated list of attendees

**Outputs:**
- Summary file at `archives/meetings/{date}_{topic-slug}.md`
- Updated index at `archives/meetings/index.md`
- Console confirmation with file path

---

## How to Use This Template

### Option A: Simple Invocation
```
"Summarize this meeting transcript:
[paste transcript here]
Topic: Nexgen Electrical Kickoff
Attendees: Herman, Client Lead, Developer"
```

### Option B: Full Details
```
"Process meeting:
Transcript: [paste]
Date: 2026-03-09
Topic: Full Stack Fusion Planning
Attendees: Herman, Designer, Frontend Dev, Backend Dev"
```

### Option C: Quick (Use Defaults)
```
"Summarize this meeting:
[transcript]
Topic: Weekly Standup"
```

---

## Template Variables

When invoking, provide:

| Variable | Type | Required | Default | Example |
|----------|------|----------|---------|---------|
| `transcript` | string | Yes | — | Full meeting text |
| `date` | YYYY-MM-DD | No | Today | 2026-03-09 |
| `topic` | string | Yes | — | "Nexgen Kickoff" |
| `attendees` | string | No | — | "Herman, Sarah, John" |

---

## Output Example

**File:** `archives/meetings/2026-03-09_nexgen-kickoff.md`

```markdown
# Meeting: Nexgen Electrical Kickoff

**Date:** 2026-03-09
**Attendees:** Herman, Sarah (Client Lead), John (Developer)
**Duration:** 60 minutes

## Executive Summary

Kickoff meeting for the Nexgen Electrical website redesign project. Team reviewed project scope, timeline, and initial requirements. All stakeholders aligned on deliverables and next steps.

## Decisions Made

- Project timeline: 6 weeks (start 2026-03-16, end 2026-04-27)
- Tech stack approved: Next.js, Supabase, Vercel hosting
- Bi-weekly check-ins starting March 23
- Client reviews on Fridays at 2pm EST

## Action Items

- [ ] Herman: Send detailed project plan by 2026-03-12 (Owner: Herman, Due: 2026-03-12)
- [ ] Sarah: Provide brand guidelines & assets (Owner: Sarah, Due: 2026-03-10)
- [ ] John: Set up development environment (Owner: John, Due: 2026-03-15)

## Next Steps

1. Herman finalizes project roadmap
2. Receive brand guidelines from client
3. Begin wireframe design phase
4. First technical deep-dive March 23

## Follow-ups

- Clarify mobile app scope (pending client input)
- Confirm analytics integration requirements
```

**Index Entry:**
```markdown
- [2026-03-09] Nexgen Electrical Kickoff - Herman, Sarah, John
```

---

## Re-running the Workflow

To process another meeting transcript:

```
"Use the meeting transcript workflow:
[new transcript]
Topic: [topic]
Date: [optional]
Attendees: [optional]"
```

The system will:
1. Generate summary using same structure
2. Save with unique date/topic filename
3. Update index automatically
4. Return confirmation

---

## Notes

- Filenames are auto-slugified (spaces → hyphens, lowercase)
- Index is kept in chronological order (newest first)
- Summaries are immutable once created (use new file for updates)
- Action items are tracked with checkboxes for follow-up
- Attendees must match real names for consistency

---

## Related Workflows

- **Research-to-Blog:** Research topic → generate blog post → archive
- **Planning-to-Timeline:** Plan task → break down → update calendar
- **Code-to-Documentation:** Write code → auto-generate docs → archive

