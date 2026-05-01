# Projects Taxonomy + Nav + Filter + Category + Preflight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix nav taxonomy, redesign `/projects` filter bar + `/projects/category` page, create `docker-preflight` skill to eliminate ~500-900 token waste per `/orchestrator` invocation, and document Python/MJS runtime policy.

**Architecture:** Batch D (skill files, independent) ships first. Batch A adds `isSector: boolean` to `ProjectCategory` and creates the `industrial` category — this is the data foundation that B and C depend on. Batch B moves the filter bar out of the hero. Batch C does the two-zone category page redesign. Batch E documents the scripts runtime policy.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Vitest + happy-dom, Tailwind CSS, pnpm

---

## File Map

| Action | File | Batch |
|--------|------|-------|
| CREATE | `.claude/skills/docker-preflight/SKILL.md` | D |
| MODIFY | `.claude/skills/orchestrator/SKILL.md` | D |
| MODIFY | `.claude/CLAUDE.md` | D, E |
| MODIFY | `types/projects.ts` | A |
| MODIFY | `data/projects/index.ts` | A |
| MODIFY | `components/navigation/navbar-client.tsx` | A |
| CREATE | `__tests__/projects/taxonomy.test.ts` | A |
| CREATE | `components/projects/project-filter-bar.tsx` | B |
| MODIFY | `app/projects/page.tsx` | B |
| CREATE | `__tests__/projects/filter-bar.test.tsx` | B |
| CREATE | `data/projects/work-types.ts` | C |
| CREATE | `components/projects/sector-card.tsx` | C |
| CREATE | `components/projects/work-type-filter.tsx` | C |
| CREATE | `app/projects/filter/[workType]/page.tsx` | C |
| MODIFY | `app/projects/category/page.tsx` | C |
| CREATE | `__tests__/projects/work-types.test.ts` | C |

---

## Batch D — Docker Preflight Skill

> **Independent — no TypeScript changes. No typecheck needed. Commit after D3.**

---

### Task D1: Create docker-preflight SKILL.md

**Files:**
- Create: `.claude/skills/docker-preflight/SKILL.md`

- [ ] **Step 1: Create the skills directory**

```bash
mkdir -p .claude/skills/docker-preflight
```

- [ ] **Step 2: Write the skill file**

Create `.claude/skills/docker-preflight/SKILL.md`:

```markdown
---
name: docker-preflight
description: Use at EVERY session start to validate Docker health, confirm memory rehydration, check lane/branch state, and deliver the 3-bullet status report. Reads from the injected ## Session Memory block — never re-runs Docker commands. Invoked by orchestrator as its FIRST action. Trigger on: session start, /orchestrator, "what's the status", "load context", "check branch", "where were we", "resume work".
argument-hint: "[none required]"
disable-model-invocation: true
---

# Docker Preflight

## What this does

Reads the `## Session Memory` block already injected by the `SessionStart` hook
(`session-start-v2.mjs` → `memory-rehydrate.mjs`). Reports status. Does NOT
execute bash commands or call Docker APIs — the hook already ran them.

## Steps (run in order, then STOP)

### Step 1: Locate the injected block

Find `## Session Memory` in the current session context (it appears in a
`<system-reminder>` block at session start). It has this structure:

```
## Session Memory — YYYY-MM-DD [NNN tokens]

> Branch: <branch> | Lane: <entity> | Docker: online|OFFLINE
> [optional: WARNING: Branch mismatch — ...]

### Project State
...

### Active Lane (<entity>)
...
```

### Step 2: Extract these fields

| Field | Location |
|-------|----------|
| Current branch | `> Branch:` line |
| Lane entity | `> Lane:` line |
| Docker status | `> Docker:` field (online / OFFLINE) |
| Active phase | `### Project State` — look for `Active phase:` observation |
| Build status | `### Project State` — look for `Build status:` observation |
| Next tasks | `### Project State` — look for `Next tasks:` observation |
| Lane status | `### Active Lane` — look for `lane_status:` observation |

### Step 3: Validate

Check for these alert conditions in the injected block:

- `WARNING: Branch mismatch` → tell user: "Run `pnpm lane:activate` to correct the lane."
- `Docker: OFFLINE` → tell user: "Run `pnpm docker:mcp:ready` to restore Docker."
- `lane_status: paused` → tell user: "Run `pnpm lane:activate` to resume lane."

### Step 4: Report — exactly 3 bullets, then STOP

```
- **Branch:** [branch name] | Lane: [entity] ([lane_status])
- **Phase:** [active phase] | Build: [build status]
- **Next:** [top next task from Project State]
```

**Do not proceed. Do not run git commands. Do not run Docker commands.
Wait for user instruction.**
```

- [ ] **Step 3: Verify frontmatter schema compliance**

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('.claude/skills/docker-preflight/SKILL.md','utf8');
const fm = content.match(/^---\n([\s\S]*?)\n---/);
const fields = fm[1];
['name','description','argument-hint','disable-model-invocation'].forEach(f => {
  if (!fields.includes(f + ':')) throw new Error('Missing field: ' + f);
});
console.log('Frontmatter valid');
"
```
Expected: `Frontmatter valid`

---

### Task D2: Simplify orchestrator SKILL.md

**Files:**
- Modify: `.claude/skills/orchestrator/SKILL.md`

The current Steps 1+2 run Docker health check and Docker memory load commands.
These are redundant — `session-start-v2.mjs` already ran them. Replace them.

- [ ] **Step 1: Open the file and locate Steps 1+2**

Current content (lines ~10–34):
```
### Step 1: Docker Preflight
Check Docker MCP stack health:
```bash
curl -sf http://localhost:3100/health
```
If offline: note "Docker offline" and use git history as fallback. Do not block — continue.

### Step 2: Load Project State
```bash
pnpm docker:mcp:memory:search "electrical-website-state"
pnpm docker:mcp:memory:open electrical-website-state
```
Read: `current_branch`, `active_phase`, `next_tasks`, `blockers` from entity observations.

**Lane validation (automatic — review injected context):**
The `## Session Memory` block injected at session start contains the active lane status.
Check the `> Branch:` and `Lane:` fields in the injected context.

- If `BRANCH MISMATCH` appears → run `pnpm lane:activate` and report to user
- If `Lane: paused` → run `pnpm lane:activate` to re-activate current branch lane
- If `Docker: OFFLINE` → memory loaded from emergency summary; run `pnpm docker:mcp:ready`

Include active lane status in the 3-bullet report:
**Lane:** [lane-entity-name] ([status] | last synced [Xh ago])
```

- [ ] **Step 2: Replace Steps 1+2 with the delegating line**

Replace everything from `### Step 1: Docker Preflight` through the end of Step 2
(including the Lane validation block and the "Include active lane..." line) with:

```markdown
### Step 1: Session Startup
Invoke the `docker-preflight` skill. It reads the already-injected `## Session Memory`
context — delivered by `session-start-v2.mjs` at session start — and reports the
3-bullet status. **Do not execute any Docker or git commands here.**
```

The remaining steps (Step 3: Git State, Step 4: Report and STOP) stay unchanged.

- [ ] **Step 3: Verify the file still validates**

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('.claude/skills/orchestrator/SKILL.md','utf8');
if (content.includes('pnpm docker:mcp:memory:search')) throw new Error('Old Docker commands still present');
if (content.includes('docker-preflight')) console.log('OK — docker-preflight invoke present');
else throw new Error('Missing docker-preflight reference');
"
```
Expected: `OK — docker-preflight invoke present`

---

### Task D3: Update CLAUDE.md Memory Rules

**Files:**
- Modify: `.claude/CLAUDE.md`

- [ ] **Step 1: Find the Session start section**

Look for:
```
Session start (always, in order):

1. `pnpm docker:mcp:memory:search "electrical-website-state"` → note entity IDs
2. `pnpm docker:mcp:memory:open electrical-website-state` → read current phase, next tasks, blockers
3. `git log --oneline -5 && git status` → confirm code state
```

- [ ] **Step 2: Replace with the updated steps**

```markdown
Session start (always, in order):

1. Invoke `docker-preflight` skill — reads injected `## Session Memory`, reports branch/phase/next, no Docker commands
2. `git log --oneline -5 && git status` → confirm code state
```

---

### Batch D Gate + Commit

- [ ] **Verify no regressions (skill files only — no TypeScript)**

```bash
node -e "
['docker-preflight','orchestrator'].forEach(s => {
  const fs = require('fs');
  const p = '.claude/skills/' + s + '/SKILL.md';
  const c = fs.readFileSync(p,'utf8');
  if (!c.includes('name:')) throw new Error(s + ' missing name field');
  console.log(s + ': OK');
});
"
```
Expected:
```
docker-preflight: OK
orchestrator: OK
```

- [ ] **Commit Batch D**

```bash
git add .claude/skills/docker-preflight/SKILL.md \
        .claude/skills/orchestrator/SKILL.md \
        .claude/CLAUDE.md
git commit -m "feat: add docker-preflight skill, simplify orchestrator steps 1+2

Eliminates ~500-900 token waste per /orchestrator invocation.
SessionStart hook already runs Docker load — orchestrator was re-running it.
docker-preflight reads injected ## Session Memory, zero bash execution."
```

---

## Batch A — isSector Flag + Industrial Category + Dynamic Nav

> **Data layer. B and C depend on this batch. Run build gate after commit.**

---

### Task A1: Write failing taxonomy test

**Files:**
- Create: `__tests__/projects/taxonomy.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
import { describe, expect, it } from "vitest";
import {
  projectCategories,
  allProjects,
  isProjectCategorySlug,
} from "@/data/projects";

describe("project taxonomy — isSector flag", () => {
  it("exposes exactly 4 sector categories", () => {
    const sectors = projectCategories.filter((c) => c.isSector);
    expect(sectors).toHaveLength(4);
    const slugs = sectors.map((s) => s.slug);
    expect(slugs).toContain("residential");
    expect(slugs).toContain("commercial");
    expect(slugs).toContain("industrial");
    expect(slugs).toContain("community");
  });

  it("marks power-boards and commercial-lighting as non-sector", () => {
    const nonSectors = projectCategories.filter((c) => !c.isSector);
    const slugs = nonSectors.map((s) => s.slug);
    expect(slugs).toContain("power-boards");
    expect(slugs).toContain("commercial-lighting");
  });

  it("includes industrial as a valid category slug", () => {
    expect(isProjectCategorySlug("industrial")).toBe(true);
  });

  it("has at least 1 project in the industrial category", () => {
    const industrial = allProjects.filter((p) => p.category === "industrial");
    expect(industrial.length).toBeGreaterThanOrEqual(1);
  });

  it("migrates West Dock Industrial Upgrade to industrial", () => {
    const project = allProjects.find(
      (p) => p.slug === "west-dock-industrial-upgrade"
    );
    expect(project).toBeDefined();
    expect(project!.category).toBe("industrial");
    expect(project!.categoryLabel).toBe("Industrial");
  });

  it("migrates Heathrow Cargo Substation Expansion to industrial", () => {
    const project = allProjects.find(
      (p) => p.slug === "heathrow-cargo-substation-expansion"
    );
    expect(project).toBeDefined();
    expect(project!.category).toBe("industrial");
    expect(project!.categoryLabel).toBe("Industrial");
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test __tests__/projects/taxonomy.test.ts
```
Expected: FAIL — `isSector` property does not exist, `industrial` not in union

---

### Task A2: Update types/projects.ts

**Files:**
- Modify: `types/projects.ts`

- [ ] **Step 1: Add `"industrial"` to `ProjectCategorySlug` union**

Find:
```typescript
export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards"
  | "community"
  | "commercial";
```

Replace with:
```typescript
export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards"
  | "community"
  | "commercial"
  | "industrial";
```

- [ ] **Step 2: Add `isSector` to `ProjectCategory` interface**

Find:
```typescript
export interface ProjectCategory {
  slug: Exclude<ProjectCategorySlug, "all">;
  label: string;
  description: string;
  showInNav?: boolean;
}
```

Replace with:
```typescript
export interface ProjectCategory {
  slug: Exclude<ProjectCategorySlug, "all">;
  label: string;
  description: string;
  showInNav?: boolean;
  isSector: boolean;
}
```

---

### Task A3: Update data/projects/index.ts

**Files:**
- Modify: `data/projects/index.ts`

- [ ] **Step 1: Add `isSector` flags and `industrial` category to `projectCategories`**

Find the `projectCategories` array and replace it entirely:

```typescript
export const projectCategories: ProjectCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description: "Home and domestic electrical delivery projects.",
    isSector: true,
  },
  {
    slug: "commercial",
    label: "Commercial",
    description:
      "Full Cat B fit-out and electrical infrastructure for commercial and logistics facilities.",
    isSector: true,
  },
  {
    slug: "industrial",
    label: "Industrial",
    description:
      "High-voltage infrastructure, logistics, and manufacturing electrical projects.",
    isSector: true,
  },
  {
    slug: "community",
    label: "Community",
    description:
      "Public sector, community facilities, and social infrastructure electrical projects.",
    isSector: true,
  },
  {
    slug: "commercial-lighting",
    label: "Commercial Lighting",
    description:
      "Retail, office, and mixed-use lighting modernisation projects.",
    showInNav: false,
    isSector: false,
  },
  {
    slug: "power-boards",
    label: "Power Boards",
    description:
      "Distribution, switchgear, and board upgrade infrastructure projects.",
    isSector: false,
  },
];
```

- [ ] **Step 2: Migrate West Dock Industrial Upgrade**

Find (around line 50–55):
```typescript
    slug: "west-dock-industrial-upgrade",
    category: "power-boards",
    categoryLabel: "Power Boards",
```

Replace:
```typescript
    slug: "west-dock-industrial-upgrade",
    category: "industrial",
    categoryLabel: "Industrial",
```

- [ ] **Step 3: Migrate Heathrow Cargo Substation Expansion**

Find (around line 982–985):
```typescript
    slug: "heathrow-cargo-substation-expansion",
    category: "power-boards",
    categoryLabel: "Power Boards",
```

Replace:
```typescript
    slug: "heathrow-cargo-substation-expansion",
    category: "industrial",
    categoryLabel: "Industrial",
```

- [ ] **Step 4: Run the taxonomy test — verify it passes**

```bash
pnpm test __tests__/projects/taxonomy.test.ts
```
Expected: PASS — 6 tests passing

---

### Task A4: Update navbar-client.tsx — dynamic Projects submenu

**Files:**
- Modify: `components/navigation/navbar-client.tsx`

- [ ] **Step 1: Add import for projectCategories**

After the existing imports, add:
```typescript
import { projectCategories } from "@/data/projects";
```

- [ ] **Step 2: Replace hardcoded Projects submenu entries**

Find this block in `navLinks`:
```typescript
  {
    name: "Projects",
    href: "/projects",
    submenu: [
      { name: "All Projects", href: "/projects" },
      { name: "Browse Categories", href: "/projects/category" },
      { name: "Residential", href: "/projects/category/residential" },
      { name: "Power Boards", href: "/projects/category/power-boards" },
      { name: "Commercial", href: "/projects/category/commercial" },
    ],
  },
```

Replace with (move `navLinks` outside the component body so it's computed once, or keep it inside — but note `projectCategories` is a module-level constant so this is fine at module scope):

```typescript
  {
    name: "Projects",
    href: "/projects",
    submenu: [
      { name: "All Projects", href: "/projects" },
      { name: "Browse Categories", href: "/projects/category" },
      ...projectCategories
        .filter((c) => c.isSector)
        .map((c) => ({
          name: c.label,
          href: `/projects/category/${c.slug}`,
        })),
    ],
  },
```

---

### Batch A Gate + Commit

- [ ] **Run typecheck**

```bash
pnpm typecheck
```
Expected: 0 errors. If TypeScript flags any `category: "power-boards"` assignments on projects that should be `"industrial"`, fix them (should already be done in Task A3).

- [ ] **Run build**

```bash
pnpm build
```
Expected: all pages pass, 0 errors.

- [ ] **Run all tests**

```bash
pnpm test
```
Expected: all passing including the new taxonomy test.

- [ ] **Commit Batch A**

```bash
git add types/projects.ts \
        data/projects/index.ts \
        components/navigation/navbar-client.tsx \
        __tests__/projects/taxonomy.test.ts
git commit -m "feat: isSector taxonomy, industrial category, dynamic nav submenu

Adds isSector flag to ProjectCategory — sectors: residential, commercial,
industrial, community. Work types: commercial-lighting, power-boards.
Migrates West Dock + Heathrow Cargo from power-boards to industrial.
Nav Projects submenu now data-driven from projectCategories.filter(c => c.isSector)."
```

---

## Batch B — /projects Sticky Filter Bar

> **Depends on Batch A (needs isSector categories). Run typecheck + build after commit.**

---

### Task B1: Write failing filter bar test

**Files:**
- Create: `__tests__/projects/filter-bar.test.tsx`

- [ ] **Step 1: Write the test**

```typescript
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import type { ProjectCategory } from "@/types/projects";

const mockSectors: ProjectCategory[] = [
  { slug: "residential", label: "Residential", description: "", isSector: true },
  { slug: "commercial", label: "Commercial", description: "", isSector: true },
  { slug: "industrial", label: "Industrial", description: "", isSector: true },
  { slug: "community", label: "Community", description: "", isSector: true },
];

const mockCounts: Record<string, number> = {
  all: 10,
  residential: 3,
  commercial: 4,
  industrial: 2,
  community: 1,
};

describe("ProjectFilterBar", () => {
  it("renders All Projects button", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /All Projects/i })).toBeDefined();
  });

  it("renders a button for each sector", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /Residential/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Commercial/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Industrial/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Community/i })).toBeDefined();
  });

  it("calls onSelect with the slug when a sector button is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Residential/i }));
    expect(onSelect).toHaveBeenCalledWith("residential");
  });

  it("shows project count badge next to each sector", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("3")).toBeDefined(); // residential count
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test __tests__/projects/filter-bar.test.tsx
```
Expected: FAIL — `ProjectFilterBar` does not exist

---

### Task B2: Create project-filter-bar.tsx

**Files:**
- Create: `components/projects/project-filter-bar.tsx`

- [ ] **Step 1: Write the component**

```typescript
"use client";

import type { ProjectCategory } from "@/types/projects";

interface ProjectFilterBarProps {
  categories: ProjectCategory[];
  activeSlug: string;
  counts: Record<string, number>;
  onSelect: (slug: string) => void;
}

export function ProjectFilterBar({
  categories,
  activeSlug,
  counts,
  onSelect,
}: ProjectFilterBarProps) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 py-3">
          <button
            onClick={() => onSelect("all")}
            className={[
              "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeSlug === "all"
                ? "bg-cyan-400 text-black ring-2 ring-cyan-400"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            ].join(" ")}
          >
            All Projects
            {counts.all != null && (
              <span className="ml-1.5 text-xs opacity-70">{counts.all}</span>
            )}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat.slug)}
              className={[
                "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeSlug === cat.slug
                  ? "bg-cyan-400 text-black ring-2 ring-cyan-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              ].join(" ")}
            >
              {cat.label}
              {counts[cat.slug] != null && (
                <span className="ml-1.5 text-xs opacity-70">
                  {counts[cat.slug]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run filter bar test — verify it passes**

```bash
pnpm test __tests__/projects/filter-bar.test.tsx
```
Expected: PASS — 4 tests passing

---

### Task B3: Update app/projects/page.tsx

**Files:**
- Modify: `app/projects/page.tsx`

This is a Server Component at the top level. The filter bar needs `"use client"` state
for the active slug. The pattern: keep the page as a Server Component, wrap the filter
bar + list in a client component that holds filter state.

- [ ] **Step 1: Create the client wrapper for filter state**

Create `components/projects/projects-list-with-filter.tsx`:

```typescript
"use client";

import { useState } from "react";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import type { Project, ProjectCategory } from "@/types/projects";

interface ProjectsListWithFilterProps {
  sectors: ProjectCategory[];
  allProjects: Project[];
}

export function ProjectsListWithFilter({
  sectors,
  allProjects,
}: ProjectsListWithFilterProps) {
  const [activeSlug, setActiveSlug] = useState("all");

  const counts: Record<string, number> = {
    all: allProjects.length,
    ...Object.fromEntries(
      sectors.map((s) => [
        s.slug,
        allProjects.filter((p) => p.category === s.slug).length,
      ])
    ),
  };

  const filtered =
    activeSlug === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === activeSlug);

  return (
    <>
      <ProjectFilterBar
        categories={sectors}
        activeSlug={activeSlug}
        counts={counts}
        onSelect={setActiveSlug}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div key={project.id} className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">{project.categoryLabel}</p>
              <h3 className="mt-1 font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

Note: the existing project card component in `app/projects/page.tsx` should be reused
if one exists — replace the `<div>` inside the map with the existing card component.
Check the file before implementing and slot in whatever card component is already there.

- [ ] **Step 2: Locate the filter buttons in app/projects/page.tsx**

Read the current file. Find where filter buttons are rendered (likely inside the hero
section). Remove them. Import `ProjectsListWithFilter` and pass it the data:

```typescript
// At the top of app/projects/page.tsx (Server Component — no "use client"):
import { projectCategories, allProjects } from "@/data/projects";
import { ProjectsListWithFilter } from "@/components/projects/projects-list-with-filter";

// Inside the page JSX, REMOVE the existing filter button section from the hero.
// BELOW the hero section, ADD:
<ProjectsListWithFilter
  sectors={projectCategories.filter((c) => c.isSector)}
  allProjects={allProjects}
/>
```

The existing project list rendering (if any) inside the page should be replaced by
the `ProjectsListWithFilter` component which handles both filtering and rendering.

---

### Batch B Gate + Commit

- [ ] **Run typecheck + build**

```bash
pnpm typecheck && pnpm build
```
Expected: 0 errors, all pages pass.

- [ ] **Run all tests**

```bash
pnpm test
```
Expected: all passing.

- [ ] **Commit Batch B**

```bash
git add components/projects/project-filter-bar.tsx \
        components/projects/projects-list-with-filter.tsx \
        app/projects/page.tsx \
        __tests__/projects/filter-bar.test.tsx
git commit -m "feat: sticky filter bar above project list, data-driven sector taxonomy

Removes filter buttons from hero. New sticky ProjectFilterBar above list.
Sectors: All | Residential | Commercial | Industrial | Community.
Count badges per sector. ProjectsListWithFilter client wrapper for state."
```

---

## Batch C — /projects/category Two-Zone Redesign

> **Depends on Batch A (needs isSector, industrial). 5 new/modified files. Run typecheck + build after commit.**

---

### Task C1: Write failing work-types test

**Files:**
- Create: `__tests__/projects/work-types.test.ts`

- [ ] **Step 1: Write the test**

```typescript
import { describe, expect, it } from "vitest";
import { workTypes, getProjectsByWorkType } from "@/data/projects/work-types";
import { allProjects } from "@/data/projects";

describe("work type registry", () => {
  it("has 5 work types with unique slugs", () => {
    expect(workTypes).toHaveLength(5);
    const slugs = workTypes.map((w) => w.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(5);
  });

  it("each work type has at least one tag", () => {
    workTypes.forEach((wt) => {
      expect(wt.tags.length).toBeGreaterThan(0);
    });
  });

  it("getProjectsByWorkType filters by tag overlap", () => {
    const powerBoardWt = workTypes.find((w) => w.slug === "power-boards");
    expect(powerBoardWt).toBeDefined();
    const results = getProjectsByWorkType(powerBoardWt!.slug, allProjects);
    // At least some projects should have switchgear/distribution tags
    results.forEach((p) => {
      const hasMatch = p.tags.some((t) =>
        powerBoardWt!.tags.includes(t)
      );
      expect(hasMatch).toBe(true);
    });
  });

  it("getProjectsByWorkType returns empty array for unknown slug", () => {
    const results = getProjectsByWorkType("nonexistent", allProjects);
    expect(results).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test __tests__/projects/work-types.test.ts
```
Expected: FAIL — `work-types` module does not exist

---

### Task C2: Create data/projects/work-types.ts

**Files:**
- Create: `data/projects/work-types.ts`

- [ ] **Step 1: Write the module**

```typescript
import type { Project } from "@/types/projects";

export interface WorkType {
  slug: string;
  label: string;
  tags: string[];
}

export const workTypes: WorkType[] = [
  {
    slug: "power-boards",
    label: "Power Boards",
    tags: ["Switchgear", "Distribution", "Board", "3-Phase"],
  },
  {
    slug: "lighting",
    label: "Commercial Lighting",
    tags: ["LED", "Lighting", "Luminaire", "CIBSE"],
  },
  {
    slug: "office-fitout",
    label: "Office Fitout",
    tags: ["Cat B", "Fit-Out", "Retail"],
  },
  {
    slug: "three-phase",
    label: "3-Phase",
    tags: ["3-Phase", "High Voltage", "11kV", "33kV"],
  },
  {
    slug: "emergency",
    label: "Emergency Systems",
    tags: ["Emergency", "Fire", "Safety", "BS 5839"],
  },
];

export function getProjectsByWorkType(
  slug: string,
  projects: Project[]
): Project[] {
  const workType = workTypes.find((wt) => wt.slug === slug);
  if (!workType) return [];
  return projects.filter((p) =>
    p.tags.some((tag) => workType.tags.includes(tag))
  );
}

export function getWorkTypeBySlug(slug: string): WorkType | undefined {
  return workTypes.find((wt) => wt.slug === slug);
}
```

- [ ] **Step 2: Run work-types test — verify it passes**

```bash
pnpm test __tests__/projects/work-types.test.ts
```
Expected: PASS — 4 tests passing

---

### Task C3: Create sector-card.tsx

**Files:**
- Create: `components/projects/sector-card.tsx`

- [ ] **Step 1: Write the component**

```typescript
import Link from "next/link";
import Image from "next/image";
import type { ProjectCategory } from "@/types/projects";

interface SectorCardProps {
  category: ProjectCategory;
  projectCount: number;
  recentProjectTitle: string;
  coverImageSrc: string;
  coverImageAlt: string;
}

export function SectorCard({
  category,
  projectCount,
  recentProjectTitle,
  coverImageSrc,
  coverImageAlt,
}: SectorCardProps) {
  return (
    <Link
      href={`/projects/category/${category.slug}`}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72"
    >
      <Image
        src={coverImageSrc}
        alt={coverImageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{category.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">
            {projectCount}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/70 line-clamp-1">
          {recentProjectTitle}
        </p>
        <p className="mt-2 text-xs font-medium text-cyan-400">
          View {projectCount} project{projectCount !== 1 ? "s" : ""} →
        </p>
      </div>
    </Link>
  );
}
```

---

### Task C4: Create work-type-filter.tsx

**Files:**
- Create: `components/projects/work-type-filter.tsx`

- [ ] **Step 1: Write the component**

```typescript
import Link from "next/link";
import type { WorkType } from "@/data/projects/work-types";

interface WorkTypeFilterProps {
  workTypes: WorkType[];
  activeSlug?: string;
}

export function WorkTypeFilter({ workTypes, activeSlug }: WorkTypeFilterProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
      {workTypes.map((wt) => (
        <Link
          key={wt.slug}
          href={`/projects/filter/${wt.slug}`}
          className={[
            "flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === wt.slug
              ? "bg-cyan-400 text-black"
              : "border border-border bg-card text-muted-foreground hover:border-cyan-400/50 hover:text-foreground",
          ].join(" ")}
        >
          {wt.label}
        </Link>
      ))}
    </div>
  );
}
```

---

### Task C5: Create app/projects/filter/[workType]/page.tsx

**Files:**
- Create: `app/projects/filter/[workType]/page.tsx`

- [ ] **Step 1: Write the route**

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { allProjects } from "@/data/projects";
import {
  getProjectsByWorkType,
  getWorkTypeBySlug,
  workTypes,
} from "@/data/projects/work-types";

interface PageProps {
  params: Promise<{ workType: string }>;
}

export function generateStaticParams() {
  return workTypes.map((wt) => ({ workType: wt.slug }));
}

export default async function WorkTypeFilterPage({ params }: PageProps) {
  const { workType: slug } = await params;
  const workType = getWorkTypeBySlug(slug);
  if (!workType) notFound();

  const projects = getProjectsByWorkType(slug, allProjects);

  return (
    <main className="min-h-screen pt-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/projects/category"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Categories
          </Link>
          <h1 className="mt-4 text-3xl font-bold">{workType.label}</h1>
          <p className="mt-2 text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects found for this work type.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="rounded-xl border bg-card p-5 hover:border-cyan-400/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground">{project.categoryLabel}</p>
                <h3 className="mt-1 font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
```

---

### Task C6: Redesign app/projects/category/page.tsx

**Files:**
- Modify: `app/projects/category/page.tsx`

- [ ] **Step 1: Read the current file to understand its structure**

Before modifying, read the current `app/projects/category/page.tsx` to understand what
data it currently loads and what components it renders. Note any existing hero or header
section — keep it.

- [ ] **Step 2: Replace the page body with the two-zone layout**

The new page is a Server Component. It computes sector cards data and passes to components.

```typescript
import { projectCategories, allProjects } from "@/data/projects";
import { workTypes } from "@/data/projects/work-types";
import { SectorCard } from "@/components/projects/sector-card";
import { WorkTypeFilter } from "@/components/projects/work-type-filter";

export default function ProjectCategoryPage() {
  const sectors = projectCategories.filter((c) => c.isSector);

  const sectorCardData = sectors.map((cat) => {
    const catProjects = allProjects
      .filter((p) => p.category === cat.slug)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    const mostRecent = catProjects[0];

    return {
      category: cat,
      projectCount: catProjects.length,
      recentProjectTitle: mostRecent?.title ?? "Coming soon",
      coverImageSrc: mostRecent?.coverImage.src ?? "/images/services-industrial.jpg",
      coverImageAlt: mostRecent?.coverImage.alt ?? cat.label,
    };
  });

  return (
    <main className="min-h-screen pt-24">
      {/* Keep existing hero/header if present — do not remove it */}

      {/* Zone 1 — Specialist Sectors */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-2">Specialist Sectors</h2>
        <p className="text-muted-foreground mb-8">
          Browse our work by sector
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {sectorCardData.map((data) => (
            <SectorCard key={data.category.slug} {...data} />
          ))}
        </div>
      </section>

      {/* Zone 2 — Work Types */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-semibold mb-2">Browse by Work Type</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Filter across all sectors by the type of electrical work
        </p>
        <WorkTypeFilter workTypes={workTypes} />
      </section>
    </main>
  );
}
```

---

### Batch C Gate + Commit

- [ ] **Run typecheck + build**

```bash
pnpm typecheck && pnpm build
```
Expected: all pages pass including the new `/projects/filter/[workType]` routes (5 static pages).

- [ ] **Run all tests**

```bash
pnpm test
```
Expected: all passing including work-types test.

- [ ] **Commit Batch C**

```bash
git add data/projects/work-types.ts \
        components/projects/sector-card.tsx \
        components/projects/work-type-filter.tsx \
        app/projects/filter/ \
        app/projects/category/page.tsx \
        __tests__/projects/work-types.test.ts
git commit -m "feat: two-zone category page, sector cards, work-type filter route

Zone 1: 4 large image-backed sector cards (2x2 grid desktop, 1-col mobile).
Zone 2: Work-type filter pills — Power Boards, Lighting, Office Fitout, 3-Phase, Emergency.
New /projects/filter/[workType] route with tag-based cross-sector filtering.
New data/projects/work-types.ts registry with getProjectsByWorkType util."
```

---

## Batch E — Python/MJS Runtime Policy

> **Independent of A/B/C. Documentation only. No typecheck needed.**

---

### Task E1: Add Scripts Runtime Policy to CLAUDE.md

**Files:**
- Modify: `.claude/CLAUDE.md`

- [ ] **Step 1: Add a new section after the MCP Stack section**

Insert after the `## MCP Stack` section:

```markdown
## Scripts Runtime Policy

| Context | Runtime | Reason |
|---------|---------|--------|
| Claude Code hooks (`.claude/settings.json`) | **Node.js MJS** | Runs in Claude Code runtime — Node.js guaranteed |
| Session scripts (`scripts/*.mjs`) | **Node.js MJS** | Consistent with Claude Code runtime |
| Git hooks (`post-checkout`, `post-commit`) | **Python 3** | `Path.replace()` atomic writes prevent `active-branch.json` corruption; no npm dependency needed in git hook context |

**Never wire an MJS script as a git hook.** Node.js is not guaranteed in git hook PATH.
**Never wire a Python script as a Claude Code hook.** Use MJS for Claude Code hooks only.

Git hook scripts: `scripts/memory_lane_checkout.py`, `scripts/memory_lane_commit.py`
Install via: `node scripts/install-git-hooks.mjs`
```

- [ ] **Step 2: Verify git hooks are installed**

```bash
ls .git/hooks/ | grep -E "post-checkout|post-commit"
```
Expected: both `post-checkout` and `post-commit` are present.

If not, run:
```bash
node scripts/install-git-hooks.mjs
```

---

### Batch E Gate + Commit

- [ ] **Commit Batch E**

```bash
git add .claude/CLAUDE.md
git commit -m "docs: Python/MJS runtime policy — git hooks vs Claude Code hooks

Python for git hooks (atomic writes, no npm deps).
MJS for Claude Code hooks and session scripts.
Documents the intentional runtime split established in orchestration-optimization PR."
```

---

## Final Gate

- [ ] **Full test run**

```bash
pnpm test
```
Expected: all tests passing.

- [ ] **Full typecheck + build**

```bash
pnpm typecheck && pnpm build
```
Expected: 0 TypeScript errors, all pages compile.

- [ ] **Push all commits**

```bash
git push
```

- [ ] **Open PR for review**

```bash
gh pr create \
  --title "feat: projects taxonomy, nav, filter bar, category redesign, docker-preflight skill" \
  --body "$(cat <<'EOF'
## Summary

- **D:** `docker-preflight` skill — eliminates ~500-900 token waste per `/orchestrator` invocation
- **A:** `isSector` taxonomy, `industrial` category, migrate 2 projects, dynamic nav
- **B:** Sticky filter bar above project list (replaces hardcoded hero filters)
- **C:** Two-zone `/projects/category` — sector cards + work-type filter pills + new `/projects/filter/[workType]` route
- **E:** Python/MJS runtime policy documented in CLAUDE.md

## Test plan
- [ ] Run `pnpm test` — all passing
- [ ] Run `pnpm typecheck && pnpm build` — 0 errors
- [ ] Verify nav Projects dropdown shows Residential, Commercial, Industrial, Community
- [ ] Verify West Dock + Heathrow Cargo appear under Industrial filter
- [ ] Verify `/projects/filter/power-boards` returns correct projects
- [ ] Verify `/projects/category` shows 4 sector cards + work type pills

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review Findings

1. **Spec coverage:** All 5 sub-projects covered. Batch D (preflight), A (taxonomy/nav), B (filter bar), C (two-zone + route), E (policy) — all have tasks.

2. **Placeholder scan:** No TBD or TODO present. Task B3 Step 2 notes "check the file before implementing" — this is intentional guidance (the existing project card component should be reused), not a placeholder.

3. **Type consistency:**
   - `ProjectCategory.isSector: boolean` defined in Task A2, used in A3, A4, B2, C6 ✓
   - `WorkType` interface defined in Task C2, used in C4 ✓
   - `getProjectsByWorkType(slug, projects)` defined in C2, used in C5 ✓
   - `getWorkTypeBySlug(slug)` defined in C2, used in C5 ✓
   - `ProjectFilterBarProps.categories` typed as `ProjectCategory[]` in B2, passed correctly in B3 ✓

4. **Batch B — additional file:** `components/projects/projects-list-with-filter.tsx` added in Task B3 Step 1. Added to the File Map above.
