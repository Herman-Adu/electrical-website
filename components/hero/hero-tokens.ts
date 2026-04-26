/**
 * Hero Typography Token Contracts
 * ================================
 * Single source of truth for hero h1 class strings across all tiers.
 * ALWAYS import from here rather than typing class strings inline.
 *
 * Tier mapping:
 *   screen  — home only         (min-h-[100svh])
 *   tall    — list/detail pages  (min-h-[70svh] md:min-h-[78svh])
 *   compact — contact            (min-h-[65svh] md:min-h-[72svh])
 *
 * Background context mapping:
 *   blueprint-bg  → text-foreground  (blueprint SVG, theme-aware light/dark)
 *   image-dark-bg → text-white       (photo bg + dark gradient overlay)
 *
 * Do NOT add lg:text-8xl or higher — these are the frozen breakpoints.
 * Do NOT add drop-shadow-lg — dark overlays handle image contrast.
 */

/** screen tier · blueprint · home only (min-h-[100svh]) */
export const HERO_H1_SCREEN =
  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black text-foreground uppercase tracking-tight leading-[0.9] mb-6" as const;

/** tall tier · blueprint background (about, services, projects, news-hub) */
export const HERO_H1_TALL_BLUEPRINT =
  "text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-foreground" as const;

/** tall tier · photographic dark-overlay background (service-page) */
export const HERO_H1_TALL_IMAGE =
  "text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-white" as const;

/** compact tier · blueprint background (contact) */
export const HERO_H1_COMPACT_BLUEPRINT =
  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-5 text-foreground text-balance" as const;

/** category tier · photographic dark-overlay background (project-category, news-category) */
export const HERO_H1_CATEGORY_IMAGE =
  "text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-white/80" as const;

/** detail tier · photographic dark-overlay · article titles (news-detail) */
export const HERO_H1_DETAIL_ARTICLE =
  "mx-auto mb-6 max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white/80" as const;

/** detail tier · photographic dark-overlay · uppercase titles (project-detail) */
export const HERO_H1_DETAIL_PROJECT =
  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.0] text-whit/80e" as const;
