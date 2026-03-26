import type { Metadata } from "next";
import { createStandardPageMetadata } from "@/lib/metadata";
import type { Project, ProjectCategory } from "@/types/projects";

export function createProjectsListMetadata(): Metadata {
  return createStandardPageMetadata({
    title: "Projects | Nexgen Electrical Innovations",
    description:
      "Explore featured electrical engineering projects across industrial, commercial, and critical infrastructure sectors.",
    path: "/projects",
    keywords: [
      "electrical projects",
      "project portfolio",
      "industrial electrical",
      "commercial electrical",
      "critical infrastructure",
    ],
  });
}

export function createProjectCategoriesMetadata(): Metadata {
  return createStandardPageMetadata({
    title: "Project Categories | Nexgen Electrical Innovations",
    description:
      "Browse our electrical project portfolio by category — residential, commercial lighting, and power board infrastructure.",
    path: "/projects/category",
  });
}

export function createProjectCategoryMetadata(
  category: ProjectCategory,
): Metadata {
  return createStandardPageMetadata({
    title: `${category.label} Projects | Nexgen Electrical Innovations`,
    description: category.description,
    path: `/projects/category/${category.slug}`,
    openGraphTitle: `${category.label} Projects | Nexgen Electrical Innovations`,
    openGraphDescription: category.description,
  });
}

export function createProjectDetailMetadata(
  project: Project,
  canonicalPath = `/projects/category/${project.category}/${project.slug}`,
): Metadata {
  const title = `${project.title} | Projects | Nexgen Electrical Innovations`;
  const description = `${project.description} Sector: ${project.clientSector}. Location: ${project.kpis.location}.`;

  return createStandardPageMetadata({
    title,
    description,
    path: canonicalPath,
    openGraphTitle: title,
    openGraphDescription: description,
    keywords: [...project.tags, project.clientSector, "electrical project"],
  });
}
