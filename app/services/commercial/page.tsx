import type { Metadata } from 'next';
import { ServicePageHero, ServiceSection, ServiceCTABlock } from '@/components/services';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Commercial & Retail Electrical Services | Nexgen Electrical Innovations',
  description:
    'Professional electrical installations for offices, retail spaces, and commercial complexes. LED lighting, data cabling, testing, certification, and ongoing maintenance support.',
  keywords: [
    'commercial electrical',
    'retail electrical',
    'office wiring',
    'LED lighting installation',
    'data cabling',
    'EICR testing',
    'commercial maintenance',
    'fit-out wiring',
  ],
};

export default function CommercialPage() {
  return (
    <main>
      {/* Hero */}
      <ServicePageHero
        title="Commercial & Retail Electrical"
        subtitle="Enterprise Solutions"
        description="Complete electrical infrastructure for offices, retail spaces, and commercial complexes — from new installations and fit-outs to testing, lighting design, and ongoing support."
        backgroundImage="/images/services-commercial.jpg"
        backgroundImageAlt="Commercial office electrical installation"
      />

      {/* Installations Section */}
      <ServiceSection
        id="installations"
        title="Commercial Installations & Fit-Outs"
        description="Full-scale electrical infrastructure for new builds, refurbishments, and complex fit-outs. We handle high-rise wiring, consumer units, distribution boards, and full compliance with BS 7671 standards."
        image={{
          src: '/images/services-commercial.jpg',
          alt: 'Commercial electrical installation',
        }}
        features={[
          {
            icon: 'Building2',
            title: 'New Builds & Refurbishments',
            description: 'Complete electrical design and installation from foundation to finishing.',
          },
          {
            icon: 'Shield',
            title: 'Emergency Systems',
            description: 'Emergency lighting, backup power, and safety systems integrated throughout.',
          },
          {
            icon: 'Wifi',
            title: 'Data Distribution',
            description: 'Cable routes, containment systems, and infrastructure for network connectivity.',
          },
        ]}
        cta={{ label: 'Request Quote', href: '/contact' }}
        delay={0.1}
      />

      {/* Lighting Section */}
      <ServiceSection
        id="lighting"
        title="High-Performance Commercial Lighting"
        subtitle="Energy-Efficient LED Solutions"
        description="Professional LED lighting design and installation for offices, warehouses, and retail. Reduce energy consumption by up to 70% with smart controls, motion sensors, and daylight integration."
        image={{
          src: '/images/services-lighting.jpg',
          alt: 'Commercial LED lighting',
        }}
        imagePosition="right"
        features={[
          {
            icon: 'Lightbulb',
            title: 'LED Upgrades',
            description: '70% energy savings with modern, efficient LED solutions.',
          },
          {
            icon: 'Settings',
            title: 'Smart Controls',
            description: 'Motion sensors, dimming, scheduling, and occupancy management.',
          },
          {
            icon: 'Lightbulb',
            title: 'Design & Layout',
            description: 'Professional lighting design optimized for your space and workflow.',
          },
        ]}
        cta={{ label: 'Explore Lighting', href: '/services/commercial#lighting' }}
        delay={0.2}
      />

      {/* Data & Communications */}
      <ServiceSection
        id="data-comms"
        title="Data & Communications Infrastructure"
        description="Structured cabling, fiber optics, and network infrastructure for modern offices and retail. Compliant with ISO/IEC 11801 and future-proofed for growth."
        image={{
          src: '/images/services-data-comms.jpg',
          alt: 'Data and communications infrastructure',
        }}
        features={[
          {
            icon: 'Wifi',
            title: 'Structured Cabling',
            description: 'Cat6A, fiber optics, and organized cable management systems.',
          },
          {
            icon: 'Wifi',
            title: 'Network Design',
            description: 'Enterprise-grade network infrastructure planning and installation.',
          },
          {
            icon: 'Clock',
            title: '10-Year Support',
            description: 'Comprehensive maintenance and support for all communications systems.',
          },
        ]}
        cta={{ label: 'Learn More', href: '/contact' }}
        delay={0.3}
      />

      {/* Testing & Certification */}
      <ServiceSection
        id="testing"
        title="Testing & Compliance Certification"
        description="Comprehensive EICR testing, PAT testing, and full compliance documentation. Keep your installations safe, efficient, and meeting all regulatory requirements."
        image={{
          src: '/images/services-testing.jpg',
          alt: 'Electrical testing and certification',
        }}
        imagePosition="right"
        features={[
          {
            icon: 'ClipboardCheck',
            title: 'EICR Reports',
            description: 'Electrical Installation Condition Reports with detailed findings and recommendations.',
          },
          {
            icon: 'ClipboardCheck',
            title: 'PAT Testing',
            description: 'Portable Appliance Testing for all equipment and safety devices.',
          },
          {
            icon: 'Shield',
            title: 'Full Compliance',
            description: 'NICEIC certification and BS 7671 compliance for complete peace of mind.',
          },
        ]}
        cta={{ label: 'Request Testing', href: '/contact' }}
        delay={0.4}
      />

      {/* Maintenance & Support */}
      <ServiceSection
        id="maintenance"
        title="Planned Maintenance & Support"
        description="Scheduled preventive maintenance keeps your electrical systems running reliably. From emergency repairs to annual inspections, we've got you covered with professional, compliant service."
        features={[
          {
            icon: 'Phone',
            title: '24/7 Emergency Response',
            description: 'Rapid response to electrical faults and emergencies affecting your business.',
          },
          {
            icon: 'Wrench',
            title: 'Planned Maintenance',
            description: 'Annual inspections, repairs, and upgrades on your schedule.',
          },
          {
            icon: 'ClipboardCheck',
            title: 'Compliance Support',
            description: 'Keep all systems certified and compliant with ongoing testing and documentation.',
          },
        ]}
        cta={{ label: 'Set Up Maintenance Plan', href: '/contact' }}
        delay={0.5}
      />

      {/* CTA Block */}
      <ServiceCTABlock
        title="Ready to Upgrade Your Commercial Electrical?"
        description="Whether you're planning a new fit-out, upgrading lighting, or establishing ongoing maintenance — our team is ready to deliver gold-standard solutions tailored to your business."
        primaryCTA={{ label: 'Request Consultation', href: '/contact' }}
        secondaryCTA={{ label: 'View Portfolio', href: '/about' }}
        delay={0.6}
      />

      <Footer />
    </main>
  );
}
