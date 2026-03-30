"use client";

export default function NewsArticleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
          Article route error
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          This article could not be rendered.
        </h1>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full border border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
