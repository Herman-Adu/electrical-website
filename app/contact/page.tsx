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
import { ContactHero, Footer } from "@/components/sections";
import contactData from "@/data/strapi-mock/marketing/contact.json";
import type { MarketingContactContent } from "@/types/marketing";

export const metadata: Metadata = {
  title: "Contact Us | Electrical Services",
  description:
    "Get in touch with our team. Submit inquiries, follow up on service requests, or reach out for partnerships and feedback.",
};

const contactContent = contactData as MarketingContactContent;
const { hero, trustIndicators, faqTeaser } = contactContent;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <ContactHero hero={hero} trustIndicators={trustIndicators} />

      {/* Main Content */}
      <section className="section-container py-8 sm:py-12">
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

      {/* FAQ Teaser */}
      <section className="section-container bg-muted/30 py-12 sm:py-16">
        <div className="section-content">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {faqTeaser.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {faqTeaser.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {faqTeaser.items.map((item) => (
                <div
                  key={item.question}
                  className="p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50"
                >
                  <h3 className="font-medium text-foreground mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
