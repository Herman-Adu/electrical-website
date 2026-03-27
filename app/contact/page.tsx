import type { Metadata } from "next";
import { Contact, Footer } from "@/components/sections";
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
      {/* Contact Form Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
