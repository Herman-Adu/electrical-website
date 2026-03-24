import type { ServicePageData } from '@/types/sections';

export const commercialPageData: ServicePageData = {
  slug: 'commercial',
  meta: {
    title: 'Commercial & Retail Electrical Services | NexGen Electrical',
    description:
      'Complete electrical solutions for offices, retail spaces, and commercial complexes. Installations, lighting, data communications, testing, and maintenance.',
    keywords: ['commercial electrical', 'retail electrical', 'office wiring', 'commercial lighting', 'data cabling'],
  },
  hero: {
    eyebrow: 'Commercial & Retail Services',
    headline: ['Powering', 'Business', 'Success'],
    headlineHighlight: 'Business',
    subheadline:
      'Full-scale electrical infrastructure for offices, retail spaces, and commercial complexes. From initial design through ongoing maintenance, we deliver certified excellence.',
    stats: [
      { value: '500+', label: 'Commercial Projects' },
      { value: '99.9%', label: 'Uptime Guarantee' },
      { value: 'BS 7671', label: 'Certified' },
      { value: '24/7', label: 'Support' },
    ],
    scrollTargetId: 'installations',
    scrollLabel: 'Our Services',
    backgroundImage: {
      src: '/images/services-commercial.jpg',
      alt: 'Commercial electrical installation',
      priority: true,
    },
  },
  sections: [
    {
      type: 'profile',
      data: {
        sectionId: 'installations',
        label: 'Commercial Installations',
        name: 'Full-Scale Commercial Fit-Outs',
        bio: [
          'From ground-up new builds to complete refurbishments, we deliver end-to-end electrical infrastructure for commercial spaces of any scale. Our team handles high-rise wiring, consumer units, distribution boards, and full BS 7671 compliance.',
          'Every installation is designed for reliability, safety, and future scalability. We work alongside architects, project managers, and general contractors to ensure seamless integration with your build timeline.',
        ],
        quote: 'The right electrical foundation sets your business up for decades of reliable operation.',
        credentials: ['High-Rise Wiring', 'Consumer Units', 'Distribution Boards', 'Emergency Systems', 'Full Compliance'],
        image: {
          src: '/images/services-commercial.jpg',
          alt: 'Commercial electrical installation in progress',
          priority: true,
        },
        cta: { label: 'Request a Quote', href: '/contact' },
        reversed: false,
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'lighting',
        label: 'Commercial Lighting',
        name: 'High-Performance Lighting Solutions',
        bio: [
          'Transform your workspace with professional lighting design that boosts productivity, reduces energy costs, and creates the perfect ambiance. We specialize in LED upgrades that deliver up to 70% energy savings.',
          'Our smart lighting systems include motion sensors, daylight harvesting, scheduled dimming, and occupancy management — all controllable from a central system or your smartphone.',
        ],
        quote: 'Great lighting transforms spaces — and dramatically cuts your energy bills.',
        credentials: ['LED Upgrades', 'Smart Controls', 'Motion Sensors', 'Daylight Harvesting', 'Energy Savings'],
        image: {
          src: '/images/warehouse-lighting.jpg',
          alt: 'Modern commercial LED lighting installation',
        },
        cta: { label: 'Explore Lighting', href: '/contact' },
        reversed: true,
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'data-comms',
        label: 'Data & Communications',
        name: 'Enterprise Network Infrastructure',
        bio: [
          "Future-proof your business with structured cabling infrastructure designed for today's demands and tomorrow's growth. We install Cat6A, fiber optics, and full data centre solutions to ISO/IEC 11801 standards.",
          'From server room fit-outs to desk-to-desk connectivity, we ensure your network is fast, reliable, and scalable. All installations backed by 10-year support agreements.',
        ],
        quote: 'Your network infrastructure should accelerate your business, not hold it back.',
        credentials: ['Cat6A Cabling', 'Fiber Optics', 'Server Rooms', 'ISO/IEC 11801', '10-Year Support'],
        image: {
          src: '/images/services-data-comms.jpg',
          alt: 'Structured cabling and network infrastructure',
        },
        cta: { label: 'Plan Your Network', href: '/contact' },
        reversed: false,
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'testing',
        label: 'Testing & Certification',
        headline: 'Complete Compliance, Guaranteed',
        headlineHighlight: 'Guaranteed',
        description:
          'Comprehensive electrical testing and certification to keep your business safe, compliant, and insured. All testing performed by NICEIC Approved Contractors.',
        pillars: [
          {
            icon: 'ClipboardCheck',
            title: 'EICR Reports',
            description: 'Electrical Installation Condition Reports with detailed findings and actionable recommendations.',
            highlight: false,
          },
          {
            icon: 'ClipboardCheck',
            title: 'PAT Testing',
            description: 'Portable Appliance Testing for all equipment — essential for insurance and health & safety compliance.',
            highlight: true,
          },
          {
            icon: 'Shield',
            title: 'Periodic Inspections',
            description: 'Scheduled testing programs to maintain continuous compliance and prevent failures.',
            highlight: false,
          },
          {
            icon: 'Award',
            title: 'Full Documentation',
            description: 'Complete certification packs for landlords, insurers, and regulatory bodies.',
            highlight: false,
          },
        ],
        checklist: [
          'BS 7671 18th Edition certified testing',
          'Detailed condition reports with photographs',
          'Priority recommendations and timelines',
          'Full Part P notification where required',
          'Digital certificate delivery within 24 hours',
          'Annual testing programs available',
        ],
        partners: [
          { name: 'NICEIC', abbr: 'NIC' },
          { name: 'Part P', abbr: 'P.P' },
          { name: 'NAPIT', abbr: 'NAP' },
          { name: 'ECS Gold', abbr: 'ECS' },
          { name: 'CHAS', abbr: 'CHA' },
          { name: 'ISO 9001', abbr: 'ISO' },
        ],
        background: 'dark',
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'maintenance',
        label: 'Maintenance & Support',
        headline: 'Keep Your Business Running',
        headlineHighlight: 'Running',
        description:
          'Proactive maintenance programs and rapid emergency response to minimize downtime and protect your operations.',
        pillars: [
          {
            icon: 'Phone',
            title: '24/7 Emergency Response',
            description: 'Rapid response to electrical faults and emergencies — typically within 2 hours.',
            highlight: true,
          },
          {
            icon: 'Wrench',
            title: 'Planned Maintenance',
            description: 'Scheduled inspections, testing, and preventive maintenance to avoid costly failures.',
            highlight: false,
          },
          {
            icon: 'ClipboardCheck',
            title: 'Compliance Management',
            description: 'We track your certification dates and ensure you never fall out of compliance.',
            highlight: false,
          },
          {
            icon: 'Clock',
            title: 'Priority Support',
            description: 'Dedicated account management and priority scheduling for contract clients.',
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
          label: 'Ready to Start?',
          headline: "Let's Power Your Business",
          headlineHighlight: 'Your Business',
          description:
            "Whether you're planning a new fit-out, upgrading your lighting, or need ongoing maintenance support — we're here to help.",
          primaryCTA: { label: 'Request a Quote', href: '/contact' },
          secondaryCTA: { label: 'Call Us Now', href: 'tel:+442012345678' },
        },
      },
    },
  ],
};
