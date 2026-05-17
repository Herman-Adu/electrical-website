import type {
  NewsArticle,
  NewsArticleListItem,
  NewsCategory,
  NewsCategorySlug,
  NewsHubMetricItem,
  NewsSidebarCard,
} from "@/types/news";
import { allProjects } from "@/data/projects";

export const newsCategories: NewsCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description:
      "Home electrification stories, smart living upgrades, and homeowner guidance.",
  },
  {
    slug: "commercial",
    label: "Commercial",
    description:
      "Commercial fit-outs, property management upgrades, and retail electrical work.",
  },
  {
    slug: "industrial",
    label: "Industrial",
    description:
      "Operational resilience, infrastructure rollouts, and industrial transformation updates.",
  },
  {
    slug: "community",
    label: "Community",
    description:
      "Education, healthcare, and public sector electrical projects making a local impact.",
  },
  {
    slug: "partners",
    label: "Partners",
    description:
      "Collaboration stories with developers, suppliers, and delivery partners. Strategic alliances and framework agreements that drive better outcomes, from design through to delivery.",
  },
  {
    slug: "case-studies",
    label: "Case Studies",
    description:
      "Outcome-led delivery breakdowns showing how complex electrical work performs in the real world. Each study documents real challenges, decisions, and measurable results.",
  },
  {
    slug: "insights",
    label: "Insights",
    description:
      "Market intelligence, design guidance, and strategic commentary from the field. Stay ahead of UK industry trends, compliance changes, and emerging technology with expert analysis.",
  },
  {
    slug: "reviews",
    label: "Reviews",
    description:
      "Client feedback, service highlights, and trust-building proof points. Hear from clients about the quality, reliability, and professionalism that defines every Nexgen project.",
  },
];

export const newsHubMetricItems: NewsHubMetricItem[] = [
  {
    id: "metric-001",
    title: "Live Channels",
    value: "8",
    description:
      "Residential, Commercial, Industrial, Community, Partners, Case Studies, Insights, and Reviews.",
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
    heroHeadline: ["Taplow", "Energy Refresh"],
    heroIndicators: [
      { icon: 'Home', title: 'Residential Work', description: 'Hands-on case study of a complete domestic energy refresh combining LED upgrade and smart controls.' },
      { icon: 'Gauge', title: 'Energy Saving', description: 'Significant reduction in annual energy consumption achieved through targeted LED and controls upgrade.' },
      { icon: 'ClipboardCheck', title: 'Part P Notified', description: 'All works notified and certified under Part P of the Building Regulations on completion.' },
      { icon: 'MapPin', title: 'Taplow Berks', description: 'Project based in Taplow, Berkshire — typical of Nexgen residential energy improvement programme.' },
    ] as const,
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
        "The homeowners needed a cleaner, more resilient electrical foundation before expanding into solar storage and EV charging. Their 1990s-built family home had served them well, but the original electrical installation was showing its age with limited circuit capacity, outdated consumer unit protection, and no provision for the smart home technologies they wanted to adopt.",
        "Instead of a disruptive full strip-out, the delivery plan layered board modernisation, smarter circuit zoning, and human-centric lighting upgrades across a controlled six-week programme. This phased approach meant the family could continue living in the property throughout, with careful scheduling around school runs and work-from-home requirements.",
      ],
      body: [
        "The original consumer unit dated from the property's construction and featured rewirable fuses with no RCD protection. While compliant at the time of installation, it fell significantly short of modern BS 7671 requirements and provided inadequate protection for a household increasingly dependent on electronic devices and planning to install high-power EV charging equipment.",
        "Our initial survey identified 23 circuits requiring attention, with several showing signs of thermal stress at terminations. The existing ring final circuits were overloaded with modern appliances never envisaged when the property was built. Kitchen circuits in particular were running at near-maximum capacity during peak cooking times.",
        "Working closely with the homeowners, we developed a comprehensive upgrade strategy that would not only address immediate safety concerns but establish a platform for future smart home integration, solar PV installation, and electric vehicle charging infrastructure.",
      ],
      scope: [
        "Complete consumer unit replacement with 19th Edition compliant split-load board featuring dual 63A RCDs and dedicated RCBO protection for critical circuits",
        "Installation of 14-zone Lutron RadioRA3 lighting control system with scene programming and circadian rhythm automation",
        "Dedicated 32A radial circuit with outdoor IP65 enclosure for future 7kW EV charger installation",
        "Kitchen circuit separation with individual RCBO protection for high-power appliances including induction hob and combination oven",
        "Home office power and data infrastructure upgrade with dedicated circuit and integrated surge protection",
        "Full EICR testing and certification with 5-year warranty on all installation works",
      ],
      methodology: [
        "Our approach centred on minimising disruption while maximising the value delivered in each work phase. We divided the project into three distinct stages: infrastructure upgrade (week 1-2), lighting control installation (week 3-4), and integration and commissioning (week 5-6).",
        "Each phase was carefully scheduled around the family's routine. Heavy infrastructure work including consumer unit changeover was completed during school hours, while aesthetic work like lighting dimmer installation happened in the evenings when the family could relocate to other rooms.",
        "We maintained temporary power throughout the consumer unit changeover using a portable distribution board, ensuring the family never lost power for more than 15 minutes during critical switchover periods.",
      ],
      challenges: [
        {
          title: "Limited Loft Access",
          description: "The property's converted loft space restricted cable routing options between floors, with minimal void space and extensive insulation blocking traditional routes.",
          solution: "We utilised existing conduit runs where possible and installed surface-mounted mini-trunking in concealed locations. For the lighting control backbone, we specified Lutron's wireless RadioRA3 system, eliminating the need for control wiring between floors entirely.",
        },
        {
          title: "Live Working Requirements",
          description: "The homeowners could not vacate the property during works, and several family members worked from home requiring uninterrupted power and internet connectivity.",
          solution: "We installed a temporary consumer unit running in parallel during the changeover period, with critical circuits (home office, networking equipment, refrigeration) transferred first. This dual-supply approach meant zero downtime for essential services.",
        },
        {
          title: "Heritage Ceiling Rose Compatibility",
          description: "The property featured original decorative ceiling roses that the homeowners wished to retain, but these were incompatible with modern LED dimming systems.",
          solution: "We sourced specialist LED retrofit lamps with trailing-edge dimming compatibility and installed matching Lutron Pico remote controls that could be placed anywhere without requiring ceiling rose modification.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Infrastructure Assessment & Planning",
          description: "Comprehensive survey of existing installation, maximum demand calculations, and detailed design work including DNO consultation for future EV charging capacity.",
          duration: "1 week",
        },
        {
          phase: "Phase 2",
          title: "Consumer Unit Replacement",
          description: "Removal of existing rewirable fuse board and installation of new 18-way split-load consumer unit with RCBO protection. Includes circuit testing and remedial works.",
          duration: "4 days",
        },
        {
          phase: "Phase 3",
          title: "Circuit Separation & New Runs",
          description: "Installation of dedicated kitchen circuits, home office radial, and EV charging infrastructure preparation including outdoor enclosure.",
          duration: "1 week",
        },
        {
          phase: "Phase 4",
          title: "Lighting Control System",
          description: "Installation of Lutron RadioRA3 processor, in-wall dimmers, and Pico remote controls. Scene programming and circadian rhythm configuration.",
          duration: "1 week",
        },
        {
          phase: "Phase 5",
          title: "Integration & Commissioning",
          description: "System integration, homeowner training, documentation preparation, and EICR certification. Includes 30-day follow-up support period.",
          duration: "1 week",
        },
      ],
      specifications: [
        {
          category: "Consumer Unit",
          items: [
            { label: "Manufacturer", value: "Hager" },
            { label: "Model", value: "VML955RK" },
            { label: "Ways", value: "18" },
            { label: "RCD Type", value: "Type A" },
            { label: "Main Switch", value: "100A" },
          ],
        },
        {
          category: "Lighting Control",
          items: [
            { label: "System", value: "Lutron RadioRA3" },
            { label: "Zones", value: "14" },
            { label: "Scenes", value: "24" },
            { label: "Integration", value: "Apple HomeKit" },
          ],
        },
        {
          category: "EV Infrastructure",
          items: [
            { label: "Circuit Rating", value: "32A" },
            { label: "Cable", value: "6mm Twin & Earth" },
            { label: "Enclosure", value: "IP65 Rated" },
            { label: "Charger Ready", value: "7.4kW" },
          ],
        },
      ],
      takeaways: [
        "Phased works reduced household disruption and protected critical evening routines throughout the six-week programme.",
        "Future EV infrastructure was integrated into the first-stage design, avoiding duplicated excavation and decoration costs later.",
        "The RadioRA3 lighting system delivered immediate comfort improvements while establishing a platform for future smart home expansion.",
        "Circuit separation eliminated nuisance tripping that had plagued the kitchen during high-load cooking periods.",
        "The final layout improved visibility, comfort, and provides usage analytics for long-term energy optimisation.",
      ],
      results: [
        "Energy monitoring installed during commissioning indicates projected annual savings of 28% compared to pre-upgrade consumption, primarily through intelligent lighting control and elimination of standby loads.",
        "The homeowners report significantly improved comfort, particularly appreciating the circadian lighting that automatically adjusts colour temperature throughout the day.",
        "Zero nuisance trips have occurred since installation, compared to an average of 2-3 per month with the previous installation.",
        "The property is now fully prepared for EV charger installation, with the homeowners planning to proceed within the next 12 months as they transition to an electric vehicle.",
      ],
      conclusion: [
        "This project demonstrates how a methodical, phased approach to residential electrical upgrades can deliver transformative improvements without the disruption typically associated with whole-house rewiring. By focusing on strategic infrastructure upgrades rather than wholesale replacement, we preserved the family's daily routines while establishing a modern, safe, and future-ready electrical installation.",
        "The integration of smart lighting control provided immediate quality-of-life benefits that the homeowners interact with daily, while the underlying infrastructure improvements deliver ongoing safety and efficiency benefits that will serve the property for decades to come.",
      ],
      spotlight: [
        { label: "Programme", value: "6 weeks" },
        { label: "Control Zones", value: "14" },
        { label: "Circuits Upgraded", value: "23" },
        { label: "Energy Savings", value: "28%" },
      ],
      quote: {
        quote:
          "We now have a house that feels simpler to live in, but far more capable behind the walls. The lighting scenes have genuinely changed how we use our home - the evening wind-down mode has become part of our family routine.",
        author: "Private Client",
        role: "Homeowner, Taplow",
      },
      additionalQuotes: [
        {
          quote: "The team worked around our schedules perfectly. With both of us working from home, we were dreading the disruption, but they made it completely manageable.",
          author: "Private Client",
          role: "Homeowner",
        },
      ],
      toc: [
        { id: "overview", label: "Project Overview", level: 1 },
        { id: "scope", label: "Project Scope", level: 1 },
        { id: "methodology", label: "Delivery Methodology", level: 1 },
        { id: "challenges", label: "Challenges & Solutions", level: 1 },
        { id: "timeline", label: "Programme Timeline", level: 1 },
        { id: "specifications", label: "Technical Specifications", level: 1 },
        { id: "results", label: "Results & Savings", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "conclusion", label: "Conclusion", level: 1 },
        { id: "testimonial", label: "Homeowner Feedback", level: 1 },
      ],
    },
  },
  {
    id: "news-005",
    slug: "why-ev-readiness-starts-at-the-board",
    category: "insights",
    categoryLabel: "Insights",
    title: "Why EV Readiness Starts at the Board, Not the Charger",
    heroHeadline: ["EV Readiness", "Starts Here"],
    heroIndicators: [
      { icon: 'Zap', title: 'EV Readiness', description: 'Why EV infrastructure decisions must begin at the distribution board, not the car park.' },
      { icon: 'Gauge', title: 'Load Assessment', description: 'Explains how to conduct a demand assessment before specifying EV charger quantities and types.' },
      { icon: 'Building2', title: 'For Developers', description: 'Essential reading for commercial developers and housing associations planning EV provision.' },
      { icon: 'ClipboardCheck', title: 'OZEV Aligned', description: 'Guidance aligned to OZEV requirements and Building Regulations Part S for EV infrastructure.' },
    ] as const,
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
        "Many EV discussions start with charger models and payment systems, but successful programmes usually start much earlier in the board strategy and spare capacity conversation. The charger is the visible end point; the electrical infrastructure behind it determines whether your EV rollout succeeds or stalls.",
        "Clients that assess incoming capacity, load diversity, and phased growth early are far better placed to scale without rework. Those who skip this step often find themselves facing expensive infrastructure upgrades after installing their first few chargers - exactly when budget pressure is highest.",
      ],
      body: [
        "The typical 7kW domestic charger draws 32 amps - equivalent to running two electric showers simultaneously. A single 22kW commercial charger demands 100 amps per phase. When clients ask us 'how many chargers can we install?', the answer always begins with 'what does your existing electrical supply look like?'",
        "We regularly encounter sites where enthusiasm for EV charging outpaces electrical reality. A recent commercial property wanted to install 20 chargers but had only 100 amps of spare capacity on their 200 amp supply. Without load management or DNO upgrade, they could actually support three chargers - or six with intelligent load balancing.",
        "The good news is that early planning can transform these conversations. Understanding your electrical starting point allows realistic phasing, identifies where load management can extend capability, and positions DNO upgrade requests early enough to avoid programme delays.",
      ],
      scope: [
        "Maximum demand assessment - Understanding what your site actually uses and when, versus theoretical capacity",
        "Spare capacity analysis - Calculating realistic headroom for EV charging after accounting for existing loads",
        "Load diversity planning - Identifying opportunities where EV charging can utilise periods of low demand",
        "Load management specification - Designing intelligent systems that share available capacity across multiple chargers",
        "DNO engagement strategy - Early consultation to identify upgrade requirements and typical timescales",
        "Phased rollout planning - Structuring installation to match available capacity while preparing for future growth",
      ],
      methodology: [
        "Our EV readiness assessments follow a structured hierarchy: supply capacity, distribution capacity, final circuit feasibility, and finally charger specification. This inverted approach ensures clients understand their constraints and opportunities before committing to specific hardware.",
        "We typically recommend a three-phase approach for commercial sites: Phase 1 establishes core infrastructure and proves demand with a limited charger deployment. Phase 2 expands within existing capacity using load management. Phase 3 triggers DNO upgrade if sustained demand justifies the investment.",
        "For residential and small commercial sites, we focus on future-proofing during any electrical work. Installing appropriate cable sizes and leaving space in distribution boards costs little during initial work but avoids expensive retrospective changes.",
      ],
      challenges: [
        {
          title: "Oversized Charger Expectations",
          description: "Clients often request the fastest possible chargers without understanding that their supply cannot support them, or that faster charging provides diminishing returns for typical dwell times.",
          solution: "We model actual usage patterns against charger specifications. A vehicle parked for 8 hours needs only 4kW to fully charge - installing 22kW chargers would waste capacity. Matching charger speed to dwell time optimises infrastructure investment.",
        },
        {
          title: "DNO Upgrade Timescales",
          description: "Distribution Network Operator upgrades can take 6-18 months from application to completion, catching clients by surprise when charger installation is ready but power supply is not.",
          solution: "We include DNO consultation in all EV planning work, flagging likely upgrade requirements and timescales early. This allows realistic programme planning and, where possible, identifying alternative supply strategies.",
        },
        {
          title: "Future Fleet Uncertainty",
          description: "Clients struggle to commit to infrastructure investment when their future EV requirements are uncertain, leading to analysis paralysis or inadequate initial installation.",
          solution: "We design for flexibility rather than specific endpoints. Installing oversized cables and switchgear during initial work creates capacity for future expansion at minimal incremental cost compared to retrofitting later.",
        },
      ],
      specifications: [
        {
          category: "Typical Charger Demands",
          items: [
            { label: "3.6kW Single Phase", value: "16A" },
            { label: "7.4kW Single Phase", value: "32A" },
            { label: "22kW Three Phase", value: "32A/phase" },
            { label: "50kW DC Fast", value: "80A/phase" },
          ],
        },
        {
          category: "Load Management Options",
          items: [
            { label: "Static Load Management", value: "Shared fixed limit" },
            { label: "Dynamic Load Management", value: "Real-time balancing" },
            { label: "Smart Charging", value: "Time-of-use optimisation" },
            { label: "V2G Capable", value: "Bi-directional flow" },
          ],
        },
        {
          category: "Planning Timescales",
          items: [
            { label: "Capacity Assessment", value: "1-2 weeks" },
            { label: "DNO Application", value: "2-4 weeks" },
            { label: "DNO Upgrade Works", value: "3-18 months" },
            { label: "Charger Installation", value: "1-4 weeks" },
          ],
        },
      ],
      takeaways: [
        "Board strategy determines what is realistically scalable. No amount of clever charger specification compensates for inadequate upstream infrastructure.",
        "Load planning avoids over-buying hardware that cannot be fully used. Matching charger capacity to actual dwell times optimises investment.",
        "Future-ready design protects programmes from avoidable second-stage disruption. Oversizing cables and switchgear during initial work is far cheaper than retrofitting.",
        "Dynamic load management can typically double effective charger deployment within existing supply constraints.",
        "DNO engagement should happen at planning stage, not installation stage. Upgrade timescales frequently exceed installation programmes.",
      ],
      results: [
        "Clients following our planning methodology typically achieve 40-60% more chargers within existing supply capacity through intelligent load management.",
        "Average programme delivery time reduced by 4 months compared to clients who encounter capacity constraints after starting installation.",
        "DNO upgrade costs avoided entirely on 70% of projects through proper capacity assessment and load management specification.",
        "Post-installation expansion costs reduced by average of 65% where future-proofing recommendations were followed during initial installation.",
      ],
      conclusion: [
        "EV charging infrastructure is fundamentally an electrical distribution challenge, not a hardware procurement exercise. The charger is the tip of the iceberg; the real complexity lies in the cables, switchgear, and supply capacity that feed it. Clients who understand this hierarchy make better decisions and achieve better outcomes.",
        "As fleet electrification accelerates across all sectors, the organisations that will adapt most smoothly are those investing in understanding their electrical infrastructure today. The time to assess capacity and plan upgrades is before the first charger is ordered, not after the tenth cannot be installed.",
      ],
      spotlight: [
        { label: "Typical Phases", value: "3" },
        { label: "Capacity Gain", value: "40-60%" },
        { label: "Time Saved", value: "4 months" },
        { label: "Cost Avoided", value: "65%" },
      ],
      quote: {
        quote:
          "We thought we needed 30 fast chargers, but the Nexgen assessment showed our supply could only support 8 without a major upgrade. Their load management design gave us 16 chargers immediately - more than enough for current demand - while we plan the supply upgrade for phase two.",
        author: "Fleet Operations Manager",
        role: "National Logistics Provider",
      },
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
    heroHeadline: ["BS 7671", "19th Edition"],
    heroIndicators: [
      { icon: 'BookOpen', title: '19th Edition', description: 'Key changes in BS 7671:2018 19th Edition every electrical contractor needs to understand.' },
      { icon: 'Shield', title: 'AFDD Rules', description: 'New requirements for arc fault detection devices in domestic and student accommodation premises.' },
      { icon: 'Zap', title: 'EV Charging', description: 'Part 7-722 EV charging location requirements now mandatory for new installations and alterations.' },
      { icon: 'ClipboardCheck', title: 'Compliance Date', description: 'Transition period guidance ensuring existing and new projects comply with correct edition.' },
    ] as const,
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
        "The 19th Edition of BS 7671 introduces significant changes to Arc Fault Detection, cable sizing, and prosumer installations that affect virtually every electrical contractor. With the transition period now ended, compliance with the new requirements is mandatory for all installations.",
        "This article highlights the changes most likely to affect day-to-day installation work and inspection practices, cutting through the technical documentation to focus on practical implications for working electricians.",
      ],
      body: [
        "The 19th Edition represents the most substantial revision of the wiring regulations since the 17th Edition introduced the new Part structure. While many changes are technical refinements, several have immediate practical implications that contractors must understand to remain compliant.",
        "Perhaps the most significant change for everyday work is the expansion of Arc Fault Detection Device (AFDD) recommendations. While not mandatory for all installations, the specific recommendations in Regulation 421.1.7 create a strong expectation that AFDDs will be fitted in certain locations - and insurance requirements may soon make them effectively mandatory.",
        "Cable sizing and installation methods have also been substantially revised. The reclassification of reference methods and new requirements for thermal insulation contact create immediate implications for cable selection and routing. Contractors who do not update their calculation methods risk non-compliant installations.",
      ],
      scope: [
        "Arc Fault Detection Device recommendations and practical implementation guidance",
        "Cable sizing changes including new reference methods and thermal considerations",
        "Prosumer installation requirements for solar PV and battery storage systems",
        "Changes to testing and verification requirements",
        "Updated maximum demand calculation methods",
        "New requirements for energy efficiency and monitoring",
      ],
      methodology: [
        "Our technical team has reviewed every change in the 19th Edition and classified them by practical impact. This article focuses on the 'high impact' changes that most contractors will encounter in their regular work, leaving the more esoteric technical changes for specialist reference.",
        "Each change is explained in terms of what you need to do differently, rather than simply describing what has changed. Where appropriate, we include worked examples showing compliant approaches to common installation scenarios.",
      ],
      challenges: [
        {
          title: "AFDD Retrofit Decisions",
          description: "Clients asking whether existing installations should be retrofitted with AFDDs, particularly in HMOs and premises with sleeping accommodation.",
          solution: "AFDDs are not retrospectively required, but risk assessment may identify premises where retrofit is advisable. We recommend prioritising HMO bedrooms, care home bedrooms, and premises with historic wiring where fault risk is elevated.",
        },
        {
          title: "Cable Sizing for Thermal Insulation",
          description: "New reference methods for cables in contact with thermal insulation create confusion about when derating factors apply and which method to use.",
          solution: "Reference method 100 applies where cables are completely surrounded by insulation. Reference method 102 applies for cables in contact with insulation on one side. Practical tip: avoid routing cables through insulation wherever possible.",
        },
        {
          title: "Prosumer Installation Complexity",
          description: "Combined solar PV, battery storage, and EV charging installations create complex scenarios not fully covered by previous regulations.",
          solution: "Section 722 (EV) and new Part 8 requirements must be considered together. Key focus: isolation arrangements that allow safe working on each system independently, and protection coordination across multiple sources.",
        },
      ],
      timeline: [
        {
          phase: "Key Change 1",
          title: "Arc Fault Detection (421.1.7)",
          description: "AFDDs now recommended for final circuits in locations with sleeping accommodation, particularly HMOs, care homes, and buildings with combustible construction.",
          duration: "Immediate",
        },
        {
          phase: "Key Change 2",
          title: "Cable Installation Methods",
          description: "Reclassified reference methods with new requirements for thermal insulation contact and updated current-carrying capacities.",
          duration: "Immediate",
        },
        {
          phase: "Key Change 3",
          title: "Prosumer Installations (Part 8)",
          description: "New section covering energy efficiency, local production, and storage including solar PV, battery storage, and vehicle-to-grid systems.",
          duration: "Immediate",
        },
        {
          phase: "Key Change 4",
          title: "Testing Requirements",
          description: "Updated testing protocols including new requirements for AFDD verification and prosumer system commissioning.",
          duration: "Immediate",
        },
        {
          phase: "Amendment 1",
          title: "Expected Corrections",
          description: "First amendment expected to address identified errors and clarifications. Monitor IET announcements for publication date.",
          duration: "2027",
        },
      ],
      specifications: [
        {
          category: "AFDD Requirements",
          items: [
            { label: "Recommended Locations", value: "Sleeping areas" },
            { label: "Maximum Rating", value: "40A" },
            { label: "Compatibility", value: "RCBOs" },
            { label: "Testing", value: "Functional test" },
          ],
        },
        {
          category: "Cable Changes",
          items: [
            { label: "New Reference Methods", value: "100, 101, 102, 103" },
            { label: "Insulation Contact", value: "Specific derating" },
            { label: "Grouping Factors", value: "Revised Table 4C1" },
            { label: "Ambient Temp", value: "Updated Table 4B1" },
          ],
        },
        {
          category: "Prosumer Systems",
          items: [
            { label: "New Part", value: "Part 8" },
            { label: "Solar PV", value: "Updated 712" },
            { label: "Battery Storage", value: "New Section 718" },
            { label: "V2G", value: "New requirements" },
          ],
        },
      ],
      takeaways: [
        "AFDDs are now recommended for specific locations including bedrooms in HMOs, care homes, and buildings with combustible construction - expect insurance requirements to follow.",
        "Cable installation methods have been reclassified with new reference methods for thermal insulation - update your calculation spreadsheets and software.",
        "Prosumer installations require enhanced isolation and grid export considerations under new Part 8 - combined system designs need careful protection coordination.",
        "Testing requirements have been updated to include AFDD functional testing and prosumer system commissioning verification.",
        "Amendment 1 is expected in 2027 - monitor IET announcements for clarifications on identified ambiguities.",
      ],
      results: [
        "Over 120 regulation changes affect practical installation work, with AFDD, cable sizing, and prosumer requirements having the highest day-to-day impact.",
        "The transition period has ended - all new installations and alterations must comply with 19th Edition requirements from the commencement date.",
        "Training providers report 40% increase in update course bookings as contractors seek to understand the practical implications of changes.",
        "AFDD sales have increased 300% since publication as contractors anticipate growing client and insurer expectations.",
      ],
      conclusion: [
        "The 19th Edition represents a significant evolution of the wiring regulations that every contractor must understand. While the core principles remain unchanged, the specific requirements for AFDDs, cable sizing, and prosumer installations create immediate implications for everyday work.",
        "Contractors who invest time in understanding these changes will find they are well-positioned as the industry adapts. Those who continue with 18th Edition practices risk non-compliant installations and potential liability exposure. The message is clear: update your knowledge, update your methods, and embrace the new requirements.",
      ],
      spotlight: [
        { label: "New Regulations", value: "120+" },
        { label: "Transition", value: "Ended" },
        { label: "Amendment 1", value: "2027" },
        { label: "AFDD Growth", value: "+300%" },
      ],
      quote: {
        quote:
          "The 19th Edition is not just a minor update - the AFDD recommendations and prosumer requirements represent a fundamental shift in how we approach certain installation types. Contractors who do not adapt will be left behind.",
        author: "Paul Richardson",
        role: "Technical Compliance Manager, NexGen Electrical",
      },
    },
  },
  {
    id: "news-018",
    slug: "future-proofing-electrical-infrastructure-electrification",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "Future-Proofing Electrical Infrastructure for Building Electrification",
    heroHeadline: ["Future-Proofing", "Electrification"],
    heroIndicators: [
      { icon: 'Lightbulb', title: 'Future-Proof', description: 'Strategic guide to specifying electrical infrastructure that accommodates electrification of heat and transport.' },
      { icon: 'Zap', title: 'Grid Demand', description: 'How building-level demand management and smart metering will reshape electrical design by 2030.' },
      { icon: 'Battery', title: 'Storage Ready', description: 'Wiring and switchgear specifications for battery storage and solar PV integration in commercial buildings.' },
      { icon: 'Gauge', title: 'Net Zero Path', description: 'Practical steps for aligning electrical infrastructure investment with net zero carbon commitments.' },
    ] as const,
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
        "Building electrification will increase typical peak electrical demand by 150-200% as gas heating and petrol vehicles are replaced with electric alternatives. The 2035 gas boiler ban and 2030 petrol car ban create a defined timeline for this transformation.",
        "Designing electrical infrastructure today that can accommodate these future loads avoids costly and disruptive upgrades later. Whether you are building new, renovating, or advising clients on future-proofing, understanding these demand implications is essential.",
      ],
      body: [
        "The typical UK home currently has peak electrical demand of 8-12kW, driven by cooking and heating appliances. Post-electrification, this same home will need to accommodate a heat pump (3-6kW), EV charger (7.4-22kW), and potentially battery storage (5-13.5kW) - more than doubling peak demand even with diversity.",
        "This transformation creates immediate implications for new-build specifications and retrofit planning. Properties designed today with standard 100A single-phase supplies may require expensive upgrades within 10-15 years. The cost of upgrading to three-phase or increased capacity during initial construction is a fraction of retrofit costs.",
        "For existing properties, strategic assessment can identify upgrade pathways that minimise disruption. Load management systems, battery storage, and smart tariffs can reduce the supply upgrade requirement, but proper assessment is needed to determine the right approach for each property.",
      ],
      scope: [
        "Future demand scenario modelling for residential and commercial properties",
        "Supply capacity assessment against electrification requirements",
        "Distribution board specification for future load accommodation",
        "Three-phase upgrade pathway planning and cost-benefit analysis",
        "Load management and demand response strategy development",
        "Integration planning for heat pumps, EV chargers, solar PV, and battery storage",
      ],
      methodology: [
        "Our future-proofing methodology begins with scenario analysis rather than current demand calculation. We model the fully-electrified property - heat pump, EV, solar PV, battery storage - and work backwards to determine what infrastructure is needed today to accommodate that future state.",
        "For new builds, this analysis informs specification decisions that add minimal cost during construction but avoid expensive retrofits later. For existing properties, we develop phased upgrade pathways that can be implemented as electrification technologies are adopted.",
        "Critical to this analysis is understanding diversity. While individual loads may be large, they rarely all operate at full capacity simultaneously. Smart charging, load management, and battery storage can significantly reduce the required supply capacity.",
      ],
      challenges: [
        {
          title: "DNO Supply Limitations",
          description: "Many existing streets have limited spare capacity on the local distribution network, with DNO upgrades potentially taking years and costing thousands.",
          solution: "Load management systems can defer or prevent DNO upgrade requirements by ensuring total demand stays within supply capacity. Battery storage with grid limiting can provide additional flexibility for high-demand periods.",
        },
        {
          title: "Cost of Three-Phase Retrofit",
          description: "Upgrading from single-phase to three-phase supply typically costs £3,000-8,000 for the DNO connection, plus internal distribution changes.",
          solution: "For many properties, intelligent load management with single-phase supply is more cost-effective than three-phase upgrade. We assess the break-even point for each property based on planned electrification timeline and load profile.",
        },
        {
          title: "Uncertainty in Technology Evolution",
          description: "Heat pump efficiency, EV charging speeds, and battery technology continue to evolve, making future demand predictions uncertain.",
          solution: "We design for flexibility rather than specific technologies. Adequate supply capacity, sufficient distribution board ways, and appropriate cable routes accommodate multiple technology evolution pathways.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Current State Assessment",
          description: "Survey existing electrical infrastructure including supply capacity, distribution board condition, and cable routes.",
          duration: "1-2 days",
        },
        {
          phase: "Phase 2",
          title: "Future Demand Modelling",
          description: "Model fully-electrified demand scenario based on property type, anticipated heat pump, EV, and renewable installations.",
          duration: "1 week",
        },
        {
          phase: "Phase 3",
          title: "Gap Analysis",
          description: "Compare current capacity against future requirements to identify upgrade needs and timing.",
          duration: "2-3 days",
        },
        {
          phase: "Phase 4",
          title: "Pathway Development",
          description: "Develop phased upgrade pathway with cost estimates and decision points aligned with technology adoption timeline.",
          duration: "1 week",
        },
        {
          phase: "Phase 5",
          title: "Implementation Support",
          description: "Detailed specifications for each upgrade phase, ready for implementation as electrification proceeds.",
          duration: "Ongoing",
        },
      ],
      specifications: [
        {
          category: "Typical Loads",
          items: [
            { label: "Air Source Heat Pump", value: "3-6kW" },
            { label: "Ground Source HP", value: "4-8kW" },
            { label: "EV Charger (Home)", value: "7.4kW" },
            { label: "EV Charger (Fast)", value: "22kW" },
          ],
        },
        {
          category: "Storage Systems",
          items: [
            { label: "Battery (Standard)", value: "5-10kWh" },
            { label: "Battery (Large)", value: "10-15kWh" },
            { label: "Discharge Rate", value: "3-5kW" },
            { label: "Charge Rate", value: "3-7kW" },
          ],
        },
        {
          category: "Supply Options",
          items: [
            { label: "Single Phase (Max)", value: "100A (23kW)" },
            { label: "Three Phase", value: "100A (69kW)" },
            { label: "DNO Upgrade Lead", value: "8-16 weeks" },
            { label: "Load Management", value: "Up to 50% reduction" },
          ],
        },
      ],
      takeaways: [
        "Incoming supply capacity should be assessed against future maximum demand scenarios - a 100A single-phase supply may be inadequate for full electrification.",
        "Spare ways in distribution boards should accommodate heat pump, EV, and battery storage circuits - specify larger enclosures in new builds.",
        "Three-phase supplies increasingly necessary for properties with multiple electrification loads, but load management can defer this requirement.",
        "Cable routes to garages, driveways, and plant locations should be planned during construction even if not immediately used.",
        "Smart tariffs and battery storage can reduce peak demand significantly, lowering the required supply capacity.",
      ],
      results: [
        "Properties designed with future electrification in mind typically require 15-20% higher initial electrical investment but avoid 300-500% higher retrofit costs.",
        "Load management systems can reduce effective peak demand by 30-50%, often eliminating the need for supply upgrades.",
        "Three-phase supplies add approximately £2,000-4,000 to new-build costs but can save £10,000+ compared to retrofit.",
        "Strategic planning enables phased investment aligned with technology adoption rather than expensive all-at-once upgrades.",
      ],
      conclusion: [
        "Building electrification is not a future possibility - it is a defined pathway with legislative deadlines. Properties designed or renovated today will serve for 30-50 years, well beyond the transition to electric heating and transport. Failing to plan for this transition creates future expense and disruption.",
        "The good news is that future-proofing need not be expensive. Strategic decisions about supply capacity, distribution board sizing, and cable routes add modest cost during initial construction but provide enormous flexibility for future electrification. The key is considering these requirements during design rather than as retrofit afterthoughts.",
      ],
      spotlight: [
        { label: "Heat Pump", value: "3-6kW" },
        { label: "EV Charger", value: "7.4-22kW" },
        { label: "Battery", value: "5-13.5kW" },
        { label: "Demand Increase", value: "150-200%" },
      ],
      quote: {
        quote:
          "Every new home we design now includes capacity for full electrification. The cost difference is minimal during construction, but the flexibility it provides is invaluable. In 10 years, people will thank us for thinking ahead.",
        author: "Dr. Sarah Mitchell",
        role: "Decarbonisation Strategy Lead, NexGen Electrical",
      },
    },
  },
  {
    id: "news-019",
    slug: "electrical-contractor-insurance-requirements-guide",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "Electrical Contractor Insurance: Understanding Coverage Requirements",
    heroHeadline: ["Contractor", "Insurance Guide"],
    heroIndicators: [
      { icon: 'Shield', title: 'Insurance Guide', description: 'Essential insurance coverage every electrical contractor must carry to protect clients and business.' },
      { icon: 'ClipboardCheck', title: 'Public Liability', description: 'Minimum 5M public liability insurance required for commercial and public sector contracts.' },
      { icon: 'Award', title: 'Nexgen Covered', description: 'Nexgen carries comprehensive cover including professional indemnity, public liability and employers liability.' },
      { icon: 'Users', title: 'Client Assurance', description: 'How to verify contractor insurance certificates and what to look for in certificates of currency.' },
    ] as const,
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
        "Adequate insurance coverage is essential for winning contracts and protecting your business from potentially devastating claims. A single uninsured incident can bankrupt an otherwise successful electrical contracting business.",
        "This guide explains the different policy types and typical coverage levels required by different client types, helping contractors optimise their coverage for their target markets while avoiding costly over-insurance.",
      ],
      body: [
        "Electrical contracting carries inherent risks that make appropriate insurance coverage non-negotiable. Fire damage from faulty wiring, injury from electrical contact, and business interruption claims can easily reach six or seven figures. Without adequate coverage, these claims would be personal liabilities for business owners.",
        "Beyond protection, insurance coverage is increasingly a commercial necessity. Main contractors, facilities managers, and commercial clients routinely require minimum coverage levels as a condition of tendering. Contractors without appropriate coverage simply cannot compete for much commercial work.",
        "Understanding the different policy types and their purposes helps contractors build a coverage portfolio that protects against genuine risks while avoiding unnecessary cost. The key policies are public liability, employer liability, professional indemnity, and contract works insurance.",
      ],
      scope: [
        "Public liability insurance - third party injury and property damage coverage",
        "Employer liability insurance - mandatory employee injury protection",
        "Professional indemnity insurance - design and specification advice coverage",
        "Contract works insurance - materials and work in progress protection",
        "Tools and equipment insurance - van and tool theft coverage",
        "Business interruption insurance - income protection during disruption",
      ],
      methodology: [
        "Our insurance guidance is based on analysis of typical client requirements across different market sectors, combined with claims experience that identifies where coverage is most likely to be needed. We recommend coverage levels that meet client requirements while avoiding over-insurance.",
        "The key principle is matching coverage to your actual business activities. A contractor doing only domestic work has different needs to one pursuing commercial contracts. Similarly, contractors who provide design services need professional indemnity that others may not require.",
      ],
      challenges: [
        {
          title: "Balancing Cost and Coverage",
          description: "Insurance premiums represent a significant overhead, and over-insurance wastes money that could be invested in the business.",
          solution: "Match coverage levels to your target market requirements. Domestic-focused contractors may need only £2m public liability, while commercial contractors typically need £5-10m. Only pay for higher limits when you need them to win work.",
        },
        {
          title: "Understanding Exclusions",
          description: "Standard policies contain exclusions that may leave contractors exposed for common activities, particularly regarding design responsibility and hot works.",
          solution: "Review policy exclusions carefully before purchase. Ensure design activities are covered if you specify equipment or provide recommendations. Add hot works extensions if you undertake soldering or other activities that generate heat.",
        },
        {
          title: "Professional Indemnity Decisions",
          description: "PI insurance is expensive, but increasingly required by clients who hold contractors responsible for specification advice and design decisions.",
          solution: "If you provide any specification advice, equipment recommendations, or design services, PI coverage is essential. The threshold is lower than many contractors realise - recommending a consumer unit brand or cable type can create design liability.",
        },
      ],
      timeline: [
        {
          phase: "Policy 1",
          title: "Public Liability",
          description: "Covers injury to third parties and damage to third party property. Essential for all contractors with minimum £2m cover.",
          duration: "Required",
        },
        {
          phase: "Policy 2",
          title: "Employer Liability",
          description: "Mandatory for all employers with minimum £5m cover (most policies provide £10m). Covers employee injury and illness claims.",
          duration: "Mandatory",
        },
        {
          phase: "Policy 3",
          title: "Professional Indemnity",
          description: "Covers claims arising from advice, design, or specification errors. Essential if you provide any technical recommendations.",
          duration: "Recommended",
        },
        {
          phase: "Policy 4",
          title: "Contract Works",
          description: "Covers materials, equipment, and work in progress against theft, damage, and vandalism until project completion.",
          duration: "Project-based",
        },
        {
          phase: "Policy 5",
          title: "Tools & Equipment",
          description: "Covers tools, test equipment, and van contents against theft. Often available as policy extension.",
          duration: "Recommended",
        },
      ],
      specifications: [
        {
          category: "Domestic Market",
          items: [
            { label: "Public Liability", value: "£2m min" },
            { label: "Employer Liability", value: "£10m" },
            { label: "Professional Indemnity", value: "Optional" },
            { label: "Tools Cover", value: "£10-20k" },
          ],
        },
        {
          category: "Commercial Market",
          items: [
            { label: "Public Liability", value: "£5-10m" },
            { label: "Employer Liability", value: "£10m" },
            { label: "Professional Indemnity", value: "£250k-1m" },
            { label: "Contract Works", value: "Project value" },
          ],
        },
        {
          category: "Industrial/HV",
          items: [
            { label: "Public Liability", value: "£10m+" },
            { label: "Employer Liability", value: "£10m" },
            { label: "Professional Indemnity", value: "£1m+" },
            { label: "Pollution Cover", value: "Required" },
          ],
        },
      ],
      takeaways: [
        "Public liability cover of £5m increasingly required for commercial contracts - £2m may be adequate for domestic-only work.",
        "Professional indemnity essential for design responsibility or specification advice - the threshold is lower than many contractors realise.",
        "Employer liability is mandatory with minimum £5m cover for all employers - most policies provide £10m as standard.",
        "Contract works insurance protects materials and work in progress - essential for larger projects with significant value on site.",
        "Review policy exclusions carefully - standard policies may not cover hot works, design activities, or specific industry sectors.",
      ],
      results: [
        "Contractors with appropriate coverage can tender for 40% more opportunities than those with basic domestic-level policies.",
        "Average insurance cost for well-structured coverage is 2-3% of turnover - a manageable overhead for the protection provided.",
        "Professional indemnity claims have increased 25% over 5 years as clients become more willing to pursue contractors for specification issues.",
        "Tool theft claims average £8,000 - adequate equipment cover pays for itself with a single claim.",
      ],
      conclusion: [
        "Insurance is not an optional expense - it is essential protection for your business and a commercial requirement for much of the work available to electrical contractors. The key is structuring coverage appropriately for your business activities and target markets.",
        "Review your coverage annually as your business evolves. Coverage appropriate when you started may be inadequate as you take on larger projects or move into new sectors. Conversely, you may be paying for coverage levels that exceed your actual requirements. A good insurance broker specialising in construction trades can help optimise your coverage portfolio.",
      ],
      spotlight: [
        { label: "Public Liability", value: "£5-10m" },
        { label: "PI Cover", value: "£250k-1m" },
        { label: "Employer Liability", value: "£10m" },
        { label: "Cost (% Turnover)", value: "2-3%" },
      ],
      quote: {
        quote:
          "I see contractors lose contracts every week because their insurance does not meet requirements. The premium difference between £2m and £5m public liability is often only a few hundred pounds, but it can be the difference between winning and losing a £50,000 contract.",
        author: "Jennifer Adams",
        role: "Business Development Manager, NexGen Electrical",
      },
    },
  },
];

export const newsSidebarCards: NewsSidebarCard[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBAL CARDS (shown on main hub and all categories)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-001",
    type: "campaign",
    eyebrow: "Net Zero Campaign",
    title: "Building Electrification Guide 2026",
    description:
      "Free download: Planning electrical infrastructure for heat pumps, EV charging, and solar PV integration.",
    ctaLabel: "Download Guide",
    href: "/news-hub/category/insights/future-proofing-electrical-infrastructure-electrification",
    targetCategories: [], // Empty = shows on all pages
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
    targetCategories: [], // Global
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
    targetCategories: [], // Global
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-res-001",
    type: "campaign",
    eyebrow: "Residential Campaign",
    title: "Home Electrification Assessment",
    description:
      "Free assessment for homeowners planning heat pump, EV charger, or solar PV installation. Future-proof your home.",
    ctaLabel: "Book Assessment",
    href: "/contact?service=residential-assessment",
    targetCategories: ["residential"],
  },
  {
    id: "sidebar-res-002",
    type: "social",
    eyebrow: "Customer Story",
    title: "Taplow Whole-Home Upgrade",
    description:
      "See how we transformed a 1960s property with LED lighting, smart controls, and EV charging infrastructure.",
    ctaLabel: "View Project",
    href: "/news-hub/category/residential/taplow-residential-energy-refresh",
    targetCategories: ["residential"],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // INDUSTRIAL CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-ind-001",
    type: "campaign",
    eyebrow: "Industrial Solutions",
    title: "Switchgear Health Check",
    description:
      "Comprehensive assessment of your HV/LV switchgear condition with thermal imaging and partial discharge testing.",
    ctaLabel: "Request Survey",
    href: "/contact?service=switchgear-survey",
    targetCategories: ["industrial"],
  },
  {
    id: "sidebar-ind-002",
    type: "partner",
    eyebrow: "Technical Whitepaper",
    title: "Real-Time Monitoring ROI",
    description:
      "Download our analysis of monitoring system payback periods across different industrial facility types.",
    ctaLabel: "Download PDF",
    href: "/news-hub/category/industrial/docklands-switchgear-monitoring-upgrade",
    targetCategories: ["industrial"],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // PARTNERS CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-part-001",
    type: "campaign",
    eyebrow: "Partner Programme",
    title: "Become a Framework Partner",
    description:
      "Developers, contractors, and facilities managers - explore our framework partnership opportunities.",
    ctaLabel: "Learn More",
    href: "/contact?service=partnership-enquiry",
    targetCategories: ["partners"],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // CASE STUDIES CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-cs-001",
    type: "social",
    eyebrow: "Case Study",
    title: "Hospital Theatre Upgrade: Zero Downtime",
    description:
      "How we upgraded 4 operating theatres while maintaining full clinical operations throughout.",
    ctaLabel: "View Case Study",
    href: "/news-hub/category/case-studies/private-hospital-theatre-electrical-upgrade",
    targetCategories: ["case-studies"],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // INSIGHTS CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-ins-001",
    type: "campaign",
    eyebrow: "Regulations Update",
    title: "BS 7671 19th Edition Changes",
    description:
      "Essential updates on AFDDs, cable sizing, and prosumer installations. Stay compliant with the latest wiring regulations.",
    ctaLabel: "Read Insights",
    href: "/news-hub/category/insights/bs-7671-19th-edition-key-changes-contractors",
    targetCategories: ["insights"],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEWS CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sidebar-rev-001",
    type: "review",
    eyebrow: "Education Sector",
    title: "Academy Trust Summer Works Complete",
    description:
      "6 schools upgraded on time and on budget during the summer holiday window.",
    ctaLabel: "Read Review",
    href: "/news-hub/category/reviews/school-academy-trust-summer-works-review",
    targetCategories: ["reviews"],
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

function isContentLinkValid(href: string): boolean {
  // News article link — validate slug exists
  const newsMatch = href.match(/^\/news-hub\/category\/[^/]+\/([^/?#]+)/);
  if (newsMatch) {
    return allNewsArticles.some((a) => a.slug === newsMatch[1]);
  }
  // Project link — validate slug exists
  const projMatch = href.match(/^\/projects\/category\/[^/]+\/([^/?#]+)/);
  if (projMatch) {
    return allProjects.some((p) => p.slug === projMatch[1]);
  }
  // Contact, services, about, external — always valid
  return true;
}

export function getSidebarCardsByCategory(
  category: NewsCategorySlug,
): NewsSidebarCard[] {
  // Global cards (empty targetCategories) show everywhere
  const globalCards = newsSidebarCards.filter(
    (card) => (!card.targetCategories || card.targetCategories.length === 0) && isContentLinkValid(card.href),
  );

  if (category === "all") {
    return globalCards;
  }

  // Category-specific cards
  const categoryCards = newsSidebarCards.filter(
    (card) =>
      card.targetCategories &&
      card.targetCategories.length > 0 &&
      card.targetCategories.includes(category) &&
      isContentLinkValid(card.href),
  );

  // Return category-specific cards first, then fill with global cards (max 4 total)
  const combined = [...categoryCards, ...globalCards];
  return combined.slice(0, 4);
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

export { newsHubIntroData } from './news-hub-intro';
export { newsCategoriesIntroData } from './categories-intro';
export { newsCategoryIntroData } from './category-intro';
export { newsCategoryColors } from "./category-colors";
