---
title: Services Profile Enrichment — Design Spec
description: Replace placeholder images, enrich profile sections, move Features+Dashboard to industrial page
category: guides
status: active
last-updated: 2026-05-12
---

# Services Profile Enrichment

## Problem Statement
All three service detail pages (industrial, commercial, residential) suffer from:
1. Placeholder/generic images instead of real project photography
2. `SectionProfile` forces `aspect-3/4` (portrait) on landscape project photos — excessive height
3. Content column only renders `bio[]` paragraphs — not enough visual weight to balance the image
4. `SectionProfileData.quote` exists in type but is never rendered
5. `Features` and `Dashboard` components are hardcoded on home page only — they contextually belong on the industrial page

## Solution

### Type Changes (`types/sections.ts`)
- Add `highlights?: { icon: IconName; title: string; description: string }[]` to `SectionProfileData`
- Add `imageAspect?: 'portrait' | 'landscape'` to `SectionProfileData`
- Extend `SectionType`: add `'features-animated' | 'live-dashboard'`

### Component Changes
**`SectionProfile`** — conditionally render landscape ratio; render `highlights` grid, `quote` block, and `cta`
**`ServicePageRenderer`** — add cases for `'features-animated'` → `<Features />` and `'live-dashboard'` → `<Dashboard />`
**`app/page.tsx`** — remove `<Features />` and `<Dashboard />` (moved to industrial page)

### Data Changes
All 3 service data files: real project images + `imageAspect: 'landscape'` + rich `highlights` content
`data/services/industrial.ts`: add `features-animated` + `live-dashboard` section entries after intro

## Industrial Page Render Order (after)
Hero → Intro → Features (animated cards) → Dashboard (live grid intelligence)
→ Heavy-Duty Systems → Power Distribution → Energy Management
→ Industrial Testing → Maintenance → CTA

## Image Map
| Section | Image Path |
|---|---|
| Industrial — Heavy-Duty | `nexgen-harvey-nichols-plant-room-installation.jpg` |
| Industrial — Power Distribution | `nexgen-harvey-nichols-chiller-control-panel.jpg` |
| Industrial — Energy Management | `nexgen-harvey-nichols-vfd-pump-controller.jpg` |
| Commercial — Fit-Outs | `nexgen-dhl-reading-completed-operational-facility.jpg` |
| Commercial — Lighting | `commercial-lighting-hero-v2.JPG` (Herschel Grammar) |
| Commercial — Data & Comms | `nexgen-medivet-watford-electrical-distribution-board.jpg` |
| Residential — Home Electrical | `nexgen-taplow-completed-installation.jpg` |
| Residential — Smart Home | `nexgen-calcot-park-nest-thermostat-smart-heating.jpg` |

## Architecture Principles
- `imageAspect: 'portrait'` default preserves About page backward compat
- `highlights` is optional — undefined renders nothing extra
- `quote` already in type, just needs rendering in component
- `Features` and `Dashboard` remain as-is — just referenced via new section types
- No new components created — extend existing patterns only

## Verification Gates
1. `pnpm typecheck` — zero errors
2. `pnpm build` — 81 static pages
3. `/services/industrial` — Features cards + Dashboard present, 3 landscape profile sections
4. `/services/commercial` — 3 landscape profile sections with real images + highlights
5. `/services/residential` — 2 landscape profile sections with real images + highlights
6. `/` (home) — NO Features or Dashboard
7. About page — profile sections unchanged (portrait ratio preserved)
