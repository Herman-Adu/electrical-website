export default function CategoryProjectDetailLoading() {
  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-6xl animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 h-3 w-72 rounded bg-muted/40" />

          {/* Card skeleton */}
          <div className="rounded-lg border border-border/50 overflow-hidden">
            {/* Image skeleton */}
            <div className="min-h-[280px] sm:min-h-[360px] bg-muted/30" />

            {/* Body skeleton */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="h-8 w-96 rounded bg-muted/40" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-muted/30" />
                <div className="h-4 w-5/6 rounded bg-muted/30" />
                <div className="h-4 w-4/6 rounded bg-muted/30" />
              </div>

              {/* KPI grid skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/10 border border-border/40">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-2.5 w-16 rounded bg-muted/30" />
                    <div className="h-4 w-20 rounded bg-muted/40" />
                  </div>
                ))}
              </div>

              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-5 w-16 rounded bg-muted/30" />
                ))}
              </div>

              {/* CTAs skeleton */}
              <div className="flex gap-3">
                <div className="h-10 w-40 rounded bg-muted/30" />
                <div className="h-10 w-48 rounded bg-electric-cyan/10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
