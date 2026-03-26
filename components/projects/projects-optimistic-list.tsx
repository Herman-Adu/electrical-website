"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { updateProjectListItem } from "@/lib/actions/projects";
import type { ProjectListItem, ProjectStatus } from "@/types/projects";
import { ProjectCardShell } from "@/components/projects/project-card-shell";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

type OptimisticUpdate = {
  projectId: string;
  status?: ProjectStatus;
  isFeatured?: boolean;
};

function applyUpdate(
  items: ProjectListItem[],
  update: OptimisticUpdate,
): ProjectListItem[] {
  return items.map((item) => {
    if (item.id !== update.projectId) return item;
    return {
      ...item,
      ...(update.status !== undefined ? { status: update.status } : {}),
      ...(update.isFeatured !== undefined
        ? { isFeatured: update.isFeatured }
        : {}),
      updatedAt: new Date().toISOString(),
    };
  });
}

export function ProjectsOptimisticList({
  items,
}: {
  items: ProjectListItem[];
}) {
  const [sourceItems, setSourceItems] = useState(items);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string>("");

  const [optimisticItems, addOptimistic] = useOptimistic(
    sourceItems,
    (current, update: OptimisticUpdate) => applyUpdate(current, update),
  );

  const markAsFeatured = (projectId: string, nextValue: boolean) => {
    const update: OptimisticUpdate = { projectId, isFeatured: nextValue };

    startTransition(async () => {
      setFeedback("");
      addOptimistic(update);

      const result = await updateProjectListItem(update);
      if (result.success) {
        setSourceItems((previous) => applyUpdate(previous, update));
      } else {
        setFeedback(result.message);
      }
    });
  };

  const cycleStatus = (status: ProjectStatus): ProjectStatus => {
    if (status === "planned") return "in-progress";
    if (status === "in-progress") return "completed";
    return "planned";
  };

  const updateStatus = (projectId: string, currentStatus: ProjectStatus) => {
    const nextStatus = cycleStatus(currentStatus);
    const update: OptimisticUpdate = { projectId, status: nextStatus };

    startTransition(async () => {
      setFeedback("");
      addOptimistic(update);

      const result = await updateProjectListItem(update);
      if (result.success) {
        setSourceItems((previous) => applyUpdate(previous, update));
      } else {
        setFeedback(result.message);
      }
    });
  };

  return (
    <section
      className="section-container py-8"
      aria-label="Optimistic project list"
    >
      <div className="section-content max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
            Delivery Queue
          </p>
          {isPending ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Updating...
            </span>
          ) : null}
        </div>

        {feedback ? (
          <p className="mb-4 rounded-lg border border-amber-warning/30 bg-amber-warning/10 px-3 py-2 text-sm text-amber-warning">
            {feedback}
          </p>
        ) : null}

        <div className="space-y-3">
          {optimisticItems.map((item) => (
            <ProjectCardShell key={item.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/category/${item.category}/${item.slug}`}
                      className="text-base font-semibold text-foreground hover:text-electric-cyan"
                    >
                      {item.title}
                    </Link>
                    {item.isFeatured ? (
                      <span className="rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-electric-cyan">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.categoryLabel} · {item.location} · Updated{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ProjectStatusBadge status={item.status} />

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(item.id, item.status)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-electric-cyan/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cycle Status
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => markAsFeatured(item.id, !item.isFeatured)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-electric-cyan/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {item.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              </div>
            </ProjectCardShell>
          ))}
        </div>
      </div>
    </section>
  );
}
