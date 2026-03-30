"use client";

export default function NewsHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-3xl">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
            News hub error
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">
            The newsroom scaffold hit a rendering issue.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {error.message}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full border border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
