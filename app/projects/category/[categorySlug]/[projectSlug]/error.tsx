"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CategoryProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-6xl text-center py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-warning mb-4">
            Error
          </p>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Failed to load project
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
            Something went wrong loading this project. Please try again.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="px-5 py-2 bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-medium tracking-wide hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/projects/category"
              className="px-5 py-2 border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:border-border/80 transition-all"
            >
              All Categories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
