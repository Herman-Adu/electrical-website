const MOBILE_NAVBAR_FALLBACK_HEIGHT = 64;
const DESKTOP_NAVBAR_FALLBACK_HEIGHT = 80;
const DEFAULT_SCROLL_GAP = 38;
const TOC_SCROLL_GAP = 8;

const PRIMARY_NAV_SELECTOR = 'nav[aria-label="Primary"]';
const STICKY_BREADCRUMB_SELECTOR = '[data-sticky-breadcrumb="true"]';

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
): void {
  if (typeof window === "undefined") {
    return;
  }

  const offset = getScrollOffset({
    includeNavbar,
    includeBreadcrumb,
    extraOffset,
    baseGap,
    pageType,
  });

  const targetRect = target.getBoundingClientRect();
  const targetTop = window.scrollY + targetRect.top - Math.max(offset, 0);

  console.log(`[scroll-fix] Scroll action:`, {
    targetElement: target.id || target.className || "unknown",
    currentScrollY: window.scrollY,
    targetRectTop: targetRect.top,
    calculatedOffset: offset,
    finalScrollTop: Math.max(0, targetTop),
    behavior,
    pageType,
  });

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior,
  });
}

export const SCROLL_GAP = {
  default: DEFAULT_SCROLL_GAP,
  toc: TOC_SCROLL_GAP,
} as const;
