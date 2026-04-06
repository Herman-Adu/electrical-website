import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesBento } from "@/components/services/services-bento";
import { Footer } from "@/components/sections/footer";
import { createPageMetadata } from "@/lib/metadata";
import { ContentBreadcrumb } from "@/components/shared";
import { MultiStepFormContainer } from "@/features/service-request";

export const metadata: Metadata = createPageMetadata({
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
      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services", isCurrent: true },
        ]}
        section="services"
      />
      <ServicesBento />

      <section
        id="service-request"
        className="section-container py-10 sm:py-14"
      >
        <div className="section-content max-w-5xl">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric-cyan mb-3">
              Service Request
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Request Electrical Service
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Submit your request using the guided form below. We’ll prioritise
              your response based on urgency.
            </p>
          </div>

          <MultiStepFormContainer />
        </div>
      </section>

      <Footer />
    </main>
  );
}
