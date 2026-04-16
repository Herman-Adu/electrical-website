# Accessibility & Content Safety Analysis: CLS Fixes for Layout Shift Components

**Analysis Date:** 2026-04-16  
**Scope:** Three components with hidden-content-reveal animations  
**Impact:** Cumulative Layout Shift (CLS) prevention vs. accessibility/keyboard usability  
**Status:** Blockers & gaps identified; implementation plan ready

---

## Executive Summary

Three components use animations to reveal hidden content, causing layout shifts:

| Component | Mechanism | Current A11y Gaps | CLS Fix Impact |
|-----------|-----------|------------------|----------------|
| **visionMission** | Terminal text type effect + IntersectionObserver trigger | No ARIA coordination; all text always visible to SR | Content remains fully accessible |
| **ServicesBento (mobile)** | `DiagnosticCard` animates text into view; no grow effect | Decorative content (`aria-hidden`); full text visible | New `min-h` prevents jumps |
| **SectionValues (hover)** | `max-h: 0 → max-h-32` + `opacity: 0 → 100` on hover | **No keyboard support**; hidden from SR; no ARIA | Must add keyboard + ARIA + fixed height |

---

## 1. COMPONENT: visionMission

**File:** `components/about/vision-mission.tsx`  
**Issue:** Two divs (vision & mission) grow dynamically to fit content as `TerminalText` types out  
**Hidden Content Technique:** None — text is always in DOM; animation is purely visual (typewriter effect)

### Current Accessibility State

✅ **Strengths:**
- All text content is **always in DOM**, always visible to screen readers
- No `display: none`, `visibility: hidden`, or `max-height: 0` hiding
- `TerminalText` component shows full content immediately to SR (typing animation is JavaScript-only)
- No ARIA attributes needed — content is naturally exposed

❌ **Gaps:**
1. **No `aria-label` or `aria-describedby` on animated sections**
   - Screen readers announce the text, but don't know it's being animated
   - May cause confusing playback if user navigates during animation

2. **IntersectionObserver uses `threshold: 0.4`**
   - Triggers animation at 40% visibility; not documented in UI
   - No `role="status"` or `aria-live` on container to announce animation start

3. **No `prefers-reduced-motion` coordination with `TerminalText`**
   - Component checks `useAnimatedBorders.shouldReduce` for divider animation
   - But `TerminalText` ignores this setting — still types even if user disabled animations

4. **No accessible name for vision/mission container**
   - Sections lack `aria-labelledby` pointing to the h2 headlines

### Content Visibility Edge Cases

**Q: Can all text fit if content exceeds initial bounds?**  
A: Yes — divs have no height constraints. As `TerminalText` types, parent `div` naturally grows. No overflow risk.

**Q: What if animation is slow (network latency)?**  
A: `TerminalText` uses `setInterval` (22ms per char). Only network-invisible to the JS runtime itself. Layout grows smoothly.

### Keyboard/Form Validation Impact

**N/A** — Section is read-only, no form fields inside hidden content.

### Type Safety Check

**Current Props:**
```typescript
// visionMission exports only VisionMission() function component
// No props interface; uses hardcoded data
```

**Needed:**
- Add `aria-labelledby` to vision/mission containers
- Add `role="region"` + `aria-label="Vision statement animation"`
- Coordinate `TerminalText` with `shouldReduce`

---

## 2. COMPONENT: ServicesBento (Mobile) – DiagnosticCard

**File:** `components/services/services-bento.tsx:322–398`  
**Issue:** `DiagnosticCard` typewriter text flows into view; on mobile, container grows, causing layout shift in bento grid  
**Hidden Content Technique:** Content starts in DOM but is progressively revealed via `displayText` state variable (JavaScript)

### Current Accessibility State

✅ **Strengths:**
- Full diagnostic messages are **always available in the messages array** (hardcoded)
- Text content is rendered to DOM progressively (not truly hidden)
- Window dots have `aria-hidden` (correct — purely decorative)
- `isMounted` check prevents hydration mismatch

❌ **Gaps:**
1. **No announcement of dynamic content updates**
   - Screen reader sees pre-rendered empty div, then text appears
   - No `aria-live="polite"` or `aria-live="assertive"` on the output container
   - User won't know text is being added dynamically

2. **No `aria-busy` during animation**
   - Container should signal it's loading/populating
   - Currently no state to indicate "animation in progress"

3. **No keyboard interaction**
   - Diagnostics auto-play/loop; no pause/resume button
   - Tab key can't access content (read-only text, not focusable)

4. **Hardcoded `min-h-25` doesn't reserve space**
   - On mobile, if messages are short, container won't fully reserve space
   - Bento grid items below may shift when messages arrive

### Content Visibility Edge Cases

**Q: What if one message is very long and exceeds `min-h-25`?**  
A: Current code has `overflow: hidden` (implicit in `.p-3` container). **Text may be clipped on narrow mobile screens.**

**Q: What if network is slow and DiagnosticCard is last to render?**  
A: `isMounted` prevents rendering until component hydrates. Grid layout should be stable, but vertical space isn't reserved until animation starts.

**Q: Mobile vs desktop — same height needed?**  
A: Currently yes (no breakpoint variants). But mobile messages might need less vertical space than desktop.

### Keyboard/Form Validation Impact

**N/A** — Read-only diagnostic output. No form fields inside.

### Type Safety Check

**Current Props:**
```typescript
interface { delay: number }
```

**Needed:**
- Add `aria-busy` state
- Add `aria-live="polite"` to output container
- Reserve min-height on mobile with breakpoint-aware value

---

## 3. COMPONENT: SectionValues (Hover-Reveal)

**File:** `components/shared/section-values.tsx:72–139`  
**Issue:** Value cards have short + full description; full description is `max-h: 0 → max-h-32` on hover, revealing hidden content  
**Hidden Content Technique:** `opacity: 0`, `max-h: 0`, `overflow: hidden` combined for smooth height animation

### Current Accessibility State

✅ **Strengths:**
- Text content is **always in DOM** (not removed from source)
- No `display: none` or `visibility: hidden` — pure CSS
- Icon colors are semantic (cyan vs amber)
- Data structure supports both `short` and `full` descriptions

❌ **Critical Gaps:**

#### 1. **No Keyboard Support for Expansion** ⚠️ HIGH SEVERITY
- Hover is mouse-only; keyboard users cannot expand
- No `Enter`, `Space`, or `Tab` behavior to reveal full description
- **WCAG 2.1 AA violation:** Keyboard accessibility (2.1.1)
- Keyboard users never discover the full content

#### 2. **Hidden Content Not Exposed to Screen Readers** ⚠️ HIGH SEVERITY
- `opacity: 0` + `max-h: 0` = invisible to visual users AND screen readers
- Full description (`value.full`) is in DOM but effectively hidden
- Screen reader announces only `short` description
- **WCAG 2.1 AAA violation:** Content accessibility (3.2.4)

#### 3. **No ARIA Attributes to Signal Expansion**
- No `aria-expanded` on the card to indicate expanded/collapsed state
- No `aria-label` differentiating short from full description
- Screen reader user won't know more content exists

#### 4. **Focus Management Missing**
- If card becomes focusable (via keyboard), tab order not defined
- Focus indicator may not be visible on small/mobile screens

#### 5. **Unclear Tab Order on Mobile**
- Mobile doesn't have hover; cards are always shown short description
- Desktop hover-reveal contradicts mobile non-interactive state
- User expects tap-to-expand on mobile but it doesn't exist

### Content Visibility Edge Cases

**Q: What if `value.full` exceeds `max-h-32` on some breakpoints?**  
A: **Text will be clipped.** `max-h-32` = 128px. On mobile (narrow text), longer full descriptions will overflow.  
**Fix needed:** Dynamic max-height per breakpoint or scrollable area.

**Q: What if full description is empty or shorter than 80 chars?**  
A: `value.full.slice(0, 80)` may show full text on short entries. Then full description appears identical to short description, confusing users.  
**Fix needed:** Conditional rendering — if `full.length < 80`, hide short description entirely.

**Q: Does animation block interaction during transition?**  
A: `group-hover:max-h-32` is CSS transition (400ms). User can hover/unhover during transition; content partially visible.  
**Fix needed:** Consider `pointer-events: none` during animation or faster transition.

### Keyboard/Form Validation Impact

**N/A** — Cards are display-only value statements. No form fields inside.

### Type Safety Check

**Current Props:**
```typescript
interface SectionValue {
  icon: IconName;
  title: string;
  short: string;      // Always visible
  full: string;       // Hidden until hover
  color?: AccentColor;
}
```

**Gaps:**
- No `isExpandable` flag to distinguish cards with no additional content
- No `tabindex` control
- No `aria-*` attributes in component JSX

---

## Cross-Cutting Pattern: Unified A11y Strategy

### Problem: Inconsistent Hidden Content Handling

| Component | Hide Technique | SR Access | Keyboard | Mobile |
|-----------|----------------|-----------|----------|--------|
| visionMission | Never hidden (typewriter) | ✅ Full access | N/A (read-only) | ✅ Works |
| ServicesBento | Text progressive reveal | ⚠️ No `aria-live` | N/A (auto-play) | ⚠️ CLS on mobile |
| SectionValues | `opacity: 0` + `max-h: 0` | ❌ Hidden from SR | ❌ Hover only | ❌ No expand |

### Solution: Three-Tier A11y Framework

#### Tier 1: Always-Visible Content (visionMission pattern)
**For:** Content that's animating but not truly hidden  
**Rules:**
- Keep in DOM always
- Use `aria-live="polite"` if dynamically updated
- Add `aria-label` to container
- Respect `prefers-reduced-motion`

#### Tier 2: Progressive Reveal (ServicesBento pattern)
**For:** Content animated into view sequentially  
**Rules:**
- Reserve space with `min-h-[calculated-value]` to prevent CLS
- Add `aria-busy` while populating
- Add `aria-live="polite"` to announce new content
- Consider play/pause controls for keyboard users

#### Tier 3: Expandable/Collapsible (SectionValues pattern)
**For:** Content revealed on user action (hover/click)  
**Rules:**
- Add `aria-expanded` to button/card
- Add `aria-controls` linking to revealed element
- Support both hover AND keyboard (Enter, Space, or dedicated button)
- Ensure `max-h` is large enough or use `max-h-max` with scrollable area
- Test on mobile (no hover) — provide tap-to-expand or tap-to-scroll

---

## Type Safety & ARIA Attribute Checklist

### visionMission Props

**Current:**
```typescript
// No props; hardcoded data
```

**Needed:**
```typescript
interface VisionMissionProps {
  // Optional: move to props if reused
}

interface TerminalTextProps {
  text: string;
  trigger: boolean;
  // NEW:
  ariaLive?: 'polite' | 'assertive'; // Default: 'polite'
  ariaLabel?: string; // e.g., "Vision statement animation"
  respectReducedMotion?: boolean; // NEW
}
```

**JSX Changes:**
```tsx
<section
  id="vision-mission"
  ref={sectionRef}
  className="..."
  role="region"
  aria-labelledby="vision-heading mission-heading"
>
  <div>
    <h2 id="vision-heading">Our Vision</h2>
    <TerminalText
      text="..."
      trigger={visionTriggered}
      ariaLive="polite"
      ariaLabel="Vision statement revealing character by character"
      respectReducedMotion={shouldReduce}
    />
  </div>
</section>
```

---

### ServicesBento (DiagnosticCard) Props

**Current:**
```typescript
function DiagnosticCard({ delay }: { delay: number })
```

**Needed:**
```typescript
interface DiagnosticCardProps {
  delay: number;
  // NEW:
  minHeightClass?: string; // e.g., 'min-h-40 sm:min-h-48' to reserve space
  ariaLiveRegion?: boolean; // Enable live region announcements
}
```

**JSX Changes:**
```tsx
<div
  className="flex-1 min-h-25 p-3 rounded-xl ..."
  role="status"
  aria-live="polite"
  aria-busy={!isComplete}
>
  <div className="... whitespace-pre-line">
    {displayText}
  </div>
</div>
```

---

### SectionValues Props & State

**Current:**
```typescript
interface SectionValue {
  icon: IconName;
  title: string;
  short: string;
  full: string;
  color?: AccentColor;
}
```

**Needed:**
```typescript
interface SectionValue {
  icon: IconName;
  title: string;
  short: string;
  full: string;
  color?: AccentColor;
  // NEW:
  isExpandable?: boolean; // true if full differs from short
}

interface SectionValueCardProps extends SectionValue {
  idx: number;
  // NEW:
  onKeyboardExpand?: (idx: number) => void;
  isExpanded?: boolean;
  tabIndex?: number;
}
```

**JSX Changes:**
```tsx
<motion.div
  className="... group relative p-8 ..."
  role="button"  // NEW
  aria-expanded={isExpanded}  // NEW
  aria-describedby={`value-desc-${idx}`}  // NEW
  tabIndex={0}  // NEW
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onKeyboardExpand?.(idx);
    }
  }}
>
  <p id={`value-desc-${idx}`} className="... opacity-0 max-h-0 ..." />
</motion.div>
```

---

## Testing Strategy

### Unit Tests (Vitest/Jest)

#### visionMission
```typescript
describe('VisionMission', () => {
  test('TerminalText respects prefers-reduced-motion', () => {
    // Mock matchMedia
    // Assert: animation disabled when motion = reduce
  });

  test('All text is in DOM before animation starts', () => {
    // Render component
    // Assert: full text visible in queryAllByText (not just displayed text)
  });
});
```

#### ServicesBento (DiagnosticCard)
```typescript
describe('DiagnosticCard', () => {
  test('aria-live announcements fire when text updates', () => {
    // Mock screen reader
    // Assert: aria-live="polite" fires with new content
  });

  test('aria-busy reflects isComplete state', () => {
    // Assert: aria-busy="true" while typing
    // Assert: aria-busy="false" when done
  });
});
```

#### SectionValues
```typescript
describe('SectionValues', () => {
  test('Keyboard users can expand cards with Enter', async () => {
    render(<SectionValues data={mockData} />);
    const card = screen.getByRole('button', { name: /safety/i });
    
    fireEvent.keyDown(card, { key: 'Enter' });
    
    await waitFor(() => {
      expect(card).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('Full description visible to screen reader when expanded', () => {
    const { getByText } = render(<SectionValues data={mockData} />);
    
    // Check that `full` text is in document (not hidden from SR)
    expect(getByText(/full description text/)).toBeInTheDocument();
  });

  test('Mobile: cards should show full description (no hover)', () => {
    // Render at mobile viewport
    // Assert: full description visible or accessible via button
  });
});
```

### Playwright E2E Tests

#### visionMission
```typescript
test('Vision/Mission text is fully visible to screen readers', async () => {
  const page = await browser.newPage();
  await page.goto('/about');
  
  // Lighthouse a11y audit
  const audit = await page.getAccessibilitySnapshot();
  
  // Assert no violations related to hidden text
  expect(audit.violations).toEqual([]);
});

test('Animation respects prefers-reduced-motion', async () => {
  const page = await browser.newPage();
  
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  
  // Measure animation duration
  const duration = await page.evaluate(() => {
    // TerminalText animation should be instant or very fast
    return 'NEEDS_IMPLEMENTATION';
  });
  
  expect(duration).toBeLessThan(100); // < 100ms is "instant"
});
```

#### ServicesBento (DiagnosticCard)
```typescript
test('DiagnosticCard does not cause CLS on mobile', async () => {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  
  await page.goto('/');
  
  // Measure CLS before/after animation
  const clsBeforeAnimation = await page.evaluate(() => {
    // getLayoutShiftEntries()
    return 'NEEDS_IMPLEMENTATION';
  });
  
  // Wait for animation to complete
  await page.waitForTimeout(3000);
  
  const clsAfterAnimation = await page.evaluate(() => {
    // getLayoutShiftEntries()
    return 'NEEDS_IMPLEMENTATION';
  });
  
  // CLS should not increase significantly
  expect(clsAfterAnimation - clsBeforeAnimation).toBeLessThan(0.01);
});

test('DiagnosticCard live region updates are announced', async () => {
  const page = await browser.newPage();
  
  // Use Chrome DevTools Protocol to capture accessibility tree changes
  const accessibilityTree = await page.accessibility.snapshot();
  
  // Assert: aria-live changes are detected
  expect(accessibilityTree).toContainLiveRegion('polite');
});
```

#### SectionValues
```typescript
test('SectionValues cards are expandable via keyboard', async () => {
  const page = await browser.newPage();
  await page.goto('/about');
  
  // Tab to first value card
  await page.keyboard.press('Tab');
  
  // Press Enter to expand
  await page.keyboard.press('Enter');
  
  // Check that aria-expanded changed
  const expanded = await page.getAttribute(
    '[role="button"]:focus',
    'aria-expanded'
  );
  
  expect(expanded).toBe('true');
});

test('SectionValues full descriptions are not hidden from screen readers', async () => {
  const page = await browser.newPage();
  await page.goto('/about');
  
  // Get accessibility snapshot
  const snapshot = await page.accessibility.snapshot();
  
  // Check that full descriptions are in the tree
  snapshot.children.forEach((node) => {
    if (node.role === 'button' && node.name.includes('Safety')) {
      expect(node.description).toContain('full description text');
    }
  });
});

test('SectionValues on mobile shows or allows access to full descriptions', async () => {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  
  await page.goto('/about');
  
  // Either:
  // 1. Full description is visible
  const isVisible = await page.isVisible('[role="button"] + p');
  
  // OR:
  // 2. Card is tappable to expand
  const isExpandable = await page.getAttribute(
    '[role="button"]',
    'aria-expanded'
  );
  
  expect(isVisible || isExpandable !== null).toBe(true);
});

test('SectionValues max-h does not clip text on any breakpoint', async () => {
  const viewports = [
    { width: 375, height: 667 },  // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1920, height: 1080 }, // Desktop
  ];
  
  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize(viewport);
    await page.goto('/about');
    
    // Check if any text overflows
    const isClipped = await page.evaluate(() => {
      const desc = document.querySelector('[role="button"] + p');
      return desc && desc.scrollHeight > desc.clientHeight;
    });
    
    expect(isClipped).toBe(false); // No clipping
  }
});
```

### Manual Testing Checklist

#### Screen Reader (NVDA / JAWS on Windows, VoiceOver on Mac)
- [ ] visionMission: Entire vision statement is announced, not just visible portion
- [ ] visionMission: User is informed animation is in progress ("animation", "typing")
- [ ] ServicesBento: Diagnostic card outputs are announced as they appear (not silent)
- [ ] SectionValues: Short description is announced; full description available via arrow keys or Tab + Enter
- [ ] SectionValues: `aria-expanded` state is announced when toggled

#### Keyboard Only (No Mouse)
- [ ] visionMission: Tab through section; all content accessible
- [ ] ServicesBento: Tab through grid; diagnostic card can be paused/resumed (if added)
- [ ] SectionValues: Tab to each card; Enter/Space expands; full description revealed; Tab to next card

#### Mobile (iOS VoiceOver, Android TalkBack)
- [ ] visionMission: Animation works; doesn't jump layout
- [ ] ServicesBento: CLS is not visible; layout is stable during animation
- [ ] SectionValues: Tap to expand or full description always visible; no hover-only content

#### Mobile (Touch, No Screen Reader)
- [ ] SectionValues: Cards are responsive; no fixed heights that break at different screen sizes
- [ ] All: Tap interactions work (not just hover)

#### Window Resizing (Responsive)
- [ ] SectionValues: `max-h-32` is sufficient on all breakpoints; no text clipping
- [ ] ServicesBento: `min-h` reserves appropriate space on mobile/tablet/desktop

---

## Implementation Priority & Risk Matrix

| Component | Issue | Severity | WCAG Level | Effort | Risk | Priority |
|-----------|-------|----------|-----------|--------|------|----------|
| visionMission | No `aria-live` on animated text | Medium | AA | 1h | Low | 3 |
| visionMission | `prefers-reduced-motion` ignored | High | AAA | 1h | Low | 2 |
| ServicesBento | No `aria-live` on diagnostics | Medium | AA | 30min | Low | 3 |
| ServicesBento | `min-h` doesn't reserve space on mobile | High | N/A (UX) | 1h | Medium | 1 |
| SectionValues | **No keyboard support** | Critical | AA | 3h | Medium | 1 |
| SectionValues | **Hidden from screen readers** | Critical | AA | 2h | Medium | 1 |
| SectionValues | `max-h-32` may clip text | High | AA | 1h | Low | 2 |
| SectionValues | No focus management | Medium | AA | 1h | Low | 3 |

---

## Summary: Blockers & Fixes Needed Before Launch

### Blocking Issues (WCAG AA Violations)

1. **SectionValues: No keyboard expansion** ⚠️
   - Fix: Add `role="button"`, `aria-expanded`, and keydown handler for Enter/Space
   - Time: 3 hours
   - Risk: May break visual hover behavior if not carefully tested

2. **SectionValues: Hidden content not exposed to SR** ⚠️
   - Fix: Change `opacity: 0` → `opacity: 100` OR use `aria-describedby` + `aria-expanded`
   - Time: 2 hours
   - Risk: Layout shift if full description is always visible (needs `min-h`)

3. **ServicesBento: CLS on mobile during animation** ⚠️
   - Fix: Add `min-h-[calculated]` or reserve space in bento grid
   - Time: 1 hour
   - Risk: Low — pure CSS addition

### Non-Blocking Enhancements (WCAG AAA)

4. **visionMission: Respect `prefers-reduced-motion`**
   - Fix: Pass `shouldReduce` prop to `TerminalText`, adjust interval
   - Time: 1 hour
   - Risk: Low — optional enhancement

5. **visionMission: Add `aria-live` for animation context**
   - Fix: Wrap section in `role="region"` + `aria-labelledby`, add `aria-live="polite"` to text
   - Time: 30 minutes
   - Risk: Low — annotation-only

6. **SectionValues: Ensure `max-h` doesn't clip**
   - Fix: Test on all breakpoints; increase to `max-h-max` with scrollable area if needed
   - Time: 1 hour
   - Risk: Low — CSS adjustment

---

## Next Steps

1. **Immediate (Blocking):**
   - [ ] Add keyboard + ARIA to SectionValues (Enter/Space expand)
   - [ ] Fix SectionValues hidden-from-SR issue (via `aria-described-by` or visible full text with `min-h`)
   - [ ] Reserve space in ServicesBento mobile layout

2. **Short-term (1–2 weeks):**
   - [ ] Add `prefers-reduced-motion` support to visionMission & ServicesBento
   - [ ] Add `aria-live` to both for animation context
   - [ ] Test all three on mobile + keyboard + screen readers

3. **Verification:**
   - [ ] Run Lighthouse a11y audit on all three components
   - [ ] Playwright E2E tests for keyboard + SR
   - [ ] Manual testing with NVDA, JAWS, VoiceOver

---

**Document prepared for Validation SME review and implementation planning.**
