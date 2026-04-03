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
import { Footer } from "@/components/sections";
import contactData from "@/data/strapi-mock/marketing/contact.json";
import type {
  MarketingContactContent,
  MarketingIconName,
} from "@/types/marketing";
import { Mail, MessageSquare, Shield, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Electrical Services",
  description:
    "Get in touch with our team. Submit inquiries, follow up on service requests, or reach out for partnerships and feedback.",
};

const contactContent = contactData as MarketingContactContent;
const { hero, trustIndicators, faqTeaser } = contactContent;

const iconMap = {
  Mail,
  MessageSquare,
  Shield,
  Clock,
} as const;

type IconName = keyof typeof iconMap;

const getIcon = (name?: MarketingIconName) =>
  name ? iconMap[name as IconName] : undefined;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              {(() => {
                const BadgeIcon = getIcon(hero.badge.icon);
                return BadgeIcon ? (
                  <BadgeIcon className="h-4 w-4 text-accent" />
                ) : null;
              })()}
              <span className="text-sm font-medium text-accent">
                {hero.badge.text}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              {hero.title}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {hero.description}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {trustIndicators.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={item.title}
                  className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  {Icon ? (
                    <Icon className="h-6 w-6 text-accent mx-auto mb-2" />
                  ) : null}
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
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
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
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
