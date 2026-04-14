import {
  newsTimelineSourceSchema,
  timelineSectionDataSchema,
} from "@/lib/schemas/timeline";
import type { NewsTimelineItem } from "@/types/news";
import type { TimelineSectionData } from "@/types/timeline";
import { createTimelineId, TimelineAdapterError } from "./_utils";

const scriptOrStylePattern = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const htmlTagPattern = /<[^>]+>/g;
const whitespacePattern = /\s+/g;

function normalizeTimelineText(value: string): string {
  return value
    .replace(scriptOrStylePattern, " ")
    .replace(htmlTagPattern, " ")
    .replace(whitespacePattern, " ")
    .trim();
}

export function adaptNewsTimeline(
  timeline: readonly NewsTimelineItem[],
): TimelineSectionData {
  try {
    const parsedTimeline = newsTimelineSourceSchema.parse(timeline);

    return timelineSectionDataSchema.parse({
      source: "news",
      variant: "list",
      anchorId: "timeline",
      items: parsedTimeline.map((phase, index) => ({
        id: createTimelineId(
          "news",
          normalizeTimelineText(phase.phase),
          normalizeTimelineText(phase.title),
          index,
        ),
        source: "news",
        variant: "list",
        order: index,
        label: normalizeTimelineText(phase.phase),
        title: normalizeTimelineText(phase.title),
        description: normalizeTimelineText(phase.description),
        duration: phase.duration
          ? normalizeTimelineText(phase.duration)
          : undefined,
        highlight: false,
      })),
    });
  } catch (error) {
    throw new TimelineAdapterError("news", error);
  }
}
