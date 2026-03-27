import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import type { ProjectCategory } from "@/types/projects";

interface ProjectCategoryCardProps {
  category: ProjectCategory;
  projectCount: number;
  href: string;
}

/**
 * ProjectCategoryCard - Responsive category showcase card
 *
 * Responsive breakpoints:
 * - Mobile (default): p-5 - comfortable touch targets
 * - sm (640px): p-5 - maintained sizing
 * - md (768px): p-6 - increased padding for tablets
 * - lg (1024px): p-6 - consistent desktop spacing
 *
 * Typography scaling:
 * - Icon: w-9 h-9 → md:w-10 md:h-10 - responsive icon sizing
 * - Title: text-lg → md:text-xl - larger on desktops
 * - Description: text-sm - consistent across viewports
 *
 * Touch-friendly: All interactive elements ≥44px
 */
export function ProjectCategoryCard({
  category,
  projectCount,
  href,
}: ProjectCategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 sm:p-5 md:p-6 transition-all duration-300 hover:border-electric-cyan/40 hover:bg-card/80 hover:shadow-[0_0_30px_rgba(0,243,189,0.06)]"
    >
      {/* Corner accent - responsive sizing */}
      <div className="absolute top-0 right-0 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border-t border-r border-electric-cyan/10 rounded-tr-xl transition-colors duration-300 group-hover:border-electric-cyan/30" />

      {/* Category icon - responsive sizing */}
      <div className="mb-4 inline-flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/10">
        <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-electric-cyan/70 transition-colors duration-300 group-hover:text-electric-cyan" />
      </div>

      {/* Slug chip - responsive sizing */}
      <div className="mb-3">
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-electric-cyan/70 border border-electric-cyan/20 bg-electric-cyan/5 px-2 py-0.5 rounded-sm transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:text-electric-cyan inline-block">
          /{category.slug}
        </span>
      </div>

      {/* Label - responsive text sizing */}
      <h2 className="text-lg sm:text-lg md:text-xl font-black uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-electric-cyan">
        {category.label}
      </h2>

      {/* Description - responsive sizing with truncation */}
      <p className="mt-2 text-xs sm:text-xs md:text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {category.description}
      </p>

      {/* Project count chip - responsive sizing and flex layout */}
      <div className="mt-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/5 px-2 sm:px-3 py-1 transition-all duration-300 group-hover:border-electric-cyan/50 group-hover:bg-electric-cyan/10 min-h-11">
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.14em] text-electric-cyan font-bold">
          {projectCount}
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-muted-foreground whitespace-nowrap">
          {projectCount === 1 ? "Project" : "Projects"}
        </span>
      </div>

      {/* Arrow CTA - responsive styling */}
      <div className="mt-4 flex items-center gap-1 sm:gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] text-electric-cyan/60 transition-all duration-300 group-hover:text-electric-cyan min-h-11">
        <span>View Projects</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
