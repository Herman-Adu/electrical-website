"use client";

import { useEffect, useId, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export interface AnimatedProgressRingProps {
  value: number;
  inView: boolean;
  size?: number;
  strokeWidth?: number;
}

export function AnimatedProgressRing({
  value,
  inView,
  size = 120,
  strokeWidth = 8,
}: AnimatedProgressRingProps) {
  const gradientId = useId(); // Unique ID per instance (prevents collision if multiple rings render)
  const [progress, setProgress] = useState(0);
  const motionValue = useMotionValue(0);

  // Spring animation for smooth 60fps counter
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Listen to spring value changes and update progress
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = springValue.on("change", (latest: number) => {
        setProgress(Math.min(latest, value));
      });
    } catch {
      // Fallback if motion library not fully hydrated
      setProgress(motionValue.get());
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [springValue, value, motionValue]);

  // Trigger animation when inView changes
  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    } else {
      motionValue.set(0);
      setProgress(0);
    }
  }, [inView, value, motionValue]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#00f3bd" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white font-mono">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
