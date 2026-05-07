"use client";

import { useSearchParams } from "next/navigation";
import { ProjectsListSection } from "@/components/projects/projects-list-section";
import { VALID_SLUGS } from "@/components/projects/project-category-slider";
import type { ProjectListItemExtended, SidebarCard } from "@/types/shared-content";

interface ProjectsFilterClientProps {
  items: ProjectListItemExtended[];
  sidebarCards: SidebarCard[];
  counts: Record<string, number>;
}

export function ProjectsFilterClient({
  items,
  sidebarCards,
  counts,
}: ProjectsFilterClientProps) {
  const searchParams = useSearchParams();
  const rawCategory = searchParams?.get("category") ?? null;
  const activeSlug = VALID_SLUGS.has(rawCategory as never) ? rawCategory! : "all";

  const filtered =
    activeSlug === "all"
      ? items
      : items.filter((p) => p.category === activeSlug);

  return (
    <ProjectsListSection
      items={filtered}
      sidebarCards={sidebarCards}
    />
  );
}
