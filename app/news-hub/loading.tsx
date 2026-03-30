export default function NewsHubLoading() {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-6xl space-y-6">
        <div className="h-12 w-40 animate-pulse rounded-full bg-card" />
        <div className="h-20 max-w-3xl animate-pulse rounded-3xl bg-card" />
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-3xl bg-card"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
