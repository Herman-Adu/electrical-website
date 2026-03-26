import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/projects";
import { ProjectCardShell } from "@/components/projects/project-card-shell";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { ProjectMetaRow } from "@/components/projects/project-meta-row";

export function ProjectsFeaturedCard({ project }: { project: Project }) {
  return (
    <ProjectCardShell className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]" id="projects-grid">
        <div className="relative min-h-[260px] lg:min-h-[360px]">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>

        <div className="p-6 lg:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-electric-cyan/80">
            Featured Project · {project.clientSector}
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-foreground">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border/50 bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Progress
              </span>
              <span className="text-sm font-semibold text-foreground">
                {project.progress}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-electric-cyan"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <ProjectMetaRow label="Budget" value={project.kpis.budget} />
            <ProjectMetaRow label="Timeline" value={project.kpis.timeline} />
            <ProjectMetaRow label="Capacity" value={project.kpis.capacity} />
            <ProjectMetaRow label="Location" value={project.kpis.location} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/projects/category/${project.category}/${project.slug}`}
              className="rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan transition-colors hover:bg-electric-cyan/20"
            >
              View Details
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-electric-cyan/30"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </ProjectCardShell>
  );
}
