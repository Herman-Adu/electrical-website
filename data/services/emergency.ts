import type { ServicePageData } from "@/types/sections";

export const emergencyPageData: ServicePageData = {
  slug: "emergency",
  meta: {
    title: "Emergency Electrical Services | 24/7 Callout | NexGen Electrical",
    description:
      "24/7 emergency electrical response for commercial, industrial, and residential properties. Rapid response, expert diagnosis, immediate solutions.",
    keywords: [
      "emergency electrician",
      "24/7 electrical",
      "electrical emergency",
      "power outage",
      "emergency callout",
    ],
  },
  hero: {
    eyebrow: "24/7 Emergency Response",
    headline: ["We Answer", "Every Call,", "Day or Night"],
    headlineHighlight: "Every Call,",
    subheadline:
      "Electrical emergencies don't keep business hours — and neither do we. Rapid response, expert diagnosis, and immediate solutions when you need them most.",
    stats: [
      { value: "< 2hr", label: "Response Time" },
      { value: "24/7", label: "Availability" },
      { value: "365", label: "Days a Year" },
      { value: "100%", label: "Resolution" },
    ],
    scrollTargetId: "response",
    scrollLabel: "Get Help Now",
    backgroundImage: {
      //src: "/images/services-emergency.jpg",
      src: "/images/services/emergency/nexgen-branded-van-and-driver-hero.jpg",
      alt: "NexGen emergency electrician with branded response van, keys in hand, ready for 24/7 callout",
      priority: true,
    },
    trustIndicators: [
      {
        icon: "Wrench" as const,
        title: "24/7 Rapid Response",
        description:
          "Always-on emergency electrical service, any hour of any day",
      },
      {
        icon: "Zap" as const,
        title: "2-Hour SLA",
        description:
          "Guaranteed response commitment for all urgent electrical faults",
      },
      {
        icon: "Shield" as const,
        title: "Safe and Certified",
        description:
          "Emergency work documented and certified for insurance purposes",
      },
      {
        icon: "Phone" as const,
        title: "Direct Emergency Line",
        description:
          "Call direct to reach our qualified emergency electrical team",
      },
    ],
    metadata: ["NICEIC Approved", "24/7 Cover", "2-Hour SLA", "365 Days/Year"],
  },
  intro: {
    sectionId: "when-seconds-matter",
    label: "When Seconds Matter",
    headlineWords: ["Electrical", "Emergencies", "Don't", "Wait"],
    leadParagraph:
      "When your power fails or a fault puts you at risk, you need help immediately. We maintain a 24/7 rapid-response team ready to diagnose and fix electrical emergencies before they become disasters.",
    bodyParagraphs: [
      "Whether a breaker won't reset, smoke is visible in a wall, or you've lost power entirely, our emergency electricians respond within minutes. We arrive equipped to diagnose any issue and implement immediate solutions, from temporary power restoration to permanent repairs.",
      "Our emergency service covers commercial facilities, industrial plants, and residential properties. We're available every day of the year, including holidays, with no call-out surcharges — just honest expert help when you need it most.",
    ],
    pillars: [
      {
        num: "01",
        title: "60-Min Response",
        description: "Rapid dispatch and arrival to stabilize your situation.",
      },
      {
        num: "02",
        title: "24/7 Availability",
        description: "Always on call, including weekends and holidays.",
      },
      {
        num: "03",
        title: "No Call-Out Fees",
        description: "Transparent pricing with no emergency surcharges.",
      },
    ],
  },
  sections: [
    {
      type: "profile",
      data: {
        sectionId: "residential-emergency",
        label: "Home & Property",
        name: "Residential Emergency Callouts",
        title: "Fast, Safe Electrical Response for Homeowners",
        credentials: [
          "Consumer Unit Failures",
          "Electrical Fire Risk",
          "After-Hours Response",
          "Power Loss Investigation",
        ],
        bio: [
          "Whether it's a total power loss at midnight or a tripped board that won't reset, our residential emergency team provides rapid, professional response across Berkshire, Surrey, and the surrounding counties. We cover single-property faults, multi-unit blocks, and managed residential estates — arriving with the diagnostic equipment and common parts to identify and resolve most faults on a first visit.",
          "Our engineers are NICEIC-accredited and trained to work safely under pressure. We carry standard parts — consumer units, RCDs, MCBs, SPDs — so the most common residential faults are resolved same-visit, without waiting for a return appointment.",
        ],
        highlights: [
          {
            icon: "Clock" as const,
            title: "2-Hour Response",
            description:
              "Most residential callouts attended within 2 hours, including evenings and weekends.",
          },
          {
            icon: "AlertTriangle" as const,
            title: "Consumer Unit Failures",
            description:
              "Immediate diagnosis and safe isolation of faulty boards, RCDs, and MCBs.",
          },
          {
            icon: "Shield" as const,
            title: "Electrical Fire Risk",
            description:
              "Rapid fault finding to eliminate arc faults, overloads, and potential fire hazards.",
          },
          {
            icon: "Phone" as const,
            title: "24/7 Availability",
            description:
              "Night, weekend, and bank holiday cover — with no premium out-of-hours surcharge.",
          },
        ],
        quote:
          "When your home goes dark, you need someone who responds fast and gets it right the first time.",
        quoteAttribution: "NexGen Emergency Response Team",
        image: {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-rear-patio-night-uplighters.jpg",
          alt: "NexGen residential electrical installation — external patio night uplighting at Calcot Park Golf Club",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: false,
        cta: { label: "Call Emergency Line", href: "/contact" },
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "commercial-emergency",
        label: "Business & Retail",
        name: "Commercial Emergency Callouts",
        title: "Protecting Business Operations When It Matters Most",
        credentials: [
          "Business Continuity",
          "Switchgear & Panel Restoration",
          "Compliance Emergencies",
          "Retail & Hospitality",
        ],
        bio: [
          "Electrical failures in commercial premises don't just cause inconvenience — they cost revenue, can breach licensing conditions, and may trigger immediate closure notices. Our commercial emergency service is built around business continuity. From a failed distribution board in a retail unit to a total site outage at a hotel, we arrive prepared to diagnose and restore power efficiently.",
          "We stock commercial-grade parts on our vehicles — breakers, busbars, isolation switches, and cable — so the most common commercial faults are resolved without ordering delays. For complex installations, we coordinate with your facilities manager and maintain full compliance documentation throughout.",
        ],
        highlights: [
          {
            icon: "Building2" as const,
            title: "Business Continuity",
            description:
              "Priority commercial response focused on restoring trading capability as fast as possible.",
          },
          {
            icon: "Zap" as const,
            title: "Switchgear Failures",
            description:
              "Emergency restoration of distribution boards, panels, and switchroom equipment.",
          },
          {
            icon: "ClipboardCheck" as const,
            title: "Compliance Emergencies",
            description:
              "Urgent remedial works and EICR investigations following fault or inspection failure.",
          },
          {
            icon: "Users" as const,
            title: "Sector Experience",
            description:
              "Retail, hospitality, offices, healthcare, and licensed premises all covered.",
          },
        ],
        quote:
          "A power failure costs far more than the repair. We know that — and our commercial response is built around speed and precision.",
        quoteAttribution: "NexGen Commercial Emergency Team",
        image: {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-first-fix-wiring.jpg",
          alt: "NexGen commercial electrical installation — first-fix wiring at Biffa waste management workshop",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: true,
        cta: { label: "Commercial Emergency Support", href: "/contact" },
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "industrial-emergency",
        label: "Industrial & Manufacturing",
        name: "Industrial Emergency Callouts",
        title: "Critical Infrastructure Response for Industrial Facilities",
        credentials: [
          "Production Line Recovery",
          "High-Voltage Support",
          "Motor & Drive Failures",
          "Site-Wide Coordination",
        ],
        bio: [
          "For industrial sites, electrical downtime translates directly to production loss — often measured in thousands per hour. Our industrial emergency team is trained to work on complex, high-voltage installations including switchrooms, substations, motor control centres, and variable speed drive systems. We carry certified HV engineers and the specialist test equipment required for large-site diagnostics.",
          "We work alongside your in-house maintenance and engineering teams, integrating with existing LOTO procedures and site safety protocols. Our engineers understand the operational pressure to restore production — and the non-negotiable requirement to do so safely and correctly.",
        ],
        highlights: [
          {
            icon: "Activity" as const,
            title: "Production Line Recovery",
            description:
              "Critical electrical systems restored with focus on minimising production downtime.",
          },
          {
            icon: "Gauge" as const,
            title: "High-Voltage Support",
            description:
              "Certified HV engineers for substation, switchroom, and LV/HV interface emergencies.",
          },
          {
            icon: "Settings" as const,
            title: "Motor & Drive Failures",
            description:
              "Emergency diagnosis of VSD, motor control, and MCC panel faults under operational pressure.",
          },
          {
            icon: "MapPin" as const,
            title: "Site-Wide Coordination",
            description:
              "Coordinated emergency response for large facilities with multiple distribution points.",
          },
        ],
        quote:
          "Industrial downtime is measured in thousands per hour. Our engineers are trained to move fast — and to get it right every time.",
        quoteAttribution: "NexGen Industrial Emergency Team",
        image: {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg",
          alt: "NexGen industrial electrical installation — chiller bank electrical commissioning at Harvey Nichols",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: false,
        cta: { label: "Industrial Emergency Line", href: "/contact" },
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "ready-to-respond",
        label: "Always Ready",
        name: "Fully Equipped. Fully Certified. Always Ready.",
        title: "The Right Parts, Right Now — Every Time",
        credentials: [
          "Fully Stocked Response Vans",
          "IET 18th Edition Compliance",
          "NICEIC Certified Engineers",
          "Transparent Callout Terms",
        ],
        bio: [
          "Every NexGen emergency response van carries a curated stock of the components most commonly needed to resolve faults on a first visit — consumer units, RCDs, MCBs, SPDs, isolation switches, cable, and conduit. We arrive prepared, not guessing. That means faster resolution, fewer return visits, and less time without power for you, your business, or your facility.",
          "All emergency works are carried out in strict compliance with BS 7671 IET 18th Edition Wiring Regulations and applicable sector standards. Every callout is attended by a NICEIC-certified engineer and fully documented — fault report and completion certificate issued on site before we leave. By contacting us to request emergency cover — by phone or via our contact form — you confirm acceptance of our standard callout terms.",
        ],
        highlights: [
          {
            icon: "Wrench" as const,
            title: "Stocked for First-Visit Resolution",
            description:
              "Vans carry the parts needed to resolve the most common residential, commercial, and industrial faults on arrival — no waiting on parts.",
          },
          {
            icon: "BookOpen" as const,
            title: "BS 7671 Compliant",
            description:
              "All emergency works carried out to IET 18th Edition Wiring Regulations as standard, with full documentation issued on site.",
          },
          {
            icon: "Award" as const,
            title: "NICEIC Certified Engineers",
            description:
              "Every callout attended by a qualified, NICEIC-registered electrician — no sub-contractors, no exceptions.",
          },
          {
            icon: "ClipboardCheck" as const,
            title: "Callout Terms Apply",
            description:
              "A standard callout fee applies when you book emergency cover. Full terms are provided before confirmation.",
          },
        ],
        quote:
          "We carry the parts. We know the regs. We leave with the job done.",
        quoteAttribution: "NexGen Emergency Response Team",
        image: {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-bespoke-cable-tray-prefabricated.jpg",
          alt: "NexGen emergency electrician beside fully stocked branded response van, NICEIC certified and ready for 24/7 callout",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: true,
        cta: { label: "View Callout Terms", href: "/contact" },
      },
    },
    {
      type: "features",
      data: {
        sectionId: "services",
        label: "Emergency Services",
        headline: "What We Handle",
        headlineHighlight: "Handle",
        description:
          "Our emergency team is equipped to diagnose and resolve the full spectrum of electrical emergencies.",
        pillars: [
          {
            icon: "AlertTriangle",
            title: "Power Failures",
            description:
              "Complete outages, partial failures, and intermittent power problems diagnosed and fixed fast.",
            highlight: true,
          },
          {
            icon: "Zap",
            title: "Tripping Circuits",
            description:
              "Persistent RCD trips, MCB failures, and nuisance tripping investigated and resolved.",
            highlight: false,
          },
          {
            icon: "Shield",
            title: "Dangerous Faults",
            description:
              "Burning smells, sparking, hot sockets, and exposed wiring made safe immediately.",
            highlight: false,
          },
          {
            icon: "Battery",
            title: "Equipment Failures",
            description:
              "Consumer unit failures, meter problems, and main fuse issues requiring urgent attention.",
            highlight: false,
          },
        ],
        checklist: [
          "Response within 60 minutes of your call",
          "24/7 availability including weekends and bank holidays",
          "No call-out fee — transparent, fixed-price emergency rates",
          "Fully equipped vans for first-visit resolution",
          "NICEIC certified for all emergency works",
          "Written report provided after every callout",
        ],
        partners: [
          { name: "NICEIC", abbr: "NIC" },
          { name: "Part P", abbr: "P.P" },
          { name: "NAPIT", abbr: "NAP" },
          { name: "ECS Gold", abbr: "ECS" },
          { name: "CHAS", abbr: "CHA" },
          { name: "ISO 9001", abbr: "ISO" },
        ],
      },
    },
    {
      type: "features",
      data: {
        sectionId: "sectors",
        label: "All Sectors Covered",
        headline: "Emergency Support for Every Sector",
        headlineHighlight: "Every Sector",
        description:
          "Whether you're a homeowner, business owner, or facility manager — we're here when you need us.",
        pillars: [
          {
            icon: "Building2",
            title: "Commercial",
            description:
              "Offices, retail, hospitality — we understand the cost of commercial downtime.",
            highlight: false,
          },
          {
            icon: "Factory",
            title: "Industrial",
            description:
              "Factories, warehouses, processing plants — rapid response to minimize production losses.",
            highlight: true,
          },
          {
            icon: "Home",
            title: "Residential",
            description:
              "Homes, flats, rental properties — keeping families safe around the clock.",
            highlight: false,
          },
          {
            icon: "Users",
            title: "Public Sector",
            description:
              "Schools, hospitals, council buildings — priority response for critical infrastructure.",
            highlight: false,
          },
        ],
        checklist: [
          "Specialist response for residential, commercial, and industrial sites",
          "Priority dispatch for critical infrastructure and public sector",
          "All work fully insured and liability-covered across all sectors",
          "Compliance documentation and certification issued after every job",
          "Follow-up visit and fault prevention report included",
          "Insurance-accepted emergency certification provided",
        ],
        partners: [
          { name: "NICEIC", abbr: "NIC" },
          { name: "Part P", abbr: "P.P" },
          { name: "NAPIT", abbr: "NAP" },
          { name: "ECS Gold", abbr: "ECS" },
          { name: "CHAS", abbr: "CHA" },
          { name: "ISO 9001", abbr: "ISO" },
        ],
        background: "dark",
      },
    },
    {
      type: "cta",
      data: {
        sectionId: "contact",
        finalCTA: {
          label: "Electrical Emergency?",
          headline: "Call Us Now",
          headlineHighlight: "Now",
          description:
            "Don't wait. Our emergency team is standing by 24/7 to take your call and dispatch help immediately.",
          primaryCTA: { label: "Emergency Callout", href: "tel:+442012345678" },
          secondaryCTA: { label: "Send Details", href: "/contact" },
        },
      },
    },
  ],
};
