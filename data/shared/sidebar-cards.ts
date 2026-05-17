import type { SidebarCard, ContentSection } from "@/types/shared-content";
import { allNewsArticles } from "@/data/news";
import { allProjects } from "@/data/projects";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED SIDEBAR CARDS DATA
// Data-driven sidebar cards for News Hub and Projects sections
// ═══════════════════════════════════════════════════════════════════════════

export const allSidebarCards: SidebarCard[] = [
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
// CONTENT LINK VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

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
  // Filter by section (or "all"), removing cards with stale content links
  const sectionCards = allSidebarCards.filter(
    (card) => (card.section === section || card.section === "all") && isContentLinkValid(card.href)
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
