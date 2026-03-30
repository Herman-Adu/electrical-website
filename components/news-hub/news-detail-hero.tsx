import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";

interface NewsDetailHeroProps {
  article: NewsArticle;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsDetailHero({ article }: NewsDetailHeroProps) {
  return (
    <section className="section-standard relative overflow-hidden border-b border-border/40 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,242,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />
      <div className="section-content relative max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link href="/news-hub" className="hover:text-electric-cyan">
            News Hub
          </Link>
          <span>/</span>
          <Link href="/news-hub/category" className="hover:text-electric-cyan">
            Categories
          </Link>
          <span>/</span>
          <Link
            href={`/news-hub/category/${article.category}`}
            className="hover:text-electric-cyan"
          >
            {article.categoryLabel}
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan">
                {article.categoryLabel}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {article.readTime}
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {article.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-border/50 bg-card/60 px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Author
                </div>
                <div className="mt-1 font-semibold text-foreground">
                  {article.author.name}
                </div>
              </div>
              {article.spotlightMetric ? (
                <div className="rounded-2xl border border-border/50 bg-card/60 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {article.spotlightMetric.label}
                  </div>
                  <div className="mt-1 font-semibold text-foreground">
                    {article.spotlightMetric.value}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-3xl border border-border/50">
            <Image
              src={article.featuredImage.src}
              alt={article.featuredImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/35 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
