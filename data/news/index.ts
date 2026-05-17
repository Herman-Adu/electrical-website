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
    value: "11",
    description:
      "Real Nexgen project stories and insights — actively being published across all sectors.",
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
    id: "news-lv-001",
    slug: "lv-infrastructure-commercial-buildings-guide",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "LV Infrastructure in Commercial Buildings: A Practical Guide",
    excerpt:
      "Most commercial buildings are running LV electrical infrastructure that was installed 25–35 years ago — and the people responsible for those buildings often don't know it. Here's what you need to know before it becomes a problem.",
    description:
      "LV electrical infrastructure for commercial buildings — degradation signs, upgrade process, and what separates a competent LV contractor from the rest.",
    featuredImage: {
      src: "/images/news/lv-infrastructure-commercial-buildings.jpg",
      alt: "LV distribution board in a commercial building",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Commercial LV Specialists",
    },
    readTime: "9 min",
    tags: [
      "LV Infrastructure",
      "Commercial Electrical",
      "LV Upgrade",
      "BS 7671",
      "NICEIC",
      "Switchgear",
      "Distribution Boards",
      "Tender",
    ],
    isFeatured: true,
    heroHeadline: [
      "LV Infrastructure",
      "in Commercial Buildings",
      "A Practical Guide",
    ],
    heroIndicators: [
      {
        icon: "Building2",
        title: "Commercial Focus",
        description:
          "Written for property managers, facilities directors, and estates teams",
      },
      {
        icon: "Shield",
        title: "BS 7671 Compliant",
        description:
          "All design and installation guidance reflects current 18th Edition standards",
      },
      {
        icon: "Award",
        title: "NICEIC Approved",
        description:
          "Independently assessed electrical contracting — not just a logo",
      },
      {
        icon: "ClipboardCheck",
        title: "6-Stage Process",
        description: "From desktop assessment to documentation handover",
      },
    ] as const,
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-19",
    spotlightMetric: { label: "Upgrade Stages", value: "6" },
    detail: {
      intro: [
        "Most commercial building managers can describe what their building does. Far fewer could describe what their LV electrical infrastructure consists of, when it was installed, or what condition it's in. That gap is a risk — not an abstract one, but the kind that produces unplanned shutdowns, failed insurance inspections, and fit-out programmes derailed by infrastructure that should have been addressed years earlier.",
        "Electricity enters a commercial building at high voltage — typically 11kV from the local distribution network — and passes through a substation transformer that steps it down to Low Voltage: 400V three-phase and 230V single-phase. From that point, it travels through the LV distribution system to reach every power point, light fitting, piece of HVAC equipment, and data rack in the building. That journey passes through the main switchboard, sub-distribution boards, final circuit wiring, and all the protective devices and cable containment that hold the system together.",
        "The system you're responsible for includes: the main LV distribution board (MLVDB), sub-main boards and moulded case circuit breakers (MCCBs), final circuit distribution boards, busbars and cable containment, power factor correction equipment on larger sites, and standby generation with automatic transfer switching panels where fitted. It's not glamorous. It doesn't come with a dashboard. But it is the single point of failure that, if it fails, stops your building.",
      ],
      body: [
        "Switchgear installed in the 1980s and 1990s uses electromechanical protection technology that was designed for a service life of 20–25 years. Many commercial buildings are still operating equipment that is well beyond that design life. Physical degradation is cumulative: cables with early PVC insulation become brittle over decades of thermal cycling; bus bar connections that are not regularly torque-checked loosen; switchgear enclosures corrode; arc chutes that were designed to interrupt fault currents clear fewer operations than the manufacturer's figures assumed. An installation that appears operational can be operating with significantly degraded fault clearance capability.",
        "Load growth is the second force compounding against ageing infrastructure. A commercial building that originally housed 40 office workers running desktop computers and a small kitchen may now host dense IT infrastructure, multiple commercial kitchen appliances, two or three EV charging points, and close-control air conditioning units. The LV system was not designed for that load profile. Protection devices that were appropriately rated at commissioning may now be under-specified for the actual load they're protecting — a condition that creates both fire risk and operational vulnerability.",
        "Major switchgear manufacturers announce end-of-life dates for older product ranges, at which point spare parts become unavailable, technical support ceases, and type-tested replacement components no longer exist. A site built around an obsolete switchboard range is exposed to a specific risk: if a device fails, a like-for-like replacement may not be possible, and the alternative — replacing the entire switchboard on an emergency basis — is significantly more expensive and disruptive than a planned upgrade would have been.",
        "Regulatory change adds a fourth dimension. BS 7671 18th Edition — and its second amendment — introduced RCD protection requirements, arc fault detection device (AFDD) provisions, and protective equipotential bonding standards that many existing installations do not meet. An installation that was compliant when built may not satisfy the current edition of the wiring regulations, with implications for insurance, building control sign-off on refurbishment works, and liability in the event of an incident.",
        "The warning signs are usually present before a failure occurs. Nuisance tripping — circuit breakers that trip under normal operating loads or fail to hold on reset — is one of the most reliable early indicators. It suggests overloaded circuits, ageing protective devices losing their calibration, or developing fault conditions that the system is reacting to intermittently rather than clearing definitively.",
        "Hot distribution boards are a more serious indicator. During maintenance access, if switchboard enclosures are warm to the touch or if a thermal imaging survey reveals hot spots on busbars and terminations, the causes are almost always loose terminations, overloaded conductors, or failing components — all of which represent fire risk and potential unplanned failure.",
        "Capacity constraints signal infrastructure that has reached its design limits. If your distribution boards are full with no spare ways, and solutions such as tandem MCBs have been fitted to accommodate additional circuits, the installation is not compliant and you have an infrastructure capacity problem that cannot be solved by adding circuits to existing boards.",
        "Age, overdue EICR, and upcoming refurbishment are the three administrative triggers that should prompt assessment even in the absence of operational symptoms. A commercial installation that has not been subject to an Electrical Installation Condition Report within five years — or that contains switchgear over 25 years old — should be professionally assessed. A Cat A or Cat B fit-out is the single best opportunity to address LV infrastructure before a space is finished, because corrective work in a completed commercial interior costs disproportionately more than addressing it during the strip-out or shell phase.",
      ],
      timeline: [
        {
          phase: "Stage 1",
          title: "Desktop Assessment",
          description:
            "Before any engineer visits site, a competent LV contractor reviews existing single-line diagrams, EICR reports, board schedules, and available load data. This establishes a baseline and identifies gaps in documentation that need to be filled before design can begin.",
          duration: "1–2 weeks",
        },
        {
          phase: "Stage 2",
          title: "Engineering Design",
          description:
            "An LV upgrade is an engineering project, not a shopping exercise. Your contractor produces updated single-line diagrams, cable sizing calculations, protection coordination studies, and a manufacturer-specific specification. For larger installations, a formal Power Systems Study may be required.",
          duration: "2–4 weeks",
        },
        {
          phase: "Stage 3",
          title: "Procurement",
          description:
            "Leading switchgear manufacturers — Schneider Electric, ABB, Eaton, Hager — operate formal contractor accreditation programmes. An accredited installer procures and builds panels to factory standards, with manufacturer technical support and guarantee backing the completed installation.",
          duration: "4–8 weeks",
        },
        {
          phase: "Stage 4",
          title: "Phased Installation",
          description:
            "In a live commercial building, the LV infrastructure cannot be de-energised and replaced in a single shutdown. A phased installation sequence maintains supply to critical areas throughout. Temporary supplies, phased circuit switchover, and out-of-hours working are standard tools.",
          duration: "Agreed with client",
        },
        {
          phase: "Stage 5",
          title: "Testing and Commissioning",
          description:
            "On completion, the installation is tested to BS 7671 and relevant switchgear standards. Protection coordination is verified against the design. The engineer signs and issues the Electrical Installation Certificate (EIC) — the legal document certifying the installation complies with BS 7671.",
          duration: "1–3 days",
        },
        {
          phase: "Stage 6",
          title: "Documentation and Handover",
          description:
            "At handover, the client receives updated single-line diagrams, revised board schedules, O&M manuals for all installed equipment, the EIC, and manufacturer warranties. This documentation is the client's property — keep it. It will be required for future EICR inspections, insurance, and the next round of works.",
          duration: "1 week",
        },
      ],
      methodology: [
        "Not all electrical contractors who offer LV work are equal. Commercial LV infrastructure is a specialist discipline that requires engineering capability, manufacturer relationships, and programme management competence. The market contains a wide spectrum — from specialist commercial contractors with qualified engineers and manufacturer accreditation, to general electrical contractors who will tender commercial LV work but lack the depth to deliver it to the required standard.",
        "NICEIC or ECA approval is the baseline. These bodies approve electrical contractors to self-certify work to BS 7671. NICEIC approval means the contractor's technical competence and quality of installed work are assessed annually by an independent visiting engineer — it is a condition of self-certification, not a marketing badge. Verify approval directly at niceic.com or eca.co.uk before awarding any contract. A contractor who claims approval but does not appear on the register is not approved.",
        "Design capability is equally important and harder to verify at tender stage. An LV upgrade requires engineering: updated single-line diagrams, cable sizing calculations to BS 7671 current-carrying capacity tables, protection coordination studies confirming discrimination between devices, and manufacturer-specific specifications. Ask to see these deliverables from a comparable project. If the contractor's answer is that they use manufacturer defaults or rely on the manufacturer's design service, ask how they verify that the defaults are appropriate for your specific installation. The answer will tell you a great deal.",
        "Manufacturer accreditation — Schneider Electric's contractor programme, ABB Value Provider status, Eaton's installer network — requires contractors to demonstrate product-range knowledge and meet installation standards. Accredited installers have access to factory-level technical support and training, which matters when non-standard conditions arise mid-project. An accredited installer procuring against a manufacturer's specification is also able to provide manufacturer-backed warranties on the completed switchboard, which a non-accredited contractor cannot.",
        "Professional indemnity insurance is the final verification step that is most frequently overlooked. LV design work carries professional liability: if an engineering calculation is incorrect and the resulting installation fails, the consequences extend beyond defects liability to third-party loss. Your contractor should carry professional indemnity insurance separate from public and employer's liability cover. Ask for the certificate of currency — the current-year document from their insurer — before awarding the contract, not as an afterthought during onboarding.",
      ],
      takeaways: [
        "Your building's LV infrastructure runs from the incoming mains to every final circuit — most commercial buildings are operating infrastructure that's 25–35 years old.",
        "Three forces degrade LV infrastructure simultaneously: physical ageing, load growth since installation, and manufacturer end-of-life. All three compound over time.",
        "Key warning signs: nuisance tripping, hot distribution boards, no spare board capacity, switchgear over 25 years old, and an upcoming Cat A or Cat B fit-out.",
        "A structured LV upgrade follows six stages: desktop assessment, engineering design, procurement, phased installation, testing and commissioning, documentation handover.",
        "Verify your LV contractor's NICEIC or ECA approval (independently, not just their letterhead), design capability, manufacturer accreditation, and PI insurance before awarding.",
        "A clear tender brief produces meaningful, comparable responses. Vague briefs produce vague prices — and the cheapest LV quote is rarely the right choice.",
      ],
      spotlight: [
        { label: "Typical Infrastructure Age", value: "25–35 yrs" },
        { label: "Upgrade Stages", value: "6" },
        { label: "BS 7671 Edition", value: "18th (A2)" },
      ],
      quote: {
        quote:
          "LV infrastructure work that is under-specified, incorrectly commissioned, or not certified to BS 7671 creates ongoing liability. Corrective work in a finished commercial space costs significantly more than getting it right first time.",
        author: "Nexgen Engineering Team",
        role: "Commercial LV Specialists",
      },
      conclusion: [
        "The DHL Reading Distribution Hub project illustrates what commercial LV delivery looks like in practice. Nexgen delivered a full Cat B electrical fit-out for a live 24/7 logistics operation — a scope that included an 800A TPN main distribution board to Schneider Electric specification, conveyor sorter power infrastructure, dock leveller supplies, and LED warehouse lighting across a high-bay distribution environment. The electrical infrastructure had to be designed and installed while the facility remained operational.",
        "The programme ran 14 weeks alongside Woodhouse as principal contractor. Delivering LV infrastructure in a live distribution centre — where a continuous shift pattern means any programme-critical incident carries immediate operational cost consequences — required detailed pre-construction planning, a phased installation sequence that maintained supply to active areas throughout, and close coordination with site operations management. The project completed on schedule. The certification package was ready at handover. DHL's go-live was achieved without delay.",
        "What that project demonstrates is not simply technical competence. It's the programme discipline and operational awareness to deliver in constrained environments under real commercial pressure. That's the standard you should expect from any commercial LV contractor you commission — and it's a reasonable standard to test at tender stage, by asking for specific project references at comparable scale and asking the contractor to walk you through how they managed the phasing.",
        "The quality of your LV tender brief determines the quality of responses you receive. Vague briefs attract vague prices — often artificially low because the contractor is excluding scope they were never asked to price. A brief that produces meaningful, comparable responses should include: the age and condition of existing switchgear, or a copy of the most recent EICR; current connected load and any anticipated increases; any manufacturer end-of-life constraints affecting existing equipment; downtime constraints including shift patterns and critical loads that cannot be interrupted; any planning or building control requirements relevant to the works; and the documentation package required at handover.",
        "When reviewing tender returns, go beyond the headline number. Ask about demonstrated experience at comparable scale — not domestic or light commercial, but projects of similar complexity and programme risk. Verify NICEIC or ECA approval independently via the relevant register. Ask to see a single-line diagram and protection coordination study from a comparable project. Confirm manufacturer accreditation is current, not historical. Check that professional indemnity insurance is in force. The cheapest price on an LV tender is rarely the right choice. LV infrastructure work that is under-specified, incorrectly commissioned, or not certified to BS 7671 creates ongoing liability — and corrective work in a finished commercial space costs significantly more than getting it right the first time.",
      ],
      toc: [
        { id: "overview", label: "What Is LV Infrastructure?", level: 1 },
        { id: "details", label: "Why Infrastructure Degrades", level: 1 },
        { id: "timeline", label: "The Upgrade Process — 6 Stages", level: 1 },
        {
          id: "methodology",
          label: "What to Expect From Your Contractor",
          level: 1,
        },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "conclusion", label: "Writing a Better Tender", level: 1 },
      ],
    },
  },
  {
    id: "news-dhl-001",
    slug: "dhl-reading-distribution-hub-case-study",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title: "DHL Reading Distribution Hub — LV Fit-Out",
    excerpt:
      "Nexgen delivered the full Cat B electrical fit-out for DHL's Reading distribution hub — an 800A TPN main distribution board, 3-phase conveyor power, and a complete certification package, all inside a 14-week programme in a live 24/7 logistics operation. Operational continuity was non-negotiable; the go-live was fixed.",
    description:
      "Cat B electrical fit-out for DHL Reading distribution hub — LV distribution, 3-phase conveyor power, and 14-week delivery with zero operational downtime.",
    featuredImage: {
      src: "/images/news/dhl-reading-case-study.jpg",
      alt: "DHL Reading distribution hub electrical installation",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Commercial LV Specialists",
    },
    partnerLabel: "Woodhouse",
    location: "Reading, Berkshire",
    readTime: "6 min",
    tags: [
      "DHL",
      "Case Study",
      "LV Distribution",
      "Cat B Fit-Out",
      "Conveyor Power",
      "Schneider Electric",
      "Distribution Hub",
      "Commercial",
    ],
    isFeatured: false,
    heroHeadline: ["DHL Reading", "Distribution Hub", "LV Fit-Out"],
    heroIndicators: [
      {
        icon: "Factory",
        title: "Live Operation",
        description:
          "Delivered in a 24/7 active distribution centre without disruption to operations",
      },
      {
        icon: "Zap",
        title: "800A TPN Board",
        description:
          "Schneider Electric main distribution board to full manufacturer specification",
      },
      {
        icon: "Clock",
        title: "14-Week Programme",
        description:
          "On-time delivery alongside Woodhouse as principal contractor",
      },
      {
        icon: "ClipboardCheck",
        title: "Full Certification",
        description:
          "Complete EICR and Electrical Installation Certificate at handover",
      },
    ] as const,
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-19",
    spotlightMetric: { label: "Programme", value: "14 weeks" },
    detail: {
      intro: [
        "DHL's Reading Distribution Hub is a high-bay, 24/7 logistics and parcel sorting facility operating continuous shifts in Reading, Berkshire. Nexgen delivered the full Cat B electrical fit-out as part of a tenant fit-out programme, working alongside Woodhouse as principal contractor. The scope was substantial: main LV distribution infrastructure, 3-phase power for conveyor sorting equipment, dock leveller supplies, and LED high-bay warehouse lighting installed across the full facility footprint.",
        "The electrical works centred on an 800A TPN main distribution board built to Schneider Electric specification — a panel that forms the backbone of the facility's entire power infrastructure. From that board, the 3-phase supply network fans out to the conveyor sorter systems that define the operational capability of the building. Every conveyor circuit, every dock leveller supply, and every lighting circuit in the warehouse passes through the electrical infrastructure Nexgen designed and installed.",
        "The fundamental challenge of this project was not technical complexity in isolation — it was the combination of a fixed go-live date, a live operational environment, and a 14-week programme window in which multiple trades were working simultaneously. DHL's go-live was immovable. Any delay to the electrical programme would have cascaded directly into a delayed building handover with immediate commercial consequences. This was a project where programme management and operational awareness were as critical as engineering execution.",
      ],
      challenges: [
        {
          title: "Live 24/7 Operation",
          description:
            "DHL operates continuous distribution shifts. Any electrical work creating unplanned operational disruption would have immediate cost consequences for the client.",
          solution:
            "Planned every shutdown window in advance with DHL operations. Temporary supply arrangements maintained power to critical areas. No unplanned operational stoppages occurred.",
        },
        {
          title: "Fixed Go-Live Date",
          description:
            "DHL's operational go-live was fixed. A delayed electrical programme would have cascaded into a delayed building handover and direct commercial loss for DHL.",
          solution:
            "Programme-managed the installation sequence against the critical path. Regular progress reviews with Woodhouse. Commissioning and EICR completed ahead of handover milestone.",
        },
        {
          title: "Multi-Trade Coordination",
          description:
            "The facility fit-out involved multiple trades working in a constrained space and programme. Electrical installation had to be sequenced with civils, mechanical, and fit-out teams without conflict.",
          solution:
            "Early engagement with the principal contractor at pre-construction stage. Clear demarcation of working zones and sequenced handover of areas. No programme-critical delays attributable to trade coordination.",
        },
      ],
      scope: [
        "800A TPN main LV distribution board (Schneider Electric specification and build)",
        "3-phase conveyor sorter power infrastructure throughout the facility",
        "Dock leveller electrical supplies — full dock count",
        "LED high-bay warehouse lighting complete installation",
        "Small power and general services distribution",
        "Site-wide cable containment — trunking and tray systems",
        "Full EICR and EIC certification package at handover",
      ],
      specifications: [
        {
          category: "Main Distribution",
          items: [
            { label: "Board Rating", value: "800A TPN" },
            { label: "Manufacturer", value: "Schneider Electric" },
            { label: "Build Standard", value: "Manufacturer specification" },
            { label: "Protection", value: "MCCB main incomer, MCCB sub-ways" },
          ],
        },
        {
          category: "Programme",
          items: [
            { label: "Duration", value: "14 weeks" },
            { label: "Principal Contractor", value: "Woodhouse" },
            { label: "Certification", value: "EICR + EIC at handover" },
            { label: "Incidents", value: "Zero programme-critical" },
          ],
        },
      ],
      results: [
        "Programme completed on schedule within 14-week window — DHL go-live achieved without delay",
        "Zero programme-critical incidents across the full installation programme",
        "800A TPN main distribution board installed and commissioned to Schneider Electric specification",
        "Full EICR and Electrical Installation Certificate issued at handover — facility ready for occupation",
        "DHL operational from day one of go-live — no post-handover remedials attributable to electrical works",
      ],
      takeaways: [
        "LV infrastructure in a live logistics facility requires phased planning before a single cable is pulled — shutdown windows cannot be improvised on site",
        "An 800A TPN board is not a commodity purchase — specifying it to manufacturer standards with an accredited installer means it carries a manufacturer guarantee and full type-test compliance",
        "A fixed go-live date is the real programme driver in tenant fit-out work. Electrical contractors who understand critical path management deliver differently from those who don't",
        "Working alongside a principal contractor on a complex multi-trade programme requires early engagement, clear zone demarcation, and direct communication — not just responding to instructions",
        "Full certification at handover is not a box-tick — it is the legal document that confirms the installation is safe, compliant with BS 7671, and the client's asset",
      ],
      spotlight: [
        { label: "Main Board Rating", value: "800A TPN" },
        { label: "Programme", value: "14 weeks" },
        { label: "Incidents", value: "Zero" },
      ],
      conclusion: [
        "Projects like DHL Reading are the benchmark for what Cat B electrical fit-out looks like at the commercial end of the logistics and distribution sector. Delivering this scope — an 800A TPN board to manufacturer specification, 3-phase conveyor infrastructure, dock levellers, high-bay lighting, and full containment — requires a contractor with the LV engineering capability to design and build the distribution infrastructure correctly, the Schneider Electric accreditation to back the installed equipment with a manufacturer guarantee, and the programme management discipline to bring it all together inside a fixed window. Logistics and warehousing facilities increasingly sit at the intersection of all three demands simultaneously.",
        "What the DHL project demonstrates specifically about Nexgen's approach is the emphasis on pre-construction engagement over reactive problem-solving. The phased installation sequence — maintaining supply to active operational areas throughout, coordinating shutdown windows with DHL's operations management, sequencing electrical work around other trades under Woodhouse's principal contract — was planned before work started, not improvised when conflicts arose. The certification package issued at handover was the result of a commissioning process that ran in parallel with the installation programme, not a last-minute task bolted onto the end of the job.",
        "For property managers, developers, and principal contractors procuring electrical work on similar facilities, the questions worth asking are straightforward: Can the contractor demonstrate experience at this scale, in live operational environments, not just shell-and-core fit-outs? Are they manufacturer-accredited for the specified distribution equipment — and can they show you the accreditation rather than simply claiming it? Do they have a track record of on-programme delivery in projects where the go-live date carried real commercial weight? This project is Nexgen's answer to those questions.",
      ],
      toc: [
        { id: "overview", label: "The Project", level: 1 },
        { id: "metrics", label: "Key Metrics", level: 1 },
        { id: "challenges", label: "Challenges", level: 1 },
        { id: "scope", label: "Scope of Works", level: 1 },
        { id: "specifications", label: "Technical Spec", level: 1 },
        { id: "results", label: "Outcomes", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "conclusion", label: "What This Demonstrates", level: 1 },
      ],
    },
  },
];

export const newsSidebarCards: NewsSidebarCard[] = [
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

export function getNewsArticleCounts(): Record<string, number> {
  return {
    all: allNewsArticles.length,
    ...Object.fromEntries(
      newsCategories.map((c) => [
        c.slug,
        allNewsArticles.filter((a) => a.category === c.slug).length,
      ]),
    ),
  };
}
export { newsCategoriesIntroData } from './categories-intro';
export { newsCategoryIntroData } from './category-intro';
export { newsCategoryColors } from "./category-colors";
