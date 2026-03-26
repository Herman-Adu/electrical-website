export type ProjectStatus = "planned" | "in-progress" | "completed";

export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards";

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

export interface Project {
  id: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: string;
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
  categoryLabel: string;
  status: ProjectStatus;
  isFeatured: boolean;
  location: string;
  updatedAt: string;
}
