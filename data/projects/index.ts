import type {
  Project,
  ProjectBentoItem,
  ProjectCategory,
  ProjectCategorySlug,
  ProjectListItem,
} from "@/types/projects";

export const projectCategories: ProjectCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description: "Home and domestic electrical delivery projects.",
  },
  {
    slug: "commercial-lighting",
    label: "Commercial Lighting",
    description:
      "Retail, office, and mixed-use lighting modernisation projects.",
    showInNav: false,
  },
  {
    slug: "power-boards",
    label: "Power Boards",
    description:
      "Distribution, switchgear, and board upgrade infrastructure projects.",
  },
  {
    slug: "community",
    label: "Community",
    description:
      "Public sector, community facilities, and social infrastructure electrical projects.",
  },
  {
    slug: "commercial",
    label: "Commercial",
    description:
      "Full Cat B fit-out and electrical infrastructure for commercial and logistics facilities.",
  },
];

export function isProjectCategorySlug(
  value: string,
): value is Exclude<ProjectCategorySlug, "all"> {
  return projectCategories.some((category) => category.slug === value);
}

export const allProjects: Project[] = [
  {
    id: "proj-001",
    slug: "west-dock-industrial-upgrade",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "West Dock Industrial Upgrade",
    clientSector: "Industrial",
    status: "in-progress",
    description:
      "High-capacity electrical infrastructure refresh for a multi-unit logistics and manufacturing dock, including modernized switchgear and resilience improvements.",
    coverImage: {
      src: "/images/services-industrial.jpg",
      alt: "Industrial dock electrical infrastructure upgrade",
    },
    kpis: {
      budget: "£1.2M",
      timeline: "9 months",
      capacity: "11kV",
      location: "London Docklands",
    },
    tags: ["Switchgear", "Resilience", "High Voltage"],
    progress: 68,
    isFeatured: false,
    publishedAt: "2026-01-08T09:00:00.000Z",
    updatedAt: "2026-03-20T14:10:00.000Z",
    detail: {
      intro: {
        label: "Project Overview",
        headlineWords: [
          "Powering",
          "Tomorrow's",
          "Logistics",
          "with",
          "Industrial-Grade",
          "Infrastructure.",
        ],
        leadParagraph:
          "When West Dock Logistics approached us with ageing switchgear and unreliable power distribution, we saw an opportunity to transform their entire electrical backbone — not just repair it.",
        bodyParagraphs: [
          "The London Docklands facility spans over 40,000 square metres of active logistics and light manufacturing space, operating 24/7 with zero tolerance for downtime. Legacy electrical systems installed in the 1990s were struggling to meet modern load demands and posed significant compliance risks.",
          "Our team designed a phased upgrade strategy that maintained operational continuity throughout the project — replacing high-voltage switchgear, modernising distribution boards, and installing intelligent monitoring systems that give facility managers real-time visibility into power consumption and system health.",
        ],
        pillars: [
          {
            num: "01",
            title: "Zero Downtime Strategy",
            description:
              "Phased installation designed around active operations, with hot-swap capability for critical systems.",
          },
          {
            num: "02",
            title: "Future-Ready Capacity",
            description:
              "Upgraded from 6kV to 11kV infrastructure with 40% headroom for expansion and EV charging integration.",
          },
          {
            num: "03",
            title: "Intelligent Monitoring",
            description:
              "IoT-enabled power monitoring providing real-time analytics, predictive maintenance alerts, and energy optimisation.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Assessment & Design",
          description:
            "Complete site survey, load analysis, and detailed engineering drawings for switchgear replacement.",
          duration: "6 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "Primary Switchgear Upgrade",
          description:
            "Replacement of main 11kV ring main unit and primary distribution panels.",
          duration: "10 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Secondary Distribution",
          description:
            "Installation of new sub-distribution boards and cable infrastructure across all units.",
          duration: "12 weeks",
          status: "in-progress",
        },
        {
          phase: "Phase 4",
          title: "Monitoring & Commissioning",
          description:
            "IoT sensor deployment, system integration, testing, and final commissioning.",
          duration: "8 weeks",
          status: "upcoming",
        },
      ],
      scope: [
        {
          icon: "Zap",
          title: "High Voltage Switchgear",
          description:
            "Complete replacement of 11kV ring main unit with modern SF6-free vacuum circuit breakers.",
        },
        {
          icon: "Shield",
          title: "Arc Flash Protection",
          description:
            "Installation of arc flash detection and containment systems meeting IEEE 1584 standards.",
        },
        {
          icon: "Gauge",
          title: "Power Monitoring",
          description:
            "Deployment of 120+ IoT sensors for real-time load monitoring and predictive analytics.",
        },
        {
          icon: "Settings",
          title: "Distribution Boards",
          description:
            "24 new sub-distribution boards with IP65 rating and integrated surge protection.",
        },
      ],
      challenge:
        "The existing infrastructure could not be taken offline without halting operations worth £200,000 per day. Traditional upgrade approaches would have required a two-week shutdown — unacceptable for our client.",
      solution:
        "We engineered a hot-swap solution using temporary mobile substations that maintained full power to critical systems while we replaced equipment section by section. Our night-shift teams completed high-risk work during low-demand periods, minimising disruption to daytime operations.",
      gallery: [
        {
          src: "/images/services-industrial.jpg",
          alt: "Main switchgear installation in progress",
          caption: "New 11kV switchgear being installed in the main plant room",
        },
        {
          src: "/images/power-distribution.jpg",
          alt: "Distribution panel upgrade",
          caption: "Modernised distribution boards with integrated monitoring",
        },
        {
          src: "/images/warehouse-lighting.jpg",
          alt: "Facility overview during upgrade",
          caption: "Aerial view of the West Dock facility during Phase 2 works",
        },
      ],
      testimonial: {
        quote:
          "Nexgen delivered what others said was impossible — a complete electrical overhaul without a single day of downtime. Their engineering team worked around our operations seamlessly. This is the standard we expect from all our contractors now.",
        author: "James Morrison",
        role: "Operations Director",
        company: "West Dock Logistics Ltd",
      },
    },
  },
  {
    id: "proj-002",
    slug: "riverside-commercial-retrofit",
    category: "commercial-lighting",
    categoryLabel: "Commercial Lighting",
    title: "Riverside Commercial Retrofit",
    clientSector: "Commercial",
    status: "completed",
    description:
      "Energy-efficient lighting, smart controls, and distribution modernization for a mixed-use office and retail complex.",
    coverImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "Commercial building lighting and controls retrofit",
    },
    kpis: {
      budget: "£680K",
      timeline: "5 months",
      capacity: "440V",
      location: "Canary Wharf",
    },
    tags: ["Lighting", "Smart Controls", "Efficiency"],
    progress: 100,
    isFeatured: false,
    publishedAt: "2025-11-03T09:00:00.000Z",
    updatedAt: "2026-02-12T11:20:00.000Z",
    detail: {
      intro: {
        label: "Project Spotlight",
        headlineWords: [
          "Transforming",
          "Workspaces",
          "with",
          "Intelligent",
          "Lighting",
          "Design.",
        ],
        leadParagraph:
          "Riverside Commercial Centre was battling rising energy costs and tenant complaints about outdated lighting. We delivered a complete transformation that cut energy consumption by 62% while creating spaces people actually want to work in.",
        bodyParagraphs: [
          "The 28,000 square metre mixed-use development houses 40 retail units and 6 floors of Grade A office space. Despite its prime Canary Wharf location, the building was losing tenants to newer developments with superior amenities and lower running costs.",
          "Our lighting retrofit went far beyond simple LED replacement. We designed a human-centric lighting system that adapts throughout the day, improving occupant wellbeing while integrating with the building management system for automated efficiency gains.",
        ],
        pillars: [
          {
            num: "01",
            title: "62% Energy Reduction",
            description:
              "Measured and verified savings through comprehensive LED upgrade and intelligent controls.",
          },
          {
            num: "02",
            title: "Human-Centric Design",
            description:
              "Tunable white lighting that adjusts colour temperature throughout the day for occupant wellbeing.",
          },
          {
            num: "03",
            title: "Smart Integration",
            description:
              "Full BMS integration with occupancy sensing, daylight harvesting, and scene control.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Audit & Design",
          description:
            "Comprehensive lighting audit, 3D modelling, and photometric calculations for optimal layout.",
          duration: "4 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "Retail Floor Installation",
          description:
            "LED retrofit across all 40 retail units with individual tenant coordination.",
          duration: "6 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Office Floor Upgrade",
          description:
            "Human-centric lighting installation with tunable fixtures and sensor deployment.",
          duration: "8 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Controls & Commissioning",
          description:
            "Smart controls programming, BMS integration, and performance verification.",
          duration: "3 weeks",
          status: "completed",
        },
      ],
      scope: [
        {
          icon: "Lightbulb",
          title: "LED Lighting",
          description:
            "2,400 high-efficiency LED fixtures replacing outdated fluorescent and halogen systems.",
        },
        {
          icon: "Settings",
          title: "Smart Controls",
          description:
            "DALI-2 lighting control system with wireless sensors and scene programming.",
        },
        {
          icon: "Gauge",
          title: "Energy Monitoring",
          description:
            "Sub-metering installation for real-time energy tracking and tenant billing.",
        },
        {
          icon: "Shield",
          title: "Emergency Lighting",
          description:
            "Addressable emergency lighting upgrade with automated monthly testing.",
        },
      ],
      challenge:
        "Installing new lighting across occupied retail and office spaces without disrupting business operations or tenant experience — all while coordinating with 40+ different retail operators.",
      solution:
        "We developed a rolling installation programme with dedicated tenant liaison managers. Night-shift teams completed all disruptive work after hours, while our daytime crews focused on controls programming and commissioning that wouldn't disturb occupants.",
      gallery: [
        {
          src: "/images/warehouse-lighting.jpg",
          alt: "Office floor after LED retrofit",
          caption: "Grade A office space with human-centric lighting installed",
        },
        {
          src: "/images/smart-living-interior.jpg",
          alt: "Retail unit lighting",
          caption: "Retail floor lighting designed to enhance product displays",
        },
        {
          src: "/images/services-commercial.jpg",
          alt: "Control room interface",
          caption:
            "Building management system interface showing lighting zones",
        },
      ],
      testimonial: {
        quote:
          "The difference is remarkable. Our tenants are happier, our energy bills have dropped dramatically, and the building has a completely new feel. Nexgen managed the whole project with minimal disruption — I barely knew they were here.",
        author: "Sarah Chen",
        role: "Building Manager",
        company: "Riverside Property Management",
      },
    },
  },
  {
    id: "proj-003",
    slug: "north-estate-residential-phase-2",
    category: "residential",
    categoryLabel: "Residential",
    title: "North Estate Residential Phase 2",
    clientSector: "Residential",
    status: "in-progress",
    description:
      "Second-phase domestic distribution, EV charging readiness, and smart-home backbone for a high-density new-build estate.",
    coverImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Residential development electrical installation",
    },
    kpis: {
      budget: "£430K",
      timeline: "6 months",
      capacity: "230V",
      location: "Croydon",
    },
    tags: ["EV Ready", "Smart Home", "New Build"],
    progress: 41,
    isFeatured: false,
    publishedAt: "2026-02-01T09:00:00.000Z",
    updatedAt: "2026-03-22T08:35:00.000Z",
    detail: {
      intro: {
        label: "Residential Excellence",
        headlineWords: [
          "Building",
          "Homes",
          "Ready",
          "for",
          "the",
          "Next",
          "Generation.",
        ],
        leadParagraph:
          "Phase 2 of the North Estate development brings 156 new homes online with electrical infrastructure designed not just for today, but for the next 30 years of technological advancement.",
        bodyParagraphs: [
          "Modern homebuyers expect more than just power points. They want EV charging, smart home integration, and energy systems that can adapt to solar panels, battery storage, and heat pumps. Our design team worked closely with the developer to future-proof every home.",
          "From the main site distribution to individual consumer units, every element has been specified with capacity headroom and smart integration points. Residents can upgrade to full home automation, install EV chargers, or add renewable generation without any infrastructure changes.",
        ],
        pillars: [
          {
            num: "01",
            title: "EV Ready Infrastructure",
            description:
              "Every parking space pre-wired for 7kW EV charger installation with load management backbone.",
          },
          {
            num: "02",
            title: "Smart Home Backbone",
            description:
              "Cat6a data cabling and smart switch infrastructure ready for full home automation.",
          },
          {
            num: "03",
            title: "Renewable Ready",
            description:
              "Consumer units specified for easy solar PV and battery storage integration.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Site Infrastructure",
          description:
            "Main site distribution, substation connection, and primary cable routes.",
          duration: "8 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "First Fix",
          description:
            "Containment installation, cable drawing, and back-box installation across all units.",
          duration: "10 weeks",
          status: "in-progress",
        },
        {
          phase: "Phase 3",
          title: "Second Fix",
          description:
            "Consumer unit installation, final connections, and smart infrastructure.",
          duration: "8 weeks",
          status: "upcoming",
        },
        {
          phase: "Phase 4",
          title: "Testing & Handover",
          description:
            "Full testing, certification, and individual unit handovers with homeowner briefings.",
          duration: "4 weeks",
          status: "upcoming",
        },
      ],
      scope: [
        {
          icon: "Zap",
          title: "Domestic Installations",
          description:
            "Complete electrical fit-out for 156 residential units ranging from 1-bed to 4-bed homes.",
        },
        {
          icon: "Settings",
          title: "EV Infrastructure",
          description:
            "180 parking spaces pre-wired with dedicated EV circuits and central load management.",
        },
        {
          icon: "Lightbulb",
          title: "Smart Lighting",
          description:
            "LED lighting throughout with smart switch points for future automation.",
        },
        {
          icon: "Shield",
          title: "Safety Systems",
          description:
            "Interconnected smoke detection and emergency lighting to communal areas.",
        },
      ],
      challenge:
        "Coordinating electrical first-fix across multiple buildings with different construction stages, while ensuring consistency in specification and quality across all 156 units.",
      solution:
        "We implemented a dedicated site supervision structure with quality control checkpoints at each stage. Our prefabrication facility prepared consumer units and accessory packs in advance, ensuring every unit receives identical high-quality components installed to the same exacting standards.",
      gallery: [
        {
          src: "/images/smart-living-interior.jpg",
          alt: "Show home interior",
          caption: "Smart lighting and integrated switches in the show home",
        },
        {
          src: "/images/hero-residential.jpg",
          alt: "Living area electrical",
          caption:
            "Premium finishes with concealed wiring and smart switch points",
        },
        {
          src: "/images/services-energy.jpg",
          alt: "Consumer unit installation",
          caption: "Future-ready consumer unit with EV and solar provision",
        },
      ],
      testimonial: {
        quote:
          "Nexgen understand what modern homebuyers expect. Their future-proofing approach has become a key selling point for our development — buyers love knowing their home is ready for EVs and smart technology.",
        author: "Michael Peters",
        role: "Development Director",
        company: "North Estate Developments Ltd",
      },
    },
  },
  {
    id: "proj-004",
    slug: "city-hospital-emergency-power-ring",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "City Hospital Emergency Power Ring",
    clientSector: "Critical Infrastructure",
    status: "planned",
    description:
      "Emergency and backup power ring enhancement project designed to reduce failover latency for critical hospital systems.",
    coverImage: {
      src: "/images/power-distribution.jpg",
      alt: "Emergency backup power planning",
    },
    kpis: {
      budget: "£2.1M",
      timeline: "12 months",
      capacity: "33kV",
      location: "Central London",
    },
    tags: ["Emergency Power", "Redundancy", "Critical Systems"],
    progress: 8,
    isFeatured: false,
    publishedAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-23T12:40:00.000Z",
    detail: {
      intro: {
        label: "Critical Infrastructure",
        headlineWords: [
          "When",
          "Lives",
          "Depend",
          "on",
          "Power,",
          "There's",
          "No",
          "Room",
          "for",
          "Error.",
        ],
        leadParagraph:
          "Central London Hospital serves over 500,000 patients annually. Their ageing emergency power infrastructure needed a complete overhaul to meet modern resilience standards — and we've been entrusted to deliver it.",
        bodyParagraphs: [
          "Healthcare facilities operate under the most demanding electrical requirements of any building type. Operating theatres, intensive care units, and life-support systems cannot tolerate even milliseconds of power interruption. The existing backup systems, while functional, fell short of current HTM 06-01 guidance.",
          "Our engineering team has designed a comprehensive emergency power ring that provides true N+1 redundancy for all critical systems. The new infrastructure will reduce transfer time from 15 seconds to under 500 milliseconds, with zero interruption for the most critical loads.",
        ],
        pillars: [
          {
            num: "01",
            title: "Sub-Second Transfer",
            description:
              "New static transfer switches reducing critical load transfer time from 15 seconds to under 500ms.",
          },
          {
            num: "02",
            title: "N+1 Redundancy",
            description:
              "Dual generator configuration ensuring backup capacity even during maintenance or single-unit failure.",
          },
          {
            num: "03",
            title: "HTM Compliance",
            description:
              "Full compliance with HTM 06-01 and BS 7671 requirements for healthcare premises.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Detailed Design",
          description:
            "Final engineering design, risk assessments, and NHS trust approvals.",
          duration: "8 weeks",
          status: "in-progress",
        },
        {
          phase: "Phase 2",
          title: "Generator Installation",
          description:
            "Installation of new 2MVA generators with acoustic enclosures and fuel systems.",
          duration: "16 weeks",
          status: "upcoming",
        },
        {
          phase: "Phase 3",
          title: "Distribution Upgrade",
          description:
            "New emergency distribution boards and static transfer switch installation.",
          duration: "14 weeks",
          status: "upcoming",
        },
        {
          phase: "Phase 4",
          title: "Integration & Testing",
          description:
            "System integration, witnessed testing, and phased handover to clinical operations.",
          duration: "10 weeks",
          status: "upcoming",
        },
      ],
      scope: [
        {
          icon: "Zap",
          title: "Generator Systems",
          description:
            "Two new 2MVA diesel generators with N+1 configuration and 72-hour fuel autonomy.",
        },
        {
          icon: "Shield",
          title: "Transfer Systems",
          description:
            "Static transfer switches for critical loads with <500ms transfer time.",
        },
        {
          icon: "Gauge",
          title: "Monitoring",
          description:
            "BMS integration with 24/7 remote monitoring and automated testing schedules.",
        },
        {
          icon: "Settings",
          title: "Distribution",
          description:
            "New essential and critical power distribution boards serving all clinical areas.",
        },
      ],
      challenge:
        "Upgrading emergency power systems in an operational hospital where any unplanned power loss could directly impact patient safety and clinical outcomes.",
      solution:
        "Every aspect of this project has been designed around risk mitigation. We've developed detailed method statements in collaboration with clinical teams, with all high-risk work scheduled during low-acuity periods. Temporary backup systems will be deployed before any existing infrastructure is taken offline.",
      gallery: [
        {
          src: "/images/power-distribution.jpg",
          alt: "Emergency power design",
          caption: "3D model of the new emergency power ring configuration",
        },
        {
          src: "/images/services-industrial.jpg",
          alt: "Generator specification",
          caption: "2MVA generator units specified for the project",
        },
        {
          src: "/images/services-commercial.jpg",
          alt: "Control system design",
          caption: "BMS interface design for emergency power monitoring",
        },
      ],
      testimonial: {
        quote:
          "Patient safety is our absolute priority, and that means having electrical infrastructure we can completely rely on. Nexgen's team have shown exceptional understanding of healthcare requirements throughout the design process.",
        author: "Dr. Helen Wright",
        role: "Chief Operating Officer",
        company: "Central London Hospital NHS Trust",
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL POWER-BOARDS PROJECTS (Load More Testing)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-005",
    slug: "thames-gateway-data-centre-power",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "Thames Gateway Data Centre Power Infrastructure",
    clientSector: "Data Centres",
    status: "completed",
    description:
      "Tier III compliant power distribution infrastructure for a new 15MW data centre facility, featuring redundant power paths, UPS systems, and automated switchgear.",
    coverImage: {
      src: "/images/services-industrial.jpg",
      alt: "Data centre power distribution systems",
    },
    kpis: {
      budget: "£4.8M",
      timeline: "18 months",
      capacity: "15MW",
      location: "Thames Gateway",
    },
    tags: ["Data Centre", "Tier III", "UPS Systems", "Redundancy"],
    progress: 100,
    isFeatured: false,
    publishedAt: "2024-06-15T09:00:00.000Z",
    updatedAt: "2025-12-10T16:30:00.000Z",
    detail: {
      intro: {
        label: "Mission Critical",
        headlineWords: [
          "Powering",
          "the",
          "Digital",
          "Economy",
          "with",
          "Unbreakable",
          "Infrastructure.",
        ],
        leadParagraph:
          "When CloudFirst approached us to deliver the electrical infrastructure for their new Thames Gateway facility, they needed a partner who understood that downtime isn't measured in hours — it's measured in millions.",
        bodyParagraphs: [
          "Modern data centres are the backbone of the digital economy. Every millisecond of downtime translates to lost transactions, broken SLAs, and damaged reputations. CloudFirst's new facility needed to achieve Tier III certification, demanding 99.982% availability and concurrent maintainability across all power systems.",
          "Our team designed and delivered a complete 2N redundant power architecture from 33kV intake through to rack-level distribution. The installation includes four 4MVA transformers in an N+1 configuration, 30 minutes of UPS runtime across 12 modular units, and intelligent switchgear that enables any component to be maintained without impacting live operations.",
        ],
        pillars: [
          {
            num: "01",
            title: "2N Redundancy",
            description:
              "Fully redundant power paths from utility intake to rack PDUs, eliminating any single point of failure.",
          },
          {
            num: "02",
            title: "Concurrent Maintainability",
            description:
              "Every component can be isolated and maintained while the facility remains fully operational.",
          },
          {
            num: "03",
            title: "Scalable Architecture",
            description:
              "Modular design supporting expansion from 15MW to 45MW without disruption to existing operations.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "HV Infrastructure",
          description:
            "33kV switchgear installation, transformer compound construction, and primary distribution.",
          duration: "20 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "UPS & Battery Systems",
          description:
            "Installation of 12 modular UPS units with lithium-ion battery strings providing 30-minute runtime.",
          duration: "16 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "LV Distribution",
          description:
            "Row-level power distribution, busway installation, and intelligent PDU deployment.",
          duration: "14 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Testing & Certification",
          description:
            "Integrated systems testing, load bank testing, and Uptime Institute Tier III certification.",
          duration: "8 weeks",
          status: "completed",
        },
      ],
      scope: [
        {
          icon: "Zap",
          title: "HV Systems",
          description:
            "33kV ring main unit, four 4MVA transformers, and automated switchgear with 8-cycle fault clearance.",
        },
        {
          icon: "Battery",
          title: "UPS Infrastructure",
          description:
            "12x 1.5MVA modular UPS units with lithium-ion batteries and 30-minute autonomy.",
        },
        {
          icon: "Network",
          title: "Distribution",
          description:
            "Redundant busway systems, 2N PDU architecture, and intelligent branch circuit monitoring.",
        },
        {
          icon: "Shield",
          title: "Protection",
          description:
            "Arc flash mitigation, selective coordination, and comprehensive earthing system.",
        },
      ],
      challenge:
        "Delivering Tier III compliant infrastructure on an aggressive 18-month timeline while coordinating with mechanical, civil, and IT infrastructure contractors in a brownfield location.",
      solution:
        "We deployed an integrated project delivery model with our design team embedded on-site throughout construction. Prefabricated switchgear assemblies reduced installation time by 40%, and our BIM coordination eliminated clashes before they reached the field. The facility achieved Tier III certification on first submission.",
      gallery: [
        {
          src: "/images/services-industrial.jpg",
          alt: "HV switchgear installation",
          caption: "33kV ring main unit installation during Phase 1",
        },
        {
          src: "/images/power-distribution.jpg",
          alt: "UPS room",
          caption: "Modular UPS installation with lithium-ion battery strings",
        },
        {
          src: "/images/services-commercial.jpg",
          alt: "Data hall distribution",
          caption: "Overhead busway and PDU distribution in live data hall",
        },
      ],
      testimonial: {
        quote:
          "Nexgen delivered infrastructure that exceeded our Tier III requirements. Their understanding of data centre criticality and their ability to coordinate complex installations without impacting our go-live schedule was exceptional.",
        author: "Marcus Chen",
        role: "VP Infrastructure",
        company: "CloudFirst UK",
      },
    },
  },
  {
    id: "proj-006",
    slug: "canary-wharf-tower-mains-upgrade",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "Canary Wharf Tower Mains Upgrade",
    clientSector: "Commercial Property",
    status: "in-progress",
    description:
      "Complete mains intake and distribution board replacement for a 42-storey commercial tower, upgrading 1980s infrastructure to modern standards while maintaining full building occupancy.",
    coverImage: {
      src: "/images/services-commercial.jpg",
      alt: "Commercial tower electrical upgrade",
    },
    kpis: {
      budget: "£3.2M",
      timeline: "14 months",
      capacity: "6.3MVA",
      location: "Canary Wharf",
    },
    tags: ["High Rise", "Live Upgrade", "Distribution", "Commercial"],
    progress: 45,
    isFeatured: false,
    publishedAt: "2025-09-01T09:00:00.000Z",
    updatedAt: "2026-03-25T11:20:00.000Z",
    detail: {
      intro: {
        label: "Urban Engineering",
        headlineWords: [
          "Rewiring",
          "a",
          "Landmark",
          "Without",
          "Missing",
          "a",
          "Beat.",
        ],
        leadParagraph:
          "One Canada Square's sister tower needed a complete electrical overhaul. The challenge? Do it while 4,000 people continue working inside, with zero tolerance for unplanned outages.",
        bodyParagraphs: [
          "The tower's original 1980s electrical infrastructure had served admirably for 40 years, but was now operating at 92% capacity with no room for tenant expansion or EV charging infrastructure. The distribution boards showed signs of thermal stress, and spare parts for the legacy switchgear were becoming impossible to source.",
          "Our engineering team developed a revolutionary 'shadow infrastructure' approach — installing new parallel distribution alongside existing systems, then migrating circuits floor-by-floor during weekend windows. Each switchover takes less than 30 minutes, scheduled months in advance with individual tenants.",
        ],
        pillars: [
          {
            num: "01",
            title: "Shadow Infrastructure",
            description:
              "Parallel new systems installed alongside existing infrastructure before any disruption to tenants.",
          },
          {
            num: "02",
            title: "Floor-by-Floor Migration",
            description:
              "Controlled switchovers during scheduled windows, with each floor taking less than 30 minutes.",
          },
          {
            num: "03",
            title: "40% Capacity Increase",
            description:
              "New infrastructure provides 40% additional capacity for tenant densification and EV charging.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Basement Infrastructure",
          description:
            "New HV switchgear, transformers, and main distribution boards in basement plant rooms.",
          duration: "16 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "Riser Installation",
          description:
            "New rising mains and floor distribution boards installed in parallel with existing.",
          duration: "24 weeks",
          status: "in-progress",
        },
        {
          phase: "Phase 3",
          title: "Floor Migration",
          description:
            "Phased migration of each floor from legacy to new distribution during weekend windows.",
          duration: "12 weeks",
          status: "upcoming",
        },
        {
          phase: "Phase 4",
          title: "Legacy Removal",
          description:
            "Safe removal of decommissioned infrastructure and final testing and certification.",
          duration: "8 weeks",
          status: "upcoming",
        },
      ],
      scope: [
        {
          icon: "Building",
          title: "HV Switchgear",
          description:
            "New 11kV ring main unit and three 2.1MVA transformers with OLTC capability.",
        },
        {
          icon: "Layers",
          title: "Rising Mains",
          description:
            "6300A busbar trunking system with tap-off units at every floor.",
        },
        {
          icon: "LayoutGrid",
          title: "Distribution",
          description:
            "42 new floor distribution boards with RCBO protection and energy monitoring.",
        },
        {
          icon: "Car",
          title: "EV Ready",
          description:
            "Dedicated 800A EV charging infrastructure serving 200 parking spaces.",
        },
      ],
      challenge:
        "Replacing the entire electrical backbone of an occupied 42-storey building without any unplanned disruption to the 4,000 daily occupants or the building's critical systems.",
      solution:
        "The shadow infrastructure approach transforms what would typically be a disruptive strip-out into a controlled migration. New systems are fully tested and commissioned before any tenant circuit is transferred, and every switchover window includes automatic rollback capability if any issue is detected.",
      gallery: [
        {
          src: "/images/services-commercial.jpg",
          alt: "New basement switchgear",
          caption: "11kV switchgear installation in basement plant room",
        },
        {
          src: "/images/power-distribution.jpg",
          alt: "Riser installation",
          caption:
            "New busbar trunking installed alongside legacy rising mains",
        },
        {
          src: "/images/services-industrial.jpg",
          alt: "Floor distribution board",
          caption: "Modern floor distribution board with smart monitoring",
        },
      ],
      testimonial: {
        quote:
          "We were sceptical that such a major upgrade could be done without significant disruption. Nexgen's shadow infrastructure approach has proven us wrong — our tenants have experienced zero unplanned outages throughout the project.",
        author: "Sarah Mitchell",
        role: "Building Manager",
        company: "Canary Wharf Management Ltd",
      },
    },
  },
  {
    id: "proj-007",
    slug: "heathrow-cargo-substation-expansion",
    category: "power-boards",
    categoryLabel: "Power Boards",
    title: "Heathrow Cargo Substation Expansion",
    clientSector: "Aviation",
    status: "completed",
    description:
      "New 33/11kV primary substation and distribution network expansion for Heathrow's cargo handling facilities, supporting automated warehousing and cold chain operations.",
    coverImage: {
      src: "/images/power-distribution.jpg",
      alt: "Aviation cargo facility electrical infrastructure",
    },
    kpis: {
      budget: "£5.6M",
      timeline: "22 months",
      capacity: "33kV/20MVA",
      location: "Heathrow Airport",
    },
    tags: ["Aviation", "Substation", "Cold Chain", "Automation"],
    progress: 100,
    isFeatured: true,
    publishedAt: "2023-11-01T09:00:00.000Z",
    updatedAt: "2025-09-15T14:45:00.000Z",
    detail: {
      intro: {
        label: "Aviation Infrastructure",
        headlineWords: [
          "Keeping",
          "the",
          "World's",
          "Cargo",
          "Moving",
          "Through",
          "Heathrow.",
        ],
        leadParagraph:
          "Heathrow handles 1.6 million tonnes of cargo annually. When their existing electrical infrastructure couldn't support planned automation and cold chain expansion, they needed a partner who could deliver complex infrastructure in one of the world's most security-sensitive environments.",
        bodyParagraphs: [
          "The cargo handling facilities at Heathrow operate around the clock, processing time-critical shipments ranging from pharmaceuticals to automotive parts. The planned introduction of automated handling systems and expanded temperature-controlled warehousing required a 60% increase in electrical capacity.",
          "Working within the airport's strict security protocols and airside access restrictions, our team designed and delivered a new 33/11kV primary substation with 20MVA capacity. The project included 4km of new HV cable routes, six new secondary substations, and integration with the airport's existing SCADA systems.",
        ],
        pillars: [
          {
            num: "01",
            title: "Airside Delivery",
            description:
              "Full compliance with CAA and airport security requirements for airside construction operations.",
          },
          {
            num: "02",
            title: "Zero Flight Impact",
            description:
              "All works scheduled and executed without any impact on flight operations or cargo handling.",
          },
          {
            num: "03",
            title: "Future Capacity",
            description:
              "Infrastructure designed with 50% spare capacity for future automation phases.",
          },
        ],
      },
      timeline: [
        {
          phase: "Phase 1",
          title: "Primary Substation",
          description:
            "Construction of new 33/11kV primary substation with 2x10MVA transformers.",
          duration: "32 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "HV Cable Network",
          description:
            "Installation of 4km of 11kV cable routes to new secondary substations.",
          duration: "20 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Secondary Substations",
          description:
            "Six new 11kV/400V substations serving cargo handling and cold chain facilities.",
          duration: "24 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "SCADA Integration",
          description:
            "Integration with airport SCADA systems and commissioning of automated load management.",
          duration: "12 weeks",
          status: "completed",
        },
      ],
      scope: [
        {
          icon: "Building2",
          title: "Primary Substation",
          description:
            "New 33/11kV substation with 2x10MVA transformers and SF6-free switchgear.",
        },
        {
          icon: "Cable",
          title: "HV Network",
          description:
            "4km of 11kV XLPE cable in dedicated routes with full redundancy.",
        },
        {
          icon: "Warehouse",
          title: "Distribution",
          description:
            "Six secondary substations with combined 12MVA capacity serving cargo facilities.",
        },
        {
          icon: "Thermometer",
          title: "Cold Chain",
          description:
            "Dedicated supplies for 8,000m² of temperature-controlled warehousing.",
        },
      ],
      challenge:
        "Delivering major electrical infrastructure in an operational airside environment with strict security protocols, limited working windows, and zero tolerance for any impact on flight operations.",
      solution:
        "Every aspect of this project was planned around airport operations. We obtained permanent airside passes for 40 operatives, established a dedicated compound within the cargo area, and scheduled all HV works during the airport's quieter night-time periods. Crane lifts for transformer installation required coordination with air traffic control and were completed in a single 4-hour window.",
      gallery: [
        {
          src: "/images/power-distribution.jpg",
          alt: "Primary substation",
          caption: "New 33/11kV primary substation at Heathrow cargo",
        },
        {
          src: "/images/services-industrial.jpg",
          alt: "Cable installation",
          caption: "HV cable pulling in dedicated service corridor",
        },
        {
          src: "/images/services-commercial.jpg",
          alt: "Secondary substation",
          caption: "Compact secondary substation serving cold chain facility",
        },
      ],
      testimonial: {
        quote:
          "Working airside at Heathrow presents unique challenges that most contractors struggle with. Nexgen's team integrated seamlessly with our operations, delivered on an aggressive timeline, and did so without a single security or safety incident.",
        author: "James Patterson",
        role: "Head of Infrastructure",
        company: "Heathrow Airport Holdings",
      },
    },
  },
  {
    id: "proj-dhl-reading-001",
    slug: "dhl-reading-distribution-hub",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "DHL Reading Distribution Hub",
    clientSector: "Logistics & Distribution",
    status: "completed",
    description:
      "Full Cat B electrical fit-out for DHL's Reading parcel sorting and distribution hub, encompassing conveyor power infrastructure, Schneider LV distribution, office fit-out, and emergency systems across a high-throughput logistics facility.",
    coverImage: {
      src: "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
      alt: "DHL Reading distribution hub — completed operational facility by Nexgen Electrical Innovations",
    },
    kpis: {
      budget: "£380K",
      timeline: "14 weeks",
      capacity: "800A TPN",
      location: "Reading, Berkshire",
    },
    tags: ["Cat B Fit-Out", "Distribution Hub", "Schneider Electric", "Conveyor Infrastructure"],
    progress: 100,
    isFeatured: false,
    publishedAt: "2025-11-01T09:00:00.000Z",
    updatedAt: "2025-11-01T09:00:00.000Z",
    detail: {
      intro: {
        label: "Commercial Project",
        headlineWords: ["DHL", "Reading.", "Simply", "Delivered."],
        leadParagraph:
          "When Woodhouse were awarded the DHL Reading distribution hub contract, there was only one electrical contractor they called. Nexgen Electrical Innovations had earned that trust through years of reliable delivery on demanding commercial programmes — and when the brief came in for a full Cat B fit-out of a high-throughput parcel sorting facility, we delivered it exactly as Woodhouse and their client expected: on time, on spec, and without a single programme-critical incident.",
        bodyParagraphs: [
          "The Reading distribution hub is a purpose-built parcel sorting and logistics facility requiring a robust, high-capacity electrical infrastructure that could support automated conveyor sorters, goods-in scanning systems, office and welfare areas, and a comprehensive emergency services network — all delivered within an aggressive 14-week construction programme.",
          "Nexgen's installation team worked closely with Woodhouse and DHL's project management team from pre-construction planning through to commissioning, delivering a complete electrical installation that met DHL's exacting operational standards and the M&E specification in full.",
        ],
        pillars: [
          {
            num: "01",
            title: "Conveyor Power Infrastructure",
            description:
              "Dedicated three-phase circuits and bespoke cable tray runs to power automated sorting conveyors and goods handling equipment throughout the warehouse floor.",
          },
          {
            num: "02",
            title: "Schneider LV Distribution",
            description:
              "Schneider Electric main and sub-distribution boards providing reliable, metered power distribution across all zones — warehouse, office, welfare, and plant.",
          },
          {
            num: "03",
            title: "Full Cat B Fit-Out",
            description:
              "End-to-end installation from main intake to final fix — lighting, small power, fire alarm, emergency lighting, and BMS integration across the entire facility.",
          },
          {
            num: "04",
            title: "Pre-Construction Planning",
            description:
              "Rigorous pre-construction sequencing and supplier co-ordination delivered programme certainty before a single cable was pulled.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Main LV Distribution",
          description:
            "800A TPN main distribution board with Schneider Electric metering and protection, serving all facility zones from a single consolidated intake.",
        },
        {
          icon: "Warehouse",
          title: "Conveyor Power Circuits",
          description:
            "Dedicated three-phase circuits for automated parcel sorting conveyor systems, designed for continuous 24/7 operational loading.",
        },
        {
          icon: "Cable",
          title: "Bespoke Cable Tray Infrastructure",
          description:
            "Fabricated and installed custom cable tray routing throughout the warehouse, sized for current capacity and future expansion.",
        },
        {
          icon: "Building2",
          title: "Office & Welfare Fit-Out",
          description:
            "Complete first and second fix electrical installation for office areas, welfare facilities, staff rooms, and ancillary spaces.",
        },
        {
          icon: "Lightbulb",
          title: "Warehouse & Office Lighting",
          description:
            "High-bay LED luminaires for warehouse operations and recessed panel lighting for office areas, all compliant with CIBSE LG7 guidance.",
        },
        {
          icon: "Shield",
          title: "Emergency Lighting Systems",
          description:
            "BS 5266-compliant emergency lighting throughout, including maintained fittings at all escape routes, exits, and risk areas.",
        },
        {
          icon: "Settings",
          title: "Fire Alarm Integration",
          description:
            "Electrical works in support of L2 fire detection and alarm system, including power supplies, containment, and end-of-line devices.",
        },
        {
          icon: "Gauge",
          title: "Sub-Distribution Boards",
          description:
            "Schneider Electric sub-boards at warehouse, office, and plant zones providing localised protection, isolation, and metered consumption data.",
        },
        {
          icon: "Network",
          title: "Data & Comms Infrastructure",
          description:
            "Containment and power provisions for IT, communications, barcode scanning, and operational technology systems.",
        },
        {
          icon: "CheckCircle",
          title: "Testing & Commissioning",
          description:
            "Full NICEIC-compliant testing regime across all circuits, with EICRs and commissioning certificates provided at practical completion.",
        },
      ],
      challenge:
        "DHL's operational timeline allowed no margin for programme slippage — the facility had a fixed go-live date tied to their national network capacity plan. The warehouse floor installation had to proceed in parallel with the fit-out of elevated office pods, with multiple trades working in proximity and a constrained delivery window for long-lead electrical equipment including the Schneider main board.",
      solution:
        "Nexgen's pre-construction planning team produced a detailed installation programme sequenced to give other trades maximum access while ensuring electrical first-fix was never on the critical path. We pre-fabricated cable tray sections off-site and coordinated a just-in-time delivery schedule with Schneider Electric, eliminating plant room congestion. Dedicated supervisors for warehouse and office zones worked in parallel, with daily progress reporting to Woodhouse's project manager — delivering practical completion two days ahead of programme.",
      timeline: [
        {
          phase: "Phase 1",
          title: "Pre-Construction & Survey",
          description:
            "Detailed M&E survey, design review, equipment procurement, and installation programme issued to Woodhouse.",
          duration: "2 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "First Fix & Containment",
          description:
            "Main cable tray installation, primary containment runs, warehouse distribution cabling, and first fix to office pods and welfare areas.",
          duration: "5 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Board Installation & Distribution",
          description:
            "Main LV board installation, Schneider sub-board fit-off, conveyor circuit energisation, and office second fix electrical.",
          duration: "5 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Final Fix, Testing & Commissioning",
          description:
            "Lighting and small power final fix, emergency lighting installation, full circuit testing, EICR production, and witnessed commissioning with DHL's engineering team.",
          duration: "2 weeks",
          status: "completed",
        },
      ],
      gallery: [
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-site-overview.jpg",
          alt: "DHL Reading distribution hub — site overview during Nexgen electrical installation",
          caption: "Site overview — early-stage installation with containment in progress",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-cable-tray-installation.jpg",
          alt: "Warehouse cable containment and tray installation at DHL Reading",
          caption: "Primary cable tray routes being established across the warehouse ceiling",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-mewp-high-level-containment.jpg",
          alt: "MEWP scissor lift access for high-level cable tray installation — DHL Reading",
          caption: "Scissor lift access for high-level containment runs above the sorting floor",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-distribution-zone-first-fix.jpg",
          alt: "Distribution zone first fix electrical installation — DHL Reading hub",
          caption: "Distribution zone cabling during Phase 2 first fix works",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-first-fix-complete.jpg",
          alt: "DHL Reading warehouse electrical installation — first fix complete",
          caption: "Warehouse-wide installation progress — first fix complete",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-schneider-conveyor-control-panels.jpg",
          alt: "Schneider Electric LV control panels for DHL Reading conveyor sorting systems",
          caption: "Schneider LV control panels powering the automated parcel sorting conveyors",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-bespoke-cable-tray-prefabricated.jpg",
          alt: "Bespoke prefabricated cable tray sections installed at DHL Reading",
          caption: "Custom-fabricated cable tray sections — prefabricated off-site for precise fit",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-floor-containment-works.jpg",
          alt: "DHL Reading warehouse floor showing completed containment and distribution works",
          caption: "Warehouse floor showing completed containment and initial distribution works",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-office-welfare-second-fix.jpg",
          alt: "Second fix electrical installation in DHL Reading office and welfare areas",
          caption: "Second fix electrical works in staff welfare and office areas",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-sub-distribution-plant-zone.jpg",
          alt: "Cable routing to sub-distribution panels in DHL Reading plant zone",
          caption: "Cable routing to sub-distribution panels in the plant zone",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-main-lv-distribution-board.jpg",
          alt: "Schneider Electric main LV distribution board installed and commissioned at DHL Reading",
          caption: "Schneider Electric main distribution board — tested and commissioned",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-office-fitout-completed.jpg",
          alt: "Completed DHL Reading office fit-out — lighting, small power, and data provisions",
          caption: "Completed office fit-out — lighting, small power, and data provisions installed",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
          alt: "DHL Reading distribution hub — completed and operational, delivered by Nexgen Electrical Innovations",
          caption: "The completed DHL Reading hub — fully operational and delivering to programme",
        },
      ],
      testimonial: {
        quote:
          "Nexgen delivered our Reading hub on time and to specification. Their team worked professionally throughout — always visible on site, always ahead of the programme. The electrical installation is exactly what we needed for a high-throughput operation like this. We wouldn't hesitate to use them again.",
        author: "Project Manager",
        role: "Senior Project Manager",
        company: "DHL Supply Chain",
      },
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "earning-the-call",
          heading: "Earning the Call",
          paragraphs: [
            "Nexgen Electrical Innovations and Woodhouse have worked together across multiple commercial programmes, building a working relationship founded on shared standards and mutual accountability. When Woodhouse tendered for the DHL Reading hub contract, they needed an electrical contractor they could guarantee — one whose quality, programme discipline, and on-site management would reflect well on them in front of a major national client.",
            "After competitive tendering from several regional contractors, Nexgen were selected. It was a vote of confidence the team took seriously from day one.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "live-construction-programme",
          heading: "Working in a Live Construction Programme",
          paragraphs: [
            "The warehouse floor was never quiet. From the day Nexgen's installation team mobilised, sorting equipment deliveries, structural steelwork, and warehouse racking were going in simultaneously. High-level cable tray runs required MEWP access in areas where other trades were working at ground level — requiring precise co-ordination with Woodhouse's site management team to avoid programme conflicts.",
            "Our supervisors attended every site meeting, raised early warnings, and adjusted sequence where needed to keep electrical first-fix ahead of the follow-on trades. When a long-lead Schneider board delivery threatened to slip the Phase 3 programme, our procurement team escalated directly with the supplier and secured an accelerated delivery slot. The board arrived on time.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "The Result",
          paragraphs: [
            "DHL's Reading hub opened on schedule. The electrical installation — from main LV intake to the final emergency lighting fitting — was complete, tested, and certified two days before the agreed handover date. Woodhouse received a clean EICR pack and commissioning certificates at practical completion.",
            "For Nexgen, this project is a benchmark: a demonstration of what a properly planned Cat B fit-out looks like when the right contractor is given the room to perform. It is also the foundation of a continued partnership — with Woodhouse, and with the clients they bring with them.",
          ],
          background: "muted",
        },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIVET WATFORD — Veterinary Healthcare Commercial Fit-Out
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-medivet-watford-001",
    slug: "medivet-watford-veterinary-practice",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Medivet Watford Veterinary Practice",
    clientSector: "Veterinary Healthcare",
    status: "completed",
    description:
      "Full electrical fit-out for Medivet's flagship 18,000 sqft Watford veterinary practice — a dual-wing healthcare facility requiring dedicated fuseboards for each wing, healthcare-grade compliance, and precise coordination with Woodhouse Workspace across a live construction programme.",
    coverImage: {
      src: "/images/projects/commercial/medivet/nexgen-medivet-watford-cover-primary.jpg",
      alt: "Medivet Watford veterinary practice — completed electrical fit-out by Nexgen Electrical Innovations",
    },
    kpis: {
      budget: "£320K",
      timeline: "16 weeks",
      capacity: "400A TPN",
      location: "Watford, Hertfordshire",
    },
    tags: ["Healthcare Electrical", "Dual Fuseboard Design", "Cat B Fit-Out", "Woodhouse Workspace"],
    progress: 100,
    isFeatured: true,
    publishedAt: "2025-08-01T09:00:00.000Z",
    updatedAt: "2025-08-01T09:00:00.000Z",
    detail: {
      intro: {
        label: "Commercial Project",
        headlineWords: ["Medivet", "Watford.", "Precision", "Delivered."],
        leadParagraph:
          "When Woodhouse Workspace were awarded the Medivet Watford flagship fit-out, they brought Nexgen Electrical Innovations on board as electrical contractor — a partnership built on a shared commitment to programme certainty and quality delivery. The result is a 18,000 sqft dual-wing veterinary practice with electrical infrastructure engineered to the exacting standards healthcare environments demand.",
        bodyParagraphs: [
          "Medivet Watford is one of the most significant veterinary healthcare facilities of its kind in the region — a purpose-designed practice spanning a north wing and south wing, each operating as a functionally independent zone with its own dedicated fuseboard. The dual-fuseboard design was a deliberate engineering decision: it provides electrical resilience, simplifies fault isolation, and supports the different operational loads of consulting, surgical, and imaging areas without cross-dependency.",
          "Nexgen's installation team worked closely with Woodhouse Workspace from pre-construction planning through to commissioning, navigating the particular challenges of a healthcare environment — including strict sterile zone protocols, sensitive equipment in active areas, and the coordination demands of a large, multi-trade fit-out delivered on a fixed programme.",
        ],
        pillars: [
          {
            num: "01",
            title: "Dual-Wing Fuseboard Design",
            description:
              "Dedicated fuseboards for the north and south wings ensure electrical independence between zones — supporting different operational loads and simplifying fault isolation without cross-dependency.",
          },
          {
            num: "02",
            title: "Healthcare Compliance",
            description:
              "Full BS 7671 compliance with healthcare-specific provisions — including medical IT systems, equipotential bonding, and protection against electromagnetic interference in imaging areas.",
          },
          {
            num: "03",
            title: "18,000 sqft Delivery",
            description:
              "End-to-end electrical fit-out across an 18,000 sqft dual-wing facility — from main intake through to final fix, testing, and commissioning certificates at practical completion.",
          },
          {
            num: "04",
            title: "Programme Certainty",
            description:
              "Pre-construction sequencing and parallel-wing installation strategy ensured electrical first-fix never constrained the follow-on trades — delivering to Woodhouse's programme milestone by milestone.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Main LV Distribution",
          description:
            "400A TPN main distribution board with metering and protection, serving both wings from a consolidated intake — with independent sub-distribution for north and south zones.",
        },
        {
          icon: "Building2",
          title: "Dual Dedicated Fuseboards",
          description:
            "Separate fuseboards for the north and south wings providing independent electrical circuits, fault isolation, and load management tailored to each zone's operational requirements.",
        },
        {
          icon: "Shield",
          title: "Healthcare-Grade Protection",
          description:
            "Medical IT panel installation, equipotential bonding in treatment and surgical areas, and RCD protection throughout — compliant with BS 7671 and healthcare premises guidance.",
        },
        {
          icon: "Lightbulb",
          title: "Clinical & Welfare Lighting",
          description:
            "LED lighting specification across consulting rooms, surgical suites, imaging areas, reception, and staff welfare — designed to CIBSE guidance with appropriate colour rendering and lux levels.",
        },
        {
          icon: "Cable",
          title: "First Fix & Containment",
          description:
            "Full cable tray, conduit, and containment installation across both wings — coordinated with structural, mechanical, and fit-out trades to maintain programme sequence.",
        },
        {
          icon: "Settings",
          title: "Second Fix & Final Connection",
          description:
            "Complete second fix including accessories, socket outlets, data provisions, and final connections to clinical equipment power supplies throughout the practice.",
        },
        {
          icon: "Gauge",
          title: "Emergency Lighting",
          description:
            "BS 5266-compliant emergency lighting installation across all areas, including maintained fittings at escape routes, exits, and clinical risk zones.",
        },
        {
          icon: "CheckCircle",
          title: "Testing & Commissioning",
          description:
            "Full NICEIC-compliant testing regime with EICRs, commissioning certificates, and operation and maintenance documentation provided at practical completion.",
        },
      ],
      challenge:
        "Delivering a full electrical fit-out inside a live veterinary healthcare construction programme introduced constraints that a standard commercial fit-out does not carry. Sterile zones and sensitive clinical equipment in adjacent areas required careful sequencing of noisy or disruptive works. The dual-wing layout meant two parallel installation programmes running simultaneously, with first-fix in the north wing proceeding alongside structural works still completing in the south — demanding precise coordination with Woodhouse's site management team and a clear understanding of which areas were accessible at any given point in the programme.",
      solution:
        "Nexgen's pre-construction team produced a detailed installation programme sequenced wing-by-wing and zone-by-zone, with clear access windows agreed with Woodhouse before mobilisation. Running parallel installation teams in north and south wings allowed both programmes to advance simultaneously without cross-trade conflicts. Where clinical sensitivity required it, we scheduled noisy containment works outside core hours and used temporary screening to protect adjacent areas. Equipment procurement was managed to just-in-time delivery, keeping plant rooms clear and the programme moving.",
      timeline: [
        {
          phase: "Phase 1",
          title: "Pre-Construction & Survey",
          description:
            "Detailed M&E survey, design review, healthcare compliance assessment, equipment procurement, and installation programme issued to Woodhouse Workspace.",
          duration: "2 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "First Fix & Containment",
          description:
            "Parallel first-fix installation across north and south wings — cable tray, conduit, containment, and distribution cabling to all zones including clinical, welfare, and reception areas.",
          duration: "6 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Board Installation & Distribution",
          description:
            "Main LV board installation, dedicated north and south wing fuseboard fit-off, sub-distribution cabling, and clinical equipment circuit connections.",
          duration: "5 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Final Fix, Testing & Commissioning",
          description:
            "Second fix accessories, lighting and small power final fix, emergency lighting installation, full circuit testing, EICRs, O&M documentation, and witnessed commissioning.",
          duration: "3 weeks",
          status: "completed",
        },
      ],
      gallery: [
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-cover-primary.jpg",
          alt: "Medivet Watford veterinary practice — completed facility by Nexgen Electrical Innovations",
          caption: "Completed Medivet Watford flagship practice — electrical installation by Nexgen",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-north-wing-fuseboards.jpg",
          alt: "North wing dedicated fuseboard installation — Medivet Watford",
          caption: "Dedicated north wing fuseboard — installed and commissioned by Nexgen",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-electrical-distribution-board.jpg",
          alt: "Main LV distribution board installation at Medivet Watford",
          caption: "Main LV distribution board serving both wings from a consolidated intake",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-first-fix-containment.jpg",
          alt: "First fix cable containment works at Medivet Watford",
          caption: "First fix containment in progress — north wing installation phase",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-cable-tray-installation.jpg",
          alt: "Cable tray installation across Medivet Watford veterinary practice",
          caption: "Primary cable tray routes across the clinical and welfare zones",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-north-wing-corridor.jpg",
          alt: "North wing corridor electrical installation — Medivet Watford",
          caption: "North wing corridor showing completed containment and lighting infrastructure",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-south-wing-fit-out.jpg",
          alt: "South wing electrical fit-out at Medivet Watford",
          caption: "South wing first fix in progress alongside structural completion works",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-consumer-unit-fit-off.jpg",
          alt: "Consumer unit fit-off during Phase 3 installation — Medivet Watford",
          caption: "Consumer unit fit-off during Phase 3 distribution works",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-lighting-installation.jpg",
          alt: "Clinical and reception lighting installation — Medivet Watford",
          caption: "LED lighting installation to clinical and reception areas",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-second-fix-wiring.jpg",
          alt: "Second fix wiring and accessories at Medivet Watford",
          caption: "Second fix accessories and final connections during Phase 4",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-emergency-lighting-install.jpg",
          alt: "Emergency lighting installation at Medivet Watford",
          caption: "BS 5266-compliant emergency lighting at escape routes and clinical zones",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-testing-commissioning.jpg",
          alt: "Testing and commissioning at Medivet Watford veterinary practice",
          caption: "Full NICEIC circuit testing and commissioning before practical completion",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-reception-area.jpg",
          alt: "Completed reception area electrical installation — Medivet Watford",
          caption: "Completed reception area — lighting, small power, and data provisions installed",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-treatment-room.jpg",
          alt: "Treatment room electrical fit-out — Medivet Watford",
          caption: "Treatment room fit-out with clinical-grade power provisions and emergency lighting",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-completed-facility-overview.jpg",
          alt: "Medivet Watford completed facility overview — delivered by Nexgen Electrical Innovations",
          caption: "Completed Medivet Watford practice — fully operational at practical completion",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "earning-the-brief",
          heading: "Earning the Brief",
          paragraphs: [
            "Woodhouse Workspace are a main contractor whose reputation depends on the subcontractors they bring with them. When they were awarded the Medivet Watford flagship fit-out — a prestigious, high-specification healthcare environment — they needed an electrical contractor they could trust to perform at the same level. Nexgen Electrical Innovations had already demonstrated that standard across previous programmes delivered together, and it was that track record that secured the appointment.",
            "The brief was demanding: an 18,000 sqft dual-wing veterinary practice with healthcare compliance requirements, a fixed programme, and an end-client — Medivet — whose standards for their flagship facility left no room for compromise. Nexgen's appointment was a decision by Woodhouse, not Medivet. That distinction matters: it reflects the trust that had been built between the two contractors through consistent, accountable delivery.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "working-in-a-live-veterinary-practice",
          heading: "Working in a Live Veterinary Practice",
          paragraphs: [
            "Veterinary healthcare facilities present a category of construction challenge that sits apart from standard commercial fit-outs. Sterile zones, sensitive imaging equipment, and the presence of animals in adjacent areas during later stages of fit-out all impose constraints on when, where, and how trades can work. Noisy or vibration-intensive activities — cutting containment, drilling, pulling cable through tight conduit runs — required careful scheduling to avoid clinical areas that were being handed over progressively to the Medivet team.",
            "Nexgen's site supervisors worked in close coordination with Woodhouse's project manager to maintain a live access schedule, adjusting sequence as different areas became available and others became restricted. It required a level of situational awareness and flexibility that not every electrical contractor can sustain across a 16-week programme — but it is exactly the kind of environment in which Nexgen's site management approach performs at its best.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "The Result",
          paragraphs: [
            "Medivet Watford opened on programme. The electrical installation — from the main LV intake through to the final emergency lighting fitting in the surgical suite — was complete, tested, and certified at practical completion. Woodhouse received a full EICR pack, commissioning certificates, and operation and maintenance documentation ready for handover to Medivet's estates team.",
            "For Nexgen, this project represents the standard we hold ourselves to in healthcare environments: technically correct, programme-certain, and delivered in a way that makes our client — Woodhouse — look exactly as good as they need to. It is a project we are proud of, and a partnership we intend to continue.",
          ],
          background: "muted",
        },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // LADBROKES WOKING — Retail Electrical Fit-Out
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-ladbrokes-woking-001",
    slug: "ladbrokes-woking-retail-fit-out",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Ladbrokes Woking — Retail Electrical Fit-Out",
    clientSector: "Retail & Betting",
    status: "completed",
    description:
      "Full electrical Cat B fit-out for Ladbrokes' 12,000 sq ft FTSE100-standard Woking retail betting shop across two concurrent wings — delivered live in an operational retail environment.",
    coverImage: {
      src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-cover-primary.jpg",
      alt: "Ladbrokes Woking retail electrical fit-out — completed trading floor",
    },
    kpis: {
      budget: "£180K",
      timeline: "10 weeks",
      capacity: "400A TPN",
      location: "Woking, Surrey",
    },
    tags: ["Retail", "Cat B Fit-Out", "Live Environment", "FTSE100"],
    progress: 100,
    isFeatured: false,
    publishedAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-05-01T09:00:00.000Z",
    detail: {
      intro: {
        label: "Commercial Project",
        headlineWords: ["Ladbrokes", "Woking.", "Delivered", "Live."],
        leadParagraph:
          "When Woodhouse Contracts brought Nexgen in for Ladbrokes' Woking flagship, the brief was unambiguous: FTSE100 specification, zero customer disruption, 10-week delivery. Nexgen said yes — and delivered exactly that across two concurrent wings of a live retail betting shop.",
        bodyParagraphs: [
          "The Woking fit-out is a full Cat B electrical installation across 12,000 sq ft of retail betting space — north and south wings progressing simultaneously on independent programme tracks, with every phase of work scheduled around the shop's trading hours to ensure not a single customer interaction was lost.",
          "Nexgen's installation team worked in close coordination with Woodhouse Contracts throughout, from pre-construction planning to final BS 7671 sign-off — delivering a complete electrical installation that met Entain plc's exacting standards for their FTSE100-listed retail estate.",
        ],
        pillars: [
          {
            num: "01",
            title: "FTSE100 Specification",
            description:
              "Every installation met the exacting electrical standards required for a listed-company retail estate — from the 400A TPN main board through to final fix and certification.",
          },
          {
            num: "02",
            title: "Two-Wing Phasing",
            description:
              "North and south wings progressed simultaneously with independent programme tracks — no cross-dependency delays, maximum installation velocity.",
          },
          {
            num: "03",
            title: "Live Retail Environment",
            description:
              "Work executed during off-peak hours to maintain customer operations throughout the full 10-week programme — zero trading disruption.",
          },
          {
            num: "04",
            title: "Programme Certainty",
            description:
              "Daily coordination with Woodhouse Contracts ensured every trade handover landed on schedule, with no programme-critical incidents across the full duration.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "400A TPN Distribution Board",
          description:
            "Main 400A TPN distribution board installation — serving both wings from a consolidated intake point, with metering and protection to Entain specification.",
        },
        {
          icon: "Cable",
          title: "First Fix Wiring",
          description:
            "Full first-fix wiring across both north and south wings, with containment and cabling routed through ceiling voids ahead of follow-on trades.",
        },
        {
          icon: "Building2",
          title: "Consumer Unit Installation",
          description:
            "Consumer unit installation across both wings, circuit-tested and certified to BS 7671 — providing independent protection and load management for each zone.",
        },
        {
          icon: "Lightbulb",
          title: "LED Lighting — Trading Floor & BOH",
          description:
            "LED lighting design and installation across the full trading floor and back-of-house areas, meeting Ladbrokes' brand specification and CIBSE lux level guidance.",
        },
        {
          icon: "Shield",
          title: "Emergency Lighting",
          description:
            "Full emergency lighting system installation — maintained fittings at all escape routes, exits, and risk areas — installed and commissioned to BS 5266.",
        },
        {
          icon: "Layers",
          title: "Cable Containment & Tray Routing",
          description:
            "Cable containment and tray routing through ceiling voids across both wings, co-ordinated with structural and fit-out trades to maintain programme sequence.",
        },
        {
          icon: "Settings",
          title: "Second Fix & Final Connection",
          description:
            "Complete second-fix including socket outlets, accessories, EPOS power provisions, self-service terminal supplies, and final connections throughout both wings.",
        },
        {
          icon: "CheckCircle",
          title: "Testing, Commissioning & Certification",
          description:
            "Full NICEIC-compliant circuit testing, BS 7671 certification, snagging, and formal handover to Woodhouse Contracts at practical completion.",
        },
      ],
      challenge:
        "Running two concurrent wing programmes inside a live retail betting shop — where any disruption to trading meant direct revenue loss for the client — demanded exceptional coordination, off-peak scheduling, and a phased approach that maintained operational continuity at every stage. The FTSE100 specification from Entain plc left no room for non-compliant workmanship or programme overruns.",
      solution:
        "Nexgen implemented a wing-by-wing phasing strategy with dedicated teams on each zone. Daily programme huddles with Woodhouse Contracts kept every trade sequenced correctly, and all high-impact work — distribution board energisation, ceiling void access, floor-level containment — was scheduled outside customer-facing hours. Pre-construction planning locked in access windows before mobilisation, eliminating surprises during the live programme.",
      timeline: [
        {
          phase: "Phase 1",
          title: "Mobilisation & First Fix",
          description:
            "Site setup, cable containment installation, and first-fix wiring across both wings — co-ordinated with Woodhouse to avoid trade conflicts.",
          duration: "3 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "Distribution Board & Containment",
          description:
            "400A TPN main board installation and full cable tray routing through ceiling voids — energisation scheduled outside trading hours.",
          duration: "2 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Second Fix & Lighting",
          description:
            "Second-fix wiring, LED lighting installation, emergency lighting fit, and consumer unit commissioning across both wings simultaneously.",
          duration: "3 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Testing, Commissioning & Handover",
          description:
            "Full circuit testing, BS 7671 certification, snagging remedials, and formal handover documentation issued to Woodhouse Contracts.",
          duration: "2 weeks",
          status: "completed",
        },
      ],
      gallery: [
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-cover-primary.jpg",
          alt: "Ladbrokes Woking — completed trading floor electrical installation",
          caption: "Completed trading floor — full Cat B electrical fit-out",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-trading-floor-overview.jpg",
          alt: "Ladbrokes Woking — trading floor electrical overview",
          caption: "Trading floor overview — north and south wings complete",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-reception-entrance.jpg",
          alt: "Ladbrokes Woking — reception and entrance electrical installation",
          caption: "Reception entrance — lighting and power installation",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-consumer-unit-installation.jpg",
          alt: "Ladbrokes Woking — consumer unit installation",
          caption: "Consumer unit installation — fully certified to BS 7671",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-cable-containment-tray.jpg",
          alt: "Ladbrokes Woking — cable containment tray routing",
          caption: "Cable containment tray — routed through ceiling voids",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-first-fix-wiring.jpg",
          alt: "Ladbrokes Woking — first fix wiring installation",
          caption: "First fix wiring — both wings progressing simultaneously",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-lighting-installation.jpg",
          alt: "Ladbrokes Woking — LED lighting installation",
          caption: "LED lighting installation — trading floor and back-of-house",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-north-wing-fit-out.jpg",
          alt: "Ladbrokes Woking — north wing electrical fit-out in progress",
          caption: "North wing fit-out — independent programme track",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-south-wing-fit-out.jpg",
          alt: "Ladbrokes Woking — south wing electrical fit-out in progress",
          caption: "South wing fit-out — simultaneous with north wing",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-breakout-area.jpg",
          alt: "Ladbrokes Woking — breakout area electrical installation",
          caption: "Breakout area — secondary circuit installation complete",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-second-fix-complete.jpg",
          alt: "Ladbrokes Woking — second fix electrical installation complete",
          caption: "Second fix complete — ready for lighting commissioning",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-testing-commissioning.jpg",
          alt: "Ladbrokes Woking — electrical testing and commissioning",
          caption: "Testing and commissioning — full circuit verification",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-completed-trading-floor.jpg",
          alt: "Ladbrokes Woking — completed trading floor",
          caption: "Completed trading floor — FTSE100 specification met",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-electrical-distribution-board.jpg",
          alt: "Ladbrokes Woking — 400A TPN electrical distribution board",
          caption: "400A TPN distribution board — main electrical supply point",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-emergency-lighting-install.jpg",
          alt: "Ladbrokes Woking — emergency lighting installation",
          caption: "Emergency lighting — full system installed and tested",
        },
        {
          src: "/images/projects/commercial/ladbrokes/nexgen-ladbrokes-woking-final-inspection.jpg",
          alt: "Ladbrokes Woking — final electrical inspection",
          caption: "Final inspection — BS 7671 certification complete",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "earning-the-brief",
          heading: "Woodhouse Brought Nexgen In for a Reason",
          paragraphs: [
            "Woodhouse Contracts had seen Nexgen deliver on complex commercial fit-outs before. When Entain plc — Ladbrokes Coral's parent group — needed a reliable electrical subcontractor for their Woking flagship, Woodhouse didn't hesitate. The brief was clear: FTSE100 standards, no retail disruption, 10-week delivery. Nexgen said yes.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "working-in-a-live-retail-environment",
          heading: "Betting Shops Don't Close for Electrical Works",
          paragraphs: [
            "Every phase of this project happened while Ladbrokes served customers. That meant no noisy containment work during peak hours, no ceiling access above active trading areas, and no disruption to the EPOS and self-service systems running 12 hours a day. Nexgen's team planned around the retail schedule — early starts, late finishes, and a daily sync with Woodhouse to keep the programme intact.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "Delivered On Time. Zero Disruption. FTSE100 Sign-Off.",
          paragraphs: [
            "The Ladbrokes Woking fit-out completed on programme at week 10. Both wings handed over clean, certified to BS 7671, and signed off by the Entain compliance team. No snagging carryovers. No programme slippage. Woodhouse Contracts reported zero customer complaints throughout the works — the kind of result that builds long-term subcontractor relationships.",
          ],
          background: "muted",
        },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-biffa-workshop-001",
    slug: "biffa-workshop-farnham",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Biffa Workshop — 3-Phase Electrical Installation",
    clientSector: "Waste Management & Sustainability",
    status: "completed",
    description:
      "Design and installation of a new fully operational 3-phase electrical supply system for Biffa's workshop facility in Farnham, Surrey — a landmark project that established Nexgen as Biffa's preferred electrical partner.",
    coverImage: {
      src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-cover-primary.jpg",
      alt: "Biffa Workshop Farnham — 3-phase electrical installation",
    },
    kpis: {
      budget: "£65K",
      timeline: "8 weeks",
      capacity: "3-Phase Supply",
      location: "Farnham, Surrey",
    },
    tags: ["3-Phase", "Commercial Workshop", "Preferred Partner", "New Build Services"],
    progress: 100,
    isFeatured: true,
    publishedAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-05-01T09:00:00.000Z",
    detail: {
      intro: {
        label: "Preferred Partner Project",
        headlineWords: ["Biffa.", "No", "Time", "To", "Waste."],
        leadParagraph:
          "Biffa turned to Nexgen with a clear task: design and install a new, fully operational 3-phase electrical supply system for their brand new workshop in Farnham, Surrey. Delivered in 8 weeks, on budget, to specification — and the start of a partnership that has grown ever since.",
        bodyParagraphs: [
          "Biffa plc is one of the UK's leading waste management companies, committed to sustainability, recycling, and enabling the circular economy. When they needed a trusted electrical contractor for their Farnham facility, they came to Nexgen — and we've been their preferred electrical partner ever since.",
          "The scope covered the full electrical fit-out of a new workshop: 3-phase distribution, high-level lighting, emergency lighting and exit signage, small power circuits, and 3-phase supplies for roller shutter doors, machinery, and welding equipment. Every installation was designed, executed, and certified to the highest standards.",
        ],
        pillars: [
          {
            num: "01",
            title: "Partnership Origin",
            description:
              "This Farnham project was the start of the Nexgen–Biffa relationship. Nexgen has delivered multiple projects for Biffa since, with the partnership evolving every year.",
          },
          {
            num: "02",
            title: "3-Phase Design",
            description:
              "Full 3-phase electrical supply system designed and installed from first principles — including distribution, protective devices, and capacity sized for Biffa's workshop operations.",
          },
          {
            num: "03",
            title: "Workshop-Ready Delivery",
            description:
              "Lighting, emergency systems, small power, and 3-phase machinery circuits — every system required for a fully operational workshop, installed and commissioned within 8 weeks.",
          },
          {
            num: "04",
            title: "On Budget. On Time.",
            description:
              "£65K. 8 weeks. Zero programme overruns. Nexgen delivered to the brief Biffa set — the kind of outcome that turns a first project into a long-term partnership.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "3-Phase Distribution System",
          description:
            "Full 3-phase electrical supply system — new distribution board, protective devices, and mains cabling designed and installed to BS 7671 specification.",
        },
        {
          icon: "Lightbulb",
          title: "High-Level LED Lighting",
          description:
            "High-level LED lighting installation throughout the workshop — specified for industrial lux levels, energy efficient, and designed around Biffa's operational layout.",
        },
        {
          icon: "Shield",
          title: "Emergency Lighting & Exit Signage",
          description:
            "Full emergency lighting system and exit signage installed throughout — maintained fittings at all escape routes and risk areas, commissioned to BS 5266.",
        },
        {
          icon: "Cable",
          title: "Small Power Circuits",
          description:
            "Small power circuit installation for tools, chargers, and workshop equipment — wired, dressed on containment, and fixed into final positions per design.",
        },
        {
          icon: "Settings",
          title: "3-Phase Machinery & Equipment Circuits",
          description:
            "Dedicated 3-phase circuits for roller shutter doors, machinery, and welding equipment — sized and protected to meet Biffa's workshop operational requirements.",
        },
        {
          icon: "CheckCircle",
          title: "Testing, Commissioning & Certification",
          description:
            "Full circuit testing, commissioning, and BS 7671 certification across all installed systems — formally handed over to Biffa at practical completion.",
        },
      ],
      challenge:
        "Designing and installing a complete 3-phase electrical system for a brand new workshop required precise load calculations, accurate cable sizing, and careful sequencing of installation work to meet an 8-week programme. With Biffa's operations relying on the new facility being ready on schedule, there was no margin for programme overruns or rework.",
      solution:
        "Nexgen carried out a detailed design stage from the outset — calculating current carrying capacities, specifying cables and protective devices from load data, and planning item locations within the workshop. A thorough walkthrough with the client and a completed RAMS document ensured all site-specific requirements were captured before construction began. High-quality materials and meticulous workmanship ensured the installation progressed cleanly to handover.",
      timeline: [
        {
          phase: "Phase 1",
          title: "Design & RAMS",
          description:
            "Initial client meeting, load calculation, electrical system design, item location planning, risk assessment, and RAMS approval — all completed before mobilisation.",
          duration: "2 weeks",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "First Fix & Containment",
          description:
            "Cable containment installation, first-fix wiring for all circuits, and distribution system rough-in — routed and dressed per design drawings.",
          duration: "2 weeks",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Second Fix & Systems Installation",
          description:
            "High-level lighting, emergency lighting, small power, and 3-phase machinery circuits installed and fixed into final positions.",
          duration: "3 weeks",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Testing, Commissioning & Handover",
          description:
            "Full circuit testing, BS 7671 certification, commissioning of all systems, and formal handover to Biffa at practical completion.",
          duration: "1 week",
          status: "completed",
        },
      ],
      gallery: [
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-cover-primary.jpg",
          alt: "Biffa Workshop Farnham — 3-phase electrical installation overview",
          caption: "Biffa Workshop Farnham — 3-phase electrical installation complete",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-exterior-overview.jpg",
          alt: "Biffa Workshop Farnham — exterior overview",
          caption: "Workshop exterior — new facility at Biffa's Farnham site",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-distribution-installation.jpg",
          alt: "Biffa Workshop — distribution board installation",
          caption: "Distribution installation — 3-phase supply system fitted",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-interior-overview.jpg",
          alt: "Biffa Workshop — interior electrical installation overview",
          caption: "Interior overview — high-level lighting and containment installed",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-roller-shutter-circuits.jpg",
          alt: "Biffa Workshop — roller shutter door electrical circuits",
          caption: "Roller shutter circuits — 3-phase supplies installed and commissioned",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-gallery-01.jpg",
          alt: "Biffa Workshop Farnham — electrical installation progress",
          caption: "Installation progress — first fix wiring complete",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-gallery-02.jpg",
          alt: "Biffa Workshop Farnham — electrical containment and cabling",
          caption: "Cable containment — routed and dressed per design",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-gallery-03.jpg",
          alt: "Biffa Workshop Farnham — lighting installation",
          caption: "High-level lighting — installed and aligned to workshop layout",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-gallery-04.jpg",
          alt: "Biffa Workshop Farnham — electrical systems complete",
          caption: "Workshop systems — all circuits commissioned and certified",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "the-partnership-begins",
          heading: "Biffa Chose Nexgen. Nexgen Delivered. The Partnership Grew.",
          paragraphs: [
            "The Farnham workshop project wasn't just another commercial job — it was the project that established Nexgen as Biffa's preferred electrical contractor. Biffa needed a team they could trust with a new facility: one that would design the system correctly, install to a high standard, and hand over on time. Nexgen delivered all three.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "the-technical-approach",
          heading: "Designed Right. Installed Right. No Rework.",
          paragraphs: [
            "The design stage was thorough by necessity — every cable sized from load data, every protective device selected from specification sheets, every item location confirmed with the client before a single cable was pulled. The RAMS document was reviewed and signed before mobilisation. When the team arrived on site, they knew exactly what to build and how to build it.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "On Time. On Budget. A Preferred Partner Ever Since.",
          paragraphs: [
            "The Biffa Farnham workshop was handed over inside 8 weeks and within the £65K budget. Every circuit certified, every system commissioned. Biffa's operations team had a fully functional facility from day one — and Nexgen had earned a partner relationship that has continued to grow across multiple projects since.",
          ],
          background: "muted",
        },
      ],
    },
  },
];

export const projectBentoItems: ProjectBentoItem[] = [
  {
    id: "metric-1",
    title: "Active Projects",
    value: "12",
    description:
      "Across commercial, industrial, and critical infrastructure sectors.",
  },
  {
    id: "metric-2",
    title: "Average Delivery",
    value: "94%",
    description:
      "Projects delivered on or ahead of contract milestone schedules.",
  },
  {
    id: "metric-3",
    title: "Combined Capacity",
    value: "78kV",
    description:
      "Total installed and maintained capacity in current active portfolio.",
  },
  {
    id: "metric-4",
    title: "Safety Record",
    value: "0 LTIs",
    description:
      "Zero lost-time incidents in the last 24 months of project delivery.",
  },
];

const projectListItems: ProjectListItem[] = allProjects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  category: project.category,
  categoryLabel: project.categoryLabel,
  status: project.status,
  isFeatured: project.isFeatured,
  location: project.kpis.location,
  updatedAt: project.updatedAt,
}));

const projectsBySlug: Partial<Record<Project["slug"], Project>> =
  Object.fromEntries(allProjects.map((project) => [project.slug, project]));

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsBySlug[slug];
}

export function getProjectSlugs(): Project["slug"][] {
  return allProjects.map((project) => project.slug);
}

export function getProjectsByCategory(
  category: ProjectCategorySlug,
): Project[] {
  if (category === "all") return allProjects;
  return allProjects.filter((project) => project.category === category);
}

export function getFeaturedProjectByCategory(
  category: ProjectCategorySlug,
): Project | undefined {
  const scoped = getProjectsByCategory(category);
  return scoped.find((project) => project.isFeatured) ?? scoped[0];
}

export function getProjectListItemsByCategory(
  category: ProjectCategorySlug,
): ProjectListItem[] {
  if (category === "all") return projectListItems;
  return projectListItems.filter((item) => item.category === category);
}

export function getCategoryBySlug(slug: string): ProjectCategory | undefined {
  return projectCategories.find((category) => category.slug === slug);
}

export function getCategorySlugs(): Exclude<ProjectCategorySlug, "all">[] {
  return projectCategories.map((category) => category.slug);
}

export function getProjectByCategoryAndSlug(
  categorySlug: Exclude<ProjectCategorySlug, "all">,
  projectSlug: Project["slug"],
): Project | undefined {
  return allProjects.find(
    (project) =>
      project.category === categorySlug && project.slug === projectSlug,
  );
}

export function getProjectSlugsByCategory(
  categorySlug: Exclude<ProjectCategorySlug, "all">,
): Project["slug"][] {
  return allProjects
    .filter((project) => project.category === categorySlug)
    .map((project) => project.slug);
}

export { projectsIntroData } from "./projects-intro";
export { categoryProjectsIntroData } from "./category-intro";
export { projectDetailIntroData } from "./project-detail-intro";
export { categoriesIntroData } from "./categories-intro";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED CONTENT GRID SUPPORT
// Extended list items for ContentGridLayout compatibility
// ═══════════════════════════════════════════════════════════════════════════

import type { ProjectListItemExtended } from "@/types/shared-content";

/**
 * Convert a Project to ProjectListItemExtended for ContentGridLayout.
 */
function projectToExtendedListItem(project: Project): ProjectListItemExtended {
  return {
    id: project.id,
    slug: project.slug,
    category: project.category,
    categoryLabel: project.categoryLabel,
    title: project.title,
    excerpt: project.description,
    publishedAt: project.publishedAt,
    isFeatured: project.isFeatured,
    featuredImage: project.coverImage,
    contentType: "project",
    status: project.status,
    location: project.kpis.location,
    budget: project.kpis.budget,
    clientSector: project.clientSector,
  };
}

/**
 * Get extended project list items for ContentGridLayout.
 */
export function getProjectListItemsExtended(
  category: ProjectCategorySlug = "all",
): ProjectListItemExtended[] {
  const projects =
    category === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === category);
  return projects.map(projectToExtendedListItem);
}
