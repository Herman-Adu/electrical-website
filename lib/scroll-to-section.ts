const MOBILE_NAVBAR_FALLBACK_HEIGHT = 64;
const DESKTOP_NAVBAR_FALLBACK_HEIGHT = 80;
const DEFAULT_SCROLL_GAP = 38;
const TOC_SCROLL_GAP = 8;

const PRIMARY_NAV_SELECTOR = 'nav[aria-label="Primary"]';
const STICKY_BREADCRUMB_SELECTOR = '[data-sticky-breadcrumb="true"]';
const STICKY_TOC_SELECTOR = '[data-sticky-toc="true"]';

type PageType = "default" | "article" | "form";

const PAGE_TYPE_GAPS: Record<PageType, number> = {
  default: DEFAULT_SCROLL_GAP, // 20px
  article: TOC_SCROLL_GAP, // 8px
  form: TOC_SCROLL_GAP, // 8px
} as const;

interface ScrollOffsetOptions {
  includeNavbar?: boolean;
  includeBreadcrumb?: boolean;
  extraOffset?: number;
  baseGap?: number;
  pageType?: PageType;
}

interface ScrollToElementOptions extends ScrollOffsetOptions {
  behavior?: ScrollBehavior;
}

function getNavbarHeight(): number {
  const navbar = document.querySelector<HTMLElement>(PRIMARY_NAV_SELECTOR);
  if (navbar) {
    const height = Math.round(navbar.getBoundingClientRect().height);
    if (height > 0) {
      console.log(`[scroll-diagnostics] navbar measured: ${height}px`);
      return height;
    }
  }

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const fallbackHeight = isDesktop
    ? DESKTOP_NAVBAR_FALLBACK_HEIGHT
    : MOBILE_NAVBAR_FALLBACK_HEIGHT;
  console.log(
    `[scroll-diagnostics] navbar fallback: ${fallbackHeight}px (${isDesktop ? "desktop" : "mobile"})`,
  );
  return fallbackHeight;
}

function getStickyBreadcrumbHeight(): number {
  const breadcrumb = document.querySelector<HTMLElement>(
    STICKY_BREADCRUMB_SELECTOR,
  );
  if (!breadcrumb) {
    console.log(
      `[scroll-diagnostics] breadcrumb not found (selector: ${STICKY_BREADCRUMB_SELECTOR})`,
    );
    return 0;
  }

  const style = window.getComputedStyle(breadcrumb);
  if (style.display === "none" || style.visibility === "hidden") {
    console.log(
      `[scroll-diagnostics] breadcrumb hidden (display: ${style.display}, visibility: ${style.visibility})`,
    );
    return 0;
  }

  const height = Math.max(
    0,
    Math.round(breadcrumb.getBoundingClientRect().height),
  );
  console.log(
    `[scroll-diagnostics] breadcrumb measured: ${height}px (display: ${style.display}, position: ${style.position})`,
  );
  return height;
}

export function getStickyAnchorOffset(): number {
  if (typeof window === 'undefined') return 0;
  const container = document.querySelector<HTMLElement>(STICKY_TOC_SELECTOR);
  if (!container) return 0;
  const style = window.getComputedStyle(container);
  if (style.display === 'none' || style.visibility === 'hidden') return 0;
  // CSS 'top' = static sticky threshold — correct at any scroll position
  const cssTop = parseFloat(window.getComputedStyle(container).top);
  return isNaN(cssTop) || cssTop <= 0 ? 0 : Math.round(cssTop);
}

export function getScrollOffset({
  includeNavbar = true,
  includeBreadcrumb = true,
  extraOffset = 0,
  baseGap,
  pageType = "default",
}: ScrollOffsetOptions = {}): number {
  if (typeof window === "undefined") {
    return 0;
  }

  // If baseGap not explicitly provided, use page-type default
  const resolvedBaseGap =
    baseGap !== undefined ? baseGap : PAGE_TYPE_GAPS[pageType];

  const navbarHeight = includeNavbar ? getNavbarHeight() : 0;
  const breadcrumbHeight = includeBreadcrumb ? getStickyBreadcrumbHeight() : 0;

  // FIX: If breadcrumb is present, it already accounts for navbar positioning
  // via its sticky positioning (top: 80px/20 in Tailwind).
  // Only add navbar height if breadcrumb is NOT present.
  const effectiveNavbarHeight = breadcrumbHeight > 0 ? 0 : navbarHeight;
  const totalOffset =
    effectiveNavbarHeight + breadcrumbHeight + resolvedBaseGap + extraOffset;

  console.log(`[scroll-fix] Offset calculation:`, {
    navbarHeight,
    breadcrumbHeight,
    effectiveNavbarHeight,
    baseGap: resolvedBaseGap,
    extraOffset,
    pageType,
    totalOffset,
    reason:
      breadcrumbHeight > 0
        ? "breadcrumb present: navbar height not added (breadcrumb is sticky)"
        : "no breadcrumb: navbar height included",
  });

  return totalOffset;
}

/**
 * Returns the element's viewport-relative top, stripped of the element's own CSS Y-transform.
 * Framer Motion initial states (e.g. y:30) shift getBoundingClientRect().top, causing scroll
 * targets to be offset by the initial transform value before the animation plays.
 */
function getLayoutTop(element: Element): number {
  const top = element.getBoundingClientRect().top;
  const transform = window.getComputedStyle(element as HTMLElement).transform;
  if (!transform || transform === "none") return top;
  const yTranslation = new DOMMatrix(transform).m42;
  return top - yTranslation;
}

export function scrollToElementWithOffset(
  target: Element,
  {
    behavior = "smooth",
    includeNavbar = true,
    includeBreadcrumb = true,
    extraOffset = 0,
    baseGap,
    pageType = "default",
  }: ScrollToElementOptions = {},
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const resolvedBaseGap =
      baseGap !== undefined ? baseGap : PAGE_TYPE_GAPS[pageType];
    const stickyAnchorOffset = getStickyAnchorOffset();
    const offset = stickyAnchorOffset > 0
      ? stickyAnchorOffset + extraOffset
      : getScrollOffset({
        includeNavbar,
        includeBreadcrumb,
        extraOffset,
        baseGap,
        pageType,
      });

    // Strip the element's own CSS Y-transform before computing scroll target.
    // whileInView sections start at y=30 (Framer Motion initial state). getBoundingClientRect()
    // includes this transform, so the naive calculation scrolls 30px too far. When the section
    // enters the viewport the animation fires (y: 30→0), shifting content up into the breadcrumb.
    // Using the layout position (transform subtracted) places the element correctly after animation.
    const layoutTop = getLayoutTop(target);
    const targetTop = window.scrollY + layoutTop - Math.max(offset, 0);
    const finalScrollTop = Math.max(0, targetTop);

    console.log(`[scroll-fix] Scroll action:`, {
      targetElement: target.id || target.className || "unknown",
      currentScrollY: window.scrollY,
      layoutTop,
      calculatedOffset: offset,
      finalScrollTop,
      behavior,
      pageType,
    });

    // If already at the target position, resolve immediately
    if (Math.abs(window.scrollY - finalScrollTop) < 1) {
      resolve();
      return;
    }

    window.scrollTo({
      top: finalScrollTop,
      behavior,
    });

    // For smooth scrolling, detect actual scroll animation completion
    if (behavior === "smooth") {
      let isWaitingForScroll = true;
      let scrollTimeout: NodeJS.Timeout;
      let hasScrolled = false;

      const onScroll = () => {
        if (!isWaitingForScroll) return;

        hasScrolled = true;

        // Reset the timeout each time a scroll event fires
        clearTimeout(scrollTimeout);

        // If no scroll event fires for 200ms, animation is done
        scrollTimeout = setTimeout(() => {
          isWaitingForScroll = false;
          window.removeEventListener('scroll', onScroll as EventListener);
          resolve();
        }, 200);
      };

      window.addEventListener('scroll', onScroll as EventListener);

      // Safety fallback: resolve after 2000ms maximum
      // If no scroll events fired by 100ms, assume smooth scroll isn't supported (e.g., tests)
      const fallbackTimeout = setTimeout(() => {
        if (!hasScrolled) {
          // No scroll events fired - likely in test environment or instant scroll
          isWaitingForScroll = false;
          window.removeEventListener('scroll', onScroll as EventListener);
          clearTimeout(scrollTimeout);
          resolve();
        }
      }, 100);

      // Ultimate safety: resolve after 2000ms to prevent hangs
      const ultimateFallback = setTimeout(() => {
        if (isWaitingForScroll) {
          isWaitingForScroll = false;
          window.removeEventListener('scroll', onScroll as EventListener);
          clearTimeout(scrollTimeout);
          clearTimeout(fallbackTimeout);
          resolve();
        }
      }, 2000);
    } else {
      // For instant/auto scroll, resolve immediately
      resolve();
    }
  });
}

export const SCROLL_GAP = {
  default: DEFAULT_SCROLL_GAP,
  toc: TOC_SCROLL_GAP,
} as const;
