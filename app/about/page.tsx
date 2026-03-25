import { Metadata } from "next";
import { Footer } from "@/components/sections";
import {
  AboutHero,
  CompanyTimeline,
  PeaceOfMind,
  VisionMission,
  Certifications,
  CommunitySection,
  AboutCTA,
} from "@/components/about";
import {
  SectionIntro,
  SectionProfile,
  SectionValues,
} from "@/components/shared";
import {
  companyIntroData,
  director1Data,
  director2Data,
  coreValuesData,
} from "@/data/about";
import { createStandardPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createStandardPageMetadata({
  title: "About Us | Nexgen Electrical Innovations",
  description:
    "Meet the team behind Nexgen Electrical Innovations. NICEIC Approved Contractors delivering gold-standard electrical engineering across London and the Home Counties since 2009.",
  path: "/about",
  openGraphTitle: "About Nexgen Electrical Innovations",
  openGraphDescription:
    "Gold-standard electrical engineering, community commitment, and 15 years of excellence.",
});

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Section 1: Cinematic Hero */}
      <AboutHero />

      {/* Section 2: Company Introduction (shared component) */}
      <SectionIntro data={companyIntroData} />

      {/* Section 3: Director 1 — Image left, text right (shared component) */}
      <SectionProfile data={director1Data} />

      {/* Section 4: Director 2 — Text left, image right (shared component) */}
      <SectionProfile data={director2Data} />

      {/* Section 5: Company History Timeline */}
      <CompanyTimeline />

      {/* Section 6: Peace of Mind Guaranteed */}
      <PeaceOfMind />

      {/* Section 7 & 8: Vision & Mission */}
      <VisionMission />

      {/* Section 9: Certifications Bento Grid */}
      <Certifications />

      {/* Section 10: Core Values (shared component) */}
      <SectionValues data={coreValuesData} />

      {/* Section 11: Community Section */}
      <CommunitySection />

      {/* Section 12: Why Choose Us + Social + CTA */}
      <AboutCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
