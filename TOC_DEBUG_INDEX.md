# TOC Unstick Debug Instrumentation — Master Index

## Quick Links (Choose Your Path)

### I Just Want to Run It (2 minutes)
👉 **[START_HERE.md](./docs/debug/START_HERE.md)**  
Copy a script, paste it in console, scroll, done.

### I Want Full Instructions (5 minutes)
👉 **[TOC_UNSTICK_DEBUG.md](./docs/debug/TOC_UNSTICK_DEBUG.md)**  
Step-by-step guide with troubleshooting.

### I Want to Use the Web UI (5 minutes)
👉 **[/public/debug/toc-unstick-inspector.html](./public/debug/toc-unstick-inspector.html)**  
Open in browser: `http://localhost:3000/debug/toc-unstick-inspector.html`

### I Need a Quick Reference (1 minute)
👉 **[QUICK_REFERENCE.md](./docs/debug/QUICK_REFERENCE.md)**  
One-page cheat sheet of commands and output formats.

### I'm Submitting Results (10 minutes)
👉 **[DEBUG_RESULTS_TEMPLATE.md](./docs/debug/DEBUG_RESULTS_TEMPLATE.md)**  
Form to fill out and submit findings.

### I Want the Technical Details (15 minutes)
👉 **[INSTRUMENTATION_SUMMARY.md](./INSTRUMENTATION_SUMMARY.md)**  
Complete technical overview of the system.

### I Want Everything (20 minutes)
👉 **[docs/debug/README.md](./docs/debug/README.md)**  
Comprehensive index and context for all materials.

---

## File Organization

```
electrical-website/
├── TOC_DEBUG_INDEX.md                    ← You are here
├── INSTRUMENTATION_SUMMARY.md            ← Technical overview
├── DEBUG_INSTRUMENTATION_DELIVERY.md     ← Delivery checklist
│
├── docs/debug/
│   ├── START_HERE.md                     ← Begin here
│   ├── README.md                         ← Central documentation index
│   ├── TOC_UNSTICK_DEBUG.md             ← Complete guide
│   ├── QUICK_REFERENCE.md               ← Cheat sheet
│   └── DEBUG_RESULTS_TEMPLATE.md        ← Report form
│
├── lib/
│   └── debug-toc-measurements.ts        ← TypeScript implementation
│
└── public/debug/
    └── toc-unstick-inspector.html       ← Web UI
```

---

## The Quick Version (30 seconds)

```bash
# 1. Go to any project detail page:
# /projects/category/industrial-solutions/power-distribution-upgrade

# 2. Open DevTools:
# F12 (Windows/Linux) or Cmd+Option+I (Mac)

# 3. Click "Console" tab

# 4. Copy the script from docs/debug/TOC_UNSTICK_DEBUG.md Step 2

# 5. Paste into console and press Enter

# 6. Scroll down to Gallery section (watch console for measurements)

# 7. Type this in console when done:
stopTocDebug()

# 8. Copy the JSON output and save it
```

---

## What This Does

Captures exact pixel measurements when the TOC (right sidebar) unsticks from its sticky position as you scroll past the Gallery section.

**Measurements captured:**
- Viewport dimensions (width, height)
- Aside measurements (height, min-height, CSS state)
- TOC measurements (especially top position — becomes negative at unstick!)
- Main content height and scroll depth
- Section visibility (which TOC items are in viewport)
- Gallery visibility detection
- Timestamps for correlation

**Output:** Formatted console logs + exportable JSON with all data

---

## Use Cases

### I'm a QA Tester
1. Read [START_HERE.md](./docs/debug/START_HERE.md)
2. Run script on 3-5 project detail pages
3. Save JSON results
4. Fill out [DEBUG_RESULTS_TEMPLATE.md](./docs/debug/DEBUG_RESULTS_TEMPLATE.md)
5. Submit to dev team

### I'm a Front-End Developer
1. Read [INSTRUMENTATION_SUMMARY.md](./INSTRUMENTATION_SUMMARY.md)
2. Review [lib/debug-toc-measurements.ts](./lib/debug-toc-measurements.ts)
3. Collect results from QA
4. Analyze JSON for patterns
5. Identify CSS constraint causing unstick
6. Implement fix in page layout CSS

### I'm a Product Manager
1. Skim [TOC_UNSTICK_DEBUG.md](./docs/debug/TOC_UNSTICK_DEBUG.md) Overview
2. Understand: Debug captures exact pixel values when TOC unsticks
3. Expected timeline: 10 min to capture data per project, 1 hour to fix once data collected

### I'm Supporting Users
1. Direct them to [START_HERE.md](./docs/debug/START_HERE.md)
2. Link to [QUICK_REFERENCE.md](./docs/debug/QUICK_REFERENCE.md) for troubleshooting
3. Collect [DEBUG_RESULTS_TEMPLATE.md](./docs/debug/DEBUG_RESULTS_TEMPLATE.md) from them
4. Forward to dev team

---

## Document Stats

| Document | Lines | Type | Audience |
|----------|-------|------|----------|
| START_HERE.md | 80 | Guide | Everyone |
| README.md | 400 | Documentation | Everyone |
| TOC_UNSTICK_DEBUG.md | 350 | Guide | Users |
| QUICK_REFERENCE.md | 250 | Reference | Users |
| DEBUG_RESULTS_TEMPLATE.md | 200 | Form | Reporters |
| INSTRUMENTATION_SUMMARY.md | 500+ | Technical | Dev team |
| debug-toc-measurements.ts | 280 | Code | Developers |
| toc-unstick-inspector.html | 400 | Web UI | Everyone |

**Total:** ~3,200 lines of documentation, guides, and code

---

## Key Features

✅ **Non-intrusive** — No production code modified  
✅ **Easy to use** — Copy-paste script, no setup required  
✅ **Precise** — Subpixel measurements via native APIs  
✅ **Comprehensive** — Captures viewport, CSS, content, visibility  
✅ **Exportable** — JSON output for analysis  
✅ **Self-documenting** — All instructions included  
✅ **Troubleshooting** — Guides for common issues  
✅ **Multi-format** — Console, web UI, TypeScript import  

---

## Success Metrics

After running the debug script, you'll know:

✅ Exact scroll depth when TOC unsticks (scrollY value)  
✅ TOC dimensions at unstick point  
✅ Aside/sidebar CSS state (minHeight, alignSelf)  
✅ Whether Gallery visibility correlates with unstick  
✅ Viewport dimensions at unstick  
✅ CSS constraints being violated  

With this data, developers can:

✅ Identify root cause (CSS constraint vs. content vs. viewport)  
✅ Design targeted fix  
✅ Verify fix works across browsers/viewports  

---

## Start Using It Now

### Option 1: Fastest (Web UI)
```
http://localhost:3000/debug/toc-unstick-inspector.html
```
Follow the 6 steps on the page.

### Option 2: Simplest (Text Guide)
Read [START_HERE.md](./docs/debug/START_HERE.md)  
It's 80 lines, takes 5 minutes.

### Option 3: Complete (Full Guide)
Read [TOC_UNSTICK_DEBUG.md](./docs/debug/TOC_UNSTICK_DEBUG.md)  
350 lines with screenshots and troubleshooting.

---

## Questions?

| Question | Answer Location |
|----------|-----------------|
| "How do I run this?" | [START_HERE.md](./docs/debug/START_HERE.md) |
| "What do I look for?" | [QUICK_REFERENCE.md](./docs/debug/QUICK_REFERENCE.md) |
| "What does output mean?" | [QUICK_REFERENCE.md](./docs/debug/QUICK_REFERENCE.md) → Console Output |
| "How do I submit results?" | [DEBUG_RESULTS_TEMPLATE.md](./docs/debug/DEBUG_RESULTS_TEMPLATE.md) |
| "How does it work technically?" | [INSTRUMENTATION_SUMMARY.md](./INSTRUMENTATION_SUMMARY.md) |
| "I found a problem" | [TOC_UNSTICK_DEBUG.md](./docs/debug/TOC_UNSTICK_DEBUG.md) → Troubleshooting |
| "Is this safe?" | Yes. Read [INSTRUMENTATION_SUMMARY.md](./INSTRUMENTATION_SUMMARY.md) → Technical Details |

---

## Ready?

👉 Go to [START_HERE.md](./docs/debug/START_HERE.md) and follow the 5-minute guide.

---

**Master Index Created:** 2026-04-24  
**Total Deliverables:** 8 files (guides + code + UI)  
**Total Documentation:** ~3,200 lines  
**Status:** Ready for use
