"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import type { Project, ProjectCategory } from "@/types/projects";

interface ProjectsListWithFilterProps {
  sectors: ProjectCategory[];
  allProjects: Project[];
}

export function ProjectsListWithFilter({
  sectors,
  allProjects,
}: ProjectsListWithFilterProps) {
  const [activeSlug, setActiveSlug] = useState("all");

  const counts: Record<string, number> = {
    all: allProjects.length,
    ...Object.fromEntries(
      sectors.map((s) => [
        s.slug,
        allProjects.filter((p) => p.category === s.slug).length,
      ])
    ),
  };

  const filtered =
    activeSlug === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === activeSlug);

  return (
    <>
      <ProjectFilterBar
        categories={sectors}
        activeSlug={activeSlug}
        counts={counts}
        onSelect={setActiveSlug}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="rounded-xl border border-foreground/30 bg-card p-5 hover:border-electric-cyan/50 transition-colors"
            >
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {project.categoryLabel}
              </p>
              <h3 className="mt-2 font-semibold text-foreground">{project.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
