"use client";

import React, { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "fade";

export interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
  once?: boolean;
  margin?: string;
  children: React.ReactNode;
}

/**
 * ScrollReveal — Reusable per-element scroll animation component
 *
 * Each wrapped element gets its own useInView trigger, animating when IT enters
 * the viewport (not when a parent container enters). Supports directional
 * entrance animations with optional blur effect and reduced-motion accessibility.
 *
 * @example
 * <ScrollReveal direction="up" blur delay={0.1}>
 *   <div>This card fades in and rises as you scroll to it</div>
 * </ScrollReveal>
 */
export function ScrollReveal({
  direction = "up",
  delay = 0,
  duration = 0.65,
  distance = 40,
  blur = false,
  once = true,
  margin = "0px 0px -80px 0px",
  className,
  children,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as any });
  const prefersReducedMotion = useReducedMotion();

  // Offset based on direction
  const getOffset = () => {
    if (prefersReducedMotion) {
      return { x: 0, y: 0 };
    }

    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: -distance, y: 0 };
      case "right":
        return { x: distance, y: 0 };
      case "fade":
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  // Variant definitions
  const variants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.97,
      ...offset,
      ...(blur && !prefersReducedMotion ? { filter: "blur(4px)" } : {}),
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      ...(blur && !prefersReducedMotion ? { filter: "blur(0px)" } : {}),
      transition: {
        duration: prefersReducedMotion ? 0.15 : duration,
        delay,
        ease: "easeOut" as any,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      style={{
        willChange: isInView ? "auto" : "opacity, transform",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
