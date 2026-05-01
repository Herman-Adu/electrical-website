import type { Project } from "@/types/projects";

export interface WorkType {
  slug: string;
  label: string;
  tags: string[];
}

export const workTypes: WorkType[] = [
  {
    slug: "power-boards",
    label: "Power Boards",
    tags: ["Switchgear", "Distribution", "Board", "3-Phase"],
  },
  {
    slug: "lighting",
    label: "Commercial Lighting",
    tags: ["LED", "Lighting", "Luminaire", "CIBSE"],
  },
  {
    slug: "office-fitout",
    label: "Office Fitout",
    tags: ["Cat B", "Fit-Out", "Retail"],
  },
  {
    slug: "three-phase",
    label: "3-Phase",
    tags: ["3-Phase", "High Voltage", "11kV", "33kV"],
  },
  {
    slug: "emergency",
    label: "Emergency Systems",
    tags: ["Emergency", "Fire", "Safety", "BS 5839"],
  },
];

export function getProjectsByWorkType(
  slug: string,
  projects: Project[]
): Project[] {
  const workType = workTypes.find((wt) => wt.slug === slug);
  if (!workType) return [];
  return projects.filter((p) =>
    p.tags.some((tag) => workType.tags.includes(tag))
  );
}

export function getWorkTypeBySlug(slug: string): WorkType | undefined {
  return workTypes.find((wt) => wt.slug === slug);
}
