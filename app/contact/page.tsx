import type { Metadata } from "next";
import { Contact, Footer } from "@/components/sections";
import { createStandardPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createStandardPageMetadata({
  title: "Contact Nexgen | Get Your Quote",
  description:
    "Get in touch with Nexgen Electrical for your electrical engineering and installation needs.",
  path: "/contact",
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
