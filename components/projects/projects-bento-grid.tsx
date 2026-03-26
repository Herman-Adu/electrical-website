import { ProjectCardShell } from "@/components/projects/project-card-shell";
import type { ProjectBentoItem } from "@/types/projects";

export function ProjectsBentoGrid({ items }: { items: ProjectBentoItem[] }) {
  return (
    <section className="section-container py-8" aria-label="Project highlights">
      <div className="section-content max-w-6xl">
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
            Performance Snapshot
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ProjectCardShell key={item.id} className="min-h-[180px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {item.title}
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight text-electric-cyan">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </ProjectCardShell>
          ))}
        </div>
      </div>
    </section>
  );
}
