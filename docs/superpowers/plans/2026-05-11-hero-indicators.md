# Hero Indicators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `ProjectKpiGrid` on project detail heroes and bespoke author/metric boxes on article detail heroes with the existing `HeroTrustIndicators` component, wiring 4 content-specific indicator cards to every project and article via a new `heroIndicators` field.

**Architecture:** Reuse `TrustIndicatorItem` from `types/sections.ts` and `HeroTrustIndicators` with `variant="image-overlay"` from `components/shared/hero-trust-indicators.tsx` — zero new components. Add `heroIndicators: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem]` to both `Project` and `NewsArticle` types. All 160 indicator values (16 projects × 4 + 24 articles × 4) are pre-written in Docker entities `feat-hero-indicators-project-data` and `feat-hero-indicators-article-data`.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind v4, lucide-react icons via `icon-map`

---

## Session Start (load Docker context)

```bash
pnpm docker:mcp:memory:open feat-hero-indicators-project-data
pnpm docker:mcp:memory:open feat-hero-indicators-article-data
```

---

## File Map

| File | Change |
|------|--------|
| `types/sections.ts` | Add `MapPin` and `Calendar` to `IconName` union |
| `types/projects.ts` | Add `heroIndicators` field + `TrustIndicatorItem` import |
| `types/news.ts` | Add `heroIndicators` field + `TrustIndicatorItem` import |
| `components/shared/icon-map.tsx` (or `.ts`) | Add `MapPin` and `Calendar` icon mappings |
| `components/projects/project-detail-hero.tsx` | Swap KPI block → `HeroTrustIndicators` |
| `components/news-hub/news-detail-hero.tsx` | Swap metadata block → `HeroTrustIndicators` |
| `data/projects/index.ts` | Add `heroIndicators` to all 16 entries |
| `data/news/index.ts` | Add `heroIndicators` to all 24 entries |
| `components/news-hub/detail/__tests__/detail-blocks.test.tsx` | Add `heroIndicators` to `mockArticle()` |

---

## Task 1: Expand IconName and icon-map

**Files:**
- Modify: `types/sections.ts`
- Modify: `components/shared/icon-map.tsx` (or `icon-map.ts` — check which exists)

- [ ] **Step 1: Add MapPin and Calendar to IconName**

In `types/sections.ts`, find the `IconName` type. It currently ends with `'MessageSquare'`. Add two values:

```ts
export type IconName =
  | 'Shield'
  | 'Clock'
  | 'Award'
  | 'ThumbsUp'
  | 'CheckCircle'
  | 'Zap'
  | 'Building2'
  | 'Factory'
  | 'Home'
  | 'Lightbulb'
  | 'Wifi'
  | 'Wrench'
  | 'Phone'
  | 'AlertTriangle'
  | 'Battery'
  | 'Plug'
  | 'Settings'
  | 'Gauge'
  | 'ClipboardCheck'
  | 'Users'
  | 'Heart'
  | 'Star'
  | 'Activity'
  | 'BookOpen'
  | 'Mail'
  | 'MessageSquare'
  | 'MapPin'
  | 'Calendar';
```

- [ ] **Step 2: Add MapPin and Calendar to icon-map**

Open `components/shared/icon-map.tsx` (or `.ts`). Find the icon map object. It maps `IconName` string keys to lucide-react components. Add:

```ts
import {
  // ... existing imports ...
  MapPin,
  Calendar,
} from 'lucide-react';

// In the map object, add:
MapPin: MapPin,
Calendar: Calendar,
```

Exact format must match the existing pattern in that file (check whether it uses `MapPin` or `MapPin: MapPin` etc).

- [ ] **Step 3: Verify no typecheck errors**

```bash
pnpm typecheck
```

Expected: zero errors (no data changes yet — heroIndicators not required yet).

- [ ] **Step 4: Commit**

```bash
git add types/sections.ts components/shared/icon-map.tsx
git commit -m "feat: add MapPin and Calendar to IconName and icon-map"
```

---

## Task 2: Add heroIndicators (optional) to types

**Files:**
- Modify: `types/projects.ts`
- Modify: `types/news.ts`

Add as **optional** first (`heroIndicators?:`) to allow data migration without breaking typecheck on existing entries.

- [ ] **Step 1: Update types/projects.ts**

Find the `import` block at the top of `types/projects.ts`. Add:

```ts
import type { TrustIndicatorItem } from '@/types/sections';
```

Find `isFeatured: boolean;` in the `Project` interface (around line 147). Add after it:

```ts
  heroIndicators?: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];
```

- [ ] **Step 2: Update types/news.ts**

Find the `import` block at the top of `types/news.ts`. Add:

```ts
import type { TrustIndicatorItem } from '@/types/sections';
```

Find `isFeatured: boolean;` in the `NewsArticle` interface (around line 97). Add after it:

```ts
  heroIndicators?: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];
```

- [ ] **Step 3: Verify typecheck passes**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add types/projects.ts types/news.ts
git commit -m "feat: add heroIndicators optional field to Project and NewsArticle types"
```

---

## Task 3: Update project-detail-hero component

**Files:**
- Modify: `components/projects/project-detail-hero.tsx`

- [ ] **Step 1: Add HeroTrustIndicators import**

At the top of `components/projects/project-detail-hero.tsx`, add:

```ts
import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";
```

- [ ] **Step 2: Replace KPI block**

Find the `{/* KPI stats */}` comment block (around lines 180–188):

```tsx
{/* KPI stats */}
<motion.div
  className="mt-12 mb-12"
  initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
>
  <ProjectKpiGrid kpis={project.kpis} />
</motion.div>
```

Replace with:

```tsx
{/* Hero indicators */}
<motion.div
  className="mt-12 mb-12"
  initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
>
  {project.heroIndicators && (
    <HeroTrustIndicators
      items={project.heroIndicators}
      variant="image-overlay"
    />
  )}
</motion.div>
```

Note: conditional render (`project.heroIndicators &&`) because field is still optional at this stage. Will be made required in Task 7.

- [ ] **Step 3: Check if ProjectKpiGrid is used elsewhere**

```bash
grep -r "ProjectKpiGrid" components/ --include="*.tsx" --include="*.ts"
```

If the only usage was in `project-detail-hero.tsx`, remove the import line:
```ts
import { ProjectKpiGrid } from "@/components/projects/project-kpi-grid";
```

If it appears in other files, leave the import — do not delete the component.

- [ ] **Step 4: Verify typecheck**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add components/projects/project-detail-hero.tsx
git commit -m "feat: replace ProjectKpiGrid with HeroTrustIndicators on project detail hero"
```

---

## Task 4: Update news-detail-hero component

**Files:**
- Modify: `components/news-hub/news-detail-hero.tsx`

- [ ] **Step 1: Add HeroTrustIndicators import**

At the top of `components/news-hub/news-detail-hero.tsx`, add:

```ts
import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";
```

- [ ] **Step 2: Replace metadata block**

Find the `motion.div` block that renders the author box, spotlightMetric box, and location box (around lines 182–220). It starts with:

```tsx
<motion.div
  variants={itemVariants}
  className="flex flex-wrap justify-center gap-3 mt-8"
>
  <div className="rounded-xl border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-3 backdrop-blur-sm">
    <div className="font-mono text-[10px] tracking-[0.18em] text-electric-cyan/70 uppercase">
      Author
    </div>
    <div className="mt-1 font-semibold text-white/80">
      {article.author.name}
    </div>
  </div>
  {article.spotlightMetric ? (
    ...
  ) : null}
  {article.location && (
    ...
  )}
</motion.div>
```

Replace the entire block with:

```tsx
{article.heroIndicators && (
  <motion.div
    variants={itemVariants}
    className="w-full"
  >
    <HeroTrustIndicators
      items={article.heroIndicators}
      variant="image-overlay"
    />
  </motion.div>
)}
```

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add components/news-hub/news-detail-hero.tsx
git commit -m "feat: replace article metadata boxes with HeroTrustIndicators on news detail hero"
```

---

## Task 5: Add heroIndicators to all 16 projects (delegate)

**Files:**
- Modify: `data/projects/index.ts`

> **Delegation required** (>50 LOC). Dispatch `Agent(subagent_type="general-purpose")` with this full task.

**Data source:** Load `feat-hero-indicators-project-data` from Docker:
```bash
pnpm docker:mcp:memory:open feat-hero-indicators-project-data
```

**Instructions for agent:**

Add `heroIndicators` field immediately after `heroHeadline` in each of the 16 project objects in `data/projects/index.ts`. Match each entry by `title` string — search for partial title to locate the object, then insert after `heroHeadline`.

**Format for each project** (exact TypeScript, 4-item tuple):

```ts
heroIndicators: [
  { icon: 'Factory', title: 'Industrial Grade', description: 'Full industrial specification upgrade to 3-phase distribution meeting BS 7671:2018 requirements.' },
  { icon: 'Zap', title: '3-Phase Supply', description: 'Heavy-duty 3-phase power infrastructure installed to support high-demand industrial equipment.' },
  { icon: 'ClipboardCheck', title: 'NICEIC Certified', description: 'All works tested, inspected and certified by NICEIC-approved engineers to current standards.' },
  { icon: 'MapPin', title: 'West Dock Site', description: 'Delivered on active industrial site with phased programme to maintain operational continuity.' },
] as const,
```

**All 16 values** (load from Docker entity `feat-hero-indicators-project-data` — do not re-derive):

| Project title contains | Card 1 icon/title | Card 2 icon/title | Card 3 icon/title | Card 4 icon/title |
|---|---|---|---|---|
| West Dock Industrial Upgrade | Factory / Industrial Grade | Zap / 3-Phase Supply | ClipboardCheck / NICEIC Certified | MapPin / West Dock Site |
| Riverside Commercial Retrofit | Building2 / Commercial Retrofit | Lightbulb / LED Upgrade | Shield / Part P Compliant | Gauge / Energy Saving |
| North Estate Residential Phase 2 | Home / Part P Certified | Zap / Phase 2 Scope | ClipboardCheck / Consumer Units | MapPin / North Estate |
| City Hospital Emergency Power Ring | Shield / Critical Systems | Activity / Ring Main Design | ClipboardCheck / HTM Compliant | Calendar / Live Environment |
| Thames Gateway Data Centre | Zap / Tier III Power | Battery / UPS Integration | Gauge / HV Distribution | Shield / Zero Downtime |
| Canary Wharf Tower Mains Upgrade | Building2 / Commercial HV | Zap / Mains Upgrade | ClipboardCheck / ECA Certified | Calendar / Out of Hours |
| Heathrow Cargo Substation Expansion | Factory / HV Substation | Gauge / Transformers | Shield / CAA Compliant | Settings / SCADA Ready |
| DHL Reading Distribution Hub | Factory / Logistics Spec | Zap / 3-Phase Power | Lightbulb / LED Warehouse | MapPin / Reading Hub |
| Medivet Watford Veterinary Practice | Shield / Medical Grade | Zap / Theatre Supply | Lightbulb / Clinical Lighting | ClipboardCheck / NICEIC Approved |
| Ladbrokes Woking | Building2 / Retail Fitout | Lightbulb / Feature Lighting | ClipboardCheck / Part P Certified | Calendar / Fast Track |
| Biffa Workshop | Factory / 3-Phase Install | Zap / DNO Connection | Shield / NICEIC Certified | Wrench / Workshop Ready |
| Domestic Installations (Taplow) | Home / Part P Certified | ClipboardCheck / RCBO Protected | Wifi / Smart Ready | MapPin / Taplow Berks |
| Herschel Grammar School | ClipboardCheck / PPM Contract | Shield / NICEIC Approved | Calendar / Term Scheduled | Award / Trusted Partner |
| Hub Farnborough | Lightbulb / LED Refurb | Gauge / Energy Savings | Building2 / Commercial Fit | MapPin / Farnborough |
| Harvey Nichols Chiller Upgrade | Zap / Chiller Supply | Shield / Commercial Grade | ClipboardCheck / NICEIC Certified | Building2 / Harvey Nichols |
| Calcot Park Luxury Rewire | Home / Full Rewire | Wifi / Smart Home | Shield / 100A RCBO Board | MapPin / Calcot Park |

Full descriptions for each card are in the Docker entity. Agent must load them before writing.

- [ ] **Step 1: Delegate to agent** — pass this task + Docker entity name
- [ ] **Step 2: Verify 16 heroIndicators inserted**
```bash
grep -c "heroIndicators" data/projects/index.ts
```
Expected output: `16`

- [ ] **Step 3: Typecheck**
```bash
pnpm typecheck
```
Expected: zero errors.

- [ ] **Step 4: Commit**
```bash
git add data/projects/index.ts
git commit -m "feat: add content-specific heroIndicators to all 16 projects"
```

---

## Task 6: Add heroIndicators to all 24 articles (delegate)

**Files:**
- Modify: `data/news/index.ts`

> **Delegation required** (>50 LOC). Can be dispatched in parallel with Task 5 — independent file.

**Data source:** Load `feat-hero-indicators-article-data` from Docker:
```bash
pnpm docker:mcp:memory:open feat-hero-indicators-article-data
```

**Instructions for agent:**

Add `heroIndicators` field immediately after `heroHeadline` in each of the 24 article objects in `data/news/index.ts`. Match each entry by `id` field (`news-001` through `news-024`), then insert after `heroHeadline`.

**Format for each article** (exact TypeScript, 4-item tuple):

```ts
heroIndicators: [
  { icon: 'Home', title: 'Residential Work', description: 'Hands-on case study of a complete domestic energy refresh combining LED upgrade and smart controls.' },
  { icon: 'Gauge', title: 'Energy Saving', description: 'Significant reduction in annual energy consumption achieved through targeted LED and controls upgrade.' },
  { icon: 'ClipboardCheck', title: 'Part P Notified', description: 'All works notified and certified under Part P of the Building Regulations on completion.' },
  { icon: 'MapPin', title: 'Taplow Berks', description: 'Project based in Taplow, Berkshire — typical of Nexgen residential energy improvement programme.' },
] as const,
```

**All 24 values** (load full descriptions from Docker entity `feat-hero-indicators-article-data`):

| ID | Card 1 icon/title | Card 2 icon/title | Card 3 icon/title | Card 4 icon/title |
|---|---|---|---|---|
| news-001 | Home / Residential Work | Gauge / Energy Saving | ClipboardCheck / Part P Notified | MapPin / Taplow Berks |
| news-002 | Settings / Switchgear Watch | AlertTriangle / Early Warning | Shield / HV Expertise | Building2 / Docklands Sites |
| news-003 | Users / Partner Insight | Calendar / Early Alignment | Building2 / Sector Focus | Award / Industry Voice |
| news-004 | Shield / HTM 06-01 | Activity / Ring Topology | ClipboardCheck / Compliance Guide | Zap / Nexgen Expertise |
| news-005 | Zap / EV Readiness | Gauge / Load Assessment | Building2 / For Developers | ClipboardCheck / OZEV Aligned |
| news-006 | Building2 / Client Review | Award / Repeat Client | ThumbsUp / Zero Disruption | Star / Canary Wharf |
| news-007 | Users / Community Event | Heart / Local Impact | Shield / Safety Focus | Award / NICEIC Backed |
| news-008 | Home / Full Rewire | Shield / Heritage Build | ClipboardCheck / EICR Issued | MapPin / Hackney London |
| news-009 | Wifi / Smart Wiring | Lightbulb / KNX and DALI | Home / New Build Spec | Zap / EV and Solar |
| news-010 | Zap / EV Installation | Gauge / Load Check | ClipboardCheck / OZEV Grant | Shield / BS 7671 Wiring |
| news-011 | Zap / Tier III Design | Battery / UPS and Backup | Gauge / PUE Efficiency | Shield / Uptime Ready |
| news-012 | Gauge / PFC Systems | Factory / Industrial Apply | Activity / Energy Savings | ClipboardCheck / G99 Compliance |
| news-013 | Lightbulb / LED Retrofit | Gauge / 60pct Saving | Factory / Logistics Fit | Calendar / Live Retrofit |
| news-014 | Shield / Theatre Grade | Activity / IPSS Systems | ClipboardCheck / HTM 06-01 | Award / CQC Compliant |
| news-015 | Zap / HV Network | Gauge / 11kV Systems | Settings / SCADA Control | Calendar / Vacation Works |
| news-016 | Building2 / 150 Stores | ClipboardCheck / Compliance Fix | Lightbulb / LED Standard | Settings / Framework Deal |
| news-017 | BookOpen / 19th Edition | Shield / AFDD Rules | Zap / EV Charging | ClipboardCheck / Compliance Date |
| news-018 | Lightbulb / Future-Proof | Zap / Grid Demand | Battery / Storage Ready | Gauge / Net Zero Path |
| news-019 | Shield / Insurance Guide | ClipboardCheck / Public Liability | Award / Nexgen Covered | Users / Client Assurance |
| news-020 | Award / Schneider Partner | Zap / Acti9 Trained | ClipboardCheck / Certified Skills | Users / Team Training |
| news-021 | Users / Framework Deal | Building2 / 850+ Units | ClipboardCheck / NHBC Aligned | Calendar / Programme Lock |
| news-022 | Award / PPM Renewed | Building2 / Hotel Sector | ClipboardCheck / Compliance Log | Calendar / Zero Downtime |
| news-023 | Building2 / Academy Trust | Shield / DfE Compliant | Calendar / Summer Window | ClipboardCheck / NICEIC Certified |
| news-024 | Building2 / Common Parts | Lightbulb / LED Common | ClipboardCheck / EICR Compliant | Shield / Landlord Ready |

- [ ] **Step 1: Delegate to agent** — pass this task + Docker entity name
- [ ] **Step 2: Verify 24 heroIndicators inserted**
```bash
grep -c "heroIndicators" data/news/index.ts
```
Expected output: `24`

- [ ] **Step 3: Typecheck**
```bash
pnpm typecheck
```
Expected: zero errors.

- [ ] **Step 4: Commit**
```bash
git add data/news/index.ts
git commit -m "feat: add content-specific heroIndicators to all 24 articles"
```

---

## Task 7: Make heroIndicators required + update test mock

**Files:**
- Modify: `types/projects.ts`
- Modify: `types/news.ts`
- Modify: `components/projects/project-detail-hero.tsx`
- Modify: `components/news-hub/news-detail-hero.tsx`
- Modify: `components/news-hub/detail/__tests__/detail-blocks.test.tsx`

All 40 data entries have `heroIndicators` at this point, so making it required is safe.

- [ ] **Step 1: Make required in types/projects.ts**

Find: `heroIndicators?: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];`
Replace: `heroIndicators: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];`

- [ ] **Step 2: Make required in types/news.ts**

Find: `heroIndicators?: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];`
Replace: `heroIndicators: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];`

- [ ] **Step 3: Remove conditional renders in components**

In `components/projects/project-detail-hero.tsx`, change:
```tsx
{project.heroIndicators && (
  <HeroTrustIndicators
    items={project.heroIndicators}
    variant="image-overlay"
  />
)}
```
To:
```tsx
<HeroTrustIndicators
  items={project.heroIndicators}
  variant="image-overlay"
/>
```

In `components/news-hub/news-detail-hero.tsx`, change:
```tsx
{article.heroIndicators && (
  <motion.div variants={itemVariants} className="w-full">
    <HeroTrustIndicators
      items={article.heroIndicators}
      variant="image-overlay"
    />
  </motion.div>
)}
```
To:
```tsx
<motion.div variants={itemVariants} className="w-full">
  <HeroTrustIndicators
    items={article.heroIndicators}
    variant="image-overlay"
  />
</motion.div>
```

- [ ] **Step 4: Update test mock in detail-blocks.test.tsx**

In `components/news-hub/detail/__tests__/detail-blocks.test.tsx`, find the `mockArticle()` function. It already has `heroHeadline` (added in a previous session). Add `heroIndicators` after it:

```ts
heroHeadline: ['Test Article', 'Mock'],
heroIndicators: [
  { icon: 'Shield' as const, title: 'Test Indicator', description: 'Test description for mock article indicator one.' },
  { icon: 'CheckCircle' as const, title: 'Mock Coverage', description: 'Test description for mock article indicator two.' },
  { icon: 'Award' as const, title: 'Test Quality', description: 'Test description for mock article indicator three.' },
  { icon: 'Star' as const, title: 'Mock Value', description: 'Test description for mock article indicator four.' },
],
```

- [ ] **Step 5: Typecheck**

```bash
pnpm typecheck
```

Expected: zero errors. If errors appear, they indicate a data entry is missing `heroIndicators` — grep for the offending entry and add it.

- [ ] **Step 6: Commit**

```bash
git add types/projects.ts types/news.ts components/projects/project-detail-hero.tsx components/news-hub/news-detail-hero.tsx components/news-hub/detail/__tests__/detail-blocks.test.tsx
git commit -m "feat: make heroIndicators required, remove conditional guards, update test mock"
```

---

## Task 8: Build verification and Playwright spot-checks

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected: 84 static pages, zero errors. Page count must not change (heroIndicators is data, not routing).

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all existing tests pass. The `detail-blocks.test.tsx` mock now has `heroIndicators`.

- [ ] **Step 3: Playwright — Calcot Park project hero**

Navigate to `http://localhost:3000/projects/category/residential/calcot-park-luxury-rewire`. Take screenshot. Verify:
- 4 indicator cards visible in hero
- Each card has: icon, cyan title (no wrapping), 2–3 line description
- NO budget information visible anywhere

- [ ] **Step 4: Playwright — Harvey Nichols project hero**

Navigate to `http://localhost:3000/projects/category/industrial/harvey-nichols-chiller-upgrade`. Take screenshot. Verify:
- 4 indicator cards: Chiller Supply / Commercial Grade / NICEIC Certified / Harvey Nichols
- Cards match `image-overlay` glassmorphism style

- [ ] **Step 5: Playwright — news-001 article hero**

Navigate to `http://localhost:3000/news-hub/category/residential/taplow-residential-energy-refresh`. Take screenshot. Verify:
- 4 indicator cards replacing the old author/metric boxes
- NO author name displayed in the old bespoke format

- [ ] **Step 6: Playwright — news-021 article hero**

Navigate to `http://localhost:3000/news-hub/category/partners/developer-framework-agreement-residential-schemes`. Take screenshot. Verify:
- 4 cards: Framework Deal / 850+ Units / NHBC Aligned / Programme Lock

- [ ] **Step 7: Final commit**

```bash
git add .
git commit -m "feat: hero indicators — consistent trust card system across all project and article heroes"
git push
```

---

## Session End

After completion, update Docker memory:

```bash
node scripts/mcp-memory-call.mjs add_observations '{
  "observations": [{
    "entityName": "nexgen-electrical-innovations-state",
    "contents": [
      "branch: feat/hub-farnborough-harvey-nichols-content | heroIndicators complete on all 40 detail heroes",
      "next_tasks: PR feat/hub-farnborough-harvey-nichols-content → main"
    ]
  }]
}'
```

Create session entity and link to plan entity `plan-hero-headline-consistency`.
