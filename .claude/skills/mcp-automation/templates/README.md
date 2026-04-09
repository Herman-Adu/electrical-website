# MCP Automation Workflow Templates

Reusable workflow templates for common multi-step automation tasks. Use these as starting points for recurring processes.

## Available Templates

### 1. Meeting Transcript to Summary
**File:** `meeting-transcript-to-summary.md`

Converts raw meeting transcripts into structured summaries with decisions, action items, and next steps. Auto-archives to `archives/meetings/`.

**Quick Invocation:**
```
"Summarize this meeting transcript:
[paste transcript]
Topic: Meeting Title
Attendees: Names (optional)"
```

**Use When:**
- Processing meeting notes after calls
- Need to extract action items and decisions
- Want a searchable archive of meetings
- Need to track who owns what follow-ups

---

## How to Use Templates

1. **Choose a template** from the list above
2. **Review the template file** to understand the workflow
3. **Invoke the workflow** with your data, e.g.:
   ```
   "Use the meeting transcript workflow:
   [your input here]"
   ```
4. The system executes all steps automatically and returns results

---

## Creating New Templates

To add a new template:

1. Create a new markdown file: `your-workflow-name.md`
2. Follow the template structure in `meeting-transcript-to-summary.md`:
   - Overview
   - Workflow Design (Goal, Steps, Tools, Inputs/Outputs)
   - How to Use This Template
   - Template Variables
   - Output Example
   - Re-running the Workflow
   - Notes
3. Add it to this README
4. Reference it when automating similar tasks

---

## Template Structure

Each template includes:

- **Overview** — What it does and when to use it
- **Workflow Design** — Detailed step-by-step breakdown
- **Tools & Skills Used** — Which systems power it
- **Inputs / Outputs** — Expected data in/out
- **How to Use** — Quick invocation examples
- **Template Variables** — Configurable parameters
- **Output Example** — Real sample output
- **Re-running** — How to use it repeatedly
- **Notes** — Important context and limitations

---

## Quick Reference

| Template | Purpose | Inputs | Output |
|----------|---------|--------|--------|
| Meeting Transcript | Summarize meetings | Transcript, topic, date | Summary + archived file |

More templates coming as workflows emerge!

