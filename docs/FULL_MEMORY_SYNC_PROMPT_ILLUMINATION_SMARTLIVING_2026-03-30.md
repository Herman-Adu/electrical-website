# FULL MEMORY SYNC PROMPT — SmartLiving Completed, Illumination Pending (2026-03-30)

Use this exact prompt in a new chat window. Do not summarize or compact context before acting.

---

You are continuing work in Herman-Adu/electrical-website on Windows (VS Code).

## Mandatory operating rules

- Follow .github/copilot-instructions.md, AGENTS.md, CLAUDE.md.
- Before changing Next.js behavior, run: pnpm run status:next-docs.
- Docs resolution order:
  1. node_modules/next/dist/docs/
  2. node_modules/next/docs/
  3. node_modules/next/README.md
- In this repo, status currently resolves to node_modules/next/README.md.
- No new npm packages for this task line.
- Keep edits surgical and preserve route contracts/types.

## Session reality (do not overwrite)

- CommunitySection is confirmed good across breakpoints and should NOT be changed.
- SmartLiving has been adjusted and now looks good to the user.
- Illumination is NOT yet adjusted in this line and is the next target.

## SmartLiving changes already applied

Files changed:

- components/sections/smart-living.tsx
- components/sections/smart-living/content-panel.tsx

Implemented:

- Mobile-safe section height/sizing approach (uses section-fluid + min-h-[100svh], desktop keeps larger behavior).
- Reduced aggressive vertical parallax displacement on non-desktop by gating transforms.
- Preserved richer motion on desktop.

Validation run in session:

- pnpm run status:next-docs -> resolves to node_modules/next/README.md
- pnpm build -> passed
- eslint on touched SmartLiving files -> passed (no new errors)

## Illumination current technical state (pending fix)

File:

- components/sections/illumination.tsx

Current structure notes:

- Section class: section-container relative min-h-svh lg:min-h-[90vh] flex flex-col justify-center
- Content wrapper has section-padding and parallax transform style y: contentY where contentY maps 0% -> 15%
- Background parallax is active

Observed issue report:

- On real iPhone 14 Pro Max, top and bottom feel cut/compressed even when simulator can look acceptable.
- Tablet has too much top/bottom space.
- Desktop generally acceptable but could use slightly better vertical centering/spacing balance.

## Working tree snapshot to preserve

Tracked modified files currently include:

- app/news-hub/page.tsx
- app/news-hub/category/page.tsx
- app/news-hub/category/[categorySlug]/page.tsx
- app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx
- components/news-hub/news-hub-hero.tsx
- components/news-hub/news-detail-hero.tsx
- components/news-hub/index.ts
- components/sections/smart-living.tsx
- components/sections/smart-living/content-panel.tsx
- next-env.d.ts

Untracked files include (do not delete unless explicitly asked):

- components/news-hub/news-hub-categories-hero.tsx
- components/news-hub/news-category-hero.tsx
- docs/FULL_MEMORY_SYNC_PROMPT_NEWS_HERO_2026-03-30.md
- docs/NEXT_SESSION_PROMPT_NEWS_HERO_ALIGNMENT_2026-03-30.md
- CONTINUE_PHASE4_CI_HARDENING.md
- NEXT_SESSION_PROMPT_2026-03-30_TIER2_ALIGNMENT.md
- PHASE_4_COMPLETION_HANDOFF.md
- RESUME_PROMPT_2026-03-30_MCP_HARDENING.md
- agent/pnpm-lock.yaml

## Next objective (this new session)

Fix Illumination spacing/height behavior across breakpoints with these constraints:

1. Model behavior after stable section patterns (CommunitySection / SectionWrapper rhythm principles), but keep changes scoped to Illumination files only.
2. Remove real-device mobile clipping risk (especially Safari dynamic viewport behavior).
3. Reduce excessive tablet vertical whitespace.
4. Keep desktop look close to current with slight vertical alignment improvement.
5. Avoid hard-coded one-off route-level spacing hacks.

## Suggested implementation approach

- Primary edit target: components/sections/illumination.tsx
- Consider these changes in order:
  - Replace brittle viewport-height assumptions with mobile-safe min-height behavior.
  - Tune section vertical spacing utilities to avoid over/under spacing across breakpoints.
  - Gate or reduce contentY parallax on small/medium viewports (desktop can keep stronger motion).
  - Keep CTA/stats and visual hierarchy intact.

## Required validation after Illumination fix

Run and report:

1. pnpm run status:next-docs
2. pnpm build
3. pnpm lint (warnings acceptable if pre-existing)

Then run viewport checks:

- iPhone 14 Pro Max equivalent
- tablet width (~768-1024)
- desktop

Verify:

- No top/bottom clipping on mobile real-device-like viewport
- Balanced spacing on tablet
- Desktop still visually strong and vertically centered

## Docker memory sync instruction

After successful validation, perform memory sync in Docker MCP workflow for this line using namespace-safe keys:

- agent:v1:reasoning:smartliving-illumination-spacing-2026-03-30
- agent:v1:heuristic_snapshots:smartliving-illumination-spacing-2026-03-30

Persist:

- final Illumination strategy
- breakpoint-specific decisions
- any trade-offs accepted

## Immediate first commands in new session

1. pnpm run status:next-docs
2. git status --short
3. open components/sections/illumination.tsx
4. implement spacing fix
5. pnpm build
6. pnpm lint

---

End of memory sync. Continue from this exact state.
