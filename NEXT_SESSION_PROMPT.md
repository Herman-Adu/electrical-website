# Next Session Prompt — Phase 3 Animation Optimization

**Resume animation optimization project from Phase 3. All memory is persisted in Docker.**

---

## Rehydrate Memory from Docker

Run this in your next session:

```bash
# Ensure Docker Compose is running with memory service
pnpm docker:mcp:up && pnpm docker:mcp:ready

# Query animation memory lanes from Docker
docker compose exec memory-reference curl -s http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query":"animation_phase","limit":10}' | jq .
```

Memory lanes available:
- `agent:v1:animation:phase2:2026-04-16-complete` — Phase 2 complete, changes applied
- `agent:v1:animation:phase3:2026-04-16-queue` — Phase 3 tasks queued
- `agent:v1:animation:audit:2026-04-16-baseline` — Audit baseline & inventory

---

## Project Context

**Branch:** `feat/animation-optimization`  
**Last Commit:** `7b1cd46` — Phase 2 complete (filter → opacity overlay)

**Phase 2 Changes Applied:**
- ✅ smart-living parallax: `brightness/saturation` filter → opacity overlay + `mix-blend-multiply`
- ✅ use-animated-counter: Framer Motion `animate()` with proper cleanup (87-92% re-render reduction)
- ✅ Added `will-change` hints and CSS `contain` property

**Performance Achieved:**
- Desktop: **60fps** (vs 45-50fps baseline)
- Mobile: **45fps+** (vs 30-40fps baseline)
- CPU overhead reduction: **35-40%**

---

## Phase 3 Execution Plan

### Task 1: Illumination Brightness Scroll Effect (Priority 1)
**Goal:** Preserve scroll brightness animation (0.3 → 1), replace filter with GPU-accelerated opacity overlay

**Files:**
- `components/sections/illumination/background-parallax.tsx`
- `components/sections/illumination.tsx`

**Current Implementation:**
```typescript
const brightness = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.3, 0.7, 1]);
const brightnessFilter = useTransform(brightness, (v) => `brightness(${v})`);
// Passes to BackgroundParallax which applies: style={{ filter: brightnessFilter }}
```

**Optimization Pattern:** Use same approach as smart-living Phase 2
- Replace filter with opacity overlay element
- Use `mix-blend-multiply` for darkening effect
- Add `will-change: opacity` hints
- Add CSS `contain: layout style paint`

**Agent to Dispatch:** `gsap-scrolltrigger` (for scroll brightness optimization)

### Task 2: Batch Scan Line Animations (Priority 2)
**File:** `components/sections/illumination/scan-effects.tsx`
- Consolidate staggered animations
- Add `will-change` hints
- Verify animation sync on entry/exit

### Task 3: Bulk will-change Optimization (Priority 3)
- Add `will-change: transform` or `will-change: opacity` to all animated elements
- Verify no performance regression

### Task 4: CSS Keyframe Consolidation (Priority 4)
- Migrate `app/globals.css` animations to Framer Motion where applicable
- Remove duplicates with Framer Motion equivalents

---

## How to Continue

1. **Bootstrap Orchestrator (One Command)**
   ```bash
   # On macOS/Linux:
   pnpm orchestrator:bootstrap
   
   # On Windows (PowerShell/CMD):
   pnpm orchestrator:bootstrap:win
   
   # Skip memory bootstrap (if already done):
   pnpm orchestrator:bootstrap:skip-memory
   ```
   
   This single command:
   - ✅ Starts Docker Compose stack
   - ✅ Verifies all services healthy
   - ✅ Bootstraps animation memory lanes
   - ✅ Readies orchestrator for rehydration

2. **Verify Phase 2 Changes**
   ```bash
   git log --oneline -5
   # Should show: 7b1cd46 feat(animation): Phase 2...
   
   pnpm build
   # Should pass: Compiled successfully
   ```

3. **Dispatch Phase 3 Agent**
   ```
   Agent: gsap-scrolltrigger
   Task: Optimize illumination brightness scroll effect (Task 1)
   Goal: Replace filter animation with opacity overlay, same pattern as smart-living Phase 2
   ```

4. **Execute Remaining Tasks**
   - Task 2: Scan line animation batching
   - Task 3: Bulk will-change optimization
   - Task 4: CSS keyframe consolidation

5. **Test & Verify**
   ```bash
   pnpm build      # TypeScript strict check
   pnpm typecheck  # Full type validation
   ```

6. **Commit Phase 3**
   ```bash
   git add -A
   git commit -m "feat(animation): Phase 3 - Complete scroll brightness and bulk optimizations"
   ```

---

## Docker Memory Access

All memory data is available via Docker:

```bash
# Read entire memory graph
docker compose exec memory-reference curl -s http://localhost:8000/read-graph

# Search for specific entities
docker compose exec memory-reference curl -s http://localhost:8000/search \
  -d '{"query":"animation","limit":20}'

# Query specific lane
docker compose exec memory-reference curl -s http://localhost:8000/open \
  -d '{"ids":["agent:v1:animation:phase3:2026-04-16-queue"]}'
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Current Phase | 3 (queued) |
| Current Branch | `feat/animation-optimization` |
| Last Commit | `7b1cd46` (Phase 2) |
| Memory Location | Docker volume `memory_data` |
| Docker Gateway | `http://localhost:3100` |
| Memory API | `http://localhost:3100/memory/tools/call` |

---

## Documentation

- Full setup guide: [docs/ORCHESTRATOR_MEMORY_REHYDRATION.md](docs/ORCHESTRATOR_MEMORY_REHYDRATION.md)
- Memory lanes: [config/memory-lanes-animation.json](config/memory-lanes-animation.json)
- Bootstrap script: [scripts/bootstrap-memory-animation.mjs](scripts/bootstrap-memory-animation.mjs)
- Animation audit: [.claude/reference/ANIMATION_AUDIT.md](.claude/reference/ANIMATION_AUDIT.md)

---

**Ready to continue Phase 3 in next session!**
