import type {
  NewsArticle,
  NewsArticleListItem,
  NewsCategory,
  NewsCategorySlug,
  NewsHubMetricItem,
  NewsSidebarCard,
} from "@/types/news";

export const newsCategories: NewsCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description:
      "Home electrification stories, smart living upgrades, and homeowner guidance.",
  },
  {
    slug: "industrial",
    label: "Industrial",
    description:
      "Operational resilience, infrastructure rollouts, and industrial transformation updates.",
  },
  {
    slug: "partners",
    label: "Partners",
    description:
      "Collaboration stories with developers, suppliers, and delivery partners.",
  },
  {
    slug: "case-studies",
    label: "Case Studies",
    description:
      "Outcome-led delivery breakdowns showing how complex electrical work performs in the real world.",
  },
  {
    slug: "insights",
    label: "Insights",
    description:
      "Market intelligence, design guidance, and strategic commentary from the field.",
  },
  {
    slug: "reviews",
    label: "Reviews",
    description:
      "Client feedback, service highlights, and trust-building proof points.",
  },
];

export const newsHubMetricItems: NewsHubMetricItem[] = [
  {
    id: "metric-001",
    title: "Live Channels",
    value: "6",
    description:
      "Residential, Industrial, Partners, Case Studies, Insights, and Reviews.",
  },
  {
    id: "metric-002",
    title: "Published Articles",
    value: "24+",
    description:
      "Professional electrical engineering content across all sectors and domains.",
  },
  {
    id: "metric-003",
    title: "Industry Sectors",
    value: "8",
    description:
      "Healthcare, Commercial, Residential, Industrial, Education, Retail, Hospitality, and Data Centres.",
  },
  {
    id: "metric-004",
    title: "Avg. Read Time",
    value: "5 min",
    description:
      "Concise, actionable content designed for busy professionals and decision-makers.",
  },
];

export const allNewsArticles: NewsArticle[] = [
  {
    id: "news-001",
    slug: "taplow-residential-energy-refresh",
    category: "residential",
    categoryLabel: "Residential",
    title:
      "Taplow Residential Energy Refresh Cuts Waste Without Compromising Comfort",
    excerpt:
      "A behind-the-scenes look at how a phased home electrification programme reduced energy waste while preserving day-to-day comfort for a growing family home.",
    description:
      "This residential update tracks a practical smart-home and efficiency rollout, blending lighting control, board upgrades, and future-ready EV planning.",
    featuredImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Smart residential interior with integrated lighting and controls",
    },
    author: {
      name: "Adu Herman",
      role: "Editorial Lead",
    },
    location: "Taplow",
    readTime: "5 min read",
    tags: ["Residential", "Smart Living", "Efficiency"],
    isFeatured: true,
    publishedAt: "2026-03-24T09:00:00.000Z",
    updatedAt: "2026-03-28T11:30:00.000Z",
    spotlightMetric: {
      label: "Projected savings",
      value: "28%",
    },
    detail: {
      intro: [
        "The homeowners needed a cleaner, more resilient electrical foundation before expanding into solar storage and EV charging.",
        "Instead of a disruptive full strip-out, the delivery plan layered board modernisation, smarter circuit zoning, and human-centric lighting upgrades across a controlled six-week programme.",
      ],
      takeaways: [
        "Phased works reduced household disruption and protected critical evening routines.",
        "Future EV infrastructure was baked into the first-stage design to avoid duplicated spend later.",
        "The final layout improved visibility, comfort, and usage analytics for long-term optimisation.",
      ],
      spotlight: [
        { label: "Programme", value: "6 weeks" },
        { label: "Control zones", value: "14" },
        { label: "Future capacity", value: "EV ready" },
      ],
      quote: {
        quote:
          "We now have a house that feels simpler to live in, but far more capable behind the walls.",
        author: "Private Client",
        role: "Homeowner",
      },
    },
  },
  {
    id: "news-002",
    slug: "docklands-switchgear-watch",
    category: "industrial",
    categoryLabel: "Industrial",
    title:
      "Docklands Switchgear Watch: What Real-Time Monitoring Changed in Month One",
    excerpt:
      "Operational telemetry from a live industrial upgrade reveals how monitoring reshaped response times, maintenance planning, and risk visibility within the first month.",
    description:
      "An industrial field report on how live monitoring and disciplined handover reduced uncertainty for facilities teams under active load.",
    featuredImage: {
      src: "/images/power-distribution.jpg",
      alt: "Power distribution systems with industrial monitoring equipment",
    },
    author: {
      name: "Nexgen Delivery Desk",
      role: "Project Communications",
    },
    location: "London Docklands",
    readTime: "6 min read",
    tags: ["Industrial", "Monitoring", "Switchgear"],
    isFeatured: false,
    publishedAt: "2026-03-18T08:00:00.000Z",
    updatedAt: "2026-03-27T16:15:00.000Z",
    spotlightMetric: {
      label: "Response visibility",
      value: "24/7",
    },
    detail: {
      intro: [
        "Month-one reporting focused on whether the new monitoring layer produced operational clarity quickly enough to justify the rollout.",
        "The answer was decisive: facilities leads could spot anomalies earlier, capture better evidence, and coordinate maintenance windows without guesswork.",
      ],
      takeaways: [
        "Alarm prioritisation reduced triage noise for the on-site team.",
        "Load pattern insight surfaced avoidable peaks across shift changes.",
        "Monthly handover reporting became clearer for leadership and insurers.",
      ],
      spotlight: [
        { label: "Sensors live", value: "120+" },
        { label: "Alert tiers", value: "3" },
        { label: "Reporting cadence", value: "Weekly" },
      ],
    },
  },
  {
    id: "news-003",
    slug: "partner-spotlight-build-programme-alignment",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Partner Spotlight: How Early Programme Alignment Reduced Rework on a Mixed-Use Scheme",
    excerpt:
      "A partner story on coordination discipline, early design decisions, and the commercial benefits of treating electrical delivery as a programme conversation from day one.",
    description:
      "This collaboration feature highlights how designers, contractors, and suppliers reduced friction through shared planning.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Commercial construction planning session with delivery partners",
    },
    author: {
      name: "Nexgen Partnerships Team",
      role: "Partner Communications",
    },
    partnerLabel: "BuildWest Group",
    readTime: "4 min read",
    tags: ["Partners", "Coordination", "Delivery"],
    isFeatured: false,
    publishedAt: "2026-03-16T09:45:00.000Z",
    updatedAt: "2026-03-25T10:00:00.000Z",
    spotlightMetric: {
      label: "Rework avoided",
      value: "Low",
    },
    detail: {
      intro: [
        "The programme team chose to align electrical, builder, and supplier decisions earlier than usual, using shared milestones and clearer package boundaries.",
        "That decision paid off in fewer access clashes, stronger procurement sequencing, and better expectations for client reporting.",
      ],
      takeaways: [
        "Early package sequencing reduced reactive redesign pressure.",
        "Stakeholders saw clearer ownership across every workfront.",
        "Procurement visibility improved confidence around long-lead items.",
      ],
      spotlight: [
        { label: "Stakeholders", value: "5 core teams" },
        { label: "Programme horizon", value: "18 months" },
        { label: "Planning format", value: "Shared cadence" },
      ],
    },
  },
  {
    id: "news-004",
    slug: "hospital-power-ring-lessons-learned",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title:
      "Hospital Emergency Power Ring: Lessons Learned from a Live Critical Infrastructure Upgrade",
    excerpt:
      "This case study distils delivery lessons from a live hospital power-ring upgrade where resilience, communication, and sequencing all had zero room for error.",
    description:
      "A case-study article built for stakeholders who want proof, process, and practical lessons from critical infrastructure delivery.",
    featuredImage: {
      src: "/images/services-industrial.jpg",
      alt: "Critical infrastructure project environment with engineering teams on site",
    },
    author: {
      name: "Programme Office",
      role: "Case Study Editor",
    },
    location: "Central London",
    readTime: "7 min read",
    tags: ["Case Study", "Healthcare", "Resilience"],
    isFeatured: false,
    publishedAt: "2026-03-14T07:30:00.000Z",
    updatedAt: "2026-03-26T09:30:00.000Z",
    spotlightMetric: {
      label: "Critical load protected",
      value: "100%",
    },
    detail: {
      intro: [
        "The hospital upgrade demanded more than technical competence; it required operational empathy and relentless sequencing discipline.",
        "Teams aligned outages, clinical priorities, supplier readiness, and escalation routes before each stage moved forward.",
      ],
      takeaways: [
        "Every outage window needs a clinical narrative, not just a technical one.",
        "Escalation routes should be visible to delivery and client-side teams alike.",
        "Progress reporting must translate electrical risk into operational language.",
      ],
      spotlight: [
        { label: "Protected circuits", value: "42" },
        { label: "Outage windows", value: "Night only" },
        { label: "Stakeholder briefings", value: "Daily" },
      ],
      quote: {
        quote:
          "The discipline of communication was as important as the engineering itself.",
        author: "Clinical Estates Lead",
        role: "Client Stakeholder",
      },
    },
  },
  {
    id: "news-005",
    slug: "why-ev-readiness-starts-at-the-board",
    category: "insights",
    categoryLabel: "Insights",
    title: "Why EV Readiness Starts at the Board, Not the Charger",
    excerpt:
      "A practical insight piece for clients planning EV rollouts, showing why upstream infrastructure decisions determine speed, budget, and future flexibility.",
    description:
      "This insight article reframes EV infrastructure planning around the electrical backbone rather than the charging hardware alone.",
    featuredImage: {
      src: "/images/system-diagnostics.jpg",
      alt: "Electrical diagnostics and planning tools for EV readiness",
    },
    author: {
      name: "Technical Strategy Team",
      role: "Insights Editor",
    },
    readTime: "5 min read",
    tags: ["Insights", "EV", "Power Planning"],
    isFeatured: false,
    publishedAt: "2026-03-12T10:30:00.000Z",
    updatedAt: "2026-03-21T12:00:00.000Z",
    spotlightMetric: {
      label: "Planning leverage",
      value: "High",
    },
    detail: {
      intro: [
        "Many EV discussions start with charger models, but successful programmes usually start much earlier in the board strategy and spare capacity conversation.",
        "Clients that assess incoming capacity, load diversity, and phased growth early are far better placed to scale without rework.",
      ],
      takeaways: [
        "Board strategy determines what is realistically scalable.",
        "Load planning avoids over-buying hardware that cannot be fully used.",
        "Future-ready design protects programmes from avoidable second-stage disruption.",
      ],
      spotlight: [
        { label: "Typical phases", value: "3" },
        { label: "Board checks", value: "Capacity first" },
        { label: "Best fit", value: "Scalable estates" },
      ],
    },
  },
  {
    id: "news-006",
    slug: "latest-client-review-canary-wharf-retrofit",
    category: "reviews",
    categoryLabel: "Reviews",
    title:
      "Latest Client Review: Canary Wharf Retrofit Delivery Earns Repeat Appointment",
    excerpt:
      "A new review from a repeat commercial client explains why calm delivery, transparent updates, and tidy handovers still win long after installation is complete.",
    description:
      "This review-led story packages trust signals and delivery proof into a reusable marketing and sales asset.",
    featuredImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "Completed commercial lighting retrofit project interior",
    },
    author: {
      name: "Client Success Desk",
      role: "Reviews Editor",
    },
    partnerLabel: "Riverside Commercial Centre",
    readTime: "3 min read",
    tags: ["Reviews", "Commercial", "Trust"],
    isFeatured: false,
    publishedAt: "2026-03-11T15:00:00.000Z",
    updatedAt: "2026-03-19T09:15:00.000Z",
    spotlightMetric: {
      label: "Repeat appointment",
      value: "Yes",
    },
    detail: {
      intro: [
        "Repeat work often reflects the quality of process as much as the quality of installation.",
        "This review highlighted communication rhythm, site conduct, and confidence in final handover as decisive reasons for a second appointment.",
      ],
      takeaways: [
        "Consistent updates reduce client uncertainty during delivery.",
        "Tidy handover materials improve trust after practical completion.",
        "Review stories can double as strong conversion assets in the hub.",
      ],
      spotlight: [
        { label: "Client status", value: "Repeat" },
        { label: "Sector", value: "Commercial" },
        { label: "Story role", value: "Proof asset" },
      ],
      quote: {
        quote:
          "The job was well organised, well communicated, and delivered exactly how a busy commercial client needs it to be.",
        author: "Facilities Director",
        role: "Commercial Client",
      },
    },
  },
  {
    id: "news-007",
    slug: "partner-campaign-community-electrification-week",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Community Electrification Week Launches with Partner-Led Campaign Assets",
    excerpt:
      "A campaign-led partner update showing how shared storytelling, campaign cards, and site-ready assets can turn delivery milestones into usable marketing momentum.",
    description:
      "This partner campaign article bridges operations, comms, and business development in a single newsroom-ready format.",
    featuredImage: {
      src: "/images/community-hero.jpg",
      alt: "Community-focused campaign artwork and electrification story visuals",
    },
    author: {
      name: "Campaign Studio",
      role: "Content Lead",
    },
    partnerLabel: "Community Power Alliance",
    readTime: "4 min read",
    tags: ["Partners", "Campaign", "Community"],
    isFeatured: false,
    publishedAt: "2026-03-09T09:10:00.000Z",
    updatedAt: "2026-03-20T08:40:00.000Z",
    spotlightMetric: {
      label: "Campaign assets",
      value: "12 live",
    },
    detail: {
      intro: [
        "The launch combined campaign storytelling with operational proof so partner teams could use the same source material across sales, social, and project updates.",
        "That structure is exactly why the news hub sidebar matters: campaign modules can sit beside editorial stories without breaking the data model.",
      ],
      takeaways: [
        "Editorial and campaign content can coexist in one publishing architecture.",
        "Reusable cards make fast stakeholder updates easier to distribute.",
        "Partner content becomes more valuable when routed through a stable content model.",
      ],
      spotlight: [
        { label: "Campaign week", value: "7 days" },
        { label: "Reusable cards", value: "12" },
        { label: "Primary channels", value: "Web + social" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL ARTICLES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-008",
    slug: "complete-home-rewire-victorian-terrace-hackney",
    category: "residential",
    categoryLabel: "Residential",
    title: "Complete Home Rewire: Victorian Terrace Transformation in Hackney",
    excerpt:
      "How a full electrical rewire brought a 1890s Victorian terrace into the modern era while preserving period features and meeting BS 7671 19th Edition standards.",
    description:
      "A detailed residential case showcasing the challenges and solutions involved in rewiring heritage properties without compromising architectural character.",
    featuredImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Victorian terrace interior with modern concealed electrical installation",
    },
    author: {
      name: "James Mitchell",
      role: "Senior Electrical Engineer",
    },
    location: "Hackney, London",
    readTime: "6 min read",
    tags: ["Residential", "Rewiring", "Heritage", "BS 7671"],
    isFeatured: false,
    publishedAt: "2026-03-28T08:00:00.000Z",
    updatedAt: "2026-03-30T14:00:00.000Z",
    spotlightMetric: {
      label: "Property age",
      value: "135 years",
    },
    detail: {
      intro: [
        "Rewiring a Victorian terrace requires balancing modern safety standards with the preservation of period features that give these properties their character.",
        "This project in Hackney demonstrates how careful planning, discrete routing, and specialist techniques can deliver a fully compliant 19th Edition installation without visible damage to original plasterwork.",
      ],
      takeaways: [
        "Floor-lifting access reduces wall channelling and preserves original plaster cornicing.",
        "Split-load consumer units with dual RCD protection future-proof the installation for EV charging.",
        "Coordination with heritage consultants ensured Listed Building consent compliance throughout.",
      ],
      spotlight: [
        { label: "Circuits installed", value: "28" },
        { label: "Programme duration", value: "3 weeks" },
        { label: "Compliance", value: "BS 7671 19th" },
      ],
      quote: {
        quote:
          "We were nervous about disruption to the original features, but the team managed to route everything without a single crack in our cornicing.",
        author: "Sarah and Tom Henderson",
        role: "Homeowners",
      },
    },
  },
  {
    id: "news-009",
    slug: "smart-home-automation-new-build-integration",
    category: "residential",
    categoryLabel: "Residential",
    title:
      "Smart Home Automation: Integrating KNX and Lighting Control in a New Build",
    excerpt:
      "A comprehensive guide to specifying and installing KNX-based home automation in new-build properties, from initial design through to commissioning and handover.",
    description:
      "This article explores the technical and practical considerations for integrating building automation systems in residential new builds.",
    featuredImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Smart home control panel with integrated lighting and climate controls",
    },
    author: {
      name: "Emma Roberts",
      role: "Automation Specialist",
    },
    location: "Richmond, Surrey",
    readTime: "7 min read",
    tags: ["Residential", "Smart Home", "KNX", "Automation"],
    isFeatured: true,
    publishedAt: "2026-03-26T10:00:00.000Z",
    updatedAt: "2026-03-29T16:30:00.000Z",
    spotlightMetric: {
      label: "Automation zones",
      value: "24",
    },
    detail: {
      intro: [
        "KNX remains the gold standard for residential building automation, offering unparalleled flexibility and longevity compared to proprietary wireless systems.",
        "This new-build project in Richmond showcases how early involvement in the design phase allows for optimal cable routing and sensor placement.",
      ],
      takeaways: [
        "First-fix coordination with the builder prevents costly retrofit routing later.",
        "Scene programming should reflect actual living patterns, not showroom demonstrations.",
        "Remote access via IP gateway enables ongoing support without site visits.",
      ],
      spotlight: [
        { label: "KNX devices", value: "142" },
        { label: "Lighting circuits", value: "48" },
        { label: "HVAC zones", value: "6" },
      ],
    },
  },
  {
    id: "news-010",
    slug: "ev-charger-installation-domestic-load-assessment",
    category: "residential",
    categoryLabel: "Residential",
    title:
      "EV Charger Installation: Domestic Load Assessment and DNO Notification",
    excerpt:
      "Understanding the electrical requirements for home EV charger installation, including maximum demand calculations, earthing arrangements, and DNO application processes.",
    description:
      "A practical guide for homeowners and installers navigating the technical and regulatory requirements of domestic EV charging infrastructure.",
    featuredImage: {
      src: "/images/system-diagnostics.jpg",
      alt: "Domestic EV charger installation with dedicated supply and isolator",
    },
    author: {
      name: "David Chen",
      role: "EV Infrastructure Lead",
    },
    location: "Nationwide",
    readTime: "5 min read",
    tags: ["Residential", "EV Charging", "DNO", "Load Assessment"],
    isFeatured: false,
    publishedAt: "2026-03-22T09:30:00.000Z",
    updatedAt: "2026-03-27T11:00:00.000Z",
    spotlightMetric: {
      label: "Typical install time",
      value: "4 hours",
    },
    detail: {
      intro: [
        "With EV adoption accelerating, understanding the electrical implications of home charging has become essential for both installers and homeowners.",
        "This guide covers the complete process from initial site survey through to DNO notification and OZEV grant applications.",
      ],
      takeaways: [
        "Maximum demand calculations must account for diversity across all existing circuits.",
        "PME earthing systems require additional consideration under BS 7671 Section 722.",
        "OZEV grant applications require TrustMark registration and OLEV-approved charger installation.",
      ],
      spotlight: [
        { label: "Typical rating", value: "7.4kW" },
        { label: "Cable size", value: "10mm SWA" },
        { label: "DNO threshold", value: "13.8kW" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // INDUSTRIAL ARTICLES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-011",
    slug: "data-centre-power-distribution-tier-iii-compliance",
    category: "industrial",
    categoryLabel: "Industrial",
    title:
      "Data Centre Power Distribution: Achieving Tier III Compliance in a London Facility",
    excerpt:
      "A technical deep-dive into the electrical infrastructure design required for Tier III data centre certification, including redundancy, UPS topology, and generator paralleling.",
    description:
      "This industrial article examines the critical power systems that underpin modern data centre operations and their certification requirements.",
    featuredImage: {
      src: "/images/power-distribution.jpg",
      alt: "Data centre power distribution unit with redundant feeds",
    },
    author: {
      name: "Michael Thompson",
      role: "Critical Power Engineer",
    },
    location: "Slough, Berkshire",
    readTime: "8 min read",
    tags: ["Industrial", "Data Centre", "Critical Power", "Tier III"],
    isFeatured: true,
    publishedAt: "2026-03-25T07:00:00.000Z",
    updatedAt: "2026-03-28T10:30:00.000Z",
    spotlightMetric: {
      label: "Uptime target",
      value: "99.982%",
    },
    detail: {
      intro: [
        "Tier III data centres require N+1 redundancy across all power distribution paths, allowing maintenance without service interruption.",
        "This project in Slough demonstrates the electrical design principles that achieve concurrent maintainability while optimising capital expenditure.",
      ],
      takeaways: [
        "2N topology provides maximum redundancy but significantly increases CAPEX compared to N+1.",
        "Static transfer switches enable sub-cycle failover between redundant UPS paths.",
        "Generator synchronisation panels allow paralleling for extended runtime during utility outages.",
      ],
      spotlight: [
        { label: "IT load capacity", value: "4MW" },
        { label: "UPS modules", value: "8 x 500kVA" },
        { label: "Generator sets", value: "4 x 1.5MVA" },
      ],
      quote: {
        quote:
          "The electrical design exceeded our Tier III requirements while keeping construction costs 12% under budget.",
        author: "Technical Director",
        role: "Data Centre Operator",
      },
    },
  },
  {
    id: "news-012",
    slug: "manufacturing-facility-power-factor-correction",
    category: "industrial",
    categoryLabel: "Industrial",
    title:
      "Power Factor Correction: Eliminating Reactive Charges in Manufacturing",
    excerpt:
      "How automatic power factor correction systems can reduce electricity costs by up to 15% in industrial facilities with significant motor loads.",
    description:
      "A practical guide to understanding, specifying, and implementing power factor correction in manufacturing environments.",
    featuredImage: {
      src: "/images/services-industrial.jpg",
      alt: "Industrial power factor correction capacitor bank installation",
    },
    author: {
      name: "Richard Evans",
      role: "Industrial Systems Engineer",
    },
    location: "Birmingham",
    readTime: "6 min read",
    tags: ["Industrial", "Power Factor", "Energy Efficiency", "Motors"],
    isFeatured: false,
    publishedAt: "2026-03-20T08:30:00.000Z",
    updatedAt: "2026-03-25T15:00:00.000Z",
    spotlightMetric: {
      label: "Annual savings",
      value: "£47,000",
    },
    detail: {
      intro: [
        "Poor power factor results in reactive power charges that can represent 10-20% of industrial electricity bills.",
        "This manufacturing facility case study demonstrates the ROI calculation process and installation considerations for automatic PFC systems.",
      ],
      takeaways: [
        "Target power factor of 0.95 lagging typically eliminates all reactive power charges.",
        "Harmonic filters may be required where VFDs represent significant proportion of load.",
        "Detuned reactors prevent capacitor resonance with supply harmonics.",
      ],
      spotlight: [
        { label: "Corrected PF", value: "0.97" },
        { label: "Bank size", value: "400kVAr" },
        { label: "Payback period", value: "18 months" },
      ],
    },
  },
  {
    id: "news-013",
    slug: "warehouse-led-lighting-retrofit-roi-analysis",
    category: "industrial",
    categoryLabel: "Industrial",
    title:
      "Warehouse LED Lighting Retrofit: Energy Savings and ROI Analysis",
    excerpt:
      "A comprehensive analysis of LED lighting upgrade costs, energy savings, and return on investment for large-scale warehouse and logistics facilities.",
    description:
      "This article provides the financial and technical framework for evaluating industrial LED lighting retrofits.",
    featuredImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "High-bay LED lighting installation in modern warehouse facility",
    },
    author: {
      name: "Helen Walker",
      role: "Energy Efficiency Consultant",
    },
    location: "Northampton",
    readTime: "5 min read",
    tags: ["Industrial", "LED Lighting", "Energy Efficiency", "ROI"],
    isFeatured: false,
    publishedAt: "2026-03-18T11:00:00.000Z",
    updatedAt: "2026-03-23T09:30:00.000Z",
    spotlightMetric: {
      label: "Energy reduction",
      value: "68%",
    },
    detail: {
      intro: [
        "Industrial lighting typically represents 15-25% of facility energy consumption, making it a prime target for efficiency improvements.",
        "This 50,000 sq ft warehouse retrofit demonstrates the methodology for calculating true ROI including maintenance savings and carbon reduction benefits.",
      ],
      takeaways: [
        "High-bay LED fixtures with integrated sensors achieve additional 30% savings through daylight harvesting.",
        "Emergency lighting integration eliminates separate maintained luminaire requirements.",
        "DALI control enables future smart building integration without rewiring.",
      ],
      spotlight: [
        { label: "Fixtures replaced", value: "240" },
        { label: "Annual kWh saved", value: "186,000" },
        { label: "Simple payback", value: "2.8 years" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // CASE STUDIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-014",
    slug: "private-hospital-theatre-electrical-upgrade",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title:
      "Private Hospital Operating Theatre: Complete Electrical Infrastructure Upgrade",
    excerpt:
      "A detailed case study of upgrading electrical systems in live operating theatre environments while maintaining clinical operations and HTM 06-01 compliance.",
    description:
      "This case study examines the unique challenges of healthcare electrical installations and the protocols required for patient safety.",
    featuredImage: {
      src: "/images/services-industrial.jpg",
      alt: "Hospital operating theatre with medical IT system and isolated power",
    },
    author: {
      name: "Dr. Andrew Phillips",
      role: "Healthcare Infrastructure Lead",
    },
    location: "Central London",
    readTime: "9 min read",
    tags: ["Case Study", "Healthcare", "HTM 06-01", "Critical Power"],
    isFeatured: true,
    publishedAt: "2026-03-24T06:30:00.000Z",
    updatedAt: "2026-03-29T12:00:00.000Z",
    spotlightMetric: {
      label: "Theatre downtime",
      value: "0 hours",
    },
    detail: {
      intro: [
        "Operating theatres require Group 2 medical locations with isolated power supply systems to ensure patient safety during surgical procedures.",
        "This upgrade project replaced aging IPS units while maintaining full clinical operations through meticulous phasing and weekend working.",
      ],
      takeaways: [
        "Insulation monitoring devices must be sized for cable capacitance of modern installations.",
        "UPS systems require 3-hour runtime for Group 2 locations under HTM 06-01.",
        "Infection control protocols mandate specific cable and containment materials in theatre spaces.",
      ],
      spotlight: [
        { label: "Theatres upgraded", value: "4" },
        { label: "IPS units", value: "8 x 10kVA" },
        { label: "Clinical downtime", value: "Zero" },
      ],
      quote: {
        quote:
          "The phased approach meant we never lost a single theatre slot during the entire upgrade programme.",
        author: "Clinical Director",
        role: "Private Hospital",
      },
    },
  },
  {
    id: "news-015",
    slug: "university-campus-hv-network-modernisation",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title:
      "University Campus HV Network Modernisation: 11kV Ring Main Replacement",
    excerpt:
      "How a phased high-voltage network upgrade programme maintained power to 40+ buildings while replacing aging 1970s switchgear and transformers.",
    description:
      "A comprehensive case study of high-voltage infrastructure renewal in an occupied campus environment.",
    featuredImage: {
      src: "/images/power-distribution.jpg",
      alt: "High-voltage ring main unit with modern SF6-free switchgear",
    },
    author: {
      name: "Stuart Morrison",
      role: "HV Projects Manager",
    },
    location: "Oxford",
    readTime: "8 min read",
    tags: ["Case Study", "High Voltage", "Education", "Infrastructure"],
    isFeatured: false,
    publishedAt: "2026-03-21T07:00:00.000Z",
    updatedAt: "2026-03-26T14:30:00.000Z",
    spotlightMetric: {
      label: "Buildings served",
      value: "42",
    },
    detail: {
      intro: [
        "University campuses often operate on aging private HV networks that require modernisation without disrupting academic operations.",
        "This five-year programme replaced the entire 11kV ring main while maintaining N-1 redundancy throughout.",
      ],
      takeaways: [
        "Temporary HV connections enabled switchgear replacement without extended outages.",
        "SF6-free switchgear specification aligned with university sustainability commitments.",
        "Smart grid monitoring provides real-time fault location and load balancing.",
      ],
      spotlight: [
        { label: "Programme duration", value: "5 years" },
        { label: "Substations", value: "12" },
        { label: "Transformers", value: "18 x 1MVA" },
      ],
    },
  },
  {
    id: "news-016",
    slug: "retail-chain-electrical-standardisation-programme",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title:
      "Retail Chain Electrical Standardisation: 150-Store Rollout Programme",
    excerpt:
      "A case study in scaling electrical installation standards across a national retail portfolio, from specification development through to completion.",
    description:
      "This article examines the challenges and solutions in delivering consistent electrical standards across multiple sites.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Retail store electrical distribution board with branded identification",
    },
    author: {
      name: "Lisa Chen",
      role: "Programme Delivery Manager",
    },
    location: "Nationwide",
    readTime: "7 min read",
    tags: ["Case Study", "Retail", "Standardisation", "Multi-Site"],
    isFeatured: false,
    publishedAt: "2026-03-19T09:00:00.000Z",
    updatedAt: "2026-03-24T11:30:00.000Z",
    spotlightMetric: {
      label: "Stores completed",
      value: "152",
    },
    detail: {
      intro: [
        "Multi-site retail programmes require standardised specifications that can adapt to varying property constraints while maintaining brand consistency.",
        "This 18-month programme delivered consistent electrical infrastructure across 152 stores, from small high-street units to large format out-of-town locations.",
      ],
      takeaways: [
        "Template design packages reduce site survey-to-installation time by 40%.",
        "Centralised procurement achieves 15-20% material cost savings through volume agreements.",
        "Standardised commissioning checklists ensure consistent quality across all sites.",
      ],
      spotlight: [
        { label: "Programme duration", value: "18 months" },
        { label: "Installation teams", value: "8 regional" },
        { label: "Defect rate", value: "< 2%" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-017",
    slug: "bs-7671-19th-edition-key-changes-contractors",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "BS 7671 19th Edition: Key Changes Every Contractor Needs to Know",
    excerpt:
      "A practical summary of the most significant changes in the 19th Edition wiring regulations and their impact on everyday installation practice.",
    description:
      "This insights article breaks down complex regulatory changes into actionable guidance for working electricians.",
    featuredImage: {
      src: "/images/system-diagnostics.jpg",
      alt: "BS 7671 19th Edition regulations book with installation testing equipment",
    },
    author: {
      name: "Paul Richardson",
      role: "Technical Compliance Manager",
    },
    readTime: "6 min read",
    tags: ["Insights", "BS 7671", "Regulations", "Compliance"],
    isFeatured: true,
    publishedAt: "2026-03-23T10:00:00.000Z",
    updatedAt: "2026-03-28T08:00:00.000Z",
    spotlightMetric: {
      label: "Implementation",
      value: "Now Live",
    },
    detail: {
      intro: [
        "The 19th Edition of BS 7671 introduces significant changes to Arc Fault Detection, cable sizing, and prosumer installations.",
        "This article highlights the changes most likely to affect day-to-day installation work and inspection practices.",
      ],
      takeaways: [
        "AFDDs are now recommended for specific locations including bedrooms in HMOs.",
        "Cable installation methods have been reclassified with new reference methods for thermal insulation.",
        "Prosumer installations require enhanced isolation and grid export considerations.",
      ],
      spotlight: [
        { label: "New regulations", value: "120+" },
        { label: "Transition period", value: "Ended" },
        { label: "Next amendment", value: "2027" },
      ],
    },
  },
  {
    id: "news-018",
    slug: "future-proofing-electrical-infrastructure-electrification",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "Future-Proofing Electrical Infrastructure for Building Electrification",
    excerpt:
      "Strategic guidance on designing electrical systems that can accommodate heat pump retrofits, EV charging expansion, and solar PV integration.",
    description:
      "This insight piece helps building owners and designers plan for the electrical demands of decarbonisation.",
    featuredImage: {
      src: "/images/power-distribution.jpg",
      alt: "Modern electrical distribution with capacity for renewable integration",
    },
    author: {
      name: "Dr. Sarah Mitchell",
      role: "Decarbonisation Strategy Lead",
    },
    readTime: "7 min read",
    tags: ["Insights", "Electrification", "Heat Pumps", "Net Zero"],
    isFeatured: false,
    publishedAt: "2026-03-17T11:30:00.000Z",
    updatedAt: "2026-03-22T16:00:00.000Z",
    spotlightMetric: {
      label: "Demand increase",
      value: "150-200%",
    },
    detail: {
      intro: [
        "Building electrification will increase typical peak electrical demand by 150-200% as gas heating and petrol vehicles are replaced.",
        "Designing electrical infrastructure today that can accommodate these future loads avoids costly and disruptive upgrades later.",
      ],
      takeaways: [
        "Incoming supply capacity should be assessed against future maximum demand scenarios.",
        "Spare ways in distribution boards should accommodate heat pump, EV, and battery storage circuits.",
        "Three-phase supplies increasingly necessary for properties with multiple electrification loads.",
      ],
      spotlight: [
        { label: "Heat pump load", value: "3-6kW" },
        { label: "EV charger", value: "7.4-22kW" },
        { label: "Battery storage", value: "5-13.5kW" },
      ],
    },
  },
  {
    id: "news-019",
    slug: "electrical-contractor-insurance-requirements-guide",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "Electrical Contractor Insurance: Understanding Coverage Requirements",
    excerpt:
      "A comprehensive guide to the insurance policies electrical contractors need, from public liability to professional indemnity and contract works cover.",
    description:
      "This article helps contractors understand and optimise their insurance coverage for different project types.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Contractor documentation and insurance certificates",
    },
    author: {
      name: "Jennifer Adams",
      role: "Business Development Manager",
    },
    readTime: "5 min read",
    tags: ["Insights", "Insurance", "Business", "Compliance"],
    isFeatured: false,
    publishedAt: "2026-03-15T14:00:00.000Z",
    updatedAt: "2026-03-20T10:00:00.000Z",
    spotlightMetric: {
      label: "Min. PL cover",
      value: "£2m",
    },
    detail: {
      intro: [
        "Adequate insurance coverage is essential for winning contracts and protecting your business from potentially devastating claims.",
        "This guide explains the different policy types and typical coverage levels required by different client types.",
      ],
      takeaways: [
        "Public liability cover of £5m increasingly required for commercial contracts.",
        "Professional indemnity essential for design responsibility or specification advice.",
        "Employer liability is mandatory with minimum £5m cover for all employers.",
      ],
      spotlight: [
        { label: "Public liability", value: "£5-10m" },
        { label: "PI cover", value: "£250k-1m" },
        { label: "Employer liability", value: "£10m" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PARTNERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-020",
    slug: "manufacturer-partnership-schneider-electric-training",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Manufacturer Partnership: Schneider Electric Technical Training Programme",
    excerpt:
      "How our partnership with Schneider Electric provides engineers with certified training on the latest switchgear, automation, and power monitoring technologies.",
    description:
      "This partner feature highlights the value of manufacturer relationships in maintaining technical excellence.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Schneider Electric training facility with switchgear demonstration",
    },
    author: {
      name: "Mark Stevens",
      role: "Training Coordinator",
    },
    partnerLabel: "Schneider Electric",
    readTime: "4 min read",
    tags: ["Partners", "Training", "Schneider", "Technical Excellence"],
    isFeatured: false,
    publishedAt: "2026-03-22T08:00:00.000Z",
    updatedAt: "2026-03-27T09:30:00.000Z",
    spotlightMetric: {
      label: "Engineers certified",
      value: "24",
    },
    detail: {
      intro: [
        "Product knowledge and manufacturer certification ensure our teams can specify, install, and commission equipment to the highest standards.",
        "Our Schneider Electric partnership provides ongoing access to technical training centres and product specialists.",
      ],
      takeaways: [
        "Annual certification renewal ensures knowledge remains current with product updates.",
        "Direct manufacturer support reduces commissioning time and improves first-time fix rates.",
        "Access to beta programmes allows early evaluation of emerging technologies.",
      ],
      spotlight: [
        { label: "Training days", value: "48 p.a." },
        { label: "Product lines", value: "12" },
        { label: "Support SLA", value: "4 hours" },
      ],
    },
  },
  {
    id: "news-021",
    slug: "developer-framework-agreement-residential-schemes",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Developer Framework Agreement: Delivering Electrical Packages for Major Residential Schemes",
    excerpt:
      "How framework agreements with volume housebuilders create efficiency through standardised specifications, bulk procurement, and dedicated delivery teams.",
    description:
      "This partner article demonstrates the commercial and operational benefits of strategic developer relationships.",
    featuredImage: {
      src: "/images/community-hero.jpg",
      alt: "Residential development site with multiple properties under construction",
    },
    author: {
      name: "Graham Foster",
      role: "Frameworks Manager",
    },
    partnerLabel: "Bellway Homes",
    readTime: "5 min read",
    tags: ["Partners", "Developers", "Framework", "Residential"],
    isFeatured: true,
    publishedAt: "2026-03-19T09:30:00.000Z",
    updatedAt: "2026-03-24T13:00:00.000Z",
    spotlightMetric: {
      label: "Units p.a.",
      value: "850+",
    },
    detail: {
      intro: [
        "Framework agreements provide developers with cost certainty and quality consistency across multiple schemes.",
        "Our Bellway partnership delivers electrical first-fix and second-fix packages across three regional divisions.",
      ],
      takeaways: [
        "Standardised plot specifications reduce variation and improve programme predictability.",
        "Dedicated site teams build relationships and understand developer quality expectations.",
        "Volume purchasing agreements deliver material savings passed through to the developer.",
      ],
      spotlight: [
        { label: "Active sites", value: "12" },
        { label: "Annual value", value: "£3.2m" },
        { label: "Framework term", value: "3 years" },
      ],
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEWS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-022",
    slug: "hotel-group-electrical-maintenance-contract-review",
    category: "reviews",
    categoryLabel: "Reviews",
    title:
      "Hotel Group Review: Planned Preventive Maintenance Contract Renewal",
    excerpt:
      "A hospitality client shares their experience of working with our team on a multi-site planned maintenance contract, highlighting response times and service quality.",
    description:
      "This review article captures client feedback on maintenance service delivery across a hotel portfolio.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Hotel reception area with modern lighting installation",
    },
    author: {
      name: "Client Success Team",
      role: "Reviews Editor",
    },
    partnerLabel: "Intercontinental Hotels Group",
    readTime: "4 min read",
    tags: ["Reviews", "Hospitality", "Maintenance", "FM"],
    isFeatured: false,
    publishedAt: "2026-03-20T15:00:00.000Z",
    updatedAt: "2026-03-25T10:00:00.000Z",
    spotlightMetric: {
      label: "Contract renewal",
      value: "3rd term",
    },
    detail: {
      intro: [
        "Planned preventive maintenance programmes provide the proactive care that prevents costly emergency callouts and guest impact.",
        "This review reflects on three contract terms covering 8 hotels in the London and South East region.",
      ],
      takeaways: [
        "24/7 emergency response with 2-hour SLA provides confidence for duty managers.",
        "Night shift working ensures maintenance activities do not impact guest experience.",
        "Detailed reporting supports ESG compliance and asset lifecycle planning.",
      ],
      spotlight: [
        { label: "Hotels covered", value: "8" },
        { label: "Emergency SLA", value: "2 hours" },
        { label: "PPM compliance", value: "98.5%" },
      ],
      quote: {
        quote:
          "The consistent quality across all our properties means I never worry about which hotel is getting attention. Every site receives the same professional standard.",
        author: "Regional Engineering Manager",
        role: "IHG Hotels",
      },
    },
  },
  {
    id: "news-023",
    slug: "school-academy-trust-summer-works-review",
    category: "reviews",
    categoryLabel: "Reviews",
    title:
      "Academy Trust Review: Summer Works Programme Delivery Across 6 Schools",
    excerpt:
      "An education client reviews the delivery of electrical upgrade works across multiple school sites during the summer holiday period.",
    description:
      "This review highlights the unique challenges and requirements of education sector electrical projects.",
    featuredImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "School corridor with upgraded LED lighting and emergency systems",
    },
    author: {
      name: "Client Success Team",
      role: "Reviews Editor",
    },
    partnerLabel: "Academies Enterprise Trust",
    readTime: "4 min read",
    tags: ["Reviews", "Education", "Summer Works", "LED"],
    isFeatured: false,
    publishedAt: "2026-03-16T12:00:00.000Z",
    updatedAt: "2026-03-21T14:30:00.000Z",
    spotlightMetric: {
      label: "Programme delivery",
      value: "On time",
    },
    detail: {
      intro: [
        "Summer works programmes in schools require meticulous planning to complete complex upgrades within tight holiday windows.",
        "This review covers LED lighting upgrades, distribution board replacements, and fire alarm enhancements across six academy schools.",
      ],
      takeaways: [
        "Early site surveys during Easter allow comprehensive material ordering before summer.",
        "Phased handover enables partial occupation for summer schools and exam access.",
        "DBS-cleared teams essential even during holiday periods for safeguarding compliance.",
      ],
      spotlight: [
        { label: "Schools completed", value: "6" },
        { label: "Programme window", value: "6 weeks" },
        { label: "Budget variance", value: "+0.3%" },
      ],
      quote: {
        quote:
          "Every school was ready for September opening with no snagging items remaining. That is exactly what education clients need from summer works contractors.",
        author: "Estates Director",
        role: "Academies Enterprise Trust",
      },
    },
  },
  {
    id: "news-024",
    slug: "commercial-landlord-common-parts-upgrade-review",
    category: "reviews",
    categoryLabel: "Reviews",
    title:
      "Commercial Landlord Review: Multi-Tenanted Building Common Parts Upgrade",
    excerpt:
      "A property management company reviews the delivery of common parts electrical upgrades in an occupied commercial building.",
    description:
      "This review examines the coordination challenges of working in multi-tenanted commercial environments.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Commercial building lobby with upgraded lighting and access control",
    },
    author: {
      name: "Client Success Team",
      role: "Reviews Editor",
    },
    partnerLabel: "CBRE Property Management",
    readTime: "3 min read",
    tags: ["Reviews", "Commercial", "Property Management", "Upgrades"],
    isFeatured: false,
    publishedAt: "2026-03-13T10:00:00.000Z",
    updatedAt: "2026-03-18T11:30:00.000Z",
    spotlightMetric: {
      label: "Tenant complaints",
      value: "Zero",
    },
    detail: {
      intro: [
        "Common parts upgrades in occupied buildings require careful coordination to minimise tenant disruption and maintain building operations.",
        "This review covers reception, corridor, and car park electrical works in a 12-storey office building with 18 tenants.",
      ],
      takeaways: [
        "Advance tenant communication prevents complaints and sets appropriate expectations.",
        "Night and weekend working essential for high-impact lobby and reception works.",
        "Temporary lighting maintained throughout ensures safety and compliance.",
      ],
      spotlight: [
        { label: "Building floors", value: "12" },
        { label: "Tenants notified", value: "18" },
        { label: "Out-of-hours work", value: "85%" },
      ],
      quote: {
        quote:
          "Not a single tenant complaint throughout a complex three-month programme. That is exceptional performance in an occupied building.",
        author: "Senior Property Manager",
        role: "CBRE",
      },
    },
  },
];

export const newsSidebarCards: NewsSidebarCard[] = [
  {
    id: "sidebar-001",
    type: "campaign",
    eyebrow: "Net Zero Campaign",
    title: "Building Electrification Guide 2026",
    description:
      "Free download: Planning electrical infrastructure for heat pumps, EV charging, and solar PV integration.",
    ctaLabel: "Download Guide",
    href: "/news-hub/category/insights/future-proofing-electrical-infrastructure-electrification",
  },
  {
    id: "sidebar-002",
    type: "partner",
    eyebrow: "Partner Spotlight",
    title: "Schneider Electric Certified Team",
    description:
      "24 engineers certified on the latest switchgear and automation technologies through our manufacturer partnership.",
    ctaLabel: "Read More",
    href: "/news-hub/category/partners/manufacturer-partnership-schneider-electric-training",
  },
  {
    id: "sidebar-003",
    type: "review",
    eyebrow: "Client Review",
    title: "IHG Hotels: 3rd Contract Renewal",
    description:
      "98.5% PPM compliance across 8 hotel properties. Read why our hospitality clients keep coming back.",
    ctaLabel: "Read Review",
    href: "/news-hub/category/reviews/hotel-group-electrical-maintenance-contract-review",
  },
  {
    id: "sidebar-004",
    type: "social",
    eyebrow: "Case Study",
    title: "Hospital Theatre Upgrade: Zero Downtime",
    description:
      "How we upgraded 4 operating theatres while maintaining full clinical operations throughout.",
    ctaLabel: "View Case Study",
    href: "/news-hub/category/case-studies/private-hospital-theatre-electrical-upgrade",
  },
  {
    id: "sidebar-005",
    type: "campaign",
    eyebrow: "Regulations Update",
    title: "BS 7671 19th Edition Changes",
    description:
      "Essential updates on AFDDs, cable sizing, and prosumer installations. Stay compliant with the latest wiring regulations.",
    ctaLabel: "Read Insights",
    href: "/news-hub/category/insights/bs-7671-19th-edition-key-changes-contractors",
  },
  {
    id: "sidebar-006",
    type: "review",
    eyebrow: "Education Sector",
    title: "Academy Trust Summer Works Complete",
    description:
      "6 schools upgraded on time and on budget during the summer holiday window.",
    ctaLabel: "Read Review",
    href: "/news-hub/category/reviews/school-academy-trust-summer-works-review",
  },
];

export function isNewsCategorySlug(
  value: string,
): value is Exclude<NewsCategorySlug, "all"> {
  return newsCategories.some((category) => category.slug === value);
}

export function getNewsCategoryBySlug(slug: string): NewsCategory | undefined {
  return newsCategories.find((category) => category.slug === slug);
}

export function getNewsCategorySlugs(): Exclude<NewsCategorySlug, "all">[] {
  return newsCategories.map((category) => category.slug);
}

export function getNewsArticlesByCategory(
  category: NewsCategorySlug,
): NewsArticle[] {
  if (category === "all") {
    return allNewsArticles;
  }

  return allNewsArticles.filter((article) => article.category === category);
}

export function getFeaturedNewsArticleByCategory(
  category: NewsCategorySlug,
): NewsArticle | undefined {
  const scopedArticles = getNewsArticlesByCategory(category);

  return (
    scopedArticles.find((article) => article.isFeatured) ?? scopedArticles[0]
  );
}

export function getNewsArticleListItemsByCategory(
  category: NewsCategorySlug,
): NewsArticleListItem[] {
  return getNewsArticlesByCategory(category).map((article) => ({
    id: article.id,
    slug: article.slug,
    category: article.category,
    categoryLabel: article.categoryLabel,
    title: article.title,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    isFeatured: article.isFeatured,
    partnerLabel: article.partnerLabel,
    featuredImage: article.featuredImage,
  }));
}

export function getNewsArticleByCategoryAndSlug(
  categorySlug: string,
  articleSlug: string,
): NewsArticle | undefined {
  return allNewsArticles.find(
    (article) =>
      article.category === categorySlug && article.slug === articleSlug,
  );
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return allNewsArticles.find((article) => article.slug === slug);
}

export function getNewsArticleSlugsByCategory(
  categorySlug: Exclude<NewsCategorySlug, "all">,
): string[] {
  return allNewsArticles
    .filter((article) => article.category === categorySlug)
    .map((article) => article.slug);
}

export function getSidebarCardsByCategory(
  category: NewsCategorySlug,
): NewsSidebarCard[] {
  if (category === "all") {
    return newsSidebarCards;
  }

  const scoped = newsSidebarCards.filter((card) =>
    card.href.includes(`/${category}`),
  );
  return scoped.length > 0 ? scoped : newsSidebarCards.slice(0, 3);
}

export function getRelatedNewsArticles(
  article: NewsArticle,
  limit = 3,
): NewsArticle[] {
  return allNewsArticles
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        (candidate.category === article.category ||
          candidate.tags.some((tag) => article.tags.includes(tag))),
    )
    .slice(0, limit);
}
