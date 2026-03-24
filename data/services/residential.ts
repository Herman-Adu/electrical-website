import type { ServicePageData } from '@/types/sections';

export const residentialPageData: ServicePageData = {
  slug: 'residential',
  meta: {
    title: 'Residential & Domestic Electrical Services | NexGen Electrical',
    description:
      'Complete home electrical services including rewires, smart home installations, EV chargers, and EICR certificates. Trusted by homeowners and landlords.',
    keywords: ['residential electrical', 'home rewire', 'smart home', 'EV charger installation', 'landlord certificates'],
  },
  hero: {
    eyebrow: 'Residential & Domestic',
    headline: ['Powering', 'Modern', 'Homes'],
    headlineHighlight: 'Modern',
    subheadline:
      'Complete electrical services for homeowners, landlords, and property managers. From full rewires to smart home installations, we make your home safer and smarter.',
    stats: [
      { value: '1,200+', label: 'Homes Completed' },
      { value: '5-Star', label: 'Reviews' },
      { value: 'Part P', label: 'Certified' },
      { value: 'Same Day', label: 'Certificates' },
    ],
    scrollTargetId: 'electrical',
    scrollLabel: 'Our Services',
    backgroundImage: {
      src: '/images/smart-living-interior.jpg',
      alt: 'Modern residential electrical installation',
      priority: true,
    },
  },
  intro: {
    sectionId: 'our-promise',
    label: 'Our Promise',
    headlineWords: [
      'Your',
      'Home',
      'Deserves',
      'Expert',
      'Care',
    ],
    leadParagraph:
      'Your home\'s electrical system is too important to trust to anyone. We bring certified expertise, transparent pricing, and genuine care to every residential project.',
    bodyParagraphs: [
      'Whether you need a full rewire, a new EV charger, smart home automation, or just peace of mind with an EICR safety certificate, we handle it with the same professionalism we\'d use in our own homes. Part P certified, fully insured, and committed to your satisfaction.',
      'From initial consultation through final inspection, we keep you informed and involved. No hidden costs, no surprises — just honest electrical work done right.',
    ],
    pillars: [
      {
        number: '01',
        title: 'Part P Certified',
        description: 'Fully qualified and registered for all domestic electrical work.',
      },
      {
        number: '02',
        title: 'Clean & Tidy',
        description: 'We respect your home and leave every job spotless.',
      },
      {
        number: '03',
        title: 'Fixed Pricing',
        description: 'Transparent quotes with no hidden charges or surprise bills.',
      },
    ],
  },
  sections: [
    {
      type: 'profile',
      data: {
        sectionId: 'electrical',
        label: 'Home Electrical',
        name: 'Complete Home Electrical Services',
        bio: [
          'From full house rewires to new consumer units, we handle every aspect of residential electrical work. Our team works cleanly and efficiently, minimizing disruption to your daily life while ensuring the highest safety standards.',
          'All work is completed to BS 7671 standards with full Part P notification and certification. We leave every home safer than we found it.',
        ],
        quote: "Your home deserves the same quality electrical work we'd put in our own.",
        credentials: ['Full Rewires', 'Consumer Units', 'New Builds', 'Extensions', 'Part P Certified'],
        image: {
          src: '/images/smart-living-interior.jpg',
          alt: 'Modern residential electrical installation',
          priority: true,
        },
        cta: { label: 'Get a Quote', href: '/contact' },
        reversed: false,
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'smart-home',
        label: 'Smart Home & EV',
        name: 'Smart Home & EV Charging',
        bio: [
          'Transform your home with intelligent electrical systems. We install EV chargers, smart lighting, automated heating controls, and solar-ready consumer units that prepare your home for the future.',
          'Our smart home solutions integrate seamlessly with your existing systems — Apple HomeKit, Google Home, Amazon Alexa, and more. Control your home from anywhere.',
        ],
        quote: 'The homes of tomorrow are being built today — make sure yours is ready.',
        credentials: ['EV Chargers', 'Smart Lighting', 'Home Automation', 'Solar-Ready', 'Voice Control'],
        image: {
          src: '/images/smart-living-interior.jpg',
          alt: 'Smart home control panel and EV charger',
        },
        cta: { label: 'Upgrade Your Home', href: '/contact' },
        reversed: true,
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'testing',
        label: 'Testing & Certificates',
        headline: 'Certificates & Compliance',
        headlineHighlight: 'Compliance',
        description:
          'Essential testing and certification for homeowners, landlords, and property managers. Fast turnaround with same-day digital certificates.',
        pillars: [
          {
            icon: 'ClipboardCheck',
            title: 'EICR Certificates',
            description: 'Electrical Installation Condition Reports for homeowners, landlords, and property sales.',
            highlight: true,
          },
          {
            icon: 'ClipboardCheck',
            title: 'Landlord Certificates',
            description: 'Legally required 5-year certificates for all rental properties. We handle the paperwork.',
            highlight: false,
          },
          {
            icon: 'ClipboardCheck',
            title: 'PAT Testing',
            description: 'Portable appliance testing for landlords and home offices. Annual programs available.',
            highlight: false,
          },
          {
            icon: 'Award',
            title: 'Part P Certificates',
            description: 'Full building control notification and certification for all notifiable work.',
            highlight: false,
          },
        ],
        checklist: [
          'Same-day digital certificate delivery',
          'Full photographic documentation',
          'Clear explanations of any issues found',
          'Remedial work quotes if needed',
          'Reminder service for renewal dates',
          'Landlord portfolio management',
        ],
        partners: [
          { name: 'NICEIC', abbr: 'NIC' },
          { name: 'Part P', abbr: 'P.P' },
          { name: 'TrustMark', abbr: 'TM' },
          { name: 'Which?', abbr: 'W?' },
          { name: 'Checkatrade', abbr: 'CT' },
          { name: 'NAPIT', abbr: 'NAP' },
        ],
        background: 'dark',
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'maintenance',
        label: 'Home Maintenance',
        headline: 'Repairs & Upgrades',
        headlineHighlight: 'Upgrades',
        description:
          'Fast, reliable repairs and upgrades for your home. From fixing faulty sockets to adding new circuits, no job is too small.',
        pillars: [
          {
            icon: 'Phone',
            title: 'Emergency Repairs',
            description: 'Power outages, tripping circuits, and electrical emergencies handled same-day.',
            highlight: false,
          },
          {
            icon: 'Wrench',
            title: 'Fault Finding',
            description: 'Expert diagnosis of intermittent faults, humming sounds, and unexplained trips.',
            highlight: true,
          },
          {
            icon: 'Lightbulb',
            title: 'Lighting Upgrades',
            description: 'LED conversions, dimmer switches, and decorative lighting installations.',
            highlight: false,
          },
          {
            icon: 'Plug',
            title: 'Additional Circuits',
            description: 'New sockets, outdoor supplies, workshop circuits, and garden electrics.',
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
          headline: 'Your Home, Our Expertise',
          headlineHighlight: 'Our Expertise',
          description:
            "Whether it's a simple repair or a complete rewire, we treat every home with the same care and professionalism.",
          primaryCTA: { label: 'Get a Free Quote', href: '/contact' },
          secondaryCTA: { label: 'Call Us Today', href: 'tel:+442012345678' },
        },
      },
    },
  ],
};
