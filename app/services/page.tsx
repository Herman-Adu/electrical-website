import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesBento } from "@/components/services/services-bento";
import { Footer } from "@/components/sections/footer";
import { createStandardPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createStandardPageMetadata({
  title: "Services | Nexgen Electrical Innovations",
  description:
    "Comprehensive electrical solutions — commercial installations, industrial systems, power distribution, residential services, energy management, and 24/7 emergency response.",
  keywords: [
    "electrical services",
    "commercial electrical",
    "industrial electrical",
    "power distribution",
    "energy management",
    "24/7 emergency electrical",
    "EV charger installation",
    "smart home wiring",
  ],
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesBento />
      <Footer />
    </main>
  );
}
