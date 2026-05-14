import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { createPageMetadata } from "@/lib/metadata";
import {
  Services,
  Schematic,
  Illumination,
  SmartLiving,
  CTAPower,
  Footer,
} from "@/components/sections";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { homeIntroData } from "@/data/home";

export const metadata: Metadata = createPageMetadata({
  title: "Nexgen Electrical Innovations | Powering the Future",
  description:
    "Expert electrical engineering and installations for commercial and industrial frontiers. High-voltage solutions delivered with precision.",
  path: "/",
  keywords: [
    "electrical engineering",
    "commercial electrical",
    "industrial electrical",
    "power solutions",
    "electrical contractor London",
    "NICEIC approved",
  ],
  ogType: "website",
});

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section with animated electrical grid */}
      <Hero />

      <ContentBreadcrumb
        items={[{ label: "Home", href: "/", isCurrent: true }]}
        section="home"
      />

      {/* Home Introduction */}
      <SectionIntro data={homeIntroData} />

      {/* Core Services Grid */}
      <Services />

      {/* Illumination Reveal - Industrial Showcase */}
      <Illumination />

      {/* Schematic Architecture Section */}
      <Schematic />

      {/* Smart Living - Residential Showcase */}
      <SmartLiving />

      {/* Power Your Vision - Final CTA */}
      <CTAPower />

      {/* Footer */}
      <Footer />
    </main>
  );
}
