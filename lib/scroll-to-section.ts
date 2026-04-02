const MOBILE_NAVBAR_FALLBACK_HEIGHT = 64;
const DESKTOP_NAVBAR_FALLBACK_HEIGHT = 80;
const DEFAULT_SCROLL_GAP = 20;
const TOC_SCROLL_GAP = 8;

const PRIMARY_NAV_SELECTOR = 'nav[aria-label="Primary"]';
const STICKY_BREADCRUMB_SELECTOR = '[data-sticky-breadcrumb="true"]';

interface ScrollOffsetOptions {
  includeNavbar?: boolean;
  includeBreadcrumb?: boolean;
  extraOffset?: number;
  baseGap?: number;
}

interface ScrollToElementOptions extends ScrollOffsetOptions {
  behavior?: ScrollBehavior;
}

function getNavbarHeight(): number {
  const navbar = document.querySelector<HTMLElement>(PRIMARY_NAV_SELECTOR);
  if (navbar) {
    const height = Math.round(navbar.getBoundingClientRect().height);
    if (height > 0) {
      return height;
    }
  }

  return window.matchMedia("(min-width: 1024px)").matches
    ? DESKTOP_NAVBAR_FALLBACK_HEIGHT
    : MOBILE_NAVBAR_FALLBACK_HEIGHT;
}

function getStickyBreadcrumbHeight(): number {
  const breadcrumb = document.querySelector<HTMLElement>(
    STICKY_BREADCRUMB_SELECTOR,
  );
  if (!breadcrumb) {
    return 0;
  }

  const style = window.getComputedStyle(breadcrumb);
  if (style.display === "none" || style.visibility === "hidden") {
    return 0;
  }

  return Math.max(0, Math.round(breadcrumb.getBoundingClientRect().height));
}

export function getScrollOffset({
  includeNavbar = true,
  includeBreadcrumb = true,
  extraOffset = 0,
  baseGap = DEFAULT_SCROLL_GAP,
}: ScrollOffsetOptions = {}): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const navbarHeight = includeNavbar ? getNavbarHeight() : 0;
  const breadcrumbHeight = includeBreadcrumb ? getStickyBreadcrumbHeight() : 0;

  return navbarHeight + breadcrumbHeight + baseGap + extraOffset;
}

export function scrollToElementWithOffset(
  target: Element,
  {
    behavior = "smooth",
    includeNavbar = true,
    includeBreadcrumb = true,
    extraOffset = 0,
    baseGap = DEFAULT_SCROLL_GAP,
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
  });

  const targetTop =
    window.scrollY + target.getBoundingClientRect().top - Math.max(offset, 0);

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior,
  });
}

export const SCROLL_GAP = {
  default: DEFAULT_SCROLL_GAP,
  toc: TOC_SCROLL_GAP,
} as const;
