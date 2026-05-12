---
Handoff Prompt — Services Profile Enrichment
Branch: feat/services-profile-enrichment (CREATE from main if not exists)
Plan: docs/superpowers/plans/2026-05-12-services-profile-enrichment.md

TASK: Enrich all service detail pages with real project images, rich highlights content,
landscape image ratios, and move Features+Dashboard from home page to industrial page.
Fully designed, planned, and all content values pre-written in Docker. DO NOT re-investigate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION START SEQUENCE (mandatory, in order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Invoke orchestrator skill
2. pnpm docker:mcp:memory:open feat-services-profile-enrichment
3. pnpm docker:mcp:memory:open feat-services-content-values
4. pnpm docker:mcp:memory:open nexgen-electrical-innovations-state
5. git log --oneline -5 && git status
   (confirm on main or create branch feat/services-profile-enrichment)

All content values for all 8 profile section highlights are in feat-services-content-values.
Do NOT re-derive content. Do NOT read project image directories to choose images.
Everything is pre-decided.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT WAS DONE (do not redo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Full R&D and brainstorm complete — all decisions locked
✅ Design spec: docs/superpowers/specs/2026-05-12-services-profile-enrichment-design.md
✅ Implementation plan: docs/superpowers/plans/2026-05-12-services-profile-enrichment.md
✅ Docker entities: feat-services-profile-enrichment (feature + decisions + plan)
                   feat-services-content-values (all 8x4 highlights pre-written)
✅ Obsidian: features/feat-services-profile-enrichment.md
             plans/plan-services-profile-enrichment.md
✅ Key decisions locked:
   - Features + Dashboard REMOVED from home page, MOVED to industrial page
   - imageAspect: 'portrait' | 'landscape' field on SectionProfileData
   - highlights[] optional field on SectionProfileData
   - SectionProfileData.quote already in type — just needs rendering in component
   - Home page order after: Hero → Services → Illumination → Schematic → SmartLiving → CTAPower → Footer
   - Industrial page order after intro: features-animated → live-dashboard → profile sections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO BUILD — 11-TASK PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full plan: docs/superpowers/plans/2026-05-12-services-profile-enrichment.md
Execute using: superpowers:subagent-driven-development

TASK 1 — Feature branch + commit pending changes (direct, git ops only)
git checkout -b feat/services-profile-enrichment
Stage + commit these files (already modified on main):
  components/navigation/navbar-client.tsx
  config/active-branch.json
  data/services/commercial.ts (partial — hero images only, profile enrichment comes in Tasks 7-9)
  data/services/industrial.ts (partial)
  data/services/residential.ts (partial)
  docs/NEW_CHAT_MASTER_PROMPT.md
  next-env.d.ts
  public/images/projects/commercial/herschel-grammar/sports-hall-upgrade/ (new)
  public/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-news-hero.jpeg (new)
  public/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-bank-staged-hero.jpeg (new)
Commit: "feat: services data hero images and navbar updates (WIP baseline)"

TASK 2 — Extend types (direct, ~15 LOC)
types/sections.ts — add to SectionProfileData:
  highlights?: { icon: IconName; title: string; description: string }[]
  imageAspect?: 'portrait' | 'landscape'
Add to SectionType union: | 'features-animated' | 'live-dashboard'

TASK 3 — Write tests first — TDD (delegate)
components/shared/__tests__/section-profile-enriched.test.tsx:
  - renders highlights grid when highlights provided
  - renders quote block when quote provided  
  - uses aspect-[4/3] class when imageAspect='landscape'
  - uses aspect-3/4 (default) when imageAspect undefined
components/services/__tests__/service-page-renderer-extended.test.tsx:
  - renders Features for type 'features-animated'
  - renders Dashboard for type 'live-dashboard'

TASK 4 — Enhance SectionProfile (delegate, ~80 LOC change)
components/shared/section-profile.tsx:
  Image: aspect-[4/3] when imageAspect='landscape', else aspect-3/4 (backward compat)
  Content column additions (after bio paragraphs):
    1. highlights grid — icon in electric-cyan + title bold + description muted (3-4 items)
    2. quote block — styled blockquote, left border electric-cyan, italic text
    3. cta button — if data.cta present, render arrow-right CTA link

TASK 5 — Extend ServicePageRenderer (direct, ~15 LOC)
components/services/service-page-renderer.tsx:
  Add: import { Features } from '@/components/sections/features'
  Add: import { Dashboard } from '@/components/sections/dashboard'
  Add case 'features-animated': return <Features key={index} />
  Add case 'live-dashboard': return <Dashboard key={index} />

TASK 6 — Remove Features+Dashboard from home page (direct, ~8 LOC removed)
app/page.tsx:
  Remove Features + Dashboard from import
  Remove <Features /> JSX (between Illumination and Schematic)
  Remove <Dashboard /> JSX (between Schematic and SmartLiving)

TASKS 7+8+9 — Data enrichment (delegate, can be parallelised)

TASK 7 — data/services/industrial.ts
Add after intro, before sections array:
  { type: 'features-animated' as const, data: {} }
  { type: 'live-dashboard' as const, data: {} }
Enrich 3 profile sections — ALL values in feat-services-content-values:
  systems:           plant-room-installation.jpg + imageAspect landscape + 4 highlights
  power-distribution: chiller-control-panel.jpg + imageAspect landscape + 4 highlights
  energy-management:  vfd-pump-controller.jpg + imageAspect landscape + 4 highlights

TASK 8 — data/services/commercial.ts
Enrich 3 profile sections — ALL values in feat-services-content-values:
  installations: dhl-reading-completed-operational-facility.jpg + imageAspect landscape + 4 highlights
  lighting:      commercial-lighting-hero-v2.JPG (Herschel Grammar) + imageAspect landscape + 4 highlights
  data-comms:    medivet-watford-electrical-distribution-board.jpg + imageAspect landscape + 4 highlights

TASK 9 — data/services/residential.ts
Enrich 2 profile sections — ALL values in feat-services-content-values:
  electrical:  taplow-completed-installation.jpg + imageAspect landscape + 4 highlights
  smart-home:  calcot-park-nest-thermostat-smart-heating.jpg + imageAspect landscape + 4 highlights

TASK 10 — Build gate
pnpm typecheck && pnpm build && pnpm test
Zero TypeScript errors. 81 static pages. All tests pass.

TASK 11 — Visual verification + commit + PR
Playwright (PLAYWRIGHT_REUSE_SERVER=true, dev server port 3000):
  /services/industrial  → Features animated cards present + Dashboard present + 3 landscape profiles with highlights
  /services/commercial  → 3 landscape profiles, real DHL/Herschel/Medivet images, highlights visible
  /services/residential → 2 landscape profiles, real Taplow/Calcot Park images, highlights visible
  / (home)             → NO Features section, NO Dashboard section
  /about               → profile sections still portrait ratio (backward compat)
Commit: "feat: services profile enrichment — real project images rich highlights industrial features+dashboard (#163)"
PR: feat/services-profile-enrichment → main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY ARCHITECTURE FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SectionProfile: components/shared/section-profile.tsx
  - image uses aspect-3/4 today → conditionally aspect-[4/3] when imageAspect='landscape'
  - quote field IS in SectionProfileData type but NOT rendered — add rendering
  - highlights field being ADDED to type — add rendering
  - cta field IS in SectionProfileData type but NOT rendered — add rendering
  - About page data has no highlights/imageAspect — backward compat guaranteed

ServicePageRenderer: components/services/service-page-renderer.tsx
  - SectionType union being extended with 'features-animated' | 'live-dashboard'
  - Renderer needs 2 new switch cases

Features component: components/sections/features.tsx (no props needed, use as-is)
Dashboard component: components/sections/dashboard.tsx (no props needed, use as-is)

IconName union: types/sections.ts — safe icons to use: Zap Shield Award Settings
  Building2 CheckCircle Home Lightbulb Wrench Phone Clock Gauge ClipboardCheck Activity

DO NOT add new icons — use only those already in IconName union and icon-map.tsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCKER ENTITIES (load these at session start)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
feat-services-profile-enrichment   — feature spec, decisions, architecture facts
feat-services-content-values        — ALL 8x4 highlights pre-written, image paths, load for Tasks 7-9
nexgen-electrical-innovations-state — branch/build/next tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION GATES (all must pass before commit)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. pnpm typecheck — zero errors
2. pnpm build — 81 static pages (unchanged)
3. /services/industrial — Features + Dashboard present, 3 profiles with landscape images + highlights
4. /services/commercial — 3 profiles with real images + highlights visible
5. /services/residential — 2 profiles with real images + highlights visible
6. / (home) — NO Features section, NO Dashboard section
7. /about — portrait ratio still working (backward compat)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCKER MEMORY — SESSION END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On completion:
- add_observations to nexgen-electrical-innovations-state (build status, commit SHA, PR URL)
- create session entity (session-2026-05-12-001 or next seq)
- create_relations: session → state (updates), session → feat-services-profile-enrichment (implements)
- Update feat-services-profile-enrichment status to COMPLETED
- next_tasks: review PR, merge to main, update active-branch.json
---
