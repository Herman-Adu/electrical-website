# START HERE — TOC Unstick Debug

## What You Need to Do (5 minutes)

### Goal
Capture exact measurements of when the TOC unsticks at the Gallery section.

### Step 1: Go to a Project Page
Pick any project detail page, e.g.:
```
/projects/category/industrial-solutions/power-distribution-upgrade
```

### Step 2: Open Browser Console
- **Windows/Linux:** Press `F12`, click "Console" tab
- **macOS:** Press `Cmd+Option+I`, click "Console" tab

### Step 3: Copy the Debug Script

Go to this file and copy the entire script from **Step 2**:
📄 [`TOC_UNSTICK_DEBUG.md`](./TOC_UNSTICK_DEBUG.md)

(Or use the copy button on the web UI: `/public/debug/toc-unstick-inspector.html`)

### Step 4: Paste into Console

Paste the script into the console and press Enter.

You should see:
```
🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED
Scroll down slowly and watch for ⚠️ TOC UNSTICKING...
✓ Ready. Call stopTocDebug() in console to dump results.
```

### Step 5: Scroll to Gallery Section

Slowly scroll down the page. Watch the console for measurement dumps.

**Watch especially for:** `⚠️ TOC UNSTICKING` message
(This is the exact moment we need to capture!)

### Step 6: Stop and Export

When you've scrolled past the Gallery section, type this in the console:
```javascript
stopTocDebug()
```

You'll see the JSON export output.

### Step 7: Save Results

1. Select all the JSON output in the console
2. Copy it (Ctrl+C or Cmd+C)
3. Paste into a text file
4. Save as `toc-debug-results.json`

---

## That's It! 

You've captured the measurements. Now just share the JSON file with the team.

---

## Want More Details?

- **Full instructions?** → [`TOC_UNSTICK_DEBUG.md`](./TOC_UNSTICK_DEBUG.md)
- **Quick reference?** → [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
- **Visual guide?** → [`/public/debug/toc-unstick-inspector.html`](../../public/debug/toc-unstick-inspector.html)
- **Report template?** → [`DEBUG_RESULTS_TEMPLATE.md`](./DEBUG_RESULTS_TEMPLATE.md)
- **Overview?** → [`README.md`](./README.md)

---

## Troubleshooting (If Something Doesn't Work)

### "Nothing happened when I pasted the script"
- Make sure the console is **in focus** (click in it)
- Make sure you copied the **entire** script (all ~350 lines)
- Check for red error messages in the console

### "I scrolled but no measurements appear"
- Make sure you scrolled **more than 100px**
- Make sure you're on a **project detail page** (not homepage)
- Reload the page and try again

### "I don't see the warning ⚠️ TOC UNSTICKING"
- Some projects might not trigger it. Try another project.
- Make sure you scrolled **all the way** to the Gallery section
- Scroll slower and watch more carefully

For complete troubleshooting, see [`TOC_UNSTICK_DEBUG.md`](./TOC_UNSTICK_DEBUG.md) → Troubleshooting section.

---

## Questions?

Everything is documented. Use the links above to find the answer.

**Summary of files:**
- You are here: `START_HERE.md` ← Quick intro
- Full guide: `TOC_UNSTICK_DEBUG.md` ← Step-by-step
- Cheat sheet: `QUICK_REFERENCE.md` ← Quick lookup
- Report: `DEBUG_RESULTS_TEMPLATE.md` ← For submitting
- Overview: `README.md` ← Context and file index
- Web UI: `/public/debug/toc-unstick-inspector.html` ← Guided workflow
- TypeScript: `/lib/debug-toc-measurements.ts` ← Implementation

---

**Ready? Go to Step 1 above!** ⬆️
