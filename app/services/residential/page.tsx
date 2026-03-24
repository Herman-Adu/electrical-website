import type { Metadata } from 'next';
import { ServicePageHero, ServiceSection, ServiceCTABlock } from '@/components/services';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: 'Residential Electrical Services | Nexgen Electrical Innovations',
  description:
    'Complete home electrical services from new builds to full rewires. EV chargers, smart home wiring, solar preparation, testing, and emergency repairs. Part P certified.',
  keywords: [
    'residential electrical',
    'home electrical',
    'full rewire',
    'EV charger installation',
    'smart home wiring',
    'solar-ready',
    'EICR testing',
    'Part P certified',
  ],
};

export default function ResidentialPage() {
  return (
    <main>
      {/* Hero */}
      <ServicePageHero
        title="Residential & Domestic Electrical"
        subtitle="Home Electrical Care"
        description="Complete electrical solutions for your home — from new builds and full rewires to smart home integration, EV chargers, and ongoing maintenance. All work compliant with Part P and fully certified."
        backgroundImage="/images/services-commercial.jpg"
        backgroundImageAlt="Residential electrical installation"
      />

      {/* Electrical Installations */}
      <ServiceSection
        id="electrical"
        title="Electrical Installations & Rewires"
        description="New build wiring, full rewires, and consumer unit upgrades completed to the highest standards. All work compliant with Part P regulations and NICEIC certified."
        image={{
          src: '/images/services-commercial.jpg',
          alt: 'Residential electrical installation',
        }}
        features={[
          {
            icon: 'Home',
            title: 'New Build Wiring',
            description: 'Complete electrical infrastructure from first fix to final certification.',
          },
          {
            icon: 'Plug',
            title: 'Full Rewires',
            description: 'Update outdated systems with modern, safe, and efficient electrical infrastructure.',
          },
          {
            icon: 'Battery',
            title: 'Consumer Unit Upgrades',
            description: 'Replace old fuse boxes with modern consumer units for safety and capacity.',
          },
        ]}
        cta={{ label: 'Request Quote', href: '/contact' }}
        delay={0.1}
      />

      {/* Smart Home & EV */}
      <ServiceSection
        id="smart-home"
        title="Smart Home & EV Charging"
        description="Prepare your home for the future with EV chargers, smart home wiring, and solar-ready consumer units. Future-proof infrastructure for modern living."
        image={{
          src: '/images/services-lighting.jpg',
          alt: 'EV charger and smart home installation',
        }}
        imagePosition="right"
        features={[
          {
            icon: 'Zap',
            title: 'EV Charger Installation',
            description: '7-22kW home charging solutions with full EVSE installation and certification.',
          },
          {
            icon: 'Settings',
            title: 'Smart Home Wiring',
            description: 'CAT6A cabling, smart lighting, heating controls, and home automation infrastructure.',
          },
          {
            icon: 'Battery',
            title: 'Solar-Ready Preparation',
            description: 'Consumer units and cabling prepared for future solar PV installation.',
          },
        ]}
        cta={{ label: 'Explore Smart Home', href: '/services/residential#smart-home' }}
        delay={0.2}
      />

      {/* Testing & Safety */}
      <ServiceSection
        id="testing"
        title="Testing & Safety Certification"
        description="EICR testing, landlord certificates, and PAT testing for rental properties and personal safety. Get certified documentation for insurance, compliance, and peace of mind."
        image={{
          src: '/images/services-testing.jpg',
          alt: 'Electrical testing and inspection',
        }}
        features={[
          {
            icon: 'ClipboardCheck',
            title: 'EICR Reports',
            description: 'Electrical Installation Condition Reports for residential properties.',
          },
          {
            icon: 'ClipboardCheck',
            title: 'Landlord Certificates',
            description: 'Compliance documentation required for rental properties under Building Regulations.',
          },
          {
            icon: 'Shield',
            title: 'PAT Testing',
            description: 'Portable Appliance Testing to ensure all equipment is safe to use.',
          },
        ]}
        cta={{ label: 'Request Testing', href: '/contact' }}
        delay={0.3}
      />

      {/* Maintenance & Repairs */}
      <ServiceSection
        id="maintenance"
        title="Maintenance, Repairs & Emergency Support"
        description="From routine maintenance and repairs to emergency fault-finding and urgent fixes — we're here when you need us. Professional, compliant, and always reliable."
        imagePosition="right"
        features={[
          {
            icon: 'Wrench',
            title: 'Fault-Finding & Diagnosis',
            description: 'Locate and resolve electrical faults quickly and safely.',
          },
          {
            icon: 'Plug',
            title: 'General Repairs',
            description: 'Socket replacements, switch upgrades, lighting repairs, and ongoing maintenance.',
          },
          {
            icon: 'Phone',
            title: 'Emergency Support',
            description: 'Fast response for urgent electrical issues affecting your home safety.',
          },
        ]}
        cta={{ label: 'Contact for Repair', href: '/contact' }}
        delay={0.4}
      />

      {/* CTA Block */}
      <ServiceCTABlock
        title="Make Your Home Electrically Safe & Future-Ready"
        description="Whether you need a rewire, EV charger installation, or emergency repairs — our certified electricians deliver professional, compliant solutions you can trust."
        primaryCTA={{ label: 'Request Consultation', href: '/contact' }}
        secondaryCTA={{ label: 'Learn About Our Team', href: '/about' }}
        delay={0.5}
      />

      <Footer />
    </main>
  );
}
