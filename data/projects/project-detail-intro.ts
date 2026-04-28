import type { SectionIntroData } from "@/types/sections";

export const projectDetailIntroData: SectionIntroData = {
  sectionId: "project-intro",
  label: "Project Delivery",
  headlineWords: [
    "Installed.",
    "Tested.",
    "Certified.",
    "And",
    "Handed",
    "Over.",
  ],
  leadParagraph:
    "Every project we deliver follows a disciplined process — from design through first and second fix installation to testing, commissioning, and certification. Backed by NICEIC approval and compliant with BS 7671 IEE 18th Edition Wiring Regulations throughout, the standard of delivery is consistent across every project, every sector.",
  bodyParagraphs: [
    "Our installation methodology is built around the current IEE 18th Edition Wiring Regulations and BS 7671. From initial design and containment through to final connections, every stage is carried out by NICEIC-registered operatives under qualified supervision. Compliance is not a final check — it is built into each stage of the installation process.",
    "At project completion, every client receives a full handover pack as standard — including the Electrical Installation Certificate, EICR, test results, inspection records, and any as-installed drawings applicable to the scope. Documentation is prepared throughout the project, not retrospectively, ensuring accuracy and completeness at the point of practical completion.",
  ],
  pillars: [
    {
      num: "01",
      title: "Installed to BS 7671",
      description:
        "All installation work complies with BS 7671 and the IEE 18th Edition Wiring Regulations. NICEIC-registered supervision throughout ensures compliance is maintained at every stage — from containment and cable routing to final connections and protective device coordination.",
    },
    {
      num: "02",
      title: "Tested and Commissioned",
      description:
        "A full testing and commissioning regime is carried out prior to handover, covering insulation resistance, earth continuity, polarity verification, and loop impedance testing. All results are documented and reviewed against design parameters before any system is signed off.",
    },
    {
      num: "03",
      title: "Full Handover Pack",
      description:
        "Every project is closed out with a complete handover pack: Electrical Installation Certificate, EICR, test results, inspection records, and as-installed drawings where applicable. Nothing is outstanding at the point of handover — the client receives everything they need for compliance and future reference.",
    },
  ],
};
