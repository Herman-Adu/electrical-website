# TOC Unstick Point Debug Instrumentation

## Overview

This directory contains debug tools to capture **exact measurements** when the TOC (Table of Contents) unsticks from its sticky position at the Gallery section on project detail pages.

### The Problem

When scrolling through a project detail page, the right-sidebar TOC should stay sticky. However, at some point (when Gallery becomes visible), the TOC appears to unstick and scroll up. We need exact pixel measurements and CSS state at this moment to identify the trigger.

### The Solution

Use the provided debug script to capture:
- Viewport dimensions
- Element measurements (aside, TOC, main content)
- Section visibility tracking
- Scroll depth and timestamps
- CSS state (position, min-height, align-self)

---

## Files in This Directory

### 1. **TOC_UNSTICK_DEBUG.md** (Main Instructions)

**What:** Step-by-step guide to run the debug script

**Use when:** You want detailed instructions with troubleshooting

**Contains:**
- Quick start (copy-paste script)
- What the script captures
- What to look for
- JSON output format
- Troubleshooting guide

**Start here if:** You prefer reading full documentation

---

### 2. **QUICK_REFERENCE.md** (Cheat Sheet)

**What:** One-page reference for running debug and reading output

**Use when:** You want a quick reminder of steps or need to understand console output

**Contains:**
- TL;DR summary
- Console output reading guide
- What each measurement means
- Expected pattern (healthy behavior)
- Key numbers to report

**Start here if:** You've done this before or want a quick lookup

---

### 3. **DEBUG_RESULTS_TEMPLATE.md** (Report Template)

**What:** Structured template for documenting and submitting results

**Use when:** You've completed the debug and need to report findings

**Contains:**
- Environment information form
- Qualitative observations checklist
- Key measurements extraction guide
- JSON export section
- Analysis summary (for dev team)

**Use this for:** Submitting results to the team

---

### 4. **toc-unstick-inspector.html** (Web UI)

**What:** Interactive HTML page with friendly UI for running debug

**Location:** `/public/debug/toc-unstick-inspector.html`

**Use when:** You prefer a visual guide with copy buttons

**Access at:**
```
http://localhost:3000/debug/toc-unstick-inspector.html
```

**Contains:**
- Numbered step-by-step guide
- Copy button for debug script
- Color-coded instructions
- Links to troubleshooting

**Start here if:** You prefer visual guides over reading

---

---

## Quick Start (30 seconds)

### For the Impatient

1. Go to: `/projects/category/[any-category]/[any-project]`
2. Press: `F12` (open DevTools)
3. Click: **Console** tab
4. Paste: The script from **TOC_UNSTICK_DEBUG.md** → Step 2
5. Scroll: Down to Gallery section (watch console)
6. Type: `stopTocDebug()`
7. Copy: The JSON output
8. Save: As `toc-debug-results.json`

**Done!** You now have exact measurements of when TOC unsticks.

---

## Step-by-Step Process

### Phase 1: Setup (2 minutes)

1. Open a project detail page
2. Open DevTools console (F12)
3. Copy and paste the debug script
4. Confirm: You see "🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED"

### Phase 2: Capture (3-5 minutes)

1. Scroll down **slowly** through the page
2. Watch console for measurement dumps every 100px
3. **Watch especially** when Gallery section appears
4. **Note:** When you see `⚠️ TOC UNSTICKING` — that's the moment!

### Phase 3: Export (1 minute)

1. Type: `stopTocDebug()` in console
2. Select: The JSON output (entire `{...}` block)
3. Copy: Ctrl+C or Cmd+C
4. Save: Paste into text file, save as `.json`

### Phase 4: Report (2 minutes)

1. Fill out: `DEBUG_RESULTS_TEMPLATE.md`
2. Attach: The JSON file
3. Include: Browser, OS, screen resolution
4. Submit: To development team

**Total time:** ~10 minutes

---

## What Gets Captured

### Measurements at Each Snapshot

```
Viewport
  ├─ height (window.innerHeight)
  └─ width (window.innerWidth)

Aside (sticky sidebar container)
  ├─ height (getBoundingClientRect)
  ├─ offsetHeight (with padding/border)
  ├─ scrollHeight (total content)
  ├─ minHeight (CSS min-height)
  ├─ alignSelf (CSS align-self)
  ├─ top (distance from viewport top) ← Becomes negative when unsticking
  └─ isSticky (position: sticky detection)

TOC (Table of Contents component)
  ├─ height (getBoundingClientRect)
  ├─ offsetHeight
  ├─ scrollHeight
  ├─ top (⚠️ KEY: When negative, TOC is unsticking)
  └─ bottom

Main Content
  ├─ scrollHeight
  ├─ offsetHeight
  └─ top

Sections (Each TOC item)
  ├─ id
  ├─ label
  ├─ top (distance from viewport)
  └─ isVisible (currently in viewport?)

Gallery
  ├─ isVisible
  └─ distanceFromViewportTop
```

### Triggers for Snapshots

- **Every 100px of scroll** — Progression tracking
- **Gallery enters viewport** — Critical moment
- **Initial state** — Baseline measurement

---

## Understanding the Unstick

### What "Unstick" Means

```
BEFORE unstick (sticky working):
┌─ Viewport top
├─ TOC.top = 150px (positive = below viewport top)
├─ TOC is sticky (position: sticky)
└─ TOC stays in place relative to viewport

AFTER unstick (TOC scrolling):
┌─ Viewport top
├─ TOC.top = -50px (negative = above viewport top)
├─ TOC is not sticky (no longer sticky)
└─ TOC scrolls up past the sticky offset
```

### The Trigger Point

You're looking for the exact scroll depth where:
1. **TOC.top** goes from positive to negative (crosses zero)
2. **Gallery.isVisible** is true (Gallery just entered viewport)
3. **Aside.scrollHeight** exceeds available space

---

## Expected Output

### Console During Capture

```
🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED
Scroll down slowly and watch for ⚠️ TOC UNSTICKING...
✓ Ready. Call stopTocDebug() in console to dump results.

================================================================================
[SCROLL: 0px] (0% down) | Viewport: 1080h × 1920w
...

================================================================================
[SCROLL: 3000px] (50% down) | Viewport: 1080h × 1920w
...
TOC: height=350px | offset=350 | top=-50px ⚠️ UNSTICKING
...
```

### JSON Export

```json
{
  "projectTitle": "Project Detail Page TOC Unstick Debug",
  "capturedAt": "2026-04-24T18:30:00.000Z",
  "totalSnapshots": 15,
  "measurements": [
    {
      "scrollY": 0,
      "timestamp": 1682000000000,
      "viewport": { "height": 1080, "width": 1920 },
      "aside": {
        "height": "930.0",
        "offsetHeight": 930,
        "scrollHeight": 930,
        "minHeight": "calc(100vh - 150px)",
        "alignSelf": "start",
        "top": "150.0",
        "bottom": "1080.0",
        "isSticky": true
      },
      "toc": {
        "height": "350.0",
        "offsetHeight": 350,
        "scrollHeight": 350,
        "top": "150.0",
        "bottom": "500.0"
      },
      ...
    }
  ]
}
```

---

## Troubleshooting

### Script Won't Run

**Problem:** Pasted script but nothing happened

**Solutions:**
- Make sure DevTools console is in **focus** (click in it first)
- Script must be **100% complete** when pasted (don't break it mid-paste)
- Reload page and try again
- Check for JavaScript errors (red messages in console)

---

### No Measurements Appear

**Problem:** Scrolling but no console output

**Solutions:**
- Did you see the startup messages? If not, script didn't initialize
- Make sure you're on a **project detail page** (not homepage)
- Did the page fully load? Wait 2-3 seconds and try again
- Try scrolling more than 100px at a time

---

### "Elements not found" Error

**Problem:** Script says it can't find the TOC

**Solutions:**
- Are you on a project detail page? Must be `/projects/category/[slug]/[slug]`
- Not all test pages have TOC. Use a real project.
- Page might not be fully loaded. Reload and wait.

---

### Can't Export Results

**Problem:** `stopTocDebug()` doesn't work

**Solutions:**
- Did the script fully initialize? Check for startup messages.
- Type exactly: `stopTocDebug()` (with parentheses)
- If still fails, open a new tab and run script again

---

## Tips for Best Results

1. **Use a real project** with actual Gallery content (not a test/stub)
2. **Scroll slowly** so 100px triggers have time to fire
3. **Watch for warnings** in console (⚠️ messages)
4. **Use consistent viewport** (don't resize during capture)
5. **Note your environment** (browser, OS, screen resolution)
6. **Capture at multiple viewports** if possible (desktop, tablet, mobile)

---

## File Manifest

```
docs/debug/
├── README.md                      ← You are here
├── TOC_UNSTICK_DEBUG.md          ← Full step-by-step guide
├── QUICK_REFERENCE.md            ← One-page cheat sheet
└── DEBUG_RESULTS_TEMPLATE.md     ← Report template

public/debug/
└── toc-unstick-inspector.html    ← Web UI for debug script

lib/
└── debug-toc-measurements.ts     ← TypeScript implementation
```

---

## Integration Points

### Where This Impacts

- **Component:** `components/shared/content-toc.tsx`
- **Page:** `app/projects/category/[categorySlug]/[projectSlug]/page.tsx`
- **Styles:** Line 277 in page.tsx: `sticky top-[150px] self-start mt-2 min-h-[calc(100vh-150px)]`

### What to Check

When debugging, look for:
- Grid column definition: `grid-cols-[minmax(0,1fr)_minmax(280px,320px)]`
- Aside constraints: `min-h-[calc(100vh-150px)]`
- Sticky offset: `top-[150px]`

---

## Next Steps

### For Users

1. **Run the debug script** using one of the methods above
2. **Capture measurements** when Gallery enters viewport
3. **Export JSON** and save to file
4. **Fill out template** with your observations
5. **Submit both files** to the development team

### For Development Team

Once debug results are collected:

1. **Analyze JSON:** Look for correlation between scrollY and TOC.top < 0
2. **Identify trigger:** What CSS constraint is violated?
3. **Test fix:** Adjust min-height, gap, or grid columns
4. **Verify:** Re-run debug script to confirm fix
5. **Close:** Deploy to production

---

## Questions?

- **Can't find the script?** Start with **TOC_UNSTICK_DEBUG.md** Step 2
- **Don't understand output?** Check **QUICK_REFERENCE.md** → Console Output section
- **Ready to submit?** Use **DEBUG_RESULTS_TEMPLATE.md**
- **Prefer visual guide?** Open `/public/debug/toc-unstick-inspector.html`

---

**Document Status:** Ready for use  
**Last Updated:** 2026-04-24  
**Test Coverage:** Chrome, Firefox, Safari (latest versions)
