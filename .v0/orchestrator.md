# Orchestrator Guide v2.0

## Session Initialization Protocol

### Mandatory Sequence (Non-Negotiable)

```
1. READ  .v0/metrics.md     → Health check FIRST
2. READ  .v0/state.json     → Project state
3. READ  .v0/rules.md       → Coding standards
4. READ  .v0/PHASE_STATE.md → Current phase context
5. VALIDATE Gates 1, 7, context budget
6. ANNOUNCE: Phase | Task | Model | Budget | Health | Context Loaded
7. PROCEED with work
```

### Announcement Template

```
SESSION START
Phase: BUILD | Task: [description] | Complexity: M
Model: v0 Pro | Budget: 100k | Ops: 0/15 | Health: 100%
Context: rules.md, state.json, metrics.md, PHASE_STATE.md loaded
Status: READY
```

---

## Model Matrix (Single Source of Truth)

### Complexity Scoring

| Score | Label       | Characteristics                          | Op Budget           |
| ----- | ----------- | ---------------------------------------- | ------------------- |
| S     | Simple      | Single file, styling, copy, bug fix      | 5                   |
| M     | Medium      | Multi-file, new component, feature       | 10                  |
| L     | Large       | Architecture, integration, multi-section | 15                  |
| XL    | Extra Large | Full feature with DB/Auth                | 20+ (multi-session) |

### Model Selection Decision Tree

```
START
  │
  ├─ Is Health < 20%?
  │   └─ YES → v0 Mini (15k DENSE budget, critical only)
  │
  ├─ Is Complexity = S (Simple)?
  │   └─ YES → v0 Mini (50k budget)
  │
  ├─ Is Health 20-50%?
  │   ├─ Complexity M → v0 Pro (100k, reduced scope)
  │   └─ Complexity L → v0 Pro (100k, critical paths only)
  │
  └─ Is Health >= 50%?
      ├─ Complexity M → v0 Pro (100k budget)
      └─ Complexity L/XL → v0 Max (150k budget)
```

### Model Specifications

| Model       | Context | Ops Budget | Best For                               |
| ----------- | ------- | ---------- | -------------------------------------- |
| v0 Mini     | 50k     | 5          | Styling, single file, quick fixes      |
| v0 Pro      | 100k    | 15         | Features, refactoring, components      |
| v0 Max      | 150k    | 20         | Architecture, complex integrations     |
| v0 Max Fast | 100k    | 10         | Analysis, planning (no implementation) |

---

## Gate System

### GATE 1: Session Initialization

**Trigger:** Session start
**Checks:**

- [ ] All .v0/ files readable
- [ ] state.json matches expected structure
- [ ] Health >= 20% (or acknowledge critical mode)
- [ ] Model selected based on task + health

**On Fail:** Announce issue, request guidance

### GATE 7: Mid-Session Checkpoint

**Trigger:** Operations 7-8
**Checks:**

- [ ] Current progress vs. planned
- [ ] Token burn rate acceptable
- [ ] No blockers accumulated
- [ ] Build still passing (quick check)

**Actions:**

- Update metrics.md
- Decide: continue / pause / pivot
- Announce checkpoint status

### GATE 15: End-of-Budget

**Trigger:** Operations 14-15
**Checks:**

- [ ] `pnpm run build` passes
- [ ] All state files updated
- [ ] Changelog entry added
- [ ] Next session handoff documented

**On Remaining Work:** Document in PHASE_STATE.md for next session

---

## Workflow Patterns

### Pattern: New Section

```
1. Check rules.md for styling patterns
2. Create: components/sections/[name].tsx
3. Update: components/sections/index.ts (barrel)
4. Import in: app/page.tsx or target page
5. Update: state.json (components.sections.files)
6. Verify: pnpm run build
```

### Pattern: New Page

```
1. Create: app/[route]/page.tsx
2. Import sections via barrel
3. Update: state.json (pages)
4. Update: navigation if needed
5. Verify: pnpm run build
```

### Pattern: Styling Update

```
1. Check globals.css for existing utilities
2. Use semantic tokens from rules.md
3. If new utility needed: add to globals.css
4. Update rules.md if significant addition
5. Verify: responsive at 375/768/1024/1440px
```

### Pattern: Bug Fix

```
1. Identify root cause file(s)
2. Read current implementation
3. Fix with minimal changes
4. Verify: pnpm run build
5. Document in changelog
```

---

## Recovery Protocol

### Session Crash Recovery

```
1. Read PHASE_STATE.md → Get last known state
2. Read metrics.md → Get operation count
3. Check state.json changelog → Last changes
4. Verify filesystem matches state.json
5. Resume from last checkpoint
```

### Drift Detection

```
If state.json components don't match filesystem:
1. STOP implementation
2. Announce drift: "[DRIFT] state.json shows X, filesystem has Y"
3. Ask: Sync state to filesystem, or investigate mismatch?
4. Update state.json after resolution
```

---

## Context Preloading

### Hot Files by Task Type

| Task Type    | Auto-Load                             |
| ------------ | ------------------------------------- |
| Styling      | globals.css, rules.md                 |
| New Section  | sections/index.ts, page.tsx, rules.md |
| Navigation   | navigation/\*, layout.tsx             |
| Hero Changes | hero/\*, page.tsx                     |
| New Page     | layout.tsx, existing page example     |

### Skip-Read Files (Use State Instead)

- Component list → state.json
- Color tokens → rules.md
- Animation classes → rules.md
- Import patterns → rules.md

---

## Cost Projections

### Estimation Formula

```
Est. Cost = (input_tokens * $0.003/1k) + (output_tokens * $0.015/1k)

Per-Op Average (v0 Pro):
- Read op: ~1,500 tokens in, ~100 out = ~$0.006
- Write op: ~500 tokens in, ~2,000 out = ~$0.032
- Analysis: ~2,000 tokens in, ~500 out = ~$0.014

Session Average: ~$0.15-0.50 depending on complexity
```

### Budget Alerts

| Burn Rate     | Status    | Action          |
| ------------- | --------- | --------------- |
| < $0.03/op    | Efficient | Continue        |
| $0.03-0.05/op | Normal    | Monitor         |
| > $0.05/op    | High      | Review approach |
