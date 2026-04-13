# CompanyTimeline Rewrite Handoff — 2026-04-13

## Scope

- Repo: `Herman-Adu/electrical-website`
- Route: `/about`
- Target component: `components/about/company-timeline.tsx`
- Parent usage: `app/about/page.tsx`

## User Goal

Complete senior-architect rewrite of `CompanyTimeline`.

Requirements:

- No static connector line visible under inactive steps
- Connector must animate from the edge of each circle
- Connector must reverse correctly when scrolling upward
- Each circle glow must trigger exactly at its threshold, smoothly
- Must work across all breakpoints
- Must feel premium / showoff quality
- Must support reduced motion
- Clean code, zero shortcuts, validation after each batch

## Confirmed Current Defects

1. Two competing connector systems exist:
   - Per-node `ConnectingLine`
   - Global animated progress line/spine (desktop + mobile)
2. This causes the visible line under the first glowing node and persistent static connector artifacts.
3. `useScrollDirection()` exists but direction is effectively not used for node/segment rendering.
4. `scrollDirection` is passed into `TimelineNode` as `_scrollDirection` and ignored.
5. Multiple `whileInView` pipelines with `once: false` create retrigger jitter and nondeterministic sequencing.

## Research Conclusions

### Framer Motion / Motion

- Use a single `useScroll` source of truth.
- Derive per-node activation and per-segment fill from motion values.
- Use `useMotionValueEvent` for scroll-direction detection from delta, with hysteresis.
- Prefer motion values over React state for per-frame updates.
- Avoid mixing many `whileInView` observers for the same animation responsibility.
- Maintain a reduced-motion branch.

### React 19

- Do **not** use `useTransition` / `startTransition` for scroll animation orchestration.
- Those APIs are for non-blocking UI transitions and async work, not per-frame motion.

### Tailwind / shadcn

- No canonical timeline component solves this.
- Build a bespoke component following shadcn composition discipline.

## Recommended Rewrite Architecture

Split the component into four layers:

1. **Data model**
2. **Responsive layout shell**
3. **Animation orchestrator**
4. **Presentational leaf visuals**

One orchestrator should own:

- `timelineProgress` normalized to `[0..1]`
- per-node activation envelope
- per-segment fill amount
- direction-aware fill origin

Mobile and desktop should share the same spine math.
Only card placement should differ.

## Animation Model

For each node:

- derive `triggerPoint`
- derive activation envelope
- derive semantic active/completed state

For each segment:

- trim segment bounds to the circle edge
- derive local fill from global progress
- ensure line starts visually at the circle perimeter, not below or through the node

## Direction Strategy

- Derive direction from motion-value delta
- Add a tiny-delta ignore band to prevent touchpad jitter
- Add hysteresis / direction lock to avoid rapid flip-flop
- Downscroll: fill from top edge of active segment
- Upscroll: fill from bottom edge of active segment
- Glow should trigger on threshold crossing, not merely because a node is visible

## Accessibility / Reduced Motion

- Hard reduced-motion branch
- No continuous pulse in reduced mode
- Discrete active/completed states only
- Animation must not be required for comprehension

## Performance Strategy

- One `useScroll` source
- Minimal observers
- Motion values instead of React state on scroll
- Avoid layout-thrashing animated properties
- Validate Safari and iPhone carefully

## Validation Blueprint

### Must verify

- No static connector visible before activation
- Connector begins exactly from circle edge
- Reverse scroll works cleanly
- Glow timing is synchronized to trigger threshold
- Mobile / tablet / desktop parity
- Reduced-motion parity
- No console / hydration issues

### Recommended checks

- TypeScript after each edit batch
- Browser automation on `/about`
- Visual checkpoints at mobile/tablet/desktop
- Directional scroll checks: down, up, reverse mid-segment

## Existing Related Files Worth Reading

- `components/about/company-timeline.tsx`
- `app/about/page.tsx`
- `lib/use-animated-borders.tsx`
- `components/projects/project-timeline.tsx` (contrast/reference only, not direct solution)

## Important Prior Context

Earlier in this conversation, `lib/use-animated-borders.tsx` was researched and updated to use `srgb` interpolation and a `clipPath`-based reveal to avoid asymmetry artifacts. That change is separate, but it reflects the expected standard: research first, then verified implementation.

## Execution Order For New Session

1. Read this handoff file
2. Read current `components/about/company-timeline.tsx`
3. Reconfirm architecture in a short execution plan
4. Rewrite component in controlled batches
5. Validate after each batch
6. Run TypeScript and targeted browser checks
7. Summarize what changed and any follow-up ideas

## Note

Attempted Docker memory save via MCP knowledge graph failed repeatedly with backend parse error (`Unexpected non-whitespace character after JSON at position 174`). Use this file as the rehydration source for the next session unless the Docker memory service is healthy again.
