"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { NewsQuote } from "@/types/news";

interface ReviewHighlightQuoteProps {
  quote: NewsQuote;
  eyebrow?: string;
}

export function ReviewHighlightQuote({
  quote,
  eyebrow,
}: ReviewHighlightQuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="w-full py-8 md:py-12">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {eyebrow && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-electric-cyan">
            {eyebrow}
          </p>
        )}

        <div className="relative">
          {/* Oversized decorative quotation mark */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 -translate-y-4 font-bold leading-none text-[80px] text-electric-cyan/20 md:text-[96px]"
          >
            &ldquo;
          </span>

          {/* Quote text — indented to clear the decorative mark */}
          <blockquote className="pl-8 pt-2">
            <p className="text-xl font-medium italic leading-relaxed text-white/90 md:text-2xl">
              {quote.quote}
            </p>

            {/* Author attribution */}
            <footer className="mt-6">
              <div className="mb-4 h-px w-12 bg-electric-cyan/30" />
              <p className="text-sm font-semibold text-white">{quote.author}</p>
              <p className="text-xs text-white/60">{quote.role}</p>
            </footer>
          </blockquote>
        </div>
      </motion.div>
    </section>
  );
}
