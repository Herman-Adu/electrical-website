/**
 * Hero System — Discriminated Union Types
 * ========================================
 * Single source of truth for all hero configuration shapes.
 * TYPES-ONLY file — no React imports, no JSX, no runtime code except the
 * exported type-guard functions at the bottom.
 *
 * Import path: @/components/hero/hero-types
 *
 * ---------------------------------------------------------------------------
 * Usage pattern for page-level config consts (satisfies vs. direct annotation)
 * ---------------------------------------------------------------------------
 * Use `satisfies` rather than a direct type annotation on hero config consts:
 *
 *   // PREFERRED — preserves literal inference, enforces shape
 *   const heroConfig = { ... } satisfies BlueprintHeroConfig;
 *
 *   // AVOID — direct annotation widens literal types and loses as-const inferences
 *   const heroConfig: BlueprintHeroConfig = { ... };
 *
 * The `satisfies` operator (TypeScript 4.9+) validates the object against the
 * type at the point of definition while keeping the inferred literal type for
 * downstream consumers. This matters for `background.type`, `middle.type`, and
 * `readonly` tuple fields where narrowing is needed without explicit casting.
 * ---------------------------------------------------------------------------
 */

import type React from "react";
import type { TrustIndicatorItem } from "@/components/shared/hero-trust-indicators";

// Re-export TrustIndicatorItem so consumers can import it from a single hero
// types entrypoint without knowing its implementation location.
export type { TrustIndicatorItem };

// =============================================================================
// PRIMITIVE TYPES
// =============================================================================

export interface HeroBreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

export interface HeroButton {
  readonly label: string;
  readonly href: string;
}

// =============================================================================
// DISCRIMINATED UNIONS
// =============================================================================

/** Background variant — determines visual treatment of the hero section */
export type HeroBackground =
  | { readonly type: "blueprint" }
  | { readonly type: "image"; readonly src: string; readonly alt: string };

/**
 * Middle slot — the zone between the title block and the meta bar.
 * Only one variant is rendered; use `isMiddle*` guards to narrow.
 */
export type HeroMiddle =
  | { readonly type: "trust-indicators"; readonly items: readonly TrustIndicatorItem[] }
  | { readonly type: "buttons"; readonly items: readonly HeroButton[] }
  | { readonly type: "none" };

// =============================================================================
// BASE CONFIGURATION INTERFACE
// =============================================================================

export interface HeroBaseConfig {
  /** Short label appearing before the animated status pill (e.g. "Status") */
  readonly statusLabel: string;
  /** Value displayed in the status pill (e.g. "SYSTEMS_READY") */
  readonly statusValue: string;
  /** Breadcrumb trail rendered above the eyebrow */
  readonly breadcrumbs: readonly HeroBreadcrumbItem[];
  /**
   * Icon rendered in the badge beside the eyebrow.
   * Accepted as React.ReactNode so callers can pass any Lucide icon element.
   */
  readonly icon: React.ReactNode;
  /** Small uppercase text above the headline */
  readonly eyebrow: string;
  /** Primary headline */
  readonly title: string;
  /** Optional highlighted portion of the headline (gradient / accent colour) */
  readonly titleHighlight?: string;
  /** Subheadline paragraph below the title */
  readonly description: string;
  /** Technical metadata tags rendered in the meta bar */
  readonly meta: readonly string[];
  /** Middle slot content — trust indicators, CTA buttons, or empty */
  readonly middle: HeroMiddle;
  /** Background variant — blueprint SVG or photographic image */
  readonly background: HeroBackground;
}

// =============================================================================
// DERIVED CONFIGURATION TYPES
// =============================================================================

/**
 * Hero config for blueprint-background pages.
 * The `background` field is narrowed to `{ type: 'blueprint' }`.
 * Use `satisfies BlueprintHeroConfig` on page-level config consts.
 */
export interface BlueprintHeroConfig extends HeroBaseConfig {
  readonly background: { readonly type: "blueprint" };
  /**
   * Optional decorative circuit/SVG node rendered in the decor layer.
   * Only meaningful on blueprint backgrounds where no photo overlay exists.
   */
  readonly circuitDecor?: React.ReactNode;
}

/**
 * Hero config for photographic-background pages.
 * The `background` field is narrowed to include `src` and `alt`.
 * Use `satisfies ImageHeroConfig` on page-level config consts.
 */
export interface ImageHeroConfig extends HeroBaseConfig {
  readonly background: { readonly type: "image"; readonly src: string; readonly alt: string };
}

// =============================================================================
// TYPE GUARD FUNCTIONS
// =============================================================================

/**
 * Narrows `config` to `BlueprintHeroConfig` when `background.type === 'blueprint'`.
 *
 * @example
 * if (isBlueprintHeroConfig(config)) {
 *   // config.circuitDecor is accessible here
 * }
 */
export function isBlueprintHeroConfig(
  config: HeroBaseConfig,
): config is BlueprintHeroConfig {
  return config.background.type === "blueprint";
}

/**
 * Narrows `config` to `ImageHeroConfig` when `background.type === 'image'`.
 *
 * @example
 * if (isImageHeroConfig(config)) {
 *   // config.background.src and config.background.alt are accessible here
 * }
 */
export function isImageHeroConfig(
  config: HeroBaseConfig,
): config is ImageHeroConfig {
  return config.background.type === "image";
}

/**
 * Narrows `middle` to the trust-indicators variant.
 *
 * @example
 * if (isMiddleTrustIndicators(config.middle)) {
 *   // config.middle.items is TrustIndicatorItem[]
 * }
 */
export function isMiddleTrustIndicators(
  middle: HeroMiddle,
): middle is Extract<HeroMiddle, { type: "trust-indicators" }> {
  return middle.type === "trust-indicators";
}

/**
 * Narrows `middle` to the buttons variant.
 *
 * @example
 * if (isMiddleButtons(config.middle)) {
 *   // config.middle.items is HeroButton[]
 * }
 */
export function isMiddleButtons(
  middle: HeroMiddle,
): middle is Extract<HeroMiddle, { type: "buttons" }> {
  return middle.type === "buttons";
}
