"use client";

import React, { useEffect, useRef, useState } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect mobile on component mount
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 1024;
    setIsMobile(checkMobile());

    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detect dark mode and watch for changes
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

  // Choose glow color based on theme
  const glowColor = isDarkMode
    ? "rgba(0, 243, 189, 0.08)" // electric-cyan for dark
    : "rgba(100, 116, 139, 0.08)"; // slate-500 for light

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(
          600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          ${glowColor},
          transparent 40%
        )`,
      }}
    />
  );
}
