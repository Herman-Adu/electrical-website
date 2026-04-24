# TOC Unstick Point Debug Guide

## Objective

Capture EXACT pixel measurements and CSS state at the moment the TOC (Table of Contents) unsticks from its sticky position when the Gallery section becomes visible.

## Quick Start (Browser Console)

### Step 1: Open Browser DevTools

1. Go to a project detail page: `/projects/category/[category]/[project]`
2. Press `F12` or `Cmd+Option+I` to open DevTools
3. Click the **Console** tab

### Step 2: Run Debug Script

Copy and paste this entire script into the console, then press Enter:

```javascript
(async function debugTocMeasurements() {
  const measurements = [];
  let isRunning = true;
  let lastScrollY = 0;

  // Section labels for reference
  const sectionMap = {
    overview: "Overview",
    scope: "Scope of Work",
    challenge: "Challenge & Solution",
    timeline: "Project Timeline",
    gallery: "Gallery",
    testimonial: "Client Testimonial",
    related: "Related Projects",
  };

  // Get computed value safely
  function getComputedValue(el, prop) {
    return window.getComputedStyle(el).getPropertyValue(prop) || "N/A";
  }

  // Capture single snapshot
  function captureSnapshot(reason) {
    const aside = document.querySelector('[data-sticky-toc="true"]');
    const toc = document.querySelector('[aria-label="Table of contents"]');
    const mainContent = document.querySelector('[id="project-content"]');
    const gridCell = document.querySelector('.section-padding.bg-background');

    if (!aside || !toc || !mainContent) {
      return {
        scrollY: window.scrollY,
        timestamp: Date.now(),
        notes: ["ERROR: Elements not found"],
      };
    }

    const asideRect = aside.getBoundingClientRect();
    const tocRect = toc.getBoundingClientRect();
    const mainRect = mainContent.getBoundingClientRect();
    const gridCellRect = gridCell?.getBoundingClientRect();
    const galleryEl = document.getElementById("gallery");
    const galleryRect = galleryEl?.getBoundingClientRect();

    // Capture sections
    const sections = Object.entries(sectionMap)
      .map(([id, label]) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id,
          label,
          top: rect.top,
          isVisible: rect.top < window.innerHeight && rect.bottom > 0,
        };
      })
      .filter(s => s !== null);

    // Build notes
    const notes = [];
    if (reason) notes.push(`Reason: ${reason}`);

    const asideComputedPosition = getComputedValue(aside, "position");
    const isSticky = asideComputedPosition === "sticky" || asideComputedPosition === "fixed";
    notes.push(`Aside position: ${asideComputedPosition}`);

    if (tocRect.top < 0) {
      notes.push(`⚠️ TOC UNSTICKING! top=${tocRect.top.toFixed(1)}px`);
    }

    const galleryIsVisible = galleryRect
      ? galleryRect.top < window.innerHeight && galleryRect.bottom > 0
      : false;

    if (galleryIsVisible && lastScrollY < window.scrollY) {
      notes.push(`✓ Gallery entered viewport`);
    }

    return {
      scrollY: window.scrollY,
      timestamp: Date.now(),
      viewport: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      aside: {
        height: asideRect.height.toFixed(1),
        offsetHeight: aside.offsetHeight,
        scrollHeight: aside.scrollHeight,
        minHeight: getComputedValue(aside, "min-height"),
        alignSelf: getComputedValue(aside, "align-self"),
        top: asideRect.top.toFixed(1),
        bottom: asideRect.bottom.toFixed(1),
        isSticky,
      },
      toc: {
        height: tocRect.height.toFixed(1),
        offsetHeight: toc.offsetHeight,
        scrollHeight: toc.scrollHeight,
        top: tocRect.top.toFixed(1),
        bottom: tocRect.bottom.toFixed(1),
      },
      mainContent: {
        scrollHeight: mainContent.scrollHeight,
        offsetHeight: mainContent.offsetHeight,
        top: mainRect.top.toFixed(1),
      },
      gridCell: {
        height: gridCellRect?.height.toFixed(1) ?? "N/A",
        offsetHeight: gridCell?.offsetHeight ?? "N/A",
      },
      sections,
      gallery: {
        isVisible: galleryIsVisible,
        distanceFromViewportTop: galleryRect?.top.toFixed(1) ?? "N/A",
      },
      notes,
    };
  }

  // Format snapshot
  function formatSnapshot(snap) {
    const lines = [];
    const scrollPercent = ((snap.scrollY / document.documentElement.scrollHeight) * 100).toFixed(1);

    lines.push(`\n${'='.repeat(80)}`);
    lines.push(
      `[SCROLL: ${snap.scrollY.toFixed(0)}px] (${scrollPercent}% down) | ` +
      `Viewport: ${snap.viewport.height}h × ${snap.viewport.width}w`
    );
    lines.push(`Timestamp: ${new Date(snap.timestamp).toISOString()}`);

    lines.push(
      `Aside: height=${snap.aside.height}px | offset=${snap.aside.offsetHeight} | scroll=${snap.aside.scrollHeight} | top=${snap.aside.top}px | sticky=${snap.aside.isSticky}`
    );

    lines.push(
      `TOC: height=${snap.toc.height}px | offset=${snap.toc.offsetHeight} | top=${snap.toc.top}px ${snap.toc.top < 0 ? '⚠️ UNSTICKING' : '(sticky)'}`
    );

    lines.push(`Main: scroll=${snap.mainContent.scrollHeight} | offset=${snap.mainContent.offsetHeight}`);

    if (snap.gallery.isVisible) {
      lines.push(`Gallery: ✓ VISIBLE | distance=${snap.gallery.distanceFromViewportTop}px`);
    }

    lines.push(`Sections:`);
    snap.sections.forEach(sec => {
      const visible = sec.isVisible ? '✓' : ' ';
      lines.push(`  [${visible}] ${sec.label.padEnd(25)} | top=${sec.top.toFixed(1).padStart(7)}px`);
    });

    if (snap.notes.length > 0) {
      lines.push(`Notes:`);
      snap.notes.forEach(note => lines.push(`  • ${note}`));
    }

    return lines.join("\n");
  }

  // Scroll listener
  function onScroll() {
    const didScroll100px = Math.abs(window.scrollY - lastScrollY) >= 100;
    const gallery = document.getElementById("gallery");
    const galleryRect = gallery?.getBoundingClientRect();
    const galleryJustEntered =
      lastScrollY < window.scrollY &&
      galleryRect &&
      galleryRect.top < window.innerHeight &&
      lastScrollY > 0;

    if (didScroll100px) {
      const snap = captureSnapshot(`Every 100px`);
      measurements.push(snap);
      console.log(formatSnapshot(snap));
      lastScrollY = window.scrollY;
    }

    if (galleryJustEntered) {
      const snap = captureSnapshot(`Gallery entered viewport`);
      measurements.push(snap);
      console.log(formatSnapshot(snap));
      lastScrollY = window.scrollY;
    }
  }

  // Start
  console.clear();
  console.log(
    "%c🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED",
    "font-weight: bold; font-size: 16px; color: #00d4ff;"
  );
  console.log(
    "%cScroll down slowly and watch for ⚠️ TOC UNSTICKING. Call stopTocDebug() when done.",
    "color: #666;"
  );

  const initialSnap = captureSnapshot("Initial state");
  measurements.push(initialSnap);
  console.log(formatSnapshot(initialSnap));

  window.addEventListener("scroll", onScroll, { passive: true });

  // Export function
  window.stopTocDebug = function() {
    window.removeEventListener("scroll", onScroll);
    console.log(
      "%c\n📊 DEBUG CAPTURE COMPLETE",
      "font-weight: bold; font-size: 16px; color: #00d4ff;"
    );
    console.log(`Captured ${measurements.length} snapshots.`);
    console.log(
      "%c📥 COPY THE JSON BELOW AND SAVE TO FILE:",
      "font-weight: bold; color: #00ff00; background: #000; padding: 8px;"
    );

    const jsonDump = {
      projectTitle: "Project Detail Page TOC Unstick Debug",
      capturedAt: new Date().toISOString(),
      totalSnapshots: measurements.length,
      measurements,
    };

    console.log(JSON.stringify(jsonDump, null, 2));
    console.log("%cJSON ready to copy above ⬆️", "color: #00ff00; font-weight: bold;");
    return jsonDump;
  };

  console.log(
    "%c✓ Ready. Call stopTocDebug() in console to dump results.",
    "color: #00ff00; font-weight: bold;"
  );
})();
```

### Step 3: Scroll and Observe

1. **Initial state** is captured automatically
2. Scroll down **slowly** through the project detail page
3. Watch the console for measurement dumps every 100px and when Gallery enters
4. **Watch for `⚠️ TOC UNSTICKING`** message — this is the exact moment we need!

### Step 4: Stop and Export

When you've scrolled through the Gallery section:

```javascript
stopTocDebug()
```

This will:
- Stop listening for scroll events
- Print the complete JSON dump to console
- Show "📥 COPY THE JSON BELOW AND SAVE TO FILE"

### Step 5: Copy and Share Results

1. Select all the JSON output (from console)
2. Paste into a text file: `toc-debug-results.json`
3. Share the file with the development team

---

## What the Debug Script Captures

### Per Snapshot:
- **scrollY** — Page scroll position in pixels
- **Viewport dimensions** — `innerHeight`, `innerWidth`
- **Aside measurements:**
  - `height` — Rendered height (from getBoundingClientRect)
  - `offsetHeight` — Box height including padding/border
  - `scrollHeight` — Total content height
  - `minHeight` — CSS min-height property
  - `alignSelf` — Grid alignment CSS property
  - `top` — Distance from viewport top (positive = below fold, negative = above fold)
  - `isSticky` — Whether position is sticky/fixed
  
- **TOC measurements:**
  - `height`, `offsetHeight`, `scrollHeight` — Similar to aside
  - `top` — **CRITICAL**: When this becomes negative, TOC is scrolling past the sticky offset
  
- **Section tracking:**
  - Each TOC section (Overview, Scope, Challenge, Timeline, Gallery, etc.)
  - Whether it's currently visible in viewport
  - Distance from viewport top
  
- **Gallery detection:**
  - Is Gallery visible?
  - How far from viewport top?

### Triggers for Snapshots:
1. **Every 100px of scroll** — See progression
2. **Gallery enters viewport** — The critical moment
3. **Initial state** — Baseline measurement

---

## What to Look For

### The Unstick Point

You're looking for this pattern in the console output:

```
[SCROLL: 2800px] (45% down) | Viewport: 1080h × 1920w
Aside: height=930px | offset=930 | top=150px | sticky=true
TOC: height=350px | top=150px (sticky)

[SCROLL: 2900px]
Aside: height=930px | offset=930 | top=50px | sticky=true
TOC: height=350px | top=50px (sticky)

[SCROLL: 3000px]  ← Gallery enters
Aside: height=930px | offset=930 | top=-50px | sticky=false  ⚠️
TOC: height=350px | top=-50px ⚠️ TOC UNSTICKING!
Gallery: ✓ VISIBLE | distance=100px
```

**KEY OBSERVATION:**
- Before Gallery: `TOC.top = 150px` (sticky, in viewport)
- At Gallery: `TOC.top = -50px` (unsticking, scrolled past)
- **Trigger:** Content height exceeds viewport, pushing TOC up

---

## JSON Output Format

The exported JSON includes all snapshots with this structure:

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
      "mainContent": {
        "scrollHeight": 5400,
        "offsetHeight": 2100,
        "top": "0.0"
      },
      "sections": [
        {
          "id": "overview",
          "label": "Overview",
          "top": 300.0,
          "isVisible": true
        }
      ],
      "gallery": {
        "isVisible": false,
        "distanceFromViewportTop": "N/A"
      },
      "notes": ["Reason: Initial state", "Aside position: sticky"]
    }
  ]
}
```

---

## Troubleshooting

### "ERROR: Elements not found"

The script couldn't find the TOC or aside element. This happens if:
- You're not on a project detail page
- The page structure has changed
- Elements haven't loaded yet (wait a moment and try again)

### No snapshots captured during scroll

Check:
- Scroll listener is attached: ✓ in the console output
- You scrolled more than 100px between snapshots
- Gallery section exists and has an `id="gallery"` attribute

### "stopTocDebug is not defined"

The script didn't run completely. Try again with copy-paste from **Step 2**.

---

## Next Steps

1. **Run the debug script** on a project detail page
2. **Scroll to the Gallery section** — watch console for ⚠️ warnings
3. **Call `stopTocDebug()`** when done
4. **Save the JSON output** to a file
5. **Share the JSON** with the development team

The JSON will contain exact pixel values, CSS states, and viewport dimensions at every scroll checkpoint, allowing us to identify the exact unstick trigger.
