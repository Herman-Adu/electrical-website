"use client";

import { useState, useOptimistic, useTransition } from "react";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import { ProjectsListSection } from "@/components/projects/projects-list-section";
import type { ProjectCategory } from "@/types/projects";
import type { ProjectListItemExtended, SidebarCard } from "@/types/shared-content";

interface ProjectsFilterClientProps {
  sectors: ProjectCategory[];
  items: ProjectListItemExtended[];
  sidebarCards: SidebarCard[];
  counts: Record<string, number>;
}

export function ProjectsFilterClient({
  sectors,
  items,
  sidebarCards,
  counts,
}: ProjectsFilterClientProps) {
  const [activeSlug, setActiveSlug] = useState("all");
  const [optimisticSlug, setOptimisticSlug] = useOptimistic(
    activeSlug,
    (_, s: string) => s,
  );
  const [isPending, startTransition] = useTransition();

  const handleSelect = (slug: string) => {
    startTransition(() => {
      setOptimisticSlug(slug);
      setActiveSlug(slug);
    });
  };

  const filtered =
    optimisticSlug === "all"
      ? items
      : items.filter((p) => p.category === optimisticSlug);

  const activeCategoryLabel =
    optimisticSlug === "all"
      ? "All"
      : (sectors.find((s) => s.slug === optimisticSlug)?.label ?? "All");

  return (
    <>
      <ProjectFilterBar
        categories={sectors}
        activeSlug={optimisticSlug}
        counts={counts}
        onSelect={handleSelect}
      />
      <div
        className={
          isPending ? "opacity-60 transition-opacity" : "transition-opacity"
        }
      >
        <ProjectsListSection
          items={filtered}
          sidebarCards={sidebarCards}
          activeCategoryLabel={activeCategoryLabel}
        />
      </div>
    </>
  );
}
