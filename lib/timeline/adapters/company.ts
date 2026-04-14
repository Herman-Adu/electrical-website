import {
  companyTimelineSourceSchema,
  timelineSectionDataSchema,
} from "@/lib/schemas/timeline";
import type {
  CompanyTimelineMilestoneInput,
  TimelineSectionData,
} from "@/types/timeline";
import { createTimelineId, TimelineAdapterError } from "./_utils";

export function adaptCompanyTimeline(
  milestones: readonly CompanyTimelineMilestoneInput[],
): TimelineSectionData {
  try {
    const parsedMilestones = companyTimelineSourceSchema.parse(milestones);

    return timelineSectionDataSchema.parse({
      source: "company",
      variant: "story",
      anchorId: "timeline",
      items: parsedMilestones.map((milestone, index) => ({
        id: createTimelineId("company", milestone.year, milestone.title, index),
        source: "company",
        variant: "story",
        order: index,
        label: milestone.year,
        title: milestone.title,
        description: milestone.desc,
        year: milestone.year,
        highlight: milestone.highlight ?? false,
      })),
    });
  } catch (error) {
    throw new TimelineAdapterError("company", error);
  }
}
