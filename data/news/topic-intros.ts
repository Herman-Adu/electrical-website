import type { SectionIntroData } from "@/types/sections";

export const newsTopicIntros: Record<string, SectionIntroData> = {
  residential: {
    sectionId: "topic-intro",
    label: "Residential Topic",
    headlineWords: ["Smart Homes.", "Efficient Living.", "Future-Ready."],
    leadParagraph:
      "From full rewires of Victorian terraces to KNX automation in new builds, the residential topic covers every stage of home electrification. Articles are drawn from completed domestic installations and written for homeowners, landlords, and M&E engineers specifying residential systems.",
    bodyParagraphs: [
      "EV charging infrastructure, smart meter integration, and solar PV load assessments feature prominently as demand grows for low-carbon domestic upgrades. Heritage properties — Grade II listed and pre-war builds — are covered with specific guidance on conservation-compliant wiring methods and Part P compliance pathways.",
      "Whether you are planning a first-fix rewire, upgrading a consumer unit, or specifying a full home automation system, the residential articles provide grounded, field-tested guidance drawn from projects delivered across London and the South East.",
    ],
    pillars: [
      {
        num: "01",
        title: "Home Electrification",
        description:
          "Full rewires, consumer unit upgrades, EV charging points, and solar PV integration — domestic projects from planning through certification.",
      },
      {
        num: "02",
        title: "Smart Living Systems",
        description:
          "KNX, DALI, and smart home automation guidance for new builds and retrofits, including load assessment and DNO coordination.",
      },
      {
        num: "03",
        title: "Heritage & Listed Properties",
        description:
          "Conservation-compliant electrical upgrades for pre-war and listed buildings, balancing modern standards with heritage requirements.",
      },
    ],
  },
  commercial: {
    sectionId: "topic-intro",
    label: "Commercial Topic",
    headlineWords: ["Retail Ready.", "Tenant-Focused.", "Operationally Sound."],
    leadParagraph:
      "Commercial electrical delivery spans retail Cat B fitouts, multi-tenanted building upgrades, hospitality rewires, and FM-managed maintenance contracts. Articles in this topic cover the full lifecycle of commercial electrical projects — from specification through handover and ongoing compliance.",
    bodyParagraphs: [
      "Multi-site standardisation, planned preventive maintenance programmes, and landlord-tenant coordination are recurring themes — reflecting the reality of commercial property management where electrical systems must perform reliably across diverse tenant requirements.",
      "Whether you are a property manager, facilities engineer, or M&E contractor working in commercial environments, these articles provide actionable guidance grounded in live project delivery.",
    ],
    pillars: [
      {
        num: "01",
        title: "Retail & Fitout",
        description:
          "Cat B electrical fitouts, retail lighting design, and tenant-ready infrastructure for commercial and mixed-use developments.",
      },
      {
        num: "02",
        title: "FM & Maintenance",
        description:
          "Planned preventive maintenance programmes, reactive callout structures, and multi-site coordination for property management clients.",
      },
      {
        num: "03",
        title: "Hospitality & Leisure",
        description:
          "Electrical upgrades and new installations for hotels, restaurants, and leisure venues with operational continuity as a priority.",
      },
    ],
  },
  industrial: {
    sectionId: "topic-intro",
    label: "Industrial Topic",
    headlineWords: ["High Voltage.", "Mission Critical.", "Zero Downtime."],
    leadParagraph:
      "Industrial electrical systems demand precision engineering, rigorous compliance, and zero-tolerance for unplanned downtime. Articles in this topic cover switchgear commissioning, data centre critical power, 3-phase distribution upgrades, and energy efficiency programmes for manufacturing and logistics operators.",
    bodyParagraphs: [
      "Power factor correction, transformer replacements, HV switchgear maintenance, and Tier III data centre infrastructure feature alongside energy audit methodologies and LED lighting ROI calculations. Technical content is referenced against BS 7671, IEC standards, and NICEIC industrial guidance.",
      "For engineers, contractors, and facilities managers operating in industrial environments — these articles provide the technical depth and real-world context needed to make confident decisions on complex electrical upgrades.",
    ],
    pillars: [
      {
        num: "01",
        title: "Critical Power Systems",
        description:
          "Data centre power infrastructure, UPS integration, generator changeovers, and Tier III resilience design for mission-critical environments.",
      },
      {
        num: "02",
        title: "High Voltage & Switchgear",
        description:
          "HV switchgear commissioning, 11kV and 33kV distribution upgrades, transformer replacements, and protection relay coordination.",
      },
      {
        num: "03",
        title: "Energy Efficiency",
        description:
          "Power factor correction, LED lighting retrofits with ROI analysis, and motor efficiency upgrades for industrial operators targeting cost reduction.",
      },
    ],
  },
  community: {
    sectionId: "topic-intro",
    label: "Community Topic",
    headlineWords: ["Education. Healthcare.", "Public Sector. Built Right."],
    leadParagraph:
      "Community sector electrical projects carry a unique set of obligations — occupied buildings, vulnerable users, HTM 06-01 healthcare compliance, and summer works windows that compress delivery timelines. Articles in this topic are written for contractors, estates managers, and consultants delivering in schools, hospitals, and public facilities.",
    bodyParagraphs: [
      "Summer works programmes for educational establishments require precise programming to avoid disruption to academic calendars. HTM 06-01 compliance for healthcare environments demands specialist knowledge of isolated power systems, clinical area zoning, and medical-grade earth monitoring.",
      "Resilience planning, emergency lighting upgrades, and fire alarm system integration are recurring themes across community sector projects — reflecting the duty-of-care obligations that define electrical delivery in public-facing environments.",
    ],
    pillars: [
      {
        num: "01",
        title: "Education Sector",
        description:
          "Summer works electrical programmes, classroom lighting upgrades, and IT infrastructure power for schools and academies.",
      },
      {
        num: "02",
        title: "Healthcare Compliance",
        description:
          "HTM 06-01 compliant installations, isolated power systems, clinical area zoning, and medical-grade earth monitoring for NHS and private healthcare.",
      },
      {
        num: "03",
        title: "Public Sector Resilience",
        description:
          "Emergency lighting, UPS systems, and resilience upgrades for local authority buildings, libraries, and community centres.",
      },
    ],
  },
  campaigns: {
    sectionId: "topic-intro",
    label: "Campaigns Topic",
    headlineWords: ["Partner-Led.", "Framework Agreed.", "Delivered Together."],
    leadParagraph:
      "Campaigns articles document coordinated delivery programmes — from Schneider Electric certification milestones to framework agreement rollouts with developers and housing associations. These are the stories behind structured, multi-stakeholder electrical delivery at scale.",
    bodyParagraphs: [
      "Framework agreements require consistent quality standards, coordinated subcontractor management, and detailed reporting against KPIs. Campaign articles explore how these structures are built, maintained, and measured — providing a model for contractors seeking to establish long-term partner relationships.",
      "Schneider Electric partnership milestones, technical excellence programmes, and approved contractor status renewals demonstrate commitment to standards that clients and consultants can rely on when specifying electrical contractors for major programmes.",
    ],
    pillars: [
      {
        num: "01",
        title: "Framework Delivery",
        description:
          "Structured delivery programmes under framework agreements — quality standards, KPI reporting, and partner coordination at scale.",
      },
      {
        num: "02",
        title: "Manufacturer Partnerships",
        description:
          "Schneider Electric certification, approved contractor status, and technical training programmes that differentiate our capability.",
      },
      {
        num: "03",
        title: "Multi-Trade Coordination",
        description:
          "Electrical delivery within multi-trade programmes — coordinating with mechanical, civil, and fit-out contractors on complex builds.",
      },
    ],
  },
  marketing: {
    sectionId: "topic-intro",
    label: "Marketing & Insights Topic",
    headlineWords: ["Net Zero.", "Electrification.", "Smart Decisions."],
    leadParagraph:
      "Marketing and insights articles help clients, specifiers, and facilities managers navigate the strategic landscape of electrical infrastructure — from net zero transition planning to insurance compliance, heat pump readiness, and electrification investment decisions.",
    bodyParagraphs: [
      "Content in this topic bridges the gap between technical electrical knowledge and business decision-making. Whether the reader is a facilities manager evaluating an EV charging rollout, a landlord assessing compliance risk, or a business owner planning a net zero pathway — these articles provide the context to make informed choices.",
      "Regulatory compliance, insurance implications, and total cost of ownership analysis are covered alongside forward-looking commentary on electrification trends, heat pump market readiness, and the implications of the UK's net zero commitments for building services engineers.",
    ],
    pillars: [
      {
        num: "01",
        title: "Net Zero Strategy",
        description:
          "Practical electrification pathways, heat pump compatibility assessments, and EV charging infrastructure planning for net zero transitions.",
      },
      {
        num: "02",
        title: "Compliance & Insurance",
        description:
          "Electrical compliance obligations, insurance requirements for commercial properties, and risk management guidance for landlords and FMs.",
      },
      {
        num: "03",
        title: "Investment Decisions",
        description:
          "Total cost of ownership analysis, ROI frameworks, and procurement guidance for electrical infrastructure investment decisions.",
      },
    ],
  },
  "social-media": {
    sectionId: "topic-intro",
    label: "Social Media & Reviews Topic",
    headlineWords: ["Client Voices.", "Proven Delivery.", "Real Feedback."],
    leadParagraph:
      "Reviews and social proof articles capture the client experience behind completed electrical projects — from first-contact consultation through installation, certification, and aftercare. Written from verified client feedback, these articles demonstrate delivery quality in the client's own words.",
    bodyParagraphs: [
      "Repeat appointment stories, referral case studies, and satisfaction summaries across residential, commercial, and industrial projects provide prospective clients with the evidence needed to make confident procurement decisions. Each review article is tied to a specific project type and delivery context.",
      "Social proof content is an essential trust signal for clients evaluating electrical contractors for high-value or sensitive projects. These articles complement technical case studies by focusing on the client relationship — responsiveness, communication, and the experience of working with our team.",
    ],
    pillars: [
      {
        num: "01",
        title: "Client Testimonials",
        description:
          "Verified feedback from residential, commercial, and industrial clients — spanning first-time and repeat engagements.",
      },
      {
        num: "02",
        title: "Repeat Appointments",
        description:
          "Stories of ongoing client relationships, framework renewals, and multi-phase project continuations that evidence long-term trust.",
      },
      {
        num: "03",
        title: "Referral Stories",
        description:
          "Articles tracing how client recommendations lead to new project opportunities — demonstrating the quality that drives word-of-mouth growth.",
      },
    ],
  },
};
