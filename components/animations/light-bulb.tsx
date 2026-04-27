"use client";

import { motion } from "framer-motion";
import { useEffect, useState, startTransition } from "react";

interface LightBulbProps {
  progress: number; // 0-100
  className?: string;
  showPercent?: boolean;
}

/**
 * Animated Light Bulb Component
 * Brightness increases with form progress
 * Flickers and surges when progress changes
 */
export function LightBulb({
  progress,
  className = "",
  showPercent = true,
}: LightBulbProps) {
  const [isFlickering, setIsFlickering] = useState(false);

  // Trigger flicker effect when progress changes
  useEffect(() => {
    if (progress > 0) {
      setIsFlickering(true);
      const timer = setTimeout(() => startTransition(() => setIsFlickering(false)), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Calculate brightness based on progress
  const brightness = Math.max(0.2, progress / 100);
  const glowIntensity = Math.max(0, (progress / 100) * 20);

  return (
    <div className={`relative ${className}`}>
      {/* Light rays */}
      {progress > 20 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlickering ? [0.3, 0.7, 0.3] : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-gradient-to-t from-accent/0 to-accent/80"
              style={{
                height: `${40 + glowIntensity}px`,
                transform: `rotate(${i * 45}deg)`,
                transformOrigin: "bottom center",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleY: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Bulb SVG */}
      <motion.svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          isFlickering
            ? {
                filter: [
                  `drop-shadow(0 0 ${glowIntensity}px oklch(0.9 0.25 85))`,
                  `drop-shadow(0 0 ${glowIntensity * 1.5}px oklch(0.9 0.25 85))`,
                  `drop-shadow(0 0 ${glowIntensity}px oklch(0.9 0.25 85))`,
                ],
              }
            : {
                filter: `drop-shadow(0 0 ${glowIntensity}px oklch(0.9 0.25 85))`,
              }
        }
        transition={{ duration: 0.2 }}
      >
        {/* Bulb glass */}
        <motion.path
          d="M 40 10 C 50 10 58 18 58 28 C 58 35 55 40 52 45 L 52 55 L 28 55 L 28 45 C 25 40 22 35 22 28 C 22 18 30 10 40 10 Z"
          fill={`oklch(${0.5 + brightness * 0.4} 0.15 85 / ${brightness})`}
          stroke="oklch(0.7 0.1 85)"
          strokeWidth="1.5"
          animate={{
            fill: isFlickering
              ? [
                  `oklch(${0.5 + brightness * 0.4} 0.15 85 / ${brightness})`,
                  `oklch(${0.6 + brightness * 0.5} 0.2 85 / ${brightness * 1.3})`,
                  `oklch(${0.5 + brightness * 0.4} 0.15 85 / ${brightness})`,
                ]
              : `oklch(${0.5 + brightness * 0.4} 0.15 85 / ${brightness})`,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Filament */}
        <motion.path
          d="M 35 25 Q 37 30 35 35 Q 33 40 35 45 M 45 25 Q 43 30 45 35 Q 47 40 45 45"
          stroke={`oklch(0.95 0.25 85 / ${brightness * 1.2})`}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{
            opacity: isFlickering
              ? [brightness, brightness * 1.5, brightness]
              : brightness,
            strokeWidth: isFlickering ? [2, 2.5, 2] : 2,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Base threading */}
        <rect
          x="30"
          y="55"
          width="20"
          height="4"
          fill="oklch(0.4 0.05 85)"
          rx="1"
        />
        <rect
          x="30"
          y="60"
          width="20"
          height="4"
          fill="oklch(0.35 0.05 85)"
          rx="1"
        />
        <rect
          x="30"
          y="65"
          width="20"
          height="4"
          fill="oklch(0.4 0.05 85)"
          rx="1"
        />

        {/* Base contact */}
        <rect
          x="32"
          y="70"
          width="16"
          height="8"
          fill="oklch(0.3 0.05 85)"
          rx="2"
        />
      </motion.svg>

      {/* Progress percentage */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold"
        style={{ display: showPercent ? undefined : "none" }}
        animate={{
          color: `oklch(${0.6 + brightness * 0.3} 0.2 85)`,
          textShadow: `0 0 ${glowIntensity / 2}px oklch(0.9 0.25 85)`,
        }}
      >
        {Math.round(progress)}%
      </motion.div>
    </div>
  );
}
