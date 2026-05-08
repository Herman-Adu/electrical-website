"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectCategorySlug } from "@/types/projects";
import { VALID_SLUGS } from "./project-category-slider";

interface ProjectCategoryTitleProps {
  className?: string;
  label?: string;
}

const TITLE_LABELS: Record<ProjectCategorySlug, string> = {
  all: "All",
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  community: "Community",
  "commercial-lighting": "Commercial Lighting",
  "power-boards": "Power Boards",
};

function isValidSlug(value: string | null): value is ProjectCategorySlug {
  return value !== null && VALID_SLUGS.has(value as ProjectCategorySlug);
}

export function ProjectCategoryTitle({ className, label: labelProp }: ProjectCategoryTitleProps) {
  const searchParams = useSearchParams();
  const rawCategory = searchParams?.get("category") ?? null;
  const active: ProjectCategorySlug = isValidSlug(rawCategory)
    ? rawCategory
    : "all";
  const label = labelProp ?? TITLE_LABELS[active];

  const wrapperClassName = ["relative", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <AnimatePresence mode="wait">
        <motion.h2
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
        >
          <span>{label}</span>{" "}
          <span className="text-electric-cyan">Projects</span>
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
