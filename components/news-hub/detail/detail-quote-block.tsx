"use client";

import { motion, type Variants } from "framer-motion";
import type { NewsQuote } from "@/types/news";

interface DetailQuoteBlockProps {
  quote: NewsQuote;
  variant?: "primary" | "secondary";
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DetailQuoteBlock({
  quote,
  variant = "primary",
}: DetailQuoteBlockProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.section
      id="testimonial"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">Client Testimonial</h2>
      <blockquote
        className={`rounded-xl border p-6 ${
          isPrimary
            ? "border-electric-cyan/30 bg-linear-to-br from-electric-cyan/15 to-electric-cyan/5 shadow-[0_0_30px_rgba(0,243,189,0.1)]"
            : "border-electric-cyan/20 bg-electric-cyan/5"
        }`}
      >
        <div className="mb-4 text-electric-cyan/40">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <p
          className={`leading-7 text-foreground ${isPrimary ? "text-lg italic" : "text-base"}`}
        >
          {quote.quote}
        </p>
        <footer className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-electric-cyan/20" />
          <div className="text-right">
            <p className="font-medium text-foreground">{quote.author}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-electric-cyan/70">
              {quote.role}
            </p>
          </div>
        </footer>
      </blockquote>
    </motion.section>
  );
}
