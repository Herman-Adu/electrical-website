/**
 * Contact Us Page
 *
 * Features multi-step contact form, office hours, location map,
 * and quick contact options with glassmorphic design
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ContactFormContainer } from "@/features/contact";
import { OfficeHoursCard } from "@/components/molecules/office-hours-card";
import { LocationMapCard } from "@/components/molecules/location-map-card";
import { QuickContactCard } from "@/components/molecules/quick-contact-card";
import {
  ContactCTA,
  ContactHero,
  ContactIntro,
  Footer,
} from "@/components/sections";
import contactData from "@/data/strapi-mock/marketing/contact.json";
import type { MarketingContactContent } from "@/types/marketing";

export const metadata: Metadata = {
  title: "Contact Us | Electrical Services",
  description:
    "Get in touch with our team. Submit inquiries, follow up on service requests, or reach out for partnerships and feedback.",
};

const contactContent = contactData as MarketingContactContent;
const { hero, trustIndicators } = contactContent;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <ContactHero hero={hero} trustIndicators={trustIndicators} />
      <ContactIntro />

      {/* Main Content */}
      <section
        id="contact-form-section"
        className="section-container py-8 sm:py-12"
      >
        <div className="section-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ContactFormContainer />
            </div>

            {/* Sidebar - Office Info */}
            <div className="space-y-6">
              <QuickContactCard />
              <OfficeHoursCard />
              <LocationMapCard />
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />

      <Footer />
    </main>
  );
}
