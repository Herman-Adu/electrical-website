import Link from "next/link";
import type { NewsCategory, NewsCategorySlug } from "@/types/news";

interface NewsHubHeroProps {
  categories: NewsCategory[];
  activeCategory: NewsCategorySlug;
  totalArticles: number;
}

export function NewsHubHero({
  categories,
  activeCategory,
  totalArticles,
}: NewsHubHeroProps) {
  return (
    <section className="section-standard relative overflow-hidden border-b border-border/40 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="section-content relative max-w-6xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-electric-cyan/20 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-electric-cyan">
            <span className="h-2 w-2 rounded-full bg-electric-cyan" />
            News Hub
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Editorial, campaigns, proof, and partner stories
            </p>
            <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A data-driven newsroom designed for growth, proof, and future CMS
              delivery.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              This skeleton mirrors the projects architecture with typed content
              models, server-rendered filtering, category routes, article detail
              pages, and a dedicated sidebar region for campaigns, partner
              stories, social proof, and reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-border/50 bg-card/60 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Launch inventory
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {totalArticles} stories
              </div>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/60 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Publishing model
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                SSR + SSG
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <Link
              href="/news-hub"
              className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                activeCategory === "all"
                  ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-electric-cyan/30 hover:text-foreground"
              }`}
            >
              All
            </Link>
            {categories.map((category) => {
              const href = `/news-hub?category=${category.slug}`;
              const isActive = activeCategory === category.slug;

              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:border-electric-cyan/30 hover:text-foreground"
                  }`}
                >
                  {category.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
