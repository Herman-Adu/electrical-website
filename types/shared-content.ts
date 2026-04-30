// ═══════════════════════════════════════════════════════════════════════════
// SHARED CONTENT TYPES
// Used by both News Hub and Projects sections for consistent grid layouts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Content type discriminator for shared components
 */
export type ContentType = "article" | "project";

/**
 * Section identifier for sidebar card targeting
 */
export type ContentSection = "news" | "projects" | "all";

/**
 * Sidebar card visual type
 */
export type SidebarCardType = "campaign" | "social" | "partner" | "review" | "cta";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED CONTENT LIST ITEM
// Generic interface for items displayed in ContentGridLayout
// ═══════════════════════════════════════════════════════════════════════════

export interface ContentImage {
  src: string;
  alt: string;
}

export interface ContentListItem {
  /** Unique identifier */
  id: string;
  /** URL slug */
  slug: string;
  /** Category slug for URL construction */
  category: string;
  /** Human-readable category label */
  categoryLabel: string;
  /** Item title */
  title: string;
  /** Short description/excerpt */
  excerpt: string;
  /** Publication date ISO string */
  publishedAt: string;
  /** Whether this item is featured */
  isFeatured: boolean;
  /** Optional featured image */
  featuredImage?: ContentImage;
  /** Content type discriminator */
  contentType: ContentType;
}

// ═══════════════════════════════════════════════════════════════════════════
// ARTICLE-SPECIFIC LIST ITEM
// Extends base with article-specific fields
// ═══════════════════════════════════════════════════════════════════════════

export interface ArticleListItem extends ContentListItem {
  contentType: "article";
  /** Reading time estimate */
  readTime: string;
  /** Optional partner attribution */
  partnerLabel?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT-SPECIFIC LIST ITEM
// Extends base with project-specific fields
// ═══════════════════════════════════════════════════════════════════════════

export type ProjectStatusType = "planned" | "in-progress" | "completed";

export interface ProjectListItemExtended extends ContentListItem {
  contentType: "project";
  /** Project status */
  status: ProjectStatusType;
  /** Project location */
  location: string;
  /** Budget range */
  budget?: string;
  /** Client sector */
  clientSector?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED SIDEBAR CARD
// Data-driven sidebar cards for both sections
// ═══════════════════════════════════════════════════════════════════════════

export interface SidebarCard {
  /** Unique identifier */
  id: string;
  /** Visual card type */
  type: SidebarCardType;
  /** Small label above title */
  eyebrow: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** CTA button text */
  ctaLabel: string;
  /** Link destination */
  href: string;
  /** Content section this card belongs to */
  section: ContentSection;
  /** Categories this card should appear on. Empty array = all categories in section */
  targetCategories: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED TOC ITEM
// Generic table of contents item for article and project detail pages
// ═══════════════════════════════════════════════════════════════════════════

export interface TocItem {
  /** Element ID to scroll to */
  id: string;
  /** Display label */
  label: string;
  /** Heading level (1 = main, 2 = sub-section) */
  level?: 1 | 2;
  /** Nested sub-items rendered as indented children */
  children?: TocItem[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED BREADCRUMB ITEM
// Generic breadcrumb item for article and project detail pages
// ═══════════════════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link destination */
  href: string;
  /** Whether this is the current page (last item) */
  isCurrent?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRID LAYOUT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface GridLayoutConfig {
  /** Initial number of visible items */
  initialCount: number;
  /** Number of items to load per batch */
  batchSize: number;
  /** Header title */
  title: string;
  /** Label for item count (e.g., "Stories", "Projects") */
  itemLabel: string;
  /** Plural form of item label */
  itemLabelPlural: string;
  /** Show live feed indicator */
  showLiveIndicator: boolean;
  /** Empty state message */
  emptyMessage: string;
}
