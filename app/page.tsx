import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { createStandardPageMetadata } from "@/lib/metadata";
import {
  Services,
  Features,
  Schematic,
  Dashboard,
  Illumination,
  SmartLiving,
  CTAPower,
  Footer,
} from "@/components/sections";

export const metadata: Metadata = createStandardPageMetadata({
  title: "Nexgen Electrical Innovations | Powering the Future",
  description:
    "Expert electrical engineering and installations for commercial and industrial frontiers. High-voltage solutions delivered with precision.",
  path: "/",
});

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section with animated electrical grid */}
      <Hero />

      {/* Core Services Grid */}
      <Services />

      {/* Illumination Reveal - Industrial Showcase */}
      <Illumination />

      {/* Animated Feature Cards */}
      <Features />

      {/* Schematic Architecture Section */}
      <Schematic />

      {/* Live Dashboard with metrics */}
      <Dashboard />

      {/* Smart Living - Residential Showcase */}
      <SmartLiving />

      {/* Power Your Vision - Final CTA */}
      <CTAPower />

      {/* Footer */}
      <Footer />
    </main>
  );
}
