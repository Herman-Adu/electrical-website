# Animation Optimization Execution Plan

**Goal:** Systematically fix clunky animations across electrical-website → smooth, professional 60fps animations

**Status:** Ready for execution in new Claude Code window

---

## Phase 1: Audit Current Animations

**Duration:** 2-3 hours
**Agents:** None (orchestrator analysis)

### Tasks

1. **Inventory all animations**
   - Find all files with animations (grep for `animate`, `motion`, `ScrollTrigger`, `transition`, `keyframes`)
   - Document in `ANIMATION_AUDIT.md`
   - Note: animation type, current approach, identified issues

2. **Identify flicker patterns**
   - Animations that flicker on scroll
   - Animations with layout shift
   - Animations that stutter (janky feel)
   - Animations that don't sync properly

3. **Profile performance**
   - Use Chrome DevTools Performance tab
   - Record scroll animations on each section
   - Identify frame drops and layout recalculations
   - Document baseline metrics

4. **Categorize by approach**
   - Which use CSS animations?
   - Which use JavaScript listeners?
   - Which use GSAP?
   - Which use Framer Motion?
   - Which use manual state updates?

**Deliverable:** `ANIMATION_AUDIT.md` with complete inventory, issues, and priority ranking

---

## Phase 2: Fix High-Priority Animations (Scroll Flicker)

**Duration:** 4-6 hours per section
**Skills:** gsap-scrolltrigger
**Pattern:** Issue → GSAP ScrollTrigger fix

### High-Priority Sections (Scroll Flicker Issues)

**Section 1: Hero Section**
- Issue: Animation flickers on scroll entry
- Current: Likely CSS animation or state update
- Fix: Use GSAP ScrollTrigger with `once: true`
- Subtask: Diagnose flicker, apply fix pattern
- Owner: gsap-scrolltrigger agent

**Section 2: Projects Grid**
- Issue: Cards flicker on scroll, layout shift suspected
- Current: Multiple entrance animations
- Fix: Batch with GSAP, animate only transform
- Subtask: Fix layout shift, prevent re-triggering
- Owner: gsap-scrolltrigger agent

**Section 3: Timeline Section**
- Issue: Scroll-triggered words animate with flicker
- Current: Complex multi-element animation
- Fix: Sync with timeline pattern
- Subtask: Sync animations, prevent jank
- Owner: gsap-scrolltrigger agent

**Section 4: Services/Features**
- Issue: Multiple entrance animations competing
- Current: Individual scroll listeners?
- Fix: Batch animate, GPU acceleration
- Subtask: Optimize performance, add GPU hints
- Owner: gsap-scrolltrigger agent

### For Each Section

1. **Diagnose**
   - Invoke gsap-scrolltrigger agent with subtask: `diagnose`
   - Target: Section file
   - Intensity: FULL

2. **Fix**
   - Invoke gsap-scrolltrigger agent with subtask: `fix`
   - Apply recommendations
   - Add will-change CSS
   - Ensure cleanup

3. **Validate**
   - Test in browser: 60fps smooth, no flicker
   - Profile with DevTools
   - Verify layout not shifting
   - Test on mobile

**Deliverable:** Fixed sections, each with zero flicker, 60fps smooth

---

## Phase 3: Enhance Component Animations (Framer Motion)

**Duration:** 2-3 hours per feature
**Skills:** framer-motion
**Pattern:** Upgrade simple components → smooth, professional motion

### Components to Enhance

**Priority 1: Interactive Cards**
- Add hover scale + tap feedback
- Smooth state transitions
- Gesture-driven interactions

**Priority 2: Navigation**
- Smooth page transitions
- Menu entrance/exit animations
- Button hover effects

**Priority 3: Forms**
- Input focus animations
- Error state transitions
- Success feedback animations

### For Each Component

1. **Implement**
   - Invoke framer-motion agent with subtask: `implement`
   - Target: Component name
   - Choose animation type
   - Intensity: LOW (fast) or FULL (comprehensive)

2. **Verify**
   - Test gesture interactions
   - Verify 60fps
   - Test on touch devices
   - Check accessibility (prefers-reduced-motion)

**Deliverable:** Enhanced components with smooth, professional animations

---

## Phase 4: Bulk Scroll Reveals (AOS)

**Duration:** 1-2 hours per page
**Skills:** aos-scroll-reveal
**Pattern:** Add simple entrance animations to many elements

### Pages/Sections for Bulk Reveals

**Priority 1: Homepage**
- Setup AOS in layout
- Add fade-in to hero text
- Add staggered animations to features/services
- Add directional slides to images

**Priority 2: Projects Page**
- Grid of projects with staggered entrance
- Project cards with consistent animation
- Filter/sort animations

**Priority 3: Other Pages**
- Team section
- Timeline
- CTA sections

### Process

1. **Setup**
   - Invoke aos-scroll-reveal agent with subtask: `setup`
   - Target: app/layout.tsx
   - Install AOS if needed

2. **Implement**
   - Invoke aos-scroll-reveal agent with subtask: `implement`
   - Add data-aos attributes to elements
   - Configure delays/durations

3. **Stagger**
   - Invoke aos-scroll-reveal agent with subtask: `stagger`
   - Setup staggered animations for lists/grids

4. **Optimize**
   - Profile performance
   - Disable on mobile if needed
   - Tune offset/duration

**Deliverable:** All pages with smooth, consistent scroll-reveal animations

---

## Phase 5: Quality Assurance & Polish

**Duration:** 2-3 hours
**Skills:** All three (for validation)

### Testing Checklist

- [ ] **Performance**
  - All animations: 60fps smooth
  - No frame drops or jank
  - Mobile performance acceptable
  - DevTools Performance profiles clean

- [ ] **Visual Quality**
  - No flicker on scroll
  - No layout shift
  - Proper alignment
  - Consistent easing/duration
  - Professional feel

- [ ] **Accessibility**
  - Respect prefers-reduced-motion
  - Keyboard navigation works
  - Screen reader compatible
  - Touch device support

- [ ] **Browser Coverage**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (iOS + desktop)
  - Edge

### Final Validation

1. **Full page test**
   - Load page in browser
   - Scroll through all sections
   - Trigger all interactions
   - Profile with DevTools

2. **Device testing**
   - Desktop (Chrome DevTools throttling)
   - Tablet (iPad)
   - Mobile (iPhone/Android)

3. **Code review**
   - All animations use proper patterns
   - No performance anti-patterns
   - Cleanup code is correct
   - No console errors

**Deliverable:** Sign-off document confirming all animations smooth, professional, accessible

---

## Success Criteria

✅ **All animations:**
- Smooth 60fps (no frame drops)
- Zero flicker on scroll
- No layout shift
- Professional feel (proper easing, duration)
- Accessible (prefers-reduced-motion respected)
- Mobile-performant
- No console errors

✅ **Metrics:**
- Baseline → optimized: 10–30fps improvement typical
- Flicker issues: 100% resolved
- Performance profile: Clean, no long tasks

---

## New Skills Reference

### GSAP ScrollTrigger Skill
- **When:** Scroll-triggered animations, flicker fixes, layout shift prevention
- **How:** Fix existing → diagnose → apply ScrollTrigger pattern → validate
- **Key:** `once: true`, transform-only properties, will-change CSS

### Framer Motion Skill
- **When:** Component animations, gestures, state transitions
- **How:** Create motion components → variants → gesture handlers
- **Key:** `whileInView + once`, staggerChildren, spring physics

### AOS Scroll Reveal Skill
- **When:** Bulk scroll reveals, simple entrance animations
- **How:** Setup in layout → add data-aos attributes → stagger
- **Key:** HTML-driven (no JS), lightweight, Intersection Observer

---

## Next Steps

1. **In new Claude Code window:**
   - Copy this plan
   - Start with Phase 1 (Audit)
   - Use agents for each phase
   - Follow validation checklist

2. **Expected timeline:**
   - Phase 1 (Audit): 2-3 hours
   - Phase 2 (Scroll fixes): 8-12 hours (4 sections × 2-3 hrs)
   - Phase 3 (Components): 6-9 hours (3 features × 2-3 hrs)
   - Phase 4 (Bulk reveals): 3-5 hours (3 pages × 1-2 hrs)
   - Phase 5 (Polish): 2-3 hours
   - **Total: ~25-35 hours** (Can run in parallel to reduce time)

3. **Commits:**
   - One commit per section/phase
   - Message: `fix(animations): [phase] [section] - [improvement]`
   - Example: `fix(animations): phase-2 hero-section - fix scroll flicker with GSAP`

4. **Testing:**
   - Always test in browser after changes
   - Profile with DevTools before signing off
   - Validate before moving to next section

---

**Plan created:** 2026-04-16
**Status:** Ready for execution
**Skills installed:** ✅ gsap-scrolltrigger, ✅ framer-motion, ✅ aos-scroll-reveal
