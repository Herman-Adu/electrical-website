"use client";

import { useEffect, useState, type RefObject } from "react";
import {
  timelineGeometrySampleSchema,
  timelineProgressCalibrationInputSchema,
  timelineScrollOffsetPercentSchema,
} from "@/lib/schemas/timeline";
import { getScrollOffset } from "@/lib/scroll-to-section";
import type {
  TimelineGeometrySample,
  TimelineProgressCalibrationInput,
  TimelineScrollOffsetPercent,
} from "@/types/timeline";

export type TimelineScrollOffset = [string, string];
export type TimelineNodeState = "upcoming" | "active" | "completed";

const DEFAULT_START_PERCENT = 0.78;
const DEFAULT_END_PERCENT = 0.22;
const MIN_START_PERCENT = 0.05;
const MAX_START_PERCENT = 0.95;

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function applyTopWeightedActivationBias(normalized: number) {
  const topWeight = (1 - normalized) ** 2;
  const bias = 0.16 * topWeight;
  return clamp01(normalized + bias);
}

export function createLinearThresholds(total: number) {
  if (total <= 1) {
    return [0.5];
  }

  return Array.from({ length: total }, (_, index) => index / (total - 1));
}

export function createGeometryThresholdsFromSamples(
  timelineHeight: number,
  nodeSamples: readonly TimelineGeometrySample[],
) {
  if (timelineHeight < 1) {
    return createLinearThresholds(nodeSamples.length);
  }

  const validatedSamples = nodeSamples.map((sample) =>
    timelineGeometrySampleSchema.parse(sample),
  );

  return validatedSamples.map((sample) => {
    const center = sample.top + sample.height / 2;
    const normalized = clamp01(center / timelineHeight);
    return applyTopWeightedActivationBias(normalized);
  });
}

export function createGeometryThresholdsFromElements(
  timelineElement: HTMLElement,
  nodeElements: readonly HTMLElement[],
) {
  const timelineRect = timelineElement.getBoundingClientRect();
  const nodeSamples: TimelineGeometrySample[] = nodeElements.map(
    (nodeElement) => {
      const nodeRect = nodeElement.getBoundingClientRect();
      return {
        top: nodeRect.top - timelineRect.top,
        height: nodeRect.height,
      };
    },
  );

  return createGeometryThresholdsFromSamples(timelineRect.height, nodeSamples);
}

export function createTimelineScrollOffsetPercent(
  input: TimelineProgressCalibrationInput,
): TimelineScrollOffsetPercent {
  const parsedInput = timelineProgressCalibrationInputSchema.parse(input);
  const baseStartPercent =
    parsedInput.baseStartPercent ?? DEFAULT_START_PERCENT;
  const baseEndPercent = parsedInput.baseEndPercent ?? DEFAULT_END_PERCENT;

  const headerShare =
    parsedInput.viewportHeight > 0
      ? parsedInput.fixedHeaderHeight / parsedInput.viewportHeight
      : 0;

  const calibrated = timelineScrollOffsetPercentSchema.parse({
    startPercent: Math.min(
      MAX_START_PERCENT,
      Math.max(MIN_START_PERCENT, baseStartPercent + headerShare),
    ),
    endPercent: Math.min(
      MAX_START_PERCENT,
      Math.max(MIN_START_PERCENT, baseEndPercent + headerShare),
    ),
  });

  return calibrated;
}

export function toTimelineScrollOffset(
  offsets: TimelineScrollOffsetPercent,
): TimelineScrollOffset {
  return [
    `start ${Math.round(offsets.startPercent * 100)}%`,
    `end ${Math.round(offsets.endPercent * 100)}%`,
  ];
}

export function getFixedHeaderHeight() {
  if (typeof window === "undefined") {
    return 0;
  }

  return getScrollOffset({
    includeNavbar: true,
    includeBreadcrumb: true,
    baseGap: 0,
    extraOffset: 0,
  });
}

export function getTimelineNodeState(
  progress: number,
  trigger: number,
  nextTrigger?: number,
): TimelineNodeState {
  if (progress < trigger) {
    return "upcoming";
  }

  if (nextTrigger === undefined || progress < nextTrigger) {
    return "active";
  }

  return "completed";
}

interface UseTimelineProgressControllerInput {
  timelineRef: RefObject<HTMLElement | null>;
  nodeRefs: RefObject<(HTMLElement | null)[]>;
  itemCount: number;
  enabled?: boolean;
}

interface UseTimelineProgressControllerResult {
  thresholds: number[];
  scrollOffsets: TimelineScrollOffset;
}

export function useTimelineProgressController({
  timelineRef,
  nodeRefs,
  itemCount,
  enabled = true,
}: UseTimelineProgressControllerInput): UseTimelineProgressControllerResult {
  const [thresholds, setThresholds] = useState<number[]>(() =>
    createLinearThresholds(itemCount),
  );
  const [scrollOffsets, setScrollOffsets] = useState<TimelineScrollOffset>([
    "start 78%",
    "end 22%",
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timelineElement = timelineRef.current;
    const nodeElements = nodeRefs.current.filter(
      (nodeElement): nodeElement is HTMLElement => nodeElement !== null,
    );

    if (!timelineElement || nodeElements.length !== itemCount) {
      return;
    }

    const recalculateThresholds = () => {
      setThresholds(
        createGeometryThresholdsFromElements(timelineElement, nodeElements),
      );
    };

    const recalculateOffsets = () => {
      const viewportHeight =
        typeof window !== "undefined" && window.innerHeight > 0
          ? window.innerHeight
          : 900;

      setScrollOffsets(
        toTimelineScrollOffset(
          createTimelineScrollOffsetPercent({
            fixedHeaderHeight: getFixedHeaderHeight(),
            viewportHeight,
          }),
        ),
      );
    };

    recalculateThresholds();
    recalculateOffsets();

    const resizeObserver = new ResizeObserver(() => {
      recalculateThresholds();
      recalculateOffsets();
    });

    resizeObserver.observe(timelineElement);
    nodeElements.forEach((nodeElement) => resizeObserver.observe(nodeElement));

    const handleResize = () => {
      recalculateThresholds();
      recalculateOffsets();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, itemCount, nodeRefs, timelineRef]);

  return {
    thresholds,
    scrollOffsets,
  };
}
