import type { ServicePageData } from '@/types/sections';

export const emergencyPageData: ServicePageData = {
  slug: 'emergency',
  meta: {
    title: 'Emergency Electrical Services | 24/7 Callout | NexGen Electrical',
    description:
      '24/7 emergency electrical response for commercial, industrial, and residential properties. Rapid response, expert diagnosis, immediate solutions.',
    keywords: ['emergency electrician', '24/7 electrical', 'electrical emergency', 'power outage', 'emergency callout'],
  },
  hero: {
    eyebrow: '24/7 Emergency Response',
    headline: ['Always', 'On', 'Call'],
    headlineHighlight: 'On',
    subheadline:
      "Electrical emergencies don't keep business hours — and neither do we. Rapid response, expert diagnosis, and immediate solutions when you need them most.",
    stats: [
      { value: '< 2hr', label: 'Response Time' },
      { value: '24/7', label: 'Availability' },
      { value: '365', label: 'Days a Year' },
      { value: '100%', label: 'Resolution' },
    ],
    scrollTargetId: 'response',
    scrollLabel: 'Get Help Now',
    backgroundImage: {
      src: '/images/services-emergency.jpg',
      alt: '24/7 emergency electrical response',
      priority: true,
    },
  },
  sections: [
    {
      type: 'profile',
      data: {
        sectionId: 'response',
        label: '24/7 Emergency Response',
        name: 'Rapid Emergency Callout',
        bio: [
          'When electrical emergencies strike, every minute counts. Our emergency response team is on standby 24 hours a day, 7 days a week, ready to mobilize within minutes of your call.',
          'We handle everything from complete power failures and dangerous faults to tripping circuits and burning smells. Our vans are fully stocked with parts and equipment to resolve most emergencies on the first visit.',
        ],
        quote: "In an electrical emergency, you need someone who'll pick up the phone — and show up fast.",
        credentials: ['2-Hour Response', 'Fully Stocked Vans', 'Expert Diagnosis', 'Immediate Solutions', 'All Sectors'],
        image: {
          src: '/images/services-emergency.jpg',
          alt: 'Emergency electrician responding to callout',
          priority: true,
        },
        cta: { label: 'Call Now', href: 'tel:+442012345678' },
        reversed: false,
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'services',
        label: 'Emergency Services',
        headline: 'What We Handle',
        headlineHighlight: 'Handle',
        description: 'Our emergency team is equipped to diagnose and resolve the full spectrum of electrical emergencies.',
        pillars: [
          {
            icon: 'AlertTriangle',
            title: 'Power Failures',
            description: 'Complete outages, partial failures, and intermittent power problems diagnosed and fixed fast.',
            highlight: true,
          },
          {
            icon: 'Zap',
            title: 'Tripping Circuits',
            description: 'Persistent RCD trips, MCB failures, and nuisance tripping investigated and resolved.',
            highlight: false,
          },
          {
            icon: 'Shield',
            title: 'Dangerous Faults',
            description: 'Burning smells, sparking, hot sockets, and exposed wiring made safe immediately.',
            highlight: false,
          },
          {
            icon: 'Battery',
            title: 'Equipment Failures',
            description: 'Consumer unit failures, meter problems, and main fuse issues requiring urgent attention.',
            highlight: false,
          },
        ],
      },
    },
    {
      type: 'features',
      data: {
        sectionId: 'sectors',
        label: 'All Sectors Covered',
        headline: 'Emergency Support for Every Sector',
        headlineHighlight: 'Every Sector',
        description: "Whether you're a homeowner, business owner, or facility manager — we're here when you need us.",
        pillars: [
          {
            icon: 'Building2',
            title: 'Commercial',
            description: 'Offices, retail, hospitality — we understand the cost of commercial downtime.',
            highlight: false,
          },
          {
            icon: 'Factory',
            title: 'Industrial',
            description: 'Factories, warehouses, processing plants — rapid response to minimize production losses.',
            highlight: true,
          },
          {
            icon: 'Home',
            title: 'Residential',
            description: 'Homes, flats, rental properties — keeping families safe around the clock.',
            highlight: false,
          },
          {
            icon: 'Users',
            title: 'Public Sector',
            description: 'Schools, hospitals, council buildings — priority response for critical infrastructure.',
            highlight: false,
          },
        ],
        background: 'dark',
      },
    },
    {
      type: 'profile',
      data: {
        sectionId: 'diagnosis',
        label: 'Expert Diagnosis',
        name: 'Fast & Accurate Fault Finding',
        bio: [
          'Our emergency electricians are experienced troubleshooters who quickly identify root causes — not just symptoms. We use thermal imaging, advanced metering, and systematic testing to diagnose even the most elusive faults.',
          "Many emergencies are caused by underlying issues that need proper resolution, not quick fixes. We'll explain exactly what went wrong and ensure it doesn't happen again.",
        ],
        quote: "Finding the fault is half the battle. We don't leave until we've fixed the cause, not just the symptom.",
        credentials: ['Thermal Imaging', 'Advanced Metering', 'Systematic Testing', 'Root Cause Analysis', 'Full Reports'],
        image: {
          src: '/images/system-diagnostics.jpg',
          alt: 'Electrician using thermal imaging for fault diagnosis',
        },
        cta: { label: 'Report a Fault', href: '/contact' },
        reversed: true,
      },
    },
    {
      type: 'cta',
      data: {
        sectionId: 'contact',
        finalCTA: {
          label: 'Electrical Emergency?',
          headline: 'Call Us Now',
          headlineHighlight: 'Now',
          description:
            "Don't wait. Our emergency team is standing by 24/7 to take your call and dispatch help immediately.",
          primaryCTA: { label: 'Emergency Callout', href: 'tel:+442012345678' },
          secondaryCTA: { label: 'Send Details', href: '/contact' },
        },
      },
    },
  ],
};
