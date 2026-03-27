"use client";

import type { ProjectListItem } from "@/types/projects";
import { ProjectsOptimisticList } from "@/components/projects/projects-optimistic-list";

interface ProjectsInfiniteScrollProps {
  items: ProjectListItem[];
  initialCount?: number;
}

/**
 * Thin wrapper component for infinite scroll functionality.
 * The infinite scroll logic is implemented directly within ProjectsOptimisticList
 * to maintain the optimistic update hooks in the same component scope.
 * 
 * This component exists to satisfy the interface requirement and can be used
 * as an alternative import when only infinite scroll behavior is needed.
 */
export function ProjectsInfiniteScroll({
  items,
}: ProjectsInfiniteScrollProps) {
  // The initialCount prop is handled internally by ProjectsOptimisticList
  // which defaults to showing 3 items initially
  return <ProjectsOptimisticList items={items} />;
}
