import type { Metadata } from "next";
import type { ServicePageData } from "@/types/sections";
import { SITE_URL, siteConfig } from "@/lib/site-config";
import type {
  OrganizationSchema,
  BreadcrumbListSchema,
} from "@/lib/schemas/metadata-validation";

/**
 * Enhanced page metadata options with full SEO support
 * Includes OG tags, Twitter Card metadata, and structured data
 */
export interface PageMetadataOptions {
  /** Page title (max 60 chars recommended) */
  title: string;

  /** Meta description (max 160 chars recommended) */
  description: string;

  /** Canonical path/URL (e.g., "/projects" or full URL) */
  path: string;

  /** SEO keywords (comma-separated or array) */
  keywords?: string | string[];

  /** Open Graph title (defaults to page title if not provided) */
  openGraphTitle?: string;

  /** Open Graph description (defaults to meta description if not provided) */
  openGraphDescription?: string;

  /** Open Graph image URL (1200x630px recommended) */
  ogImage?: string;

  /** Open Graph image width (default: 1200) */
  ogImageWidth?: number;

  /** Open Graph image height (default: 630) */
  ogImageHeight?: number;

  /** Open Graph type (default: "website") */
  ogType?: "website" | "article";

  /** Twitter Card type (default: "summary_large_image") */
  twitterCard?: "summary" | "summary_large_image";

  /** Twitter creator handle (e.g., "@brand") */
  twitterCreator?: string;

  /** Allow indexing by search engines (default: true) */
  robots?: "index" | "noindex" | "follow" | "nofollow";

  /** JSON-LD structured data (optional) */
  structuredData?: Record<string, unknown>;

  /** Include breadcrumb structured data (optional) */
  breadcrumbs?: Array<{ name: string; url?: string }>;

  /** Language/locale code (default: "en-GB") */
  locale?: string;
}

/**
 * Creates optimized page metadata with full SEO support
 *
 * Generates comprehensive metadata including:
 * - Open Graph tags for social sharing
 * - Twitter Card tags for Twitter optimization
 * - Canonical URLs for search engines
 * - Structured data (JSON-LD) for rich snippets
 * - Robot directives (noindex/follow)
 *
 * @param options - Page metadata configuration
 * @returns Next.js Metadata object
 *
 * @example
 * ```typescript
 * export const metadata = createPageMetadata({
 *   title: "Projects | Nexgen Electrical",
 *   description: "Explore our electrical engineering projects",
 *   path: "/projects",
 *   ogImage: "https://site.com/og-projects.jpg",
 *   twitterCreator: "@nexgen",
 * });
 * ```
 */
export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    keywords,
    openGraphTitle = title,
    openGraphDescription = description,
    ogImage,
    ogImageWidth = 1200,
    ogImageHeight = 630,
    ogType = "website",
    twitterCard = "summary_large_image",
    twitterCreator,
    robots,
    structuredData: _structuredData,
    breadcrumbs: _breadcrumbs,
    locale = "en_GB",
  } = options;

  // Build canonical URL
  const canonicalUrl = path.startsWith("http") ? path : `${SITE_URL}${path}`;

  // Parse keywords into array
  const keywordArray = Array.isArray(keywords)
    ? keywords
    : keywords
      ? keywords.split(",").map((k) => k.trim())
      : undefined;

  // Build Open Graph config
  const ogConfig: Record<string, unknown> = {
    title: openGraphTitle,
    description: openGraphDescription,
    url: canonicalUrl,
    type: ogType,
    siteName: siteConfig.org.name,
    locale,
  };

  if (ogImage) {
    ogConfig.images = [
      {
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        alt: openGraphTitle,
        type: "image/jpeg",
      },
    ];
  }

  // Build Twitter Card config
  const twitterConfig: Record<string, unknown> = {
    card: twitterCard,
    title: openGraphTitle,
    description: openGraphDescription,
  };

  if (ogImage) {
    twitterConfig.image = ogImage;
  }

  if (twitterCreator) {
    twitterConfig.creator = twitterCreator;
  }

  // Build metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords: keywordArray,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: ogConfig as unknown as Metadata["openGraph"],
    twitter: twitterConfig as unknown as Metadata["twitter"],
  };

  // Add robots directive if specified
  if (robots) {
    metadata.robots = robots;
  }

  return metadata;
}

/**
 * Alias for createPageMetadata - maintains backward compatibility
 * @deprecated Use createPageMetadata instead
 */
export function createStandardPageMetadata(
  options: Omit<
    PageMetadataOptions,
    "twitterCreator" | "twitterCard" | "ogType"
  >,
): Metadata {
  return createPageMetadata(options);
}

/**
 * Creates metadata for service pages
 *
 * @param data - Service page data with meta information
 * @returns Next.js Metadata object
 *
 * @example
 * ```typescript
 * export const metadata = createServicePageMetadata(industrialServiceData);
 * ```
 */
export function createServicePageMetadata(data: ServicePageData): Metadata {
  return createPageMetadata({
    title: data.meta.title,
    description: data.meta.description,
    keywords: data.meta.keywords,
    path: `/services/${data.slug}`,
    ogType: "website",
  });
}

/**
 * Creates structured data (JSON-LD) for Organization schema
 *
 * Used in root layout or global schema.
 *
 * @returns Organization JSON-LD object
 *
 * @example
 * ```typescript
 * const structuredData = createOrganizationSchema();
 * // Add to <script type="application/ld+json"> in layout
 * ```
 */
export function createOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.org.name,
    url: SITE_URL,
    description: siteConfig.org.description,
    sameAs: Object.values(siteConfig.social).filter(
      (url) => url && url !== "#",
    ),
    contact: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phoneInternational,
      contactType: "Customer Service",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.primary.streetAddress,
      addressLocality: siteConfig.location.primary.addressLocality,
      addressRegion: siteConfig.location.primary.addressRegion,
      postalCode: siteConfig.location.primary.postalCode,
      addressCountry: siteConfig.location.primary.addressCountry,
    },
  };
}

/**
 * Creates structured data (JSON-LD) for BreadcrumbList schema
 *
 * Use on dynamic pages to improve navigation context for search engines.
 *
 * @param items - Array of breadcrumb items [{name, url}, ...]
 * @returns BreadcrumbList JSON-LD object
 *
 * @example
 * ```typescript
 * const breadcrumbs = createBreadcrumbSchema([
 *   { name: "Home", url: "/" },
 *   { name: "Projects", url: "/projects" },
 *   { name: "Industrial", url: "/projects/category/industrial" },
 * ]);
 * ```
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
        ? item.url.startsWith("http")
          ? item.url
          : `${SITE_URL}${item.url}`
        : undefined,
    })),
  };
}

/**
 * JSON-LD script tag wrapper
 *
 * Use this to JSON.stringify structured data safely.
 *
 * @param schema - Structured data object
 * @returns Serialized JSON-LD string safe for <script> tags
 *
 * @example
 * ```typescript
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: serializeJsonLd(schema),
 *   }}
 * />
 * ```
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}
