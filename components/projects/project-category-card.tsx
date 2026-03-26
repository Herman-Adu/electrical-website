import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import type { ProjectCategory } from "@/types/projects";

interface ProjectCategoryCardProps {
  category: ProjectCategory;
  projectCount: number;
  href: string;
}

export function ProjectCategoryCard({
  category,
  projectCount,
  href,
}: ProjectCategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-electric-cyan/40 hover:bg-card/80 hover:shadow-[0_0_30px_rgba(0,242,255,0.06)]"
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-electric-cyan/10 rounded-tr-xl transition-colors duration-300 group-hover:border-electric-cyan/30" />

      {/* Category icon */}
      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/10">
        <Folder className="h-5 w-5 text-electric-cyan/70 transition-colors duration-300 group-hover:text-electric-cyan" />
      </div>

      {/* Slug chip */}
      <div className="mb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-electric-cyan/70 border border-electric-cyan/20 bg-electric-cyan/5 px-2 py-0.5 rounded-sm transition-all duration-300 group-hover:border-electric-cyan/40 group-hover:text-electric-cyan">
          /{category.slug}
        </span>
      </div>

      {/* Label */}
      <h2 className="text-xl font-black uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-electric-cyan">
        {category.label}
      </h2>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {category.description}
      </p>

      {/* Project count chip */}
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/5 px-3 py-1 transition-all duration-300 group-hover:border-electric-cyan/50 group-hover:bg-electric-cyan/10">
        <span className="font-mono text-[10px] tracking-[0.14em] text-electric-cyan font-bold">
          {projectCount}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {projectCount === 1 ? "Project" : "Projects"}
        </span>
      </div>

      {/* Arrow CTA */}
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/60 transition-all duration-300 group-hover:text-electric-cyan">
        <span>View Projects</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
