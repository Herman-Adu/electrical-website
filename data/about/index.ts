/**
 * About Page Data
 * Data-driven content for the About page sections
 * Designed for future CMS integration
 */

import type {
  SectionIntroData,
  SectionProfileData,
  SectionValuesData,
  SectionFeaturesData,
} from "@/types/sections";

// =============================================================================
// COMPANY INTRO DATA
// =============================================================================

export const companyIntroData: SectionIntroData = {
  sectionId: "company-intro",
  label: "Our Story",
  headlineWords: [
    "Powering",
    "London",
    "&",
    "the",
    "Home",
    "Counties",
    "with",
    "Gold-Standard",
    "Electrical",
    "Engineering",
    "Since",
    "2016.",
  ],
  leadParagraph:
    "What started as a two-man operation in south bucks, and have grown into a leading electrical contractor serving homes, businesses, and industrial clients across the capital, and surrounding counties, across the southeast of England",
  bodyParagraphs: [
    "Nexgen Electrical Innovations was founded with a simple belief: that electrical work should be done with integrity, precision, and pride. Over ten years, we've built a reputation for delivering projects on time, within budget, and to standards that exceed expectations.",
    "Today, we employ a team of highly qualified electricians, apprentices, and project managers — all committed to the same founding principles. From small domestic repairs to large-scale industrial installations, we bring the same attention to detail and commitment to every job.",
  ],
  pillars: [
    {
      num: "01",
      title: "Precision Engineering",
      description:
        "Every circuit, every connection, engineered to exacting standards with zero compromise on quality or safety.",
    },
    {
      num: "02",
      title: "Community First",
      description:
        "We reinvest in the communities we serve — from apprenticeship programmes to charitable initiatives that power local growth.",
    },
    {
      num: "03",
      title: "Trusted Partnership",
      description:
        "Our clients are partners. We communicate transparently, deliver consistently, and stand behind every job we complete.",
    },
  ],
};

// =============================================================================
// DIRECTOR PROFILES DATA
// =============================================================================

export const director1Data: SectionProfileData = {
  sectionId: "directors",
  label: "Leadership",
  name: "Richard Barber",
  title: "Co-Founder & Managing Director",
  credentials: [
    "NICEIC Approved",
    "Part P Certified",
    "IEE Member",
    "18th Edition",
  ],
  bio: [
    "Richard Barber is the Co-Founder and Managing Director of Nexgen Electrical Innovations Ltd, bringing over 27 years of experience across the domestic, commercial, and industrial electrical sectors. With a career built on technical expertise, leadership, and a strong client-first mindset, Richard plays a pivotal role in driving the company’s strategic direction and operational excellence.",
    "Together with co-founder Gavin Little, Richard established Nexgen with a clear vision: not just to meet industry standards, but to set them. This ethos underpins every aspect of the business, ensuring a consistent focus on quality, reliability, and long-term client relationships.",
    "Richard leads on strategic planning, operational oversight, and business development, while fostering a culture built on strong communication, accountability, and continuous improvement. His leadership ensures that both clients and strategic partners receive a service that is professional, responsive, and aligned with their needs.",
    "A firm believer in giving back to the community, Richard is actively involved in supporting local initiatives. Nexgen proudly sponsors local sports clubs and provides compliance services to charities, helping them allocate their resources where they are needed most.",
  ],
  quote:
    "Integrity is not a policy. It's the only way I know how to work. Every circuit we wire, every panel we install — it has our name on it. That's not a responsibility I take lightly.",
  image: {
    src: "/images/richard-barber-profile.jpeg",
    alt: "Richard Barber, Managing Director of Nexgen Electrical Innovations",
    priority: true,
  },
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "email", url: "mailto:richard@nexgen-electrical.co.uk" },
  ],
  reversed: false,
};

export const director2Data: SectionProfileData = {
  sectionId: "director-2",
  label: "Leadership",
  name: "Gavin Little",
  title: "Co-Founder & Managing Director",
  credentials: [
    "ECS Gold Card",
    "ISO 9001 Lead",
    "IPAF Licensed",
    "CHAS Accredited",
  ],
  bio: [
    "Gavin Little co-founded Nexgen Electrical Innovations Ltd alongside Richard Barber, with a clear vision — to deliver high-quality electrical services that combine technical excellence with a genuinely client-focused approach. Together, they have built Nexgen into a trusted contractor across the FM, commercial, and fit-out sectors.",
    "Drawing on a strong background in commercial and industrial electrical systems, Gavin leads the business across operations, project delivery, and client relationships. Working closely with Richard, the leadership team ensures every project is delivered to the highest standard, with a shared commitment to quality, accountability, and consistency.",
    "Gavin’s hands-on approach and attention to detail have been instrumental in establishing Nexgen’s reputation for reliability, professionalism, and quality workmanship.",
    "He has also played a key role in securing and maintaining key industry accreditations including NICEIC Approved Contractor, SafeContractor, and Achilles Gold — reinforcing the company’s commitment to compliance, safety, and best practice across all works.",
    "Beyond project delivery, Gavin is focused on building long-term partnerships with clients by removing common pain points within project management. Through a collaborative, team-led approach, Nexgen delivers a fully managed service that ensures efficiency, clear communication, and complete transparency from start to finish.",
  ],
  quote:
    "At NEXGEN, we don’t just deliver electrical installations — we deliver confidence. As a team, we take ownership, solve problems, and provide solutions that stand the test of time.",
  image: {
    src: "/images/gavin-little-profile.jpeg",
    alt: "Gavin Little, Technical Director of Nexgen Electrical Innovations",
    priority: false,
  },
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "email", url: "mailto:gavin@nexgen-electrical.co.uk" },
  ],
  reversed: true,
};

// =============================================================================
// CORE VALUES DATA
// =============================================================================

export const coreValuesData: SectionValuesData = {
  sectionId: "core-values",
  label: "How We Operate",
  headline: "Our Core Values",
  headlineHighlight: "Core Values",
  description:
    "The principles that guide every decision, every interaction, and every project we undertake.",
  values: [
    {
      icon: "Shield",
      title: "Integrity",
      short: "We don't cut corners. Ever.",
      full: "Our reputation is built on doing the right thing — even when no one's looking. Transparent pricing, honest timelines, and work that stands the test of time.",
      color: "cyan",
    },
    {
      icon: "Award",
      title: "Excellence",
      short: "Gold standard, every time.",
      full: "We set our bar higher than the regulations require. From cable dressing to final inspection, every detail reflects our commitment to exceptional craftsmanship.",
      color: "cyan",
    },
    {
      icon: "Users",
      title: "Teamwork",
      short: "Our greatest asset is our people.",
      full: "A culture of mutual respect, shared responsibility, and collective pride. When one of us succeeds, all of us succeed.",
      color: "amber",
    },
    {
      icon: "Lightbulb",
      title: "Innovation",
      short: "We embrace tomorrow's technology today.",
      full: "From smart systems to sustainable solutions, we actively invest in emerging electrical technology to deliver better, faster, and more efficient outcomes.",
      color: "cyan",
    },
    {
      icon: "Zap",
      title: "Reliability",
      short: "On time. On budget. Without compromise.",
      full: "We show up when we say we will, complete work when we commit to, and deliver within the agreed price. Reliability isn't a feature — it's our baseline.",
      color: "amber",
    },
    {
      icon: "Heart",
      title: "Community",
      short: "We give back to where we came from.",
      full: "From apprenticeship programmes to local charity partnerships, we actively invest in the communities we serve — because success means nothing if it isn't shared.",
      color: "cyan",
    },
  ],
  tagline: "THESE ARE NOT JUST WORDS ON A WALL — THEY ARE HOW WE WORK.",
};

// =============================================================================
// PEACE OF MIND DATA
// =============================================================================

export const peaceOfMindData: SectionFeaturesData = {
  sectionId: "peace-of-mind",
  label: "Our Promise",
  headline: "Peace of Mind, Guaranteed",
  headlineHighlight: "Guaranteed",
  description:
    "Your electrical problems, solved with absolute confidence. We don’t just complete jobs — we deliver certainty. Here’s exactly what you can expect from us.",
  pillars: [
    {
      icon: "Shield",
      title: "Fully Licensed & Insured",
      description:
        "All work carried out by NICEIC Approved Contractors. Full public liability and professional indemnity insurance on every project.",
      highlight: false,
    },
    {
      icon: "Award",
      title: "Workmanship Guaranteed",
      description:
        "Every installation backed by our comprehensive workmanship guarantee. If something isn’t right, we fix it — no questions asked.",
      highlight: true,
    },
    {
      icon: "Clock",
      title: "24/7 Emergency Response",
      description:
        "Electrical emergencies don’t keep business hours. Our rapid response team is available around the clock, every day of the year.",
      highlight: false,
    },
    {
      icon: "ThumbsUp",
      title: "Fixed Price Quotes",
      description:
        "No hidden charges. No surprise invoices. We quote clearly, and we deliver to budget. Your financial peace of mind matters to us.",
      highlight: false,
    },
  ],
  checklist: [
    "Written quotations provided for every job",
    "All work tested to BS 7671 18th Edition",
    "Electrical Installation Certificate issued on completion",
    "Full Part P notification where required",
    "Manufacturer warranties honoured and documented",
    "Annual free safety check for returning clients",
  ],
  partners: [
    { name: "NICEIC", abbr: "NIC" },
    { name: "Part P", abbr: "P.P" },
    { name: "NAPIT", abbr: "NAP" },
    { name: "ECS Gold", abbr: "ECS" },
    { name: "CHAS", abbr: "CHA" },
    { name: "ISO 9001", abbr: "ISO" },
  ],
  background: "dark",
};

// =============================================================================
// ALL ABOUT DATA EXPORT
// =============================================================================

export const aboutPageData = {
  companyIntro: companyIntroData,
  director1: director1Data,
  director2: director2Data,
  coreValues: coreValuesData,
  peaceOfMind: peaceOfMindData,
};
