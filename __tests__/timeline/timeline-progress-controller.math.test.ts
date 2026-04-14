import { describe, expect, it } from "vitest";
import {
  createGeometryThresholdsFromSamples,
  createLinearThresholds,
  createTimelineScrollOffsetPercent,
  getTimelineNodeState,
  toTimelineScrollOffset,
} from "@/lib/timeline/progress-controller";

describe("timeline progress controller math", () => {
  it("creates linear thresholds for a known item count", () => {
    expect(createLinearThresholds(1)).toEqual([0.5]);
    expect(createLinearThresholds(3)).toEqual([0, 0.5, 1]);
  });

  it("derives geometry thresholds that stay ordered and clamped", () => {
    const thresholds = createGeometryThresholdsFromSamples(600, [
      { top: 0, height: 40 },
      { top: 220, height: 40 },
      { top: 520, height: 60 },
    ]);

    expect(thresholds).toHaveLength(3);
    expect(thresholds[0]).toBeGreaterThanOrEqual(0);
    expect(thresholds[2]).toBeLessThanOrEqual(1);
    expect(thresholds[0] ?? 0).toBeLessThan(thresholds[1] ?? 0);
    expect(thresholds[1] ?? 0).toBeLessThan(thresholds[2] ?? 0);
  });

  it("falls back to linear thresholds for near-zero timeline height", () => {
    expect(
      createGeometryThresholdsFromSamples(0, [
        { top: 0, height: 40 },
        { top: 80, height: 40 },
      ]),
    ).toEqual([0, 1]);
  });

  it("calibrates scroll offsets with fixed header share and keeps bounds", () => {
    const calibrated = createTimelineScrollOffsetPercent({
      fixedHeaderHeight: 180,
      viewportHeight: 900,
    });

    expect(calibrated.startPercent).toBeCloseTo(0.95, 5);
    expect(calibrated.endPercent).toBeCloseTo(0.42, 5);
    expect(toTimelineScrollOffset(calibrated)).toEqual([
      "start 95%",
      "end 42%",
    ]);
  });

  it("maps final-node progress state to active at end of section", () => {
    expect(getTimelineNodeState(1, 0.9, undefined)).toBe("active");
    expect(getTimelineNodeState(1, 0.2, 0.6)).toBe("completed");
  });
});
