"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlueprintBackgroundProps {
  className?: string;
  showScanLine?: boolean;
}

export function BlueprintBackground({
  className,
  showScanLine = true,
}: BlueprintBackgroundProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDarkMode = () =>
      document.documentElement.classList.contains("dark");
    setIsDarkMode(checkDarkMode());

    const observer = new MutationObserver(() => {
      setIsDarkMode(checkDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Prevent hydration mismatch by deferring render until client state is known
  if (isDarkMode === null) {
    return null;
  }

  // Light theme: slate-500 grey, Dark theme: electric-cyan
  const gridColor = isDarkMode ? "var(--electric-cyan)" : "var(--pylon-grey)";

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-hidden bg-background",
        className,
      )}
    >
      {/* Light theme: subtle background layer to enhance grid visibility */}
      {!isDarkMode && <div className="absolute inset-0 bg-slate-50" />}

      {/* Primary Grid - 40px */}
      <div
        className="absolute inset-0 h-full w-full opacity-20 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Secondary Grid - 10px (finer detail) */}
      <div
        className="absolute inset-0 h-full w-full opacity-[0.03] dark:opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px",
        }}
      />

      {/* Radial Gradient Vignette - Light mode uses a softer fade */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--deep-slate)_70%)] bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--deep-slate)_85%)]" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background to-transparent" />

      {/* Animated scan line effect - pauses when off-screen */}
      {showScanLine ? (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "calc(100% + 100vh)" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="pointer-events-none absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-slate-500/40 dark:via-electric-cyan/30 to-transparent will-change-transform"
        />
      ) : null}

      {/* Corner technical markers */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-slate-500/40 dark:border-electric-cyan/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-slate-500/40 dark:border-electric-cyan/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-slate-500/40 dark:border-electric-cyan/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-slate-500/40 dark:border-electric-cyan/20" />

      {/* Technical coordinate labels */}
      <div className="absolute top-6 left-20 font-mono text-[8px] text-slate-500/50 dark:text-electric-cyan/30 tracking-widest">
        X:0000 Y:0000
      </div>
      <div className="absolute top-6 right-20 font-mono text-[8px] text-slate-500/50 dark:text-electric-cyan/30 tracking-widest">
        SECTOR_A1
      </div>
    </div>
  );
}
