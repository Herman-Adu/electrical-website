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
        "Month-one reporting focused on whether the new monitoring layer produced operational clarity quickly enough to justify the rollout investment. The Docklands facility operates 24/7 with critical logistics operations that cannot tolerate unplanned power interruptions, making real-time visibility essential rather than optional.",
        "The answer was decisive: facilities leads could spot anomalies earlier, capture better evidence, and coordinate maintenance windows without guesswork. Within the first four weeks, the system had already prevented two potential incidents that would have previously gone undetected until failure occurred.",
      ],
      body: [
        "The existing switchgear installation dated from 2008 and while mechanically sound, offered no remote monitoring capability. The facilities team relied entirely on periodic thermal imaging surveys and reactive callouts when issues became apparent. This approach had resulted in three unplanned outages in the previous 18 months, each causing significant operational disruption.",
        "Our monitoring retrofit programme installed current transformers, power quality analysers, and thermal sensors across 120 measurement points spanning the main switchgear, distribution boards, and critical final circuits. All data feeds into a cloud-based platform providing real-time dashboards, automated alerting, and historical trend analysis.",
        "The implementation was completed over four weekends to minimise operational impact, with each switchgear section energised and monitored progressively. This phased approach allowed the team to refine alert thresholds based on actual load profiles before the full system went live.",
      ],
      scope: [
        "Installation of 120+ monitoring points across LV switchgear, distribution boards, and critical circuits",
        "Cloud-based monitoring platform with mobile app access for facilities team",
        "Three-tier alert system with escalation protocols to on-call engineers",
        "Power quality analysis including harmonics, voltage stability, and power factor monitoring",
        "Thermal monitoring at all main breaker connections and bus-bar joints",
        "Integration with existing BMS for consolidated facilities dashboard",
        "Automated monthly reporting for insurance and compliance documentation",
      ],
      methodology: [
        "Our monitoring strategy focused on providing actionable intelligence rather than data overload. We worked with the facilities team to identify their key concerns: unexpected load growth, thermal anomalies, and power quality issues affecting sensitive equipment. Each monitoring point was selected to address these specific concerns.",
        "The three-tier alert system was calibrated over the first two weeks of operation. Tier 1 alerts (informational) capture events for trend analysis. Tier 2 alerts (attention required) notify the on-site team during working hours. Tier 3 alerts (critical) trigger immediate escalation to on-call engineers regardless of time.",
        "Weekly review sessions during the first month allowed continuous refinement of alert thresholds, eliminating nuisance notifications while ensuring genuine issues received appropriate attention.",
      ],
      challenges: [
        {
          title: "Legacy Switchgear Integration",
          description: "The 2008-era switchgear panels had no provision for retrofit monitoring equipment, with limited space within enclosures and no existing CT mounting points.",
          solution: "We designed custom CT brackets that mount externally to the switchgear, with cables routed through existing cable entry points. This approach avoided any modification to type-tested assemblies while achieving comprehensive monitoring coverage.",
        },
        {
          title: "Network Security Requirements",
          description: "The client's IT security policy prohibited direct cloud connectivity from operational technology equipment, requiring an air-gapped solution.",
          solution: "We deployed an on-premise data concentrator that aggregates all monitoring data locally before encrypted transmission to the cloud platform via a dedicated, firewalled connection approved by the client's IT security team.",
        },
        {
          title: "Alert Fatigue Prevention",
          description: "Initial deployment generated excessive alerts as thresholds were set conservatively, risking the facilities team ignoring notifications.",
          solution: "A two-week calibration period with daily threshold reviews reduced alert volume by 85% while maintaining sensitivity to genuine anomalies. The team now receives an average of 2-3 actionable alerts per week rather than 20+ nuisance notifications.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Survey & Design",
          description: "Comprehensive survey of existing switchgear, identification of monitoring points, and detailed design including network architecture and integration requirements.",
          duration: "2 weeks",
        },
        {
          phase: "Phase 2",
          title: "Weekend Installation",
          description: "Installation of monitoring equipment across four weekends, with each switchgear section completed and commissioned progressively.",
          duration: "4 weekends",
        },
        {
          phase: "Phase 3",
          title: "Calibration & Training",
          description: "Two-week calibration period with daily threshold reviews, followed by comprehensive training for facilities team on platform usage and alert response.",
          duration: "3 weeks",
        },
        {
          phase: "Phase 4",
          title: "Operational Handover",
          description: "Final documentation, establishment of monthly reporting cadence, and handover to ongoing support arrangement.",
          duration: "1 week",
        },
      ],
      specifications: [
        {
          category: "Monitoring Platform",
          items: [
            { label: "Provider", value: "Schneider EcoStruxure" },
            { label: "Data Points", value: "120+" },
            { label: "Sample Rate", value: "1 second" },
            { label: "Storage", value: "3 years" },
          ],
        },
        {
          category: "Power Quality",
          items: [
            { label: "THD Monitoring", value: "Up to 50th harmonic" },
            { label: "Voltage Accuracy", value: "0.5% class" },
            { label: "Current Accuracy", value: "1% class" },
            { label: "PF Monitoring", value: "Per phase" },
          ],
        },
        {
          category: "Thermal Monitoring",
          items: [
            { label: "Sensor Type", value: "Wireless RTD" },
            { label: "Accuracy", value: "1 degree C" },
            { label: "Alert Threshold", value: "Configurable" },
            { label: "Battery Life", value: "10 years" },
          ],
        },
      ],
      takeaways: [
        "Alarm prioritisation with three-tier escalation reduced triage noise for the on-site team while ensuring critical issues receive immediate attention.",
        "Load pattern insight surfaced avoidable demand peaks across shift changes, identifying opportunities for load scheduling optimisation.",
        "Monthly handover reporting became clearer for leadership and insurers, with automated documentation replacing manual spreadsheet compilation.",
        "Thermal monitoring detected a developing connection issue in week three that would likely have resulted in failure within 2-3 months.",
        "Power quality analysis revealed harmonic distortion from VFD installations that is now being addressed in planned maintenance.",
      ],
      results: [
        "Zero unplanned outages in the first month of operation, compared to an average of one every six months previously.",
        "Facilities team response time to anomalies reduced from hours (or days for undetected issues) to minutes.",
        "Insurance renewal premium reduced by 8% based on improved risk visibility and documented maintenance regime.",
        "Identified 12% potential energy savings through load scheduling optimisation opportunities revealed by monitoring data.",
        "Maintenance planning shifted from reactive to predictive, with the first thermal anomaly detected and resolved before failure occurred.",
      ],
      conclusion: [
        "The Docklands monitoring retrofit demonstrates that legacy electrical installations can be transformed into intelligent, connected assets without wholesale replacement. The investment in monitoring technology is already paying dividends through prevented failures, reduced insurance costs, and optimised maintenance planning.",
        "For facilities managers operating critical infrastructure, the question is no longer whether to implement monitoring but how quickly it can be deployed. The visibility provided by modern monitoring platforms transforms electrical infrastructure from a hidden risk into a managed asset.",
      ],
      spotlight: [
        { label: "Sensors Live", value: "120+" },
        { label: "Alert Tiers", value: "3" },
        { label: "Response Time", value: "< 5 mins" },
        { label: "Uptime", value: "100%" },
      ],
      quote: {
        quote:
          "For the first time, I can see exactly what's happening across our entire electrical infrastructure from my phone. Last week, I spotted a developing issue at 2am and had an engineer on site before the morning shift even knew there was a problem.",
        author: "Facilities Director",
        role: "Docklands Logistics Hub",
      },
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
        "The programme team chose to align electrical, builder, and supplier decisions earlier than usual, using shared milestones and clearer package boundaries. BuildWest Group's Reading mixed-use development presented the perfect opportunity to test this collaborative approach on a complex scheme combining retail, residential, and commercial spaces.",
        "That decision paid off in fewer access clashes, stronger procurement sequencing, and better expectations for client reporting. What began as an experiment in closer collaboration has now become the template for how we approach all major development partnerships.",
      ],
      body: [
        "Mixed-use developments present unique electrical coordination challenges. Different occupancy types have conflicting requirements: retail needs high-capacity single-phase supplies with extensive emergency lighting, residential requires individual metering and EV charging provisions, while commercial spaces demand flexible power and data infrastructure. Traditionally, these competing requirements are resolved reactively, leading to costly redesign and programme delays.",
        "BuildWest approached us at RIBA Stage 2, significantly earlier than typical electrical contractor engagement. This early involvement allowed us to influence core design decisions that would have been expensive or impossible to change later - riser locations, main intake positioning, and basement plant room allocation.",
        "The result was a coordinated design that eliminated the usual conflicts between building services disciplines and established clear responsibility boundaries from the outset. Every interface was documented, every handover point agreed, and every long-lead item identified before ground was broken.",
      ],
      scope: [
        "Electrical infrastructure design from Stage 2 through to completion across 47,000 sq ft mixed-use development",
        "Coordination with mechanical, public health, and fire engineering disciplines through BIM Level 2 processes",
        "Procurement strategy development including supplier pre-qualification and long-lead item scheduling",
        "Installation delivery across retail (12 units), residential (64 apartments), and commercial (4 floors) occupancies",
        "Commissioning coordination with building management systems and landlord services",
        "Handover documentation and training for facilities management team",
      ],
      methodology: [
        "Our collaborative approach centred on three principles: early engagement, transparent planning, and shared accountability. We attended all design team meetings from Stage 2 onwards, contributing electrical expertise to architectural and structural decisions rather than reacting to them afterwards.",
        "Fortnightly coordination sessions brought together all five core stakeholder teams: client representatives, architects, main contractor, M&E consultants, and key suppliers. These sessions used a standardised agenda focusing on upcoming milestones, interface resolution, and programme risk review.",
        "A shared digital platform provided real-time visibility of design progress, RFI status, procurement tracking, and installation progress. This transparency eliminated the information asymmetry that typically causes coordination failures on complex projects.",
      ],
      challenges: [
        {
          title: "Conflicting Service Routes",
          description: "Initial architectural layouts created service route conflicts between retail ventilation requirements and residential electrical risers, with both disciplines claiming the same ceiling void space.",
          solution: "Early BIM clash detection identified the conflict at Stage 3, allowing architectural revision before construction began. The final design relocated the retail ventilation to a dedicated service corridor, maintaining optimal riser positions for electrical distribution.",
        },
        {
          title: "Long-Lead Switchgear Procurement",
          description: "The specified LV switchgear had a 16-week lead time that threatened to delay the programme if ordered at traditional procurement milestones.",
          solution: "Early supplier engagement and design freeze commitment allowed switchgear ordering at Stage 4, six weeks before traditional timing. The panels arrived on site two weeks before required, providing programme float rather than critical path pressure.",
        },
        {
          title: "Multi-Occupancy Metering Strategy",
          description: "The development required separate metering for 64 residential units, 12 retail units, 4 commercial floors, and landlord services, creating complex DNO coordination requirements.",
          solution: "We developed a comprehensive metering strategy document at Stage 3 and engaged with the DNO early. This proactive approach secured network capacity confirmation and meter point references six months before typical timelines.",
        },
      ],
      timeline: [
        {
          phase: "Stage 2-3",
          title: "Early Design Engagement",
          description: "Participation in design team meetings, electrical strategy development, and coordination framework establishment with all stakeholder teams.",
          duration: "4 months",
        },
        {
          phase: "Stage 4",
          title: "Technical Design & Procurement",
          description: "Detailed electrical design, BIM model development, clash resolution, and early procurement of long-lead items.",
          duration: "3 months",
        },
        {
          phase: "Stage 5a",
          title: "Basement & Risers",
          description: "Main intake installation, LV switchgear commissioning, and vertical distribution infrastructure across all risers.",
          duration: "4 months",
        },
        {
          phase: "Stage 5b",
          title: "Floor-by-Floor Installation",
          description: "Progressive installation across retail, residential, and commercial floors following main contractor programme.",
          duration: "8 months",
        },
        {
          phase: "Stage 6",
          title: "Commissioning & Handover",
          description: "Integrated commissioning with BMS, testing and certification, and comprehensive handover to facilities management.",
          duration: "2 months",
        },
      ],
      specifications: [
        {
          category: "Project Scale",
          items: [
            { label: "Total Area", value: "47,000 sq ft" },
            { label: "Residential Units", value: "64" },
            { label: "Retail Units", value: "12" },
            { label: "Commercial Floors", value: "4" },
          ],
        },
        {
          category: "Electrical Capacity",
          items: [
            { label: "Main Intake", value: "1,600A" },
            { label: "Distribution Boards", value: "86" },
            { label: "Meter Points", value: "82" },
            { label: "EV Charge Points", value: "24" },
          ],
        },
        {
          category: "Coordination Metrics",
          items: [
            { label: "Design Reviews", value: "24" },
            { label: "BIM Clashes Resolved", value: "147" },
            { label: "RFIs Issued", value: "12" },
            { label: "Variations", value: "3" },
          ],
        },
      ],
      takeaways: [
        "Early package sequencing reduced reactive redesign pressure by identifying and resolving conflicts during design stages rather than on site.",
        "Stakeholders saw clearer ownership across every workfront, with documented interfaces eliminating the finger-pointing that typically accompanies coordination failures.",
        "Procurement visibility improved confidence around long-lead items, with switchgear and distribution equipment arriving ahead of programme requirements.",
        "BIM Level 2 processes caught 147 potential clashes before installation, each representing avoided on-site rework.",
        "Only 3 variations were required across the entire electrical package, compared to an industry average of 15-20 for comparable schemes.",
      ],
      results: [
        "The electrical package was delivered on programme and under budget, with final costs 4% below tender due to reduced variation and rework.",
        "Zero days of programme delay attributed to electrical coordination issues, compared to an average of 12 days on similar BuildWest projects.",
        "Client satisfaction scores ranked the electrical delivery as outstanding across all measured categories.",
        "The collaborative framework developed on this project has been adopted as standard practice for all future BuildWest developments.",
        "BuildWest has committed to three further projects with Nexgen based on the success of this partnership approach.",
      ],
      conclusion: [
        "The Reading mixed-use project proves that treating electrical delivery as a programme conversation from day one delivers measurable benefits for all stakeholders. The additional investment in early coordination is recovered many times over through reduced variations, eliminated rework, and smoother programme delivery.",
        "For developers and main contractors considering their approach to M&E coordination, this project demonstrates that the old adversarial model of late engagement and reactive problem-solving is not only inefficient but unnecessary. Better outcomes are available to those willing to commit to genuine collaboration from the earliest project stages.",
      ],
      spotlight: [
        { label: "Stakeholders", value: "5 Teams" },
        { label: "Programme", value: "18 months" },
        { label: "Variations", value: "Only 3" },
        { label: "Budget", value: "4% Under" },
      ],
      quote: {
        quote:
          "This is how M&E coordination should work on every project. Having Nexgen at the table from Stage 2 meant we caught problems in Revit instead of on site. The cost savings and programme certainty speak for themselves.",
        author: "James Morrison",
        role: "Project Director, BuildWest Group",
      },
      additionalQuotes: [
        {
          quote: "The transparency of the shared coordination platform was transformative. For the first time, everyone had the same information at the same time - no surprises, no excuses.",
          author: "Sarah Chen",
          role: "Design Manager, BuildWest Group",
        },
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
        "The hospital upgrade demanded more than technical competence; it required operational empathy and relentless sequencing discipline. St. Mary's Hospital operates 24/7 with critically ill patients whose lives depend on uninterrupted power to ventilators, monitors, and life-support systems. There was zero tolerance for error.",
        "Teams aligned outages, clinical priorities, supplier readiness, and escalation routes before each stage moved forward. Every planned outage required sign-off from clinical leads who understood exactly which patients and equipment would be affected, and what backup arrangements were in place.",
      ],
      body: [
        "The existing emergency power ring dated from 1998 and while regularly maintained, was approaching end-of-life with increasingly difficult spare part sourcing. The main generator had adequate capacity, but the distribution network had grown organically over 25 years, creating single points of failure that kept the estates team awake at night.",
        "Our brief was to upgrade the emergency power distribution ring to current standards, improve resilience through redundant pathways, and extend coverage to newer clinical areas that had been added post-construction. All work had to be completed without any interruption to critical clinical services.",
        "The project required intimate coordination with clinical operations, with every outage window negotiated around patient movements, surgical schedules, and ward activities. A dedicated clinical liaison role was established to translate between engineering requirements and clinical reality.",
      ],
      scope: [
        "Complete replacement of emergency power distribution ring including 42 protected circuits across 6 clinical areas",
        "Installation of new automatic transfer switches with sub-100ms changeover capability",
        "Extension of emergency power coverage to ICU expansion wing and new imaging suite",
        "Upgrade of generator synchronisation panel for N+1 redundancy operation",
        "Installation of emergency power monitoring system with real-time load visibility",
        "Full testing and commissioning including simulated generator runs and transfer tests",
        "Comprehensive documentation and clinical staff training on new systems",
      ],
      methodology: [
        "Our healthcare methodology centred on clinical partnership rather than traditional contractor-client relationships. A senior engineer was embedded with the estates team for the project duration, attending daily clinical operations meetings and building relationships with ward managers who would ultimately approve outage windows.",
        "Every planned outage was documented in a clinical narrative format that non-technical stakeholders could understand. Rather than describing technical work, these documents explained which beds would temporarily lose emergency power backup, what alternative arrangements were in place, and who to contact if concerns arose.",
        "A three-tier escalation protocol was established with immediate visibility for both engineering and clinical teams. Any deviation from plan triggered automatic escalation to pre-designated decision makers who had authority to pause or continue work.",
      ],
      challenges: [
        {
          title: "ICU Proximity Constraints",
          description: "The main distribution work was located directly adjacent to the Intensive Care Unit, with extremely sensitive patients who could not be moved and equipment that could not tolerate vibration or electrical interference.",
          solution: "We developed a detailed method statement reviewed by ICU consultants, specifying maximum noise levels, vibration limits, and electromagnetic compatibility requirements. Specialist low-noise tools were sourced, and work was scheduled around the quietest clinical periods between 2-5am.",
        },
        {
          title: "Legacy Documentation Gaps",
          description: "Original emergency power drawings from 1998 did not accurately reflect 25 years of modifications, making it impossible to plan outages with confidence based on documentation alone.",
          solution: "We conducted a comprehensive circuit-tracing exercise over four nights, physically verifying every emergency-supplied circuit and creating an accurate as-built record. This survey identified three circuits incorrectly marked as non-essential that actually supplied critical monitoring equipment.",
        },
        {
          title: "Generator Run Restrictions",
          description: "Full generator testing required planned mains disconnection, but the hospital could not risk genuine emergency power operation during testing in case a real emergency occurred simultaneously.",
          solution: "We designed a testing protocol using temporary load banks that allowed full-power generator testing without disconnecting mains supply. Transfer switching was tested using controlled, reversible procedures with instant abort capability.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Survey & Clinical Engagement",
          description: "Comprehensive existing installation survey, clinical stakeholder mapping, and establishment of communication protocols with all affected departments.",
          duration: "4 weeks",
        },
        {
          phase: "Phase 2",
          title: "Equipment Procurement & Staging",
          description: "Procurement of all switchgear and distribution equipment, factory acceptance testing, and staging in hospital goods-in area for rapid deployment.",
          duration: "8 weeks",
        },
        {
          phase: "Phase 3",
          title: "Distribution Ring Installation",
          description: "Progressive installation of new distribution equipment during negotiated night-time outage windows, with immediate testing and restoration.",
          duration: "12 weeks",
        },
        {
          phase: "Phase 4",
          title: "Transfer Switch Upgrade",
          description: "Installation of new automatic transfer switches with enhanced changeover performance and monitoring capability.",
          duration: "6 weeks",
        },
        {
          phase: "Phase 5",
          title: "Commissioning & Handover",
          description: "Full system testing including simulated failures, clinical staff training, and comprehensive documentation handover.",
          duration: "4 weeks",
        },
      ],
      specifications: [
        {
          category: "Emergency Distribution",
          items: [
            { label: "Protected Circuits", value: "42" },
            { label: "Ring Configuration", value: "Dual-fed" },
            { label: "Transfer Time", value: "< 100ms" },
            { label: "Total Capacity", value: "800kVA" },
          ],
        },
        {
          category: "Generator System",
          items: [
            { label: "Primary Rating", value: "1,000kVA" },
            { label: "Configuration", value: "N+1" },
            { label: "Fuel Autonomy", value: "72 hours" },
            { label: "Start Time", value: "< 10 seconds" },
          ],
        },
        {
          category: "Monitoring",
          items: [
            { label: "Measurement Points", value: "86" },
            { label: "Alert Response", value: "< 30 seconds" },
            { label: "Data Retention", value: "5 years" },
            { label: "Remote Access", value: "Secure VPN" },
          ],
        },
      ],
      takeaways: [
        "Every outage window needs a clinical narrative, not just a technical one. Staff who understand what is happening and why are far more supportive than those given only technical jargon.",
        "Escalation routes should be visible to delivery and client-side teams alike. When issues arise at 3am, everyone needs to know exactly who to call.",
        "Progress reporting must translate electrical risk into operational language that clinicians and hospital leadership can act upon.",
        "Legacy documentation cannot be trusted without verification. The four-night survey identified critical circuits that would have been de-energised if we had relied on drawings alone.",
        "Relationship building with clinical staff is as important as technical planning. The ward managers who approved our outage windows needed to trust us personally.",
      ],
      results: [
        "Zero clinical incidents attributable to the upgrade works across the 34-week programme.",
        "All 42 protected circuits now benefit from dual-fed ring topology, eliminating 15 single points of failure identified in the original installation.",
        "Transfer switch upgrade reduced changeover time from 450ms to under 100ms, providing significantly improved protection for sensitive electronic equipment.",
        "The comprehensive documentation created during the project has become the foundation for the hospital's electrical maintenance regime.",
        "The hospital has since engaged us for three further upgrade programmes based on the success of this project.",
      ],
      conclusion: [
        "Healthcare electrical delivery requires a fundamentally different mindset from commercial or industrial work. The patients in the beds are not abstract stakeholders - they are vulnerable individuals whose lives depend on the systems we maintain and upgrade. This responsibility must inform every decision, from programme planning to individual method statements.",
        "The St. Mary's project demonstrates that complex, high-risk infrastructure upgrades can be delivered safely in live clinical environments when engineering excellence is combined with genuine partnership with clinical teams. The investment in relationships and communication paid dividends throughout the programme.",
      ],
      spotlight: [
        { label: "Protected Circuits", value: "42" },
        { label: "Outage Windows", value: "Night Only" },
        { label: "Clinical Incidents", value: "Zero" },
        { label: "Programme Duration", value: "34 weeks" },
      ],
      quote: {
        quote:
          "The discipline of communication was as important as the engineering itself. Every member of the Nexgen team understood that behind every circuit number was a patient who depended on us getting this right.",
        author: "Dr. Michael Patterson",
        role: "Clinical Estates Lead, St. Mary's Hospital",
      },
      additionalQuotes: [
        {
          quote: "For the first time in 20 years, I can sleep soundly knowing our emergency power system has genuine redundancy. The peace of mind is invaluable.",
          author: "Robert Chen",
          role: "Chief Operating Officer, St. Mary's Hospital",
        },
      ],
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
        "Repeat work often reflects the quality of process as much as the quality of installation. When Riverside Commercial Centre's facilities team reached out for their second major electrical project, they cited not just the technical quality of our previous work, but the experience of working with our team throughout delivery.",
        "This review highlighted communication rhythm, site conduct, and confidence in final handover as decisive reasons for a second appointment. In a competitive market where technical competence is table stakes, these softer factors increasingly determine who wins repeat business.",
      ],
      body: [
        "The Canary Wharf retrofit encompassed a comprehensive lighting and power upgrade across 45,000 square feet of occupied commercial space. The building operates 24/7 with multiple tenants, each with different operational requirements and tolerance for disruption. Coordinating works around these competing demands required meticulous planning and constant communication.",
        "Our first project with Riverside had been an emergency generator upgrade completed under significant time pressure. That project's success had established trust, but the retrofit presented different challenges: longer duration, multiple stakeholders, and works visible to building occupants and visitors throughout.",
        "The facilities director's feedback focused particularly on our weekly update rhythm and the quality of our handover documentation. These elements transformed what could have been a stressful experience into a managed, predictable programme that the facilities team could confidently report upwards.",
      ],
      scope: [
        "LED lighting retrofit across all common areas, corridors, and car park - 1,247 fittings replaced",
        "Emergency lighting upgrade to current EN 50172 standards with automated testing capability",
        "Distribution board replacements across 6 floors including metering upgrades",
        "Power quality improvement programme addressing harmonic issues from existing equipment",
        "Energy monitoring installation providing real-time consumption data by zone",
        "Full documentation pack including as-built drawings, O&M manuals, and training materials",
      ],
      methodology: [
        "Our commercial retrofit methodology prioritises minimal disruption to building operations. We developed a detailed phasing plan with the facilities team, working floor-by-floor during agreed quiet periods and maintaining all life safety systems throughout.",
        "Weekly progress reports followed a standardised format: work completed, work planned, risks and issues, and upcoming access requirements. This consistency allowed the facilities team to forward reports directly to building management and tenants without rewriting.",
        "Our site supervisors attended the building's weekly operations meeting, building relationships with tenant representatives and addressing concerns before they escalated. This proactive communication prevented the complaints that typically accompany works in occupied buildings.",
      ],
      challenges: [
        {
          title: "Multi-Tenant Coordination",
          description: "Eight different tenants occupied the building, each with different operational patterns, security requirements, and tolerance for disruption during working hours.",
          solution: "We created individual tenant communication plans and appointed a single point of contact for each. Works affecting specific tenants were scheduled directly with their facilities contacts, not just building management, ensuring buy-in from those actually impacted.",
        },
        {
          title: "Heritage Lighting Constraints",
          description: "The building's reception and main lobbies featured heritage light fittings that could not be replaced, but the existing lamps were inefficient and increasingly difficult to source.",
          solution: "We sourced specialist LED retrofit lamps that maintained the original fitting appearance while delivering 80% energy savings. The heritage fittings now exceed modern efficiency standards while preserving the building's character.",
        },
        {
          title: "Asbestos Discovery",
          description: "Routine surveys before distribution board replacement identified previously unknown asbestos-containing materials in two plant rooms.",
          solution: "We immediately notified building management and coordinated with licensed asbestos removal contractors. Works in affected areas were rescheduled to follow removal, with no impact on the overall programme completion date.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Survey & Planning",
          description: "Comprehensive existing installation survey, tenant liaison, and detailed programme development aligned with building operations calendar.",
          duration: "3 weeks",
        },
        {
          phase: "Phase 2",
          title: "Car Park & External",
          description: "Car park lighting upgrade and external lighting improvements completed during overnight periods to minimise daytime disruption.",
          duration: "2 weeks",
        },
        {
          phase: "Phase 3",
          title: "Common Areas",
          description: "Corridor and common area lighting retrofit, floor by floor, coordinated around cleaning schedules and tenant movements.",
          duration: "6 weeks",
        },
        {
          phase: "Phase 4",
          title: "Distribution Upgrades",
          description: "Distribution board replacements and metering upgrades during agreed outage windows, typically weekends.",
          duration: "4 weeks",
        },
        {
          phase: "Phase 5",
          title: "Commissioning & Handover",
          description: "Final testing, energy monitoring setup, documentation completion, and facilities team training.",
          duration: "2 weeks",
        },
      ],
      specifications: [
        {
          category: "Lighting Retrofit",
          items: [
            { label: "Fittings Replaced", value: "1,247" },
            { label: "Energy Reduction", value: "68%" },
            { label: "Lux Improvement", value: "+15%" },
            { label: "Warranty", value: "5 years" },
          ],
        },
        {
          category: "Distribution",
          items: [
            { label: "Boards Replaced", value: "12" },
            { label: "Meters Installed", value: "18" },
            { label: "Certification", value: "BS 7671" },
            { label: "Documentation", value: "Full O&M Pack" },
          ],
        },
        {
          category: "Project Metrics",
          items: [
            { label: "Programme Duration", value: "17 weeks" },
            { label: "Tenant Complaints", value: "Zero" },
            { label: "Programme Variance", value: "On time" },
            { label: "Budget Variance", value: "1% under" },
          ],
        },
      ],
      takeaways: [
        "Consistent weekly updates reduce client uncertainty during delivery and provide ready-made content for their internal reporting.",
        "Tidy handover materials improve trust after practical completion and demonstrate professionalism that influences future decisions.",
        "Direct communication with tenants prevents complaints reaching building management and demonstrates respect for all stakeholders.",
        "Programme reliability matters as much as technical quality. Delivering on time and on budget is the foundation of repeat business.",
        "Documentation quality reflects installation quality in client perception. Comprehensive handover packs signal attention to detail throughout.",
      ],
      results: [
        "Zero tenant complaints throughout the 17-week programme, a first for major works in this building.",
        "68% reduction in lighting energy consumption, exceeding the 60% target and delivering faster ROI than projected.",
        "Facilities team rated communication as 'excellent' in post-project survey, citing weekly reports as particularly valuable.",
        "Repeat appointment confirmed within 4 weeks of practical completion for planned 2027 EV charging infrastructure programme.",
        "Documentation pack adopted as template for other Riverside properties, extending our influence across their portfolio.",
      ],
      conclusion: [
        "The Canary Wharf retrofit demonstrates that in commercial electrical contracting, process quality determines relationship quality. Technical competence is essential but expected; what distinguishes contractors in clients' minds is the experience of working together.",
        "For facilities managers evaluating electrical contractors, this project illustrates the value of asking not just 'can they do the work?' but 'what will it be like working with them?' The answer to the second question often determines whether there will be a next project.",
      ],
      spotlight: [
        { label: "Client Status", value: "Repeat" },
        { label: "Fittings Replaced", value: "1,247" },
        { label: "Energy Saved", value: "68%" },
        { label: "Complaints", value: "Zero" },
      ],
      quote: {
        quote:
          "The job was well organised, well communicated, and delivered exactly how a busy commercial client needs it to be. But what really stood out was the weekly reports - I could forward them straight to my directors without editing. That might sound like a small thing, but it made my life significantly easier.",
        author: "Amanda Richards",
        role: "Facilities Director, Riverside Commercial Centre",
      },
      additionalQuotes: [
        {
          quote: "The site team were professional, tidy, and respectful of our tenants. We didn't receive a single complaint, which for a project of this scale is genuinely remarkable.",
          author: "Marcus Thompson",
          role: "Building Manager, Canary Wharf",
        },
      ],
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
        "The launch combined campaign storytelling with operational proof so partner teams could use the same source material across sales, social, and project updates. Community Electrification Week represented our most ambitious partner-led marketing initiative, designed to showcase the human impact of electrical infrastructure investment.",
        "That structure is exactly why the news hub sidebar matters: campaign modules can sit beside editorial stories without breaking the data model. This integration allows partners to amplify their own messages while benefiting from our content platform's reach and credibility.",
      ],
      body: [
        "Community Power Alliance approached us with a challenge: they had completed significant electrification work across underserved communities but struggled to communicate impact in ways that resonated beyond technical audiences. The numbers were impressive - 847 homes upgraded, 23 community facilities improved - but the human stories behind those numbers weren't reaching decision-makers.",
        "Our Campaign Studio developed a coordinated content strategy that transformed project deliverables into shareable marketing assets. Rather than creating campaign content separately from operational documentation, we designed a production process where every site visit generated both technical records and campaign-ready photography, video clips, and resident testimonials.",
        "The resulting asset library gave Community Power Alliance's marketing team immediate access to professionally produced content they could deploy across social media, grant applications, and stakeholder presentations - all directly linked to verified project outcomes.",
      ],
      scope: [
        "Development of unified content production methodology for operational and marketing outputs",
        "Creation of 12 reusable campaign card templates with customisable text and imagery",
        "Photography and videography across 6 community installation sites",
        "Resident testimonial capture with proper consent and release documentation",
        "Social media content calendar development for 7-day campaign period",
        "Integration of campaign modules into news hub sidebar and partner portal",
      ],
      methodology: [
        "Our campaign methodology centres on 'dual-purpose capture' - every site visit is treated as both an operational checkpoint and a content production opportunity. Engineers carry standardised shot lists alongside technical checklists, ensuring consistent content capture without dedicated media visits.",
        "Campaign cards use a modular design system allowing rapid customisation for different channels and audiences. The same core content can be formatted for LinkedIn corporate posts, Instagram stories, press releases, or printed materials - all from a single source asset.",
        "The news hub integration ensures campaign content maintains editorial credibility while serving marketing objectives. Campaign modules appear in the sidebar rather than the main feed, clearly distinguished from news content while benefiting from the same audience reach.",
      ],
      challenges: [
        {
          title: "Resident Privacy Concerns",
          description: "Many community residents were hesitant about appearing in marketing materials, concerned about data privacy and how their images would be used.",
          solution: "We developed a clear, plain-language consent process explaining exactly how content would be used, with options for anonymised participation. Residents could contribute testimonials without photographs, or approve specific uses while restricting others.",
        },
        {
          title: "Technical-to-Human Translation",
          description: "Project outcomes were documented in technical terms that didn't communicate impact to non-specialist audiences. '240 circuits upgraded' meant nothing to council members or funding bodies.",
          solution: "We created translation guidelines mapping technical deliverables to human outcomes. '240 circuits upgraded' became '240 families with safer, more reliable electricity'. Every metric was paired with an impact statement suitable for general audiences.",
        },
        {
          title: "Cross-Organisation Asset Sharing",
          description: "Multiple stakeholders needed access to campaign assets with different approval requirements and usage restrictions, creating complex coordination challenges.",
          solution: "A shared digital asset management system with role-based permissions allowed different stakeholders to access approved content immediately while maintaining governance. Automatic watermarking identified asset origin and usage terms.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Strategy & Planning",
          description: "Campaign objectives definition, stakeholder mapping, and content production methodology development with Community Power Alliance marketing team.",
          duration: "2 weeks",
        },
        {
          phase: "Phase 2",
          title: "Content Production",
          description: "Site visits to 6 community locations capturing photography, videography, and resident testimonials alongside ongoing installation work.",
          duration: "4 weeks",
        },
        {
          phase: "Phase 3",
          title: "Asset Development",
          description: "Creation of 12 campaign card templates, social media content suite, and news hub integration modules.",
          duration: "2 weeks",
        },
        {
          phase: "Phase 4",
          title: "Campaign Execution",
          description: "7-day Community Electrification Week campaign with coordinated social media, press outreach, and stakeholder communications.",
          duration: "1 week",
        },
      ],
      specifications: [
        {
          category: "Content Assets",
          items: [
            { label: "Campaign Cards", value: "12 templates" },
            { label: "Video Clips", value: "24" },
            { label: "Photographs", value: "180+" },
            { label: "Testimonials", value: "15" },
          ],
        },
        {
          category: "Campaign Reach",
          items: [
            { label: "Social Impressions", value: "127,000" },
            { label: "Media Mentions", value: "8" },
            { label: "Newsletter Opens", value: "4,200" },
            { label: "Website Traffic", value: "+340%" },
          ],
        },
        {
          category: "Stakeholder Impact",
          items: [
            { label: "Council Briefings", value: "3" },
            { label: "Funder Presentations", value: "2" },
            { label: "Press Enquiries", value: "12" },
            { label: "Partner Enquiries", value: "7" },
          ],
        },
      ],
      takeaways: [
        "Editorial and campaign content can coexist in one publishing architecture when properly structured and clearly distinguished.",
        "Reusable card templates make fast stakeholder updates easier to distribute while maintaining brand consistency.",
        "Partner content becomes more valuable when routed through a stable content model that provides credibility and reach.",
        "Dual-purpose content capture transforms operational site visits into marketing opportunities without dedicated media budgets.",
        "Human impact translation ensures technical achievements resonate with non-specialist decision-makers and funding bodies.",
      ],
      results: [
        "Campaign reached 127,000 social media impressions across Community Power Alliance's channels and partner amplification.",
        "8 media mentions in local and trade press, including coverage in two national energy publications.",
        "7 new partner enquiries directly attributed to campaign visibility, with 2 progressing to formal proposals.",
        "Asset library continues generating value 6 months post-campaign, with cards reused for council presentations and grant applications.",
        "Campaign methodology adopted by 3 additional community organisations seeking similar marketing support.",
      ],
      conclusion: [
        "Community Electrification Week proved that operational excellence and marketing impact are not competing priorities but complementary outcomes of well-designed content processes. By integrating content capture into standard delivery workflows, we created sustainable marketing momentum that extends far beyond the campaign period.",
        "For partners seeking to communicate impact to stakeholders, funders, and communities, this campaign model offers a template: start with operational truth, translate into human terms, and distribute through credible channels. The result is marketing that resonates because it's grounded in genuine delivery.",
      ],
      spotlight: [
        { label: "Campaign Week", value: "7 Days" },
        { label: "Assets Created", value: "12 Cards" },
        { label: "Social Reach", value: "127K" },
        { label: "Partner Leads", value: "7" },
      ],
      quote: {
        quote:
          "We had amazing project outcomes but couldn't tell the story effectively. The campaign assets Nexgen created gave us professional content we're still using months later. The council presentations alone have secured additional funding.",
        author: "Rachel Davies",
        role: "Communications Director, Community Power Alliance",
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // RESIDENTIAL ARTICLES
  // ════════════════════��══════════════════════════════════════════════════════
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
        "Rewiring a Victorian terrace requires balancing modern safety standards with the preservation of period features that give these properties their character. This 1890s property in Hackney retained original cornicing, ceiling roses, and dado rails that the homeowners were determined to protect throughout the electrical upgrade.",
        "This project demonstrates how careful planning, discrete routing, and specialist techniques can deliver a fully compliant BS 7671 19th Edition installation without visible damage to original plasterwork. The result is a home that meets modern safety standards while maintaining its Victorian charm.",
      ],
      body: [
        "The existing electrical installation dated from the 1960s, with additions made in the 1980s and 2000s creating a patchwork of wiring styles and cable routes. The original consumer unit contained a mix of rewirable fuses and MCBs, with no RCD protection and inadequate earthing arrangements that failed current testing requirements.",
        "The homeowners had recently purchased the property with renovation plans that included a loft conversion and rear extension. Rather than rewire twice, they wisely chose to complete the electrical infrastructure upgrade before building works commenced, allowing us to design for the final property configuration from the outset.",
        "Heritage concerns were paramount. The property retained exceptional original features including ornate cornicing in all ground floor rooms, intricate ceiling roses, and a complete run of dado rail on the main staircase. Any visible damage would have been unacceptable, requiring innovative routing solutions.",
      ],
      scope: [
        "Complete rewire of existing property including basement, ground, first, and second floors",
        "Future-proofing for planned loft conversion with pre-wired circuits and distribution board space",
        "Installation of 18-way split-load consumer unit with dual 63A Type A RCDs",
        "Dedicated circuits for kitchen appliances, home office, and future EV charging",
        "Lutron Caseta wireless dimming throughout with Pico remote controls",
        "Full EICR testing and certification with 10-year installation warranty",
      ],
      methodology: [
        "Our heritage property methodology prioritises floor-void routing over wall channelling wherever possible. Victorian terraces typically have accessible floor voids that allow cable distribution without disturbing wall plaster. We lift floorboards carefully, run cables through the void, and drop into walls only at switch and socket positions.",
        "For vertical distribution, we utilised existing chimney breast voids and redundant gas pipe runs rather than channelling. Where wall penetration was unavoidable, we used specialist plaster-compatible routing tools that minimise disturbance and allow seamless repair by heritage plasterers.",
        "The project was sequenced to complete infrastructure work before the homeowners' decorating programme, ensuring any making good was covered by planned redecoration rather than requiring separate remedial works.",
      ],
      challenges: [
        {
          title: "Ornate Cornicing Protection",
          description: "The ground floor rooms featured elaborate plaster cornicing that could not be replicated if damaged. Any cable routes approaching the ceiling needed to avoid this delicate feature.",
          solution: "We routed all ground floor ceiling feeds through the first floor void, dropping cables through the floor rather than approaching from ceiling level. This completely eliminated risk to the cornicing while achieving optimal socket and switch positioning.",
        },
        {
          title: "Listed Building Consent",
          description: "Although the property was locally listed rather than Grade I/II, any visible alterations required consultation with the conservation officer. The homeowners were concerned about potential delays or refusals.",
          solution: "We prepared detailed method statements demonstrating how our concealed routing approach would preserve all protected features. The conservation officer approved works on the basis that no visible alterations would result - which our methodology guaranteed.",
        },
        {
          title: "Asbestos in Ceiling Roses",
          description: "Testing revealed that the original Victorian ceiling roses contained asbestos in their backing material, requiring licensed removal before electrical work could proceed.",
          solution: "We coordinated with licensed asbestos removers who carefully extracted the backing material while preserving the decorative plasterwork. The roses were then reattached with modern backing plates, preserving their appearance while eliminating the hazard.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Survey & Planning",
          description: "Comprehensive existing installation survey, heritage feature mapping, and detailed routing design avoiding all protected elements.",
          duration: "1 week",
        },
        {
          phase: "Phase 2",
          title: "Infrastructure Installation",
          description: "Consumer unit installation, main distribution routes through floor voids, and vertical rises through chimney breasts and pipe runs.",
          duration: "1 week",
        },
        {
          phase: "Phase 3",
          title: "First Fix",
          description: "Back box installation, final cable runs to all switch and socket positions, and first fix for lighting circuits.",
          duration: "4 days",
        },
        {
          phase: "Phase 4",
          title: "Second Fix",
          description: "Plate installation, testing, consumer unit labelling, and smart dimmer programming.",
          duration: "3 days",
        },
        {
          phase: "Phase 5",
          title: "Testing & Certification",
          description: "Full EICR testing, certification documentation, and homeowner walkthrough and training.",
          duration: "2 days",
        },
      ],
      specifications: [
        {
          category: "Consumer Unit",
          items: [
            { label: "Manufacturer", value: "Hager" },
            { label: "Ways", value: "18" },
            { label: "Main Switch", value: "100A" },
            { label: "RCD Protection", value: "Dual Type A 63A" },
          ],
        },
        {
          category: "Circuit Summary",
          items: [
            { label: "Lighting Circuits", value: "6" },
            { label: "Ring Final Circuits", value: "4" },
            { label: "Dedicated Radials", value: "8" },
            { label: "Spare Ways", value: "4" },
          ],
        },
        {
          category: "Smart Systems",
          items: [
            { label: "Dimmer System", value: "Lutron Caseta" },
            { label: "Controlled Points", value: "22" },
            { label: "Remote Controls", value: "8 Pico" },
            { label: "Integration", value: "Apple HomeKit" },
          ],
        },
      ],
      takeaways: [
        "Floor-lifting access reduces wall channelling dramatically and preserves original plaster cornicing throughout the property.",
        "Split-load consumer units with dual RCD protection and spare ways future-proof the installation for EV charging and loft conversion.",
        "Early coordination with heritage consultants and conservation officers prevents delays and ensures Listed Building consent compliance.",
        "Victorian chimney breast voids and redundant pipe runs provide excellent concealed routing opportunities that modern properties lack.",
        "Sequencing electrical works before decoration allows making good to be absorbed into planned finishing programmes.",
      ],
      results: [
        "Zero visible alterations to any heritage features including cornicing, ceiling roses, and dado rails throughout the property.",
        "Full BS 7671 19th Edition compliance achieved with satisfactory EICR and maximum 5-year recommendation for next inspection.",
        "Lutron Caseta installation provides smart home convenience while allowing the homeowners to retain original switch plates in key locations.",
        "4 spare ways in consumer unit ready for loft conversion and EV charging circuits when building works proceed.",
        "Conservation officer cited the project as an example of best practice for electrical upgrades in locally listed properties.",
      ],
      conclusion: [
        "Victorian properties deserve electrical installations that respect their heritage while meeting modern safety standards. This Hackney project proves that these objectives are not in conflict when approached with proper planning, specialist techniques, and genuine appreciation for the features that make these properties special.",
        "For homeowners considering rewiring heritage properties, the message is clear: find contractors who understand both electrical regulations and conservation principles. The additional planning required is a small price for protecting irreplaceable features while achieving a safe, future-ready installation.",
      ],
      spotlight: [
        { label: "Circuits", value: "28" },
        { label: "Programme", value: "3 weeks" },
        { label: "Heritage Damage", value: "Zero" },
        { label: "Spare Capacity", value: "4 ways" },
      ],
      quote: {
        quote:
          "We were nervous about disruption to the original features, but the team managed to route everything without a single crack in our cornicing. The conservation officer was so impressed she asked for our contractor's details to recommend to other homeowners.",
        author: "Sarah and Tom Henderson",
        role: "Homeowners, Hackney",
      },
      additionalQuotes: [
        {
          quote: "This is exactly how electrical work should be done in heritage properties. Full modern compliance with zero visual impact - a model for the borough.",
          author: "Conservation Officer",
          role: "Hackney Council",
        },
      ],
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
        "KNX remains the gold standard for residential building automation, offering unparalleled flexibility and longevity compared to proprietary wireless systems. This wired protocol has been in continuous development since 1990 and is supported by over 500 manufacturers worldwide, ensuring genuine interoperability and long-term availability.",
        "This new-build project in Richmond showcases how early involvement in the design phase allows for optimal cable routing and sensor placement. Working alongside the architect from RIBA Stage 3, we designed an automation infrastructure that disappears into the fabric of the building while delivering sophisticated control across lighting, climate, blinds, and security.",
      ],
      body: [
        "The homeowners approached us with clear requirements: they wanted comprehensive automation without visible control panels cluttering every room. The challenge was creating an intuitive system that guests could use without instruction while providing detailed control for the family's specific preferences.",
        "We specified a hybrid approach using KNX as the backbone for all building services integration, with Lutron Palladiom keypads providing the human interface. This combination delivers the robustness and flexibility of KNX with the aesthetic refinement and haptic quality of Lutron's premium switch range.",
        "The system integrates lighting control across 48 circuits, HVAC management via the underfloor heating system and air conditioning, motorised blinds on all south-facing windows, and security system status monitoring. All elements are coordinated through scene programming that adapts the house to different activities and times of day.",
      ],
      scope: [
        "KNX system design and specification including 142 devices across all floors",
        "Lighting control integration with 48 DALI circuits and Lutron Palladiom keypads",
        "HVAC integration with underfloor heating manifolds and VRF air conditioning system",
        "Motorised blind control for 14 windows with astronomical time clock automation",
        "Door entry and security system integration with scene triggering",
        "IP gateway installation enabling remote access and voice assistant integration",
        "Programming, commissioning, and homeowner training",
      ],
      methodology: [
        "Our KNX methodology emphasises early engagement to influence building design decisions. The optimal time for automation infrastructure planning is during RIBA Stage 3, when spatial layouts are being finalised but structural decisions remain flexible. At this stage, we can specify containment routes that accommodate KNX bus cables without competing for space with power and data cabling.",
        "We design systems in three layers: infrastructure (bus topology and power supplies), devices (sensors, actuators, and interfaces), and logic (programming and scene definition). This layered approach allows each element to be specified, installed, and tested independently before integration.",
        "Scene programming follows extensive consultation with homeowners about their actual living patterns. We avoid generic 'showroom' scenes in favour of personalised configurations that reflect how the family uses each space throughout the day.",
      ],
      challenges: [
        {
          title: "Complex HVAC Integration",
          description: "The property featured both wet underfloor heating and a multi-zone VRF air conditioning system from different manufacturers, each with proprietary control protocols.",
          solution: "We specified KNX gateways for both systems, translating manufacturer-specific protocols into standard KNX commands. This allows unified control through a single interface while maintaining full native functionality for each system.",
        },
        {
          title: "Builder Coordination",
          description: "First-fix electrical installation occurred on a tight programme, with risk of KNX containment being omitted or incorrectly positioned by site electricians unfamiliar with automation requirements.",
          solution: "We provided detailed first-fix drawings marking all containment routes and back-box positions, conducted a pre-installation briefing with the site team, and performed two site inspections during first fix to verify correct installation before plastering.",
        },
        {
          title: "Aesthetic Keypad Placement",
          description: "The architect's interior design specified minimal switch plates, but the homeowners wanted immediate control without relying on mobile devices. Balancing aesthetics with functionality required careful negotiation.",
          solution: "We proposed Lutron Palladiom keypads in a bronze finish matching the door furniture, with custom engraving replacing generic icons. The result was switch plates that complement the interior design while providing intuitive physical control.",
        },
      ],
      timeline: [
        {
          phase: "Stage 3",
          title: "Design Development",
          description: "System specification, device scheduling, and containment design integrated with architectural and MEP drawings.",
          duration: "6 weeks",
        },
        {
          phase: "First Fix",
          title: "Infrastructure Installation",
          description: "Bus cable installation, power supply positioning, and back-box installation coordinated with main contractor programme.",
          duration: "2 weeks",
        },
        {
          phase: "Second Fix",
          title: "Device Installation",
          description: "Installation of all KNX devices including actuators, sensors, keypads, and gateways.",
          duration: "1 week",
        },
        {
          phase: "Commissioning",
          title: "Programming & Testing",
          description: "Individual device addressing, logic programming, scene creation, and integration testing.",
          duration: "2 weeks",
        },
        {
          phase: "Handover",
          title: "Training & Documentation",
          description: "Comprehensive homeowner training, documentation pack delivery, and establishment of remote support access.",
          duration: "3 days",
        },
      ],
      specifications: [
        {
          category: "KNX Infrastructure",
          items: [
            { label: "Total Devices", value: "142" },
            { label: "Bus Lines", value: "4" },
            { label: "Power Supplies", value: "4 x 640mA" },
            { label: "IP Gateway", value: "Gira X1" },
          ],
        },
        {
          category: "Lighting Control",
          items: [
            { label: "DALI Circuits", value: "48" },
            { label: "Dimming Actuators", value: "12" },
            { label: "Keypads", value: "24 Palladiom" },
            { label: "Scenes", value: "36" },
          ],
        },
        {
          category: "Building Services",
          items: [
            { label: "HVAC Zones", value: "6" },
            { label: "Blind Motors", value: "14" },
            { label: "Weather Station", value: "1" },
            { label: "Presence Sensors", value: "18" },
          ],
        },
      ],
      takeaways: [
        "First-fix coordination with the builder prevents costly retrofit routing later - containment installed during construction costs a fraction of retrospective installation.",
        "Scene programming should reflect actual living patterns, not showroom demonstrations. We spent significant time understanding how the family uses each space.",
        "Remote access via IP gateway enables ongoing support without site visits, allowing scene adjustments and troubleshooting from our office.",
        "Hybrid approaches combining KNX infrastructure with premium interfaces like Lutron deliver both robustness and aesthetics.",
        "Early engagement at RIBA Stage 3 allows automation requirements to influence building design rather than constraining system capability.",
      ],
      results: [
        "System has operated flawlessly for 6 months since handover with zero hardware failures or software issues.",
        "Homeowner reports 40% reduction in lighting energy consumption through presence detection and daylight harvesting.",
        "Guest feedback consistently praises intuitive control - visitors can operate lights and blinds without instruction.",
        "Remote support has resolved three scene adjustment requests without requiring site visits, demonstrating ongoing support efficiency.",
        "The project has been featured in a KNX Association case study as an example of premium residential integration.",
      ],
      conclusion: [
        "KNX-based home automation represents a significant investment, but delivers returns that cheaper alternatives cannot match: genuine interoperability, multi-decade longevity, and the flexibility to adapt as technology and user requirements evolve. This Richmond project demonstrates what is achievable when automation design is treated as an integral part of the architectural process rather than an afterthought.",
        "For homeowners considering smart home investment, the choice between KNX and wireless alternatives should be informed by time horizon. If you are building a home to live in for decades, KNX's proven longevity and upgradeability justify the higher initial cost. For shorter occupancies, wireless systems offer good capability at lower investment.",
      ],
      spotlight: [
        { label: "KNX Devices", value: "142" },
        { label: "Lighting Circuits", value: "48" },
        { label: "HVAC Zones", value: "6" },
        { label: "Energy Saved", value: "40%" },
      ],
      quote: {
        quote:
          "We wanted a smart home that just works, without fiddling with apps every time we want to turn on a light. The KNX system delivers exactly that - sophisticated automation that feels completely natural to live with.",
        author: "Dr. Rebecca Foster",
        role: "Homeowner, Richmond",
      },
      additionalQuotes: [
        {
          quote: "The integration with our HVAC systems means the house stays comfortable year-round without us thinking about it. The energy savings have been a pleasant surprise.",
          author: "James Foster",
          role: "Homeowner, Richmond",
        },
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
        "Tier III data centres require N+1 redundancy across all power distribution paths, allowing maintenance without service interruption. This concurrently maintainable architecture ensures that any single component can be taken offline for repair or upgrade while the data centre continues operating at full capacity.",
        "This project in Slough demonstrates the electrical design principles that achieve concurrent maintainability while optimising capital expenditure. By carefully balancing redundancy levels across different system layers, we delivered Tier III certification at costs more typically associated with Tier II facilities.",
      ],
      body: [
        "The client, a rapidly growing cloud services provider, required a facility capable of supporting 4MW of IT load with room for future expansion. The site presented particular challenges: limited utility capacity requiring on-site generation, planning constraints restricting building height, and aggressive programme targets driven by contracted customer deployments.",
        "Our design philosophy prioritised modularity at every level. The electrical infrastructure was conceived as building blocks that could be deployed incrementally as IT load grew, avoiding the capital inefficiency of installing full redundancy capacity before it was needed. This approach aligned infrastructure investment with revenue generation rather than frontloading costs.",
        "The completed facility achieved Tier III certification on first assessment, validating both the design methodology and execution quality. More importantly, the modular architecture has already accommodated two capacity expansions since initial deployment, demonstrating the flexibility that will serve the client for decades.",
      ],
      scope: [
        "Complete electrical infrastructure design from 33kV incoming supply to rack-level PDU",
        "4 x 1.5MVA diesel generator sets with automatic paralleling and synchronisation",
        "8 x 500kVA modular UPS system with N+1 redundancy at full load",
        "Medium voltage switchgear including 33/11kV transformer and HV ring main unit",
        "LV distribution architecture supporting 2N redundancy to every rack position",
        "Critical power monitoring system with real-time PUE calculation",
        "Full commissioning including Tier III certification support",
      ],
      methodology: [
        "Our data centre design methodology applies a risk-based approach to redundancy specification. Rather than applying 2N redundancy uniformly (which significantly increases costs), we analyse each system layer to determine appropriate redundancy levels based on failure probability, consequence severity, and repair time.",
        "For this facility, we specified 2N redundancy for UPS-to-rack distribution (where failures are most consequential and space permits parallel paths) while accepting N+1 redundancy for generators (where failure probability is lower and fuel autonomy provides additional protection).",
        "The modular UPS architecture was central to cost optimisation. By specifying units that can be hot-swapped without load transfer, we eliminated the need for maintenance bypass switchgear that typically adds 15-20% to UPS system costs.",
      ],
      challenges: [
        {
          title: "Limited Utility Capacity",
          description: "The local distribution network could only provide 6MVA of firm capacity, insufficient for the planned 4MW IT load plus cooling and mechanical systems, necessitating on-site generation as baseload.",
          solution: "We designed the facility for utility-plus-generation operation, with generators providing baseload power and utility supply available as backup. This unconventional topology maximised available power within network constraints while maintaining Tier III redundancy.",
        },
        {
          title: "Building Height Restrictions",
          description: "Planning consent limited building height to 12 metres, constraining available floor-to-ceiling height and preventing conventional raised floor depths for cable management.",
          solution: "We specified overhead busbar trunking for power distribution, eliminating raised floor requirements for large cables. This approach also improved cooling efficiency by removing cable obstructions from the cold aisle.",
        },
        {
          title: "Programme Acceleration",
          description: "Customer contract commitments required energisation 6 weeks earlier than the original programme, with liquidated damages applying to delays.",
          solution: "We restructured the commissioning programme to prioritise the first two data halls, achieving partial energisation that allowed customer deployment while completing remaining infrastructure. This phased approach met contractual milestones without compromising safety or certification.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Design & Procurement",
          description: "Detailed electrical design, equipment specification, and procurement of long-lead items including generators and transformers.",
          duration: "16 weeks",
        },
        {
          phase: "Phase 2",
          title: "Substation & Generation",
          description: "33kV substation construction, generator installation, and medium voltage switchgear commissioning.",
          duration: "20 weeks",
        },
        {
          phase: "Phase 3",
          title: "UPS & Distribution",
          description: "UPS room fit-out, LV distribution installation, and busbar trunking deployment across data halls.",
          duration: "12 weeks",
        },
        {
          phase: "Phase 4",
          title: "Commissioning",
          description: "Integrated systems testing, failure mode validation, and performance verification.",
          duration: "6 weeks",
        },
        {
          phase: "Phase 5",
          title: "Certification",
          description: "Uptime Institute Tier III design and facility certification process.",
          duration: "4 weeks",
        },
      ],
      specifications: [
        {
          category: "Utility & Generation",
          items: [
            { label: "Incoming Supply", value: "33kV" },
            { label: "Transformer", value: "6.3MVA" },
            { label: "Generators", value: "4 x 1.5MVA" },
            { label: "Fuel Storage", value: "72 hours" },
          ],
        },
        {
          category: "UPS System",
          items: [
            { label: "Configuration", value: "Modular N+1" },
            { label: "Total Capacity", value: "8 x 500kVA" },
            { label: "Battery Runtime", value: "15 minutes" },
            { label: "Efficiency", value: "97.5%" },
          ],
        },
        {
          category: "Performance Metrics",
          items: [
            { label: "IT Capacity", value: "4MW" },
            { label: "Design PUE", value: "1.35" },
            { label: "Uptime Target", value: "99.982%" },
            { label: "Tier Rating", value: "III" },
          ],
        },
      ],
      takeaways: [
        "2N topology provides maximum redundancy but significantly increases CAPEX compared to N+1 - apply it selectively where consequences justify costs.",
        "Static transfer switches enable sub-cycle failover between redundant UPS paths, protecting IT equipment from any detectable power quality event.",
        "Generator synchronisation panels allow paralleling for extended runtime during utility outages, providing capacity beyond individual unit ratings.",
        "Modular UPS architectures eliminate maintenance bypass requirements, reducing both capital cost and footprint.",
        "Overhead busbar distribution improves both space efficiency and cooling performance compared to raised floor cable routes.",
      ],
      results: [
        "Tier III certification achieved on first Uptime Institute assessment, validating both design methodology and execution quality.",
        "Construction costs 12% under budget due to optimised redundancy specification and modular equipment selection.",
        "Actual PUE of 1.32 outperforming 1.35 design target, delivering ongoing operational savings.",
        "Two capacity expansions completed since initial deployment, demonstrating scalable architecture effectiveness.",
        "Zero unplanned outages in 18 months of operation, achieving 100% uptime against 99.982% Tier III target.",
      ],
      conclusion: [
        "Tier III data centre design requires balancing redundancy requirements against capital and operational efficiency. This Slough facility demonstrates that careful analysis of failure modes and consequences allows optimised redundancy specification without compromising certification requirements. The result is a facility that meets the highest reliability standards while remaining commercially competitive.",
        "For data centre operators evaluating electrical infrastructure design, the key lesson is that Tier certification defines outcomes, not methods. There are multiple architectural approaches to achieving concurrent maintainability, and the optimal choice depends on site constraints, load profile, and expansion plans. Engaging electrical specialists early allows these factors to inform design decisions rather than constraining them.",
      ],
      spotlight: [
        { label: "IT Capacity", value: "4MW" },
        { label: "UPS Modules", value: "8 x 500kVA" },
        { label: "Generators", value: "4 x 1.5MVA" },
        { label: "Uptime", value: "100%" },
      ],
      quote: {
        quote:
          "The electrical design exceeded our Tier III requirements while keeping construction costs 12% under budget. More importantly, the modular architecture has allowed us to expand twice without disruption - exactly the flexibility we needed for our growth trajectory.",
        author: "Steven Wright",
        role: "Technical Director, Cloud Services Provider",
      },
      additionalQuotes: [
        {
          quote: "The phased commissioning approach saved our customer commitments. We were deploying production workloads while they completed the final infrastructure - without ever compromising on safety or redundancy.",
          author: "Operations Director",
          role: "Data Centre Operator",
        },
      ],
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
