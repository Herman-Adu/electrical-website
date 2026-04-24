/**
 * TOC Unstick Point Debug Instrumentation
 *
 * Captures exact measurements when TOC unsticks at Gallery section.
 * Copy-paste into browser console and run: debugTocMeasurements()
 */

interface MeasurementSnapshot {
  scrollY: number;
  timestamp: number;
  viewport: {
    height: number;
    width: number;
  };
  aside: {
    height: number;
    offsetHeight: number;
    scrollHeight: number;
    minHeight: string;
    alignSelf: string;
    top: number; // distance from viewport top
    bottom: number;
    isSticky: boolean;
  };
  toc: {
    height: number;
    offsetHeight: number;
    scrollHeight: number;
    top: number;
    bottom: number;
  };
  mainContent: {
    scrollHeight: number;
    offsetHeight: number;
    top: number;
  };
  gridCell: {
    height: number;
    offsetHeight: number;
  };
  sections: {
    id: string;
    label: string;
    top: number;
    isVisible: boolean;
  }[];
  gallery: {
    isVisible: boolean;
    distanceFromViewportTop: number;
  };
  notes: string[];
}

export function debugTocMeasurements() {
  const measurements: MeasurementSnapshot[] = [];
  let isRunning = true;
  let lastScrollY = 0;
  let lastScrollTimestamp = 0;

  // Define section labels for reference
  const sectionMap: Record<string, string> = {
    overview: "Overview",
    scope: "Scope of Work",
    challenge: "Challenge & Solution",
    timeline: "Project Timeline",
    gallery: "Gallery",
    testimonial: "Client Testimonial",
    related: "Related Projects",
  };

  // Helper: get computed styles safely
  function getComputedValue(el: Element, prop: string): string {
    return window.getComputedStyle(el).getPropertyValue(prop) || "N/A";
  }

  // Helper: capture single snapshot
  function captureSnapshot(reason: string): MeasurementSnapshot {
    const aside = document.querySelector<HTMLElement>('[data-sticky-toc="true"]');
    const toc = document.querySelector<HTMLElement>('[aria-label="Table of contents"]');
    const mainContent = document.querySelector<HTMLElement>('[id="project-content"]');
    const gridCell = document.querySelector<HTMLElement>('.section-padding.bg-background');

    if (!aside || !toc || !mainContent) {
      return {
        scrollY: window.scrollY,
        timestamp: Date.now(),
        viewport: { height: 0, width: 0 },
        aside: {
          height: 0,
          offsetHeight: 0,
          scrollHeight: 0,
          minHeight: "N/A",
          alignSelf: "N/A",
          top: 0,
          bottom: 0,
          isSticky: false,
        },
        toc: { height: 0, offsetHeight: 0, scrollHeight: 0, top: 0, bottom: 0 },
        mainContent: { scrollHeight: 0, offsetHeight: 0, top: 0 },
        gridCell: { height: 0, offsetHeight: 0 },
        sections: [],
        gallery: { isVisible: false, distanceFromViewportTop: 0 },
        notes: ["ERROR: Could not find required elements"],
      };
    }

    const asideRect = aside.getBoundingClientRect();
    const tocRect = toc.getBoundingClientRect();
    const mainRect = mainContent.getBoundingClientRect();
    const gridCellRect = gridCell?.getBoundingClientRect();
    const galleryEl = document.getElementById("gallery");
    const galleryRect = galleryEl?.getBoundingClientRect();

    // Capture all TOC sections
    const sections = Object.entries(sectionMap).map(([id, label]) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        id,
        label,
        top: rect.top,
        isVisible: rect.top < window.innerHeight && rect.bottom > 0,
      };
    }).filter((s) => s !== null) as MeasurementSnapshot["sections"];

    // Determine if TOC is unsticking
    const notes: string[] = [];
    if (reason) notes.push(`Reason: ${reason}`);

    // Check if TOC is in sticky state
    const asideComputedPosition = getComputedValue(aside, "position");
    const isSticky = asideComputedPosition === "sticky" || asideComputedPosition === "fixed";
    notes.push(`Aside position: ${asideComputedPosition}`);

    // Check if TOC.top < 0 (which means it's scrolling up relative to viewport)
    if (tocRect.top < 0) {
      notes.push(`⚠️ TOC unsticking! top=${tocRect.top.toFixed(1)}px (scrolled past sticky offset)`);
    }

    // Gallery visibility
    const galleryIsVisible = galleryRect
      ? galleryRect.top < window.innerHeight && galleryRect.bottom > 0
      : false;

    if (galleryIsVisible && lastScrollY < window.scrollY) {
      notes.push(`✓ Gallery entered viewport (from above)`);
    }

    return {
      scrollY: window.scrollY,
      timestamp: Date.now(),
      viewport: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      aside: {
        height: asideRect.height,
        offsetHeight: aside.offsetHeight,
        scrollHeight: aside.scrollHeight,
        minHeight: getComputedValue(aside, "min-height"),
        alignSelf: getComputedValue(aside, "align-self"),
        top: asideRect.top,
        bottom: asideRect.bottom,
        isSticky,
      },
      toc: {
        height: tocRect.height,
        offsetHeight: toc.offsetHeight,
        scrollHeight: toc.scrollHeight,
        top: tocRect.top,
        bottom: tocRect.bottom,
      },
      mainContent: {
        scrollHeight: (mainContent as HTMLElement).scrollHeight,
        offsetHeight: mainContent.offsetHeight,
        top: mainRect.top,
      },
      gridCell: {
        height: gridCellRect?.height ?? 0,
        offsetHeight: gridCell?.offsetHeight ?? 0,
      },
      sections,
      gallery: {
        isVisible: galleryIsVisible,
        distanceFromViewportTop: galleryRect?.top ?? 0,
      },
      notes,
    };
  }

  // Helper: format snapshot for console
  function formatSnapshot(snap: MeasurementSnapshot): string {
    const lines: string[] = [];
    const scrollPercent = ((snap.scrollY / document.documentElement.scrollHeight) * 100).toFixed(1);

    lines.push(`\n${"=".repeat(80)}`);
    lines.push(
      `[SCROLL: ${snap.scrollY.toFixed(0)}px] (${scrollPercent}% down) | ` +
      `Viewport: ${snap.viewport.height}h × ${snap.viewport.width}w`
    );
    lines.push(`Timestamp: ${new Date(snap.timestamp).toISOString()}`);

    lines.push(
      `Aside: height=${snap.aside.height.toFixed(0)}px | ` +
      `offset=${snap.aside.offsetHeight} | ` +
      `scroll=${snap.aside.scrollHeight} | ` +
      `top=${snap.aside.top.toFixed(1)}px | ` +
      `sticky=${snap.aside.isSticky}`
    );

    lines.push(
      `TOC: height=${snap.toc.height.toFixed(0)}px | ` +
      `offset=${snap.toc.offsetHeight} | ` +
      `scroll=${snap.toc.scrollHeight} | ` +
      `top=${snap.toc.top.toFixed(1)}px (${snap.toc.top < 0 ? "⚠️ UNSTICKING" : "sticky"})`
    );

    lines.push(
      `Main: scroll=${snap.mainContent.scrollHeight} | ` +
      `offset=${snap.mainContent.offsetHeight} | ` +
      `minHeight=${snap.aside.minHeight}`
    );

    if (snap.gallery.isVisible) {
      lines.push(
        `Gallery: ✓ VISIBLE | distance-from-top=${snap.gallery.distanceFromViewportTop.toFixed(1)}px`
      );
    }

    lines.push(`Sections:`);
    snap.sections.forEach((sec) => {
      const visible = sec.isVisible ? "✓" : " ";
      lines.push(
        `  [${visible}] ${sec.label.padEnd(25)} | top=${sec.top.toFixed(1).padStart(7)}px`
      );
    });

    if (snap.notes.length > 0) {
      lines.push(`Notes:`);
      snap.notes.forEach((note) => lines.push(`  • ${note}`));
    }

    return lines.join("\n");
  }

  // Scroll listener: capture every 100px + when Gallery enters
  function onScroll() {
    const now = Date.now();
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

  // Start: capture initial state
  console.clear();
  console.log(
    "%c🔍 TOC UNSTICK DEBUG INSTRUMENTATION STARTED",
    "font-weight: bold; font-size: 16px; color: #00d4ff;"
  );
  console.log(
    "%cScroll to trigger measurements. Watch for ⚠️ TOC UNSTICKING when Gallery section enters.",
    "color: #666;"
  );

  const initialSnap = captureSnapshot("Initial state");
  measurements.push(initialSnap);
  console.log(formatSnapshot(initialSnap));

  // Attach listeners
  window.addEventListener("scroll", onScroll, { passive: true });

  // Export function: user calls to stop and dump results
  const stopAndExport = () => {
    isRunning = false;
    window.removeEventListener("scroll", onScroll);

    console.log(
      "%c\n📊 DEBUG INSTRUMENTATION COMPLETE",
      "font-weight: bold; font-size: 16px; color: #00d4ff;"
    );
    console.log(
      `%cCaptured ${measurements.length} snapshots. Dumping JSON...`,
      "color: #666;"
    );

    // Create JSON dump
    const jsonDump = {
      projectTitle: "Project Detail Page TOC Unstick Debug",
      capturedAt: new Date().toISOString(),
      totalSnapshots: measurements.length,
      measurements,
    };

    // Log as downloadable JSON
    console.log(
      "%c📥 COPY BELOW AND SAVE AS .json FILE:",
      "font-weight: bold; color: #00ff00; background: #000; padding: 8px;"
    );
    console.log(JSON.stringify(jsonDump, null, 2));

    // Also return for programmatic access
    return jsonDump;
  };

  // Expose stop function globally
  (window as any).stopTocDebug = stopAndExport;

  console.log(
    "%c✓ Debug instrumentation active. Call stopTocDebug() in console to dump results.",
    "color: #00ff00; font-weight: bold;"
  );

  return {
    stop: stopAndExport,
    getSnapshots: () => measurements,
  };
}

// Export for use in React component or direct console invocation
if (typeof window !== "undefined") {
  (window as any).debugTocMeasurements = debugTocMeasurements;
}
