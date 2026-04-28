import type { SectionIntroData } from "@/types/sections";

export const newsCategoryIntroData: SectionIntroData = {
  sectionId: "category-intro",
  label: "Channel Articles",
  headlineWords: ["Field-Verified.", "Standards-Referenced.", "Practically", "Applied."],
  leadParagraph:
    "Every article in this channel is drawn from live project experience, regulatory review cycles, or direct client and partner feedback. Written for professionals who need accurate, actionable content — not search-optimised padding. Each piece is reviewed against current BS 7671 and NICEIC guidelines before publication.",
  bodyParagraphs: [
    "Our editorial approach prioritises technical accuracy over volume. Whether the article covers a residential rewire methodology, an industrial switchgear upgrade, a partner framework agreement, or a BS 7671 19th Edition change — it is grounded in real decisions made on real projects. Tips and FAQs are written from first-hand installation experience, not aggregated from third-party sources. Career-relevant content — NICEIC pathways, 18th to 19th Edition transition guidance, apprenticeship routes — is updated as the qualification landscape changes.",
    "Use the article grid below to find the most relevant content for your current task. Where a topic intersects multiple disciplines — an industrial case study that also involves community stakeholders, or a residential tip that applies equally to commercial landlords — cross-references are included in the article. For broader exploration, return to the category index or use the main hub feed to browse across all channels.",
  ],
  pillars: [
    {
      num: "01",
      title: "Project-Grounded Writing",
      description:
        "Content sourced from completed installations, documented field reports, and verified client outcomes — not speculative commentary or recycled industry content.",
    },
    {
      num: "02",
      title: "Standards-Referenced Throughout",
      description:
        "Technical articles cite BS 7671, Part P, and NICEIC guidelines so practitioners can cross-check claims. Regulatory content is updated when editions change.",
    },
    {
      num: "03",
      title: "Actionable at Every Level",
      description:
        "Whether you are a qualified engineer, a facilities manager, or a homeowner — each article closes with a practical takeaway, a next step, or a decision to make.",
    },
  ],
};
