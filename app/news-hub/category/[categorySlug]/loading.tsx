export default function NewsCategoryLoading() {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-6xl space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-card" />
        <div className="h-14 max-w-2xl animate-pulse rounded-3xl bg-card" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-3xl bg-card" />
        ))}
      </div>
    </main>
  );
}
