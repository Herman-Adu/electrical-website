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
  {
    id: "news-insight-001",
    slug: "why-cheap-electrical-contractors-cost-more",
    category: "insights",
    categoryLabel: "Insights",
    title: "Why the Cheapest Electrical Quote Rarely Delivers Value",
    excerpt:
      "All electrical quotes look the same on a page — 'qualified, insured, experienced.' What differs significantly is the compliance framework behind those words. NICEIC registration, Part P certification, and professional indemnity insurance each carry real consequences when they're missing. Here's how to read a quote properly.",
    description:
      "NICEIC registration, Part P compliance, and insurance — why the cheapest electrical quote rarely delivers value and what defective work costs to put right.",
    featuredImage: {
      src: "/images/news/why-cheap-electrical-contractors-cost-more.jpg",
      alt: "Electrical contractor reviewing compliance documentation",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Commercial LV Specialists",
    },
    readTime: "6 min",
    tags: [
      "NICEIC",
      "Part P",
      "Contractor Selection",
      "Insurance",
      "Compliance",
      "Electrical Safety",
      "BS 7671",
    ],
    isFeatured: false,
    heroHeadline: [
      "Why the Cheapest",
      "Electrical Quote",
      "Rarely Delivers Value",
    ],
    heroIndicators: [
      {
        icon: "Shield",
        title: "NICEIC Registered",
        description:
          "NICEIC approval means annual inspection of installed work — not just a logo on a letterhead",
      },
      {
        icon: "ClipboardCheck",
        title: "Part P Compliant",
        description:
          "Notifiable electrical work certified through the correct scheme, not skipped",
      },
      {
        icon: "Lightbulb",
        title: "Insights Guide",
        description:
          "Written for commercial and residential decision-makers evaluating electrical contractors",
      },
      {
        icon: "Award",
        title: "Verified Practice",
        description:
          "Independent verification of technical competence and quality of installed work",
      },
    ] as const,
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    spotlightMetric: { label: "Risk Categories", value: "3" },
    detail: {
      spotlight: [
        { label: "NICEIC Annual Visits", value: "1 per yr" },
        { label: "Part P Coverage", value: "Since 2005" },
        { label: "Risk Categories", value: "3" },
      ],
      intro: [
        "Every electrical contractor in the market uses the same language. Qualified, insured, experienced. The language is consistent because the words are easy to apply and difficult to disprove without doing work the client was never expecting to do. The cheapest quote feels like a rational decision when the underlying product appears identical — the same wires, the same fittings, the same claimed compliance.",
        "The problem is that behind those words lies a spectrum of compliance, insurance coverage, and professional accountability that varies significantly across the market. NICEIC registration, Part P self-certification, and professional indemnity insurance are not equivalent conditions across all contractors. The gap between a contractor who carries all three and one who carries none is invisible in the quote. It surfaces when the work is challenged, the property changes hands, or the insurance claim is raised.",
        "This guide covers three areas where compliance differences carry real financial and legal consequences: registration and self-certification, Part P notification, and insurance. It also covers how to verify each one — independently, through public registers and insurer-issued documents, rather than contractor-supplied copies.",
      ],
      body: [
        "NICEIC approval means a contractor is approved to self-certify electrical work to BS 7671. The scheme is not nominal. To gain approval, a contractor must pass an initial assessment of their technical competence and quality of installed work. To maintain it, they submit to annual site inspections where a visiting NICEIC engineer examines recently completed installations against the standard. A contractor whose work repeatedly fails those inspections loses their approval — and with it, their right to self-certify. The scheme exists precisely to ensure that work claiming to be self-certified to BS 7671 actually meets that standard. Without NICEIC or ECA approval, a contractor cannot self-certify: every notifiable job must be submitted to local building control, adding time and cost, or the work is left uncertified. Uncertified notifiable work is a building regulations offence.",
        "Part P of the Building Regulations makes certain electrical work notifiable in England. New circuits anywhere in a property, consumer unit replacements, and most electrical work in kitchens, bathrooms, and outbuildings must be certified through an approved scheme or submitted to building control. The practical implication of skipping notification is not only a technical offence. When you sell a property, your conveyancer will ask for certificates for notifiable electrical work carried out since 2005. If the work was performed by a non-scheme contractor and not submitted to building control, there is no certificate to produce. At minimum, this results in the purchase of a building regulations indemnity policy. At worst, it produces a delayed or abortive sale. For landlords, the exposure extends further: uncertified electrical work in a tenanted property creates a liability question that sits with the landlord, not the contractor who originally did the job.",
        "Three insurance types are relevant to electrical contracting work. Public liability insurance (PLI) covers third-party bodily injury and property damage arising from the contractor's operations — most contractors carry this, and most clients know to ask for it. Employer's liability insurance is a legal requirement for any contractor employing staff, covering injuries to employees at work. Professional indemnity insurance (PI) is where the spectrum narrows sharply. PI covers losses arising from professional negligence in design or specification. If a circuit is sized incorrectly, a protection device is under-specified, or a design decision leads to a system failure, the PI policy is what funds the remedy. Smaller contractors frequently carry PLI but not PI. The consequence is that design liability either remains with the client or sits uninsured — and the client may not know which until a claim is raised.",
        "The real cost of defective electrical work arrives from three directions. Remedial works: stripping back a completed domestic installation — wall tiles removed, plasterboard cut, finishes destroyed — to access and correct incorrect wiring will routinely exceed the original contract value. In a commercial setting, the cost of remediating a finished space adds to the cost of operational disruption during works. Fire damage: in a worst-case scenario, the insurance investigation will establish whether the installation was certified, whether that certification was issued through an approved scheme, and whether the work was notified correctly. An uncertified installation that contributes to a fire creates a liability question that is slow to resolve and may resolve unfavourably. Certification delays: a failed EICR at a property sale, triggered by works that were not properly certified, costs whatever it costs to remediate before re-inspection — plus the delay to exchange.",
        "The cheapest quote typically represents a contractor operating with lower overhead. Sometimes that reflects genuine operational efficiency. More often it reflects a lower compliance burden: no scheme membership, no annual assessment visits, no PI insurance premium. Those savings appear in the quote. They do not disappear — they reappear in a different form at a later point. The question worth asking when evaluating quotes is not why one contractor is cheaper, but what the cheaper contractor is not carrying that the others are. The answer determines whether the saving is real.",
      ],
      methodology: [
        "Check the NICEIC register independently at niceic.com — search by company name or postcode. Approval status is public information. Do not accept a logo on a letterhead or a scanned certificate as verification; check the live register directly. ECA membership can be verified at eca.co.uk — both are valid approval routes with different technical requirements.",
        "Ask specifically for the certificate of currency for public liability insurance. This is the current-year document from the contractor's insurer — not a copy of an old certificate — confirming the level of cover and the expiry date. The PLI level should be appropriate to the scope of work; for commercial contracts, £2m to £5m is standard.",
        "Ask specifically for professional indemnity insurance — a separate question from PLI, and one that many contractors are not asked. Request the certificate of currency. If the contractor does not carry PI, ask how design liability is handled on your project before proceeding. The answer will clarify your risk exposure.",
        "For any contractor employing staff, ask for employer's liability insurance confirmation. This is a legal requirement, not a discretionary coverage. Its absence is a signal about the contractor's wider approach to statutory compliance.",
        "Request at least two references from comparable recent work — projects of similar type, scale, and complexity. Ask the referee directly about programme adherence and certification quality at handover, not just overall satisfaction.",
        "Three questions worth asking every contractor before award: What NICEIC or ECA scheme are you registered under, and when was your last visiting engineer inspection? Who is your PI insurer and what is the current indemnity limit? Can you provide the most recent inspection certificate from your approval body? How readily and completely a contractor answers these questions is itself a data point.",
      ],
      takeaways: [
        "NICEIC approval involves annual physical inspection of installed work by an independent visiting engineer — it is a condition of self-certification, not a marketing badge",
        "Without scheme membership, notifiable Part P work either requires building control sign-off or goes uncertified — an offence that affects property sale, landlord liability, and insurance",
        "Professional indemnity insurance covers losses from design errors — it is the coverage type most often missing from cheaper contractors and the most relevant for any work involving specification or layout decisions",
        "Defective electrical work in a completed domestic space can cost more to remediate than the original contract; in a commercial environment, operational downtime adds a second cost layer",
        "Verify registration independently — niceic.com and eca.co.uk are public registers; approval status is searchable without asking the contractor",
        "Ask for certificates of currency, not copies of old documents — a certificate of currency is the current-year insurer-issued document confirming live cover",
      ],
      quote: {
        quote:
          "The difference between a registered and an unregistered contractor isn't visible in the quote. It becomes visible when the work is challenged, the property changes hands, or the insurance claim is raised.",
        author: "Nexgen Engineering Team",
        role: "Commercial LV Specialists",
      },
      conclusion: [
        "Electrical contracting is a regulated profession, but it is not self-policing. The obligation on the client is to verify that the contractor they appoint is operating within the compliance framework — because if they're not, the consequences fall on both parties. The contractor may face enforcement, but the client faces the non-compliant asset, the uncertified installation, and the insurance question.",
        "For commercial clients, the additional consideration is that electrical installations are assets with a traceable compliance history. An Electrical Installation Condition Report on a commercial property surfaces the installation's certification record. Gaps in that record — uncertified works, work not submitted to building control, work carried out by contractors who can no longer be traced — create a liability that belongs to the current building owner, not the contractor who originally cut corners.",
        "The cheapest electrical quote is not always the wrong choice. But it is never the right choice by default. Verify registration, confirm insurance, and ask the three questions before you award. The cost of that verification is negligible. The cost of not doing it is not.",
      ],
      toc: [
        { id: "spotlight", label: "The Numbers", level: 1 },
        { id: "overview", label: "The Cheap Quote Problem", level: 1 },
        { id: "details", label: "Three Risk Areas", level: 1 },
        { id: "methodology", label: "How to Verify a Contractor", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "A Note on Risk", level: 1 },
        { id: "conclusion", label: "The Bottom Line", level: 1 },
      ],
    },
  },
  {
    id: "news-insight-002",
    slug: "lv-charging-infrastructure-board-to-charging-point",
    category: "insights",
    categoryLabel: "Insights",
    title:
      "EV Charging Infrastructure: From LV Board to Charging Point",
    excerpt:
      "Your building has 40 parking spaces. You've been asked to install 20 EV chargers. Here's what nobody tells you until it's too late: EV charging is an LV infrastructure problem first, and a car park problem second. What commercial properties need to assess and upgrade before a single charger is specified.",
    description:
      "EV charging starts at the LV board, not the car park. What commercial properties need to assess and upgrade before installing EV chargers at scale.",
    featuredImage: {
      src: "/images/news/lv-charging-infrastructure-board-to-charging-point.jpg",
      alt: "Commercial EV charging infrastructure and LV distribution board",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Commercial LV Specialists",
    },
    readTime: "8 min",
    tags: [
      "EV Charging",
      "LV Infrastructure",
      "Commercial Property",
      "DNO",
      "Smart Charging",
      "Fleet Charging",
      "OZEV",
      "Commercial Electrical",
    ],
    isFeatured: false,
    heroHeadline: [
      "EV Charging Infrastructure",
      "From LV Board",
      "to Charging Point",
    ],
    heroIndicators: [
      {
        icon: "Building2",
        title: "Commercial Focus",
        description:
          "Written for property managers, fleet managers, and facilities directors commissioning EV infrastructure at scale",
      },
      {
        icon: "Zap",
        title: "LV Infrastructure First",
        description:
          "EV charging starts at the LV board, not the car park — infrastructure capacity determines what's possible",
      },
      {
        icon: "Lightbulb",
        title: "Insights Guide",
        description:
          "Practical reference covering LV assessment, DNO engagement, and the eight pre-commissioning questions",
      },
      {
        icon: "ClipboardCheck",
        title: "8-Point Checklist",
        description:
          "Eight questions to answer before any EV charger installation is commissioned",
      },
    ] as const,
    publishedAt: "2026-05-26",
    updatedAt: "2026-05-26",
    spotlightMetric: { label: "Pre-Commission Checks", value: "8" },
    detail: {
      spotlight: [
        { label: "Load per 7kW Charger", value: "32A" },
        { label: "DNO Notify Threshold", value: "69kW" },
        { label: "Pre-Commission Checks", value: "8" },
      ],
      intro: [
        "The EV charging conversation in commercial property is dominated by two things: the government mandate and the charger manufacturer's specification sheet. Both start at the car park. Neither starts at the LV board. The consequence is that properties are being quoted for EV charger installations that their electrical infrastructure cannot currently support — and nobody involved in the early discussion has flagged it, because nobody present had an incentive to raise the complication.",
        "A 7kW AC charger — the standard workplace charging unit — draws a 32A single-phase supply. A 22kW AC charger draws 32A three-phase. An installation of 20 × 7kW chargers represents an additional 40kW of continuous electrical load: roughly equivalent to adding a medium-sized office floor of equipment to your building's electrical system, all of it potentially running simultaneously overnight. Whether your existing LV infrastructure can absorb that load — in what configuration, at what cost, within what programme — is an engineering question. It should be answered before a planning application is submitted, before a charger manufacturer is approached, and certainly before a cable route is excavated.",
        "This article is a practical reference for commercial property managers, fleet managers, and facilities directors evaluating or specifying EV charging infrastructure. It covers what an LV assessment involves, what the common constraint scenarios look like in practice, and eight questions to answer before any charger installation is commissioned.",
      ],
      body: [
        "The main LV distribution board is the starting point for any EV infrastructure assessment. The fundamental question is available spare capacity: the difference between the board's rated current and the installation's current maximum demand. A board rated at 400A with a measured maximum demand of 340A has approximately 60A of theoretical spare capacity — enough for one or two 7kW chargers before demand management is considered. A board operating at 85–90% of its rated capacity has no meaningful spare capacity for additional continuous loads, and any charger installation requires either a new supply, a diversity management solution, or a board upgrade before a single charger can be specified.",
        "Maximum demand calculations in a commercial building account for diversity — the statistical expectation that not all loads operate at peak simultaneously. EV chargers do not behave like typical office equipment. Where vehicles charge overnight, multiple charger sessions overlap in the same window, eroding the diversity factor the distribution system was designed around. Smart charging (mandatory for chargers above 3.5kW under the EV Smart Charge Points Regulations 2021) manages this through demand scheduling — but the aggregate peak demand must still be within the LV infrastructure's capacity after smart charging is applied. The design needs to account for worst-case simultaneous demand, not just average load.",
        "Commercial EV infrastructure typically requires dedicated sub-metering — for energy cost recovery, fleet reimbursement, tenant billing, or DNO reporting. Where workplace charging is offered as an employee benefit, HMRC guidelines require accurate metering to determine the taxable value of the charge provided. Sub-metering requirements determine the distribution board architecture: a dedicated EV charging distribution board, a sub-main cable from the main switchboard, metering equipment, and communication links to the charge point management system (CPMS). These are electrical infrastructure additions that need to be designed and installed — they are not incidental to the charger installation, they are a prerequisite for it.",
        "For aggregate installations above 69kW — approximately 10 × 7kW chargers operating simultaneously — formal notification to the Distribution Network Operator (DNO) is required under Engineering Recommendation G99/G100. For larger commercial or industrial installations, the DNO may require a network capacity assessment before approving the connection: a process that can take several months and may result in a requirement for grid reinforcement, a connection upgrade, or a demand management agreement as a condition of consent. DNO engagement is the single most common cause of programme delay in commercial EV projects when it is started late. It should begin before a programme commitment is made to stakeholders, not after.",
        "Running sub-main cables from the LV switchroom to car park charging locations is often the largest single element of EV installation cost and programme. Cable routes through occupied buildings — through plant rooms, across ceiling voids, down external risers — require fire-stopping at every penetration, coordination with other services, and access to areas that are not always straightforward in a live commercial building. Trenching across car park surfaces or landscaped areas requires planning, potentially planning permission for certain route options, and significant reinstatement that is often underestimated at the outset. A well-designed commercial EV infrastructure makes provision for future expansion at the design stage: a main EV charging board sized for the ultimate charging capacity, pre-installed trunking and ducting to remote charging zones, and sufficient sub-main conductor capacity to serve future phases without requiring reinforcement. These provisions cost a fraction of retrospective remediation.",
      ],
      methodology: [
        "What is the rated current of your main LV distribution board and what is your installation's current maximum demand? Available spare capacity is the baseline — if there is none, your options are a new supply, load management, or a board upgrade before any charger is specified.",
        "Has your installation had an Electrical Installation Condition Report within the last five years? An EICR surfaces existing deficiencies that must be resolved before adding new continuous load. Proceeding without one means adding EV load to an infrastructure whose condition is unknown.",
        "Does your site have a three-phase supply to the LV board? Three-phase supply is required for 22kW AC chargers. Single-phase sites are limited to 7kW per charger — and if the aggregate load of multiple 7kW chargers exceeds board capacity, a supply upgrade may still be needed.",
        "What is the distance from the LV switchroom to the proposed charger locations? Cable route length directly affects conductor sizing, voltage drop calculations, and installation cost. Charger zones in remote car parks, separated from the building by roadways or landscaping, can make cable routes a dominant cost driver.",
        "Are there existing cable ducts, containment routes, or service trenches to the car park? Existing ducting eliminates groundworks. Its absence means trenching, reinstatement, and programme time — often the element that most surprises clients who have focused their planning on the charger cost.",
        "Is your aggregate planned charging load above 69kW? Above this threshold, DNO notification under G99/G100 is required. Above approximately 100kW, a formal DNO connection application and network capacity assessment may apply — allow several months, and start the process before any programme commitment is made.",
        "Do you need sub-metering for fleet cost recovery, tenant billing, or HMRC compliance? Sub-metering requirements determine the distribution board architecture and communications design — they affect how the main switchboard needs to be configured, not just where the charger sits in the car park.",
        "Is any car park resurfacing, landscaping work, or major access works already planned within the next 12–18 months? Installing EV cable ducts during planned groundworks is significantly more cost-effective than excavating a completed surface. If resurfacing is planned, design the EV ducting provision into that programme now.",
      ],
      takeaways: [
        "An EV charger installation is an LV infrastructure project first — the charger is the last item specified, not the first; the LV board determines what is possible",
        "20 × 7kW chargers adds 40kW of continuous load to your building — check board spare capacity before approaching any charger supplier or programme manager",
        "Smart charging is mandatory above 3.5kW and manages demand peaks, but does not eliminate them — aggregate peak demand must still be within infrastructure capacity after scheduling is applied",
        "DNO engagement for installations above 69kW can take several months — start it before making any programme commitments to stakeholders, not after",
        "Sub-metering requirements (fleet reimbursement, tenant billing, HMRC) are infrastructure design inputs that determine board architecture — they are not incidental to the charger installation",
        "Provision for future phases at the design stage — oversized EV board, pre-installed ducting — costs a fraction of retrospective reinforcement in a finished car park",
      ],
      quote: {
        quote:
          "The question we hear most often is 'can we add chargers to our car park?' The correct first question is 'what can our LV board currently support?' The answer to the second question determines whether the first is straightforward or a full infrastructure project.",
        author: "Nexgen Engineering Team",
        role: "Commercial LV Specialists",
      },
      conclusion: [
        "The commercial EV charging market has a structural communication problem. Charger manufacturers sell chargers. Charge point management software providers sell software. Installation companies quote installation. Very few parties in those conversations have an incentive to raise the LV infrastructure question early — because doing so complicates the sale, extends the programme, and may require work that the party raising it is not equipped to deliver. The consequence is that property managers and fleet managers are committing to EV programmes against a backdrop of infrastructure constraints they were not told about, discovering them mid-project when the cost and programme implications are at their worst.",
        "The DHL Reading Distribution Hub project illustrates what an LV infrastructure designed with headroom looks like in practice. The 800A TPN main distribution board Nexgen installed isn't solely the power supply for today's conveyor systems — it is the electrical backbone that supports future load growth across the facility, including EV infrastructure as DHL electrifies its fleet operations. Infrastructure designed with future capacity in mind is always cheaper than infrastructure retrofitted under pressure. The principle applies as directly to a commercial car park as to a distribution warehouse.",
        "The eight questions in this guide are a structured starting point, not a substitute for a full assessment. A commercial EV charging feasibility study by a qualified LV engineer — covering board capacity, DNO requirements, metering architecture, cable routes, and phasing strategy — costs a fraction of the downstream expense of identifying an infrastructure gap after a programme commitment has been made and a car park has been dug up. Commission the assessment before you commission the chargers.",
      ],
      toc: [
        { id: "spotlight", label: "Key Numbers", level: 1 },
        { id: "overview", label: "The EV Charging Problem", level: 1 },
        { id: "details", label: "What Needs to Happen First", level: 1 },
        { id: "methodology", label: "8 Pre-Commission Questions", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "A Note From the Field", level: 1 },
        { id: "conclusion", label: "Commission the Assessment First", level: 1 },
      ],
    },
  },
  {
    id: "news-res-001",
    slug: "home-ev-charging-residential-electrical-guide",
    category: "residential",
    categoryLabel: "Residential",
    title: "Home EV Charging: What Your Electrical System Needs First",
    excerpt:
      "Just bought an EV — or about to? Before you ring an installer, three things are worth checking about your home's electrical system. Consumer unit capacity, earthing arrangement, and smart charger compliance determine whether your installation is a straightforward job or something that needs engineering first.",
    description:
      "What your home's wiring actually needs before you install an EV charger — consumer unit, earthing, smart charger rules, and OZEV grant eligibility.",
    featuredImage: {
      src: "/images/news/home-ev-charging-residential-electrical-guide.jpg",
      alt: "Residential EV charger installation on a house exterior",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Residential Electrical Specialists",
    },
    readTime: "6 min",
    tags: [
      "EV Charging",
      "Residential Electrical",
      "OZEV Grant",
      "Consumer Unit",
      "Smart Charging",
      "Part P",
      "Home Electrification",
    ],
    isFeatured: false,
    heroHeadline: [
      "Home EV Charging",
      "What Your Electrical",
      "System Needs First",
    ],
    heroIndicators: [
      {
        icon: "Home",
        title: "Residential Focus",
        description:
          "Written for homeowners and landlords considering EV charger installation",
      },
      {
        icon: "Zap",
        title: "Smart Charger Ready",
        description:
          "EV Smart Charge Points Regulations 2021 — smart chargers are mandatory for new installations",
      },
      {
        icon: "Award",
        title: "OZEV Grant",
        description:
          "Up to £350 off a home charger — OZEV EVHS grant eligibility explained",
      },
      {
        icon: "Shield",
        title: "Part P Certified",
        description:
          "EV charger installation is notifiable work — certification required at completion",
      },
    ] as const,
    publishedAt: "2026-05-26",
    updatedAt: "2026-05-26",
    spotlightMetric: { label: "OZEV Grant", value: "£350" },
    detail: {
      spotlight: [
        { label: "OZEV EVHS Grant", value: "Up to £350" },
        { label: "Circuit Rating", value: "32A radial" },
        { label: "Smart Charger", value: "Mandatory" },
      ],
      intro: [
        "The most common question when someone buys an electric vehicle is 'how do I get a charger at home?' It's a reasonable question, and in most cases the answer is straightforward. But the answer depends on what's already in your home — specifically your consumer unit, your earthing arrangement, and whether your electrical system can support a dedicated 32A radial circuit without anything needing to be upgraded first.",
        "A domestic EV charger installation is not complicated electrical work, but it is regulated electrical work. It is notifiable under Part P of the Building Regulations, which means it must be certified by an approved scheme contractor or submitted to building control. It requires a dedicated 32A circuit from your consumer unit to the charger location. And since 2022, any new charger installed in England must be a smart charger — a device capable of communicating with the grid and scheduling charging, not just a dumb socket that draws maximum power from the moment you plug in.",
        "This guide covers what your home's electrical system actually needs before a charger is installed, what the OZEV Electric Vehicle Homecharge Scheme (EVHS) grant covers, and what to check before you ring an installer — so you're not surprised by what comes up during the survey.",
      ],
      body: [
        "The starting point is your consumer unit. An EV charger draws a continuous 32A load: that's the equivalent of a large electric shower running non-stop for however many hours your vehicle charges. Your consumer unit needs a spare 32A way to accommodate the new circuit. A modern consumer unit with RCBO protection and a spare way is the ideal scenario — the new circuit drops in cleanly. An older consumer unit without spare capacity, or one that uses rewirable fuses rather than MCBs, presents a different picture. At minimum, a spare way needs to be created. At worst, the consumer unit requires replacement — work that, while not triggered solely by the EV charger, brings the whole installation up to current standards as a side benefit.",
        "Your home's earthing arrangement matters more for EV charging than for most domestic electrical additions. The three earthing systems in UK domestic properties are TN-S (separate neutral and protective conductors from the street), TN-C-S (combined neutral and earth from the distribution network, fed into your main earth terminal — this is PME, the most common arrangement), and TT (earth electrode at the property, no metallic earth return path). For TT systems, an EV charger installation requires careful attention: the charger must either have a mode 3 socket with appropriate protective devices or use a charger with built-in protection suitable for TT earthing. Your installer should identify the earthing system during the pre-installation survey — if they don't, ask.",
        "The EV Smart Charge Points Regulations 2021 (amended 2022) make smart charging functionality mandatory for all new EV chargepoints installed at domestic premises in England, Wales, and Scotland. A smart charger can communicate with the grid, respond to time-of-use tariff signals, and schedule charging to off-peak hours. For most homeowners, this means the charger can be set to charge overnight on an off-peak tariff — cheaper electricity and a flatter load on the distribution network. What this means practically is that you cannot lawfully install a standard hardwired socket or a basic 'dumb' EVSE unit as a home charger any longer. Any installer offering a non-smart unit for a new residential installation in 2024 onwards is offering non-compliant equipment.",
        "The Office for Zero Emission Vehicles Electric Vehicle Homecharge Scheme (OZEV EVHS) provides a grant of up to £350 towards the cost of a home EV charger installation. To be eligible, you must own or have ordered a qualifying EV or plug-in hybrid (PHEV), the property must be a home with off-street parking, and the charger must be installed by an OZEV-approved installer using eligible equipment. The grant is applied directly by the installer — you don't apply separately. Landlords have access to a separate OZEV landlord grant for rental properties with off-street parking, covering up to £350 per socket for up to 200 sockets per landlord application. If you are a landlord fitting chargers across a rental portfolio, the landlord scheme is the correct route. Ask your installer which scheme applies to your situation before the installation is booked.",
        "EV charger installation is notifiable work under Part P of the Building Regulations — it must be either certified by an approved scheme contractor (NICEIC, ECA, NAPIT) or submitted to building control. This certification is the document that confirms the installation meets BS 7671 and Building Regulations requirements. It is not an optional extra: you will need it if you sell the property, if your buildings insurer asks for evidence of compliance, or if an EV charger fault becomes the subject of an insurance claim. Ask for the Electrical Installation Certificate at handover — if your installer cannot provide one, they are not an approved scheme contractor and the installation is not properly certified.",
      ],
      methodology: [
        "Check your consumer unit before booking an installation survey. Count the spare ways — if the unit is full, or uses rewirable fuses, flag this to the installer before the survey so they can cost the full scope. Modern consumer units with spare ways mean the charger circuit installs cleanly; older units may need work first.",
        "Identify your earthing system. Look for the main earthing terminal near your consumer unit and check whether there is a green-and-yellow earth cable running to an earth rod at the property (TT system) or whether the earth is connected to the supply cable sheath or meter tails (TN-S or TN-C-S). If you cannot identify it, tell the installer — they should confirm it during the survey.",
        "Choose a smart charger model before booking installation — not after. OZEV-approved charger models are listed on the OZEV website. Selecting an approved model before the survey ensures the grant application runs smoothly and there are no equipment compatibility issues on the day.",
        "Confirm the installer is OZEV-approved before booking. Only OZEV-approved installers can apply the EVHS grant on your behalf. Ask for their OZEV installer number and check it against the OZEV approved installer list. If they can't provide it, the grant won't be applied at installation — and retrospective applications are not possible.",
        "Ask about cable routing during the survey, not on installation day. The 32A cable route from consumer unit to charger location — through the house, into the garage, or across an external wall — involves decisions about containment, drilling, and finish that are worth agreeing in advance. Unexpected routes add cost and time on the day.",
        "Request the Electrical Installation Certificate at handover. This is the Part P certification document — it confirms the installation is compliant, certified through an approved scheme, and notified correctly. File it with your property documents alongside any other electrical certificates.",
      ],
      takeaways: [
        "A home EV charger needs a dedicated 32A radial circuit — check your consumer unit has a spare way before booking; if not, unit work may be needed first",
        "Smart chargers are mandatory for new residential installations — any installer offering a non-smart unit for a new installation is offering non-compliant equipment",
        "OZEV EVHS grant is up to £350 off installation; landlords use a separate scheme covering up to 200 sockets — confirm with an OZEV-approved installer before booking",
        "Your earthing arrangement (TN-S, TN-C-S/PME, or TT) affects charger selection and protective device requirements — the installer should identify it during the survey",
        "EV charger installation is notifiable under Part P — you must receive an Electrical Installation Certificate at handover; no certificate means the work is not properly certified",
        "OZEV-approved installer status matters: only approved installers can apply the grant on your behalf — check the OZEV approved installer list before booking",
      ],
      quote: {
        quote:
          "Most home EV charger installations are straightforward — a spare way in the consumer unit, a clean cable route, a smart charger on the approved list. The survey is where edge cases surface. Book the survey before you book the installation date.",
        author: "Nexgen Engineering Team",
        role: "Residential Electrical Specialists",
      },
      conclusion: [
        "A home EV charger installation is not the most technically demanding electrical project, but it involves more than the marketing suggests. Consumer unit capacity, earthing arrangements, smart charger compliance, and Part P certification all need to be in order for the installation to be correct, compliant, and covered by the OZEV grant. None of these are barriers — they are engineering checks that a competent, OZEV-approved installer carries out as part of a proper installation.",
        "The pre-installation survey is where the specifics of your property's electrical system are assessed. A thorough survey covers consumer unit capacity and condition, earthing system identification, cable route planning, and confirmation of OZEV grant eligibility. It should take 30–45 minutes and produce a written scope and quotation that reflects the actual work required, not a generic charger price that later attracts add-on charges for the consumer unit work that was always going to be needed.",
        "If you are buying an EV in the near future, the practical step is to book a survey with an OZEV-approved, NICEIC-registered installer before your vehicle arrives — not after. Installation lead times vary, and having the charger ready when the car arrives is significantly more convenient than using public charging while you wait for a slot.",
      ],
      toc: [
        { id: "spotlight", label: "Grant & Spec", level: 1 },
        { id: "overview", label: "What the Installation Involves", level: 1 },
        { id: "details", label: "What Your Home Needs", level: 1 },
        { id: "methodology", label: "Six Steps Before You Book", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "A Note on Surveys", level: 1 },
        { id: "conclusion", label: "Book Early, Not After", level: 1 },
      ],
    },
  },
  {
    id: "news-commercial-002",
    slug: "commercial-pat-testing-facilities-managers-guide",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Commercial PAT Testing: A Guide for Facilities Managers",
    excerpt:
      "PAT testing in a commercial setting is not the same problem as booking an annual inspection visit. Facilities managers responsible for multi-site portfolios or logistics operations are managing a compliance programme — with insurance conditions, risk-based frequency schedules, and documentation obligations that a label and a summary sheet do not satisfy.",
    description:
      "How commercial property managers structure PAT testing compliance — scheduling, insurance requirements, risk-based frequency, and documentation.",
    featuredImage: {
      src: "/images/news/commercial-pat-testing-facilities-managers-guide.jpg",
      alt: "PAT testing equipment and electrical asset register in a commercial environment",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Commercial Electrical Specialists",
    },
    readTime: "7 min",
    tags: [
      "PAT Testing",
      "Commercial Property",
      "Facilities Management",
      "IET Code of Practice",
      "Electrical Safety",
      "Insurance Compliance",
      "Asset Register",
      "Electricity at Work Regulations",
    ],
    isFeatured: false,
    heroHeadline: [
      "Commercial PAT Testing",
      "A Guide for",
      "Facilities Managers",
    ],
    heroIndicators: [
      {
        icon: "Building2",
        title: "Commercial Focus",
        description:
          "Written for facilities managers responsible for PAT compliance across commercial property portfolios",
      },
      {
        icon: "ClipboardCheck",
        title: "IET Code of Practice",
        description:
          "Risk-based frequency assessment using the IET CoP — the recognised method for commercial PAT compliance",
      },
      {
        icon: "Shield",
        title: "Insurance Alignment",
        description:
          "Commercial policies frequently contain electrical maintenance conditions — know what yours requires",
      },
      {
        icon: "Award",
        title: "NICEIC Registered",
        description:
          "PAT testing by an approved contractor producing documentation that satisfies insurer and regulator requirements",
      },
    ] as const,
    publishedAt: "2026-05-29",
    updatedAt: "2026-05-29",
    spotlightMetric: { label: "Equipment Classes", value: "3" },
    detail: {
      intro: [
        "PAT testing in a commercial setting is not the same problem as booking an annual inspection visit for a small office. A facilities manager responsible for multiple buildings, hundreds of portable appliances, or a logistics operation with high-turnover equipment is managing a compliance programme — with its own scheduling logic, documentation requirements, and insurance implications. Treating it as a single annual visit, repeated without review, is one of the most common ways that commercial PAT compliance develops gaps without anyone noticing.",
        "The regulatory basis is the Electricity at Work Regulations 1989, which require that electrical systems and equipment be maintained in a safe condition. The Regulations impose a duty; they do not specify how to fulfil it. The Health and Safety Executive's recognised method is the IET Code of Practice for In-Service Inspection and Testing of Electrical Equipment (4th edition). The IET CoP provides the framework for risk-based frequency assessment — what type of equipment, in what environment, used how often, warrants what retesting interval. Annual testing is not mandated for all equipment. It is the correct frequency for some categories and excessive for others.",
        "This guide is for facilities managers responsible for PAT compliance across commercial portfolios: office buildings, warehouses, retail premises, or mixed-use sites. It covers how the IET CoP frequency framework applies to commercial environments, what insurance conditions typically require, how to structure documentation that satisfies an insurer or enforcement inquiry, and the specific considerations for logistics and high-turnover environments where equipment control is as important as testing frequency.",
      ],
      body: [
        "The IET Code of Practice classifies portable appliances by equipment class and operating environment. Class I equipment depends on an earth connection for protection — desktop computers, floor-standing printers, catering equipment, power tools. Class II equipment is double-insulated — most power supplies, some portable tools, battery chargers. Class III equipment operates at safety extra-low voltage (SELV) — below 50V AC — and presents the lowest electrical risk. For each class, the IET CoP provides recommended retesting intervals by environment: office and hotel environments warrant the longest intervals; commercial kitchens, construction sites, and warehouses warrant significantly shorter ones. Class I equipment in a standard office environment — a desktop computer used eight hours per day by the same person — might reasonably be on a four-year retest cycle based on risk assessment. The same class of equipment in a commercial kitchen or warehouse, subject to physical handling, moisture, and higher-frequency use, warrants an annual or sub-annual interval.",
        "Commercial property insurance is the area where PAT compliance most directly affects financial exposure for facilities managers — and the area where the implications are most frequently misunderstood. Many commercial and property owner insurance policies contain conditions around electrical equipment maintenance. These conditions vary between policies and between insurers, but the common thread is consistent: if an electrical fault causes a fire, a business interruption loss, or a theft claim (triggered by a door held open by an extension lead, for example), and the insurer's investigation reveals that electrical equipment was not maintained to an industry-recognised standard, the policy conditions may not be met. That can mean a reduced settlement or a declined claim. The IET Code of Practice is the recognised standard against which maintenance is assessed. What your policy specifically requires — whether it mandates annual testing, references the IET CoP, or leaves frequency to the duty holder's assessment — should be confirmed with your insurance broker in writing and held on file.",
        "A logistics or warehousing environment presents PAT challenges that a standard commercial office programme does not. Equipment changes hands between shifts, is moved between buildings, is borrowed by contractors, and is sometimes replaced ad hoc with non-standard items procured outside normal purchasing routes. In a distribution centre operating continuous shift patterns, the risk is not just that equipment ages between test dates — it is that the equipment in active use at any given time may not be the equipment that was tested. Managing this requires operational controls alongside testing: a visible pass label system that allows any operator to identify untested or out-of-date equipment at a glance, a defined incoming equipment process that quarantines new or transferred items until tested, and a register that is updated in real time rather than once per year.",
        "An asset register is the operational foundation of any commercial PAT programme. Without one, retesting intervals cannot be managed, failed equipment cannot be tracked through remediation, and documentation cannot be produced in the event of an insurance or enforcement inquiry. The minimum a commercial asset register needs to capture is: unique asset identifier, equipment description, equipment class, test date, next test date, test result (pass/fail for visual inspection, insulation resistance in MΩ, earth continuity in Ω for Class I equipment), any remedial action taken, and the name of the contractor who carried out the test. A barcode or QR label system linked to a management database makes re-test scheduling systematic — automated reminders when items are due, immediate register update when tests are completed, and instant access to historical records for any item. For large estates, this is not a luxury; it is the only practical way to maintain accuracy across hundreds of assets.",
        "The contractor delivering your PAT programme determines the quality of the documentation you receive. A contractor who issues pass/fail labels and a one-line summary has delivered a testing visit; they have not delivered a compliance programme. The documentation you need is a test register that identifies each appliance individually, records its class, shows the test results as numeric values (not just pass/fail), notes any visual failures separately from electrical failures, and includes the tester's identification and qualification. That register is the document an insurance loss adjuster or HSE inspector will ask for. It should be available in a format that can be retained electronically and produced on request — a PDF or CSV export from a management system, not a handwritten log that may not survive a move or a filing restructure.",
      ],
      methodology: [
        "Establish the asset register before the testing programme, not alongside it. If a register does not exist, commission the PAT contractor to carry out an inventory audit as part of the first testing cycle: walk the estate, tag all in-scope equipment, test it, and produce the baseline register in a single programme. Starting with a known, tagged inventory eliminates the uncertainty about what is in scope and where it is.",
        "Apply the IET Code of Practice risk matrix to determine frequency bands for each equipment category. Group your estate by environment — office, commercial kitchen, warehouse, plant room — and within each environment by equipment class. The IET CoP tables give recommended initial intervals; apply them as the starting point for your written risk assessment, not as fixed mandatory schedules. The written risk assessment is what demonstrates the frequency decision was made on identifiable grounds, not arbitrary choice.",
        "Confirm your insurance policy's electrical maintenance conditions with your broker before setting your schedule. Some policies specify annual testing for all portable appliances regardless of risk category; others reference the IET CoP and defer to the duty holder's assessment. If your policy contains a specific frequency requirement, your programme must meet it. A copy of your broker's written confirmation of what the policy requires should be held alongside your PAT register.",
        "Implement an incoming equipment control process. Any equipment arriving on site — purchased, transferred from another location, borrowed by or from a contractor, or hired — should either be PAT tested before it enters service or quarantined in a designated area until tested. This is especially important in logistics and warehousing environments where equipment movement is continuous. A simple tagging system — green label for tested, yellow label for quarantine pending test — is enough to make the control visible to operational staff.",
        "Commission the contractor to update your asset register, not just issue test labels. The test visit should conclude with an updated electronic register identifying every item tested, every failure and remedial action, and the next test date for each asset. Retain the register in a format you can access without contacting the contractor — exported CSV or PDF — and back it up. The register's value is in its accessibility when it is needed, which is often at short notice.",
        "Review your frequency bands annually, not just at test time. Equipment categories change as operations evolve: new equipment classes enter service, old equipment is retired, environments change with tenancy or operational activity. A brief annual review of the risk assessment — updating equipment categories and frequency bands to reflect current operations — keeps the programme current and the written justification accurate.",
      ],
      takeaways: [
        "PAT testing frequency is determined by risk assessment, not mandatory annual schedules — the IET Code of Practice provides the recognised framework; document the assessment, not just the testing",
        "Commercial insurance policies often contain electrical maintenance conditions — confirm what yours requires in writing from your broker; a declined claim after a fire is not the moment to find a compliance gap",
        "Class I equipment in kitchens, warehouses, and construction environments warrants significantly shorter retesting intervals than equivalent equipment in office environments — the same equipment class, different risk profile",
        "An asset register with individual item tracking, numeric test results, and remedial action records is the compliance foundation — a pass/fail label is an operational control, not a compliance document",
        "Incoming equipment controls are as important as the testing schedule — untested equipment entering service in high-turnover environments is the most common source of compliance gaps",
        "The contractor delivers the documentation, not just the test — insist on a test register that produces numeric results, identifies equipment class, and is available in a format you can retain and access independently",
      ],
      quote: {
        quote:
          "The test label tells your staff that an item was tested. The test register tells your insurer, your regulator, and your lawyer what was tested, when, to what standard, and what was done when it failed. Both matter — but they are not the same thing.",
        author: "Nexgen Engineering Team",
        role: "Commercial Electrical Specialists",
      },
      conclusion: [
        "Compliance with the Electricity at Work Regulations in a commercial setting does not require a rigid annual testing schedule applied uniformly to every portable appliance in the building. It requires demonstrable maintenance of electrical equipment to a safe standard, with a documented risk assessment justifying the frequency decisions and test records that can be produced on request. A programme built around the IET Code of Practice — with frequency bands grounded in risk assessment, an asset register that is updated at every test cycle, and documentation produced by a competent contractor — is both compliant and defensible in the event of an insurer or enforcement inquiry.",
        "The test register is the document that matters most in a compliance challenge. It demonstrates that the programme was systematic rather than reactive, that equipment failures were identified and addressed rather than labelled over, and that the duty holder — the facilities manager and the organisation they represent — took the Electricity at Work Regulations seriously as an operational obligation. A stack of test labels confirms that a visit took place. A properly maintained register confirms that a programme is in place.",
        "For facilities managers inheriting a PAT programme without clear documentation, the practical step is a baseline audit — a single visit by the PAT contractor to inventory, tag, test, and register all in-scope equipment across the estate. That baseline produces the asset register and sets the frequency schedule. From that point, the programme is systematic: scheduled retests, incoming equipment control, and annual risk assessment review. The cost of the baseline audit is a fraction of the cost of reconstructing compliance records after an event that required them.",
      ],
      toc: [
        { id: "overview", label: "What PAT Means at Portfolio Scale", level: 1 },
        { id: "details", label: "Frequency, Risk, and Insurance", level: 1 },
        { id: "methodology", label: "Structuring Your PAT Programme", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Label vs Register", level: 1 },
        { id: "conclusion", label: "Documentation That Works", level: 1 },
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
