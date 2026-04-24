# TOC Unstick Debug Results Template

**Please fill out this template when submitting debug results.**

---

## Environment Information

**Date Captured:** [YYYY-MM-DD HH:MM UTC]

**Browser:**
- [ ] Chrome/Chromium (version: _______)
- [ ] Firefox (version: _______)
- [ ] Safari (version: _______)
- [ ] Edge (version: _______)
- [ ] Other: ________________

**Operating System:**
- [ ] Windows (version: _______)
- [ ] macOS (version: _______)
- [ ] Linux (distro: _______)
- [ ] Other: ________________

**Screen Resolution:** [width] × [height] (e.g., 1920 × 1080)

**Viewport Size:** [width] × [height] (from debug output)

---

## Project Tested

**Project URL:**
```
/projects/category/[category]/[project]
```

**Example:** `/projects/category/industrial-solutions/power-distribution-upgrade`

**Project Title:** ________________________

**Project Category:** ________________________

---

## Observations (Qualitative)

### Describe What You Saw

When scrolling to the Gallery section, did the TOC unstick from the right sidebar?

- [ ] **Yes** — TOC scrolled up past the sticky offset
- [ ] **No** — TOC stayed sticky throughout
- [ ] **Unclear** — Not sure what I was looking for

### At What Point Did It Unstick?

If yes, approximately when did you notice the TOC become unsticky?

- [ ] Before Gallery section appeared
- [ ] As Gallery section entered viewport
- [ ] After Gallery section was visible
- [ ] Not sure

### Did You See the Warning Message?

The debug script should show `⚠️ TOC UNSTICKING` when it happens.

- [ ] **Yes** — Saw the warning in console
- [ ] **No** — Didn't see the warning
- [ ] **Partially** — Saw some warnings but not consistently

### Additional Notes

Any other observations about the TOC behavior:

```
[Your notes here]
```

---

## Debug Results Summary

### Scroll Depths Where Unstick Occurred

From the JSON output, list the `scrollY` values where `TOC.top` became negative (< 0):

- **First unstick at scrollY:** ________px
- **Maximum unstick depth (TOC.top most negative):** ________px
- **Total snapshots captured:** ________

### Key Measurements

From the first unstick snapshot, note these values:

**TOC at unstick point:**
- `TOC.height:` ________px
- `TOC.top:` ________px ← This should be negative
- `TOC.offsetHeight:` ________px

**Aside at unstick point:**
- `Aside.height:` ________px
- `Aside.top:` ________px
- `Aside.minHeight:` ________
- `Aside.alignSelf:` ________
- `Aside.isSticky:` [ ] true [ ] false

**Gallery visibility at unstick:**
- `Gallery.isVisible:` [ ] true [ ] false
- `Gallery.distanceFromViewportTop:` ________px

**Main content at unstick:**
- `MainContent.scrollHeight:` ________px
- `MainContent.offsetHeight:` ________px

---

## JSON Export

### Instructions

1. Paste your exported JSON from the debug script below
2. Or attach as a separate file: `toc-debug-results.json`

### JSON Data

```json
[PASTE THE FULL JSON EXPORT HERE]
```

---

## Analysis Summary (For Development Team)

### What This Tells Us

Based on the measurements, the TOC unsticks when:

```
[Development team will fill this in]
```

### Likely Causes

Based on the data:

- [ ] Aside min-height constraint exceeded by content
- [ ] Grid column sizing causing aside to collapse
- [ ] TOC height + padding exceeds available sticky space
- [ ] Gallery section height pushes down main content
- [ ] Viewport/window size interacts with fixed offsets
- [ ] Other: ___________________________________________

### Recommended Fix

```
[Development team will fill this in]
```

---

## Checklist Before Submitting

- [ ] I navigated to a real project detail page (not a test page)
- [ ] I scrolled through at least the Gallery section
- [ ] I called `stopTocDebug()` to export results
- [ ] I captured the complete JSON output
- [ ] I filled out the environment information above
- [ ] I noted my observations about when TOC unsticked
- [ ] I extracted key measurements from the JSON
- [ ] I'm submitting either this markdown OR the JSON file (both if possible)

---

## How to Submit

**Option 1: Complete This Markdown**
- Fill out all sections above
- Save as `toc-debug-report-[date].md`
- Share with team

**Option 2: Export JSON Only**
- Copy the JSON from console
- Save as `toc-debug-results-[date].json`
- Share with team

**Option 3: Both (Recommended)**
- Submit both the markdown report and the JSON file
- Include any additional screenshots or observations

---

## Follow-Up Questions for Debug Author

If you have additional context about when/where the issue occurs:

### Consistent or Intermittent?

- [ ] **Consistent** — Happens every time I scroll to Gallery
- [ ] **Intermittent** — Happens sometimes, not always
- [ ] **Not sure** — Only tested once

### Specific Project or All Projects?

- [ ] **All projects** — Happens on every project detail page
- [ ] **Specific projects** — Only on certain categories or projects
- [ ] **Not tested** — Only tested one or two projects

### Viewport Size Dependency?

- [ ] **Tested multiple resolutions** — Issue present at: _______
- [ ] **Only tested at one size** — [Your resolution]: ________

### Theme Dependency?

- [ ] **Light mode** — Tested and issue present: [ ] yes [ ] no
- [ ] **Dark mode** — Tested and issue present: [ ] yes [ ] no

---

**Thank you for running the debug script and providing this data!**

Your measurements will help the team identify the exact trigger and implement a fix.

For questions, contact: [team contact]
