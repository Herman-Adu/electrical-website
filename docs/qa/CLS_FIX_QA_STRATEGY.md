# QA Strategy: Cumulative Layout Shift (CLS) Fixes

## Executive Summary

Three React components have CLS (Cumulative Layout Shift) issues caused by animating container heights:
1. **VisionMission** — Terminal text boxes grow during reveal animation
2. **ServicesBento** — DiagnosticCard (System Status Feed) grows with typewriter animation
3. **SectionValues** — Value cards expand on hover to reveal full description text

This document defines a comprehensive QA strategy to:
- Measure CLS before/after fixes
- Verify animation smoothness remains at 60fps
- Test across responsive breakpoints
- Detect edge cases and regressions
- Integrate with existing test suites

**Target CLS Score:** < 0.1 (Good) per Web Vitals standard

---

## Part 1: CLS Measurement & Verification

### 1.1 CLS Measurement Tools

#### Primary: Web Vitals JavaScript Library
**When to use:** Real-time CLS measurement during Playwright E2E tests
**How:** Inject `web-vitals` into page and collect CLS data
**Tool:** Already available via npm; integrate into test setup

```typescript
// Pattern (to be implemented in tests)
import { getCLS } from 'web-vitals';

let clsValue = 0;
getCLS((metric) => {
  clsValue = metric.value;
  console.log(`CLS: ${metric.value}`);
});
```

**Pros:**
- Measures actual user-perceived layout shifts
- Accumulates throughout full page lifecycle (not just viewport)
- Detects partial shifts that Lighthouse misses
- Works across all breakpoints

**Cons:**
- Requires page to be interactive (no passive data collection)
- Must capture before/after in same test session

---

#### Secondary: Lighthouse (DevTools)
**When to use:** Post-fix validation; part of CI/CD automated checks
**How:** Run Lighthouse audit on production build
**Current Score:** 92/100

**Metrics to track:**
- CLS score component
- Core Web Vitals (LCP, INP, CLS)
- Performance regression detection

**Regression Threshold:** Lighthouse score must not drop below 90

---

#### Tertiary: Chrome DevTools Performance Tab
**When to use:** Manual QA during development; jank/fps verification
**How:** Record performance trace during user interactions
**Captures:**
- Frame timing (60fps = 16.67ms per frame)
- Layout recalculations (forced reflow)
- Paint events
- Animation timeline

---

### 1.2 Component-Specific CLS Test Scenarios

#### Component 1: VisionMission
**Location:** `/about` page, mid-section
**CLS Trigger:** Terminal text animation + mission pillar cards animate on scroll view

**Test Scenario 1A: Scroll-triggered animation**
```
1. Load /about page
2. Record CLS baseline (top of page)
3. Scroll to visionMission section (trigger IntersectionObserver)
4. Measure CLS delta during:
   - Vision terminal text reveal (22ms per char)
   - Mission pillars cards reveal (0.5s with 0.08s stagger)
5. Assert: CLS delta < 0.05 (good) after fix
```

**Test Scenario 1B: No DOM growth during animation**
```
1. Use Performance tab or Puppeteer to inspect computed height
2. Measure visionRef + missionRef container height before/during/after animation
3. Assert: height is fixed or grows before animation starts, NOT during
```

**Test Scenario 1C: Different scroll speeds**
```
1. Simulate slow 3G network (delays DOM parse)
2. Simulate slow scroll (user scrolls slowly into view)
3. Simulate fast scroll (user scrolls rapidly past section)
4. Assert: CLS < 0.1 in all conditions
```

---

#### Component 2: ServicesBento — DiagnosticCard
**Location:** `/services` page, "Live Diagnostics" card (row 2)
**CLS Trigger:** System Status Feed container grows with typewriter text animation

**Card Details:**
- Located in bento grid (responsive: 1 col mobile, 2-4 col desktop)
- On mobile: takes full width or 1 column
- On tablet/desktop: 2 columns wide in row 2
- Height: `h-full min-h-25` (min 100px) with `flex-1` to fill space
- Animation: Typewriter text in `.min-h-25 p-3` container

**Test Scenario 2A: Mobile layout shift (375px viewport)**
```
1. Set viewport to 375px (small phone)
2. Load /services page
3. Wait for bento grid layout (no animation yet)
4. Record baseline scroll position
5. Measure CLS during DiagnosticCard animation (30ms per char)
6. Assert: 
   - CLS < 0.1
   - Sibling cards (Emergency, Power Distribution) do NOT shift
   - Grid layout remains stable
```

**Test Scenario 2B: Tablet layout (768px viewport)**
```
1. Set viewport to 768px
2. Load /services page
3. Verify grid is 2 cols: DiagnosticCard should be 2 cols wide
4. Measure CLS during typewriter animation
5. Assert: CLS < 0.1, row below (Residential, Maintenance, Testing, Data) does NOT shift
```

**Test Scenario 2C: Desktop layout (1024px+)**
```
1. Set viewport to 1440px
2. Load /services page
3. Verify grid is 4 cols: DiagnosticCard should be 2 cols wide
4. Measure CLS during animation
5. Assert: CLS < 0.1, no impact on layout
```

**Test Scenario 2D: Animation loop stability (2+ loops)**
```
1. Typewriter animation loops (2.5s pause, then restart)
2. Let animation run 3 full cycles
3. Assert: CLS does not accumulate; later cycles have same CLS as first
```

---

#### Component 3: SectionValues
**Location:** Multiple pages (about, home, services), configurable values grid
**CLS Trigger:** Card expands on hover; full description reveals, max-h increases from 0 to 32 (128px)

**Card Structure:**
- Grid: `md:grid-cols-2 lg:grid-cols-3`
- Hover state: 
  - Short description hidden: `opacity-0 max-h-0`
  - Full description revealed: `opacity-100 max-h-32`
  - Transition: `duration-400`

**Test Scenario 3A: Desktop hover (1024px+)**
```
1. Load page with SectionValues (e.g., /about with values)
2. Measure CLS baseline (cards in unhovered state)
3. Hover over first card (desktop)
4. Measure CLS delta during 400ms transition
5. Assert: CLS < 0.05 during expansion
6. Unhover and measure CLS during collapse
7. Assert: CLS < 0.05 during collapse
```

**Test Scenario 3B: Mobile/tablet — no hover (touch device)**
```
1. Set viewport to 375px (touch-capable)
2. Load page with SectionValues
3. Tap card (simulated click, not hover)
4. Assert: No expansion occurs (hover-only behavior)
5. Verify short description is always visible
6. Assert: CLS == 0 (no shifts on mobile)
```

**Test Scenario 3C: Sequential hovers — grid layout stability**
```
1. Hover first card (top-left) → measure CLS
2. Unhover, wait 100ms
3. Hover second card (top-middle) → measure CLS
4. Unhover, wait 100ms
5. Hover third card (top-right) → measure CLS
6. Assert: Each hover has CLS < 0.05
7. Assert: Cards below first row do NOT shift when top row expands
```

**Test Scenario 3D: Hover near viewport bottom**
```
1. Scroll so a value card is near bottom of viewport
2. Hover card (expands, might push content down)
3. Measure CLS impact on cards below
4. Assert: CLS < 0.1 (large expansion acceptable at bottom)
```

**Test Scenario 3E: Content overflow handling**
```
1. Identify a card with long `value.full` text
2. If text exceeds `max-h-32` (128px), it will truncate with `overflow-hidden`
3. Hover and verify text is readable up to overflow point
4. Assert: No visual glitches; layout stable during expansion
```

---

### 1.3 CLS Measurement Implementation Pattern

**Playwright Test Pattern:**
```typescript
import { test, expect } from '@playwright/test';
import { getCLS } from 'web-vitals';

test('VisionMission: CLS < 0.1 during animation', async ({ page }) => {
  // 1. Inject web-vitals before navigation
  await page.addInitScript(() => {
    window.clsData = { value: 0 };
    // Dynamically import web-vitals (via CDN or bundled)
  });

  // 2. Navigate and wait for page load
  await page.goto('/about', { waitUntil: 'networkidle' });

  // 3. Scroll to component
  await page.locator('section#vision-mission').scrollIntoViewIfNeeded();

  // 4. Record baseline CLS
  const clsBaseline = await page.evaluate(() => window.clsData?.value || 0);

  // 5. Trigger animation (wait for IntersectionObserver)
  await page.waitForTimeout(1000); // Animation runs

  // 6. Record final CLS
  const clsFinal = await page.evaluate(() => window.clsData?.value || 0);

  // 7. Assert
  expect(clsFinal - clsBaseline).toBeLessThan(0.1);
});
```

---

## Part 2: Animation Smoothness Verification

### 2.1 60fps Verification Strategy

**Target:** All animations should run at 60fps (16.67ms per frame) after CLS fixes

**Methods:**

#### Method 1: Chrome DevTools Performance Metrics (Manual)
**When:** During development, before committing
**How:**
1. Open Chrome DevTools → Performance tab
2. Click "Record" button
3. Interact with component (scroll, hover)
4. Stop recording
5. Analyze "Summary" tab for metrics:
   - **Rendering:** Should be < 1-2ms per frame
   - **Painting:** Should be < 1-2ms per frame
   - **Scripting:** Should be < 3-4ms per frame
   - Total < 16.67ms per frame

**Red Flags:**
- Green (rendering) bar exceeding 3ms consistently
- Purple (painting) bar exceeding 3ms consistently
- Red (scripting) bar exceeding 8ms
- Frame rate drops below 55fps

---

#### Method 2: Frame Rate Monitoring (Automated)
**Tool:** `performance.measure()` + analytics
**Pattern:**
```typescript
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
  frameCount++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    const fps = Math.round((frameCount * 1000) / (now - lastTime));
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(measureFPS);
}
```

---

#### Method 3: Lighthouse Performance Score
**Tool:** Playwright + Lighthouse API
**Metric to track:** "Speed Index" and "Cumulative Layout Shift"
**Expected:** No regression from current 92/100 score

---

### 2.2 Component-Specific Smoothness Tests

#### VisionMission Animation Smoothness
**Animations:**
1. Terminal text reveal (TerminalText component) — 22ms per character
2. Vision/mission cards fade-in + stagger — 0.6s + 0.1s stagger

**Test:**
```typescript
test('VisionMission: Terminal text animation smooth at 60fps', async ({ page }) => {
  await page.goto('/about');
  
  // Trigger performance monitoring
  await page.evaluate(() => {
    window.frameMetrics = [];
    let lastTime = performance.now();
    
    function checkFrame() {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 16.67) {
        window.frameMetrics.push(dt); // Jank frame
      }
      lastTime = now;
      if (now - window.frameMetrics[0] < 3000) { // 3 sec window
        requestAnimationFrame(checkFrame);
      }
    }
    requestAnimationFrame(checkFrame);
  });

  // Trigger animation
  await page.locator('section#vision-mission').scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);

  // Assert: < 10% jank frames (6 out of 60 frames per sec × 3 sec = 180 frames)
  const jankFrames = await page.evaluate(() => window.frameMetrics.length);
  expect(jankFrames).toBeLessThan(18); // ~10% jank tolerance
});
```

---

#### ServicesBento Typewriter Animation Smoothness
**Animation:** DiagnosticCard typewriter effect — 30ms per character × ~50 chars = 1.5s per cycle

**Test:**
```typescript
test('DiagnosticCard: Typewriter animation smooth', async ({ page }) => {
  await page.goto('/services');
  
  // Measure FPS during animation loop (3 cycles + pause)
  const fps = await page.evaluate(async () => {
    const readings = [];
    let frameCount = 0;
    const startTime = performance.now();
    
    function countFrame() {
      frameCount++;
      const elapsed = performance.now() - startTime;
      
      if (elapsed % 1000 < 16.67) { // Every 1 second
        readings.push(frameCount);
        frameCount = 0;
      }
      
      if (elapsed < 10000) { // 10 sec window
        requestAnimationFrame(countFrame);
      }
    }
    requestAnimationFrame(countFrame);
    
    return readings; // Array of FPS per second
  });

  const avgFps = fps.reduce((a, b) => a + b, 0) / fps.length;
  expect(avgFps).toBeGreaterThan(55); // 55+ FPS acceptable
});
```

---

#### SectionValues Hover Expansion Smoothness
**Animation:** max-h + opacity transition — 400ms duration

**Test:**
```typescript
test('SectionValues: Hover expansion smooth', async ({ page }) => {
  await page.goto('/about'); // or any page with SectionValues
  
  // Find first value card
  const firstCard = page.locator('[class*="group"]').filter({ hasText: /Innovation|Safety|Quality/ }).first();
  
  // Measure frame timing during 400ms hover expansion
  const jankEvents = await page.evaluate(async (selector) => {
    const element = document.querySelector(selector);
    const jankCount = [0];
    let lastFrame = performance.now();
    
    function check() {
      const now = performance.now();
      const delta = now - lastFrame;
      if (delta > 16.67) jankCount[0]++;
      lastFrame = now;
      if (now - window.hoverStart < 400) requestAnimationFrame(check);
    }
    
    window.hoverStart = performance.now();
    element.dispatchEvent(new MouseEvent('mouseenter'));
    requestAnimationFrame(check);
    
    await new Promise(r => setTimeout(r, 450));
    return jankCount[0];
  }, firstCard.selector());

  // 400ms ÷ 16.67ms = 24 frames. Allow up to 3 jank frames (12% tolerance)
  expect(jankEvents).toBeLessThan(3);
});
```

---

## Part 3: Responsive Breakpoint Testing Matrix

### 3.1 Viewport Breakpoints

Test these standard breakpoints to match Tailwind/project configuration:

| Breakpoint | Viewport | Devices | Priority |
|------------|----------|---------|----------|
| sm | 640px | Phone landscape, small tablet | HIGH |
| md | 768px | iPad, medium phone landscape | HIGH |
| lg | 1024px | Large tablet, laptop | MEDIUM |
| xl | 1280px | Desktop | MEDIUM |
| 2xl | 1536px | Wide desktop/ultrawide | LOW |

### 3.2 Component Breakpoint Coverage

#### VisionMission
| Viewport | Expected Layout | CLS Test | Notes |
|----------|-----------------|----------|-------|
| 375px (mobile) | Single column, stacked | YES | Default; no grid changes |
| 640px (sm) | Single column | YES | No layout shift expected |
| 768px (md) | 2 columns (lg:grid-cols-2) | YES | Grid activates |
| 1024px (lg) | 2 columns | YES | Full desktop layout |
| 1440px (2xl) | 2 columns | YES | Edge case; max container width |

---

#### ServicesBento Grid
| Viewport | Grid Layout | DiagnosticCard Span | CLS Test | Notes |
|----------|-------------|-------------------|----------|-------|
| 375px | 1 column | Full width (1 col) | YES | Mobile: single col |
| 640px (sm) | 2 columns | Full width (2 cols) | YES | Tablet: 2 cols, row 1 has Commercial(2) Industrial(1) Stats(1) |
| 768px (md) | 2 columns | Full width (2 cols) | YES | Tablet: same as sm |
| 1024px (lg) | 4 columns | 2 columns (cols 1-2, row 2) | YES | Desktop: 4 col grid |
| 1440px (2xl) | 4 columns | 2 columns (same positioning) | YES | Wide desktop |

**Specific test:** DiagnosticCard animation on mobile must NOT cause row-2 cards (Emergency, Power Dist) to shift.

---

#### SectionValues Grid
| Viewport | Grid Layout | Hover Behavior | CLS Test | Notes |
|----------|-------------|----------------|----------|-------|
| 375px | 1 column | Full-width expansion | YES | Mobile: cards stack vertically; expand full width |
| 640px (sm) | 1 column | Full-width expansion | YES | Still single column on sm |
| 768px (md) | 2 columns | 50% width expansion | YES | Grid activates |
| 1024px (lg) | 3 columns | 33% width expansion | YES | Full desktop |
| 1440px (2xl) | 3 columns | 33% width expansion | YES | Same as lg |

---

### 3.3 Responsive Breakpoint Test Cases

```typescript
test.describe('Responsive Breakpoint Tests', () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'sm', width: 640, height: 800 },
    { name: 'md', width: 768, height: 1024 },
    { name: 'lg', width: 1024, height: 768 },
    { name: 'xl', width: 1280, height: 720 },
    { name: '2xl', width: 1536, height: 864 },
  ];

  for (const bp of breakpoints) {
    test(`ServicesBento: CLS < 0.1 at ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/services');
      
      // Measure CLS during DiagnosticCard animation
      const cls = await measureCLS(page);
      expect(cls).toBeLessThan(0.1);
    });
  }
});
```

---

## Part 4: Edge Case Scenarios

### 4.1 Content Overflow Handling

**Scenario 1: SectionValues — Text Longer Than max-h-32**
```
Condition: value.full text exceeds 128px when expanded
Expected: Text truncates at max-h-32, overflow-hidden hides remainder
Test:
  1. Find a value card with lengthy description (> 200 chars)
  2. Hover and expand
  3. Inspect computed height: should be exactly 128px (max-h-32)
  4. Verify text is readable up to cutoff
  5. Assert: No visual glitches, layout stable
```

---

**Scenario 2: VisionMission — Very Long Terminal Text**
```
Condition: Vision/Mission statement longer than container width on mobile
Expected: Text wraps; container grows to accommodate (pre-animation, not during)
Test:
  1. Load /about on 375px mobile viewport
  2. Measure terminal text box height before animation
  3. Measure height after animation complete
  4. Assert: Height is same pre/post (no growth during animation)
```

---

### 4.2 Keyboard Navigation & Accessibility

**Scenario 3: SectionValues — Tab Navigation with Hover**
```
Condition: User tabs through value cards using keyboard
Expected: Hovering via tab does NOT expand card (hover-only behavior)
Test:
  1. Load page with SectionValues
  2. Tab to first card (should receive focus)
  3. Assert: Card does NOT expand (no :hover state via keyboard)
  4. Tab to second card
  5. Assert: Previous card collapses, new card does NOT expand
  6. Verify: Short description always visible, full description hidden
```

---

**Scenario 4: Touch Device Behavior — No Hover**
```
Condition: User on iOS/Android with touch screen (no hover capability)
Expected: Cards remain in initial state; full description not revealed
Test:
  1. Set device type: { ...devices['iPhone 12'] } in Playwright config
  2. Load page with SectionValues
  3. Tap card (simulate click)
  4. Assert: No expansion occurs
  5. Assert: Short description visible, full description hidden
```

---

### 4.3 Network Conditions

**Scenario 5: Slow Network — Delayed Image/Font Load**
```
Condition: Network slowed to "Slow 3G" (400 kbps down, 400ms latency)
Expected: Animation does not stall; CLS still < 0.1
Test:
  1. Set network: { ...throttling.slow3g } via DevTools Protocol or Playwright
  2. Load /about
  3. Scroll to VisionMission
  4. Measure CLS during animation with delayed DOM parsing
  5. Assert: CLS < 0.1 (animation may be slower, but no layout shift from delay)
```

---

**Scenario 6: Fast Network + High CPU Throttle**
```
Condition: User on fast network but CPU throttled (4x slower)
Expected: Animation jank accepted; CLS still < 0.1
Test:
  1. Set network: 4G, CPU throttle: 4x (e.g., old mobile device)
  2. Load /services
  3. Measure FPS during DiagnosticCard animation
  4. Assert: CLS < 0.1 (layout stable even with low FPS)
  5. Note: FPS may drop below 60, but CLS not affected by CPU throttle
```

---

### 4.4 Animation Interruption

**Scenario 7: Scroll Interruption — VisionMission**
```
Condition: User scrolls past section before animation completes
Expected: Animation stops gracefully; no layout shift spike
Test:
  1. Load /about
  2. Start scrolling to VisionMission (trigger IntersectionObserver)
  3. Mid-animation, rapidly scroll past section (scroll away)
  4. Measure CLS during and after scroll
  5. Assert: CLS < 0.1 (no spike from interruption)
```

---

**Scenario 8: Hover + Scroll Collision — SectionValues**
```
Condition: User hovers card while page is scrolling
Expected: Smooth behavior; no glitches or jumps
Test:
  1. Load page with SectionValues
  2. Scroll page slowly past cards
  3. While scrolling, simulate hover on a card
  4. Continue scrolling
  5. Assert: No layout shift, smooth animation continues
```

---

### 4.5 Browser/Rendering Edge Cases

**Scenario 9: CSS Transform vs. Height Animation**
```
Condition: Testing that fixes use transform/opacity, not height changes during animation
Expected: Animations are GPU-accelerated; no layout recalcs
Test:
  1. Load component
  2. Record browser DevTools trace during animation
  3. Inspect "Rendering" timeline:
     - Should see: "Composite Layers" task (GPU)
     - Should NOT see: "Recalculate Style" + "Layout" repeatedly
  4. Assert: Layout recalculations before animation starts, not during
```

---

**Scenario 10: Dark Mode CSS Transitions**
```
Condition: User toggles dark mode; animations running simultaneously
Expected: Theme switch does not cause CLS, animations continue smoothly
Test:
  1. Load /about with SectionValues visible
  2. Trigger dark mode toggle (e.g., via theme button)
  3. During theme transition, animate card (hover on desktop)
  4. Measure CLS during both theme + animation
  5. Assert: CLS < 0.1 (independent effects)
```

---

## Part 5: Existing Test Coverage Analysis

### 5.1 Current Test Suite Overview

**E2E Tests (Playwright):**
- `smoke-test.spec.ts` — Contact form, command palette, basic nav
- `baseline-capture.spec.ts` — Visual baselines (hero, smart-living, illumination, CTA, about)
- `boundaries.spec.ts` — Page load, route transitions, error handling
- `navigation-flows.spec.ts` — Multi-page flows, form navigation
- `captcha-integration.spec.ts` — CAPTCHA verification, token refresh
- `browser-agent-smoke.spec.ts` — Browser-based agent interactions
- `seo-metadata.spec.ts` — OG tags, meta tags, SEO
- `og-route-auth.spec.ts` — Open Graph route protection
- `timeline-routes.spec.ts` — Timeline page-specific routes

**Unit Tests (Vitest):**
- `use-cycling-text.test.ts` — Hook testing
- `rate-limit.test.ts` — Rate limiting logic
- `search-params.test.ts` — Utility functions
- Contact/Quotation/ServiceRequest form tests — Schema, routing, validation
- `timeline-adapters.contract.test.ts` — Data transformation
- `timeline-progress-controller.math.test.ts` — Math calculations

**Total:** 8 E2E specs + 13 unit test files

### 5.2 Gap Analysis

**What's NOT tested (CLS-related):**
- Layout shift measurement during animations
- Responsive breakpoint layout stability
- Hover/click interaction animation smoothness
- Visual regression from animation changes
- Animation jank detection (fps monitoring)
- Network throttle impact on CLS

**What SHOULD be tested:**
- ✅ Component renders correctly (baseline-capture does this visually)
- ✅ Routes accessible (boundaries, smoke-test do this)
- ❌ CLS measured during animations (NEW — this strategy)
- ❌ 60fps maintained during animations (NEW — this strategy)
- ❌ Responsive breakpoint stability (NEW — this strategy)
- ❌ Edge cases with slow network/CPU (NEW — this strategy)

### 5.3 Where to Add Tests

**Option A: New dedicated spec file**
- File: `e2e/cls-verification.spec.ts`
- Purpose: All CLS-related tests
- Benefit: Isolated, easy to run standalone
- Command: `pnpm test:e2e cls-verification.spec.ts`

**Option B: Extend baseline-capture.spec.ts**
- Add CLS measurement to existing baseline capture
- Benefit: Reuses existing page navigation logic
- Risk: Mixes baseline visuals with metrics

**Option C: New file for animation smoothness**
- File: `e2e/animation-performance.spec.ts`
- Purpose: FPS, jank detection, animation metrics
- Run in parallel with CLS tests

**Recommendation:** **Option A + Option C**
- Separate concerns: CLS measurement vs. animation smoothness
- Allow independent runs (`pnpm test:e2e cls-*` or `pnpm test:e2e animation-*`)
- Each file has clear, focused test cases

---

## Part 6: Playwright Test Plan

### 6.1 Test File Structure

**File 1: `e2e/cls-verification.spec.ts`**
- VisionMission CLS tests (3 scenarios × 4 breakpoints = 12 tests)
- ServicesBento CLS tests (4 scenarios × 3 breakpoints = 12 tests)
- SectionValues CLS tests (5 scenarios × 3 breakpoints = 15 tests)
- Total: ~40 CLS-focused tests

**File 2: `e2e/animation-performance.spec.ts`**
- VisionMission animation smoothness (FPS, jank)
- ServicesBento animation smoothness (FPS, jank)
- SectionValues hover smoothness (FPS, jank)
- Total: ~15 performance tests

**File 3: `e2e/animation-edge-cases.spec.ts`** (optional)
- Content overflow handling
- Slow network CLS impact
- Keyboard/touch behavior
- Animation interruption
- Dark mode transition
- Total: ~10 edge case tests

### 6.2 Test Utilities & Helpers

**Create: `e2e/utils/cls-measurement.ts`**
```typescript
export async function injectWebVitals(page: Page): Promise<void>;
export async function measureCLSDuringInteraction(
  page: Page,
  interactionFn: () => Promise<void>
): Promise<number>;
export async function scrollToElement(
  page: Page,
  selector: string
): Promise<void>;
```

**Create: `e2e/utils/performance-metrics.ts`**
```typescript
export async function measureFrameRate(
  page: Page,
  durationMs: number
): Promise<number>; // Returns average FPS
export async function detectJank(
  page: Page,
  durationMs: number
): Promise<number>; // Returns jank frame count
export async function capturePerformanceTrace(
  page: Page,
  interactionFn: () => Promise<void>
): Promise<PerformanceTrace>;
```

### 6.3 Test Naming Convention

**Pattern:** `{Component}: {Scenario} @ {Viewport}`

Examples:
```
✓ VisionMission: CLS < 0.1 during scroll @ 375px
✓ VisionMission: CLS < 0.1 during scroll @ 768px
✓ VisionMission: CLS < 0.1 during scroll @ 1024px
✓ ServicesBento: CLS stable during DiagnosticCard animation @ 375px mobile
✓ ServicesBento: CLS stable during DiagnosticCard animation @ 768px tablet
✓ ServicesBento: CLS stable during DiagnosticCard animation @ 1024px desktop
✓ SectionValues: CLS < 0.05 during hover expansion @ desktop
✓ SectionValues: No expansion on hover @ mobile touch device
```

### 6.4 CI/CD Integration

**Playwright Config Updates:**
```typescript
// playwright.config.ts
export default defineConfig({
  // ... existing config
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'chromium-tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
});
```

**GitHub Actions:**
```yaml
- name: Run E2E Tests (CLS & Performance)
  run: |
    pnpm test:e2e cls-verification.spec.ts
    pnpm test:e2e animation-performance.spec.ts
```

---

## Part 7: Regression Detection & Prevention

### 7.1 Regression Checklist (Post-Fix)

Before merging CLS fixes, verify:

- [ ] **Lighthouse Score:** 92+ (no regression from current 92)
- [ ] **CLS Metric:** All components < 0.1
  - [ ] VisionMission @ 375px, 768px, 1024px
  - [ ] ServicesBento @ 375px, 768px, 1024px
  - [ ] SectionValues @ 375px, 768px, 1024px
- [ ] **Animation FPS:** 55+ FPS on all animations
  - [ ] VisionMission terminal + cards
  - [ ] ServicesBento typewriter
  - [ ] SectionValues hover expansion
- [ ] **Build:** `pnpm typecheck && pnpm build` passes
- [ ] **Existing Tests:** All E2E + unit tests pass
- [ ] **Visual Regression:** Baseline screenshots unchanged (use Playwright visual diff)

### 7.2 Sibling Component Impact

**Components to test after fixes (ensure no unintended shifts):**

| Component | File | Risk | Test |
|-----------|------|------|------|
| ServicesHero | services-hero.tsx | Medium | Render near fixed-height cards |
| ProjectCardShell | projects/*.tsx | Low | Render in grid with services |
| Timeline | timeline/*.tsx | Low | Independent animation |
| NavBar | navigation/*.tsx | Low | Position: fixed, unaffected |

**Test Pattern:**
```typescript
test('SectionValues fix does not impact sibling components', async ({ page }) => {
  await page.goto('/about');
  
  // Measure layout of both SectionValues AND footer below it
  const sectionBounds = await page.locator('#section-values').boundingBox();
  const footerBounds = await page.locator('footer').boundingBox();
  
  // Hover a value card (expands)
  await page.locator('[class*="group"]').first().hover();
  await page.waitForTimeout(450); // 400ms + buffer
  
  // Remeasure footer position
  const footerBoundsAfter = await page.locator('footer').boundingBox();
  
  // Assert: Footer position is same (no shift from parent expansion)
  expect(footerBoundsAfter.y).toBe(footerBounds.y);
});
```

---

### 7.3 Automated Regression Prevention

**Add to `playwright.config.ts`:**
```typescript
expect: {
  // Snapshot threshold: allow < 1% pixel diff for visual regression
  toHaveScreenshot: {
    threshold: 0.01,
    animations: 'disabled', // Disable animations for consistent snapshots
  },
},
```

**Run visual regression tests:**
```bash
pnpm test:e2e --update-snapshots  # Generate/update baselines
pnpm test:e2e                     # Compare against baselines
```

---

## Part 8: Manual QA Checklist

For developers during development (before automated tests):

### Pre-Fix Validation (Measure Baseline)

- [ ] Open `/about` in Chrome DevTools
- [ ] Record Performance trace while scrolling to VisionMission
- [ ] Inspect DevTools: measure frame times, FPS
- [ ] Document baseline CLS value (use Lighthouse or manual observation)
- [ ] Repeat for `/services` (DiagnosticCard) and SectionValues

### Post-Fix Validation (Verify Improvement)

- [ ] Open same pages in DevTools
- [ ] Repeat performance trace recordings
- [ ] Verify:
  - [ ] No layout shift visual artifacts
  - [ ] Animation timing unchanged or improved
  - [ ] 60fps maintained
  - [ ] No console errors/warnings

### Cross-Browser Testing

- [ ] Test in Chrome (Chromium engine)
- [ ] Test in Firefox (Gecko engine)
- [ ] Test in Safari (WebKit engine)
- [ ] Verify CLS behavior consistent across browsers

### Device Testing

- [ ] Test on physical iPhone/Android (real touch behavior)
- [ ] Test on iPad/large tablet (layout at md breakpoint)
- [ ] Test on Windows laptop (standard 1920x1080)
- [ ] Test on Mac (Retina display, 2x pixel ratio)

---

## Part 9: Metrics & Success Criteria

### 9.1 Definition of "Fixed"

| Component | Metric | Target | Acceptance |
|-----------|--------|--------|-----------|
| All | CLS Score | < 0.1 | PASS if < 0.1 on all breakpoints |
| All | Animation FPS | > 55 FPS | PASS if avg FPS ≥ 55 |
| VisionMission | Layout Shift | 0 during animation | PASS if height fixed before animation |
| ServicesBento | Mobile CLS | < 0.05 | PASS if no sibling shift on 375px |
| SectionValues | Hover CLS | < 0.05 | PASS if < 0.05 during 400ms transition |

### 9.2 Performance Budget

**Lighthouse Thresholds (CI/CD gating):**
- Performance: ≥ 90 (currently 92)
- CLS: < 0.1 (good Web Vitals)
- LCP: < 2.5s
- INP: < 200ms

**Fail CI if:**
- Lighthouse score drops below 90
- CLS increases by > 0.05 from baseline
- E2E CLS tests report > 0.1

---

## Part 10: Execution Timeline

### Week 1: Measurement & Baseline
- [ ] Day 1: Implement CLS measurement utilities
- [ ] Day 2: Create and run baseline CLS capture tests
- [ ] Day 3: Document baseline metrics
- [ ] Day 4: Create performance measurement utilities
- [ ] Day 5: Validate test harness is working

### Week 2: Component Fixes
- [ ] Day 1-2: Implement VisionMission CLS fix
- [ ] Day 3: Implement ServicesBento CLS fix
- [ ] Day 4: Implement SectionValues CLS fix
- [ ] Day 5: Full regression testing

### Week 3: Validation & Optimization
- [ ] Day 1-2: Run full test suite; verify all metrics
- [ ] Day 3: Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Day 4: Device testing (mobile, tablet, desktop)
- [ ] Day 5: Final Lighthouse audit + merge

---

## Summary

This QA strategy provides:

1. **Measurement:** Web Vitals library, Lighthouse, DevTools Performance
2. **Verification:** 40+ CLS tests across 3 components × 4+ breakpoints
3. **Coverage:** Edge cases (network, CPU, overflow, keyboard, touch)
4. **Automation:** Playwright E2E tests, CI/CD integration, performance budgets
5. **Prevention:** Regression detection, sibling component testing, visual snapshots
6. **Success Criteria:** CLS < 0.1, FPS > 55, Lighthouse ≥ 90

All tests are organized in dedicated Playwright spec files, follow project conventions, and integrate with existing test infrastructure.
