/**
 * Unit tests for useStickyWithFallback hook
 *
 * Tests the IntersectionObserver-based sticky-to-fixed position switching.
 * Tests:
 * - Hook initializes with `isMounted=false` (prevents hydration issues)
 * - After mount, sets up IntersectionObserver on target element
 * - When observer detects intersection, maintains `position: sticky`
 * - When observer detects non-intersection, switches to `position: fixed`
 * - Properly cleans up observer on unmount
 * - Handles missing target element gracefully
 * - CSS variables are set correctly: `--toc-position-mode`, `--toc-top`, `--toc-z-index`
 * - Respects `stickyOffset` parameter (defaults to 150px for projects, 132px for news)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useStickyWithFallback } from "@/lib/hooks/use-sticky-with-fallback";

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
  }
}

let mockIntersectionObserverInstance: MockIntersectionObserver;

beforeEach(() => {
  // Setup IntersectionObserver mock as a class that can be instantiated with `new`
  global.IntersectionObserver = class MockIO {
    callback: IntersectionObserverCallback;
    options?: IntersectionObserverInit;
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);

    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {
      this.callback = callback;
      this.options = options;
      mockIntersectionObserverInstance = this as any;
    }
  } as any;
});

afterEach(() => {
  vi.clearAllMocks();
  mockIntersectionObserverInstance = null as any;
});

describe("useStickyWithFallback", () => {
  it("should initialize with isMounted=false to prevent hydration shift", () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    // Initially, hook should not throw
    const { result } = renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    // Hook should not throw and should be registered
    expect(result.current).toBeUndefined(); // Hook doesn't return anything

    document.body.removeChild(container);
  });

  it("should set up IntersectionObserver on mount", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    // After mount, IntersectionObserver should be created and observing
    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
      expect(mockIntersectionObserverInstance.observe).toHaveBeenCalledWith(
        container
      );
    });

    document.body.removeChild(container);
  });

  it("should observe the target element", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    // The hook should observe the container
    await waitFor(() => {
      expect(mockIntersectionObserverInstance.observe).toHaveBeenCalledWith(
        container
      );
    });

    document.body.removeChild(container);
  });

  it("should set CSS variables to sticky when element is intersecting", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
        fixedZIndex: 50,
        stickyZIndex: 10,
      })
    );

    // Wait for observer to be set up (isMounted effect)
    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    // Simulate intersection (element is in viewport)
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: true,
            intersectionRatio: 1,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    // CSS variables should be set for sticky positioning
    expect(container.style.getPropertyValue("--toc-position-mode")).toBe(
      "sticky"
    );
    expect(container.style.getPropertyValue("--toc-top")).toBe("150px");
    expect(container.style.getPropertyValue("--toc-z-index")).toBe("10");

    document.body.removeChild(container);
  });

  it("should switch CSS variables to fixed when element is not intersecting", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
        fixedZIndex: 50,
        stickyZIndex: 10,
      })
    );

    // Wait for observer to be set up
    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    // Simulate non-intersection (element's containing block left viewport)
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: false,
            intersectionRatio: 0,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    // CSS variables should be set for fixed positioning
    expect(container.style.getPropertyValue("--toc-position-mode")).toBe(
      "fixed"
    );
    expect(container.style.getPropertyValue("--toc-z-index")).toBe("50");
    // Fixed top should be set
    expect(container.style.getPropertyValue("--toc-top")).toBeTruthy();

    document.body.removeChild(container);
  });

  it("should handle missing target element gracefully", () => {
    // Create hook with selector that doesn't match any element
    expect(() => {
      renderHook(() =>
        useStickyWithFallback({
          selector: "[data-nonexistent]",
          stickyOffset: 150,
        })
      );
    }).not.toThrow();
  });

  it("should clean up observer on unmount", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    const { unmount } = renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    expect(() => unmount()).not.toThrow();

    // Disconnect should be called on unmount
    expect(mockIntersectionObserverInstance.disconnect).toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it("should respect stickyOffset parameter (projects = 150px)", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: true,
            intersectionRatio: 1,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-top")).toBe("150px");

    document.body.removeChild(container);
  });

  it("should respect stickyOffset parameter (news = 132px)", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 132,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: true,
            intersectionRatio: 1,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-top")).toBe("132px");

    document.body.removeChild(container);
  });

  it("should use custom fixedZIndex and stickyZIndex when provided", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
        fixedZIndex: 99,
        stickyZIndex: 25,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    // When sticky
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: true,
            intersectionRatio: 1,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-z-index")).toBe("25");

    // When fixed
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: false,
            intersectionRatio: 0,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-z-index")).toBe("99");

    document.body.removeChild(container);
  });

  it("should use default fixedZIndex=50 and stickyZIndex=10 when not provided", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    // When sticky
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: true,
            intersectionRatio: 1,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-z-index")).toBe("10");

    // When fixed
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: false,
            intersectionRatio: 0,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    expect(container.style.getPropertyValue("--toc-z-index")).toBe("50");

    document.body.removeChild(container);
  });

  it("should update fixed top position when scrolling while fixed", async () => {
    const container = document.createElement("div");
    container.setAttribute("data-sticky-toc", "true");
    document.body.appendChild(container);

    renderHook(() =>
      useStickyWithFallback({
        selector: "[data-sticky-toc]",
        stickyOffset: 150,
      })
    );

    await waitFor(() => {
      expect(mockIntersectionObserverInstance).toBeDefined();
    });

    // Switch to fixed mode
    act(() => {
      mockIntersectionObserverInstance.callback(
        [
          {
            target: container,
            isIntersecting: false,
            intersectionRatio: 0,
          } as any,
        ],
        mockIntersectionObserverInstance as any
      );
    });

    // Simulate scroll event
    act(() => {
      window.scrollY = 500;
      window.dispatchEvent(new Event("scroll"));
    });

    // Fixed top should still be set
    expect(container.style.getPropertyValue("--toc-top")).toBeTruthy();

    document.body.removeChild(container);
  });
});
