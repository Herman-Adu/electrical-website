# Session Rehydration — Medivet Watford & Ladbrokes Woking Migration

## Context

New session. Continuing electrical-website project migration.
DHL Reading Distribution Hub (PRs #119 + #120) is fully merged to main.
Active branch: `feat/project-migration-medivet-watford`
Next after that: `feat/project-migration-ladbrokes-woking` (branch from main after Medivet merges)

**Full orchestrator mode. Docker memory first. Zero shortcuts. Superpowers mandatory.**

---

## Step 1 — Docker Memory (mandatory, in order)

```bash
pnpm docker:mcp:memory:search "electrical-website-state"
pnpm docker:mcp:memory:open electrical-website-state
pnpm docker:mcp:memory:search "learn-project-migration-full-process"
pnpm docker:mcp:memory:open learn-project-migration-full-process
git log --oneline -5 && git status
```

Report 3 bullets then STOP and await instruction.

---

## Key Narrative Angle — The Woodhouse Partnership

**All three commercial projects (DHL, Medivet, Ladbrokes) share the same main contractor: Woodhouse Workspace.**

This is Nexgen's central portfolio story: *Woodhouse's trusted electrical partner across multiple commercial programmes.* Each project reinforces the others. The narrative in all three should reference this relationship without being repetitive — each earns it on its own terms.

- DHL: earned through years of demanding commercial delivery
- Medivet: chosen again for precision in a regulated clinical environment
- Ladbrokes: selected on confidence and brand compliance track record

---

## Project A — Medivet Watford ("The Ultimate Care")

### Brief
- **Slug:** `medivet-watford-veterinary-practice`
- **ID:** `proj-medivet-watford-001`
- **Category:** `"commercial"` | **categoryLabel:** `"Commercial"`
- **clientSector:** `"Veterinary Healthcare"`
- **Location:** Watford, Hertfordshire (Watford's business district)
- **Size:** 18,000 sq ft
- **Main contractor:** Woodhouse Workspace
- **Layout:** North and south wing, each with own fuse board
- **Existing install at handover:** Linear lighting (base build), cleaner's sockets on columns
- **isFeatured:** `true` (replaces DHL as featured commercial project)
- **featuredProjectsByPlacement:** `aboutPage`

### Scope of Work (from old site)
- Lighting installation
- Power to tea points
- Floor boxes with data and power points
- New comms cabinet / data installation
- Cable routes, cable calculations, drawings, tender
- RAMS (Risk Assessment & Method Statements)
- Technical drawings
- Site inductions
- Testing, commissioning, labelling
- O&Ms (test certificates, as-built drawings, data sheets)

### Old Site Copy (verbatim — use to inform Nexgen narrative, do NOT copy)

**Lead:** "Intact Electrical were chosen as the preferred and trusted electrical contractor by Woodhouse Workspace as they strived to transform the Medivet new Watford office space Cat B fit out to the client's requirements."

**The walkthrough:** "Intact Electrical attended a site visit with Woodhouse, at the new clean slate of Medivet's new office space, to go through the Cat B fit out electrical requirements in detail. An 18,000 square foot property in the heart of Watford's business district. The new office space consisted of a north and south wing each having their own fuse board, linear lighting (installed as base build) and cleaner's sockets fitted to columns as the existing install. An important stage for any large project, the walkthrough giving us the insight to fully understand the client's ultimate vision, and the opportunity to align and explain our own ethos with all stakeholders. Following expansion in recent years, combined with post-pandemic changes in the approach to work, the management team of Medivet were investing in a people-centric support centre."

**Planning:** "After Intact Electrical were awarded the project, it was time to get all RAMS and technical drawings in place... Site inductions were arranged for our employees... Prior to the project start date, we arranged the procurement, ordering the materials to ensure they arrived on time."

**Execution:** "The level of collaboration working with Woodhouse was first class. They are highly professional, leaders in their field, and respected as such within the industry. Intact Electrical were made to feel part of one team under one umbrella working to achieve the same goals. Co-ordinating with other trades throughout the project also allowed us to minimise any down time."

**Completion:** "The office fitout ultimately showed a modern corporate identity filter from the reception area through the office workspace, crew and resolution rooms, all the way to the wc facilities. Once the Medivet electrical installation project was complete it was time to complete the O&Ms."

### KPIs — NEEDS CONFIRMATION FROM HERMAN
The old site has no KPIs. Draft plausible values for data structure, confirm with Herman before publishing:
- Budget: `"£[TBC]"` — typical 18,000 sq ft Cat B office: £120K–£180K range
- Timeline: `"[TBC] weeks"` — estimate 10–12 weeks
- Capacity: `"[TBC]A"` — dual fuse boards (north + south wing)
- Location: `"Watford, Hertfordshire"` ← confirmed

### Testimonial — NEEDS NEXGEN ORIGINAL
No testimonial on old site. If Herman has one, use it. If not, mark as pending or omit testimonial field entirely (it is optional in the ProjectDetailContent type).

### Gallery Images (from old site CDN — need sourcing and renaming)
Original filenames: `hero-medivet.jpg`, `01-medivet-project.jpg` through `12-medivet-project.jpg` (with gaps at 02,03,10,13).
Target naming: `nexgen-medivet-watford-[descriptor].jpg`
Target path: `public/images/projects/commercial/medivet-watford/`

### Suggested Narrative Blocks
```
after-intro:  "Earning the Brief" — Woodhouse relationship, Medivet's people-centric investment
after-scope:  "Working in a People-First Environment" — clinical sensitivity, coordination, zero disruption
after-gallery: "The Result" — modern corporate identity, O&Ms delivered, partnership continues
```

---

## Project B — Ladbrokes Woking ("A Safe Bet")

### Brief
- **Slug:** `ladbrokes-woking-retail-fitout`
- **ID:** `proj-ladbrokes-woking-001`
- **Category:** `"commercial"` | **categoryLabel:** `"Commercial"`
- **clientSector:** `"Retail & Betting"`
- **Location:** Woking, Surrey
- **Size:** 12,000 sq ft
- **Main contractor:** Woodhouse Workspace
- **Layout:** Two wings with large breakout area between them
- **Client:** Ladbrokes (Entain plc / FTSE 100) — 15,000 employees, 2,700+ shops, 6 countries
- **isFeatured:** `false` (Medivet is featured for commercial; Ladbrokes on services page)
- **featuredProjectsByPlacement:** `servicesPage`

### Scope of Work (from old site)
- Linear and feature lighting
- Small power: sockets, feeds for air conditioning and door access
- New fuse boards
- UPS battery backup system
- Power for appliances in breakout areas
- Temporary site electrical requirements (site office & welfare area)
- Lighting calculations, cable calculations, design and drawings
- RAMS, technical drawings
- Site inductions
- Testing, commissioning, labelling
- O&Ms

### Old Site Copy (verbatim — use to inform Nexgen narrative)

**Lead:** "Intact Electrical were chosen as the preferred and trusted electrical contractor by Woodhouse Workspace as they strived to transform Ladbrokes new Woking office space Cat B fit out to the client's requirements."

**The walkthrough:** "A 12,000 square foot area which had a huge amount of potential to become a smarter workspace. The scheme featured a large breakout area between two wings. Ladbrokes wanted to have a more open, vibrant and contemporary workspace where teams could truly collaborate."

**Execution:** "We began with installation of the temporary site electrical requirements for the site office & site welfare area. We performed another walk through of the project with our team of experienced qualified electricians... Once the project was fully underway weekly site meetings and walk arounds were carried out to ensure everything was running smoothly."

**About Ladbrokes:** "Ladbrokes employs 15,000 people in six countries and is one of the world's leading betting and gaming enterprises... Ladbrokes is owned by Entain plc, formerly GVC Holdings... listed on the London Stock Exchange and part of the FTSE 100."

### KPIs — NEEDS CONFIRMATION FROM HERMAN
- Budget: `"£[TBC]"` — typical 12,000 sq ft Cat B office: £80K–£120K range
- Timeline: `"[TBC] weeks"` — estimate 8–10 weeks
- Capacity: `"[TBC]A"` — new fuse boards + UPS
- Location: `"Woking, Surrey"` ← confirmed

### Testimonial — NEEDS NEXGEN ORIGINAL
No testimonial on old site. Mark as pending or omit.

### Gallery Images (from old site CDN — need sourcing and renaming)
Original filenames: `hero-ladbrokes.jpg`, `01-ladbrokes-project.jpg` through `06-ladbrokes-project.jpg`.
Target naming: `nexgen-ladbrokes-woking-[descriptor].jpg`
Target path: `public/images/projects/commercial/ladbrokes-woking/`

### Suggested Narrative Blocks
```
after-intro:  "Earning the Brief" — Woodhouse partnership, Ladbrokes brand confidence
after-scope:  "Working to a Fixed Specification" — brand-prescribed spec, speed + compliance differentiators
after-gallery: "The Result" — brand compliant, on programme, O&Ms delivered
```

---

## Architecture to Build — `data/featured-projects.ts`

Create this NEW file during the Medivet branch:

```typescript
// data/featured-projects.ts
import { allProjects } from "./projects";
import type { Project } from "@/types/projects";

export type FeaturedPlacement = "projectsHero" | "aboutPage" | "servicesPage";

const featuredProjectsByPlacement: Record<FeaturedPlacement, string> = {
  projectsHero: "proj-dhl-reading-001",
  aboutPage:    "proj-medivet-watford-001",
  servicesPage: "proj-ladbrokes-woking-001",
};

export function getFeaturedProjectByPlacement(
  placement: FeaturedPlacement,
): Project | undefined {
  const id = featuredProjectsByPlacement[placement];
  return allProjects.find((p) => p.id === id);
}
```

This is used by future About/Services page components. Build the file and the utility now even if the page components aren't wired yet — it's typed, ready, and correct.

---

## Migration Checklist (DHL-proven, use for both projects)

```
[ ] Images renamed nexgen-[client-slug]-[descriptor].jpg, placed in public/images/projects/commercial/[client]/
[ ] allProjects entry added to data/projects/index.ts
[ ] projectListItems entry added
[ ] detail.intro: label, headlineWords, leadParagraph, bodyParagraphs, pillars (3-4)
[ ] detail.scope: 8-12 items with correct icons
[ ] detail.challenge + solution: concrete, named, specific
[ ] detail.timeline: 4 phases (Pre-Construction, First Fix, Board/Distribution, Final Fix+Testing)
[ ] detail.gallery: 10-16 images, SEO-rich alt, present-tense captions
[ ] detail.testimonial: if available (optional — omit if none)
[ ] detail.narrativeBlocks: 3 blocks with anchorId, heading, paragraphs, background
[ ] narrativeBlock anchorIds: earning-the-brief, working-in-[context], the-result
[ ] isFeatured: Medivet=true, Ladbrokes=false
[ ] data/featured-projects.ts: created in Medivet branch
[ ] pnpm typecheck && pnpm build — must pass (baseline: 61 pages)
[ ] E2E: PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test
[ ] PR created via Docker GitHub MCP
[ ] CI clean (mergeable_state: clean) before merge
[ ] merge_pull_request via Docker GitHub MCP (squash)
```

---

## Critical Technical Rules (from DHL lessons)

- `anchorId` on `<div className="max-w-prose">` NOT on `<section className="py-10">` — already fixed in project-narrative-block.tsx
- TOC children are auto-generated by `generateTocItems` — just add anchorId + heading to narrativeBlocks
- Tags = scope + technology only (NOT sector — sector is in clientSector)
- `isFeatured`: when Medivet becomes true, do NOT change DHL to false (they're different categories... wait — both are commercial. Check getFeaturedProjectByCategory: it returns first isFeatured in scoped list. So when Medivet is added with isFeatured:true, DHL should become false for commercial category.)
- Ladbrokes branch: create from main AFTER Medivet is merged

---

## Branch Strategy
```
main (clean after DHL merge)
  └── feat/project-migration-medivet-watford  ← ACTIVE NOW
        ↓ (merge to main)
  └── feat/project-migration-ladbrokes-woking ← create after Medivet merges
```

---

## Build Baseline
- Pages: 61 static (before Medivet + Ladbrokes add routes)
- TypeScript: clean
- E2E: 0 failures (confirmed ×3 runs)
- Vitest: 299 pass / 4 skip (2 pre-existing SyntaxError in memory-lane scripts — not regressions)

---

## STOP after Step 1. Report 3 bullets. Wait for Herman's instruction.
