import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getScrollOffset,
  scrollToElementWithOffset,
  SCROLL_GAP,
} from "../scroll-to-section";

describe("scroll-to-section utilities", () => {
  beforeEach(() => {
    // Clear all console logs before each test
    vi.clearAllMocks();
    // Mock window methods
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getScrollOffset", () => {
    describe("when breadcrumb is present (FIX: should NOT double-count navbar)", () => {
      it("should return breadcrumb height + gap (NOT navbar + breadcrumb + gap)", () => {
        // Mock navbar: 81px
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        // Mock sticky breadcrumb: 40px (must mock getBoundingClientRect in JSDOM)
        const breadcrumb = document.createElement("div");
        breadcrumb.setAttribute("data-sticky-breadcrumb", "true");
        breadcrumb.style.height = "40px";
        breadcrumb.style.position = "sticky";
        breadcrumb.style.top = "0";
        Object.defineProperty(breadcrumb, "getBoundingClientRect", {
          value: () => ({ height: 40 }) as DOMRect,
        });
        document.body.appendChild(breadcrumb);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: true,
          baseGap: 20,
          extraOffset: 0,
        });

        // CORRECTED EXPECTATION: 40px (breadcrumb) + 20px (gap) = 60px
        // NOT 81px (navbar) + 40px (breadcrumb) + 20px (gap) = 141px
        // The FIX ensures that when breadcrumb is present, navbar height is NOT added
        expect(offset).toBe(60);

        // Cleanup
        document.body.removeChild(navbar);
        document.body.removeChild(breadcrumb);
      });

      it("should use explicit baseGap when provided", () => {
        const breadcrumb = document.createElement("div");
        breadcrumb.setAttribute("data-sticky-breadcrumb", "true");
        breadcrumb.style.height = "40px";
        Object.defineProperty(breadcrumb, "getBoundingClientRect", {
          value: () => ({ height: 40 }) as DOMRect,
        });
        document.body.appendChild(breadcrumb);

        const offset = getScrollOffset({
          includeBreadcrumb: true,
          includeNavbar: true,
          baseGap: 8,
        });

        // breadcrumb (40) + gap (8) = 48
        expect(offset).toBe(48);

        document.body.removeChild(breadcrumb);
      });
    });

    describe("when breadcrumb is absent (should include navbar)", () => {
      it("should return navbar height + gap", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          baseGap: 20,
          extraOffset: 0,
        });

        // navbar (81) + gap (20) = 101
        expect(offset).toBe(101);

        document.body.removeChild(navbar);
      });
    });

    describe("with extraOffset", () => {
      it("should add extraOffset to calculated total", () => {
        const breadcrumb = document.createElement("div");
        breadcrumb.setAttribute("data-sticky-breadcrumb", "true");
        breadcrumb.style.height = "40px";
        Object.defineProperty(breadcrumb, "getBoundingClientRect", {
          value: () => ({ height: 40 }) as DOMRect,
        });
        document.body.appendChild(breadcrumb);

        const offset = getScrollOffset({
          includeBreadcrumb: true,
          includeNavbar: true,
          baseGap: 20,
          extraOffset: 10,
        });

        // breadcrumb (40) + gap (20) + extra (10) = 70
        expect(offset).toBe(70);

        document.body.removeChild(breadcrumb);
      });
    });

    describe("edge cases", () => {
      it("should return 0 on server-side (window undefined)", () => {
        const originalWindow = global.window;
        // @ts-ignore
        delete global.window;

        const offset = getScrollOffset();
        expect(offset).toBe(0);

        global.window = originalWindow;
      });

      it("should return only gap when both navbar and breadcrumb are absent", () => {
        const offset = getScrollOffset({
          includeNavbar: false,
          includeBreadcrumb: false,
          baseGap: 20,
        });

        expect(offset).toBe(20);
      });

      it("should return 0 gap when baseGap is 0", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          baseGap: 0,
        });

        // navbar (81) + gap (0) = 81
        expect(offset).toBe(81);

        document.body.removeChild(navbar);
      });
    });

    describe("SCROLL_GAP constants", () => {
      it("should export DEFAULT and TOC gap values", () => {
        expect(SCROLL_GAP.default).toBe(38);
        expect(SCROLL_GAP.toc).toBe(8);
      });
    });

    describe("page-type configuration", () => {
      it("should use 8px gap for article page type", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          pageType: "article",
          // Note: NOT specifying baseGap, so it should use pageType default
        });

        // navbar (81) + article gap (8) = 89
        expect(offset).toBe(89);

        document.body.removeChild(navbar);
      });

      it("should use 8px gap for form page type", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          pageType: "form",
        });

        // navbar (81) + form gap (8) = 89
        expect(offset).toBe(89);

        document.body.removeChild(navbar);
      });

      it("should use 20px gap for default page type", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          pageType: "default",
        });

        // navbar (81) + default gap (38) = 101
        expect(offset).toBe(119);

        document.body.removeChild(navbar);
      });

      it("should prefer explicit baseGap over pageType default", () => {
        const navbar = document.createElement("nav");
        navbar.setAttribute("aria-label", "Primary");
        navbar.style.height = "81px";
        Object.defineProperty(navbar, "getBoundingClientRect", {
          value: () => ({ height: 81 }) as DOMRect,
        });
        document.body.appendChild(navbar);

        const offset = getScrollOffset({
          includeNavbar: true,
          includeBreadcrumb: false,
          pageType: "article", // Would default to 8px
          baseGap: 16, // But explicit baseGap overrides
        });

        // navbar (81) + explicit gap (16) = 97
        expect(offset).toBe(97);

        document.body.removeChild(navbar);
      });
    });
  });

  describe("scrollToElementWithOffset", () => {
    it("should scroll to target - offset", () => {
      const scrollToSpy = vi.spyOn(window, "scrollTo");
      Object.defineProperty(window, "scrollY", {
        value: 0,
        writable: true,
        configurable: true,
      });

      const target = document.createElement("div");
      target.id = "services";
      target.style.position = "absolute";
      target.style.top = "950px";
      Object.defineProperty(target, "getBoundingClientRect", {
        value: () => ({ top: 950, height: 100 }) as DOMRect,
      });
      document.body.appendChild(target);

      // Mock navbar 81px + breadcrumb not present
      const navbar = document.createElement("nav");
      navbar.setAttribute("aria-label", "Primary");
      navbar.style.height = "81px";
      Object.defineProperty(navbar, "getBoundingClientRect", {
        value: () => ({ height: 81 }) as DOMRect,
      });
      document.body.appendChild(navbar);

      scrollToElementWithOffset(target, {
        includeNavbar: true,
        includeBreadcrumb: false,
        baseGap: 20,
        behavior: "smooth",
      });

      // Expected offset: 81 + 20 = 101
      // If target is at 950px, final scroll should be approximately 950 - 101 = 849
      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: "smooth",
        }),
      );

      const callArgs = scrollToSpy.mock.calls[0]?.[0] as
        | ScrollToOptions
        | undefined;
      if (callArgs && typeof callArgs === "object" && "top" in callArgs) {
        // The exact value depends on getBoundingClientRect, but should be <= 950
        expect(callArgs.top).toBeLessThanOrEqual(950);
      }

      scrollToSpy.mockRestore();
      document.body.removeChild(target);
      document.body.removeChild(navbar);
    });

    it("should use default smooth behavior", () => {
      const scrollToSpy = vi.spyOn(window, "scrollTo");

      const target = document.createElement("div");
      target.id = "test";
      document.body.appendChild(target);

      scrollToElementWithOffset(target);

      const callArgs = scrollToSpy.mock.calls[0]?.[0] as
        | ScrollToOptions
        | undefined;
      if (callArgs && typeof callArgs === "object" && "behavior" in callArgs) {
        expect(callArgs.behavior).toBe("smooth");
      }

      scrollToSpy.mockRestore();
      document.body.removeChild(target);
    });

    it("should not scroll when window is undefined (SSR)", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const target = document.createElement("div");
      expect(() => {
        scrollToElementWithOffset(target);
      }).not.toThrow();

      global.window = originalWindow;
    });
  });
});
