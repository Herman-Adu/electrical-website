import type { Metadata } from "next";
import { Contact, ContactHero, Footer } from "@/components/sections";
import { ContentBreadcrumb } from "@/components/shared";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Nexgen | Get Your Quote",
  description:
    "Get in touch with Nexgen Electrical Innovations for commercial and industrial electrical engineering, installations, and 24/7 emergency response across London.",
  path: "/contact",
  keywords: [
    "contact Nexgen Electrical",
    "electrical quote",
    "hire electrical contractor",
    "emergency electrician London",
  ],
});

export default function ContactPage() {
  return (
    <main className="relative">
      {/* Hero with blueprint grid */}
      <ContactHero />

      {/* Sticky Breadcrumb - CSS sticky below navbar */}
      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact", isCurrent: true },
        ]}
        section="contact"
      />

      {/* Contact Form Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
