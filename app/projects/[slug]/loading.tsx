export default function ProjectDetailLoading() {
  return (
    <main className="section-container section-safe-top section-safe-bottom">
      <div className="section-content max-w-6xl space-y-6">
        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        <div className="h-80 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-12 w-2/3 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
