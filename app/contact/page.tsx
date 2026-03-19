import { Contact, Footer } from '@/components/sections';

export const metadata = {
  title: 'Contact Nexgen | Get Your Quote',
  description: 'Get in touch with Nexgen Electrical for your electrical engineering and installation needs.',
};

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
