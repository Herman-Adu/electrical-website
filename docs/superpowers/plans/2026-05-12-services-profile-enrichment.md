# Implementation Plan: Services Profile Enrichment

**Feature:** feat-services-profile-enrichment  
**Branch:** feat/services-profile-enrichment  
**Spec:** docs/superpowers/specs/2026-05-12-services-profile-enrichment-design.md  
**Status:** PENDING  
**Created:** 2026-05-12

---

## Execution Strategy

Use `superpowers:subagent-driven-development`. Tasks 7+8+9 can be parallelised. All content values pre-loaded from Docker entity `feat-services-content-values` — do not re-derive.

---

## Task Sequence

### TASK 1 — Feature Branch + Commit Pending Changes
**Type:** Direct (git ops only)  
**Files:** 7 modified + 3 untracked image paths

```bash
git checkout -b feat/services-profile-enrichment
# Stage modified files
git add components/navigation/navbar-client.tsx
git add config/active-branch.json
git add data/services/commercial.ts
git add data/services/industrial.ts
git add data/services/residential.ts
git add docs/NEW_CHAT_MASTER_PROMPT.md
git add next-env.d.ts
# Stage new images
git add "public/images/projects/commercial/herschel-grammar/sports-hall-upgrade/"
git add "public/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-news-hero.jpeg"
git add "public/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-bank-staged-hero.jpeg"
git commit -m "feat: services data hero images and navbar updates (WIP baseline)"
```

---

### TASK 2 — Extend Types
**Type:** Direct, ~15 LOC  
**File:** `types/sections.ts`

Add to `SectionProfileData` interface:
```typescript
highlights?: { icon: IconName; title: string; description: string }[];
imageAspect?: 'portrait' | 'landscape';
```

Add to `SectionType` union:
```typescript
| 'features-animated' | 'live-dashboard'
```

---

### TASK 3 — Write Tests (TDD — before implementation)
**Type:** Delegate, ~60 LOC  
**Files:**
- `components/shared/__tests__/section-profile-enriched.test.tsx`
- `components/services/__tests__/service-page-renderer-extended.test.tsx`

Test cases:
- SectionProfile renders highlights grid when `highlights` provided
- SectionProfile renders quote block when `quote` provided
- SectionProfile uses `aspect-[4/3]` when `imageAspect='landscape'`
- SectionProfile uses `aspect-3/4` (default) when `imageAspect` undefined
- ServicePageRenderer renders `<Features />` for `type: 'features-animated'`
- ServicePageRenderer renders `<Dashboard />` for `type: 'live-dashboard'`

---

### TASK 4 — Enhance SectionProfile Component
**Type:** Delegate, ~80 LOC change  
**File:** `components/shared/section-profile.tsx`

Changes:
1. **Image ratio** — `aspect-3/4` → conditional: `imageAspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-3/4'`
2. **Highlights grid** — after bio paragraphs in content column: icon (electric-cyan) + bold title + muted description (3–4 items)
3. **Quote block** — styled blockquote with left border electric-cyan, italic text (field exists in type, NOT currently rendered)
4. **CTA button** — if `data.cta` present, render arrow-right CTA link (field exists in type, NOT currently rendered)

---

### TASK 5 — Extend ServicePageRenderer
**Type:** Direct, ~15 LOC  
**File:** `components/services/service-page-renderer.tsx`

```typescript
import { Features } from '@/components/sections/features';
import { Dashboard } from '@/components/sections/dashboard';

// In renderSection switch:
case 'features-animated':
  return <Features key={index} />;
case 'live-dashboard':
  return <Dashboard key={index} />;
```

---

### TASK 6 — Remove Features + Dashboard from Home Page
**Type:** Direct, ~8 LOC removed  
**File:** `app/page.tsx`

Remove from import: `Features`, `Dashboard`  
Remove JSX: `<Features />` (between Illumination and Schematic), `<Dashboard />` (between Schematic and SmartLiving)

New home page order: Hero → Services → Illumination → Schematic → SmartLiving → CTAPower → Footer

---

### TASK 7 — Industrial Data Enrichment
**Type:** Delegate, ~120 LOC  
**File:** `data/services/industrial.ts`  
**Content source:** `feat-services-content-values` Docker entity

After `intro`, prepend to sections array:
```typescript
{ type: 'features-animated' as const, data: {} },
{ type: 'live-dashboard' as const, data: {} },
```

Profile section updates:
| sectionId | image | imageAspect | highlights |
|---|---|---|---|
| `systems` | `nexgen-harvey-nichols-plant-room-installation.jpg` | `'landscape'` | Motor Control / PLC Integration / ATEX / Documentation |
| `power-distribution` | `nexgen-harvey-nichols-chiller-control-panel.jpg` | `'landscape'` | 11kV Design / Switchgear / Power Factor / Sub-Metering |
| `energy-management` | `nexgen-harvey-nichols-vfd-pump-controller.jpg` | `'landscape'` | SCADA / Demand Management / ISO 50001 / Sustainability |

---

### TASK 8 — Commercial Data Enrichment
**Type:** Delegate, ~100 LOC  
**File:** `data/services/commercial.ts`  
**Content source:** `feat-services-content-values` Docker entity

| sectionId | image | imageAspect | highlights |
|---|---|---|---|
| `installations` | `nexgen-dhl-reading-completed-operational-facility.jpg` | `'landscape'` | Design+Build / CDM / Programme / NICEIC |
| `lighting` | `commercial-lighting-hero-v2.JPG` (Herschel Grammar) | `'landscape'` | LED Retrofit / DALI-2 / BS EN 12464-1 / Emergency |
| `data-comms` | `nexgen-medivet-watford-electrical-distribution-board.jpg` | `'landscape'` | Cat6A / Server Room / 10-Year Warranty / AV+Access |

---

### TASK 9 — Residential Data Enrichment
**Type:** Delegate, ~80 LOC  
**File:** `data/services/residential.ts`  
**Content source:** `feat-services-content-values` Docker entity

| sectionId | image | imageAspect | highlights |
|---|---|---|---|
| `electrical` | `nexgen-taplow-completed-installation.jpg` | `'landscape'` | Full Rewires / Consumer Units / Part P / Extensions |
| `smart-home` | `nexgen-calcot-park-nest-thermostat-smart-heating.jpg` | `'landscape'` | EV Charge / Smart Lighting / Home Automation / Solar-Ready |

---

### TASK 10 — Build Gate
**Type:** Direct (verification only)

```bash
pnpm typecheck && pnpm build && pnpm test
```

Requirements: zero TypeScript errors, 81 static pages, all tests pass.

---

### TASK 11 — Visual Verification + Commit + PR
**Type:** Direct

Playwright verification (PLAYWRIGHT_REUSE_SERVER=true, dev server port 3000):
- `/services/industrial` — Features animated cards + Dashboard present; 3 landscape profile sections with highlights visible
- `/services/commercial` — 3 landscape profile sections; DHL/Herschel/Medivet images; highlights visible
- `/services/residential` — 2 landscape profile sections; Taplow/Calcot images; highlights visible
- `/` (home) — NO Features section, NO Dashboard section
- `/about` — portrait ratio unchanged (backward compat)

Commit message:
```
feat: services profile enrichment — real project images rich highlights industrial features+dashboard (#163)
```

PR: `feat/services-profile-enrichment` → `main`

---

## Architecture Constraints

- `imageAspect` defaults to portrait — About page untouched
- `highlights` is optional — undefined = no change to existing render
- `quote` already in `SectionProfileData` type — just add rendering
- `Features` and `Dashboard` take no props — use as-is
- `IconName` union confirmed: Zap Shield Award Settings Building2 CheckCircle Home Lightbulb Wrench Clock Gauge ClipboardCheck Activity — all present

---

## Docker Entities (load at session start)

| Entity | Purpose |
|---|---|
| `feat-services-profile-enrichment` | Feature spec, decisions, file list |
| `feat-services-content-values` | All 32 highlights pre-written + image paths |
| `nexgen-electrical-innovations-state` | Branch/build/next tasks |
