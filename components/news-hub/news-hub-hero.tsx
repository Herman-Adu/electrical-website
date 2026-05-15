"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import Image from "next/image";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { HeroTrustIndicators } from "@/components/shared";
import { HubCircuit } from "@/components/hero/circuits/hub-circuit";
import type { TrustIndicatorItem } from "@/components/shared";

// ---------------------------------------------------------------------------
// Config data
// ---------------------------------------------------------------------------

const NEWS_HUB_TRUST_INDICATORS: readonly TrustIndicatorItem[] = [
  {
    icon: "BookOpen",
    title: "Expert-Led Insights",
    description: "In-depth analysis from UK electrical industry specialists",
  },
  {
    icon: "ClipboardCheck",
    title: "Editorial Standards",
    description: "Every article reviewed and verified before publication",
  },
  {
    icon: "Activity",
    title: "Live Campaign Feed",
    description: "Case studies and project updates delivered in real time",
  },
  {
    icon: "Users",
    title: "Full Sector Coverage",
    description: "Commercial, industrial and residential stories in one place",
  },
] as const satisfies readonly TrustIndicatorItem[];

const NEWS_HUB_STATUSES = [
  "INITIALIZING",
  "LOADING_EDITORIAL",
  "INDEXING_STORIES",
  "SYSTEMS_READY",
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NewsHubHeroProps {
  totalArticles: number;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NewsHubHero({ totalArticles }: NewsHubHeroProps) {
  const [isLoaded] = useState(() => typeof window !== "undefined");
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const { currentText: statusText } = useCyclingText(NEWS_HUB_STATUSES, 380);

  const scrollToFeed = () => {
    const el = document.getElementById("news-hub-intro");
    if (el) scrollToElementWithOffset(el, { pageType: "default" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        <>
          <Image
            src="/images/articles/news-hub-hero-stacked-newspapers.jpg"
            alt="Stacked business and world news newspapers representing editorial coverage"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
        </>
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 100%)",
          }}
        />
      }
      decor={<HubCircuit shouldReduceMotion={shouldReduceMotion} />}
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mx-auto max-w-5xl px-4 text-center"
        >
          {/* Status Label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-white/60 pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-white uppercase font-bold">
                News Hub // {statusText}
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-electric-cyan/80 font-bold" />
            <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase font-bold">
              Editorial Systems
            </span>
            <span className="h-px w-12 bg-electric-cyan/80 font-bold" />
          </motion.div>

          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block text-white">Editorial</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Command Centre
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Live editorial hub for campaigns, case studies, insights, and
            partner updates. Powered by typed content models ready for scalable
            CMS integration.
          </motion.p>

          <HeroTrustIndicators
            items={NEWS_HUB_TRUST_INDICATORS}
            variants={itemVariants}
            variant="image-overlay"
          />

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/80"
          >
            <span>{totalArticles} Seeded Stories</span>
            <span className="hidden opacity-40 sm:inline">|</span>
            <span>Category-first Routing</span>
            <span className="hidden opacity-40 sm:inline">|</span>
            <span>SSR + SSG Delivery</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToFeed}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-2 text-white/80 font-bold hover:text-electric-cyan transition-colors duration-300"
          aria-label="Explore News Hub"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore Stories
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
