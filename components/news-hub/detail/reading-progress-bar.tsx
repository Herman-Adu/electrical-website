"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP requires direct DOM access — useEffect is appropriate here
gsap.registerPlugin(ScrollTrigger);

export function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  // GSAP requires direct DOM access — useEffect is appropriate here
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        (bar as HTMLElement).style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-electric-cyan"
      ref={barRef}
      style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
      aria-hidden="true"
    />
  );
}
