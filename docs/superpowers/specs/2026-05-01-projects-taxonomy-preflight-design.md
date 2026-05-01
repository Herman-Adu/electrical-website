---
title: Projects Taxonomy, Nav Redesign, Filter Bar, Category Page + Docker Preflight Skill
description: 5 sub-projects — isSector taxonomy, dynamic nav, /projects filter bar, /projects/category two-zone redesign, docker-preflight skill + orchestrator simplification, and Python/MJS runtime policy
category: playbook
status: active
last-updated: 2026-05-01
---

# Design Spec — Projects Taxonomy + Nav + Filter + Preflight
**Date:** 2026-05-01 | **Branch:** `feat/projects-taxonomy-nav-preflight`

---

## Context

Post-Taplow migration surfaced four overlapping issues:
1. Nav dropdown shows stale hardcoded taxonomy (Power Boards visible, Industrial/Community missing)
2. `/projects` filter bar is in the wrong place (inside hero) with wrong taxonomy
3. `/projects/category` page is a plain grid — no visual hierarchy between sectors and work types
4. Orchestrator SKILL.md Steps 1+2 re-run Docker commands already executed by the SessionStart hook (~500-900 tokens wasted per invocation)
5. `scripts/` has a mix of `.mjs` and `.py` runtimes with no documented policy

---

## Sub-Project D — Docker Preflight Skill (PRIORITY — implement first)

### Problem
`orchestrator/SKILL.md` Steps 1+2 run `curl http://localhost:3100/health` + `pnpm docker:mcp:memory:search` + `pnpm docker:mcp:memory:open`. These are **100% redundant** — `session-start-v2.mjs` already calls `memory-rehydrate.mjs` which executes the same 2-call Docker load and injects the result as `## Session Memory` in the system-reminder context. Every `/orchestrator` invocation wastes ~500-900 tokens re-fetching data already present.

### Decision
- **D1 (chosen):** Create `.claude/skills/docker-preflight/SKILL.md` — reads injected context, zero bash execution
- Replace orchestrator Steps 1+2 (~27 lines) with single line: `Invoke the docker-preflight skill.`

### docker-preflight Skill Spec

**Frontmatter:**
```yaml
name: docker-preflight
description: Use at EVERY session start to validate Docker health, confirm memory rehydration, check lane/branch state, and deliver the 3-bullet status report. Reads from the injected ## Session Memory block — never re-runs Docker commands. Invoked by orchestrator as its first action. Trigger on: session start, /orchestrator, "what's the status", "load context", "check branch".
argument-hint: "[none required]"
disable-model-invocation: true
```

**Skill behaviour (no bash execution):**
1. Find `## Session Memory` block in current session context (injected by `session-start-v2.mjs`)
2. Extract:
   - `> Branch:` → current branch
   - `> Lane:` → active lane entity
   - `> Docker:` → online / OFFLINE
   - `### Project State` → active phase, next tasks, build status
   - Any `WARNING: Branch mismatch` or `Docker: OFFLINE` alerts
3. Validate:
   - Branch mismatch → instruct user to run `pnpm lane:activate`
   - Docker offline → instruct user to run `pnpm docker:mcp:ready`
   - Lane paused → instruct user to run `pnpm lane:activate`
4. Report exactly 3 bullets, then STOP:
   - **Branch:** [branch] | Lane: [entity] ([status])
   - **Phase:** [active phase] | Build: [status]
   - **Next:** [top next task]

**Does NOT execute:** `curl`, `pnpm docker:mcp:memory:*`, `git`, or any shell command.

### Orchestrator Simplification

Replace orchestrator SKILL.md Steps 1+2 with:
```
### Step 1: Session Startup
Invoke the `docker-preflight` skill. It reads the already-injected `## Session Memory`
context and delivers the 3-bullet report. Do not execute any Docker commands.
```

Update `.claude/CLAUDE.md § Memory Rules § Session start` to match:
```
Session start (always, in order):
1. Invoke docker-preflight skill — reads injected context, reports branch/phase/next
2. git log --oneline -5 && git status → confirm code state
```

### Files
| Action | File |
|--------|------|
| CREATE | `.claude/skills/docker-preflight/SKILL.md` |
| MODIFY | `.claude/skills/orchestrator/SKILL.md` — replace Steps 1+2 |
| MODIFY | `.claude/CLAUDE.md` — update § Memory Rules § Session start |

---

## Sub-Project A — Nav Taxonomy + isSector Flag + Industrial Category

### Problem
`navLinks` in `navbar-client.tsx` is hardcoded and disconnected from `projectCategories`. Current dropdown: All Projects, Browse Categories, Residential, Power Boards ❌, Commercial. Missing: Industrial ❌, Community ❌.

### Decision
Add `isSector: boolean` to `ProjectCategory`. Set true on sectors (residential, commercial, industrial, community), false on work types (commercial-lighting, power-boards). Make nav dynamic: `projectCategories.filter(c => c.isSector)`.

### Type Changes (`types/projects.ts`)

```typescript
// Add "industrial" to union
export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards"
  | "community"
  | "commercial"
  | "industrial";  // ADD

// Add isSector to interface
export interface ProjectCategory {
  slug: Exclude<ProjectCategorySlug, "all">;
  label: string;
  description: string;
  showInNav?: boolean;
  isSector: boolean;  // ADD — true = sector nav item, false = work-type filter
}
```

### Data Changes (`data/projects/index.ts`)

**projectCategories array updates:**
```typescript
{ slug: "residential",        isSector: true,  ... }
{ slug: "commercial",         isSector: true,  ... }
{ slug: "community",          isSector: true,  ... }
{ slug: "commercial-lighting",isSector: false, showInNav: false, ... }
{ slug: "power-boards",       isSector: false, ... }
// ADD:
{
  slug: "industrial",
  label: "Industrial",
  description: "High-voltage infrastructure, logistics, and manufacturing electrical projects.",
  isSector: true,
}
```

**Project migrations (category field update):**
| Project | Current category | New category |
|---------|-----------------|--------------|
| West Dock Industrial Upgrade (`proj-001`) | `power-boards` | `industrial` |
| Heathrow Cargo Substation Expansion | `power-boards` | `industrial` |

Also update `categoryLabel` fields for both projects to `"Industrial"`.

### Nav Component (`components/navigation/navbar-client.tsx`)

Replace hardcoded submenu items with dynamic read:
```typescript
import { projectCategories } from "@/data/projects";

const sectorLinks = projectCategories
  .filter(c => c.isSector)
  .map(c => ({ label: c.label, href: `/projects?category=${c.slug}` }));
```

Submenu renders from `sectorLinks` — no more hardcoded entries.

### Files
| Action | File |
|--------|------|
| MODIFY | `types/projects.ts` — add `isSector`, add `"industrial"` to union |
| MODIFY | `data/projects/index.ts` — add flags, add industrial category, migrate 2 projects |
| MODIFY | `components/navigation/navbar-client.tsx` — dynamic submenu |

---

## Sub-Project B — `/projects` Filter Bar Redesign

### Problem
Filter buttons are inside the hero (wrong position — user can't see list update). Taxonomy wrong (Power Boards, Commercial Lighting). Wraps on mobile.

### Decision
- **Remove** filter buttons from hero
- **Add** sticky filter bar ABOVE the project list
- **Taxonomy:** All Projects | Residential | Commercial | Industrial | Community (sectors only, sourced from `projectCategories.filter(c => c.isSector)`)
- **Slider:** `overflow-x-auto flex flex-nowrap scrollbar-hide` — never wraps on mobile
- **Sticky:** locks to top once hero scrolls out of viewport
- **Active state:** electric-cyan ring/underline on selected
- **Count badge:** e.g. "Residential (2)" — count from `allProjects.filter(p => p.category === slug).length`

### Component Spec (`components/projects/project-filter-bar.tsx`)

```typescript
// Client component — sticky + scroll
interface ProjectFilterBarProps {
  categories: ProjectCategory[];   // pre-filtered: isSector === true
  activeSlug: string;              // "all" | category slug
  counts: Record<string, number>;  // { all: N, residential: N, ... }
  onSelect: (slug: string) => void;
}
```

Sticky behaviour: `sticky top-0 z-40` with backdrop blur. Scroll snap on mobile slider.

### Page Changes (`app/projects/page.tsx`)
- Remove `<FilterButtons />` from hero section
- Add `<ProjectFilterBar>` between hero and project list
- Pass `projectCategories.filter(c => c.isSector)` + computed counts

### Files
| Action | File |
|--------|------|
| CREATE | `components/projects/project-filter-bar.tsx` |
| MODIFY | `app/projects/page.tsx` — remove hero filters, add sticky bar |

---

## Sub-Project C — `/projects/category` Specialist Sectors Redesign

### Problem
Plain 3-col card grid. No visual hierarchy. All categories shown equally.

### Decision — Two-Zone Layout

**Zone 1 — Specialist Sectors (4 large image-backed cards):**
- 2×2 grid desktop, 1-col mobile
- Sourced from `projectCategories.filter(c => c.isSector)`
- Each card: `coverImage` from most recently published project in that sector (`allProjects.filter(p => p.category === slug).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt))[0].coverImage.src`), sector name, project count badge, recent project title, `"View N Projects →"` CTA
- Route: `/projects?category=[slug]`

**Zone 2 — Work Types (horizontal filter pills):**
- Sourced from `data/projects/work-types.ts`
- Labels: Power Boards | Commercial Lighting | Office Fitout | 3-Phase | Emergency
- Route: `/projects/filter/[workType]` (new route — semantically separate from sectors)
- Same slider component as filter bar (or reuse `ProjectFilterBar` without sticky)

**New route `/projects/filter/[workType]`:**
- Receives `workType` slug → looks up in `workTypes` registry → extracts `tags[]`
- Filters `allProjects` by `p.tags.some(t => workType.tags.includes(t))`
- Renders same project list UI as `/projects` page

### New File: `data/projects/work-types.ts`

```typescript
export interface WorkType {
  slug: string;
  label: string;
  tags: string[];  // matches Project.tags values
}

export const workTypes: WorkType[] = [
  { slug: "power-boards",   label: "Power Boards",        tags: ["Switchgear", "Distribution", "Board", "3-Phase"] },
  { slug: "lighting",       label: "Commercial Lighting",  tags: ["LED", "Lighting", "Luminaire", "CIBSE"] },
  { slug: "office-fitout",  label: "Office Fitout",        tags: ["Cat B", "Fit-Out", "Retail"] },
  { slug: "three-phase",    label: "3-Phase",              tags: ["3-Phase", "High Voltage", "11kV", "33kV"] },
  { slug: "emergency",      label: "Emergency Systems",    tags: ["Emergency", "Fire", "Safety", "BS 5839"] },
];
```

### New Component: `components/projects/sector-card.tsx`

```typescript
interface SectorCardProps {
  category: ProjectCategory;
  projectCount: number;
  recentProjectTitle: string;
  coverImageSrc: string;
}
```

Large card: full-bleed background image, dark overlay, sector name (H2), count badge, recent project title, CTA arrow link.

### New Component: `components/projects/work-type-filter.tsx`

Horizontal slider of pill buttons. Reuses slider pattern from `ProjectFilterBar`. Links to `/projects/filter/[slug]`.

### Files
| Action | File |
|--------|------|
| CREATE | `data/projects/work-types.ts` |
| CREATE | `components/projects/sector-card.tsx` |
| CREATE | `components/projects/work-type-filter.tsx` |
| CREATE | `app/projects/filter/[workType]/page.tsx` |
| MODIFY | `app/projects/category/page.tsx` — two-zone layout |

---

## Sub-Project E — Python/MJS Runtime Policy

### Finding (research-confirmed, not a new decision)

The runtime split is already correct and intentional:

| Context | Runtime | Reason |
|---------|---------|--------|
| Git hooks (`post-checkout`, `post-commit`) | **Python** | Atomic writes (`Path.replace()`), no npm dependency, reliable in git context |
| Claude Code hooks (`.claude/settings.json`) | **MJS** | Node.js native, runs in Claude Code runtime |
| Session scripts (`scripts/*.mjs`) | **MJS** | Consistent with Claude Code runtime |

`memory_lane_checkout.py` uses `write_json_atomic()` (tmp-then-replace) specifically to prevent `active-branch.json` corruption from concurrent git operations. This is the race condition protection.

### Action Required

1. Document policy in `.claude/CLAUDE.md` (new § Scripts Runtime Policy)
2. Verify `scripts/install-git-hooks.mjs` wires the Python files as git hooks
3. No migration needed — policy is already correctly implemented

### Files
| Action | File |
|--------|------|
| MODIFY | `.claude/CLAUDE.md` — add § Scripts Runtime Policy |
| VERIFY | `scripts/install-git-hooks.mjs` — confirm Python hooks are installed |

---

## Build Order

1. Branch: `feat/projects-taxonomy-nav-preflight`
2. **Batch D** (independent) — docker-preflight skill + orchestrator simplification
3. **Batch A** — isSector types + industrial category + project migrations
4. **Batch B** — filter bar component + page wiring (depends on A)
5. **Batch C** — two-zone category page + work-types + new filter route (depends on A)
6. **Batch E** — CLAUDE.md policy doc + git hooks verification (independent)
7. Build gate: `pnpm typecheck && pnpm build` after each batch
8. Single PR with all batches, squash-merged to main

---

## Open Questions Resolved

| Q | Decision |
|---|---------|
| Industrial — migrate now or empty launch? | **Migrate now** — West Dock + Heathrow Cargo → `industrial` |
| `/projects/filter/[workType]` separate route? | **Yes** — sectors and work types are semantically distinct |
| docker-preflight — standalone skill or inline? | **Standalone skill (D1)** — composable, zero bash overhead |
| Race condition cause? | Concurrent `active-branch.json` writes during git checkout — Python atomic rename solves it |

---

## Dependency Graph

```
D (skill, independent)
A (data layer)
  └── B (filter bar — needs isSector categories)
  └── C (category redesign — needs isSector + industrial)
E (independent — policy doc only)
```

A → B, A → C are the only hard dependencies. D and E can run in any order.
