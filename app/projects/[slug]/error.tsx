"use client";

import Link from "next/link";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="section-container section-safe-top section-safe-bottom">
      <div className="section-content max-w-3xl rounded-2xl border border-border/60 bg-card/50 p-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-warning">
          Project Load Error
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-foreground">
          Could not load project details
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {error.message ||
            "Something unexpected happened while loading this project."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan hover:bg-electric-cyan/20"
          >
            Retry
          </button>
          <Link
            href="/projects"
            className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground hover:border-electric-cyan/30"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
