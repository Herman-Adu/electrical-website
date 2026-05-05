"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ReviewVerifiedBadgeProps {
  clientName: string;
  role: string;
  isVerified?: boolean;
}

export function ReviewVerifiedBadge({
  clientName,
  role,
  isVerified = true,
}: ReviewVerifiedBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-flex"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 shadow-[0_0_12px_rgba(0,243,189,0.08)]">
        {isVerified && (
          <svg
            aria-hidden="true"
            data-testid="verified-icon"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-electric-cyan"
          >
            <path
              d="M6 0.5L0.75 2.5V7C0.75 10.15 3.06 13.07 6 13.5C8.94 13.07 11.25 10.15 11.25 7V2.5L6 0.5Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path
              d="M4 7L5.5 8.5L8.5 5.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="text-sm font-semibold text-white">{clientName}</span>
        <span className="text-electric-cyan/40" aria-hidden="true">
          /
        </span>
        <span className="text-xs text-white/60">{role}</span>
      </span>
    </motion.div>
  );
}
