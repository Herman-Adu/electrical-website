"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// GSAP requires direct DOM access — useEffect is appropriate here

interface CaseStudyStatusBadgeProps {
  status?: string;
}

export function CaseStudyStatusBadge({
  status = "Completed",
}: CaseStudyStatusBadgeProps) {
  const dotRef = useRef<HTMLSpanElement>(null);

  // GSAP requires direct DOM access — useEffect is appropriate here
  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const tween = gsap.to(dot, {
      boxShadow: "0 0 12px 4px rgba(0,243,189,0.8)",
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut",
    });

    return () => {
      tween?.kill();
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-3 py-1">
      <span
        ref={dotRef}
        className="h-2 w-2 rounded-full bg-electric-cyan"
        aria-hidden="true"
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
        {status}
      </span>
    </div>
  );
}
