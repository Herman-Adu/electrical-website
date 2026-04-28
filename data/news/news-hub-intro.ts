import type { SectionIntroData } from "@/types/sections";

export const newsHubIntroData: SectionIntroData = {
  sectionId: "news-hub-intro",
  label: "The Knowledge Hub",
  headlineWords: ["Current", "Thinking.", "Grounded", "in", "Real", "Work."],
  leadParagraph:
    "From homeowner guides and commercial fit-out briefings to industrial infrastructure intelligence and regulatory updates — our news hub is written for everyone who specifies, manages, or lives with electrical systems. NICEIC-approved insight from engineers who deliver the work, not agencies who write about it.",
  bodyParagraphs: [
    "Whether you are a facilities manager planning a PPM programme, a developer reviewing energy compliance for a new scheme, or a homeowner exploring EV charger options — every article is grounded in current BS 7671 practice and real project experience. We cover residential smart upgrades, multi-site commercial programmes, switchgear and data centre infrastructure, community public sector installations, and the evolving regulatory landscape — including BS 7671 19th Edition updates and Part P changes as they land.",
    "For M&E consultants and contractors, our Insights and Case Studies channels offer design-stage guidance and peer-verified delivery outcomes. For industrial clients and supply chain partners, Industrial and Partners content covers operational resilience and procurement frameworks. Electrical engineers will find standards commentary, technical briefings, and career-relevant regulatory updates. Regular homeowners get plain-English guidance on what to expect, what to ask, and how to budget. Use the category filters to navigate to your domain — or browse latest articles across all channels.",
  ],
  pillars: [
    {
      num: "01",
      title: "Written for Every Audience",
      description:
        "Homeowners, electrical engineers, facilities managers, M&E consultants, developers, and community organisations — every audience has a channel and every channel has a purpose.",
    },
    {
      num: "02",
      title: "Standards-Anchored Editorial",
      description:
        "All technical content references current BS 7671, NICEIC guidelines, and Part P requirements. When regulations evolve — 18th to 19th Edition, new AFDD rules, prosumer installation changes — we cover it first.",
    },
    {
      num: "03",
      title: "Project-Grounded, Not Speculative",
      description:
        "Every article draws on completed installations, documented field findings, and direct client feedback. No recycled press releases. No SEO filler. Real work, clearly explained.",
    },
  ],
  credentialStrip: [
    "NICEIC Approved Contractor",
    "BS 7671 · 18th Edition",
    "Part P Certified",
    "24/7 Emergency Response",
  ],
};
