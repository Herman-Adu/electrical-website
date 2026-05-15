# Design: feat-content-legitimacy-cleanup

**Date:** 2026-05-15
**Status:** approved
**Feature branch:** feat/content-legitimacy-cleanup
**Author:** Herman Adu + Claude Sonnet 4.6

---

## Goal

Remove all placeholder projects and articles, leaving only real Nexgen Electrical Innovations work. Update empty-state copy to "coming soon" messaging. Maintain full nav structure — empty categories show gracefully rather than being hidden.

---

## Approach

Option 2 — **data deletion + copy refresh + cross-reference audit**.

- Delete entries from TypeScript data arrays (no schema changes, no routing changes, no new components)
- Audit all remaining articles for `relatedArticles` / `featuredArticle` pointers to removed slugs and fix them
- Update `emptyMessage` copy in both category page templates to "coming soon" language
- Build gate after every batch

---

## Files Affected

| File | Change |
|------|--------|
| `data/projects/index.ts` | Delete 7 project objects |
| `data/news/index.ts` | Delete 19 article objects + fix cross-refs |
| `app/projects/category/[categorySlug]/page.tsx` | Update `emptyMessage` prop copy |
| `app/news-hub/category/[categorySlug]/page.tsx` | Update `emptyMessage` prop copy |

---

## Deletion Inventory

### Projects — remove (7)

| Slug | Category | Reason |
|------|----------|--------|
| `north-estate-residential-phase-2` | Residential | Placeholder |
| `west-dock-industrial-upgrade` | Industrial | Placeholder |
| `heathrow-cargo-substation-expansion` | Industrial | Placeholder |
| `city-hospital-emergency-power-ring` | Power-Boards | Placeholder |
| `thames-gateway-data-centre-power` | Power-Boards | Placeholder |
| `canary-wharf-tower-mains-upgrade` | Power-Boards | Placeholder |
| `riverside-commercial-retrofit` | Commercial-Lighting | Placeholder |

### Projects — keep (9)

| Slug | Category |
|------|----------|
| `dhl-reading-distribution-hub` | Commercial |
| `medivet-watford-veterinary-practice` | Commercial |
| `ladbrokes-woking-retail-fit-out` | Commercial |
| `biffa-workshop-farnham` | Commercial |
| `herschel-grammar-school-contract` | Commercial |
| `the-hub-farnborough-commercial-lighting` | Commercial |
| `harvey-nichols-chiller-upgrade` | Industrial |
| `taplow-domestic-installation` | Residential |
| `calcot-park-luxury-rewire` | Residential |

### Articles — remove (19)

**Residential (3)**
- `complete-home-rewire-victorian-terrace-hackney`
- `smart-home-automation-new-build-integration`
- `ev-charger-installation-domestic-load-assessment`

**Industrial (4)**
- `docklands-switchgear-watch`
- `data-centre-power-distribution-tier-iii-compliance`
- `manufacturing-facility-power-factor-correction`
- `warehouse-led-lighting-retrofit-roi-analysis`

**Case Studies (4 — entire channel cleared)**
- `private-hospital-theatre-electrical-upgrade`
- `retail-chain-electrical-standardisation-programme`
- `hospital-power-ring-lessons-learned`
- `university-campus-hv-network-modernisation`

**Reviews (4 — entire channel cleared)**
- `latest-client-review-canary-wharf-retrofit`
- `hotel-group-electrical-maintenance-contract-review`
- `school-academy-trust-summer-works-review`
- `commercial-landlord-common-parts-upgrade-review`

**Partners (4 — entire channel cleared)**
- `partner-spotlight-build-programme-alignment`
- `partner-campaign-community-electrification-week`
- `manufacturer-partnership-schneider-electric-training`
- `developer-framework-agreement-residential-schemes`

### Articles — keep (5)

| Slug | Channel |
|------|---------|
| `taplow-residential-energy-refresh` | Residential |
| `why-ev-readiness-starts-at-the-board` | Insights |
| `bs-7671-19th-edition-key-changes-contractors` | Insights |
| `future-proofing-electrical-infrastructure-electrification` | Insights |
| `electrical-contractor-insurance-requirements-guide` | Insights |

---

## Empty-State Copy

### Current (generic)
```
Projects: "No {category} projects available yet."
News:     "No stories are available in the {channel} category yet."
```

### Proposed (coming soon)
```
Projects: "Nexgen {category} projects coming soon — this section is actively growing."
News:     "New {channel} content coming soon — we're building this with real Nexgen work."
```

Both are passed as the `emptyMessage` prop in the respective category page templates — single-line change per file.

---

## Task Breakdown

### T1 — Cross-reference audit
Grep `data/news/index.ts` for all 19 removed article slugs appearing in `relatedArticles` or `featuredArticle` fields of surviving articles. Document every hit. Fix in T3.

**Acceptance:** zero removed slugs referenced in surviving data

### T2 — Remove placeholder projects
Delete all 7 project objects from `data/projects/index.ts`.

**Acceptance:** `grep -c "north-estate\|west-dock\|heathrow-cargo\|city-hospital-emergency\|thames-gateway\|canary-wharf-tower\|riverside-commercial-retrofit" data/projects/index.ts` returns 0

### T3 — Remove placeholder articles + fix cross-refs
Delete all 19 article objects from `data/news/index.ts`. Apply cross-ref fixes from T1.

**Acceptance:** `grep -c` for all 19 slugs in data/news/index.ts returns 0; no removed slug appears in any `relatedArticles` array

### T4 — Update empty-state copy
Update `emptyMessage` prop in:
- `app/projects/category/[categorySlug]/page.tsx`
- `app/news-hub/category/[categorySlug]/page.tsx`

**Acceptance:** Both files use "coming soon" copy

### T5 — Build gate
```bash
pnpm typecheck && pnpm build && pnpm test
```
**Acceptance:** All pass. Build output shows Community, Industrial, Reviews, Partners, Case Studies pages exist but are empty (static generation handles gracefully).

### T6 — Commit, PR, merge, sync
1. `git add data/projects/index.ts data/news/index.ts app/projects/category/... app/news-hub/category/...`
2. Commit: `feat(data): remove placeholder projects and articles — legitimacy cleanup`
3. Push → create PR → monitor CI → squash merge to main
4. Docker memory sync + Obsidian sync

---

## Empty-Category State After Cleanup

| Category / Channel | Post-cleanup item count | UI state |
|-------------------|------------------------|----------|
| Projects / Community | 0 | Empty state — "coming soon" |
| Projects / Industrial | 1 (Harvey Nichols) | Renders normally |
| Projects / Residential | 2 (Taplow, Calcot Park) | Renders normally |
| Projects / Commercial | 6 | Renders normally |
| News / Residential | 1 (Taplow) | Renders normally |
| News / Industrial | 0 | Empty state — "coming soon" |
| News / Commercial | 0 | Empty state — "coming soon" |
| News / Community | 0 | Empty state — "coming soon" |
| News / Partners | 0 | Empty state — "coming soon" |
| News / Case Studies | 0 | Empty state — "coming soon" |
| News / Reviews | 0 | Empty state — "coming soon" |
| News / Insights | 4 | Renders normally |

---

## Architectural Notes

- **No orphaned routes**: `generateStaticParams` reads directly from data arrays — removing entries means pages are simply not generated. No 404 risk.
- **No individual MDX files**: All project and article data lives in TypeScript array exports. No per-item files to delete.
- **Images**: Orphaned `public/images/` assets for removed projects are non-breaking (build ignores unused public assets). Can be cleaned in a separate housekeeping pass.
- **Social Media / Marketing channels**: No articles exist in these channels — only topic tags in `topics.ts`. Nothing to delete.

---

## Follow-On Feature: feat-nexgen-content-first-wave

To be planned in the session after this cleanup. Real articles to write against real Nexgen projects:

| Channel | Articles to create |
|---------|-------------------|
| Case Studies | DHL Reading, Herschel Grammar, Biffa Workshop, Ladbrokes Woking, Hub Farnborough, Harvey Nichols Chiller |
| Partnerships | Biffa partnership, Herschel Grammar maintenance contract |
| Reviews | Real client reviews (content from Herman) |
| Residential | Calcot Park luxury rewire |
| Community | New community projects (content + projects from Herman) |
| Industrial | Harvey Nichols chiller deep-dive |
| Social Media | Full campaign content (content from Herman) |

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Empty category UI | Show with "coming soon" copy | Maintains full nav structure; signals active growth to visitors |
| Deletion method | Hard delete from data arrays | No soft-delete complexity needed; data is static TS, not a DB |
| Image cleanup | Defer | Orphaned images don't break build; separate housekeeping pass |
| Social Media / Marketing | Nothing to delete | No articles exist in these channels yet |

---

## Learning

Placeholder content in a portfolio site must be cleared before client-facing deployment. The key discipline: **audit cross-references before deleting** — `relatedArticles` arrays in surviving content can silently reference removed slugs, which may surface as type errors or empty slots at render time.
