/**
 * TDD: hero-types.ts type-guard function tests
 *
 * These tests exercise the RUNTIME type-guard functions exported from
 * hero-types.ts. TypeScript generics and discriminated unions are verified
 * structurally — the guards must correctly narrow at runtime as well as
 * at compile time.
 *
 * Note: No JSX / React testing library needed — guards are pure functions.
 */
import { describe, it, expect } from "vitest";

import {
  isBlueprintHeroConfig,
  isImageHeroConfig,
  isMiddleTrustIndicators,
  isMiddleButtons,
} from "../hero-types";

import type {
  HeroBaseConfig,
  HeroMiddle,
} from "../hero-types";

// ---------------------------------------------------------------------------
// Minimal stub data (satisfies HeroBaseConfig shape for runtime guards)
// ---------------------------------------------------------------------------

const BASE_FIELDS = {
  statusLabel: "Status",
  statusValue: "READY",
  breadcrumbs: [{ label: "Home", href: "/" }],
  icon: null, // React.ReactNode — null is valid at runtime
  eyebrow: "Eyebrow",
  title: "Title",
  description: "Description",
  meta: ["Tag A"],
} as const;

const BLUEPRINT_CONFIG: HeroBaseConfig = {
  ...BASE_FIELDS,
  middle: { type: "none" },
  background: { type: "blueprint" },
};

const IMAGE_CONFIG: HeroBaseConfig = {
  ...BASE_FIELDS,
  middle: { type: "none" },
  background: { type: "image", src: "/hero.jpg", alt: "Hero image" },
};

// ---------------------------------------------------------------------------
// isBlueprintHeroConfig
// ---------------------------------------------------------------------------

describe("isBlueprintHeroConfig", () => {
  it("returns true for a config with background.type === 'blueprint'", () => {
    expect(isBlueprintHeroConfig(BLUEPRINT_CONFIG)).toBe(true);
  });

  it("returns false for a config with background.type === 'image'", () => {
    expect(isBlueprintHeroConfig(IMAGE_CONFIG)).toBe(false);
  });

  it("narrows the type so background.type is 'blueprint' after the guard", () => {
    if (isBlueprintHeroConfig(BLUEPRINT_CONFIG)) {
      // TypeScript should accept this without error — runtime assertion confirms
      const bgType: "blueprint" = BLUEPRINT_CONFIG.background.type;
      expect(bgType).toBe("blueprint");
    }
  });
});

// ---------------------------------------------------------------------------
// isImageHeroConfig
// ---------------------------------------------------------------------------

describe("isImageHeroConfig", () => {
  it("returns true for a config with background.type === 'image'", () => {
    expect(isImageHeroConfig(IMAGE_CONFIG)).toBe(true);
  });

  it("returns false for a config with background.type === 'blueprint'", () => {
    expect(isImageHeroConfig(BLUEPRINT_CONFIG)).toBe(false);
  });

  it("narrows the type so src and alt are accessible after the guard", () => {
    if (isImageHeroConfig(IMAGE_CONFIG)) {
      // TypeScript should accept background.src and background.alt after narrowing
      expect(IMAGE_CONFIG.background.src).toBe("/hero.jpg");
      expect(IMAGE_CONFIG.background.alt).toBe("Hero image");
    }
  });
});

// ---------------------------------------------------------------------------
// isMiddleTrustIndicators
// ---------------------------------------------------------------------------

describe("isMiddleTrustIndicators", () => {
  const trustMiddle: HeroMiddle = {
    type: "trust-indicators",
    items: [{ icon: "Shield", title: "Insured", description: "Fully insured" }],
  };
  const buttonsMiddle: HeroMiddle = {
    type: "buttons",
    items: [{ label: "Contact Us", href: "/contact" }],
  };
  const noneMiddle: HeroMiddle = { type: "none" };

  it("returns true for middle with type === 'trust-indicators'", () => {
    expect(isMiddleTrustIndicators(trustMiddle)).toBe(true);
  });

  it("returns false for middle with type === 'buttons'", () => {
    expect(isMiddleTrustIndicators(buttonsMiddle)).toBe(false);
  });

  it("returns false for middle with type === 'none'", () => {
    expect(isMiddleTrustIndicators(noneMiddle)).toBe(false);
  });

  it("narrows type so items is accessible after the guard", () => {
    if (isMiddleTrustIndicators(trustMiddle)) {
      expect(trustMiddle.items).toHaveLength(1);
      expect(trustMiddle.items[0].title).toBe("Insured");
    }
  });
});

// ---------------------------------------------------------------------------
// isMiddleButtons
// ---------------------------------------------------------------------------

describe("isMiddleButtons", () => {
  const buttonsMiddle: HeroMiddle = {
    type: "buttons",
    items: [{ label: "Get a Quote", href: "/quote" }],
  };
  const trustMiddle: HeroMiddle = {
    type: "trust-indicators",
    items: [{ icon: "Award", title: "Certified", description: "Cert text" }],
  };
  const noneMiddle: HeroMiddle = { type: "none" };

  it("returns true for middle with type === 'buttons'", () => {
    expect(isMiddleButtons(buttonsMiddle)).toBe(true);
  });

  it("returns false for middle with type === 'trust-indicators'", () => {
    expect(isMiddleButtons(trustMiddle)).toBe(false);
  });

  it("returns false for middle with type === 'none'", () => {
    expect(isMiddleButtons(noneMiddle)).toBe(false);
  });

  it("narrows type so button items are accessible after the guard", () => {
    if (isMiddleButtons(buttonsMiddle)) {
      expect(buttonsMiddle.items[0].label).toBe("Get a Quote");
      expect(buttonsMiddle.items[0].href).toBe("/quote");
    }
  });
});
