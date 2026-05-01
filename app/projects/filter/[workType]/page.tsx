import { notFound } from "next/navigation";
import Link from "next/link";
import { allProjects } from "@/data/projects";
import {
  getProjectsByWorkType,
  getWorkTypeBySlug,
  workTypes,
} from "@/data/projects/work-types";

interface PageProps {
  params: Promise<{ workType: string }>;
}

export function generateStaticParams() {
  return workTypes.map((wt) => ({ workType: wt.slug }));
}

export default async function WorkTypeFilterPage({ params }: PageProps) {
  const { workType: slug } = await params;
  const workType = getWorkTypeBySlug(slug);
  if (!workType) notFound();

  const projects = getProjectsByWorkType(slug, allProjects);

  return (
    <main className="min-h-screen pt-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/projects/category"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Categories
          </Link>
          <h1 className="mt-4 text-3xl font-bold">{workType.label}</h1>
          <p className="mt-2 text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects found for this work type.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="rounded-xl border bg-card p-5 hover:border-cyan-400/50 transition-colors"
              >
                <p className="text-xs text-muted-foreground">{project.categoryLabel}</p>
                <h3 className="mt-1 font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
