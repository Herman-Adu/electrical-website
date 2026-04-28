import type { SectionIntroData } from "@/types/sections";

export const newsCategoriesIntroData: SectionIntroData = {
  sectionId: "news-categories-intro",
  label: "Browse by Topic",
  headlineWords: ["Find", "Exactly", "What", "Your", "Project", "Needs."],
  leadParagraph:
    "Six focused channels organise our content by sector and purpose. Whether you need client-facing case studies for a bid, technical insights for a specification, residential guidance to share with a homeowner, or regulatory commentary to brief your team — choose the channel that matches your current task.",
  bodyParagraphs: [
    "Residential and Industrial channels address the day-to-day realities of home electrification and large-scale infrastructure. The Partners channel covers developer and supply-chain collaboration — framework agreements, manufacturer partnerships, and shared delivery programmes. Case Studies provide outcome-led project breakdowns with quantified results, ideal for bid support and due diligence packs.",
    "Insights delivers market intelligence and design guidance: EV readiness planning, building electrification strategy, BS 7671 19th Edition briefings, and commentary on standards as they evolve. Reviews brings verified client feedback from commercial landlords, academy trusts, hotel groups, and residential clients — proof points that support procurement decisions. All six channels are updated continuously as projects complete, standards shift, and the industry moves.",
  ],
  pillars: [
    {
      num: "01",
      title: "Six Specialist Channels",
      description:
        "Residential, Industrial, Partners, Case Studies, Insights, and Reviews — each with a distinct editorial focus, primary audience, and publication cadence.",
    },
    {
      num: "02",
      title: "Task-Matched Navigation",
      description:
        "Organised so you can navigate direct to bid support, compliance guidance, sector intelligence, or client testimonials — without trawling through unrelated content.",
    },
    {
      num: "03",
      title: "Continuously Updated",
      description:
        "New articles published as projects complete, regulations change, and market conditions shift. Every channel stays current — no stale content, no outdated standards references.",
    },
  ],
};
