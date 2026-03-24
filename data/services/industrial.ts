import type { ServicePageData } from '@/types/sections';

export const industrialPageData: ServicePageData = {
  slug: 'industrial',
  meta: {
    title: 'Industrial & Infrastructure Electrical Services | NexGen Electrical',
    description:
      'Heavy-duty electrical solutions for manufacturing, warehouses, and industrial facilities. Power distribution, energy management, and industrial-grade maintenance.',
    keywords: ['industrial electrical', 'power distribution', 'factory electrical', 'HV installations', 'energy management'],
  },
  hero: {
    eyebrow: 'Industrial & Infrastructure',
    headline: ['Powering', 'Industry', 'Forward'],
    headlineHighlight: 'Industry',
    subheadline:
      'Heavy-duty electrical infrastructure for manufacturing, processing, and industrial facilities. From 11kV installations to intelligent energy management systems.',
    stats: [
      { value: '11kV', label: 'HV Capability' },
      { value: '200+', label: 'Industrial Sites' },
      { value: '99.97%', label: 'Uptime' },
      { value: '< 4hr', label: 'Response' },
    ],
    scrollTargetId: 'systems',
    scrollLabel: 'Our Capabilities',
  },
  sections: [
    {
      type: 'profile',
      data: {
        sectionId: 'systems',
        label: 'Industrial Systems',
        name: 'Heavy-Duty Electrical Infrastructure',
        bio: [
          'Purpose-built electrical systems for the demands of modern industry. We design and install complete power infrastructure for manufacturing plants, warehouses, processing facilities, and heavy industrial sites.',
          'Our industrial team brings decades of experience in motor control, variable speed drives, PLC integration, and hazardous area installations. Every system is engineered for maximum reliability and safety.',
        ],
        quote: 'Industrial electrical isn't just about power — it's about uptime, safety, and operational efficiency.',
        credentials: ['Motor Control', 'Variable Speed Drives', 'PLC Integration', 'Hazardous Areas', 'ATEX Certified'],
        image: {
          src: '/images/industrial-systems.jpg',
          alt: 'Industrial electrical control panel installation',
          priority: true,
        },
        cta: { label: 'Discuss Your Project', href: '/contact' },
        reversed: false,
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'power-distribution',
        label: 'Power Distribution',
        name: 'High-Voltage & Distribution Networks',
        bio: [
          'From transformer installations to final circuit protection, we design and install complete power distribution networks. Our capabilities extend from 33kV primary substations down to individual machine supplies.',
          'We specialize in switchgear installation, busbar systems, sub-metering, and power factor correction. Every installation is designed for reliability, maintainability, and future expansion.',
        ],
        quote: 'Reliable power distribution is the backbone of every successful industrial operation.',
        credentials: ['Transformers', 'Switchgear', 'Busbar Systems', 'Sub-Metering', 'Power Factor Correction'],
        image: {
          src: '/images/power-distribution.jpg',
          alt: 'High voltage switchgear and power distribution',
        },
        cta: { label: 'Plan Your Distribution', href: '/contact' },
        reversed: true,
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'energy-management',
        label: 'Energy Management',
        name: 'Intelligent Energy Optimisation',
        bio: [
          'Smart monitoring and optimisation systems that reduce operational costs, improve efficiency, and meet sustainability compliance targets. Our SCADA-integrated solutions provide real-time visibility into every aspect of your energy consumption.',
          'From power factor correction to demand management, we implement intelligent systems that pay for themselves through reduced energy bills and avoided peak demand charges.',
        ],
        quote: 'The data tells the story — and the story is usually about wasted energy you can reclaim.',
        credentials: ['SCADA Integration', 'Real-Time Analytics', 'Power Factor Correction', 'Demand Management', 'Sustainability'],
        image: {
          src: '/images/energy-management.jpg',
          alt: 'Energy management system dashboard and analytics',
        },
        cta: { label: 'Optimize Your Energy', href: '/contact' },
        reversed: false,
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'testing',
        label: 'Industrial Testing',
        headline: 'Comprehensive Industrial Testing',
        headlineHighlight: 'Testing',
        description:
          'Specialized testing services for industrial environments including thermographic surveys, power quality analysis, and high-voltage testing.',
        pillars: [
          {
            icon: 'Gauge',
            title: 'Thermographic Surveys',
            description: 'Infrared imaging to identify hotspots, loose connections, and potential failures before they cause downtime.',
            highlight: true,
          },
          {
            icon: 'Zap',
            title: 'Power Quality Analysis',
            description: 'Comprehensive analysis of harmonics, voltage stability, and power factor to optimize your electrical system.',
            highlight: false,
          },
          {
            icon: 'Shield',
            title: 'Protection Testing',
            description: 'Relay testing, trip testing, and protection coordination studies to ensure safety systems work when needed.',
            highlight: false,
          },
          {
            icon: 'ClipboardCheck',
            title: 'HV Testing',
            description: 'High-voltage testing and certification for transformers, switchgear, and cable systems.',
            highlight: false,
          },
        ],
        checklist: [
          'Predictive maintenance through thermal imaging',
          'Harmonic analysis and mitigation recommendations',
          'Earth fault loop impedance testing',
          'Insulation resistance testing',
          'Portable appliance testing (PAT)',
          'Full documentation and trending reports',
        ],
        partners: [
          { name: 'NICEIC', abbr: 'NIC' },
          { name: 'ECA', abbr: 'ECA' },
          { name: 'ISO 45001', abbr: '45K' },
          { name: 'SafeContractor', abbr: 'SC' },
          { name: 'CHAS', abbr: 'CHA' },
          { name: 'ISO 14001', abbr: '14K' },
        ],
        background: 'dark',
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'maintenance',
        label: 'Industrial Maintenance',
        headline: 'Minimize Downtime, Maximize Output',
        headlineHighlight: 'Maximize Output',
        description:
          'Proactive maintenance programs designed for industrial environments where downtime costs thousands per hour.',
        pillars: [
          {
            icon: 'Clock',
            title: 'Predictive Maintenance',
            description: 'Data-driven maintenance scheduling based on actual equipment condition, not arbitrary timelines.',
            highlight: true,
          },
          {
            icon: 'Phone',
            title: '4-Hour Response',
            description: 'Emergency callout with guaranteed response times for critical industrial equipment failures.',
            highlight: false,
          },
          {
            icon: 'Wrench',
            title: 'Planned Shutdowns',
            description: 'Coordinated maintenance during planned shutdowns to maximize uptime during production periods.',
            highlight: false,
          },
          {
            icon: 'Settings',
            title: 'Spare Parts Management',
            description: 'We maintain critical spares on-site or in local stock for rapid replacement when needed.',
            highlight: false,
          },
        ],
      },
    },
    {
      type: 'cta',
      data: {
        sectionId: 'contact',
        finalCTA: {
          label: 'Ready to Optimise?',
          headline: 'Industrial Expertise, On Demand',
          headlineHighlight: 'On Demand',
          description:
            'From emergency repairs to complete system upgrades, our industrial team is ready to keep your operations running.',
          primaryCTA: { label: 'Request Site Survey', href: '/contact' },
          secondaryCTA: { label: 'Emergency Callout', href: 'tel:+441onal' },
        },
      },
    },
  ],
};
