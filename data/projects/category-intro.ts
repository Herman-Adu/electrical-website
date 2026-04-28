import type { SectionIntroData } from "@/types/sections";

export const categoryProjectsIntroData: SectionIntroData = {
  sectionId: "category-intro",
  label: "Category Overview",
  headlineWords: [
    "Built",
    "Right.",
    "Certified.",
    "On",
    "Every",
    "Project.",
  ],
  leadParagraph:
    "Each project category represents a specific electrical discipline — from initial design and installation through to testing, commissioning, and certification. NICEIC approved and working to BS 7671 throughout, every project in this category is delivered to the same exacting standard regardless of size or complexity.",
  bodyParagraphs: [
    "Our project methodology covers full scoping, design, containment, cabling, first and second fix installation — with every stage supervised by NICEIC-registered operatives. At completion, each project is issued with the correct certification documentation: EICR, EIC, test results, and as-installed records as required by the contract.",
    "We regularly work within live environments and phased construction programmes, coordinating with principal contractors, M&E consultants, and facilities management teams. Our supply chain partnerships and on-site supervision structure allow us to integrate cleanly into larger programmes without disruption to ongoing operations or other trades.",
  ],
  pillars: [
    {
      num: "01",
      title: "Scoped and Designed In-House",
      description:
        "Full design-and-install capability — no subcontracting the design stage. Our in-house engineers produce specifications, layouts, and load calculations, giving clients a single point of accountability from instruction through to handover.",
    },
    {
      num: "02",
      title: "Fully Certified at Handover",
      description:
        "Every project is handed over with the complete certification package included as standard: NICEIC approval record, EICR, Electrical Installation Certificate, and full test results. Nothing is outstanding at the point of handover.",
    },
    {
      num: "03",
      title: "Compliant with Programme",
      description:
        "Structured to fit within principal contractor timelines and phased programmes. We work within live site environments, coordinate with other trades, and commit to milestone dates — with the supervision and resource to meet them.",
    },
  ],
  credentialStrip: [
    "NICEIC Approved Contractor",
    "BS 7671 · 18th Edition",
    "Part P Certified",
    "24/7 Emergency Response",
  ],
};
