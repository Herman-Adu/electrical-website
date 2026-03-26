export default function ProjectsLoading() {
  return (
    <main className="section-container section-safe-top section-safe-bottom">
      <div className="section-content max-w-6xl space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-14 w-full max-w-3xl animate-pulse rounded bg-muted" />
        <div className="h-96 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
