import type { Metadata } from "next";
import { createStandardPageMetadata } from "@/lib/metadata";
import type { Project } from "@/types/projects";

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
