"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Zap, Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "./blueprint-background";
import { MouseGlow } from "./mouse-glow";
import { CircuitSVG } from "./circuit-svg";

const isClient = typeof window !== "undefined";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
    },
  },
} as const;

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.5, 1, 0.8, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.3, 0.5, 0.7, 1],
    },
  },
};

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const surgeOverlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING");

  // Boot sequence effect
  useEffect(() => {
    setIsLoaded(true);
    const statuses = [
      "INITIALIZING",
      "LOADING_MODULES",
      "CALIBRATING",
      "SYSTEM_READY",
    ];
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < statuses.length) {
        setStatusText(statuses[index]);
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger for parallax - dynamically imported to avoid SSR
  useEffect(() => {
    if (!isClient || !containerRef.current || !heroContentRef.current) return;

    let ctx: gsap.Context | null = null;

    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        // Parallax effect on scroll - y only, never touch opacity (Framer Motion owns that)
        gsap.to(heroContentRef.current, {
          y: 80,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        // Circuit lines draw-in animation
        const circuitPaths =
          containerRef.current?.querySelectorAll(".circuit-path");
        circuitPaths?.forEach((path) => {
          const length = (path as SVGPathElement).getTotalLength?.() || 1000;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            delay: 0.5,
            ease: "power2.out",
          });
        });
      }, containerRef);
    });

    return () => {
      ctx?.revert();
    };
  }, []);

  // Power Surge Animation
  const triggerSurge = () => {
    if (!surgeOverlayRef.current || !heroContentRef.current) return;

    const tl = gsap.timeline();
    const electricText = heroContentRef.current.querySelector(".text-electric");

    tl.to(surgeOverlayRef.current, {
      opacity: 0.9,
      duration: 0.05,
      repeat: 4,
      yoyo: true,
      ease: "none",
    }).to(
      heroContentRef.current,
      {
        scale: 1.02,
        duration: 0.1,
      },
      "<",
    );

    if (electricText) {
      tl.to(
        electricText,
        {
          textShadow: "0 0 30px #00f2ff, 0 0 60px #00f2ff",
          duration: 0.1,
        },
        "<",
      );
    }

    tl.to(surgeOverlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    }).to(
      heroContentRef.current,
      {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.3",
    );

    if (electricText) {
      tl.to(
        electricText,
        {
          textShadow: "0 0 10px rgba(0, 242, 255, 0.5)",
          duration: 0.5,
        },
        "-=0.3",
      );
    }
  };

  const scrollToContent = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <BlueprintBackground />
      <MouseGlow />
      <CircuitSVG />

      {/* Main Content */}
      <motion.div
        ref={heroContentRef}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="relative z-30 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Status Label */}
        <motion.div
          variants={flickerVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="flex items-center gap-3 border-l-2 border-[var(--electric-cyan)] pl-4">
            <Activity
              size={14}
              className="text-[var(--electric-cyan)] animate-pulse"
            />
            <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--electric-cyan)]/80 uppercase">
              Status // {statusText}
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black text-foreground uppercase tracking-tight leading-[0.9] mb-6"
        >
          <span className="block">Powering the</span>
          <span className="block text-electric text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric-cyan)] via-cyan-400 to-blue-500">
            Next Generation
          </span>
          <span className="block">of Innovation</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Expert electrical engineering and installations for commercial and
          industrial frontiers. Precision-engineered power solutions delivered
          with absolute excellence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={triggerSurge}
            className="group relative px-8 py-4 bg-[var(--electric-cyan)] text-primary-foreground font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              Initiate System
              <Zap size={18} className="group-hover:animate-pulse" />
            </span>
            {/* Hover sweep effect */}
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </button>

          <button className="px-8 py-4 border border-border text-foreground font-bold uppercase tracking-widest hover:border-[var(--electric-cyan)] hover:text-[var(--electric-cyan)] transition-all duration-300 text-sm">
            Our Solutions
          </button>
        </motion.div>

        {/* Technical Metadata */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap justify-center gap-8 text-[10px] font-mono tracking-[0.2em] text-muted-foreground/60 uppercase"
        >
          <span>Est. 2024</span>
          <span className="hidden sm:inline">|</span>
          <span>Commercial & Industrial</span>
          <span className="hidden sm:inline">|</span>
          <span>24/7 Operations</span>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--electric-cyan)] transition-colors cursor-pointer"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <ChevronDown size={20} className="animate-bounce" />
      </motion.button>

      {/* Power Surge Overlay */}
      <div
        ref={surgeOverlayRef}
        className="fixed inset-0 bg-[var(--electric-cyan)] opacity-0 z-50 pointer-events-none mix-blend-overlay"
      />
    </section>
  );
}
