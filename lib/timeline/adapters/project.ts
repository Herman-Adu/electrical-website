import {
  projectTimelineSourceSchema,
  timelineSectionDataSchema,
} from "@/lib/schemas/timeline";
import type { ProjectTimelinePhase } from "@/types/projects";
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

export function adaptProjectTimeline(
  phases: readonly ProjectTimelinePhase[],
): TimelineSectionData {
  try {
    const parsedPhases = projectTimelineSourceSchema.parse(phases);

    return timelineSectionDataSchema.parse({
      source: "project",
      variant: "status",
      anchorId: "timeline",
      items: parsedPhases.map((phase, index) => ({
        id: createTimelineId(
          "project",
          normalizeTimelineText(phase.phase),
          normalizeTimelineText(phase.title),
          index,
        ),
        source: "project",
        variant: "status",
        order: index,
        label: normalizeTimelineText(phase.phase),
        title: normalizeTimelineText(phase.title),
        description: normalizeTimelineText(phase.description),
        duration: normalizeTimelineText(phase.duration),
        status: phase.status,
        highlight: false,
      })),
    });
  } catch (error) {
    throw new TimelineAdapterError("project", error);
  }
}
