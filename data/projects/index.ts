import type {
  Project,
  ProjectBentoItem,
  ProjectCategory,
  ProjectCategorySlug,
  ProjectListItem,
} from "@/types/projects";
import { communityProjects } from "./community";

export const projectCategories: ProjectCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description: "Home and domestic electrical delivery projects.",
    isSector: true,
  },
  {
    slug: "commercial",
    label: "Commercial",
    description:
      "Full Cat B fit-out and electrical infrastructure for commercial and logistics facilities.",
    isSector: true,
  },
  {
    slug: "industrial",
    label: "Industrial",
    description:
      "High-voltage infrastructure, logistics, and manufacturing electrical projects.",
    isSector: true,
  },
  {
    slug: "community",
    label: "Community",
    description:
      "Public sector, community facilities, and social infrastructure electrical projects.",
    isSector: true,
  },
  {
    slug: "commercial-lighting",
    label: "Commercial Lighting",
    description:
      "Retail, office, and mixed-use lighting modernisation projects.",
    showInNav: false,
    isSector: false,
  },
  {
    slug: "power-boards",
    label: "Power Boards",
    description:
      "Distribution, switchgear, and board upgrade infrastructure projects.",
    showInNav: false,
    isSector: false,
  },
];

export function isProjectCategorySlug(
  value: string,
): value is Exclude<ProjectCategorySlug, "all"> {
  return projectCategories.some((category) => category.slug === value);
}

export const allProjects: Project[] = [
  ...communityProjects,
  {
    id: "proj-dhl-reading-001",
    slug: "dhl-reading-distribution-hub",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "DHL Reading Distribution Hub",
    heroHeadline: ["DHL Reading", "Distribution Hub"],
    heroIndicators: [
      {
        icon: "Factory",
        title: "Logistics Spec",
        description:
          "Full industrial electrical specification for high-throughput 24/7 distribution hub operations.",
      },
      {
        icon: "Zap",
        title: "3-Phase Power",
        description:
          "Three-phase power distribution installed to support conveyor systems, dock levellers and MHE equipment.",
      },
      {
        icon: "Lightbulb",
        title: "LED Warehouse",
        description:
          "High-bay LED lighting delivering 300+ lux throughout with DALI controls and daylight harvesting.",
      },
      {
        icon: "MapPin",
        title: "Reading Hub",
        description:
          "Completed to programme within the live DHL Reading distribution centre with no operational downtime.",
      },
    ] as const,
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
    tags: [
      "Cat B Fit-Out",
      "Distribution Hub",
      "Schneider Electric",
      "Conveyor Infrastructure",
    ],
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
          caption:
            "Site overview — early-stage installation with containment in progress",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-cable-tray-installation.jpg",
          alt: "Warehouse cable containment and tray installation at DHL Reading",
          caption:
            "Primary cable tray routes being established across the warehouse ceiling",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-mewp-high-level-containment.jpg",
          alt: "MEWP scissor lift access for high-level cable tray installation — DHL Reading",
          caption:
            "Scissor lift access for high-level containment runs above the sorting floor",
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
          caption:
            "Schneider LV control panels powering the automated parcel sorting conveyors",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-bespoke-cable-tray-prefabricated.jpg",
          alt: "Bespoke prefabricated cable tray sections installed at DHL Reading",
          caption:
            "Custom-fabricated cable tray sections — prefabricated off-site for precise fit",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-warehouse-floor-containment-works.jpg",
          alt: "DHL Reading warehouse floor showing completed containment and distribution works",
          caption:
            "Warehouse floor showing completed containment and initial distribution works",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-office-welfare-second-fix.jpg",
          alt: "Second fix electrical installation in DHL Reading office and welfare areas",
          caption:
            "Second fix electrical works in staff welfare and office areas",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-sub-distribution-plant-zone.jpg",
          alt: "Cable routing to sub-distribution panels in DHL Reading plant zone",
          caption: "Cable routing to sub-distribution panels in the plant zone",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-main-lv-distribution-board.jpg",
          alt: "Schneider Electric main LV distribution board installed and commissioned at DHL Reading",
          caption:
            "Schneider Electric main distribution board — tested and commissioned",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-office-fitout-completed.jpg",
          alt: "Completed DHL Reading office fit-out — lighting, small power, and data provisions",
          caption:
            "Completed office fit-out — lighting, small power, and data provisions installed",
        },
        {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
          alt: "DHL Reading distribution hub — completed and operational, delivered by Nexgen Electrical Innovations",
          caption:
            "The completed DHL Reading hub — fully operational and delivering to programme",
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
    heroHeadline: ["Medivet Watford", "Veterinary Practice"],
    heroIndicators: [
      {
        icon: "Shield",
        title: "Medical Grade",
        description:
          "Medical-grade electrical installation compliant with HTM 06-01 for specialist veterinary equipment.",
      },
      {
        icon: "Zap",
        title: "Theatre Supply",
        description:
          "Isolated power supply systems to operating theatres meeting IEC 60364-7-710 medical location requirements.",
      },
      {
        icon: "Lightbulb",
        title: "Clinical Lighting",
        description:
          "LED clinical lighting to consultation rooms, theatres and recovery areas with correct colour rendering.",
      },
      {
        icon: "ClipboardCheck",
        title: "NICEIC Approved",
        description:
          "Works certified by NICEIC-approved engineers with full test documentation for CQC compliance.",
      },
    ] as const,
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
    tags: [
      "Healthcare Electrical",
      "Dual Fuseboard Design",
      "Cat B Fit-Out",
      "Woodhouse Workspace",
    ],
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
          caption:
            "Completed Medivet Watford flagship practice — electrical installation by Nexgen",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-north-wing-fuseboards.jpg",
          alt: "North wing dedicated fuseboard installation — Medivet Watford",
          caption:
            "Dedicated north wing fuseboard — installed and commissioned by Nexgen",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-electrical-distribution-board.jpg",
          alt: "Main LV distribution board installation at Medivet Watford",
          caption:
            "Main LV distribution board serving both wings from a consolidated intake",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-first-fix-containment.jpg",
          alt: "First fix cable containment works at Medivet Watford",
          caption:
            "First fix containment in progress — north wing installation phase",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-cable-tray-installation.jpg",
          alt: "Cable tray installation across Medivet Watford veterinary practice",
          caption:
            "Primary cable tray routes across the clinical and welfare zones",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-north-wing-corridor.jpg",
          alt: "North wing corridor electrical installation — Medivet Watford",
          caption:
            "North wing corridor showing completed containment and lighting infrastructure",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-south-wing-fit-out.jpg",
          alt: "South wing electrical fit-out at Medivet Watford",
          caption:
            "South wing first fix in progress alongside structural completion works",
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
          caption:
            "Second fix accessories and final connections during Phase 4",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-emergency-lighting-install.jpg",
          alt: "Emergency lighting installation at Medivet Watford",
          caption:
            "BS 5266-compliant emergency lighting at escape routes and clinical zones",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-testing-commissioning.jpg",
          alt: "Testing and commissioning at Medivet Watford veterinary practice",
          caption:
            "Full NICEIC circuit testing and commissioning before practical completion",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-reception-area.jpg",
          alt: "Completed reception area electrical installation — Medivet Watford",
          caption:
            "Completed reception area — lighting, small power, and data provisions installed",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-treatment-room.jpg",
          alt: "Treatment room electrical fit-out — Medivet Watford",
          caption:
            "Treatment room fit-out with clinical-grade power provisions and emergency lighting",
        },
        {
          src: "/images/projects/commercial/medivet/nexgen-medivet-watford-completed-facility-overview.jpg",
          alt: "Medivet Watford completed facility overview — delivered by Nexgen Electrical Innovations",
          caption:
            "Completed Medivet Watford practice — fully operational at practical completion",
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
    heroHeadline: ["Ladbrokes Woking", "Retail Fit-Out"],
    heroIndicators: [
      {
        icon: "Building2",
        title: "Retail Fitout",
        description:
          "Full Category A to B retail electrical fit-out delivered to Ladbrokes brand specification.",
      },
      {
        icon: "Lightbulb",
        title: "Feature Lighting",
        description:
          "Bespoke retail lighting design with LED feature strips, display lighting and emergency systems.",
      },
      {
        icon: "ClipboardCheck",
        title: "Part P Certified",
        description:
          "Complete installation certified under Part P with full EICR issued at handover.",
      },
      {
        icon: "Calendar",
        title: "Fast Track",
        description:
          "Completed within tight retail refurbishment programme to meet opening date requirements.",
      },
    ] as const,
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
          caption:
            "LED lighting installation — trading floor and back-of-house",
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
    heroHeadline: ["Biffa Workshop", "3-Phase Electrical"],
    heroIndicators: [
      {
        icon: "Factory",
        title: "3-Phase Install",
        description:
          "New 3-phase supply and distribution installed to power heavy workshop machinery and compressors.",
      },
      {
        icon: "Zap",
        title: "DNO Connection",
        description:
          "New DNO connection arranged and managed end-to-end with supply authority for upgraded capacity.",
      },
      {
        icon: "Shield",
        title: "NICEIC Certified",
        description:
          "Full installation certified by NICEIC-approved engineers with minor works certificates issued.",
      },
      {
        icon: "Wrench",
        title: "Workshop Ready",
        description:
          "Distribution boards sized and positioned to serve all current and future machinery layouts.",
      },
    ] as const,
    clientSector: "Waste Management & Sustainability",
    status: "completed",
    description:
      "Design and installation of a new fully operational 3-phase electrical supply system for Biffa's workshop facility in Farnham, Surrey — a landmark project that established Nexgen as Biffa's preferred electrical partner.",
    coverImage: {
      src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-exterior-overview.jpg",
      alt: "Biffa Workshop Farnham — 3-phase electrical installation",
    },
    kpis: {
      budget: "£65K",
      timeline: "8 weeks",
      capacity: "3-Phase Supply",
      location: "Farnham, Surrey",
    },
    tags: [
      "3-Phase",
      "Commercial Workshop",
      "Preferred Partner",
      "New Build Services",
    ],
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
          caption:
            "Biffa Workshop Farnham — 3-phase electrical installation complete",
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
          caption:
            "Interior overview — high-level lighting and containment installed",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-roller-shutter-circuits.jpg",
          alt: "Biffa Workshop — roller shutter door electrical circuits",
          caption:
            "Roller shutter circuits — 3-phase supplies installed and commissioned",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-first-fix-wiring.jpg",
          alt: "Biffa Workshop Farnham — electrical installation progress",
          caption: "Installation progress — first fix wiring complete",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-cable-containment.jpg",
          alt: "Biffa Workshop Farnham — electrical containment and cabling",
          caption: "Cable containment — routed and dressed per design",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-high-level-lighting.jpg",
          alt: "Biffa Workshop Farnham — lighting installation",
          caption:
            "High-level lighting — installed and aligned to workshop layout",
        },
        {
          src: "/images/projects/commercial/biffa/biffa-workshop/nexgen-biffa-workshop-final-commissioning.jpg",
          alt: "Biffa Workshop Farnham — electrical systems complete",
          caption: "Workshop systems — all circuits commissioned and certified",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "the-partnership-begins",
          heading:
            "Biffa Chose Nexgen. Nexgen Delivered. The Partnership Grew.",
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
  // ═══════════════════════════════════════════════════════════════════════════
  // TAPLOW DOMESTIC — Residential Electrical Installation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-taplow-domestic-001",
    slug: "taplow-domestic-installation",
    category: "residential",
    categoryLabel: "Residential",
    title: "Domestic Installations — Taplow",
    heroHeadline: ["Taplow", "Done Right"],
    heroIndicators: [
      {
        icon: "Home",
        title: "Part P Certified",
        description:
          "Complete domestic electrical installation registered and certified under Part P Building Regulations.",
      },
      {
        icon: "ClipboardCheck",
        title: "RCBO Protected",
        description:
          "Individual RCBO protection to every circuit in a new consumer unit for maximum safety.",
      },
      {
        icon: "Wifi",
        title: "Smart Ready",
        description:
          "Pre-wired for smart home integration including data points, EV charger spur and outdoor circuits.",
      },
      {
        icon: "MapPin",
        title: "Taplow Berks",
        description:
          "Delivered to a private residential property in Taplow, Berkshire on time and snagging-free.",
      },
    ] as const,
    clientSector: "Residential",
    status: "completed",
    description:
      "Full domestic electrical installation for a local Taplow homeowner — consumer unit replacement, new circuits throughout, lighting, power, and final accessories. Tested, certified to BS 7671, and handed over spotless.",
    coverImage: {
      src: "/images/projects/residential/domestic-installations/nexgen-taplow-completed-installation.jpg",
      alt: "Taplow domestic electrical installation — completed residential work",
    },
    kpis: {
      budget: "£4,500",
      timeline: "3 days",
      capacity: "100A Supply",
      location: "Taplow, Berkshire",
    },
    tags: ["Domestic", "Consumer Unit", "Residential", "BS 7671", "Berkshire"],
    progress: 100,
    isFeatured: true,
    publishedAt: "2026-05-01T09:00:00.000Z",
    updatedAt: "2026-05-01T09:00:00.000Z",
    detail: {
      intro: {
        label: "Community Project",
        headlineWords: ["Home.", "Done", "Right."],
        leadParagraph:
          "When a local Taplow homeowner needed a full domestic electrical installation, the brief was simple: do it properly, leave the place as you found it, and make it right. The kind of job that most electricians would rush — we took our time on.",
        bodyParagraphs: [
          "Domestic electrical work is different from commercial. There's no site manager, no programme board, no procurement chain. There's just someone's home — and the family who lives in it trusting you to do the job right and leave no trace. That trust matters more to us than any contract.",
          "The Taplow installation covered a full consumer unit replacement, new circuits throughout the property, and everything from lighting and power to the final accessories. Tested, certified to BS 7671, and handed over clean — the way every domestic job should be.",
        ],
        pillars: [
          {
            num: "01",
            title: "Clean Workmanship",
            description:
              "Not a mark left behind. No plaster dust, no cable offcuts, no scuffs on the paintwork. Done properly, tidied completely.",
          },
          {
            num: "02",
            title: "Trust in Your Home",
            description:
              "You're letting someone into your space. We treat every home with the same respect we'd want shown in our own.",
          },
          {
            num: "03",
            title: "Right First Time",
            description:
              "No return visits. No remedial calls. Every circuit tested, every accessory fitted correctly — handed over with an Electrical Installation Certificate and zero outstanding items.",
          },
          {
            num: "04",
            title: "Local, and Proud of It",
            description:
              "Taplow is our community too. When a neighbour trusts us with their home, they get the same standard we'd expect in our own — and a recommendation they can pass on without hesitation.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Consumer Unit Replacement",
          description:
            "Full consumer unit replacement — new unit fitted, all circuits reconnected, tested, and certified to BS 7671.",
        },
        {
          icon: "Cable",
          title: "New Circuit Wiring",
          description:
            "New circuits throughout the property — correctly sized, routed, and terminated for a clean, compliant installation.",
        },
        {
          icon: "Lightbulb",
          title: "Lighting Installation",
          description:
            "Lighting circuits installed throughout — pendants, downlights, and switches fitted neatly to the finished standard.",
        },
        {
          icon: "Settings",
          title: "Power & Final Accessories",
          description:
            "Socket outlets, switches, and final accessories fitted throughout — clean finishes, correctly positioned, and properly secured.",
        },
        {
          icon: "CheckCircle",
          title: "Testing, Certification & Handover",
          description:
            "Full circuit testing to BS 7671 with an Electrical Installation Certificate issued at handover — no outstanding items.",
        },
        {
          icon: "Shield",
          title: "Clean Completion",
          description:
            "The home left exactly as found — no dust, no debris, no marks. Every area worked in cleaned and restored before we left.",
        },
      ],
      gallery: [
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-completed-installation.jpg",
          alt: "Taplow domestic installation — overview",
          caption: "Domestic installation — completed and certified",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-consumer-unit-replacement.jpg",
          alt: "Taplow domestic installation — consumer unit",
          caption:
            "Consumer unit replacement — tested and certified to BS 7671",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-circuit-wiring.jpg",
          alt: "Taplow domestic installation — circuit wiring",
          caption: "New circuit wiring — routed and terminated cleanly",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-lighting-installation.jpg",
          alt: "Taplow domestic installation — lighting installation",
          caption: "Lighting installation — fitted to finished standard",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-power-accessories.jpg",
          alt: "Taplow domestic installation — power accessories",
          caption: "Power accessories — sockets and switches fitted cleanly",
        },
        {
          // 06-local-installation.jpg does not exist — intentionally skipped
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-installation-detail.jpg",
          alt: "Taplow domestic installation — installation detail",
          caption: "Installation detail — clean workmanship throughout",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-finished-areas.jpg",
          alt: "Taplow domestic installation — finished areas",
          caption: "Finished areas — no marks, no debris left behind",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-final-accessories.jpg",
          alt: "Taplow domestic installation — final accessories",
          caption: "Final accessories — correctly positioned and secured",
        },
        {
          src: "/images/projects/residential/domestic-installations/nexgen-taplow-handover-certified.jpg",
          alt: "Taplow domestic installation — completed property",
          caption: "Completed installation — handed over clean and certified",
        },
      ],
      testimonial: {
        quote:
          "I had high expectations before they even arrived — I'm particular about my home, always have been. Not a mark on the walls, not a speck of dust left behind. They came in, did the work properly, and left the place spotless. It sounds simple. It's not. I'd recommend them to any of our neighbours in Taplow without a second thought.",
        author: "Sarah Adu",
        role: "Homeowner, Taplow",
        company: "Local Resident",
      },
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "why-domestic-matters",
          heading: "The Jobs That Build a Reputation in Your Own Community",
          paragraphs: [
            "Nexgen doesn't just work in Taplow — it's where the people behind Nexgen live. When a local homeowner asked us to handle their full domestic installation, we understood exactly what it meant: a family trusting us with the place they call home. That's a different kind of accountability to a commercial contract — and we take it just as seriously.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "the-standard-we-set",
          heading: "Every Domestic Job Is a Showcase",
          paragraphs: [
            "Domestic work travels fast by word of mouth. A clean, tidy installation that leaves no trace means the next referral comes naturally. That's the standard we hold ourselves to on every domestic job — not because we have to, but because it's the right way to work in the community you serve.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "Done in 3 Days. Not a Mark Left Behind.",
          paragraphs: [
            "The Taplow installation was completed in 3 days. Full consumer unit replacement, new circuits throughout, lighting, power, and final accessories — tested, certified to BS 7671, and handed over with the property exactly as we found it. Sarah Adu's recommendation to her neighbours in Taplow says everything that needs to be said.",
          ],
          background: "muted",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERSCHEL GRAMMAR SCHOOL — Commercial Education Sector Maintenance Contract
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-herschel-grammar-001",
    slug: "herschel-grammar-school-contract",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "Herschel Grammar School — Electrical Maintenance Contract",
    heroHeadline: ["Herschel Grammar", "Trusted Partner"],
    heroIndicators: [
      {
        icon: "ClipboardCheck",
        title: "PPM Contract",
        description:
          "Planned preventive maintenance programme covering all electrical systems across the school estate.",
      },
      {
        icon: "Shield",
        title: "NICEIC Approved",
        description:
          "All maintenance delivered by NICEIC-approved engineers meeting DfE and Ofsted compliance standards.",
      },
      {
        icon: "Calendar",
        title: "Term Scheduled",
        description:
          "All invasive works scheduled during school holidays to avoid disruption to curriculum delivery.",
      },
      {
        icon: "Award",
        title: "Trusted Partner",
        description:
          "Multi-year maintenance relationship delivering consistent compliance and rapid reactive response.",
      },
    ] as const,
    clientSector: "Education — Grammar School",
    status: "completed",
    description:
      "Exclusive electrical maintenance contract for Herschel Grammar School — a co-educational grammar school with academy status in Slough. From first meeting to ongoing partnership, trust and reliability are the defining pillars of this relationship.",
    coverImage: {
      src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-hero.jpg",
      alt: "Herschel Grammar School — electrical maintenance contract",
    },
    kpis: {
      budget: "Maintenance Contract",
      timeline: "Ongoing since 2018",
      capacity: "Emergency 1hr SLA",
      location: "Slough, Berkshire",
    },
    tags: [
      "Maintenance Contract",
      "Education Sector",
      "Emergency Response",
      "Planned Works",
    ],
    progress: 100,
    isFeatured: false,
    publishedAt: "2026-05-04T09:00:00.000Z",
    updatedAt: "2026-05-04T09:00:00.000Z",
    detail: {
      intro: {
        label: "Education Sector Contract",
        headlineWords: ["A", "school", "that", "trusted", "us."],
        leadParagraph:
          "Herschel Grammar School contacted Nexgen in late 2018 — their previous contractor was retiring and they urgently needed a reliable replacement. From the first meeting with site manager Phil Vance and caretaker Lewis, the relationship was built on trust. We explained our ethos, our accreditations, our track record — and were awarded the exclusive contract. That partnership has been maintained to this day.",
        bodyParagraphs: [
          "Herschel Grammar School is a co-educational grammar school with academy status in Slough, Berkshire. With children on site every day, the stakes for electrical reliability are higher than in any commercial environment. A fault that would be an inconvenience elsewhere can be a safety incident at a school.",
          "Nexgen's contract covers the full spectrum of electrical need at Herschel: from emergency response within 1 hour for dangerous scenarios, to 24-hour resolution for non-emergency faults, to planned works — lighting upgrades, room layouts, service additions — all scheduled outside school hours or during holidays to ensure zero disruption to the school timetable.",
        ],
        pillars: [
          {
            num: "01",
            title: "Trust and Communication",
            description:
              "From first meeting, the relationship was built on transparency and reliability. Phil and Lewis knew exactly what to expect from Nexgen — and we've never given them reason to doubt it.",
          },
          {
            num: "02",
            title: "Zero Disruption to School Operations",
            description:
              "All planned works are scheduled around the school timetable — outside school hours or during holidays. Children come first; electrical works fit around them.",
          },
          {
            num: "03",
            title: "Emergency-Ready",
            description:
              "1-hour on-site response for dangerous or potentially dangerous electrical problems. With children on site, safety is paramount and response time is non-negotiable.",
          },
          {
            num: "04",
            title: "Full Compliance and Handover",
            description:
              "Every completed work is certified to BS 7671 and formally handed over. The school has a complete record of all electrical works carried out on site.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Emergency Response — 1 Hour SLA",
          description:
            "On-site within 1 hour for any dangerous or potentially dangerous electrical problem. With children present every school day, this is the most critical element of the contract.",
        },
        {
          icon: "Settings",
          title: "Standard Reactive Maintenance",
          description:
            "Non-emergency faults attended and resolved within 24 hours. Nexgen coordinates directly with Phil and Lewis to ensure minimal disruption to the school day.",
        },
        {
          icon: "Lightbulb",
          title: "Planned Lighting Works",
          description:
            "Lighting upgrades across the school — reception ceiling lighting, office lighting, sports centre lighting, and accent lighting — all planned, specified, and installed outside teaching hours.",
        },
        {
          icon: "Cable",
          title: "Trunking & Containment",
          description:
            "Cable trunking and containment installations for new circuits, room layouts, and service additions — routed cleanly and dressed to a finished standard throughout.",
        },
        {
          icon: "Building2",
          title: "Outdoor Electrical Works",
          description:
            "External electrical installations covering outdoor power supplies and site lighting — all weatherproofed, IP-rated, and installed to the school's operational requirements.",
        },
        {
          icon: "CheckCircle",
          title: "Small Power & Sockets",
          description:
            "New socket and small power installations to meet evolving classroom and administrative needs — specified for correct loading, installed cleanly, and certified on completion.",
        },
      ],
      challenge:
        "Providing electrical maintenance and planned works to a grammar school with several hundred pupils requires a level of care and coordination that goes beyond a typical commercial contract. Works cannot disrupt the school day. Emergency faults must be resolved without delay. Every job must be completed to a standard that reflects the trust the school places in Nexgen — because children and staff are on site every day.",
      solution:
        "Nexgen established a clear communication channel with site manager Phil Vance and caretaker Lewis from day one. Emergency works are attended within 1 hour — Nexgen engineers are familiar with the site, know the layout, and can diagnose and resolve faults quickly. Planned works are scheduled and confirmed with the school in advance, completed outside school hours or during holidays. Every completed installation is certified to BS 7671 and a record kept for the school's compliance files.",
      timeline: [
        {
          phase: "Phase 1",
          title: "Contract Award & Onboarding",
          description:
            "First meeting with Phil Vance (site manager) and Lewis (caretaker). Nexgen presented its ethos, accreditations, and experience. Exclusive maintenance contract awarded — late 2018.",
          duration: "Late 2018",
          status: "completed",
        },
        {
          phase: "Phase 2",
          title: "First Planned Works",
          description:
            "Initial planned works programme undertaken — lighting upgrades in reception, offices, and the sports centre. All works completed outside school hours with no disruption to the timetable.",
          duration: "2019",
          status: "completed",
        },
        {
          phase: "Phase 3",
          title: "Ongoing Reactive & Planned Maintenance",
          description:
            "Continuous delivery of reactive maintenance (emergency and standard SLA) combined with planned works — trunking, outdoor electrics, small power, and service additions across the site.",
          duration: "2019 – present",
          status: "completed",
        },
        {
          phase: "Phase 4",
          title: "Continued Partnership",
          description:
            "The relationship with Herschel Grammar School continues to this day. Nexgen remains the school's exclusive electrical contractor — a partnership built on trust and consistently maintained.",
          duration: "Ongoing",
          status: "in-progress",
        },
      ],
      gallery: [
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-hero.jpg",
          alt: "Herschel Grammar School — electrical maintenance contract",
          caption:
            "Herschel Grammar School — Nexgen's exclusive electrical maintenance partner since 2018",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-cover-primary.png",
          alt: "Herschel Grammar School — school building exterior",
          caption:
            "Herschel Grammar School — co-educational grammar school with academy status, Slough",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-ceiling-lights.jpg",
          alt: "Herschel Grammar School — ceiling lighting installation",
          caption:
            "Ceiling lighting — installed and commissioned across the school",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-office-ceiling-lights.jpg",
          alt: "Herschel Grammar School — office ceiling lights",
          caption:
            "Office ceiling lights — upgraded as part of the planned works programme",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-reception-ceiling-lights.jpg",
          alt: "Herschel Grammar School — reception ceiling lighting",
          caption:
            "Reception ceiling lighting — clean finish, installed outside school hours",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-sports-centre-ceiling-lights.jpg",
          alt: "Herschel Grammar School — sports centre ceiling lights",
          caption:
            "Sports centre ceiling lights — high-level lighting to the required lux levels",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-accent-lights.jpg",
          alt: "Herschel Grammar School — accent lighting",
          caption:
            "Accent lighting — specified and installed to enhance the school environment",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-trunking.jpg",
          alt: "Herschel Grammar School — cable trunking installation",
          caption:
            "Cable trunking — routed cleanly for new circuits and service additions",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-outdoor-electrics.jpg",
          alt: "Herschel Grammar School — outdoor electrical works",
          caption:
            "Outdoor electrics — weatherproofed and installed to operational requirements",
        },
        {
          src: "/images/projects/commercial/herschel-grammar/nexgen-herschel-grammar-sockets.jpg",
          alt: "Herschel Grammar School — socket and small power installation",
          caption:
            "Small power and sockets — new circuits installed and certified throughout",
        },
      ],
      testimonial: {
        quote:
          "Richard, Gavin and the team at Nexgen are quick to carry out both planned and reactive electrical works, to keep our school running. Innovative and practical solutions from the team, have helped us future proof our buildings while representing excellent value for money. We look forward to a continued working relationship with them.",
        author: "Herschel Grammar School",
        role: "Client",
        company: "Herschel Grammar School, Slough",
      },
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "why-schools-need-reliability",
          heading: "A School That Trusted Us. A Standard We Took Personally.",
          paragraphs: [
            "When Phil Vance called Nexgen in 2018, he needed more than a contractor — he needed someone he could rely on without question. An electrical fault at a school isn't just an inconvenience. With children on site, every problem carries a different weight. Nexgen understood that from the first meeting, and it has shaped how we approach every job at Herschel ever since.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "the-cup-of-tea-standard",
          heading: "The Cup of Tea Test.",
          paragraphs: [
            "We are proud of the ongoing service we give to Herschel Grammar School — and we are sure they appreciate what we do, because they always have a cup of tea or coffee with biscuits ready for us. It sounds like a small thing. It isn't. It's the clearest sign that the relationship is working: that the school trusts the team, values what they do, and is glad to see them when they arrive.",
          ],
          background: "default",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "Ongoing Since 2018. Still Going.",
          paragraphs: [
            "The Herschel Grammar School contract has been running since late 2018. Every reactive call attended on time. Every planned work completed without disruption. Every installation certified and on record. Nexgen is the school's exclusive electrical contractor — and the partnership shows no sign of ending.",
          ],
          background: "muted",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // THE HUB FARNBOROUGH — Commercial Lighting Refurbishment (stub — in progress)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-the-hub-farnborough-001",
    slug: "the-hub-farnborough-commercial-lighting",
    category: "commercial",
    categoryLabel: "Commercial",
    title: "The Hub Farnborough — Commercial Lighting Refurbishment",
    heroHeadline: ["Hub Farnborough", "Lighting Refurb"],
    heroIndicators: [
      {
        icon: "Lightbulb",
        title: "LED Refurb",
        description:
          "Full LED lighting refurbishment replacing legacy metal halide and fluorescent throughout.",
      },
      {
        icon: "Gauge",
        title: "Energy Savings",
        description:
          "Significant reduction in lighting energy consumption verified by post-completion energy monitoring.",
      },
      {
        icon: "Building2",
        title: "Commercial Fit",
        description:
          "Designed to CIBSE LG7 standards for office and public-facing commercial areas within The Hub.",
      },
      {
        icon: "MapPin",
        title: "Farnborough",
        description:
          "Delivered within The Hub Farnborough commercial development with tenant occupation maintained.",
      },
    ] as const,
    clientSector: "Commercial Office — Hospitality/Co-Working",
    status: "in-progress",
    description:
      "Intact Electrical were chosen as the preferred and trusted electrical installation experts for The Hub Farnborough — an award-winning 1930s building originally an airport departure lounge and control tower, completely restored to provide contemporary office accommodation.",
    coverImage: {
      src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-cover-primary.jpg",
      alt: "The Hub Farnborough — commercial lighting refurbishment",
    },
    kpis: {
      budget: "Commercial Contract",
      timeline: "In Progress",
      capacity: "Internal & External",
      location: "Farnborough, Hampshire",
    },
    tags: [
      "Commercial Lighting",
      "Office Refurbishment",
      "Heritage Building",
      "In Progress",
    ],
    progress: 30,
    isFeatured: false,
    publishedAt: "2026-05-04T09:00:00.000Z",
    updatedAt: "2026-05-04T09:00:00.000Z",
    detail: {
      intro: {
        label: "Commercial Lighting Project",
        headlineWords: ["Flying", "high", "at", "The", "Hub."],
        leadParagraph:
          "The Hub Farnborough is an award-winning 1930s building — originally an airport departure lounge and control tower, completely restored and refurbished to provide contemporary office accommodation. Intact Electrical were chosen as the preferred and trusted electrical installation experts for the internal and external commercial office lighting refurbishments.",
        bodyParagraphs: [
          "We are meticulous in completing projects that leave our clients delighted, believing you are only as good as your last job.",
          "Project detail will be updated as works progress. Gallery images below show the scope and quality of installation delivered to date.",
        ],
        pillars: [
          {
            num: "01",
            title: "Heritage-Sensitive Installation",
            description:
              "Working within a Grade II listed 1930s former airport building demands precision and restraint. Every lighting position, conduit route, and fixing point is agreed with the client and building manager before work commences — no surprises, no remedial reinstatement.",
          },
          {
            num: "02",
            title: "CIBSE LG7 Compliant Output",
            description:
              "Commercial office illuminance levels and glare-control ratios are met throughout. Luminaire selection, mounting heights, and aiming angles are calculated to LG7 specification — delivering a workspace that performs for occupants from day one.",
          },
          {
            num: "03",
            title: "Phased Around Live Tenants",
            description:
              "The Hub is fully occupied during the refurbishment programme. Work is sequenced floor-by-floor and room-by-room around tenant schedules, with temporary lighting maintained throughout. Each area is signed off and handed back before the next phase begins.",
          },
        ],
      },
      gallery: [
        {
          src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-cover-primary.jpg",
          alt: "The Hub Farnborough — commercial lighting refurbishment",
          caption:
            "The Hub Farnborough — award-winning 1930s building, Farnborough",
        },
        {
          src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-internal-lighting.jpg",
          alt: "The Hub Farnborough — lighting installation",
          caption:
            "Internal lighting installation — contemporary office fit-out",
        },
        {
          src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-lighting-detail.jpg",
          alt: "The Hub Farnborough — commercial lighting detail",
          caption: "Lighting detail — specification and finish",
        },
        {
          src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-office-lighting.jpg",
          alt: "The Hub Farnborough — office electrical installation",
          caption:
            "Office lighting and electrical — installed to specification",
        },
        {
          src: "/images/projects/commercial/the-hub-farnborough/nexgen-the-hub-farnborough-completed-areas.jpg",
          alt: "The Hub Farnborough — completed areas",
          caption: "Completed areas — Intact Electrical flying high at The Hub",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HARVEY NICHOLS — Industrial Chiller Upgrade
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-harvey-nichols-001",
    slug: "harvey-nichols-chiller-upgrade",
    category: "industrial",
    categoryLabel: "Industrial",
    title: "Harvey Nichols Chiller Upgrade",
    heroHeadline: ["Harvey Nichols", "Chiller Upgrade"],
    heroIndicators: [
      {
        icon: "Zap",
        title: "Chiller Supply",
        description:
          "Dedicated 3-phase electrical supply and control system for new chiller plant on roof level.",
      },
      {
        icon: "Shield",
        title: "Commercial Grade",
        description:
          "All works to commercial specification with full switchgear protection and isolation arrangements.",
      },
      {
        icon: "ClipboardCheck",
        title: "NICEIC Certified",
        description:
          "Chiller electrical installation tested, certified and handed over with full documentation package.",
      },
      {
        icon: "Building2",
        title: "Harvey Nichols",
        description:
          "Executed within live luxury retail environment maintaining store operations throughout installation.",
      },
    ] as const,
    clientSector: "Luxury Retail — Department Store",
    status: "completed",
    description:
      "Full electrical package for the rooftop chiller upgrade at Harvey Nichols Knightsbridge — one of the UK's most prestigious luxury department stores. Nexgen managed complete strip-out, new containment, Schneider MCCB panel installation, and commissioning within a live retail environment.",
    coverImage: {
      src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-bank-staged.jpg",
      alt: "Harvey Nichols Knightsbridge rooftop — Trane chiller units installed and staged during upgrade works",
    },
    kpis: {
      budget: "Commercial Contract",
      timeline: "Completed",
      capacity: "LV / MCCB Distribution",
      location: "Knightsbridge, London",
    },
    tags: [
      "Chiller Upgrade",
      "Industrial",
      "Luxury Retail",
      "Knightsbridge",
      "Trane",
      "Schneider",
      "MCCB",
      "Cable Management",
    ],
    progress: 100,
    isFeatured: true,
    publishedAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
    detail: {
      intro: {
        label: "Industrial Electrical Project",
        headlineWords: ["Knightsbridge.", "Delivered", "Right."],
        leadParagraph:
          "Harvey Nichols Knightsbridge is one of the most iconic luxury department stores in the world — a site where the standard expected of every contractor is as high as the brand itself. Nexgen was appointed to deliver the full electrical package for the rooftop chiller upgrade, covering complete strip-out of the existing installation, new containment infrastructure, Schneider MCCB panel boards, power distribution cabling, and full commissioning.",
        bodyParagraphs: [
          "Working above one of London's busiest retail destinations required meticulous planning, strict access coordination, and workmanship that matched the environment. Rooftop crane operations, carefully sequenced road closures, and a phased programme ensured no disruption to live retail below.",
          "The completed installation delivers a modern, resilient electrical infrastructure to support the new Trane chiller plant — engineered to last, fully documented, and certified to BS 7671.",
        ],
        pillars: [
          {
            num: "01",
            title: "Live Environment Delivery",
            description:
              "Complete chiller upgrade executed above an active luxury retail store — zero disruption to trading operations throughout.",
          },
          {
            num: "02",
            title: "Crane & Logistics Expertise",
            description:
              "Road closures, lift plans, and crane operations coordinated in central Knightsbridge to deliver heavy materials safely to a restricted rooftop.",
          },
          {
            num: "03",
            title: "Engineered to Last",
            description:
              "New containment, Schneider MCCB panels, and full BS 7671 certification — a future-ready electrical infrastructure for the upgraded chiller plant.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Full Electrical Strip-Out",
          description:
            "Safe isolation and complete removal of all redundant electrical cabling, containment, and ageing switchgear back to the main rooftop transformer position.",
        },
        {
          icon: "Settings",
          title: "Crane Operations & Logistics",
          description:
            "Coordination of road closures, crane lifts, and controlled delivery schedules to transport large-scale materials onto the Knightsbridge rooftop safely.",
        },
        {
          icon: "Cable",
          title: "New Cable Containment",
          description:
            "Installation of heavy-duty ladder rack, galvanised cable tray, and conduit systems across the rooftop plant area for power and control cabling.",
        },
        {
          icon: "Shield",
          title: "Schneider MCCB Panel Boards",
          description:
            "Two new Schneider MCCB panel boards providing enhanced protection, improved fault discrimination, and increased reliability for the chiller infrastructure.",
        },
        {
          icon: "Gauge",
          title: "Power Distribution & Control Wiring",
          description:
            "New power distribution cabling, control and interface wiring to mechanical plant, circuit identification, labelling, and final terminations throughout.",
        },
        {
          icon: "CheckCircle",
          title: "Testing, Commissioning & Certification",
          description:
            "Full electrical testing and inspection to BS 7671, functional testing of controls, phase rotation checks, commissioning support, and final certification.",
        },
      ],
      timeline: [
        {
          phase: "Phase 1",
          title: "Strip-Out & Isolation",
          duration: "2 weeks",
          status: "completed",
          description:
            "Safe isolation of existing systems, full strip-out of redundant cabling, containment, and ageing switchgear back to the rooftop transformer.",
        },
        {
          phase: "Phase 2",
          title: "Crane Operations & Material Delivery",
          duration: "1 week",
          status: "completed",
          description:
            "Road closures coordinated, crane lifts executed to deliver cable drums, ladder rack, MCCB panels, and containment materials to the rooftop.",
        },
        {
          phase: "Phase 3",
          title: "Containment & Panel Installation",
          duration: "3 weeks",
          status: "completed",
          description:
            "New ladder rack, cable tray, and conduit systems installed. Schneider MCCB panel boards installed and wired. Power and control cabling pulled through.",
        },
        {
          phase: "Phase 4",
          title: "Testing, Commissioning & Handover",
          duration: "1 week",
          status: "completed",
          description:
            "Full BS 7671 testing and inspection, functional commissioning of chiller plant controls, final certification and documentation handover.",
        },
      ],
      challenge:
        "Delivering a full electrical strip-out and new infrastructure installation on the rooftop of an active, high-footfall luxury department store in central Knightsbridge — with restricted access, sensitive crane operations on a busy public street, and zero tolerance for retail disruption.",
      solution:
        "Nexgen developed a detailed sequencing programme with phased crane operations, traffic management coordination with local authorities, and a hot-work permit regime. All rooftop access, material lifts, and critical works were scheduled outside trading hours or in controlled windows — ensuring Harvey Nichols remained fully operational throughout.",
      gallery: [
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-bank-staged.jpg",
          alt: "Harvey Nichols — five Trane chiller units installed and staged on Knightsbridge rooftop",
          caption:
            "Five Trane chiller units installed and staged on the Harvey Nichols rooftop, Knightsbridge",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-rooftop-chiller-walkway.jpg",
          alt: "Harvey Nichols — rooftop chiller walkway with containment and London skyline visible",
          caption:
            "Rooftop walkway between chiller units — containment installed with the Knightsbridge skyline behind",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-main-switchboard-panel.jpg",
          alt: "Harvey Nichols — completed ABB main distribution switchboard with S6 labelled circuit breakers",
          caption:
            "Completed main switchboard — S6 circuit breakers serving chiller plant, PFC, and generator changeover",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-existing-panel-live-connections.jpg",
          alt: "Harvey Nichols — existing distribution panel showing live cable terminations before strip-out",
          caption:
            "Existing panel before strip-out — live terminations showing the complexity of the legacy installation",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-cable-drums-rooftop.jpg",
          alt: "Harvey Nichols chiller upgrade — cable drums and materials staged on London rooftop",
          caption:
            "Cable drums staged on the London rooftop — scale of materials for the chiller upgrade programme",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-units-rooftop.jpg",
          alt: "Harvey Nichols — row of Trane R454B chiller units installed on rooftop",
          caption:
            "Trane R454B chiller units — installed, cabled, and commissioned on the Harvey Nichols rooftop",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-cable-ladder-installation.jpg",
          alt: "Harvey Nichols — galvanised cable ladder installation for chiller power supply",
          caption:
            "Galvanised cable ladder — installed to route power feeds to chiller plant",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-cable-tray.jpg",
          alt: "Harvey Nichols — cable tray and containment at base of Trane chiller unit",
          caption:
            "Cable tray at chiller base — containment installed and dressed to specification",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-trane-chiller-electrical.jpg",
          alt: "Harvey Nichols — Trane Technologies chiller unit with electrical containment and danger signage",
          caption:
            "Trane chiller electrical connection — containment installed with correct danger labelling",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-underfloor-cable-management.jpg",
          alt: "Harvey Nichols — under-floor cable management vault with heavy cable runs",
          caption:
            "Under-floor cable management — heavy cable bundles routed through basement void",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-control-panel.jpg",
          alt: "Harvey Nichols — open chiller control panel showing MCBs and wiring",
          caption:
            "Chiller control panel — MCBs, contactors, and wiring installed to specification",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-plant-room-installation.jpg",
          alt: "Harvey Nichols — plant room with insulated pipework and cable containment",
          caption:
            "Plant room installation — cable containment and services routed through mechanical plant area",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-rooftop-pipework-containment.jpg",
          alt: "Harvey Nichols — rooftop electrical containment with pipework and London skyline",
          caption:
            "Rooftop installation — electrical containment and pipework with London skyline in view",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-plant-room-cable-containment.jpg",
          alt: "Harvey Nichols — plant room walkway grating with cable containment below",
          caption:
            "Plant room cable containment — routed below steel grating walkway in plant area",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-vfd-pump-controller.jpg",
          alt: "Harvey Nichols — Grundfos VFD pump controller with cable runs and isolator",
          caption:
            "Grundfos VFD pump controller — installed, cabled, and commissioned",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-rooftop-earthing-cables.jpg",
          alt: "Harvey Nichols — rooftop steel grating with earth and bonding cables",
          caption:
            "Rooftop earthing cables — earth and bonding runs through steel grating structure",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-cable-identification-labels.jpg",
          alt: "Harvey Nichols — cable identification labels on supply cables through security mesh",
          caption:
            "Cable identification labels — circuit labelling applied to all supply cables",
        },
        {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg",
          alt: "Harvey Nichols — commissioned Trane R454B chiller bank on rooftop",
          caption:
            "Chiller bank commissioned — Trane R454B units operational on Harvey Nichols rooftop",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "knightsbridge-standard",
          heading: "The Standard the Brand Demands",
          paragraphs: [
            "Harvey Nichols sets the benchmark for luxury retail in the UK. Every trade entering the building is expected to match the quality the brand represents. When Nexgen was appointed to the chiller upgrade programme, the standard required went beyond a typical industrial installation.",
            "On a project like this, workmanship is not just about compliance — it is about presentation. Every cable entry, every label, every containment run is visible to the building management team and reflects on Nexgen's reputation. The installation was completed to the same standard we apply to every project, regardless of client or contract value.",
          ],
          background: "muted",
        },
        {
          position: "after-scope",
          anchorId: "crane-logistics",
          heading: "Crane Operations in Central London",
          paragraphs: [
            "Delivering materials to a restricted rooftop in Knightsbridge is not a standard logistics challenge. It requires detailed lift plans, coordination with Transport for London, local authority road closure agreements, traffic management teams, and precise timing to minimise disruption to one of London's busiest shopping streets.",
            "Nexgen managed the full logistics operation — from initial site surveys and lift plan development through to on-the-day crane coordination. Large SWA cable drums, Schneider MCCB panel boards, lengths of ladder rack, and galvanised cable tray were all craned to the rooftop within controlled delivery windows. Nothing was left to chance.",
          ],
          background: "default",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCOT PARK GOLF CLUB — Luxury Domestic Rewire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-calcot-park-001",
    slug: "calcot-park-luxury-rewire",
    category: "residential",
    categoryLabel: "Residential",
    title: "Calcot Park Luxury Rewire",
    heroHeadline: ["Calcot Park", "Luxury Rewire"],
    heroIndicators: [
      {
        icon: "Home",
        title: "Full Rewire",
        description:
          "Complete luxury domestic rewire including all first and second fix wiring to all rooms and outbuildings.",
      },
      {
        icon: "Wifi",
        title: "Smart Home",
        description:
          "Integrated smart lighting, automated blinds, CCTV and AV wiring throughout the property.",
      },
      {
        icon: "Shield",
        title: "100A RCBO Board",
        description:
          "New 100A RCBO-protected consumer unit with dedicated circuits for EV charger and pool equipment.",
      },
      {
        icon: "MapPin",
        title: "Calcot Park",
        description:
          "Delivered at a prestigious property within the Calcot Park Golf Club estate, Berkshire.",
      },
    ] as const,
    clientSector: "Residential — High-End Property",
    status: "completed",
    description:
      "Full luxury domestic rewire at a prestigious property within the grounds of Calcot Park Golf Club, Berkshire. Nexgen delivered a comprehensive electrical upgrade combining premium LED lighting design, smart home integration, external feature and security lighting, CCTV, and a fully compliant new consumer unit.",
    coverImage: {
      src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-front-elevation-night-lighting.jpg",
      alt: "Calcot Park luxury property — external lighting illuminating the front elevation at night",
    },
    kpis: {
      budget: "Premium Residential",
      timeline: "Completed",
      capacity: "100A — RCBO Protected",
      location: "Calcot Park, Berkshire",
    },
    tags: [
      "Luxury Rewire",
      "Residential",
      "LED Lighting",
      "Smart Home",
      "CCTV",
      "Berkshire",
      "Consumer Unit",
      "External Lighting",
      "Calcot Park",
    ],
    progress: 100,
    isFeatured: true,
    publishedAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
    detail: {
      intro: {
        label: "Luxury Residential Project",
        headlineWords: ["Premium.", "Smart.", "Done", "Right."],
        leadParagraph:
          "When a prestige property within the grounds of Calcot Park Golf Club required a full electrical upgrade, Nexgen was appointed to deliver a comprehensive rewire that matched the quality of the home. The scope combined premium LED lighting design, smart home integration, external feature and security lighting, CCTV installation, and a new compliant consumer unit — all completed to the highest standard of workmanship.",
        bodyParagraphs: [
          "Luxury residential work demands a different approach. Every decision — from the selection of fittings to the routing of cables — is made with the client's lifestyle and the property's aesthetic in mind. Nexgen worked with care and precision throughout, protecting finishes and delivering a result the client was proud of.",
          "The completed installation transformed every aspect of the property's electrical infrastructure — from the consumer unit to the final switch plate, from the external driveway lights to the recessed downlights in every room.",
        ],
        pillars: [
          {
            num: "01",
            title: "Premium Lighting Design",
            description:
              "Recessed LED downlights throughout every room, bespoke feature lighting, and externally designed lighting to complement the architecture and grounds.",
          },
          {
            num: "02",
            title: "Smart Home Integration",
            description:
              "Nest Learning Thermostat, multimedia cabling, and dedicated data infrastructure — technology integrated cleanly and unobtrusively into a high-spec interior.",
          },
          {
            num: "03",
            title: "Security & External",
            description:
              "Full CCTV installation with HD remote access, and strategically positioned external security lighting covering the property and grounds.",
          },
          {
            num: "04",
            title: "Certified & Compliant",
            description:
              "New consumer unit with individual RCBOs and surge protection. Full BS 7671 testing, inspection, and certification — documentation provided at handover.",
          },
        ],
      },
      scope: [
        {
          icon: "Zap",
          title: "Full Electrical Rewire",
          description:
            "Complete strip-out of the existing electrical installation and full rewire designed around the client's high-specification requirements.",
        },
        {
          icon: "Lightbulb",
          title: "LED Lighting Throughout",
          description:
            "Recessed LED downlights installed throughout all rooms, with bespoke feature lighting to key architectural areas of the property.",
        },
        {
          icon: "Activity",
          title: "External Feature & Security Lighting",
          description:
            "Strategically positioned external security and feature lighting installed to enhance the property and grounds at night — showcased in the project gallery.",
        },
        {
          icon: "Settings",
          title: "Data, Multimedia & Smart Home",
          description:
            "Dedicated data points, high-speed network infrastructure, media wall installations with concealed cabling, and Nest Learning Thermostat integration.",
        },
        {
          icon: "Gauge",
          title: "CCTV System",
          description:
            "Full CCTV installation covering the property with high-definition monitoring and remote access capability configured and commissioned.",
        },
        {
          icon: "Shield",
          title: "New Consumer Unit",
          description:
            "New consumer unit with individual RCBOs and surge protection device — improved safety, reliability, and full compliance with current BS 7671 wiring regulations.",
        },
        {
          icon: "CheckCircle",
          title: "Testing, Certification & Handover",
          description:
            "Full BS 7671 electrical testing and inspection. Every circuit tested, results documented, and full certification provided at handover.",
        },
      ],
      challenge:
        "Delivering a comprehensive full rewire of a high-specification luxury property within the grounds of a prestigious golf club — with a client expecting the quality of finish to match the quality of their home, and zero tolerance for damage to premium interior finishes and landscaping.",
      solution:
        "Nexgen worked methodically, protecting all surfaces and finishes before starting each phase. Cable routes were planned to minimise disruption to completed rooms, and all chasing and make-good works were managed to the highest standard. A room-by-room programme allowed the client to use areas of the home throughout the project.",
      gallery: [
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-front-elevation-night-lighting.jpg",
          alt: "Calcot Park luxury property — beautifully illuminated front elevation at night with porch spotlights and wall lights",
          caption:
            "Front elevation at night — porch spotlights, wall lights, and driveway lighting installed and commissioned",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-property-night-panorama.jpg",
          alt: "Calcot Park — full property panorama at night showing complete external lighting scheme",
          caption:
            "Full property at night — complete external lighting scheme illuminating the entire grounds",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-rear-patio-night-uplighters.jpg",
          alt: "Calcot Park — rear patio at night with wall uplighters, bi-fold door lighting, and garden lights",
          caption:
            "Rear patio at night — wall uplighters and patio lighting with bi-fold door exterior illuminated",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-front-elevation-night-wide.jpg",
          alt: "Calcot Park — wide night shot showing entire property illuminated with full external lighting scheme",
          caption:
            "Wide night elevation — external lighting covering front, side, and garage areas of the property",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-garden-terrace-step-lights-night.jpg",
          alt: "Calcot Park — landscaped garden terrace at night with recessed step lights and wall plinth lights glowing warmly",
          caption:
            "Garden terrace at night — recessed step lights and plinth lights illuminating the landscaped area",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-garden-recessed-ground-lights-night.jpg",
          alt: "Calcot Park — garden terrace with recessed ground lights along wall base and step lighting at night",
          caption:
            "Recessed ground lights — installed at the base of garden walls and along terrace steps",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-garden-plinth-lights-seating-night.jpg",
          alt: "Calcot Park — garden plinth lights and raised seating area illuminated at night",
          caption:
            "Garden plinth lights — seating area and raised planters illuminated at night",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-living-room-led-downlights.jpg",
          alt: "Calcot Park — interior living room with recessed LED downlights, herringbone floor and modern fireplace",
          caption:
            "Living room — recessed LED downlights throughout, complementing the herringbone floor and fireplace",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-kitchen-led-downlights.jpg",
          alt: "Calcot Park — high-spec kitchen with recessed LED downlights, high-gloss units, and integrated appliances wired",
          caption:
            "Kitchen — LED downlights, integrated appliances wired, and all kitchen circuits installed",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-dining-room-led-downlights.jpg",
          alt: "Calcot Park — dining room with recessed LED downlights and premium velvet and marble interior",
          caption:
            "Dining room — recessed LED downlights complementing the luxury interior design",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-nest-thermostat-smart-heating.jpg",
          alt: "Calcot Park — Nest Learning Thermostat installed as part of smart home integration package",
          caption:
            "Nest Learning Thermostat — smart home integration installed, wired, and configured",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-exterior-security-floodlight-cctv.jpg",
          alt: "Calcot Park — external security floodlight and CCTV camera installed on gable end of property",
          caption:
            "External security — floodlight and CCTV camera installed on gable, covering driveway approach",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-exterior-security-light-dusk.jpg",
          alt: "Calcot Park — external security light installed under eaves, property exterior at dusk",
          caption:
            "External security light — installed under eaves, covering the property perimeter",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-property-exterior-side-view.jpg",
          alt: "Calcot Park — property exterior side view showing yellow brick, patio area, and mature tree setting",
          caption:
            "Property exterior — side elevation showing the quality and setting of the home",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-garden-terrace-daylight.jpg",
          alt: "Calcot Park — landscaped garden terrace in daylight with steps, planted borders, and grassed area",
          caption:
            "Garden terrace in daylight — landscaped steps and planters where external ground lights were installed",
        },
        {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-garden-terrace-planters.jpg",
          alt: "Calcot Park — garden terrace alternate angle showing planted borders and recessed lighting positions",
          caption:
            "Garden terrace — alternate view of planted borders and terrace where external lighting was installed",
        },
      ],
      narrativeBlocks: [
        {
          position: "after-intro",
          anchorId: "luxury-residential-standard",
          heading: "The Detail That Makes the Difference",
          paragraphs: [
            "In a home like this, electrical work is not background infrastructure — it is part of the design. The placement of each downlight, the routing of every cable, the choice of fittings — all of it contributes to how the finished space looks and feels. Nexgen's approach to premium residential work starts with understanding the client's vision and working backwards from the end result.",
            "The Calcot Park rewire was delivered with the care and precision the property deserved. Every room was treated as a showcase. The external lighting scheme was designed to complement the architecture, not just illuminate it — and the results speak for themselves in the night photography.",
          ],
          background: "muted",
        },
        {
          position: "after-gallery",
          anchorId: "the-result",
          heading: "A Home Transformed",
          paragraphs: [
            "The completed installation covers every electrical system in the property — from the new consumer unit to the final external ground light. The client now has a home with premium interior lighting in every room, a full external security and feature lighting scheme, smart home controls, high-definition CCTV, and a fully certified, compliant electrical installation.",
            "This is Nexgen residential work at its best — thorough, detail-focused, and completed to a standard that lasts.",
          ],
          background: "default",
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
