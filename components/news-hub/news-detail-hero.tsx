"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_DETAIL_ARTICLE } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { NewsArticle } from "@/types/news";

interface NewsDetailHeroProps {
  article: NewsArticle;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsDetailHero({ article }: NewsDetailHeroProps) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });
  const shouldReduce = useReducedMotion();

  const scrollToArticle = () => {
    const articleContent = document.getElementById("article-content");
    if (articleContent)
      scrollToElementWithOffset(articleContent, { pageType: "article" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        <>
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/25 to-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
        </>
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.60) 100%)",
          }}
        />
      }
      decor={
        !shouldReduceMotion ? (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute size-1 rounded-full bg-electric-cyan/30"
                style={{
                  left: `${12 + index * 14}%`,
                  top: `${20 + (index % 3) * 20}%`,
                }}
                animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />
            ))}
          </div>
        ) : null
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl px-4 text-center"
        >
          {/* Status indicator */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-white pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-white uppercase font-bold">
                Article // Active
              </span>
            </div>
          </motion.div>

          {/* Eyebrow — sector label */}
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="h-px w-8 bg-electric-cyan/60 font-bold" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase font-bold text-electric-cyan">
              <span className="font-mono text-[10px] tracking-[0.18em]">
                {formatDate(article.publishedAt)}
              </span>{" "}
              <span className="font-mono text-[10px] tracking-[0.18em]">
                {article.readTime}
              </span>
            </span>
            <span className="h-px w-8 bg-electric-cyan/60 font-bold" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-4 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="rounded-xl border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono font-bold text-lg tracking-[0.18em] text-electric-cyan uppercase">
              {article.categoryLabel}
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className={HERO_H1_DETAIL_ARTICLE}>
            {article.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-base sm:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto"
          >
            {article.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <div className="rounded-xl border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-3 backdrop-blur-sm">
              <div className="font-mono text-[10px] tracking-[0.18em] text-electric-cyan/70 uppercase">
                Author
              </div>
              <div className="mt-1 font-semibold text-white/80">
                {article.author.name}
              </div>
            </div>
            {article.spotlightMetric ? (
              <div className="rounded-xl border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-3 backdrop-blur-sm shadow-[0_0_20px_rgba(0,243,189,0.15)]">
                <div className="font-mono text-[10px] tracking-[0.18em] text-electric-cyan/70 uppercase">
                  {article.spotlightMetric.label}
                </div>
                <div className="mt-1 font-semibold text-white/80">
                  {article.spotlightMetric.value}
                </div>
              </div>
            ) : null}
            {article.location && (
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase">
                  Location
                </div>
                <div className="mt-1 font-semibold text-white">
                  {article.location}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          onClick={scrollToArticle}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/60 transition-colors hover:text-electric-cyan"
          aria-label="Scroll to article content"
          type="button"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Read Article
          </span>
          <ChevronDown
            size={20}
            className={shouldReduceMotion ? "" : "animate-bounce"}
          />
        </motion.button>
      }
    />
  );
}
