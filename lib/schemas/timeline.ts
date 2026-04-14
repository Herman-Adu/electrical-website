import { z } from "zod";

const boundedText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

export const timelineVariantSchema = z.enum(["story", "status", "list"]);
export const timelineSourceSchema = z.enum(["company", "project", "news"]);
export const timelineStatusSchema = z.enum([
  "completed",
  "in-progress",
  "upcoming",
]);

export const timelineItemSchema = z
  .object({
    id: boundedText(120),
    source: timelineSourceSchema,
    variant: timelineVariantSchema,
    order: z.number().int().nonnegative(),
    label: boundedText(64),
    title: boundedText(160),
    description: boundedText(3000),
    duration: boundedText(64).optional(),
    status: timelineStatusSchema.optional(),
    year: boundedText(16).optional(),
    highlight: z.boolean().default(false),
  })
  .strict();

export const timelineSectionDataSchema = z
  .object({
    source: timelineSourceSchema,
    variant: timelineVariantSchema,
    anchorId: boundedText(64).default("timeline"),
    items: z.array(timelineItemSchema).max(40),
  })
  .strict();

export const companyTimelineSourceItemSchema = z
  .object({
    year: boundedText(16),
    title: boundedText(160),
    desc: boundedText(3000),
    highlight: z.boolean().optional(),
  })
  .passthrough();

export const companyTimelineSourceSchema = z.array(
  companyTimelineSourceItemSchema,
);

export const projectTimelineSourceItemSchema = z
  .object({
    phase: boundedText(64),
    title: boundedText(160),
    description: boundedText(3000),
    duration: boundedText(64),
    status: timelineStatusSchema,
  })
  .passthrough();

export const projectTimelineSourceSchema = z.array(
  projectTimelineSourceItemSchema,
);

export const newsTimelineSourceItemSchema = z
  .object({
    phase: boundedText(64),
    title: boundedText(160),
    description: boundedText(3000),
    duration: boundedText(64).optional(),
  })
  .passthrough();

export const newsTimelineSourceSchema = z.array(newsTimelineSourceItemSchema);

export const timelineGeometrySampleSchema = z
  .object({
    top: z.number().finite(),
    height: z.number().finite().nonnegative(),
  })
  .strict();

export const timelineProgressCalibrationInputSchema = z
  .object({
    fixedHeaderHeight: z.number().finite().nonnegative(),
    viewportHeight: z.number().finite().positive(),
    baseStartPercent: z.number().finite().min(0).max(1).optional(),
    baseEndPercent: z.number().finite().min(0).max(1).optional(),
  })
  .strict();

export const timelineScrollOffsetPercentSchema = z
  .object({
    startPercent: z.number().finite().min(0).max(1),
    endPercent: z.number().finite().min(0).max(1),
  })
  .strict();

export type TimelineItemParsed = z.infer<typeof timelineItemSchema>;
export type TimelineSectionDataParsed = z.infer<
  typeof timelineSectionDataSchema
>;
export type TimelineGeometrySampleParsed = z.infer<
  typeof timelineGeometrySampleSchema
>;
export type TimelineProgressCalibrationInputParsed = z.infer<
  typeof timelineProgressCalibrationInputSchema
>;
export type TimelineScrollOffsetPercentParsed = z.infer<
  typeof timelineScrollOffsetPercentSchema
>;
