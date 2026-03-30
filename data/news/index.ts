import type {
  NewsArticle,
  NewsArticleListItem,
  NewsCategory,
  NewsCategorySlug,
  NewsHubMetricItem,
  NewsSidebarCard,
} from "@/types/news";

export const newsCategories: NewsCategory[] = [
  {
    slug: "residential",
    label: "Residential",
    description:
      "Home electrification stories, smart living upgrades, and homeowner guidance.",
  },
  {
    slug: "industrial",
    label: "Industrial",
    description:
      "Operational resilience, infrastructure rollouts, and industrial transformation updates.",
  },
  {
    slug: "partners",
    label: "Partners",
    description:
      "Collaboration stories with developers, suppliers, and delivery partners.",
  },
  {
    slug: "case-studies",
    label: "Case Studies",
    description:
      "Outcome-led delivery breakdowns showing how complex electrical work performs in the real world.",
  },
  {
    slug: "insights",
    label: "Insights",
    description:
      "Market intelligence, design guidance, and strategic commentary from the field.",
  },
  {
    slug: "reviews",
    label: "Reviews",
    description:
      "Client feedback, service highlights, and trust-building proof points.",
  },
];

export const newsHubMetricItems: NewsHubMetricItem[] = [
  {
    id: "metric-001",
    title: "Live channels",
    value: "6",
    description:
      "Residential, industrial, partners, case studies, insights, and reviews.",
  },
  {
    id: "metric-002",
    title: "Stories seeded",
    value: "7",
    description:
      "Launch-ready editorial content seeded for early stakeholder review.",
  },
  {
    id: "metric-003",
    title: "CMS ready",
    value: "OpenAPI",
    description:
      "Typed models are aligned for future Strapi and schema-first ingestion.",
  },
  {
    id: "metric-004",
    title: "Publishing mode",
    value: "SSR + SSG",
    description:
      "Server-rendered hub with static category and article routes for performance.",
  },
];

export const allNewsArticles: NewsArticle[] = [
  {
    id: "news-001",
    slug: "taplow-residential-energy-refresh",
    category: "residential",
    categoryLabel: "Residential",
    title:
      "Taplow Residential Energy Refresh Cuts Waste Without Compromising Comfort",
    excerpt:
      "A behind-the-scenes look at how a phased home electrification programme reduced energy waste while preserving day-to-day comfort for a growing family home.",
    description:
      "This residential update tracks a practical smart-home and efficiency rollout, blending lighting control, board upgrades, and future-ready EV planning.",
    featuredImage: {
      src: "/images/smart-living-interior.jpg",
      alt: "Smart residential interior with integrated lighting and controls",
    },
    author: {
      name: "Adu Herman",
      role: "Editorial Lead",
    },
    location: "Taplow",
    readTime: "5 min read",
    tags: ["Residential", "Smart Living", "Efficiency"],
    isFeatured: true,
    publishedAt: "2026-03-24T09:00:00.000Z",
    updatedAt: "2026-03-28T11:30:00.000Z",
    spotlightMetric: {
      label: "Projected savings",
      value: "28%",
    },
    detail: {
      intro: [
        "The homeowners needed a cleaner, more resilient electrical foundation before expanding into solar storage and EV charging.",
        "Instead of a disruptive full strip-out, the delivery plan layered board modernisation, smarter circuit zoning, and human-centric lighting upgrades across a controlled six-week programme.",
      ],
      takeaways: [
        "Phased works reduced household disruption and protected critical evening routines.",
        "Future EV infrastructure was baked into the first-stage design to avoid duplicated spend later.",
        "The final layout improved visibility, comfort, and usage analytics for long-term optimisation.",
      ],
      spotlight: [
        { label: "Programme", value: "6 weeks" },
        { label: "Control zones", value: "14" },
        { label: "Future capacity", value: "EV ready" },
      ],
      quote: {
        quote:
          "We now have a house that feels simpler to live in, but far more capable behind the walls.",
        author: "Private Client",
        role: "Homeowner",
      },
    },
  },
  {
    id: "news-002",
    slug: "docklands-switchgear-watch",
    category: "industrial",
    categoryLabel: "Industrial",
    title:
      "Docklands Switchgear Watch: What Real-Time Monitoring Changed in Month One",
    excerpt:
      "Operational telemetry from a live industrial upgrade reveals how monitoring reshaped response times, maintenance planning, and risk visibility within the first month.",
    description:
      "An industrial field report on how live monitoring and disciplined handover reduced uncertainty for facilities teams under active load.",
    featuredImage: {
      src: "/images/power-distribution.jpg",
      alt: "Power distribution systems with industrial monitoring equipment",
    },
    author: {
      name: "Nexgen Delivery Desk",
      role: "Project Communications",
    },
    location: "London Docklands",
    readTime: "6 min read",
    tags: ["Industrial", "Monitoring", "Switchgear"],
    isFeatured: false,
    publishedAt: "2026-03-18T08:00:00.000Z",
    updatedAt: "2026-03-27T16:15:00.000Z",
    spotlightMetric: {
      label: "Response visibility",
      value: "24/7",
    },
    detail: {
      intro: [
        "Month-one reporting focused on whether the new monitoring layer produced operational clarity quickly enough to justify the rollout.",
        "The answer was decisive: facilities leads could spot anomalies earlier, capture better evidence, and coordinate maintenance windows without guesswork.",
      ],
      takeaways: [
        "Alarm prioritisation reduced triage noise for the on-site team.",
        "Load pattern insight surfaced avoidable peaks across shift changes.",
        "Monthly handover reporting became clearer for leadership and insurers.",
      ],
      spotlight: [
        { label: "Sensors live", value: "120+" },
        { label: "Alert tiers", value: "3" },
        { label: "Reporting cadence", value: "Weekly" },
      ],
    },
  },
  {
    id: "news-003",
    slug: "partner-spotlight-build-programme-alignment",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Partner Spotlight: How Early Programme Alignment Reduced Rework on a Mixed-Use Scheme",
    excerpt:
      "A partner story on coordination discipline, early design decisions, and the commercial benefits of treating electrical delivery as a programme conversation from day one.",
    description:
      "This collaboration feature highlights how designers, contractors, and suppliers reduced friction through shared planning.",
    featuredImage: {
      src: "/images/services-commercial.jpg",
      alt: "Commercial construction planning session with delivery partners",
    },
    author: {
      name: "Nexgen Partnerships Team",
      role: "Partner Communications",
    },
    partnerLabel: "BuildWest Group",
    readTime: "4 min read",
    tags: ["Partners", "Coordination", "Delivery"],
    isFeatured: false,
    publishedAt: "2026-03-16T09:45:00.000Z",
    updatedAt: "2026-03-25T10:00:00.000Z",
    spotlightMetric: {
      label: "Rework avoided",
      value: "Low",
    },
    detail: {
      intro: [
        "The programme team chose to align electrical, builder, and supplier decisions earlier than usual, using shared milestones and clearer package boundaries.",
        "That decision paid off in fewer access clashes, stronger procurement sequencing, and better expectations for client reporting.",
      ],
      takeaways: [
        "Early package sequencing reduced reactive redesign pressure.",
        "Stakeholders saw clearer ownership across every workfront.",
        "Procurement visibility improved confidence around long-lead items.",
      ],
      spotlight: [
        { label: "Stakeholders", value: "5 core teams" },
        { label: "Programme horizon", value: "18 months" },
        { label: "Planning format", value: "Shared cadence" },
      ],
    },
  },
  {
    id: "news-004",
    slug: "hospital-power-ring-lessons-learned",
    category: "case-studies",
    categoryLabel: "Case Studies",
    title:
      "Hospital Emergency Power Ring: Lessons Learned from a Live Critical Infrastructure Upgrade",
    excerpt:
      "This case study distils delivery lessons from a live hospital power-ring upgrade where resilience, communication, and sequencing all had zero room for error.",
    description:
      "A case-study article built for stakeholders who want proof, process, and practical lessons from critical infrastructure delivery.",
    featuredImage: {
      src: "/images/services-industrial.jpg",
      alt: "Critical infrastructure project environment with engineering teams on site",
    },
    author: {
      name: "Programme Office",
      role: "Case Study Editor",
    },
    location: "Central London",
    readTime: "7 min read",
    tags: ["Case Study", "Healthcare", "Resilience"],
    isFeatured: false,
    publishedAt: "2026-03-14T07:30:00.000Z",
    updatedAt: "2026-03-26T09:30:00.000Z",
    spotlightMetric: {
      label: "Critical load protected",
      value: "100%",
    },
    detail: {
      intro: [
        "The hospital upgrade demanded more than technical competence; it required operational empathy and relentless sequencing discipline.",
        "Teams aligned outages, clinical priorities, supplier readiness, and escalation routes before each stage moved forward.",
      ],
      takeaways: [
        "Every outage window needs a clinical narrative, not just a technical one.",
        "Escalation routes should be visible to delivery and client-side teams alike.",
        "Progress reporting must translate electrical risk into operational language.",
      ],
      spotlight: [
        { label: "Protected circuits", value: "42" },
        { label: "Outage windows", value: "Night only" },
        { label: "Stakeholder briefings", value: "Daily" },
      ],
      quote: {
        quote:
          "The discipline of communication was as important as the engineering itself.",
        author: "Clinical Estates Lead",
        role: "Client Stakeholder",
      },
    },
  },
  {
    id: "news-005",
    slug: "why-ev-readiness-starts-at-the-board",
    category: "insights",
    categoryLabel: "Insights",
    title: "Why EV Readiness Starts at the Board, Not the Charger",
    excerpt:
      "A practical insight piece for clients planning EV rollouts, showing why upstream infrastructure decisions determine speed, budget, and future flexibility.",
    description:
      "This insight article reframes EV infrastructure planning around the electrical backbone rather than the charging hardware alone.",
    featuredImage: {
      src: "/images/system-diagnostics.jpg",
      alt: "Electrical diagnostics and planning tools for EV readiness",
    },
    author: {
      name: "Technical Strategy Team",
      role: "Insights Editor",
    },
    readTime: "5 min read",
    tags: ["Insights", "EV", "Power Planning"],
    isFeatured: false,
    publishedAt: "2026-03-12T10:30:00.000Z",
    updatedAt: "2026-03-21T12:00:00.000Z",
    spotlightMetric: {
      label: "Planning leverage",
      value: "High",
    },
    detail: {
      intro: [
        "Many EV discussions start with charger models, but successful programmes usually start much earlier in the board strategy and spare capacity conversation.",
        "Clients that assess incoming capacity, load diversity, and phased growth early are far better placed to scale without rework.",
      ],
      takeaways: [
        "Board strategy determines what is realistically scalable.",
        "Load planning avoids over-buying hardware that cannot be fully used.",
        "Future-ready design protects programmes from avoidable second-stage disruption.",
      ],
      spotlight: [
        { label: "Typical phases", value: "3" },
        { label: "Board checks", value: "Capacity first" },
        { label: "Best fit", value: "Scalable estates" },
      ],
    },
  },
  {
    id: "news-006",
    slug: "latest-client-review-canary-wharf-retrofit",
    category: "reviews",
    categoryLabel: "Reviews",
    title:
      "Latest Client Review: Canary Wharf Retrofit Delivery Earns Repeat Appointment",
    excerpt:
      "A new review from a repeat commercial client explains why calm delivery, transparent updates, and tidy handovers still win long after installation is complete.",
    description:
      "This review-led story packages trust signals and delivery proof into a reusable marketing and sales asset.",
    featuredImage: {
      src: "/images/warehouse-lighting.jpg",
      alt: "Completed commercial lighting retrofit project interior",
    },
    author: {
      name: "Client Success Desk",
      role: "Reviews Editor",
    },
    partnerLabel: "Riverside Commercial Centre",
    readTime: "3 min read",
    tags: ["Reviews", "Commercial", "Trust"],
    isFeatured: false,
    publishedAt: "2026-03-11T15:00:00.000Z",
    updatedAt: "2026-03-19T09:15:00.000Z",
    spotlightMetric: {
      label: "Repeat appointment",
      value: "Yes",
    },
    detail: {
      intro: [
        "Repeat work often reflects the quality of process as much as the quality of installation.",
        "This review highlighted communication rhythm, site conduct, and confidence in final handover as decisive reasons for a second appointment.",
      ],
      takeaways: [
        "Consistent updates reduce client uncertainty during delivery.",
        "Tidy handover materials improve trust after practical completion.",
        "Review stories can double as strong conversion assets in the hub.",
      ],
      spotlight: [
        { label: "Client status", value: "Repeat" },
        { label: "Sector", value: "Commercial" },
        { label: "Story role", value: "Proof asset" },
      ],
      quote: {
        quote:
          "The job was well organised, well communicated, and delivered exactly how a busy commercial client needs it to be.",
        author: "Facilities Director",
        role: "Commercial Client",
      },
    },
  },
  {
    id: "news-007",
    slug: "partner-campaign-community-electrification-week",
    category: "partners",
    categoryLabel: "Partners",
    title:
      "Community Electrification Week Launches with Partner-Led Campaign Assets",
    excerpt:
      "A campaign-led partner update showing how shared storytelling, campaign cards, and site-ready assets can turn delivery milestones into usable marketing momentum.",
    description:
      "This partner campaign article bridges operations, comms, and business development in a single newsroom-ready format.",
    featuredImage: {
      src: "/images/community-hero.jpg",
      alt: "Community-focused campaign artwork and electrification story visuals",
    },
    author: {
      name: "Campaign Studio",
      role: "Content Lead",
    },
    partnerLabel: "Community Power Alliance",
    readTime: "4 min read",
    tags: ["Partners", "Campaign", "Community"],
    isFeatured: false,
    publishedAt: "2026-03-09T09:10:00.000Z",
    updatedAt: "2026-03-20T08:40:00.000Z",
    spotlightMetric: {
      label: "Campaign assets",
      value: "12 live",
    },
    detail: {
      intro: [
        "The launch combined campaign storytelling with operational proof so partner teams could use the same source material across sales, social, and project updates.",
        "That structure is exactly why the news hub sidebar matters: campaign modules can sit beside editorial stories without breaking the data model.",
      ],
      takeaways: [
        "Editorial and campaign content can coexist in one publishing architecture.",
        "Reusable cards make fast stakeholder updates easier to distribute.",
        "Partner content becomes more valuable when routed through a stable content model.",
      ],
      spotlight: [
        { label: "Campaign week", value: "7 days" },
        { label: "Reusable cards", value: "12" },
        { label: "Primary channels", value: "Web + social" },
      ],
    },
  },
];

export const newsSidebarCards: NewsSidebarCard[] = [
  {
    id: "sidebar-001",
    type: "campaign",
    eyebrow: "Campaign",
    title: "Spring decarbonisation campaign pack",
    description:
      "Promote smart electrification, lighting upgrades, and EV-readiness with a reusable campaign module in the sidebar.",
    ctaLabel: "View campaign",
    href: "/news-hub/category/insights",
  },
  {
    id: "sidebar-002",
    type: "social",
    eyebrow: "Social story",
    title: "Site progress reels performing well this month",
    description:
      "Short-form updates are becoming a strong supporting layer for project storytelling and proof-led marketing.",
    ctaLabel: "Explore insights",
    href: "/news-hub/category/partners",
  },
  {
    id: "sidebar-003",
    type: "partner",
    eyebrow: "Partner card",
    title: "BuildWest alignment story now live",
    description:
      "A reusable partner feature format that can later be sourced directly from Strapi and campaign schemas.",
    ctaLabel: "Read partner story",
    href: "/news-hub/category/partners/partner-spotlight-build-programme-alignment",
  },
  {
    id: "sidebar-004",
    type: "review",
    eyebrow: "Latest review",
    title: "Repeat appointment secured after retrofit delivery",
    description:
      "Trust-led proof content remains one of the strongest conversion assets in the content mix.",
    ctaLabel: "Read review",
    href: "/news-hub/category/reviews/latest-client-review-canary-wharf-retrofit",
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

export function getSidebarCardsByCategory(
  category: NewsCategorySlug,
): NewsSidebarCard[] {
  if (category === "all") {
    return newsSidebarCards;
  }

  const scoped = newsSidebarCards.filter((card) =>
    card.href.includes(`/${category}`),
  );
  return scoped.length > 0 ? scoped : newsSidebarCards.slice(0, 3);
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
