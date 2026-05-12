"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_CATEGORY_IMAGE } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { ProjectCategory } from "@/types/projects";
import { HeroTrustIndicators } from "@/components/shared";
import type { TrustIndicatorItem } from "@/types/sections";

// Map each category slug to its dedicated hero image and trust indicators
const categoryConfig: Record<
  string,
  {
    image: string;
    accentWord: string;
    trustIndicators: readonly TrustIndicatorItem[];
  }
> = {
  residential: {
    image:
      "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-rear-patio-night-uplighters.jpg",
    accentWord: "Living",
    trustIndicators: [
      {
        icon: "Home",
        title: "Domestic Specialists",
        description:
          "Full rewires, consumer units, EV chargers and smart installs",
      },
      {
        icon: "CheckCircle",
        title: "Part P Certified",
        description:
          "All residential work registered and certified with council",
      },
      {
        icon: "Shield",
        title: "5-Year Guarantee",
        description: "Workmanship guarantee on every domestic installation",
      },
      {
        icon: "Lightbulb",
        title: "Smart Home Ready",
        description: "Future-ready wiring for home automation and EV charging",
      },
    ],
  },
  "commercial-lighting": {
    image:
      "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
    accentWord: "Illuminated",
    trustIndicators: [
      {
        icon: "Lightbulb",
        title: "Lighting Specialists",
        description:
          "Design-led commercial lighting from fitout to ongoing maintenance",
      },
      {
        icon: "Award",
        title: "NICEIC Certified",
        description:
          "Fully accredited commercial lighting installation and testing",
      },
      {
        icon: "Zap",
        title: "Energy Efficient",
        description: "LED and smart lighting upgrades that reduce energy spend",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Commissioning",
        description:
          "All lighting circuits tested, certified and fully documented",
      },
    ],
  },
  "power-boards": {
    image: "/images/hero-power-boards.jpg",
    accentWord: "Powered",
    trustIndicators: [
      {
        icon: "Zap",
        title: "HV-LV Specialists",
        description:
          "Main distribution boards from initial design to commissioning",
      },
      {
        icon: "Shield",
        title: "18th Edition",
        description:
          "Every panel built and tested to BS 7671 18th Edition standards",
      },
      {
        icon: "Settings",
        title: "Custom Build",
        description:
          "Bespoke DB and MCC panels for any industrial specification",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Certification",
        description: "Complete test certificates on every board installation",
      },
    ],
  },
  commercial: {
    image:
      "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
    accentWord: "Delivered",
    trustIndicators: [
      {
        icon: "CheckCircle",
        title: "Quality Assured",
        description:
          "NICEIC certified, Part P compliant delivery on every project",
      },
      {
        icon: "Shield",
        title: "Safe Installation",
        description:
          "Strict HSE compliance enforced across all electrical work",
      },
      {
        icon: "Activity",
        title: "Progress Tracking",
        description: "Real-time updates from first survey to final sign-off",
      },
      {
        icon: "ClipboardCheck",
        title: "Complete Handover",
        description:
          "Test certificates and certification packs included as standard",
      },
    ],
  },
  industrial: {
    image:
      "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-bank-staged.jpg",
    accentWord: "Delivered",
    trustIndicators: [
      {
        icon: "Zap",
        title: "HV Specialists",
        description:
          "High-voltage infrastructure, switchgear and distribution for industrial sites",
      },
      {
        icon: "Shield",
        title: "HSE Compliant",
        description:
          "Strict health and safety standards enforced on every industrial project",
      },
      {
        icon: "Activity",
        title: "Progress Tracking",
        description: "Real-time updates from first survey to final sign-off",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Certification",
        description:
          "Complete test certificates and handover packs on every installation",
      },
    ],
  },
  community: {
    image: "/images/community-hero.jpg",
    accentWord: "Connected",
    trustIndicators: [
      {
        icon: "Users",
        title: "Public Sector",
        description:
          "Delivering electrical infrastructure for community and public facilities",
      },
      {
        icon: "CheckCircle",
        title: "Fully Accredited",
        description:
          "NICEIC approved contractor for all public and social sector work",
      },
      {
        icon: "Shield",
        title: "Safe & Compliant",
        description:
          "Strict HSE and Part P compliance on every community project",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Handover",
        description:
          "Complete documentation and certification packs included as standard",
      },
    ],
  },
};

const fallbackConfig: {
  image: string;
  accentWord: string;
  trustIndicators: readonly TrustIndicatorItem[];
} = {
  image: "",
  accentWord: "Delivered",
  trustIndicators: [
    {
      icon: "CheckCircle",
      title: "Quality Assured",
      description:
        "NICEIC certified, Part P compliant delivery on every project",
    },
    {
      icon: "Shield",
      title: "Safe Installation",
      description: "Strict HSE compliance enforced across all electrical work",
    },
    {
      icon: "Activity",
      title: "Progress Tracking",
      description: "Real-time updates from first survey to final sign-off",
    },
    {
      icon: "ClipboardCheck",
      title: "Complete Handover",
      description:
        "Test certificates and certification packs included as standard",
    },
  ],
};

interface ProjectCategoryHeroProps {
  category: ProjectCategory;
  projectCount: number;
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

export function ProjectCategoryHero({
  category,
  projectCount,
}: ProjectCategoryHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const config = categoryConfig[category.slug] ?? fallbackConfig;
  const hasImage = Boolean(config.image);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const statuses = [
    "INITIALIZING",
    "LOADING_CATEGORY",
    "FETCHING_PROJECTS",
    "CATEGORY_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToProjects = () => {
    const el = document.getElementById("category-intro");
    if (el) scrollToElementWithOffset(el, { pageType: "default" });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        hasImage ? (
          <>
            <Image
              src={config.image}
              alt={`${category.label} category hero`}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
          </>
        ) : (
          <BlueprintBackground showScanLine={false} />
        )
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
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute size-1 rounded-full bg-electric-cyan/30"
                style={{
                  left: `${12 + i * 14}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
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
            className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/90 mb-6"
          >
            <Link
              href="/projects"
              className="text-white/90 hover:text-electric-cyan transition-colors"
            >
              Projects
            </Link>
            <span className="text-white/80">/</span>
            <Link
              href="/projects/category"
              className="hover:text-electric-cyan transition-colors"
            >
              Categories
            </Link>
            <span className="text-white/80">/</span>
            <span className="text-electric-cyan">{category.label}</span>
          </motion.nav>

          {/* Icon — commented out; replaced by HeroTrustIndicators below */}
          {false && null}

          {/* Project count eyebrow — commented out */}
          {false && null}

          {/* Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_CATEGORY_IMAGE}>
            <span className="block">{category.label}</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-red/500 via-electric-cyan to-red/500">
              {config.accentWord}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white mb-6 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {category.description}
          </motion.p>

          {/* Trust Indicators */}
          <HeroTrustIndicators
            items={config.trustIndicators}
            variants={itemVariants}
            variant="image-overlay"
          />

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-white/80 font-bold uppercase"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>4 Active Projects</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToProjects}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/80 transition-colors hover:text-electric-cyan"
          aria-label="Scroll to projects"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            View Projects
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
