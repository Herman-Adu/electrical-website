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
      src: "/images/projects/commercial/dhl/nexgen-dhl-reading-main-lv-distribution-board.jpg",
      alt: "LV main distribution board — commercial electrical infrastructure",
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
        "Most commercial building managers can describe what their building does — far fewer could describe what their LV electrical infrastructure consists of, when it was installed, or what condition it's in. That gap is a risk of the kind that produces unplanned shutdowns, failed insurance inspections, and fit-out programmes derailed by infrastructure that should have been addressed years earlier. LV electrical systems — from the main switchboard through sub-distribution boards to every final circuit — are the invisible backbone of a commercial building, and most are operating well beyond their original design life.",
      ],
      body: [
        "Physical degradation, load growth, and manufacturer end-of-life act simultaneously on ageing LV infrastructure. Switchgear installed in the 1980s and 1990s was designed for a service life of 20–25 years: cables with early PVC insulation become brittle through thermal cycling, bus bar connections loosen without regular torque-checking, and arc chutes clear fewer fault operations than their rated figures. At the same time, load profiles have changed fundamentally — a building that originally housed desktop computers and a small kitchen may now run dense IT infrastructure, close-control air conditioning, and EV charging points that its distribution system was never sized for.",
        "Regulatory change adds a further dimension. BS 7671 18th Edition and its second amendment introduced RCD protection requirements, AFDD provisions, and protective equipotential bonding standards that many existing installations do not meet. An installation that was compliant when built may no longer satisfy current wiring regulations, with direct implications for insurance, building control sign-off on refurbishment works, and liability in the event of an incident.",
      ],
      specifications: [
        {
          category: "Distribution Board Standards",
          items: [
            { label: "Wiring Regulations", value: "BS 7671: 2018 + A2: 2022 (18th Edition, 2nd Amendment)" },
            { label: "RCD protection", value: "Required for all socket-outlet circuits up to 32A — 18th Edition Ch. 41" },
            { label: "AFDD provisions", value: "Arc fault detection device requirements introduced in 18th Edition" },
            { label: "Certification", value: "Electrical Installation Certificate (EIC) — required on completion of new installations" },
            { label: "EICR frequency", value: "5-yearly recommended for commercial premises; triggered on any change of use or significant load change" },
          ],
        },
        {
          category: "Protection Requirements",
          items: [
            { label: "Main protection", value: "MCCB (Moulded Case Circuit Breaker) on main incomer — rated to maximum demand" },
            { label: "Sub-main protection", value: "MCCBs on each sub-main feed; discrimination study required" },
            { label: "Final circuit protection", value: "MCBs to BS EN 60898; RCDs to BS EN 61008 where mandated" },
            { label: "Power factor correction", value: "Required on installations with significant motor or inductive load — assessed site-by-site" },
          ],
        },
        {
          category: "Cable Specifications",
          items: [
            { label: "Sub-main cable sizing", value: "Sized to BS 7671 current-carrying capacity tables — load, installation method, and grouping factors applied" },
            { label: "Containment", value: "Steel trunking, cable tray, or conduit to IP rating appropriate to environment" },
            { label: "PVC insulation life", value: "20–25 years typical; thermal cycling accelerates degradation in high-load environments" },
            { label: "XLPE alternative", value: "Cross-linked polyethylene — higher temperature rating, longer service life, specified for replacement works" },
          ],
        },
        {
          category: "Regulatory Thresholds",
          items: [
            { label: "Switchgear end-of-life", value: "25 years — beyond this, spare parts availability and type-tested replacements cannot be guaranteed" },
            { label: "Emergency replacement cost", value: "Typically 3–5× the cost of a planned upgrade when a switchboard fails unplanned in a live building" },
            { label: "Manufacturer programmes", value: "Schneider Electric, ABB, Eaton, Hager — all operate formal contractor accreditation and end-of-life notification processes" },
          ],
        },
      ],
      scope: [
        "LV board capacity assessment — current maximum demand, spare ways, and rated current against actual load profile",
        "EICR condition inspection — age, visible degradation, protection device calibration, and code C1/C2/C3 findings",
        "Single-line diagram production or update — full distribution topology from incoming mains to final circuits",
        "Protection coordination study — discrimination verification between all devices in the distribution hierarchy",
        "Cable sizing and containment survey — sub-main and final circuit conductors assessed against current BS 7671 tables",
        "Regulatory compliance gap analysis — 18th Edition RCD and AFDD requirements against existing installation",
      ],
      challenges: [
        {
          title: "Nuisance Tripping and Failing Protection Devices",
          description:
            "Circuit breakers that trip under normal operating loads or fail to hold on reset indicate overloaded circuits, ageing protective devices losing calibration, or intermittent fault conditions the system cannot clear definitively. This is typically the first visible symptom of infrastructure past its design life.",
          solution:
            "Thermal imaging survey to identify hot spots at terminations and busbars, followed by a protection coordination study. Devices operating outside calibration are replaced; overloaded circuits are reconfigured or the sub-board is upgraded to restore rated capacity.",
        },
        {
          title: "No Spare Board Capacity for New Circuits",
          description:
            "Distribution boards that are full — with tandem MCBs fitted to accommodate additional circuits — represent a non-compliant installation and an infrastructure capacity problem. The condition is common in commercial buildings where load has grown incrementally since the original installation.",
          solution:
            "Sub-board extension or replacement with a new board of adequate size, properly sized sub-main cable from the upstream distribution point, and a revised board schedule. Future-phase capacity is designed in at this stage rather than repeating the problem.",
        },
        {
          title: "Planned Fit-Out Disrupted by Undiagnosed Infrastructure Condition",
          description:
            "A Cat A or Cat B fit-out programme discovers aged or non-compliant LV infrastructure at strip-out — too late to address without programme impact. Remedial electrical work in a finished commercial interior costs disproportionately more than addressing it during the shell or strip-out phase.",
          solution:
            "LV desktop assessment and site survey carried out before RIBA Stage 4 — identifying infrastructure constraints before design is fixed. Upgrade works are programmed into the fit-out sequence, not retrofitted after completion.",
        },
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
      infographic: {
        src: "/images/news/infographic-lv-upgrade-process.png",
        alt: "LV infrastructure upgrade process — 6-stage flowchart",
        caption: "LV Infrastructure Upgrade: 6-Stage Process",
      },
      toc: [
        { id: "overview", label: "What Is LV Infrastructure?", level: 1 },
        { id: "details", label: "Why LV Infrastructure Degrades", level: 1 },
        { id: "specifications", label: "Technical Standards and Specifications", level: 1 },
        { id: "scope", label: "What an LV Assessment Covers", level: 1 },
        { id: "challenges", label: "Common LV Upgrade Challenges", level: 1 },
        { id: "timeline", label: "The Six-Stage Upgrade Process", level: 1 },
        { id: "infographic", label: "LV Upgrade Process Flowchart", level: 1 },
        { id: "methodology", label: "How to Select a Qualified LV Contractor", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "conclusion", label: "Writing a Better Tender Brief", level: 1 },
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
      src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-cable-tray-installation.jpg",
      alt: "Cable tray installation at DHL Reading distribution hub — Cat B electrical fit-out",
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
        { id: "specifications", label: "Technical Specifications", level: 1 },
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
      src: "/images/projects/commercial/medivet/nexgen-medivet-watford-testing-commissioning.jpg",
      alt: "Electrical testing and commissioning — NICEIC-certified contractor work",
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
        "Every electrical contractor in the market uses the same language — qualified, insured, experienced. Behind those words lies a spectrum of compliance, insurance coverage, and professional accountability that varies significantly across the market. The gap between a contractor carrying NICEIC registration, Part P self-certification authority, and professional indemnity insurance and one carrying none of these is invisible in the quote — and it surfaces when the work is challenged, the property changes hands, or the insurance claim is raised. Choosing by price alone is a false economy with a deferred cost.",
      ],
      body: [
        "NICEIC approval means a contractor is approved to self-certify electrical work to BS 7671. To gain approval, a contractor must pass an initial assessment of technical competence and quality of installed work; to maintain it, they submit to annual site inspections where a visiting NICEIC engineer examines recently completed installations against the standard. Without NICEIC or ECA approval, a contractor cannot self-certify: every notifiable job must go to local building control, or the work is left uncertified — a Building Regulations offence.",
        "Professional indemnity insurance is where the compliance spectrum narrows most sharply. Public liability insurance covers third-party bodily injury and property damage — most contractors carry it and most clients know to ask. PI insurance covers losses arising from professional negligence in design or specification: an incorrectly sized circuit, an under-specified protection device, or a design decision that leads to system failure. Smaller contractors frequently carry PLI but not PI — leaving design liability either with the client or uninsured, and the client may not know which until a claim is raised.",
      ],
      specifications: [
        {
          category: "NICEIC and NAPIT Certification",
          items: [
            { label: "NICEIC register", value: "Public search at niceic.com — approval status verifiable by company name or postcode" },
            { label: "ECA register", value: "Public search at eca.co.uk — separate approval route with equivalent BS 7671 self-certification authority" },
            { label: "Annual inspection", value: "NICEIC visiting engineer assesses recently completed installations annually — approval can be withdrawn for repeated failures" },
            { label: "Self-certification scope", value: "Approved contractors self-certify notifiable work; non-approved contractors must notify building control — adding time, cost, or leaving work uncertified" },
          ],
        },
        {
          category: "Building Regulations Part P",
          items: [
            { label: "Notifiable work", value: "New circuits anywhere; consumer unit replacements; electrical work in kitchens, bathrooms, and outbuildings" },
            { label: "Enforcement in force", value: "Since 1 January 2005 — conveyancers request certificates for notifiable work carried out since that date" },
            { label: "Non-certification consequence", value: "Building regulations indemnity policy required at property sale, or delayed / abortive exchange" },
            { label: "Landlord exposure", value: "Uncertified electrical work in tenanted property — liability sits with landlord, not original contractor" },
          ],
        },
        {
          category: "BS 7671 References",
          items: [
            { label: "Current edition", value: "BS 7671: 2018 + A2: 2022 — 18th Edition, 2nd Amendment" },
            { label: "Design liability trigger", value: "Any work involving circuit sizing, protection specification, or layout decisions creates professional liability" },
            { label: "EIC requirement", value: "Electrical Installation Certificate required on completion of a new installation or significant alteration" },
          ],
        },
        {
          category: "Remediation Cost Ranges",
          items: [
            { label: "Domestic remediation", value: "Stripping back a completed domestic installation to correct incorrect wiring routinely exceeds the original contract value" },
            { label: "Commercial remediation", value: "Finished commercial space remediation adds operational disruption cost to the physical remedial works cost" },
            { label: "EICR failure at sale", value: "Failed EICR triggered by uncertified works — remediation cost plus delay to exchange; in worst cases, abortive transaction" },
          ],
        },
      ],
      scope: [
        "NICEIC or ECA registration with current annual visiting engineer inspection — verifiable independently through public registers",
        "Part P self-certification authority for all notifiable work types relevant to the project scope",
        "Public liability insurance at an appropriate limit for the scale of work — certificate of currency from the insurer, not a scanned historic certificate",
        "Professional indemnity insurance covering design and specification liability — separate from PLI and frequently absent in lower-cost contractors",
        "Employer's liability insurance where the contractor employs staff — a statutory requirement, not optional coverage",
        "Comparable project references verifiable by client contact — demonstrating programme adherence and certification quality at handover",
      ],
      challenges: [
        {
          title: "Uncertified Notifiable Work Surfaces at Property Sale",
          description:
            "Electrical work carried out by a non-scheme contractor and not submitted to building control produces no certificate. When the property is sold, the conveyancer requests certificates for notifiable work since 2005. The absence triggers either a building regulations indemnity policy or a delayed exchange — at the seller's cost.",
          solution:
            "Instruct only NICEIC or ECA-registered contractors for notifiable work. Verify registration independently before award. Retain the EIC or Building Regulations Completion Certificate at handover — it is the seller's evidence at any future transaction.",
        },
        {
          title: "Design Liability Is Uninsured After a Fault",
          description:
            "A contractor without professional indemnity insurance cannot fund losses arising from design errors — incorrectly sized circuits, under-specified protection, or specification decisions that lead to system failure. The liability falls to the client or remains unresolved, which the client may not discover until a claim is raised.",
          solution:
            "Ask specifically for PI insurance as a separate question from PLI at tender stage. Request the certificate of currency — the current-year insurer-issued document. If the contractor does not carry PI, clarify in writing how design liability is allocated before any contract is signed.",
        },
        {
          title: "Defective Work in a Completed Space Costs More to Remedy Than to Do Correctly",
          description:
            "Remediating incorrect wiring in a finished domestic installation — tiles removed, plasterboard cut, finishes destroyed — routinely exceeds the original contract value. In a commercial environment, the remedial works cost combines with operational disruption cost and a potential failed EICR before re-occupation.",
          solution:
            "Evaluate total risk cost, not headline price. The compliance overhead carried by approved, insured contractors is reflected in their pricing — and it is the overhead that funds the remedy if something goes wrong. A contractor with no scheme membership and no PI is cheaper because they are not carrying those costs; the client carries them instead.",
        },
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
        { id: "spotlight", label: "The Compliance Numbers", level: 1 },
        { id: "overview", label: "Why Cheap Quotes Carry Hidden Costs", level: 1 },
        { id: "details", label: "NICEIC, Part P, and Insurance — The Risk Areas", level: 1 },
        { id: "specifications", label: "Certification and Regulatory Reference", level: 1 },
        { id: "scope", label: "What a Qualified Contractor Provides", level: 1 },
        { id: "challenges", label: "What Goes Wrong With Unqualified Contractors", level: 1 },
        { id: "methodology", label: "How to Verify a Contractor Before Award", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "conclusion", label: "The Bottom Line on Contractor Selection", level: 1 },
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
      src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-3-phase-distribution-board.jpg",
      alt: "Three-phase distribution board — commercial electrical infrastructure for EV charging",
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
        "The EV charging conversation in commercial property is dominated by the government mandate and the charger manufacturer's specification sheet — both start at the car park, neither starts at the LV board. Properties are being quoted for EV charger installations their electrical infrastructure cannot currently support, and the gap goes unraised because nobody present has an incentive to flag it. An installation of 20 × 7kW chargers adds 40kW of continuous load to your building: an engineering question that must be answered before a planning application is submitted, a charger manufacturer is approached, or a cable route is excavated.",
      ],
      body: [
        "The main LV distribution board is the starting point for any EV infrastructure assessment. The fundamental question is available spare capacity: the difference between the board's rated current and the installation's current maximum demand. A board rated at 400A with a measured maximum demand of 340A has approximately 60A of theoretical spare capacity — enough for one or two 7kW chargers before demand management is considered. A board operating at 85–90% of its rated capacity has no meaningful spare capacity for additional continuous loads, and any charger installation requires either a new supply, a diversity management solution, or a board upgrade before a single charger can be specified.",
        "Maximum demand calculations in a commercial building account for diversity — the statistical expectation that not all loads operate at peak simultaneously. EV chargers do not behave like typical office equipment. Where vehicles charge overnight, multiple charger sessions overlap in the same window, eroding the diversity factor the distribution system was designed around. Smart charging manages this through demand scheduling — but the aggregate peak demand must still be within the LV infrastructure's capacity after smart charging is applied. The design needs to account for worst-case simultaneous demand, not just average load.",
      ],
      specifications: [
        {
          category: "LV Infrastructure Thresholds",
          items: [
            {
              label: "Load per 7kW AC charger",
              value: "32A single-phase",
            },
            {
              label: "Load per 22kW AC charger",
              value: "32A three-phase",
            },
            {
              label: "Smart charging mandate",
              value: "Mandatory above 3.5kW — EV Smart Charge Points Regulations 2021",
            },
            {
              label: "DNO notification threshold",
              value: "69kW aggregate (approx. 10 × 7kW chargers) — Engineering Recommendation G99/G100",
            },
            {
              label: "DNO formal application trigger",
              value: "Above approx. 100kW — network capacity assessment required; allow several months",
            },
          ],
        },
        {
          category: "Sub-Metering Requirements",
          items: [
            {
              label: "Cost recovery categories",
              value: "Fleet reimbursement, tenant billing, energy cost recovery, DNO reporting",
            },
            {
              label: "HMRC compliance",
              value: "Accurate metering required where workplace charging is an employee benefit — determines taxable value",
            },
            {
              label: "Board architecture implications",
              value: "Dedicated EV charging distribution board, sub-main cable from main switchboard, metering equipment, CPMS communication links",
            },
          ],
        },
      ],
      scope: [
        "LV board capacity assessment — rated current, current maximum demand, and available spare capacity",
        "DNO engagement process — notification requirements under G99/G100 and connection application timeline",
        "Cable route planning — sub-main routing from LV switchroom to car park charging zones, groundworks, and fire-stopping",
        "Sub-metering architecture — board design for fleet reimbursement, tenant billing, and HMRC compliance",
        "Future-phase provision — oversized EV board, pre-installed trunking and ducting sized for ultimate charging capacity",
        "Smart charging compliance — EV Smart Charge Points Regulations 2021 and worst-case simultaneous demand design",
      ],
      challenges: [
        {
          title: "Infrastructure Capacity Gap Discovered After Commitment",
          description:
            "Properties commit to EV programmes — and in some cases submit planning applications or approach charger suppliers — before an LV assessment has been completed. When the infrastructure gap is identified mid-project, the cost and programme implications are at their worst: a board upgrade or new supply cannot be accelerated to meet an already-announced programme.",
          solution:
            "Commission an LV infrastructure assessment before any programme commitment is made. The assessment covers board spare capacity, supply configuration, DNO obligations, and cable route options — it is the prerequisite that determines what the programme can credibly promise.",
        },
        {
          title: "DNO Programme Delay from Late Engagement",
          description:
            "DNO engagement for installations above 69kW is the single most common cause of programme delay in commercial EV projects. When notification under G99/G100 is initiated after a stakeholder programme has been communicated, the months-long DNO assessment process — and any resulting requirement for grid reinforcement or a demand management agreement — cannot be absorbed without slipping the committed dates.",
          solution:
            "Start DNO engagement before any programme commitment is made to stakeholders. For larger installations above approximately 100kW, initiate the formal connection application process at the same time as the feasibility assessment, not after a contractor has been appointed.",
        },
        {
          title: "Cable Route Cost Underestimated at Outset",
          description:
            "Clients and programme managers typically focus planning attention on charger specification and quantity. The sub-main cable route from the LV switchroom to car park charging locations — through occupied buildings, across ceiling voids, down risers, and potentially involving excavation and reinstatement across car park surfaces — is frequently the largest single cost element and the one most likely to carry a programme risk that was not modelled at the outset.",
          solution:
            "Include cable route survey and groundworks assessment in the initial feasibility scope. Where resurfacing or major access works are already planned within 12–18 months, design EV cable ducting provision into that programme — the marginal cost is a fraction of excavating a completed surface retrospectively.",
        },
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
      infographic: {
        src: "/images/news/infographic-ev-readiness-checklist.png",
        alt: "EV readiness checklist for commercial properties",
        caption: "EV Readiness Checklist: 8 Pre-Commission Questions",
      },
      toc: [
        { id: "spotlight", label: "Key Numbers", level: 1 },
        { id: "overview", label: "Why EV Charging Is an LV Problem First", level: 1 },
        { id: "details", label: "LV Board Capacity and Demand Assessment", level: 1 },
        { id: "specifications", label: "Infrastructure Thresholds and Compliance Standards", level: 1 },
        { id: "scope", label: "What This Guide Covers", level: 1 },
        { id: "challenges", label: "Common Planning Failures and How to Avoid Them", level: 1 },
        { id: "methodology", label: "8 Pre-Commission Questions", level: 1 },
        { id: "infographic", label: "EV Readiness Checklist", level: 1 },
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
      src: "/images/projects/residential/domestic-installations/nexgen-taplow-consumer-unit-replacement.jpg",
      alt: "Consumer unit replacement — residential electrical preparation for EV charger installation",
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
        { id: "spotlight", label: "Grant & Specifications", level: 1 },
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
      src: "/images/services-testing.jpg",
      alt: "PAT testing in a commercial environment — portable appliance inspection and certification",
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
      infographic: {
        src: "/images/news/infographic-pat-frequency-guide.png",
        alt: "PAT testing frequency guide — IET Code of Practice risk matrix",
        caption: "PAT Testing Frequency Guide: IET Code of Practice",
      },
      toc: [
        { id: "overview", label: "What PAT Means at Portfolio Scale", level: 1 },
        { id: "details", label: "Frequency, Risk, and Insurance", level: 1 },
        { id: "infographic", label: "PAT Frequency Guide", level: 1 },
        { id: "methodology", label: "Structuring Your PAT Programme", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Label vs Register", level: 1 },
        { id: "conclusion", label: "Documentation That Works", level: 1 },
      ],
    },
  },
  {
    id: "news-res-002",
    slug: "landlord-pat-testing-obligations-guide",
    category: "residential",
    categoryLabel: "Residential",
    title: "Landlord PAT Testing: Obligations, HMO Rules, and What Actually Needs to Be Tested",
    excerpt:
      "Landlords supplying electrical appliances as part of a furnished tenancy carry obligations under the Electricity at Work Regulations 1989. The scope is defined by the inventory — and for HMO landlords, PAT compliance is a licensing condition, not a recommendation.",
    description:
      "Landlord PAT testing obligations under the Electricity at Work Regulations — EICR vs PAT, HMO licensing conditions, frequency assessment, and the documentation that matters.",
    featuredImage: {
      src: "/images/projects/residential/domestic-installations/nexgen-taplow-handover-certified.jpg",
      alt: "Electrical handover certificate — landlord compliance documentation",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Residential Electrical Specialists",
    },
    readTime: "6 min",
    tags: [
      "PAT Testing",
      "Landlord Compliance",
      "HMO",
      "EICR",
      "Electricity at Work Regulations",
      "IET Code of Practice",
      "Residential Electrical",
      "Furnished Tenancy",
    ],
    isFeatured: false,
    heroHeadline: [
      "Landlord PAT Testing",
      "Obligations, HMO Rules,",
      "What Needs Testing",
    ],
    heroIndicators: [
      {
        icon: "Home",
        title: "Residential Focus",
        description:
          "Written for residential landlords managing single lets, HMOs, and portfolio properties",
      },
      {
        icon: "Shield",
        title: "Legal Obligations",
        description:
          "Electricity at Work Regulations 1989 apply to landlord-supplied appliances in furnished tenancies",
      },
      {
        icon: "ClipboardCheck",
        title: "IET Code of Practice",
        description:
          "Risk-based frequency assessment using the IET CoP — the recognised framework for landlord PAT compliance",
      },
      {
        icon: "Award",
        title: "NICEIC Registered",
        description:
          "PAT testing by an approved contractor producing documentation that satisfies licensing inspections and insurance",
      },
    ] as const,
    publishedAt: "2026-05-29",
    updatedAt: "2026-05-29",
    spotlightMetric: { label: "EICR Cycle", value: "5 years" },
    detail: {
      spotlight: [
        { label: "EICR Cycle", value: "5 years" },
        { label: "Furnished Let Obligation", value: "Landlord-supplied" },
        { label: "HMO Licensing", value: "Required" },
      ],
      intro: [
        "The Electricity at Work Regulations 1989 apply to landlords who supply electrical equipment as part of a tenancy. For a furnished let, that includes every portable appliance provided with the property. The landlord's duty extends to those appliances — not only to the fixed installation. It is a maintenance obligation: the equipment must be kept in a safe condition throughout the tenancy, not just at the point of letting.",
        "The obligations are not the same across all tenancy types. A single-let furnished property carries different risk than an HMO. An HMO licence includes electrical safety conditions — meaning PAT compliance is a licensing condition, not merely a recommendation. A landlord operating an HMO without a PAT register, or with a register that is not current, is not just exposed to a compliance gap. They may be in breach of their licence conditions.",
        "This guide is for residential landlords managing single lets, HMOs, or mixed portfolios. It covers the legal basis for the obligation, how EICR and PAT differ and why each is needed, how to set testing frequency using the IET Code of Practice, and what documentation a landlord needs to hold to satisfy licensing inspections, insurance inquiries, and enforcement action.",
      ],
      body: [
        "The Electricity at Work Regulations 1989 impose a duty on those in control of electrical systems and equipment to ensure they are maintained in a safe condition. For landlords, that duty extends to electrical equipment supplied as part of a furnished tenancy — every appliance on the tenancy inventory is, in principle, in scope. The IET Code of Practice for In-Service Inspection and Testing of Electrical Equipment (4th edition) is the recognised method for discharging that duty in relation to portable appliances. It provides a risk-based framework for determining how often equipment in different categories and environments should be tested. Using the IET CoP as the basis for a frequency schedule is not merely best practice — it is the approach that demonstrates, in the event of an enforcement inquiry or insurance claim, that the landlord took a reasoned and documented approach to the obligation.",
        "EICR and PAT are separate obligations that address different parts of the same legal framework. An Electrical Installation Condition Report is an inspection of the fixed wiring and installation — the consumer unit, circuits, sockets, and all permanent electrical infrastructure within the property. Under the Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020, a valid EICR is required every five years for all residential tenancies. PAT testing is the inspection and testing of portable appliances supplied by the landlord — the washing machine, fridge, toaster, television, and any other appliance on the inventory. An EICR does not cover portable appliances. A current PAT register does not remove the obligation for a five-year EICR. Both are required, and neither substitutes for the other.",
        "For HMO landlords, PAT compliance operates within the mandatory licensing framework under the Housing Act 2004. Local authorities set licence conditions for HMOs, and electrical safety — including the maintenance of landlord-supplied appliances — is a standard condition. In practice, this means that a licensing inspection or a complaint-triggered visit may specifically check that a current PAT register exists for the property and that it covers the appliances supplied by the landlord. A landlord who cannot produce the register, or who holds only pass labels without a supporting test register, is in a materially weaker position than one with a properly documented programme. In the most straightforward assessment: if your HMO licence can be lost, PAT compliance is a licence condition, not a recommendation.",
        "The scope of the landlord's PAT obligation is defined by the boundary of landlord-supplied equipment. Items on the tenancy inventory that were provided by the landlord are in scope. Items brought to the property by the tenant are the tenant's responsibility and are not the landlord's PAT obligation. In communal areas of HMOs — shared kitchens, laundry rooms, common living spaces — all equipment supplied by the landlord is in scope, and the communal nature of the usage typically means shorter retest intervals are appropriate: shared equipment, used by multiple people in varied ways, presents a higher-risk profile than the same equipment type in a single-occupancy property. The inventory is the starting point. Every item on it that was landlord-supplied is potentially in scope.",
        "Frequency under the IET Code of Practice is a function of equipment type and operating environment. In a furnished residential let, kitchen and laundry appliances — microwaves, kettles, washing machines, dishwashers, toasters — are used regularly by occupants who may not treat them with the same care as owner-occupiers, and in an environment where moisture, food residue, and physical handling are routine. The IET CoP framework supports annual or two-year intervals for this category in rented accommodation. Living room and bedroom equipment — televisions, lamps, audio equipment — in the same tenanted environment can often be assessed at two-to-four year intervals. A written risk assessment documenting the reasoning for frequency decisions, per equipment category, is what transforms a PAT label into a defensible compliance record.",
      ],
      methodology: [
        "Take a full inventory of landlord-supplied appliances — every item on the tenancy inventory that was provided by the landlord is potentially in scope; the inventory is the starting point for the scope assessment, not an afterthought",
        "Apply the IET CoP risk matrix per category — kitchen appliances annual or two-year intervals; living area and bedroom equipment two to four years; document the reasoning for each category in a written risk assessment that is held alongside the test register",
        "Commission a qualified PAT contractor to produce a registered asset list — not just test labels, but a full numeric test register identifying each appliance individually, showing test results, test date, and next test date",
        "For HMOs, hold the PAT register as part of the licence compliance file — local authority licensing inspections will check it; the register should be current, accessible, and cover all communal areas as well as landlord-supplied items in individual rooms",
        "Confirm your insurance policy's electrical maintenance conditions with your broker in writing before setting your schedule — some landlord insurance policies contain specific maintenance requirements; the written confirmation should be held alongside the PAT register",
        "At every tenancy changeover, visually inspect all landlord-supplied appliances — consider testing if the next scheduled test date is more than six months away for kitchen and laundry equipment, as changeover is the moment of highest risk for undetected damage or misuse",
      ],
      takeaways: [
        "Electricity at Work Regulations apply to landlords — the obligation is to maintain landlord-supplied appliances in safe condition; the IET Code of Practice is the recognised method for setting frequency and producing the documentation that demonstrates compliance",
        "EICR and PAT are separate obligations — EICR covers the fixed installation every five years; PAT covers landlord-supplied portable appliances on a risk-assessed frequency; neither replaces the other",
        "HMO landlords face stricter obligations — PAT compliance is typically a licensing condition under Housing Act 2004 mandatory licensing; the test register forms part of the licence compliance file and may be checked at inspection",
        "The obligation applies only to landlord-supplied appliances — tenant-owned property is not the landlord's PAT responsibility; the boundary is defined by the tenancy inventory",
        "Kitchen and laundry appliances in rented accommodation warrant shorter retest intervals than equivalent equipment in owner-occupied homes — multiple users, moisture, and high-frequency use increase the risk profile materially",
        "Documentation — a proper test register with numeric results — is what satisfies insurance conditions, licensing inspections, and enforcement inquiries; pass labels alone are not sufficient evidence of a compliance programme",
      ],
      quote: {
        quote:
          "The label tells the tenant the appliance was tested. The register tells the licensing officer, the insurance loss adjuster, and the enforcement inspector everything they need to know. One is a sticker; the other is evidence.",
        author: "Nexgen Engineering Team",
        role: "Residential Electrical Specialists",
      },
      conclusion: [
        "The landlord's PAT obligation is a maintenance and documentation responsibility, not a complex engineering challenge. Appliances in scope are defined by the inventory. Frequency is set by a risk assessment using the IET Code of Practice. The contractor produces the register. The register is held, kept accessible, and updated at each test cycle. That programme, executed consistently, is what demonstrates compliance with the Electricity at Work Regulations in the event of any inquiry.",
        "For HMO landlords, PAT compliance sits within a broader regulatory framework that includes licensing, planning, and fire safety. The PAT register is the element most likely to be checked at a licensing inspection — because it is documentable and checkable in a way that some other obligations are not. A landlord with a current, well-maintained register in a proper compliance file is in a fundamentally different position from one relying on a folder of expired test labels.",
        "The most common gap in landlord PAT compliance is the boundary question. Landlords who treat tenant appliances as their responsibility overspend and create confusion about inventory ownership. Landlords who leave landlord-supplied appliances off the register may find that the distinction is unhelpful when an insurance claim is raised or a licensing inspector is on site. The starting point is the inventory — every appliance the landlord owns and supplies is in scope. Everything else is not.",
      ],
      specifications: [{
        category: 'Regulatory Framework',
        items: [
          { label: 'Legislation', value: 'EICR 5yr cycle, Housing Act 2004, Electricity at Work Regs 1989' },
          { label: 'Obligation Scope', value: 'Furnished lets, HMO communal areas, landlord-boundary appliances' },
          { label: 'Enforcement', value: 'Local authority inspection, civil liability, insurance invalidation' }
        ]
      }],
      scope: [
        'Portable appliances provided with the tenancy (white goods, kettles, lamps)',
        'HMO communal area equipment (hoovers, shared kitchen appliances)',
        'Landlord-supplied items in furnished lets',
        'Any appliance within the landlord boundary'
      ],
      infographic: {
        src: "/images/news/infographic-pat-frequency-guide.png",
        alt: "PAT testing frequency guide — equipment class and environment risk matrix",
        caption: "PAT Testing Frequency Guide: IET Code of Practice Risk Matrix",
      },
      toc: [
        { id: "spotlight", label: "At a Glance", level: 1 },
        { id: "overview", label: "Landlord PAT Obligations", level: 1 },
        { id: "details", label: "EICR vs PAT vs HMO Rules", level: 1 },
        { id: "specifications", label: "Regulatory Framework", level: 1 },
        { id: "scope", label: "What Landlord PAT Covers", level: 1 },
        { id: "infographic", label: "PAT Frequency Guide", level: 1 },
        { id: "methodology", label: "Six Steps for Landlords", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Register vs Label", level: 1 },
        { id: "conclusion", label: "The Boundary Question", level: 1 },
      ],
    },
  },
  {
    id: "news-ind-001",
    slug: "industrial-pat-testing-puwer-compliance-guide",
    category: "industrial",
    categoryLabel: "Industrial",
    title: "Industrial PAT Testing and PUWER Compliance: Class I, Class II, and 110V CTE Systems",
    excerpt:
      "PUWER 1998 creates the legal duty to maintain work equipment in industrial environments. PAT testing is the electrical inspection component — and in construction and manufacturing settings, equipment class, operating environment, and 110V CTE systems require a significantly different approach from standard commercial testing.",
    description:
      "Industrial PAT testing under PUWER 1998 — equipment classes, 110V CTE system procedures, RIDDOR implications, and documentation for industrial and construction environments.",
    featuredImage: {
      src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-plant-room-installation.jpg",
      alt: "Plant room electrical installation — industrial compliance and testing",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Industrial Electrical Specialists",
    },
    readTime: "8 min",
    tags: [
      "PAT Testing",
      "PUWER",
      "Industrial Electrical",
      "110V CTE",
      "RIDDOR",
      "Equipment Classes",
      "Construction Site",
      "IET Code of Practice",
    ],
    isFeatured: false,
    heroHeadline: [
      "Industrial PAT Testing",
      "PUWER Compliance",
      "110V CTE Systems",
    ],
    heroIndicators: [
      {
        icon: "Factory",
        title: "Industrial Focus",
        description:
          "Written for health and safety managers, facilities engineers, and site managers in industrial environments",
      },
      {
        icon: "Shield",
        title: "PUWER 1998",
        description:
          "Provision and Use of Work Equipment Regulations — PAT testing is the electrical inspection component of PUWER compliance",
      },
      {
        icon: "Zap",
        title: "110V CTE Systems",
        description:
          "Reduced-voltage systems used on UK construction and industrial sites require separate testing procedures",
      },
      {
        icon: "ClipboardCheck",
        title: "RIDDOR Compliance",
        description:
          "Electrical incidents resulting in hospitalisation are RIDDOR-reportable — the PAT register is the documentary defence",
      },
    ] as const,
    publishedAt: "2026-05-29",
    updatedAt: "2026-05-29",
    spotlightMetric: { label: "PUWER Year", value: "1998" },
    detail: {
      spotlight: [
        { label: "PUWER Year", value: "1998" },
        { label: "Equipment Classes", value: "3" },
        { label: "CTE Voltage", value: "110V" },
      ],
      intro: [
        "PUWER 1998 — the Provision and Use of Work Equipment Regulations — applies to all work equipment in UK workplaces. PAT testing is the electrical inspection component for portable and transportable equipment within that framework. In industrial environments where equipment operates under continuous load, is operated by multiple workers across shifts, and handles materials under physical stress, both the legal framework and the risk profile are more demanding than in light commercial settings. The duty is not aspirational; it is statutory.",
        "Equipment class, operating environment, and PUWER inspection frequency interact in ways that a standard commercial PAT programme does not address. Class I equipment on a construction site or in a manufacturing facility — angle grinders, drills, welding sets, portable heaters — requires a significantly different approach from Class II double-insulated equipment in a dry, temperature-controlled environment. And 110V reduced-voltage equipment, used across UK construction sites and many industrial settings as a risk-reduction measure, has its own testing procedures and record requirements that not all PAT contractors are equipped to deliver.",
        "This guide is for health and safety managers, facilities engineers, and site managers in industrial, manufacturing, and construction environments. It covers the PUWER framework as it applies to portable electrical equipment, how equipment classes map to industrial tool categories and retest intervals, how 110V CTE systems sit within the compliance picture, and what documentation satisfies both a PAT contractor's register and a PUWER inspection record.",
      ],
      body: [
        "PUWER 1998 requires that work equipment is maintained in an efficient state, in efficient working order, and in good repair throughout its working life. For portable electrical equipment, the IET Code of Practice for In-Service Inspection and Testing of Electrical Equipment provides the recognised method for the electrical inspection element of that duty. The distinction matters: PUWER sets the legal duty; the IET CoP provides the framework for fulfilling it in relation to electrical testing. A PAT programme designed around the IET CoP is a PUWER-compliant approach to the electrical inspection component. A PAT programme that ignores the IET CoP framework — testing everything annually on a uniform schedule regardless of equipment class or environment — may fulfil the letter of the duty but does not demonstrate the risk-based reasoning that a PUWER inspection record should show.",
        "In industrial environments, the equipment class distinction has direct consequences for both test procedures and retest intervals. Class I equipment — angle grinders, power drills, welding sets, floor-standing tools, catering equipment — relies on an earth connection for protection. Testing Class I equipment requires both insulation resistance testing and earth continuity testing; a pass on one does not substitute for the other. In a warehouse or manufacturing environment, Class I equipment warrants retest intervals of six to twelve months. On a construction site, where the same equipment category is exposed to mechanical damage, moisture ingress, and handling by multiple operatives across shifting teams, three-month intervals are the IET CoP recommendation. Class II double-insulated equipment presents a lower risk profile — no earth to check, insulation resistance testing only — and can operate on longer intervals in the same environments. Class III equipment, operating at safety extra-low voltage below 50V AC, presents the lowest electrical risk and the least demanding test requirements.",
        "The 110V Centre-Tapped Earth (CTE) system is a distinctive feature of UK construction and industrial practice. A step-down transformer reduces the 230V supply to 110V, with the centre tap of the secondary winding connected to earth — so the maximum voltage to earth from either conductor is 55V. Orange-coloured equipment and connectors to BS EN 60309 identify 110V CTE systems in the field. The risk-reduction benefit over 230V tools is well established; the shock risk from a 55V-to-earth contact is materially lower than from a 230V system. The testing requirement is also different: 110V CTE equipment must be tested at reduced test voltages appropriate to the system, not at the standard test voltages applied to 230V Class I equipment. Not all PAT contractors carry 110V test adapters or hold the procedural knowledge for CTE systems. For any site operating 110V CTE tools, confirming the PAT contractor's specific competence for CTE testing before commissioning is a prerequisite for valid test results, not a minor verification step.",
        "RIDDOR 2013 — the Reporting of Injuries, Diseases and Dangerous Occurrences Regulations — requires reporting of electrical incidents in the workplace that result in hospitalisation, specified injuries, or dangerous occurrences involving electrical discharge. When an HSE investigation follows a RIDDOR-reportable electrical incident, the investigation will examine the maintenance record for the equipment involved: when it was last tested, what the test showed, whether any defects were identified and what action was taken, and whether the equipment was in service at the time it should have been out of service. The PAT register — showing test results as numeric values per asset, remedial actions taken, and next test dates — is the documentary record that demonstrates the employer discharged their PUWER duty for that equipment. A site with no register, or with a register limited to pass/fail labels without supporting test data, is substantially more exposed in that investigation than a site with a complete, current, properly formatted register.",
        "The PUWER inspection obligation is broader than the PAT test alone. PUWER requires inspection of work equipment for physical condition, suitability for its intended use, guarding, and operator safety — not only electrical safety. A combined inspection programme, where the PAT contractor carries out the electrical inspection component and a PUWER-competent assessor reviews the broader physical condition in the same visit, produces records that satisfy both obligations from a single contractor visit. For industrial facilities with large equipment estates, commissioning this as a single combined programme is more efficient than managing separate schedules, reduces the number of operational disruptions, and produces a documentation package that links electrical test results to PUWER inspection records under a common asset identifier.",
      ],
      methodology: [
        "Map electrical work equipment against PUWER categories — portable and transportable equipment (Class I, II, and III) plus 110V CTE tools require PAT testing; fixed installed equipment is subject to PUWER inspection but not PAT scope; the asset map is the foundation of the compliance programme",
        "Identify the operating environment for each equipment category — dry stores, wet process areas, construction sites, plant rooms, and manufacturing floors each map to different IET CoP environment categories with different recommended retest intervals; document the environment classification for each category in the written risk assessment",
        "For 110V CTE equipment, confirm your PAT contractor holds correct test equipment and procedures before commissioning — ask specifically whether they carry 110V adapters and whether they test to CTE-appropriate test voltages; a contractor without CTE competence cannot produce valid test results for 110V equipment",
        "Establish a PUWER inspection record alongside the PAT register — link both to the same asset identifier so that electrical test results and broader physical condition records are accessible together; a combined asset record is what an HSE inspector or insurer will expect to see",
        "Implement an out-of-service process for equipment that fails a test — failed equipment must be physically removed from the working area, not merely labelled as failed; in a busy industrial environment, a failed label is not a reliable barrier to re-use; quarantine to a designated out-of-service area is the only control that works consistently",
        "Review frequency bands at least annually to reflect current operations — new equipment enters service, environments change with production activity, old equipment is retired; a brief annual review updates the risk assessment and keeps the programme documentation current and accurate",
      ],
      takeaways: [
        "PUWER 1998 creates the legal duty to maintain work equipment — PAT testing is the electrical inspection component of that duty, providing the documented evidence of compliance with the Electricity at Work Regulations within the PUWER framework",
        "Class I equipment in industrial and construction environments warrants three to six month retest intervals — significantly shorter than equivalent equipment in office environments, reflecting continuous load, multi-operator use, physical handling, and exposure to moisture and mechanical damage",
        "110V CTE tools require different test procedures from standard 230V equipment — the reduced test voltages appropriate to a centre-tapped earth system are not applied by all PAT contractors; confirm CTE competence before commissioning on any site running 110V tools",
        "RIDDOR 2013 requires reporting of electrical incidents resulting in hospitalisation — an HSE investigation will examine test history for the equipment involved; a complete PAT register with numeric results, remedial actions, and next test dates is the documentary defence for the employer",
        "PUWER inspection encompasses PAT test results plus broader physical condition checks — a combined inspection programme produces records satisfying both obligations from a single contractor visit and links results under a common asset identifier",
        "Equipment that fails a test should be physically removed from the working area, not just labelled — a failed label in a busy industrial or construction environment does not prevent re-use; physical quarantine to a designated out-of-service area is the only reliable control",
      ],
      quote: {
        quote:
          "On a construction site or in a manufacturing facility, a failed PAT label isn't a sufficient control. The equipment needs to leave the working area. The register records what failed and what was done about it — that's the difference between a documentation exercise and a compliance programme.",
        author: "Nexgen Engineering Team",
        role: "Industrial Electrical Specialists",
      },
      conclusion: [
        "PUWER and the IET Code of Practice together provide a comprehensive compliance structure for industrial portable appliance testing. PUWER creates the duty; the IET CoP provides the method. The documentation — PAT register, PUWER inspection record, written risk assessment — is the evidence that the employer's obligations are being taken seriously as operational requirements rather than administrative exercises. A programme built around that structure is both legally defensible and operationally coherent.",
        "The 110V CTE system is a distinctive feature of UK construction and industrial practice, providing meaningful risk reduction for portable tool use in high-risk environments. It requires contractors with specific testing competence. Ensuring a PAT contractor working on a 110V site holds the appropriate test equipment and procedural knowledge is a prerequisite for valid testing — not a minor detail that can be assumed. Ask specifically, and ask before commissioning.",
        "For industrial facilities, the PAT programme should be designed as part of the broader PUWER inspection schedule, not as a standalone annual event delivered independently of the wider equipment management framework. Frequency bands should reflect actual operating environments. Records should satisfy both PAT and PUWER requirements under common asset identifiers. And the programme should be reviewed when the facility changes — because the equipment changes, the environments change, and the risk profile changes with the operation.",
      ],
      specifications: [{
        category: 'Equipment Classification Reference',
        items: [
          { label: 'Class I Equipment', value: 'Earth-dependent: motors, industrial tools — test insulation + earth continuity' },
          { label: 'Class II Equipment', value: 'Double-insulated: hand tools, IT equipment — insulation resistance test only' },
          { label: '110V CTE Systems', value: 'Centre-tapped earth at 55V to earth — dedicated test process, 3-monthly retest' }
        ]
      }],
      challenges: [
        {
          title: '110V CTE Testing Complexity',
          description: 'Centre-tapped earth systems operating at 55V to earth require dedicated test equipment and procedures not universally held by PAT contractors.',
          solution: 'Dedicated CTE-capable PAT testers required. Test phase-to-earth at 55V. Retest interval 3 months for high-use sites.'
        },
        {
          title: 'High-Turnover Equipment Environments',
          description: 'Industrial sites with continuous shift patterns see equipment moved, replaced, and borrowed between teams — meaning the asset register can quickly fall out of date.',
          solution: 'Asset-tagged inventory with QR-code labels. Rolling retest schedule by zone. PUWER inspection log maintained digitally.'
        }
      ],
      infographic: {
        src: "/images/news/infographic-pat-frequency-guide.png",
        alt: "PAT testing frequency guide — equipment class and environment risk matrix for industrial environments",
        caption: "PAT Testing Frequency Guide: Industrial and Construction Site Equipment",
      },
      toc: [
        { id: "spotlight", label: "At a Glance", level: 1 },
        { id: "overview", label: "PUWER and PAT Testing", level: 1 },
        { id: "details", label: "Equipment Classes and 110V CTE", level: 1 },
        { id: "specifications", label: "Equipment Classification", level: 1 },
        { id: "challenges", label: "Common Testing Challenges", level: 1 },
        { id: "infographic", label: "PAT Frequency Guide", level: 1 },
        { id: "methodology", label: "Six Steps for Industrial Sites", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Out of Service Means Out of Area", level: 1 },
        { id: "conclusion", label: "Programme Design", level: 1 },
      ],
    },
  },
  {
    id: "news-community-001",
    slug: "why-nexgen-invests-in-local-community",
    category: "community",
    categoryLabel: "Community",
    title: "Why Nexgen Invests in the Local Community",
    excerpt:
      "Nexgen's community investment is not a marketing exercise. Real electrical work at Thames Valley Adventure Playground and sponsorship of the Slough in Bloom gold award entry — both delivered to the same standard as commercial projects, because the work is the same.",
    description:
      "Why Nexgen Electrical Innovations invests in Berkshire community projects — Thames Valley Adventure Playground, Slough in Bloom, and the reasoning behind local capability applied to local need.",
    featuredImage: {
      src: "/images/projects/community/thames-valley-adventure-playground/nexgen-tvap-adventure-playground-facility-building.jpg",
      alt: "Thames Valley Adventure Playground facility — Nexgen community electrical project",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Community Engagement",
    },
    readTime: "5 min",
    tags: [
      "Community",
      "Thames Valley Adventure Playground",
      "Slough in Bloom",
      "Berkshire",
      "Local Investment",
      "NICEIC",
      "Charity Electrical Work",
    ],
    isFeatured: false,
    heroHeadline: [
      "Why Nexgen Invests",
      "in the Local",
      "Community",
    ],
    heroIndicators: [
      {
        icon: "Users",
        title: "Community Focus",
        description:
          "Supporting Thames Valley Adventure Playground and Slough in Bloom as part of Nexgen's local commitment",
      },
      {
        icon: "Heart",
        title: "Real Contribution",
        description:
          "Real electrical work delivered to the same standard as commercial projects — not charity events",
      },
      {
        icon: "Award",
        title: "Gold Award Partner",
        description:
          "Supporting the Slough in Bloom entry that won gold in 2023 under the RHS Britain in Bloom programme",
      },
      {
        icon: "Lightbulb",
        title: "Local Capability",
        description:
          "Berkshire contractor applying local capability to local community need — a practical choice, not a marketing exercise",
      },
    ] as const,
    publishedAt: "2026-05-30",
    updatedAt: "2026-05-30",
    detail: {
      intro: [
        "Nexgen Electrical Innovations is based in Berkshire. The work is in logistics warehouses in Reading, veterinary hospitals in Watford, and office fit-outs across the Thames Valley. Community investment sits alongside that work as a deliberate choice — not an incidental benefit, and not a statement made only when it is convenient to make it.",
        "The Thames Valley Adventure Playground in Taplow and Slough in Bloom are two community projects Nexgen has been involved with. Neither is a typical electrical project. Both matter to the communities they serve. Nexgen's involvement reflects something the company's director takes seriously: that a Berkshire business with the capability to contribute to community infrastructure should use that capability in its own area.",
        "This article explains the reasoning behind Nexgen's community investment — what it involves, what it produces, and why it sits alongside the commercial work rather than being separate from it.",
      ],
      body: [
        "Thames Valley Adventure Playground in Taplow is a registered charity providing a fully accessible outdoor adventure play environment for children and young people with disabilities and additional needs. It is not a project that requires elaborate justification. The charity serves a population with limited options for accessible outdoor play facilities in the area, operates on a charity budget, and requires the same reliable electrical infrastructure as any other building — outdoor lighting, welfare facilities, safe and certified installation throughout. Nexgen has delivered that work to the same standard as any commercial project: inspected, certified, and signed off to BS 7671. The difference is the client, the budget parameters, and the reason the work matters to the people who use the facility.",
        "Slough in Bloom is the local branch of the Britain in Bloom programme, organised annually by the Royal Horticultural Society and coordinated locally with the support of Slough Borough Council and local business sponsors. The competition judges entries from gardening clubs, schools, community groups, and businesses on horticulture, environmental responsibility, and community participation. Nexgen supported the 2023 entry as a sponsor. That entry won the gold award and was named overall winner in the Slough category. The connection is local: the competition celebrates the area Nexgen works in, requires sustained volunteer effort over a full year, and produces visible improvements to public spaces in Slough that persist long after the judging is over.",
        "Community investment makes sense for a contractor not because of a corporate CSR budget — Nexgen does not operate at that scale — but because of what a contractor actually has: engineers, equipment, installation capability, and a contact network within the local trade and supply chain. Applying that capability to community projects is a direct translation of what the business does into a form that benefits local people directly. The cost is real; the resource is real; the result is real. That is different from writing a cheque for a sponsorship that has no operational connection to the business.",
        "What community investment produces for Nexgen is concrete and observable. For TVAP: better electrical infrastructure serving children with disabilities in Berkshire. For Slough in Bloom: consistent local business support for an organisation that produces visible community benefit. For Nexgen: a connection to the area that extends beyond the commercial project portfolio, a reputation built on what the business actually does rather than what it says about itself, and institutional knowledge gained from working with organisations that operate under very different constraints from commercial clients. All of those have value.",
      ],
      takeaways: [
        "Nexgen's community investment is practical, not performative — real electrical work delivered to the same inspection and certification standard as commercial projects, within the operational and budget constraints of community organisations",
        "Thames Valley Adventure Playground and Slough in Bloom represent two distinct forms of community engagement — one as a contractor delivering electrical infrastructure, one as a sponsor supporting a community programme — both contributing to local amenity in Berkshire",
        "Community projects operate under different constraints from commercial work: smaller budgets, volunteer-driven organisations, and tighter scheduling windows; understanding those constraints is part of delivering the work properly",
        "For a Berkshire-based contractor, supporting Berkshire community organisations is a direct application of local capability to local need — a practical operational choice rather than an abstract statement of values",
        "Nexgen's director has made community engagement a deliberate part of how the business operates — a commitment that runs consistently alongside the commercial work rather than appearing only when it is convenient to mention it",
      ],
      quote: {
        quote:
          "The work we do for TVAP and Slough in Bloom is real work. It gets inspected, certified, and signed off to the same standard as anything we do commercially. The difference is who it's for and why it matters — and those reasons are good enough.",
        author: "Herman Adu",
        role: "Director, Nexgen Electrical Innovations",
      },
      conclusion: [
        "Community investment and commercial electrical work are not in tension at Nexgen — they operate in parallel as expressions of the same capability applied to different contexts. Engineering standards are the same. Commitment to delivering properly is the same. What changes is the client, the budget, and the reason the work matters to the people on the receiving end of it.",
        "Both TVAP and Slough in Bloom will be ongoing relationships. TVAP's facility requires ongoing maintenance and future improvements as the charity grows its programme and its user base. Slough in Bloom is an annual commitment. Neither is a one-time engagement entered for the association and then allowed to lapse.",
        "For businesses considering community investment: the most useful form is usually the simplest — apply what you already do to organisations that need it and cannot easily afford it. For an electrical contractor, that means treating a community project with the same professionalism as a commercial one and signing off to the same standards. That is the form of community investment that actually helps the organisations it is intended to support.",
      ],
      toc: [
        { id: "overview", label: "Why Community Investment", level: 1 },
        { id: "details", label: "TVAP and Slough in Bloom", level: 1 },
        { id: "scope", label: "Community Projects", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Real Work, Real Standards", level: 1 },
        { id: "conclusion", label: "The Practical Choice", level: 1 },
      ],
      scope: [
        'Thames Valley Adventure Playground (TVAP) — pro-bono electrical safety inspections',
        'Slough in Bloom — electrical support for public garden lighting and installations',
        'Local school and community hall electrical assessments at no charge',
        'Future: annual community electrical safety day planned for Slough residents'
      ],
    },
  },
  {
    id: "news-community-002",
    slug: "slough-in-bloom-why-nexgen-came-back",
    category: "community",
    categoryLabel: "Community",
    title: "Slough in Bloom 2026: Why Nexgen Is Coming Back",
    excerpt:
      "Nexgen first supported Slough in Bloom in 2023. The entry won gold and overall winner. In 2026, Nexgen is returning as supporting partner — because the first involvement produced a result and the organisation is worth continuing to support.",
    description:
      "Nexgen returns as supporting partner for Slough in Bloom 2026 — a continuation of the partnership that backed the 2023 gold award and overall winner in the RHS Britain in Bloom programme.",
    featuredImage: {
      src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-01.jpg",
      alt: "Slough in Bloom 2023 gold award winning display — community garden entry",
    },
    author: {
      name: "Nexgen Engineering Team",
      role: "Community Engagement",
    },
    readTime: "4 min",
    tags: [
      "Community",
      "Slough in Bloom",
      "Britain in Bloom",
      "RHS",
      "Berkshire",
      "Local Sponsorship",
      "Gold Award",
    ],
    isFeatured: false,
    heroHeadline: [
      "Slough in Bloom 2026",
      "Why Nexgen",
      "Is Coming Back",
    ],
    heroIndicators: [
      {
        icon: "Award",
        title: "Gold Award 2023",
        description:
          "Supporting the Slough in Bloom entry that won gold and overall winner in the 2023 competition",
      },
      {
        icon: "Users",
        title: "Community Partnership",
        description:
          "Returning as supporting partner for the 2026 competition — a continuation of Nexgen's local commitment",
      },
      {
        icon: "Heart",
        title: "RHS Britain in Bloom",
        description:
          "Britain in Bloom is the UK's largest horticultural campaign, run by the Royal Horticultural Society since 1964",
      },
      {
        icon: "Lightbulb",
        title: "Local Investment",
        description:
          "Slough in Bloom produces visible improvements to public spaces and builds community capacity for environmental stewardship",
      },
    ] as const,
    publishedAt: "2026-05-30",
    updatedAt: "2026-05-30",
    detail: {
      intro: [
        "Nexgen Electrical Innovations first supported Slough in Bloom in 2023. The entry won the gold award and the overall winner prize in the Slough category. The competition attracts entries from gardening clubs, schools, businesses, and community groups across Slough, with judging carried out by the Royal Horticultural Society under the Britain in Bloom programme framework. Winning gold at that level requires sustained effort across the full year — not a display assembled in the weeks before judging.",
        "Slough in Bloom 2026 is the next engagement. Nexgen is returning as a supporting partner. The reason is straightforward: the first involvement produced a result, the organisation is worth supporting, and the commitment to the local area that made the first involvement sensible still applies in 2026 as it did in 2023.",
        "This article covers what Slough in Bloom is, what Nexgen's involvement in 2023 produced, and why the partnership continues into 2026.",
      ],
      body: [
        "Slough in Bloom is the local branch of the Britain in Bloom programme, which the Royal Horticultural Society has run since 1964. It is the UK's largest horticultural campaign, structured in regional and national tiers, with local entries feeding upward into regional competitions such as Thames and Chiltern. The judging framework covers three areas: horticultural achievement, environmental responsibility, and community participation. Displaying well on judging day is necessary but not sufficient — a gold award entry demonstrates sustained community engagement, environmental commitments that go beyond surface appearance, and a programme of work that the judges can verify has been consistent throughout the year.",
        "The 2023 entry that Nexgen supported won the gold award in the Slough category and was named overall winner for that year's competition. Gold is not awarded for display quality alone. The assessment encompasses the breadth of community involvement, the environmental sustainability of the programme, the quality of year-round maintenance, and evidence that the effort represents a genuine community undertaking rather than a one-off exercise. An overall winner result, on top of the gold award, reflects the judges' assessment that the entry was outstanding across all three judging criteria.",
        "Nexgen's contribution was as a supporting sponsor — contributing to the resources required to develop and maintain the entry over a full year. Preparation for a Britain in Bloom entry begins in the preceding autumn with planting schedules that run through winter and spring, with the main growing season requiring sustained maintenance and development leading up to the summer judging period. The sponsorship supports those activities: materials, plant stock, and the resources needed to keep a gold-level programme running. A gold award entry is the product of that kind of sustained, resourced effort — not a single push in the weeks before the judges arrive.",
        "The reason for returning in 2026 is the same as the reason for first becoming involved in 2023. Slough in Bloom is a serious local effort producing visible and lasting results in Slough's public spaces. The competition's value to the local area — community engagement, environmental improvement, improved public spaces — is real and ongoing. So is Nexgen's commitment. In 2025 the partnership continued; in 2026 Nexgen returns as supporting partner for what is now the second confirmed competition cycle of an ongoing local relationship.",
      ],
      takeaways: [
        "Slough in Bloom is a serious horticultural competition under the RHS Britain in Bloom framework — judging covers horticultural achievement, environmental responsibility, and community participation, not display quality alone",
        "Nexgen supported the entry that won the 2023 gold award and overall winner — a result that reflects sustained effort across the full year of preparation, maintenance, and community engagement, not a single event",
        "Nexgen is returning as supporting partner for 2026, continuing a local business commitment now in its second confirmed competition cycle following involvement in 2023 and 2025",
        "Britain in Bloom produces lasting improvements to public spaces and builds community capacity for environmental stewardship — results that persist well beyond the competition cycle and benefit the wider Slough community",
        "Nexgen's support for Slough in Bloom is part of a broader community engagement programme that includes the Thames Valley Adventure Playground — local capability applied to local community need across both charitable and civic contexts",
      ],
      quote: {
        quote:
          "We came back because the first time worked. The entry won, the community benefited, and the people running Slough in Bloom put in the work that justified winning. That's the kind of partnership worth continuing.",
        author: "Herman Adu",
        role: "Director, Nexgen Electrical Innovations",
      },
      conclusion: [
        "Slough in Bloom 2026 continues a partnership that produced a gold award win and overall winner result in 2023. The commitment is consistent support for an organisation that does the work well and delivers visible benefit to the local area. The competition will be judged in summer 2026. Preparation is already underway.",
        "Britain in Bloom competitions at the gold level are not marketing exercises — they require genuine community engagement, environmental commitment, and horticultural quality sustained over a full year. Supporting that kind of effort is something Nexgen takes seriously, because the competition takes it seriously. The standard that the judges apply is the same standard Nexgen applies to its own work.",
        "For businesses considering local community sponsorship: the most effective partnerships are with organisations that hold themselves to a high standard and produce measurable results. Slough in Bloom meets that standard. The partnership will continue for as long as that remains true.",
      ],
      gallery: [
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-01.jpg",
          alt: "Slough in Bloom 2023 gold award winning display",
          caption: "2023 Gold Award Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-gold-award-winner-02.jpg",
          alt: "Slough in Bloom 2023 gold award garden display",
          caption: "2023 Competition Display",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-overall-winner-award.jpg",
          alt: "Slough in Bloom 2023 overall winner award",
          caption: "2023 Overall Winner",
        },
        {
          src: "/images/projects/community/slough-in-bloom/nexgen-slough-in-bloom-2023-prize-winning-garden-display.jpg",
          alt: "Slough in Bloom 2023 prize-winning garden display",
          caption: "Prize-Winning Garden",
        },
      ],
      toc: [
        { id: "overview", label: "Slough in Bloom 2026", level: 1 },
        { id: "details", label: "The 2023 Gold Award", level: 1 },
        { id: "scope", label: "What Britain in Bloom Judges", level: 1 },
        { id: "gallery", label: "2023 Competition Gallery", level: 1 },
        { id: "takeaways", label: "Key Takeaways", level: 1 },
        { id: "testimonial", label: "Why We Came Back", level: 1 },
        { id: "conclusion", label: "The Partnership Continues", level: 1 },
      ],
      scope: [
        'Horticultural achievement and plant display quality',
        'Environmental responsibility and sustainability practices',
        'Community participation and volunteer engagement',
        'Overall impact on the local area and public spaces'
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
