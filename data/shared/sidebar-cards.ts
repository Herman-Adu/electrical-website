import type { SidebarCard, ContentSection } from "@/types/shared-content";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED SIDEBAR CARDS DATA
// Data-driven sidebar cards for News Hub and Projects sections
// ═══════════════════════════════════════════════════════════════════════════

export const allSidebarCards: SidebarCard[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NEWS HUB - GLOBAL CARDS (shown on main hub and all categories)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-global-001",
    type: "campaign",
    eyebrow: "Net Zero Campaign",
    title: "Building Electrification Guide 2026",
    description:
      "Free download: Planning electrical infrastructure for heat pumps, EV charging, and solar PV integration.",
    ctaLabel: "Download Guide",
    href: "/news-hub/category/insights/future-proofing-electrical-infrastructure-electrification",
    section: "news",
    targetCategories: [],
  },
  {
    id: "news-global-002",
    type: "partner",
    eyebrow: "Partner Spotlight",
    title: "Schneider Electric Certified Team",
    description:
      "24 engineers certified on the latest switchgear and automation technologies through our manufacturer partnership.",
    ctaLabel: "Read More",
    href: "/news-hub/category/partners/manufacturer-partnership-schneider-electric-training",
    section: "news",
    targetCategories: [],
  },
  {
    id: "news-global-003",
    type: "review",
    eyebrow: "Client Review",
    title: "IHG Hotels: 3rd Contract Renewal",
    description:
      "98.5% PPM compliance across 8 hotel properties. Read why our hospitality clients keep coming back.",
    ctaLabel: "Read Review",
    href: "/news-hub/category/reviews/hotel-group-electrical-maintenance-contract-review",
    section: "news",
    targetCategories: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWS HUB - RESIDENTIAL CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-res-001",
    type: "campaign",
    eyebrow: "Residential Campaign",
    title: "Home Electrification Assessment",
    description:
      "Free assessment for homeowners planning heat pump, EV charger, or solar PV installation.",
    ctaLabel: "Book Assessment",
    href: "/contact?service=residential-assessment",
    section: "news",
    targetCategories: ["residential"],
  },
  {
    id: "news-res-002",
    type: "social",
    eyebrow: "Customer Story",
    title: "Taplow Whole-Home Upgrade",
    description:
      "See how we transformed a 1960s property with LED lighting, smart controls, and EV charging.",
    ctaLabel: "View Project",
    href: "/news-hub/category/residential/taplow-residential-energy-refresh",
    section: "news",
    targetCategories: ["residential"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWS HUB - INDUSTRIAL CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "news-ind-001",
    type: "campaign",
    eyebrow: "Industrial Solutions",
    title: "Switchgear Health Check",
    description:
      "Comprehensive assessment of your HV/LV switchgear condition with thermal imaging.",
    ctaLabel: "Request Survey",
    href: "/contact?service=switchgear-survey",
    section: "news",
    targetCategories: ["industrial"],
  },
  {
    id: "news-ind-002",
    type: "partner",
    eyebrow: "Technical Whitepaper",
    title: "Real-Time Monitoring ROI",
    description:
      "Download our analysis of monitoring system payback periods across industrial facilities.",
    ctaLabel: "Download PDF",
    href: "/news-hub/category/industrial/docklands-switchgear-monitoring-upgrade",
    section: "news",
    targetCategories: ["industrial"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS - GLOBAL CARDS (shown on main projects page)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-global-001",
    type: "cta",
    eyebrow: "Start Your Project",
    title: "Free Project Consultation",
    description:
      "Discuss your electrical project requirements with our experienced team. No obligation quote.",
    ctaLabel: "Book Consultation",
    href: "/contact?service=project-consultation",
    section: "projects",
    targetCategories: [],
  },
  {
    id: "proj-global-002",
    type: "campaign",
    eyebrow: "Our Approach",
    title: "Project Methodology Guide",
    description:
      "Learn how we deliver complex electrical projects on time and on budget with our proven process.",
    ctaLabel: "Learn More",
    href: "/about",
    section: "projects",
    targetCategories: [],
  },
  {
    id: "proj-global-003",
    type: "review",
    eyebrow: "Client Testimonials",
    title: "What Our Clients Say",
    description:
      "Read verified reviews from residential, commercial, and industrial project clients.",
    ctaLabel: "View Reviews",
    href: "/news-hub/category/reviews",
    section: "projects",
    targetCategories: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS - RESIDENTIAL CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-res-001",
    type: "campaign",
    eyebrow: "Home Upgrades",
    title: "Whole-Home Rewiring",
    description:
      "Modernise your property with a complete electrical rewire including consumer unit upgrade.",
    ctaLabel: "Get Quote",
    href: "/contact?service=rewiring",
    section: "projects",
    targetCategories: ["residential"],
  },
  {
    id: "proj-res-002",
    type: "social",
    eyebrow: "Smart Living",
    title: "Smart Home Integration",
    description:
      "Transform your home with intelligent lighting, heating controls, and EV charging solutions.",
    ctaLabel: "Explore Options",
    href: "/services/residential",
    section: "projects",
    targetCategories: ["residential"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS - COMMERCIAL LIGHTING CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-comm-001",
    type: "campaign",
    eyebrow: "LED Retrofit",
    title: "Commercial LED Upgrade Programme",
    description:
      "Reduce energy costs by up to 70% with our commercial LED lighting retrofit service.",
    ctaLabel: "Calculate Savings",
    href: "/contact?service=led-retrofit",
    section: "projects",
    targetCategories: ["commercial-lighting"],
  },
  {
    id: "proj-comm-002",
    type: "partner",
    eyebrow: "Lighting Partners",
    title: "Lutron Certified Installers",
    description:
      "Specialist installation of Lutron commercial lighting control systems and DALI integration.",
    ctaLabel: "Learn More",
    href: "/services/commercial",
    section: "projects",
    targetCategories: ["commercial-lighting"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS - POWER BOARDS CATEGORY CARDS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "proj-power-001",
    type: "campaign",
    eyebrow: "Distribution Boards",
    title: "Panel Board Upgrades",
    description:
      "BS 7671 compliant distribution board design and installation for commercial and industrial sites.",
    ctaLabel: "Request Survey",
    href: "/contact?service=panel-upgrade",
    section: "projects",
    targetCategories: ["power-boards"],
  },
  {
    id: "proj-power-002",
    type: "partner",
    eyebrow: "Schneider Partner",
    title: "Prisma Switchboard Solutions",
    description:
      "Authorised Schneider Electric partner for Prisma IP and iPM power distribution systems.",
    ctaLabel: "View Solutions",
    href: "/services/industrial",
    section: "projects",
    targetCategories: ["power-boards"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// GETTER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get sidebar cards filtered by section and optional category.
 * Returns category-specific cards first, then fills with global cards (max 4 total).
 */
export function getSidebarCards(
  section: ContentSection,
  category?: string
): SidebarCard[] {
  // Filter by section (or "all")
  const sectionCards = allSidebarCards.filter(
    (card) => card.section === section || card.section === "all"
  );

  // Global cards (empty targetCategories) for this section
  const globalCards = sectionCards.filter(
    (card) => card.targetCategories.length === 0
  );

  if (!category || category === "all") {
    return globalCards.slice(0, 4);
  }

  // Category-specific cards
  const categoryCards = sectionCards.filter(
    (card) =>
      card.targetCategories.length > 0 &&
      card.targetCategories.includes(category)
  );

  // Return category-specific cards first, then fill with global cards (max 4 total)
  const combined = [...categoryCards, ...globalCards];
  return combined.slice(0, 4);
}

/**
 * Get sidebar cards for News Hub section.
 */
export function getNewsSidebarCards(category?: string): SidebarCard[] {
  return getSidebarCards("news", category);
}

/**
 * Get sidebar cards for Projects section.
 */
export function getProjectsSidebarCards(category?: string): SidebarCard[] {
  return getSidebarCards("projects", category);
}
