# Session Rehydration — Medivet Watford & Ladbrokes Woking Migration

New session. Full orchestrator mode from the first tool call. No shortcuts, no reminders needed.

---

## Mandatory Startup Sequence (run ALL in order, no skipping)

### 1. Docker preflight
```bash
curl -sf http://localhost:3100/health
```
If offline: `pnpm docker:mcp:ready` then re-check.

### 2. Docker memory (read state before touching anything)
```bash
pnpm docker:mcp:memory:search "electrical-website-state"
pnpm docker:mcp:memory:open electrical-website-state
pnpm docker:mcp:memory:search "learn-project-migration-full-process"
pnpm docker:mcp:memory:open learn-project-migration-full-process
```

### 3. Git state
```bash
git log --oneline -5 && git status
```

### 4. Report — exactly 3 bullets, then STOP and await instruction
- **Branch:** [branch] | Last commit: [hash] [message]
- **Build:** [pages count] pages | Tests: [status]
- **Next:** [top task from Docker state]

---

## Orchestrator Rules (always active — these are non-negotiable)

| Rule | Enforcement |
|------|-------------|
| >50 LOC or multi-file | Delegate via `Agent(subagent_type="general-purpose")` — never implement directly |
| Architecture decisions | `architecture-sme` first, then `code-generation` |
| Security/auth/secrets | `security-sme` always, no exceptions |
| Planning (2hr+ feature) | `planning` agent first, then `code-generation` |
| Memory reads/writes | Docker MCP only — `mcp__MCP_DOCKER__memory_reference__*` |
| GitHub ops | Docker GitHub MCP — `mcp__MCP_DOCKER__github_official__*` — never `gh` CLI |
| Browser testing | Docker Playwright — `PLAYWRIGHT_REUSE_SERVER=true` |
| Complex reasoning | Docker sequential thinking — `mcp__MCP_DOCKER__sequential_thinking__*` |
| Build gate | `pnpm typecheck && pnpm build` before every commit |
| Context limit | Hard stop at 60% — commit WIP, sync Docker, wait |

Superpowers for all code generation: brainstorm → plan (TDD) → execute → verify.

---

## Project State

**Main is clean.** DHL Reading Distribution Hub fully merged (PRs #119 + #120).
**Active branch:** `feat/project-migration-medivet-watford`
**Next branch:** `feat/project-migration-ladbrokes-woking` — create from main AFTER Medivet merges.

---

## Architecture Decision Needed First — Featured Projects on Multiple Pages

**Do this before any data migration.** Use `architecture-sme` + sequential thinking.

**The problem:** Projects need to appear as featured items on multiple pages (Projects hero, About page, Services page). Eventually this moves to Strapi with full relational content — author, partner (Woodhouse), client (Medivet/Ladbrokes), vendor (Schneider etc). The current `isFeatured: boolean` is a blunt instrument.

**Constraints:**
- Next.js 16 + React 19 — use Server Components, ISR, PPR where appropriate
- Must be forward-compatible with Strapi CMS (relations: author, partner, client, vendor)
- No prop-drilling, no context abuse — data fetching at the page/layout level
- `getFeaturedProjectByCategory` already exists — don't break it

**Options to evaluate:**
1. `data/featured-projects.ts` — static lookup file, `getFeaturedProjectByPlacement(placement)` — zero runtime cost, swap by editing one file
2. `featuredOn?: FeaturedPlacement[]` on the `Project` type — co-located with data, but bloats type and duplicates intent
3. Strapi-forward: `featuredPlacements` as a standalone config entity (maps placement → project ID) — cleanest when Strapi arrives

**Recommendation to architect:** Option 1 now (static file), designed to be replaced 1:1 by a Strapi singleton document when CMS lands. The utility function signature stays identical — only the data source changes.

**Get the architect's verdict before building.**

---

## Migration Targets

### Medivet Watford — "The Ultimate Care"
- **IDs:** `proj-medivet-watford-001` | slug: `medivet-watford-veterinary-practice`
- **Category:** `commercial` | clientSector: `"Veterinary Healthcare"`
- **Location:** Watford, Hertfordshire | Size: 18,000 sq ft | Layout: North + south wing, own fuse board each
- **Main contractor:** Woodhouse Workspace (same as DHL — reinforce the partnership narrative)
- **isFeatured:** `true` (DHL set to `false` in same commit)
- **Placement:** `featuredProjectsByPlacement.aboutPage`
- **KPIs:** placeholders — Herman confirms with client. Fields: budget, timeline, capacity, location
- **Testimonial:** placeholder or omit (optional field) — Herman confirms with client
- **Images:** already at `public/images/projects/commercial/medivet/` — view, rename to `nexgen-medivet-watford-[descriptor].jpg`, update alt/aria/SEO same as DHL

### Ladbrokes Woking — "A Safe Bet"
- **IDs:** `proj-ladbrokes-woking-001` | slug: `ladbrokes-woking-retail-fitout`
- **Category:** `commercial` | clientSector: `"Retail & Betting"`
- **Location:** Woking, Surrey | Size: 12,000 sq ft | Layout: Two wings + large breakout
- **Client:** Ladbrokes / Entain plc (FTSE 100) — 15,000 employees, 2,700+ shops
- **Main contractor:** Woodhouse Workspace
- **isFeatured:** `false`
- **Placement:** `featuredProjectsByPlacement.servicesPage`
- **KPIs:** placeholders — Herman confirms with client
- **Testimonial:** placeholder or omit — Herman confirms with client
- **Images:** already at `public/images/projects/commercial/ladbrokes/` — view, rename to `nexgen-ladbrokes-woking-[descriptor].jpg`, update alt/aria/SEO same as DHL

---

## Migration Checklist (DHL-proven)

```
[ ] Architecture decision: featured placement pattern approved
[ ] data/featured-projects.ts created (Medivet branch)
[ ] Images viewed → renamed nexgen-[client-slug]-[descriptor].jpg → SEO alt/aria updated
[ ] allProjects entry added (data/projects/index.ts)
[ ] projectListItems entry added
[ ] detail.intro: label, headlineWords, leadParagraph, bodyParagraphs, pillars (3-4 max)
[ ] detail.scope: 8-12 items, correct icon names
[ ] detail.challenge + solution: concrete, named, specific (no generic language)
[ ] detail.timeline: 4 phases standard
[ ] detail.gallery: all renamed images, SEO-rich alt, present-tense captions
[ ] detail.testimonial: placeholder object or field omitted
[ ] detail.narrativeBlocks: 3 blocks, anchorId on each (earning-the-brief / working-in-[x] / the-result)
[ ] pnpm typecheck && pnpm build — must pass
[ ] PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test — must pass
[ ] PR via Docker GitHub MCP (create_pull_request)
[ ] Monitor CI via Docker GitHub MCP (get_pull_request → mergeable_state: clean)
[ ] Merge via Docker GitHub MCP (merge_pull_request, squash)
[ ] Docker memory sync: add_observations to electrical-website-state, create session entity
```

---

## Critical Technical Rules (learned from DHL)

- `anchorId` on `<div className="max-w-prose">` NOT on `<section className="py-10">` — already correct in `project-narrative-block.tsx`
- TOC children auto-generated — just set `anchorId` + `heading` on narrative blocks
- Tags = scope + technology only (never sector — that's `clientSector`)
- Pillars: 3 is lean, 4 is complete, 5+ becomes a list — use 4 max
- `isFeatured`: when Medivet added as `true`, set DHL to `false` in same commit (both `commercial`)
- Woodhouse narrative: all 3 projects share the same contractor — reference the partnership without repeating it

---

## Strapi Forward-Compatibility Notes

When designing any new data structures this session, ask: *"Would this be a Strapi field, a relation, or a singleton?"*
- `Project` → Strapi Collection Type
- `featuredProjectsByPlacement` → Strapi Single Type (one document, multiple placement fields)
- Woodhouse, DHL, Medivet, Ladbrokes → Strapi relations: `partner` (Woodhouse), `client` (end client), `vendor` (Schneider etc)
- `author`, `tags`, `category` → Strapi taxonomies
- Nothing built now should require a schema migration to move to Strapi — keep data flat and ID-based

---

## Build Baseline (as of 2026-04-30 post-DHL)
- Pages: 61 static
- TypeScript: clean
- E2E: 0 failures
- Vitest: 299 pass / 4 skip (2 pre-existing SyntaxError in memory-lane scripts — not regressions)
