import Link from "next/link";

export default function NewsArticleNotFound() {
  return (
    <main className="section-standard bg-background">
      <div className="section-content max-w-3xl rounded-3xl border border-border/50 bg-card/60 p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          Article not found
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          That story is not available.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The slug may be wrong or the article may have moved to another
          category.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/news-hub"
            className="rounded-full border border-electric-cyan/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan"
          >
            News hub
          </Link>
          <Link
            href="/news-hub/category"
            className="rounded-full border border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground"
          >
            Browse categories
          </Link>
        </div>
      </div>
    </main>
  );
}
