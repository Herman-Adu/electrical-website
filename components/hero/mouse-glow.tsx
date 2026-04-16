"use client";

import React, { useEffect, useRef, useState } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on component mount
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 1024;
    setIsMobile(checkMobile());

    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse move handler - only runs on desktop (effect early returns if mobile)
  useEffect(() => {
    if (isMobile) return; // Skip on mobile

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // Direct CSS variable manipulation for 60fps performance
        glowRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        glowRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(
          600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
          rgba(0, 243, 189, 0.08), 
          transparent 40%
        )`,
      }}
    />
  );
}
