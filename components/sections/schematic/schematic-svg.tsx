"use client";

import type React from "react";

type SchematicSvgProps = {
  svgRef: React.RefObject<SVGSVGElement | null>;
};

export function SchematicSvg({ svgRef }: SchematicSvgProps) {
  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 bg-electric-cyan/5 blur-3xl rounded-full" />

      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-[0_0_20px_rgba(0,243,189,0.15)]"
      >
        <g className="schematic-lines">
          <path
            className="schematic-path"
            d="M50 50 H450 V450 H50 Z"
            stroke="var(--electric-cyan)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />

          <path
            className="schematic-path"
            d="M50 200 H250"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            className="schematic-path"
            d="M250 50 V200"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            className="schematic-path"
            d="M250 200 V350 H450"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            className="schematic-path"
            d="M50 350 H250"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />

          <path
            className="schematic-path"
            d="M100 100 L100 150 L200 150"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            fill="none"
          />
          <path
            className="schematic-path"
            d="M350 100 L350 280 L400 280"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            fill="none"
          />
          <path
            className="schematic-path"
            d="M150 280 L150 400 L300 400"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <g>
          <circle
            className="schematic-dot"
            cx="100"
            cy="100"
            r="6"
            fill="var(--electric-cyan)"
          />
          <circle
            className="schematic-dot"
            cx="200"
            cy="150"
            r="4"
            fill="var(--electric-cyan)"
          />
          <circle
            className="schematic-dot"
            cx="350"
            cy="100"
            r="6"
            fill="var(--electric-cyan)"
          />
          <circle
            className="schematic-dot"
            cx="400"
            cy="280"
            r="4"
            fill="var(--electric-cyan)"
          />
          <circle
            className="schematic-dot"
            cx="150"
            cy="280"
            r="6"
            fill="var(--electric-cyan)"
          />
          <circle
            className="schematic-dot"
            cx="300"
            cy="400"
            r="4"
            fill="var(--electric-cyan)"
          />

          <circle
            className="schematic-dot"
            cx="250"
            cy="200"
            r="10"
            fill="none"
            stroke="var(--electric-cyan)"
            strokeWidth="2"
          />
          <circle
            className="schematic-dot"
            cx="250"
            cy="200"
            r="5"
            fill="var(--electric-cyan)"
          />
        </g>

        <g fill="var(--electric-cyan)" fontSize="10" fontFamily="monospace">
          <text className="schematic-label" x="80" y="90">
            PWR_IN
          </text>
          <text className="schematic-label" x="330" y="90">
            DIST_A
          </text>
          <text className="schematic-label" x="130" y="270">
            DIST_B
          </text>
          <text className="schematic-label" x="235" y="220">
            MAIN
          </text>
        </g>

        <g
          className="measurements"
          stroke="var(--electric-cyan)"
          strokeWidth="0.5"
          opacity="0.3"
        >
          <line x1="50" y1="40" x2="450" y2="40" />
          <line x1="50" y1="35" x2="50" y2="45" />
          <line x1="450" y1="35" x2="450" y2="45" />
          <text
            x="230"
            y="35"
            fill="var(--electric-cyan)"
            fontSize="8"
            fontFamily="monospace"
          >
            400m
          </text>
        </g>
      </svg>

      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-electric-cyan/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-electric-cyan/30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-electric-cyan/30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-electric-cyan/30" />
    </div>
  );
}
