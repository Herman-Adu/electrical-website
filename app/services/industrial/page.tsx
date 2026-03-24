import type { Metadata } from 'next';
import { ServicePageHero, ServiceSection, ServiceCTABlock } from '@/components/services';
import { Footer } from '@/components/sections/footer';
import { Factory, Zap, Gauge, ClipboardCheck, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industrial & Infrastructure Electrical Services | Nexgen Electrical Innovations',
  description:
    'Heavy-duty electrical systems for manufacturing plants, warehouses, and industrial facilities. High-voltage infrastructure, power distribution, SCADA systems, and predictive maintenance.',
  keywords: [
    'industrial electrical',
    'heavy-duty electrical',
    'high voltage systems',
    'power distribution',
    'SCADA systems',
    'energy management',
    'industrial maintenance',
    'switchgear installation',
  ],
};

export default function IndustrialPage() {
  return (
    <main>
      {/* Hero */}
      <ServicePageHero
        title="Industrial & Infrastructure"
        subtitle="Heavy-Duty Power Solutions"
        description="Heavy-duty electrical systems for manufacturing plants, warehouses, and processing facilities. From high-voltage infrastructure to complex power distribution and real-time monitoring."
        backgroundImage="/images/services-industrial.jpg"
        backgroundImageAlt="Industrial electrical systems"
      />

      {/* Industrial Systems */}
      <ServiceSection
        id="systems"
        title="Industrial Electrical Systems"
        description="Complex, high-capacity electrical infrastructure designed for demanding industrial environments. Switchgear, transformers, motor control centers, and high-voltage distribution engineered for reliability and safety."
        image={{
          src: '/images/services-industrial.jpg',
          alt: 'Industrial electrical systems',
        }}
        features={[
          {
            icon: Factory,
            title: 'Switchgear & Transformers',
            description: 'High-voltage switching and transformation equipment for large-scale operations.',
          },
          {
            icon: Factory,
            title: 'Motor Control Systems',
            description: 'Variable frequency drives, soft starters, and motor protection systems.',
          },
          {
            icon: Factory,
            title: 'Load Management',
            description: 'Intelligent load balancing and demand-side management to optimize efficiency.',
          },
        ]}
        cta={{ label: 'Request System Design', href: '/contact' }}
        delay={0.1}
      />

      {/* Power Distribution */}
      <ServiceSection
        id="power-distribution"
        title="Power Distribution & Sub-Metering"
        description="Reliable, multi-zone power distribution networks ensuring consistent flow across your facility. From transformer installation to final circuit protection, sub-metering, and isolation systems."
        image={{
          src: '/images/services-emergency.jpg',
          alt: 'Power distribution infrastructure',
        }}
        imagePosition="right"
        features={[
          {
            icon: Zap,
            title: 'Multi-Zone Networks',
            description: 'Distributed power with multiple feeds, isolation points, and redundancy.',
          },
          {
            icon: Zap,
            title: 'Sub-Metering & Monitoring',
            description: 'Real-time visibility into consumption patterns by zone or department.',
          },
          {
            icon: Zap,
            title: 'SCADA Integration',
            description: 'Automated control and monitoring systems for complex multi-site operations.',
          },
        ]}
        cta={{ label: 'Explore Distribution', href: '/services/industrial#power-distribution' }}
        delay={0.2}
      />

      {/* Energy Management */}
      <ServiceSection
        id="energy-management"
        title="Intelligent Energy Optimisation"
        description="Smart monitoring, real-time analytics, and automated optimization systems that reduce operational costs and improve efficiency. SCADA integration, power factor correction, and compliance reporting."
        image={{
          src: '/images/services-energy.jpg',
          alt: 'Energy management and SCADA systems',
        }}
        features={[
          {
            icon: Gauge,
            title: 'Real-Time Monitoring',
            description: 'Live dashboards showing power consumption, voltage, current, and power quality.',
          },
          {
            icon: Gauge,
            title: 'SCADA Systems',
            description: 'Supervisory Control and Data Acquisition for automated facility management.',
          },
          {
            icon: Gauge,
            title: 'Sustainability Compliance',
            description: 'Meet environmental targets and regulatory reporting requirements with detailed analytics.',
          },
        ]}
        cta={{ label: 'Learn More', href: '/contact' }}
        delay={0.3}
      />

      {/* Industrial Testing */}
      <ServiceSection
        id="testing"
        title="Industrial Testing & Compliance"
        description="Comprehensive testing including thermographic surveys, insulation resistance testing, and full compliance certification. Keep systems safe, efficient, and meeting all industrial standards."
        image={{
          src: '/images/services-testing.jpg',
          alt: 'Industrial electrical testing',
        }}
        imagePosition="right"
        features={[
          {
            icon: ClipboardCheck,
            title: 'Thermographic Surveys',
            description: 'Thermal imaging to identify hot spots, connection issues, and potential failures.',
          },
          {
            icon: ClipboardCheck,
            title: 'Insulation Testing',
            description: 'Comprehensive insulation resistance and dielectric strength verification.',
          },
          {
            icon: ClipboardCheck,
            title: 'Industrial Certification',
            description: 'Full compliance reports meeting industrial standards and safety requirements.',
          },
        ]}
        cta={{ label: 'Request Testing', href: '/contact' }}
        delay={0.4}
      />

      {/* Maintenance & Support */}
      <ServiceSection
        id="maintenance"
        title="Predictive & Preventive Maintenance"
        description="Scheduled maintenance programs that prevent costly downtime. From routine inspections and repairs to condition monitoring and predictive analytics, we keep your systems running at peak efficiency."
        features={[
          {
            icon: Wrench,
            title: 'Preventive Maintenance Plans',
            description: 'Scheduled inspections, cleaning, and repairs to prevent failures before they happen.',
          },
          {
            icon: Wrench,
            title: 'Condition Monitoring',
            description: 'Continuous monitoring systems alert you to developing issues before they cause problems.',
          },
          {
            icon: Wrench,
            title: 'Emergency Response',
            description: '24/7 emergency support minimizes downtime when unexpected faults occur.',
          },
        ]}
        cta={{ label: 'Set Up Maintenance Plan', href: '/contact' }}
        delay={0.5}
      />

      {/* CTA Block */}
      <ServiceCTABlock
        title="Optimize Your Industrial Electrical Operations"
        description="Whether you need new infrastructure, energy optimization, or ongoing maintenance — our team delivers industrial-grade solutions that improve efficiency, reduce costs, and ensure reliability."
        primaryCTA={{ label: 'Request Consultation', href: '/contact' }}
        secondaryCTA={{ label: 'View Portfolio', href: '/about' }}
        delay={0.6}
      />

      <Footer />
    </main>
  );
}
