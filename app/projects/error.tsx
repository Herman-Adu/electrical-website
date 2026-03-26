"use client";

export default function ProjectsError({
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
          Projects Load Error
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-foreground">
          Unable to load projects
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {error.message ||
            "Something unexpected happened while loading this page."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan hover:bg-electric-cyan/20"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
