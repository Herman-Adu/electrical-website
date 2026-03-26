export default function CategoryProjectsLoading() {
  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-5xl animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 h-3 w-48 rounded bg-muted/40" />

          {/* Header skeleton */}
          <div className="mb-10 space-y-3">
            <div className="h-2.5 w-20 rounded bg-electric-cyan/20" />
            <div className="h-9 w-72 rounded bg-muted/40" />
            <div className="h-4 w-96 rounded bg-muted/30" />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/40 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-5 w-48 rounded bg-muted/40" />
                  <div className="h-5 w-20 rounded bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-muted/30" />
                  <div className="h-3 w-4/5 rounded bg-muted/30" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-40 rounded bg-muted/25" />
                  <div className="h-3 w-36 rounded bg-muted/25" />
                  <div className="h-3 w-32 rounded bg-muted/25" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
