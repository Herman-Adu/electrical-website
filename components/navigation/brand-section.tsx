/**
 * BrandSection Component
 *
 * A reusable server component that renders the Nexgen brand logo and text.
 * Displays the brand logo with a glow effect on hover, paired with branded text.
 *
 * Features:
 * - Server-side rendered (no "use client" directive)
 * - Responsive logo sizing (scales to full navbar height)
 * - Vertical centering for both logo and text
 * - Smooth hover animations with scale and glow effects
 * - Proper Image optimization with Next.js Image component
 *
 * @component
 */

import Link from "next/link";
import Image from "next/image";

/**
 * Props for the BrandSection component
 */
interface BrandSectionProps {
  // No props currently required, but explicit empty interface for clarity
}

/**
 * BrandSection Component
 *
 * Renders the logo and text branding section with responsive styling
 * and hover effects. Fully vertically centered with proportional scaling.
 *
 * @param {BrandSectionProps} props - Component props (empty)
 * @returns {JSX.Element} The brand section containing logo and text
 */
export function BrandSection({}: BrandSectionProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group h-full">
      {/* Logo Container - Original size */}
      <div className="relative w-9 h-9 lg:w-9 lg:h-9 shrink-0">
        <Image
          src="/images/brand-assets/nexgen-logo-round.png"
          alt="Nexgen round logo"
          fill
          sizes="(max-width: 1024px) 36px, 40px"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          priority
        />
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-slate-500/20 dark:bg-electric-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
      </div>

      {/* Text Container - Increased text height without scaling logo */}
      <div className="flex flex-col justify-center h-full gap-0.5">
        <span className="text-slate-500 font-bold text-base tracking-tight leading-none">
          NEXGEN
        </span>
        <span className="font-mono text-base text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-[hsl(174_80%_45%)] to-[hsl(174_100%_35%)] uppercase leading-none font-bold">
          Electrical
        </span>
      </div>
    </Link>
  );
}
