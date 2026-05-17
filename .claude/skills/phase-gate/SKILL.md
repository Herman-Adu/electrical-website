---
name: phase-gate
description: Use this skill after completing any discrete phase or task, and at 60% context — it locks progress into all three persistence layers (Docker memory, Obsidian, git ctx commit) so any future session can resume without losing work. Two modes: complete (phase finished, full lock) and wip (60% context hit, partial lock mid-phase). In complete mode writes an observation to the plan entity, appends a dated section to the Obsidian feature doc, updates config/active-branch.json with the next task, and creates a ctx commit pushed to the feature branch. In wip mode performs the same three locks but marks the state as in-progress with exact remaining files so the next session resumes at the precise point. Never skips any lock — all three are mandatory for the continuation OS to function.
argument-hint: '<phase-name>: <summary> [-- next: <next-task>]'
disable-model-invocation: true
---

## Execution

Detect mode from argument: if arg starts with `wip-` → **WIP mode**. Otherwise → **Complete mode**.

### Step 1: Read active-branch.json
Read `config/active-branch.json` → extract `planEntity`, `entity`, `obsidianFeatureDoc`, `branch`.

---

## COMPLETE MODE

### Lock 2 — Docker (first, most durable)
Call `mcp__memory__add_observations` with:
- entityName: `[planEntity]`
- observations: `["PHASE-NAME COMPLETE: [summary] — [ISO timestamp]"]`
If planEntity ≠ entity: also add to feat entity.
Fallback: `curl -s -X POST http://localhost:3100/memory/tools/call -H "Content-Type: application/json" -d '{"name":"add_observations","arguments":{...}}'`

### Lock 3 — Obsidian
Call `mcp__MCP_DOCKER__obsidian_append_content` on `obsidianFeatureDoc`:
Append: `\n## [phase-name] — YYYY-MM-DD\n[summary]\nNext: [next-task]\n`
Fallback: `curl -s -X POST http://localhost:3100/obsidian/tools/call -H "Content-Type: application/json" -d '{"name":"obsidian_append_content","arguments":{...}}'`

### Lock 1 — Git
Update `config/active-branch.json`: set `nextTask` to the next phase description, `updatedAt` to now ISO string, `status` to `[phase-name] complete`.
```bash
git add config/active-branch.json
git commit -m "ctx([phase-name]): [summary] — next: [next-task]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin [branch]
```

### Confirm
Report: `Phase gate complete — Lock1 Git pushed, Lock2 Docker updated, Lock3 Obsidian appended. Next: [next-task]`

---

## WIP MODE (60% context)

### Lock 1 — Git
```bash
git add -A
git commit -m "ctx(wip-[phase-name]): [files-done] — remaining: [specific-files-not-yet-done]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin [branch]
```

### Lock 2 — Docker
Add observation: `WIP [phase-name]: done=[files-done], remaining=[files-remaining] — [ISO timestamp]`

### Lock 3 — Obsidian
Append: `\n## WIP [phase-name] — YYYY-MM-DD\nIn progress. Done: [files]. Remaining: [files]. Next session resumes at: [specific file].\n`

### Update active-branch.json
Set `nextTask` to the **exact remaining file or task** — be specific enough for the next session to resume without investigation.
```bash
git add config/active-branch.json
git commit -m "ctx(wip-lock): active-branch.json nextTask updated

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin [branch]
```

### Report
`WIP locked. Next session: /rehydrate resumes at [specific file/task].`
