import type {
  Project,
  ProjectBentoItem,
  ProjectCategory,
  ProjectCategorySlug,
  ProjectListItem,
} from "@/types/projects";

export const projectCategories: ProjectCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description: "Home and domestic electrical delivery projects.",
  },
  {
    slug: "commercial-lighting",
    label: "Commercial Lighting",
    description:
      "Retail, office, and mixed-use lighting modernisation projects.",
  },
  {
    slug: "power-boards",
    label: "Power Boards",
    description:
      "Distribution, switchgear, and board upgrade infrastructure projects.",
  },
];

export function isProjectCategorySlug(
  value: string,
): value is Exclude<ProjectCategorySlug, "all"> {
  return projectCategories.some((category) => category.slug === value);
}

export const allProjects: Project[] = [
  {
    id: "proj-001",
    slug: "west-dock-industrial-upgrade",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "West Dock Industrial Upgrade",
    clientSector: "Industrial",
    status: "in-progress",
    description:
      "High-capacity electrical infrastructure refresh for a multi-unit logistics and manufacturing dock, including modernized switchgear and resilience improvements.",
    coverImage: {
      src: "/images/services-industrial.jpg",
      alt: "Industrial dock electrical infrastructure upgrade",
    },
    kpis: {
      budget: "£1.2M",
      timeline: "9 months",
      capacity: "11kV",
      location: "London Docklands",
    },
    tags: ["Switchgear", "Resilience", "High Voltage"],
    progress: 68,
    isFeatured: true,
    publishedAt: "2026-01-08T09:00:00.000Z",
    updatedAt: "2026-03-20T14:10:00.000Z",
  },
  {
    id: "proj-002",
    slug: "riverside-commercial-retrofit",
    category: "commercial-lighting",
    categoryLabel: "Commercial Lighting",
    title: "Riverside Commercial Retrofit",
    clientSector: "Commercial",
    status: "completed",
    description:
      "Energy-efficient lighting, smart controls, and distribution modernization for a mixed-use office and retail complex.",
    coverImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "Commercial building lighting and controls retrofit",
    },
    kpis: {
      budget: "£680K",
      timeline: "5 months",
      capacity: "440V",
      location: "Canary Wharf",
    },
    tags: ["Lighting", "Smart Controls", "Efficiency"],
    progress: 100,
    isFeatured: false,
    publishedAt: "2025-11-03T09:00:00.000Z",
    updatedAt: "2026-02-12T11:20:00.000Z",
  },
  {
    id: "proj-003",
    slug: "north-estate-residential-phase-2",
    category: "residential",
    categoryLabel: "Residential",
    title: "North Estate Residential Phase 2",
    clientSector: "Residential",
    status: "in-progress",
    description:
      "Second-phase domestic distribution, EV charging readiness, and smart-home backbone for a high-density new-build estate.",
    coverImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Residential development electrical installation",
    },
    kpis: {
      budget: "£430K",
      timeline: "6 months",
      capacity: "230V",
      location: "Croydon",
    },
    tags: ["EV Ready", "Smart Home", "New Build"],
    progress: 41,
    isFeatured: false,
    publishedAt: "2026-02-01T09:00:00.000Z",
    updatedAt: "2026-03-22T08:35:00.000Z",
  },
  {
    id: "proj-004",
    slug: "city-hospital-emergency-power-ring",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "City Hospital Emergency Power Ring",
    clientSector: "Critical Infrastructure",
    status: "planned",
    description:
      "Emergency and backup power ring enhancement project designed to reduce failover latency for critical hospital systems.",
    coverImage: {
      src: "/images/power-distribution.jpg",
      alt: "Emergency backup power planning",
    },
    kpis: {
      budget: "£2.1M",
      timeline: "12 months",
      capacity: "33kV",
      location: "Central London",
    },
    tags: ["Emergency Power", "Redundancy", "Critical Systems"],
    progress: 8,
    isFeatured: false,
    publishedAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-23T12:40:00.000Z",
  },
];

export const projectBentoItems: ProjectBentoItem[] = [
  {
    id: "metric-1",
    title: "Active Projects",
    value: "12",
    description:
      "Across commercial, industrial, and critical infrastructure sectors.",
  },
  {
    id: "metric-2",
    title: "Average Delivery",
    value: "94%",
    description:
      "Projects delivered on or ahead of contract milestone schedules.",
  },
  {
    id: "metric-3",
    title: "Combined Capacity",
    value: "78kV",
    description:
      "Total installed and maintained capacity in current active portfolio.",
  },
  {
    id: "metric-4",
    title: "Safety Record",
    value: "0 LTIs",
    description:
      "Zero lost-time incidents in the last 24 months of project delivery.",
  },
];

const projectListItems: ProjectListItem[] = allProjects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  category: project.category,
  categoryLabel: project.categoryLabel,
  status: project.status,
  isFeatured: project.isFeatured,
  location: project.kpis.location,
  updatedAt: project.updatedAt,
}));

const projectsBySlug: Partial<Record<Project["slug"], Project>> =
  Object.fromEntries(allProjects.map((project) => [project.slug, project]));

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsBySlug[slug];
}

export function getProjectSlugs(): Project["slug"][] {
  return allProjects.map((project) => project.slug);
}

export function getProjectsByCategory(
  category: ProjectCategorySlug,
): Project[] {
  if (category === "all") return allProjects;
  return allProjects.filter((project) => project.category === category);
}

export function getFeaturedProjectByCategory(
  category: ProjectCategorySlug,
): Project | undefined {
  const scoped = getProjectsByCategory(category);
  return scoped.find((project) => project.isFeatured) ?? scoped[0];
}

export function getProjectListItemsByCategory(
  category: ProjectCategorySlug,
): ProjectListItem[] {
  if (category === "all") return projectListItems;
  return projectListItems.filter((item) => item.category === category);
}

export function getCategoryBySlug(slug: string): ProjectCategory | undefined {
  return projectCategories.find((category) => category.slug === slug);
}

export function getCategorySlugs(): Exclude<ProjectCategorySlug, "all">[] {
  return projectCategories.map((category) => category.slug);
}

export function getProjectByCategoryAndSlug(
  categorySlug: Exclude<ProjectCategorySlug, "all">,
  projectSlug: Project["slug"],
): Project | undefined {
  return allProjects.find(
    (project) =>
      project.category === categorySlug && project.slug === projectSlug,
  );
}

export function getProjectSlugsByCategory(
  categorySlug: Exclude<ProjectCategorySlug, "all">,
): Project["slug"][] {
  return allProjects
    .filter((project) => project.category === categorySlug)
    .map((project) => project.slug);
}
