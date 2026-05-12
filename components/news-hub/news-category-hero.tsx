"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import {
  Activity,
  Building2,
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
import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";
import type { TrustIndicatorItem } from "@/components/shared/hero-trust-indicators";

const categoryConfig: Record<
  string,
  {
    image: string;
    icon: ReactNode;
    headline: readonly string[];
    trustIndicators: readonly TrustIndicatorItem[];
  }
> = {
  residential: {
    image: "/images/smart-living-interior.jpg",
    icon: <Home className="h-8 w-8 text-electric-cyan" />,
    headline: ["RESIDENTIAL", "SMART LIVING"],
    trustIndicators: [
      {
        icon: "Home",
        title: "Smart Living",
        description: "Domestic installations and smart home systems",
      },
      {
        icon: "Zap",
        title: "EV Charging",
        description: "Home and workplace EV solutions",
      },
      {
        icon: "Shield",
        title: "NICEIC Certified",
        description: "Fully accredited domestic electricians",
      },
      {
        icon: "Clock",
        title: "24-7 Support",
        description: "Around-the-clock emergency cover",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  industrial: {
    image: "/images/services-industrial.jpg",
    icon: <Factory className="h-8 w-8 text-electric-cyan" />,
    headline: ["INDUSTRIAL", "POWER SYSTEMS"],
    trustIndicators: [
      {
        icon: "Factory",
        title: "Industrial Grade",
        description: "Heavy-duty industrial installations",
      },
      {
        icon: "Settings",
        title: "Maintenance Plans",
        description: "Scheduled and reactive maintenance",
      },
      {
        icon: "Zap",
        title: "Power Infrastructure",
        description: "High-voltage and distribution systems",
      },
      {
        icon: "Shield",
        title: "Safety Certified",
        description: "Full health and safety compliance",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  partners: {
    image: "/images/projects/view-professional-handshake-business-people.jpg",
    icon: <Handshake className="h-8 w-8 text-electric-cyan" />,
    headline: ["STRATEGIC", "PARTNER", "NETWORK"],
    trustIndicators: [
      {
        icon: "Users",
        title: "Strategic Partners",
        description: "Long-term framework agreements",
      },
      {
        icon: "Award",
        title: "Accredited Network",
        description: "Pre-approved and vetted contractors",
      },
      {
        icon: "Building2",
        title: "Multi-sector",
        description: "Across residential, commercial and industrial",
      },
      {
        icon: "ClipboardCheck",
        title: "Due Diligence",
        description: "Fully vetted partner relationships",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  "case-studies": {
    image:
      "/images/projects/nexgen-medivet-watford-completed-facility-overview-hero.jpg",
    icon: <Lightbulb className="h-8 w-8 text-electric-cyan" />,
    headline: ["PROVEN", "PROJECT", "OUTCOMES"],
    trustIndicators: [
      {
        icon: "Lightbulb",
        title: "Real Outcomes",
        description: "Documented project results and impact",
      },
      {
        icon: "ClipboardCheck",
        title: "Verified Projects",
        description: "Every case study independently verified",
      },
      {
        icon: "Building2",
        title: "Multi-sector",
        description: "Spanning commercial, industrial and community",
      },
      {
        icon: "Activity",
        title: "Live Results",
        description: "Up-to-date with completed project data",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  insights: {
    image:
      "/images/projects/commercial/dhl/nexgen-dhl-reading-schneider-conveyor-control-panels.jpg",
    icon: <Lightbulb className="h-8 w-8 text-electric-cyan" />,
    headline: ["ELECTRICAL", "MARKET INTELLIGENCE"],
    trustIndicators: [
      {
        icon: "BookOpen",
        title: "Market Intelligence",
        description: "In-depth sector analysis and trends",
      },
      {
        icon: "Activity",
        title: "Industry Updates",
        description: "Latest news from the electrical sector",
      },
      {
        icon: "Lightbulb",
        title: "Strategic Insights",
        description: "Expert commentary and analysis",
      },
      {
        icon: "Users",
        title: "Sector Coverage",
        description: "Residential, commercial and industrial",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  reviews: {
    image:
      "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-first-fix-complete.jpg",
    icon: <MessageSquareQuote className="h-8 w-8 text-electric-cyan" />,
    headline: ["CLIENT", "STORIES &", "REVIEWS"],
    trustIndicators: [
      {
        icon: "Star",
        title: "Client Reviews",
        description: "Verified testimonials from clients",
      },
      {
        icon: "ThumbsUp",
        title: "5-Star Service",
        description: "Consistently top-rated by customers",
      },
      {
        icon: "Users",
        title: "Community Trust",
        description: "Built through quality and reliability",
      },
      {
        icon: "Heart",
        title: "Customer First",
        description: "Service excellence at every stage",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
  commercial: {
    image:
      "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-lighting-installation.jpg",
    icon: <Building2 className="h-8 w-8 text-electric-cyan" />,
    headline: ["COMMERCIAL", "ELECTRICAL", "DELIVERY"],
    trustIndicators: [
      {
        icon: "CheckCircle",
        title: "Quality Assured",
        description: "NICEIC certified delivery on every commercial project",
      },
      {
        icon: "Shield",
        title: "Safe Installation",
        description: "Strict HSE compliance across all electrical work",
      },
      {
        icon: "Activity",
        title: "Progress Tracking",
        description: "Real-time updates from first survey to final sign-off",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Handover",
        description: "Test certificates and certification packs as standard",
      },
    ] as const satisfies readonly TrustIndicatorItem[],
  },
};

const fallbackConfig = {
  image: "/images/services-commercial.jpg",
  icon: <FolderOpen className="h-8 w-8 text-electric-cyan" />,
  headline: ["EDITORIAL", "COVERAGE"],
  trustIndicators: [
    {
      icon: "Shield",
      title: "Fully Certified",
      description: "NICEIC approved contractor",
    },
    {
      icon: "BookOpen",
      title: "Expert Editorial",
      description: "Content verified by specialists",
    },
    {
      icon: "Activity",
      title: "Live Updates",
      description: "Real-time news and updates",
    },
    {
      icon: "Users",
      title: "Sector Coverage",
      description: "Across all electrical disciplines",
    },
  ] as const satisfies readonly TrustIndicatorItem[],
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
  const [isLoaded] = useState(() => typeof window !== "undefined");
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const config = categoryConfig[category.slug] ?? fallbackConfig;

  const statuses = [
    "INITIALIZING",
    "LOADING_CATEGORY",
    "INDEXING_ARTICLES",
    "CATEGORY_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToArticles = () => {
    const el = document.getElementById("category-intro");
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
                Category // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/90 uppercase font-bold"
          >
            <Link
              href="/news-hub"
              className="transition-colors hover:text-electric-cyan text-white/90"
            >
              News Hub
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href="/news-hub/category"
              className="transition-colors hover:text-electric-cyan text-white/90"
            >
              Categories
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-electric-cyan">{category.label}</span>
          </motion.nav>

          {/* Icon */}
          {/* <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-xl border border-white bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="flex items-center justify-center w-9 h-9 text-white">
                  {config.icon}
                </span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl border border-electric-cyan/20"
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div> */}

          {/* Article count eyebrow */}
          {/* <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              {articleCount} Article{articleCount !== 1 ? "s" : ""}
            </span>
            <span className="h-px w-12 bg-electric-cyan" />
          </motion.div> */}

          {/* Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_CATEGORY_IMAGE}>
            <span className="block">{config.headline[0]}</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              {config.headline[1]}
            </span>
            {config.headline[2] && (
              <span className="block">{config.headline[2]}</span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {category.description}
          </motion.p>

          {/* Trust indicators */}
          <HeroTrustIndicators
            items={config.trustIndicators}
            variant="image-overlay"
          />

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-white/80 font-bold uppercase"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>4 Active Articles</span>
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
          className="flex cursor-pointer flex-col items-center gap-2 text-white/80 font-bold hover:text-electric-cyan transition-colors duration-300"
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
