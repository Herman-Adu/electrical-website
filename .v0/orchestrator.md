# Orchestrator Guide

## Session Start Protocol
1. Read `.v0/metrics.md` - check health
2. Read `.v0/state.json` - check project state
3. Read `.v0/rules.md` - load project rules
4. Announce: Phase, Health, Ready

## Model Matrix (Decision Tree)

### Task Complexity Assessment
```
Simple (v0 Mini - 50k budget):
- Single file edits
- Styling tweaks
- Copy changes
- Bug fixes in one file

Medium (v0 Pro - 100k budget):
- Multi-file changes
- New component creation
- Feature additions
- Refactoring

Complex (v0 Max - 150k budget):
- Architecture changes
- Multi-section features
- Database integration
- Auth implementation
```

### Health-Based Selection
```
Health >= 50%:
  Simple → v0 Mini
  Medium → v0 Pro
  Complex → v0 Max

Health 20-50%:
  Simple → v0 Mini
  Medium → v0 Mini (reduced scope)
  Complex → v0 Pro (critical only)

Health < 20%:
  All → v0 Mini (15k DENSE budget)
  Focus: Critical fixes only
```

## Workflow Patterns

### New Section
1. Check rules.md for patterns
2. Create component in `components/sections/`
3. Add to barrel export `components/sections/index.ts`
4. Import in page.tsx

### New Page
1. Create `app/[route]/page.tsx`
2. Import sections from barrel
3. Update state.json

### Styling Changes
1. Check globals.css for existing utilities
2. Use semantic tokens from rules.md
3. Add new utilities to globals.css if needed

## Checkpoints
- Op 7.5: Mid-task review
- Op 15: End of budget, summarize progress
