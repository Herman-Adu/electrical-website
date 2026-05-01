"use client";

import { useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const handleSelect = (slug: string) => {
    startTransition(() => {
      setActiveSlug(slug);
    });
  };

  const filtered =
    activeSlug === "all"
      ? items
      : items.filter((p) => p.category === activeSlug);

  const activeCategoryLabel =
    activeSlug === "all"
      ? "All"
      : (sectors.find((s) => s.slug === activeSlug)?.label ?? "All");

  return (
    <>
      <ProjectFilterBar
        categories={sectors}
        activeSlug={activeSlug}
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
