export type ProjectStatus = "planned" | "in-progress" | "completed";

export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards"
  | "community"
  | "commercial";

export interface ProjectCategory {
  slug: Exclude<ProjectCategorySlug, "all">;
  label: string;
  description: string;
}

export interface ProjectKpis {
  budget: string;
  timeline: string;
  capacity: string;
  location: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

// =============================================================================
// PROJECT DETAIL CONTENT TYPES
// =============================================================================

export interface ProjectIntroData {
  /** Label above headline (e.g., "Project Overview") */
  label: string;
  /** Animated headline words */
  headlineWords: string[];
  /** Lead paragraph */
  leadParagraph: string;
  /** Two-column body paragraphs */
  bodyParagraphs?: string[];
  /** Three pillars with numbered highlights */
  pillars?: {
    num: string;
    title: string;
    description: string;
  }[];
}

export interface ProjectTimelinePhase {
  phase: string;
  title: string;
  description: string;
  duration: string;
  status: "completed" | "in-progress" | "upcoming";
}

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: ProjectImage;
}

export interface ProjectScope {
  icon:
    | "Zap"
    | "Shield"
    | "Settings"
    | "Lightbulb"
    | "Gauge"
    | "Wrench"
    | "CheckCircle"
    | "Award"
    | "Battery"
    | "Network"
    | "Building"
    | "Layers"
    | "LayoutGrid"
    | "Car"
    | "Building2"
    | "Cable"
    | "Warehouse"
    | "Thermometer";
  title: string;
  description: string;
}

export interface ProjectNarrativeBlock {
  position:
    | "after-intro"
    | "after-scope"
    | "after-challenge"
    | "after-timeline"
    | "after-gallery";
  heading?: string;
  paragraphs: string[];
  background?: "default" | "muted";
}

export interface ProjectDetailContent {
  /** Project-specific intro section */
  intro: ProjectIntroData;
  /** Timeline phases */
  timeline?: ProjectTimelinePhase[];
  /** Gallery images */
  gallery?: ProjectGalleryImage[];
  /** Client testimonial */
  testimonial?: ProjectTestimonial;
  /** Scope of work items */
  scope?: ProjectScope[];
  /** Challenge and solution narrative */
  challenge?: string;
  solution?: string;
  narrativeBlocks?: ProjectNarrativeBlock[];
}

// =============================================================================
// MAIN PROJECT INTERFACE
// =============================================================================

export interface Project {
  id: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: ProjectCategory["label"];
  title: string;
  clientSector: string;
  status: ProjectStatus;
  description: string;
  coverImage: ProjectImage;
  kpis: ProjectKpis;
  tags: string[];
  progress: number;
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
  /** Extended detail content for project pages */
  detail?: ProjectDetailContent;
}

export interface ProjectBentoItem {
  id: string;
  title: string;
  value: string;
  description: string;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: ProjectCategory["label"];
  status: ProjectStatus;
  isFeatured: boolean;
  location: string;
  updatedAt: string;
}
