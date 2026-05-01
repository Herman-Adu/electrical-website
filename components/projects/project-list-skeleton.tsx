export function ProjectListSkeleton() {
  return (
    <section className="relative overflow-hidden section-container section-padding bg-background">
      <div className="section-content max-w-7xl">
        {/* Header pulse */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-muted animate-pulse" />
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse"
            >
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-12 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
