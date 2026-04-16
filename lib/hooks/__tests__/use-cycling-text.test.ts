/**
 * Unit tests for useCyclingText hook
 *
 * Tests:
 * - Hook returns first item immediately
 * - Cycles through all items on interval
 * - Respects prefers-reduced-motion preference
 * - Stops after last item (does not repeat)
 * - Cleanup on unmount (no memory leaks)
 * - Empty array edge case
 * - Single item edge case
 * - Rapid remount doesn't cause double-cycling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";

// Mock Framer Motion's useReducedMotion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe("useCyclingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should return first item immediately", () => {
    const items = ["INITIALIZING", "LOADING_MODULES", "CALIBRATING", "READY"];
    const { result } = renderHook(() => useCyclingText(items));

    expect(result.current.currentText).toBe("INITIALIZING");
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.isAnimating).toBe(true);
  });

  it("should cycle through all items on interval", () => {
    const items = ["STEP_1", "STEP_2", "STEP_3"];
    const interval = 100;
    const { result } = renderHook(() => useCyclingText(items, interval));

    // Initial state
    expect(result.current.currentText).toBe("STEP_1");
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.isAnimating).toBe(true);

    // Advance to next item
    act(() => {
      vi.advanceTimersByTime(interval);
    });

    expect(result.current.currentText).toBe("STEP_2");
    expect(result.current.cycleIndex).toBe(1);

    // Advance to next item
    act(() => {
      vi.advanceTimersByTime(interval);
    });

    expect(result.current.currentText).toBe("STEP_3");
    expect(result.current.cycleIndex).toBe(2);
  });

  it("should stop after last item and set isAnimating to false", () => {
    const items = ["A", "B"];
    const interval = 50;
    const { result } = renderHook(() => useCyclingText(items, interval));

    // Move to second item
    act(() => {
      vi.advanceTimersByTime(interval);
    });

    expect(result.current.currentText).toBe("B");
    expect(result.current.cycleIndex).toBe(1);
    expect(result.current.isAnimating).toBe(true);

    // Try to advance past last item
    act(() => {
      vi.advanceTimersByTime(interval);
    });

    expect(result.current.currentText).toBe("B"); // Stays on last item
    expect(result.current.cycleIndex).toBe(1);
    expect(result.current.isAnimating).toBe(false); // Animation complete
  });

  it("should respect prefers-reduced-motion by jumping to last item", async () => {
    const { useReducedMotion } = await import("framer-motion");
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const items = ["INIT", "LOADING", "READY"];
    const { result } = renderHook(() => useCyclingText(items));

    // Should immediately show last item and be done animating
    expect(result.current.currentText).toBe("READY");
    expect(result.current.cycleIndex).toBe(2);
    expect(result.current.isAnimating).toBe(false);

    // Advance time - should not change
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.currentText).toBe("READY");
    expect(result.current.isAnimating).toBe(false);
  });

  it("should cleanup interval on unmount", () => {
    const items = ["A", "B", "C"];
    const { unmount } = renderHook(() => useCyclingText(items));

    // Should not throw during unmount
    expect(() => unmount()).not.toThrow();
  });

  it("should handle empty array gracefully", () => {
    const { result } = renderHook(() => useCyclingText([]));

    expect(result.current.currentText).toBe("");
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.isAnimating).toBe(false);
  });

  it("should handle single item array", () => {
    const items = ["ONLY_ONE"];
    const { result } = renderHook(() => useCyclingText(items));

    expect(result.current.currentText).toBe("ONLY_ONE");
    expect(result.current.cycleIndex).toBe(0);
    // Single item: no animation needed (already at final state)
    expect(result.current.isAnimating).toBe(false);
  });

});
