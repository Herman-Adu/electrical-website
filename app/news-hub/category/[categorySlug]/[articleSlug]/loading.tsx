export default function NewsArticleLoading() {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-6xl space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-full bg-card" />
        <div className="h-20 max-w-4xl animate-pulse rounded-3xl bg-card" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-3xl bg-card lg:col-span-2" />
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-3xl bg-card" />
            <div className="h-32 animate-pulse rounded-3xl bg-card" />
          </div>
        </div>
      </div>
    </main>
  );
}
