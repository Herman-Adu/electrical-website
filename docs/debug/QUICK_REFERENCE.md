# TOC Unstick Debug — Quick Reference Card

## TL;DR

1. **Go to:** `/projects/category/industrial-solutions/power-distribution-upgrade` (or any project)
2. **Open Console:** F12 → Console tab
3. **Paste script:** From `TOC_UNSTICK_DEBUG.md` step 2
4. **Scroll slowly** to Gallery section
5. **Watch for:** `⚠️ TOC UNSTICKING` in console
6. **Type:** `stopTocDebug()` when done
7. **Save JSON:** Copy and paste the output to a file

---

## Console Output Reading Guide

### Initial Output

```
🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED
Scroll down slowly and watch for ⚠️ TOC UNSTICKING...
✓ Ready. Call stopTocDebug() in console to dump results.
```

**What to do:** Start scrolling down the page.

---

### Snapshot Output (Every 100px)

```
================================================================================
[SCROLL: 1500px] (25% down) | Viewport: 1080h × 1920w
Timestamp: 2026-04-24T18:30:45.123Z

Aside: height=930px | offset=930 | scroll=930 | top=150px | sticky=true
TOC: height=350px | offset=350 | top=150px (sticky)
Main: scroll=5400 | offset=2100
Gallery: ✗ NOT VISIBLE

Sections:
  [✓] Overview                | top=  250.0px
  [✓] Scope of Work          | top=  600.0px
  [ ] Challenge & Solution   | top= 1200.0px
  [ ] Project Timeline       | top= 1800.0px
  [ ] Gallery                | top= 2400.0px
  [ ] Client Testimonial     | top= 4200.0px
  [ ] Related Projects       | top= 4800.0px

Notes:
  • Reason: Every 100px
  • Aside position: sticky
```

**What to look for:** `TOC.top` value. While scrolling, watch for it to become **negative**.

---

### The Unstick Moment (Critical)

```
================================================================================
[SCROLL: 3000px] (50% down) | Viewport: 1080h × 1920w
...

TOC: height=350px | offset=350 | top=-50px ⚠️ UNSTICKING

Gallery: ✓ VISIBLE | distance=100px

Notes:
  • Reason: Gallery entered viewport
  • Aside position: sticky
  • ⚠️ TOC UNSTICKING! top=-50px.0px
  • ✓ Gallery entered viewport
```

**This is the snapshot you're looking for!**

Key values to note:
- **scrollY:** `3000` — How far down the page
- **TOC.top:** `-50` — Negative means it's scrolling past the sticky offset
- **Gallery.isVisible:** `true` — Gallery is now in viewport
- **Gallery.distanceFromViewportTop:** `100px` — Gallery is 100px below viewport top

---

## What Each Measurement Means

| Field | Meaning | What to Watch |
|-------|---------|---------------|
| **scrollY** | How far down the page (pixels) | When it reaches ~2800-3200px |
| **Viewport.height** | Your window height | Usually 1080px or similar |
| **Aside.height** | Rendered height of sidebar | Should be 930px or so |
| **Aside.top** | Distance of sidebar from viewport top | Positive = below top, negative = above top |
| **Aside.isSticky** | Is aside in sticky state? | Should be `true` while scrolling |
| **TOC.height** | Height of TOC component | Usually 350px |
| **TOC.top** | Distance of TOC from viewport top | **KEY: When this goes negative, TOC is unsticking** |
| **Gallery.isVisible** | Is Gallery section currently in viewport? | `true` when Gallery is visible |
| **Gallery.distanceFromViewportTop** | How far below viewport top | Positive = below, negative = above |

---

## Expected Pattern (Healthy Behavior)

```
[SCROLL: 0px]
TOC.top = 150px (sticky, in viewport)

[SCROLL: 1000px]
TOC.top = 150px (still sticky)

[SCROLL: 2000px]
TOC.top = 150px (still sticky)

[SCROLL: 2800px]
TOC.top = 50px (sticky, getting closer to top)

[SCROLL: 2900px]  ← Gallery enters
TOC.top = 0px (TOC aligned with viewport top)

[SCROLL: 3000px]
TOC.top = -50px ⚠️ UNSTICKING! (TOC scrolls past sticky offset)
```

**What this means:**
- Sidebar is constrained by `min-height: calc(100vh - 150px)`
- When content fills viewport, TOC must scroll past the offset
- This is the **unstick trigger point**

---

## Troubleshooting

### Console shows "ERROR: Elements not found"

**Problem:** Script couldn't find the TOC element.

**Solutions:**
- Are you on a project detail page? (Not homepage, not category listing)
- Did the page fully load? Wait 2-3 seconds and try again
- Are you at the correct URL? `/projects/category/[something]/[something]`

### No measurements appear when I scroll

**Problem:** Scroll listener didn't attach.

**Solutions:**
- Did you see "✓ Ready" message? If not, the script didn't run completely
- Copy-paste the script again from `TOC_UNSTICK_DEBUG.md` step 2
- Make sure you're copying the ENTIRE script, not just part of it

### stopTocDebug is not defined

**Problem:** The script didn't initialize properly.

**Solutions:**
- Try running the script again
- Make sure DevTools console is focused (click in it first)
- Check for JavaScript errors in the console (red messages)

### I don't see any Gallery warnings

**Problem:** Gallery section might not exist or script exited before Gallery.

**Solutions:**
- Some projects may not have a Gallery section. Check the TOC visible at startup
- Scroll further down the page. Gallery might be near the end
- Make sure you scrolled slow enough for 100px triggers to fire

---

## Exporting Results

### When You See This

```
📊 DEBUG CAPTURE COMPLETE
Captured 15 snapshots.

📥 COPY THE JSON BELOW AND SAVE TO FILE:

{
  "projectTitle": "Project Detail Page TOC Unstick Debug",
  "capturedAt": "2026-04-24T18:30:00.000Z",
  "totalSnapshots": 15,
  "measurements": [
    {
      "scrollY": 0,
      "timestamp": 1682000000000,
      ...
    }
  ]
}

JSON ready to copy above ⬆️
```

### Do This

1. **Select all** the JSON output (the entire `{...}` block)
2. **Copy** it (Ctrl+C or Cmd+C)
3. **Paste** into a text file
4. **Save** as `toc-debug-results.json`
5. **Share** with the team

---

## Key Numbers to Report

When submitting results, include these from the "unstick snapshot":

```
From the snapshot where ⚠️ TOC UNSTICKING appears:

scrollY: ________px
viewport.height: ________px
viewport.width: ________px

aside.height: ________px
aside.top: ________px
aside.minHeight: ________
aside.isSticky: ________

toc.height: ________px
toc.top: ________px ← This should be negative

gallery.isVisible: ________
gallery.distanceFromViewportTop: ________px

Main observations:
- TOC unsticked at scrollY = ________px
- Gallery became visible at scrollY = ________px
- Unstick happened [before/after/at same time as] Gallery entered viewport
```

---

## Common Issues & Solutions

| Symptom | Cause | Solution |
|---------|-------|----------|
| TOC.top never goes negative | Viewport too tall or content too short | Test on smaller viewport or project with more sections |
| Gallery never "enters" | No Gallery section in project | Choose different project or scroll to see if Gallery exists |
| JSON too large to copy | Too many snapshots (>100) | Scroll faster or accept partial data |
| Script hangs/freezes | Conflicting JavaScript | Close DevTools, refresh page, try again |

---

## When Done

1. Export JSON via `stopTocDebug()`
2. Fill out `DEBUG_RESULTS_TEMPLATE.md`
3. Attach both files when reporting
4. Include environment info (browser, OS, resolution)

**Result:** Exact pixel measurements and CSS state when TOC unsticks!
