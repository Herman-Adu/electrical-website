"use client";

import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";

interface BackgroundParallaxProps {
  imageY: MotionValue<string>;
  brightnessOverlayOpacity: MotionValue<number>;
}

export function BackgroundParallax({
  imageY,
  brightnessOverlayOpacity,
}: BackgroundParallaxProps) {
  return (
    <>
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <div className="relative w-full h-[120%]">
          <Image
            src="/images/warehouse-lighting.jpg"
            alt="Industrial warehouse lighting installation"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* GPU-accelerated brightness control via opacity overlay instead of filter */}
          <motion.div
            className="absolute inset-0 bg-black mix-blend-multiply will-change-opacity"
            style={{ opacity: brightnessOverlayOpacity }}
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-(--deep-black) via-(--deep-black)/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-(--deep-black)/80 via-transparent to-(--deep-black)/40" />
      </motion.div>

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent" />
    </>
  );
}
