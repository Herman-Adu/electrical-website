import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/footer";
import {
  ProjectCardShell,
  ProjectMetaRow,
  ProjectStatusBadge,
} from "@/components/projects";
import {
  allProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/data/projects";
import { createProjectDetailMetadata } from "@/lib/metadata-projects";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Nexgen Electrical Innovations",
      description: "The requested project could not be found.",
    };
  }

  return createProjectDetailMetadata(
    project,
    `/projects/category/${project.category}/${project.slug}`,
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-6xl">
          <div className="mb-6">
            <Link
              href="/projects"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/80 hover:text-electric-cyan"
            >
              ← Back to Projects
            </Link>
          </div>

          <ProjectCardShell className="overflow-hidden p-0">
            <div className="relative min-h-[280px] sm:min-h-[360px]">
              <Image
                src={project.coverImage.src}
                alt={project.coverImage.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-3">
                <ProjectStatusBadge status={project.status} />
                <span className="rounded-full border border-white/30 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
                  {project.clientSector}
                </span>
              </div>
            </div>

            <div className="p-6 lg:p-7">
              <h1 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="space-y-1">
                  <ProjectMetaRow label="Budget" value={project.kpis.budget} />
                  <ProjectMetaRow
                    label="Timeline"
                    value={project.kpis.timeline}
                  />
                  <ProjectMetaRow
                    label="Capacity"
                    value={project.kpis.capacity}
                  />
                  <ProjectMetaRow
                    label="Location"
                    value={project.kpis.location}
                  />
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Delivery Progress
                  </p>
                  <div className="mt-3 h-3 rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-electric-cyan"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {project.progress}% complete
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border/60 bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ProjectCardShell>

          <section className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
              Related Projects
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {relatedProjects.map((item) => (
                <ProjectCardShell key={item.id}>
                  <ProjectStatusBadge status={item.status} />
                  <h2 className="mt-3 text-lg font-bold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.kpis.location}
                  </p>
                  <Link
                    href={`/projects/category/${item.category}/${item.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-electric-cyan hover:underline"
                  >
                    View details
                  </Link>
                </ProjectCardShell>
              ))}
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
