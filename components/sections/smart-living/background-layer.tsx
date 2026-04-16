"use client";

import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";

export interface BackgroundLayerProps {
  brightnessOverlayOpacity: MotionValue<number>;
  glowOpacity: MotionValue<number>;
}

export function BackgroundLayer({
  brightnessOverlayOpacity,
  glowOpacity,
}: BackgroundLayerProps) {
  return (
    <>
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full will-change-opacity">
          <Image
            src="/images/smart-living-interior.jpg"
            alt="Modern smart home interior with professional lighting"
            fill
            className="object-cover"
          />
          {/* GPU-accelerated brightness control via opacity overlay instead of filter */}
          <motion.div
            className="absolute inset-0 bg-black mix-blend-multiply will-change-opacity"
            style={{ opacity: brightnessOverlayOpacity }}
          />
        </div>

        {/* Glow elements with opacity animation only (no filter) */}
        <motion.div
          className="absolute top-[15%] left-[30%] w-64 h-64 rounded-full bg-amber-500/20 blur-3xl will-change-opacity"
          style={{ opacity: glowOpacity }}
        />
        <motion.div
          className="absolute top-[20%] right-[25%] w-48 h-48 rounded-full bg-amber-400/15 blur-2xl will-change-opacity"
          style={{ opacity: glowOpacity }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[45%] w-56 h-56 rounded-full bg-amber-300/10 blur-3xl will-change-opacity"
          style={{ opacity: glowOpacity }}
        />
      </div>

      {/* Light beam effect - GPU accelerated with transform */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-32 bg-linear-to-b from-transparent via-amber-500/5 to-transparent will-change-transform"
          animate={{
            y: ["-10%", "110%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          initial={{ y: "-10%" }}
        />
      </div>
    </>
  );
}
