export type TimelineVariant = "story" | "status" | "list";

export type TimelineSource = "company" | "project" | "news";

export type TimelineStatus = "completed" | "in-progress" | "upcoming";

export interface TimelineItem {
  id: string;
  source: TimelineSource;
  variant: TimelineVariant;
  order: number;
  label: string;
  title: string;
  description: string;
  duration?: string;
  status?: TimelineStatus;
  year?: string;
  highlight: boolean;
}

export interface TimelineSectionData {
  source: TimelineSource;
  variant: TimelineVariant;
  anchorId: string;
  items: TimelineItem[];
}

export interface CompanyTimelineMilestoneInput {
  year: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface TimelineGeometrySample {
  top: number;
  height: number;
}

export interface TimelineProgressCalibrationInput {
  fixedHeaderHeight: number;
  viewportHeight: number;
  baseStartPercent?: number;
  baseEndPercent?: number;
}

export interface TimelineScrollOffsetPercent {
  startPercent: number;
  endPercent: number;
}
