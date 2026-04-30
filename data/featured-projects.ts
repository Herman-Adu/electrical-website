import type { Project } from "@/types/projects";
import { allProjects } from "@/data/projects";

export type FeaturedPlacement = "projectsHero" | "aboutPage" | "servicesPage";

const placementMap: Record<FeaturedPlacement, string> = {
  projectsHero: "proj-dhl-reading-001",
  aboutPage: "proj-medivet-watford-001",
  servicesPage: "proj-ladbrokes-woking-001",
};

export function getFeaturedProjectByPlacement(
  placement: FeaturedPlacement,
): Project | undefined {
  const id = placementMap[placement];
  return allProjects.find((project) => project.id === id);
}
