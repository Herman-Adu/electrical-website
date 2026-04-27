'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

export function CircuitSVG() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkMobile();
    checkDarkMode();
    window.addEventListener('resize', checkMobile);
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || isMobile) return;

    // Animate sparks along the circuit paths
    const sparks = svgRef.current.querySelectorAll('.spark');
    const paths = ['#circuit-path-1', '#circuit-path-2', '#circuit-path-3'];

    sparks.forEach((spark, index) => {
      const pathId = paths[index % paths.length];
      
      gsap.to(spark, {
        duration: 3 + index * 0.5,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: pathId,
          align: pathId,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
      });

      // Flicker effect
      gsap.to(spark, {
        opacity: 0.3,
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'rough({ strength: 1, points: 10, randomize: true })',
      });
    });

  }, [isMobile]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-30 lg:opacity-50">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        className="w-full h-full max-w-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Glow filter for sparks */}
          <filter id="spark-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Gradient for circuit lines - theme-aware */}
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(174, 100%, 50%)" stopOpacity={isDarkMode ? "0.1" : "0.15"} />
            <stop offset="50%" stopColor="hsl(174, 100%, 50%)" stopOpacity={isDarkMode ? "0.4" : "0.35"} />
            <stop offset="100%" stopColor="hsl(174, 100%, 50%)" stopOpacity={isDarkMode ? "0.1" : "0.15"} />
          </linearGradient>
        </defs>

        {/* Main Circuit Paths - Pylon-inspired design */}
        <g className="circuit-lines">
          {/* Central vertical tower */}
          <path
            id="circuit-path-1"
            className="circuit-path"
            d="M600 50 L600 200 L500 350 L600 400 L700 350 L600 200"
            stroke="url(#circuit-gradient)"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Left power line */}
          <path
            id="circuit-path-2"
            className="circuit-path"
            d="M100 400 L300 350 L450 380 L500 350 L600 400"
            stroke="url(#circuit-gradient)"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Right power line */}
          <path
            id="circuit-path-3"
            className="circuit-path"
            d="M1100 400 L900 350 L750 380 L700 350 L600 400"
            stroke="url(#circuit-gradient)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Lower distribution lines */}
          <path
            className="circuit-path"
            d="M600 400 L600 550 L400 650 L200 700"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
          />
          <path
            className="circuit-path"
            d="M600 400 L600 550 L800 650 L1000 700"
            stroke="url(#circuit-gradient)"
            strokeWidth="1"
            fill="none"
          />

          {/* Cross connections */}
          <path
            className="circuit-path"
            d="M400 650 L500 600 L700 600 L800 650"
            stroke="url(#circuit-gradient)"
            strokeWidth="0.75"
            fill="none"
          />

          {/* Decorative horizontal lines */}
          <path
            className="circuit-path"
            d="M50 300 L250 300"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <path
            className="circuit-path"
            d="M950 300 L1150 300"
            stroke="var(--electric-cyan)"
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* Junction Nodes */}
        <g className="junction-nodes">
          {/* Main tower top */}
          <circle cx="600" cy="50" r="4" fill="var(--electric-cyan)" className="animate-glow-hum" />

          {/* Tower intersection */}
          <circle cx="600" cy="200" r="6" fill="var(--electric-cyan)" opacity="0.8" />
          <circle cx="600" cy="200" r="10" fill="none" stroke="var(--electric-cyan)" strokeWidth="1" opacity="0.4" />

          {/* Mid points */}
          <circle cx="500" cy="350" r="3" fill="var(--electric-cyan)" className="animate-pulse" />
          <circle cx="700" cy="350" r="3" fill="var(--electric-cyan)" className="animate-pulse" />

          {/* Central hub */}
          <circle cx="600" cy="400" r="8" fill="var(--electric-cyan)" opacity="0.6" />
          <circle cx="600" cy="400" r="14" fill="none" stroke="var(--electric-cyan)" strokeWidth="1.5" opacity="0.3" />
          <circle cx="600" cy="400" r="20" fill="none" stroke="var(--electric-cyan)" strokeWidth="0.5" opacity="0.2" />

          {/* Distribution nodes */}
          <circle cx="400" cy="650" r="4" fill="var(--electric-cyan)" className="animate-glow-hum" />
          <circle cx="800" cy="650" r="4" fill="var(--electric-cyan)" className="animate-glow-hum" />

          {/* End points */}
          <circle cx="200" cy="700" r="3" fill="var(--electric-cyan)" opacity="0.6" />
          <circle cx="1000" cy="700" r="3" fill="var(--electric-cyan)" opacity="0.6" />

          {/* Outer connection points */}
          <circle cx="100" cy="400" r="3" fill="var(--electric-cyan)" opacity="0.5" />
          <circle cx="1100" cy="400" r="3" fill="var(--electric-cyan)" opacity="0.5" />
        </g>

        {/* Traveling Sparks */}
        <g className="sparks">
          <circle
            className="spark"
            r="4"
            fill="var(--electric-cyan)"
            filter="url(#spark-glow)"
          />
          <circle
            className="spark"
            r="3"
            fill="var(--electric-cyan)"
            filter="url(#spark-glow)"
          />
          <circle
            className="spark"
            r="3"
            fill="var(--electric-cyan)"
            filter="url(#spark-glow)"
          />
        </g>

        {/* Technical Labels */}
        <g className="labels" fill="var(--electric-cyan)" opacity="0.4" fontSize="8" fontFamily="monospace">
          <text x="610" y="45">PWR_NODE_001</text>
          <text x="610" y="395">MAIN_HUB</text>
          <text x="80" y="390">IN_FEED_L</text>
          <text x="1020" y="390">IN_FEED_R</text>
        </g>
      </svg>
    </div>
  );
}
