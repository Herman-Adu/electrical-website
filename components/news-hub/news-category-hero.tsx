"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import {
  Activity,
  ChevronDown,
  Factory,
  FolderOpen,
  Handshake,
  Home,
  Lightbulb,
  MessageSquareQuote,
} from "lucide-react";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_CATEGORY_IMAGE } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { NewsCategory } from "@/types/news";

const categoryConfig: Record<
  string,
  {
    image: string;
    icon: ReactNode;
    accentWord: string;
  }
> = {
  residential: {
    image: "/images/smart-living-interior.jpg",
    icon: <Home className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Living",
  },
  industrial: {
    image: "/images/services-industrial.jpg",
    icon: <Factory className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Operations",
  },
  partners: {
    image: "/images/community-hero.jpg",
    icon: <Handshake className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Partnerships",
  },
  "case-studies": {
    image: "/images/power-distribution.jpg",
    icon: <Lightbulb className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Outcomes",
  },
  insights: {
    image: "/images/system-diagnostics.jpg",
    icon: <Lightbulb className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Intelligence",
  },
  reviews: {
    image: "/images/warehouse-lighting.jpg",
    icon: <MessageSquareQuote className="h-8 w-8 text-electric-cyan" />,
    accentWord: "Feedback",
  },
};

const fallbackConfig = {
  image: "/images/services-commercial.jpg",
  icon: <FolderOpen className="h-8 w-8 text-electric-cyan" />,
  accentWord: "Coverage",
};

interface NewsCategoryHeroProps {
  category: NewsCategory;
  articleCount: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
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

export function NewsCategoryHero({
  category,
  articleCount,
}: NewsCategoryHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const config = categoryConfig[category.slug] ?? fallbackConfig;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_CATEGORY",
    "INDEXING_ARTICLES",
    "CATEGORY_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToArticles = () => {
    const el = document.getElementById("category-articles");
    if (el) scrollToElementWithOffset(el);
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        <>
          <Image
            src={config.image}
            alt={`${category.label} category hero`}
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
          animate={isLoaded ? "visible" : "hidden"}
          className="mx-auto max-w-5xl px-4 text-center"
        >
          <motion.div
            variants={flickerVariants}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Category // {statusText}
              </span>
            </div>
          </motion.div>

          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/60 uppercase"
          >
            <Link
              href="/news-hub"
              className="transition-colors hover:text-electric-cyan"
            >
              News Hub
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href="/news-hub/category"
              className="transition-colors hover:text-electric-cyan"
            >
              Categories
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-electric-cyan">{category.label}</span>
          </motion.nav>

          <motion.div
            variants={itemVariants}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-electric-cyan/40 bg-black/40 backdrop-blur-sm shadow-[0_0_24px_rgba(0,243,189,0.15)]">
              {config.icon}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-electric-cyan/60" />
            <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase">
              {articleCount} Article{articleCount !== 1 ? "s" : ""}
            </span>
            <span className="h-px w-12 bg-electric-cyan/60" />
          </motion.div>

          <motion.h1 variants={itemVariants} className={HERO_H1_CATEGORY_IMAGE}>
            <span className="block">{category.label}</span>
            <span className="block bg-linear-to-r from-electric-cyan via-[var(--electric-cyan)] to-electric-cyan/80 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,243,189,0.3)]">
              {config.accentWord}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed font-light text-white/80 drop-shadow-md sm:text-lg"
          >
            {category.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/news-hub"
              className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-mono text-[11px] tracking-widest text-white uppercase backdrop-blur-sm transition-all duration-300 hover:border-electric-cyan/60 hover:text-electric-cyan"
            >
              All News
            </Link>
            <Link
              href="/news-hub/category"
              className="rounded-full border border-electric-cyan/40 bg-electric-cyan/15 px-5 py-2.5 font-mono text-[11px] tracking-widest text-electric-cyan uppercase backdrop-blur-sm transition-all duration-300 hover:bg-electric-cyan/25"
            >
              All Categories
            </Link>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToArticles}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/60 transition-colors hover:text-electric-cyan"
          aria-label="Scroll to articles"
          type="button"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            View Articles
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
