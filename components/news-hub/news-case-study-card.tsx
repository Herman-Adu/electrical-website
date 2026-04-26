"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsCaseStudyCardProps {
  article: NewsArticle;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsCaseStudyCard({ article }: NewsCaseStudyCardProps) {
  return (
    <Link
      href={`/news-hub/category/${article.category}/${article.slug}`}
      className="group block h-full"
    >
      <NewsArticleCardShell className="h-full overflow-hidden transition-all hover:border-electric-cyan/50 hover:shadow-[0_0_40px_rgba(0,243,189,0.2)]">
        <div className="relative h-48 border-b border-electric-cyan/20">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          
          {/* Case study badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-electric-cyan/40 bg-electric-cyan/20 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-sm">📊</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan">
              Case Study
            </span>
          </div>

          {/* Spotlight metric overlay */}
          {article.spotlightMetric && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-4 right-4 rounded-lg border border-electric-cyan/30 bg-background/90 px-3 py-2 backdrop-blur-sm"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/60">
                {article.spotlightMetric.label}
              </div>
              <div className="text-lg font-bold text-electric-cyan">
                {article.spotlightMetric.value}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4 p-5">
          <div className="space-y-3">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-electric-cyan/40" />
              <span>{article.readTime}</span>
              {article.location && (
                <>
                  <span className="h-1 w-1 rounded-full bg-electric-cyan/40" />
                  <span className="text-electric-cyan/70">{article.location}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-electric-cyan transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm leading-6 text-foreground/70 line-clamp-2">
              {article.excerpt}
            </p>
          </div>

          {/* Bottom section */}
          <div className="flex items-center justify-between pt-2 border-t border-electric-cyan/10">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
              {article.author.name}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80 group-hover:text-electric-cyan transition-colors">
              View Study →
            </span>
          </div>
        </div>
      </NewsArticleCardShell>
    </Link>
  );
}
