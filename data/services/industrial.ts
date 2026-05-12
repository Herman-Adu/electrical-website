import type { ServicePageData } from "@/types/sections";

export const industrialPageData: ServicePageData = {
  slug: "industrial",
  meta: {
    title:
      "Industrial & Infrastructure Electrical Services | NexGen Electrical",
    description:
      "Heavy-duty electrical solutions for manufacturing, warehouses, and industrial facilities. Power distribution, energy management, and industrial-grade maintenance.",
    keywords: [
      "industrial electrical",
      "power distribution",
      "factory electrical",
      "HV installations",
      "energy management",
    ],
  },
  hero: {
    eyebrow: "Industrial & Infrastructure",
    headline: ["Powering", "Industry", "Forward"],
    headlineHighlight: "Industry",
    subheadline:
      "Heavy-duty electrical infrastructure for manufacturing, processing, and industrial facilities. From 11kV installations to intelligent energy management systems.",
    stats: [
      { value: "11kV", label: "HV Capability" },
      { value: "200+", label: "Industrial Sites" },
      { value: "99.97%", label: "Uptime" },
      { value: "< 4hr", label: "Response" },
    ],
    scrollTargetId: "systems",
    scrollLabel: "Our Capabilities",
    backgroundImage: {
      src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg",
      alt: "Industrial electrical systems",
      priority: true,
    },
    trustIndicators: [
      {
        icon: "Zap" as const,
        title: "HV-LV Specialists",
        description:
          "High and low voltage design-build for industrial environments",
      },
      {
        icon: "Shield" as const,
        title: "ATEX Compliant",
        description:
          "Explosion-protected installations for hazardous area projects",
      },
      {
        icon: "Award" as const,
        title: "Fully Accredited",
        description:
          "NICEIC certified for heavy industrial electrical installation",
      },
      {
        icon: "Settings" as const,
        title: "Custom Engineering",
        description:
          "Bespoke designs for complex manufacturing and process plants",
      },
    ],
    metadata: [
      "NICEIC Approved",
      "HV-LV Certified",
      "ATEX Capable",
      "200+ Industrial Sites",
    ],
  },
  intro: {
    sectionId: "our-expertise",
    label: "Our Expertise",
    headlineWords: ["Powering", "Manufacturing", "Excellence"],
    leadParagraph:
      "Industrial electrical systems aren't just about power — they're about uptime, safety, and operational efficiency. We specialize in the high-voltage, heavy-duty infrastructure that keeps factories and facilities running.",
    bodyParagraphs: [
      "With 15+ years serving industrial facilities, we understand the unique demands of manufacturing environments. From 11kV installations and switchgear management to intelligent power distribution and energy optimization, we deliver systems designed for reliability.",
      "Our industrial team includes fully qualified electricians, energy engineers, and compliance specialists. We work around your production schedule to minimize disruption, and we maintain your systems to ensure peak performance year-round.",
    ],
    pillars: [
      {
        num: "01",
        title: "24/7 Support",
        description:
          "Rapid response and comprehensive maintenance for mission-critical systems.",
      },
      {
        num: "02",
        title: "Heavy-Duty Systems",
        description:
          "HV installations, power distribution, and industrial-grade components.",
      },
      {
        num: "03",
        title: "Safety First",
        description:
          "Full compliance with industrial safety standards and risk mitigation.",
      },
    ],
  },
  sections: [
    { type: 'features-animated' as const, data: {} as never },
    { type: 'live-dashboard' as const, data: {} as never },
    {
      type: "profile",
      data: {
        sectionId: "systems",
        label: "Industrial Systems",
        name: "Heavy-Duty Electrical Infrastructure",
        bio: [
          "Purpose-built electrical systems for the demands of modern industry. We design and install complete power infrastructure for manufacturing plants, warehouses, processing facilities, and heavy industrial sites.",
          "Our industrial team brings decades of experience in motor control, variable speed drives, PLC integration, and hazardous area installations. Every system is engineered for maximum reliability and safety.",
        ],
        quote:
          "Industrial electrical isn't just about power — it's about uptime, safety, and operational efficiency.",
        credentials: [
          "Motor Control",
          "Variable Speed Drives",
          "PLC Integration",
          "Hazardous Areas",
          "ATEX Certified",
        ],
        image: {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-plant-room-installation.jpg",
          alt: "Harvey Nichols plant room installation",
          priority: true,
        },
        imageAspect: 'landscape' as const,
        highlights: [
          {
            icon: 'Zap' as const,
            title: 'Motor Control Systems',
            description: 'Full integration of motor control centres, star-delta starters, and variable speed drives for heavy industrial loads',
          },
          {
            icon: 'Settings' as const,
            title: 'PLC and Automation Integration',
            description: 'Seamless integration with SCADA and PLC systems to automate processes and enable remote monitoring',
          },
          {
            icon: 'Shield' as const,
            title: 'ATEX-Rated Installations',
            description: 'Explosion-protected equipment and cabling for hazardous areas compliant with ATEX Zone 1 and Zone 2 classifications',
          },
          {
            icon: 'ClipboardCheck' as const,
            title: 'Full Documentation Pack',
            description: 'As-built drawings, test certificates, O&M manuals, and BS 7671 certification delivered on every project',
          },
        ],
        cta: { label: "Discuss Your Project", href: "/contact" },
        reversed: false,
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "power-distribution",
        label: "Power Distribution",
        name: "High-Voltage & Distribution Networks",
        bio: [
          "From transformer installations to final circuit protection, we design and install complete power distribution networks. Our capabilities extend from 33kV primary substations down to individual machine supplies.",
          "We specialize in switchgear installation, busbar systems, sub-metering, and power factor correction. Every installation is designed for reliability, maintainability, and future expansion.",
        ],
        quote:
          "Reliable power distribution is the backbone of every successful industrial operation.",
        credentials: [
          "Transformers",
          "Switchgear",
          "Busbar Systems",
          "Sub-Metering",
          "Power Factor Correction",
        ],
        image: {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-control-panel.jpg",
          alt: "Harvey Nichols chiller control panel",
        },
        imageAspect: 'landscape' as const,
        highlights: [
          {
            icon: 'Zap' as const,
            title: '11kV to LV Design',
            description: 'Complete design and installation from primary HV substations through transformers to final circuit distribution boards',
          },
          {
            icon: 'Settings' as const,
            title: 'Switchgear and Busbar Systems',
            description: 'Type-tested switchgear assemblies, busbar trunking, and sub-main panels installed to BS EN 61439',
          },
          {
            icon: 'Gauge' as const,
            title: 'Power Factor Correction',
            description: 'Automatic power factor correction that reduces reactive power charges and improves site grid stability',
          },
          {
            icon: 'Award' as const,
            title: 'Sub-Metering Networks',
            description: 'Multi-point sub-metering for granular energy visibility at machine, zone, or departmental level',
          },
        ],
        cta: { label: "Plan Your Distribution", href: "/contact" },
        reversed: true,
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "energy-management",
        label: "Energy Management",
        name: "Intelligent Energy Optimisation",
        bio: [
          "Smart monitoring and optimisation systems that reduce operational costs, improve efficiency, and meet sustainability compliance targets. Our SCADA-integrated solutions provide real-time visibility into every aspect of your energy consumption.",
          "From power factor correction to demand management, we implement intelligent systems that pay for themselves through reduced energy bills and avoided peak demand charges.",
        ],
        quote:
          "The data tells the story — and the story is usually about wasted energy you can reclaim.",
        credentials: [
          "SCADA Integration",
          "Real-Time Analytics",
          "Power Factor Correction",
          "Demand Management",
          "Sustainability",
        ],
        image: {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-vfd-pump-controller.jpg",
          alt: "Harvey Nichols VFD pump controller",
        },
        imageAspect: 'landscape' as const,
        highlights: [
          {
            icon: 'Activity' as const,
            title: 'SCADA Integration',
            description: 'Real-time energy data aggregated into SCADA dashboards for site-wide operational visibility and control',
          },
          {
            icon: 'Gauge' as const,
            title: 'Demand Management Systems',
            description: 'Automated load shedding and demand management that prevents peak charges and smooths load profiles',
          },
          {
            icon: 'Award' as const,
            title: 'ISO 50001 Alignment',
            description: 'Monitoring systems and reporting structured to support your ISO 50001 energy management certification',
          },
          {
            icon: 'Shield' as const,
            title: 'Sustainability Reporting',
            description: 'Carbon tracking, Scope 2 emissions reporting, and net-zero roadmap support built into every energy project',
          },
        ],
        cta: { label: "Optimize Your Energy", href: "/contact" },
        reversed: false,
      },
    },
    {
      type: "features",
      data: {
        sectionId: "testing",
        label: "Industrial Testing",
        headline: "Comprehensive Industrial Testing",
        headlineHighlight: "Testing",
        description:
          "Specialized testing services for industrial environments including thermographic surveys, power quality analysis, and high-voltage testing.",
        pillars: [
          {
            icon: "Gauge",
            title: "Thermographic Surveys",
            description:
              "Infrared imaging to identify hotspots, loose connections, and potential failures before they cause downtime.",
            highlight: true,
          },
          {
            icon: "Zap",
            title: "Power Quality Analysis",
            description:
              "Comprehensive analysis of harmonics, voltage stability, and power factor to optimize your electrical system.",
            highlight: false,
          },
          {
            icon: "Shield",
            title: "Protection Testing",
            description:
              "Relay testing, trip testing, and protection coordination studies to ensure safety systems work when needed.",
            highlight: false,
          },
          {
            icon: "ClipboardCheck",
            title: "HV Testing",
            description:
              "High-voltage testing and certification for transformers, switchgear, and cable systems.",
            highlight: false,
          },
        ],
        checklist: [
          "Predictive maintenance through thermal imaging",
          "Harmonic analysis and mitigation recommendations",
          "Earth fault loop impedance testing",
          "Insulation resistance testing",
          "Portable appliance testing (PAT)",
          "Full documentation and trending reports",
        ],
        partners: [
          { name: "NICEIC", abbr: "NIC" },
          { name: "ECA", abbr: "ECA" },
          { name: "ISO 45001", abbr: "45K" },
          { name: "SafeContractor", abbr: "SC" },
          { name: "CHAS", abbr: "CHA" },
          { name: "ISO 14001", abbr: "14K" },
        ],
        background: "dark",
      },
    },
    {
      type: "features",
      data: {
        sectionId: "maintenance",
        label: "Industrial Maintenance",
        headline: "Minimize Downtime, Maximize Output",
        headlineHighlight: "Maximize Output",
        description:
          "Proactive maintenance programs designed for industrial environments where downtime costs thousands per hour.",
        pillars: [
          {
            icon: "Clock",
            title: "Predictive Maintenance",
            description:
              "Data-driven maintenance scheduling based on actual equipment condition, not arbitrary timelines.",
            highlight: true,
          },
          {
            icon: "Phone",
            title: "4-Hour Response",
            description:
              "Emergency callout with guaranteed response times for critical industrial equipment failures.",
            highlight: false,
          },
          {
            icon: "Wrench",
            title: "Planned Shutdowns",
            description:
              "Coordinated maintenance during planned shutdowns to maximize uptime during production periods.",
            highlight: false,
          },
          {
            icon: "Settings",
            title: "Spare Parts Management",
            description:
              "We maintain critical spares on-site or in local stock for rapid replacement when needed.",
            highlight: false,
          },
        ],
      },
    },
    {
      type: "cta",
      data: {
        sectionId: "contact",
        finalCTA: {
          label: "Ready to Optimise?",
          headline: "Industrial Expertise, On Demand",
          headlineHighlight: "On Demand",
          description:
            "From emergency repairs to complete system upgrades, our industrial team is ready to keep your operations running.",
          primaryCTA: { label: "Request Site Survey", href: "/contact" },
          secondaryCTA: {
            label: "Emergency Callout",
            href: "tel:+442012345678",
          },
        },
      },
    },
  ],
};
