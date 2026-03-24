import type { Metadata } from 'next';
import { ServicePageHero, ServiceSection, ServiceCTABlock } from '@/components/services';
import { Footer } from '@/components/sections/footer';

export const metadata: Metadata = {
  title: '24/7 Emergency Electrical Response | Nexgen Electrical Innovations',
  description:
    'Round-the-clock emergency electrical services for commercial, industrial, and residential properties. Fast response, expert fault diagnosis, and rapid resolution.',
  keywords: [
    'emergency electrical',
    'emergency electrician',
    '24/7 electrical response',
    'electrical emergency',
    'fault diagnosis',
    'power outage',
    'emergency callout',
    'rapid response',
  ],
};

export default function EmergencyPage() {
  return (
    <main>
      {/* Hero */}
      <ServicePageHero
        title="24/7 Emergency Response"
        subtitle="Always On Call"
        description="Round-the-clock emergency electrical support for all sectors. When something goes wrong, we're here — fast diagnosis, rapid resolution, and complete peace of mind."
        backgroundImage="/images/services-emergency.jpg"
        backgroundImageAlt="24/7 emergency electrical response"
      />

      {/* 24/7 Callout Service */}
      <ServiceSection
        id="24-7"
        title="24/7 Emergency Callout Service"
        description="We're available every day of the year — including nights, weekends, and holidays. When an electrical emergency strikes, we respond rapidly with expertise and professionalism."
        image={{
          src: '/images/services-emergency.jpg',
          alt: '24/7 emergency response team',
        }}
        features={[
          {
            icon: 'Clock',
            title: 'Rapid Response',
            description: 'Fast dispatch and arrival to minimize downtime and safety risks.',
          },
          {
            icon: 'Clock',
            title: 'No Holiday Surcharge',
            description: 'Emergency rates available 365 days a year without premium pricing.',
          },
          {
            icon: 'Phone',
            title: 'Expert On-Call Team',
            description: 'Experienced electricians ready to handle any electrical emergency.',
          },
        ]}
        cta={{ label: 'Call Emergency Line', href: 'tel:+441onal234567890' }}
        delay={0.1}
      />

      {/* Fault Diagnosis & Resolution */}
      <ServiceSection
        id="fault-diagnosis"
        title="Expert Fault Diagnosis & Resolution"
        description="Rapid diagnosis of electrical faults using professional testing equipment and systematic troubleshooting. From blown circuits to complete power loss, we identify and resolve issues quickly."
        image={{
          src: '/images/services-testing.jpg',
          alt: 'Electrical fault diagnosis',
        }}
        imagePosition="right"
        features={[
          {
            icon: 'AlertTriangle',
            title: 'Systematic Diagnostics',
            description: 'Professional testing and investigation to pinpoint electrical problems.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Root Cause Analysis',
            description: 'Identify not just the immediate issue, but underlying causes to prevent recurrence.',
          },
          {
            icon: 'Wrench',
            title: 'Rapid Repairs',
            description: 'Swift resolution to restore power and safety to your property.',
          },
        ]}
        cta={{ label: 'Request Diagnosis', href: '/contact' }}
        delay={0.2}
      />

      {/* Sector Coverage */}
      <ServiceSection
        id="sectors"
        title="Emergency Response Across All Sectors"
        description="Whether residential, commercial, or industrial — we have the expertise to handle emergencies in any environment. Specialized knowledge for each sector ensures appropriate, effective solutions."
        features={[
          {
            icon: 'Building2',
            title: 'Commercial Emergencies',
            description: 'Restore critical operations with minimal disruption to your business.',
          },
          {
            icon: 'Factory',
            title: 'Industrial Response',
            description: 'Handle complex systems with specialized expertise in heavy-duty infrastructure.',
          },
          {
            icon: 'Home',
            title: 'Residential Support',
            description: 'Fast help when your home electrical system fails — any time, any day.',
          },
        ]}
        delay={0.3}
      />

      {/* Direct Contact */}
      <ServiceSection
        id="contact"
        title="Direct Emergency Contact"
        description="Don't wait for email responses or callbacks. Call us directly 24/7 for immediate assistance with any electrical emergency."
        features={[
          {
            icon: 'Phone',
            title: 'Emergency Hotline',
            description: 'Call immediately for fast dispatch and expert response.',
          },
          {
            icon: 'Clock',
            title: 'Available 24/7/365',
            description: 'No delays — we respond to emergencies every single day of the year.',
          },
          {
            icon: 'Shield',
            title: 'Local & Rapid',
            description: 'Stationed strategically to ensure fast arrival in your area.',
          },
        ]}
        cta={{ label: 'Emergency Hotline', href: 'tel:+441234567890' }}
        delay={0.4}
      />

      {/* CTA Block */}
      <ServiceCTABlock
        title="When Electrical Emergency Strikes — We're There"
        description="24/7 expert response, rapid diagnosis, and professional resolution. Call now for immediate emergency electrical support."
        primaryCTA={{ label: 'Call Emergency Line', href: 'tel:+441234567890' }}
        secondaryCTA={{ label: 'Non-Emergency Inquiry', href: '/contact' }}
        delay={0.5}
      />

      <Footer />
    </main>
  );
}
