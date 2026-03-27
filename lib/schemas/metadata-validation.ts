import { z } from "zod";

/**
 * Metadata Validation Schemas
 *
 * Defines Zod schemas for all metadata types used across the app.
 * Ensures type safety, data validation, and prevents malformed metadata.
 *
 * **Coverage:**
 * - Standard page metadata (title, description, keywords)
 * - Open Graph tags (og:title, og:description, og:image, og:url, og:type)
 * - Twitter Card metadata (twitter:card, twitter:creator, twitter:title)
 * - Canonical URLs
 * - Structured data (JSON-LD schemas)
 */

/**
 * Open Graph Image Schema
 * Validates og:image parameters with strict type checking
 */
export const ogImageSchema = z.object({
  url: z.string().url("Invalid OG image URL"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().max(200).optional(),
  type: z.string().optional(),
});

export type OGImage = z.infer<typeof ogImageSchema>;

/**
 * Open Graph Metadata Schema
 * Validates all Open Graph tags for social sharing
 */
export const openGraphSchema = z.object({
  title: z.string().max(60, "OG title should be under 60 characters"),
  description: z
    .string()
    .max(160, "OG description should be under 160 characters"),
  url: z.string().url("Invalid OG URL"),
  type: z.enum(["website", "article"]).default("website"),
  images: z.array(ogImageSchema).optional(),
  siteName: z.string().optional(),
  locale: z.string().default("en_GB"),
});

export type OpenGraph = z.infer<typeof openGraphSchema>;

/**
 * Twitter Card Metadata Schema
 * Validates all Twitter-specific metadata tags
 */
export const twitterCardSchema = z.object({
  card: z
    .enum(["summary", "summary_large_image", "app", "player"])
    .default("summary_large_image"),
  creator: z.string().optional().nullable(),
  title: z
    .string()
    .max(70, "Twitter title should be under 70 characters")
    .optional(),
  description: z
    .string()
    .max(200, "Twitter description should be under 200 characters")
    .optional(),
  image: z.string().url("Invalid Twitter image URL").optional(),
  site: z.string().optional().nullable(),
});

export type TwitterCard = z.infer<typeof twitterCardSchema>;

/**
 * Page Metadata Input Schema
 * Validates user-supplied input to createPageMetadata helper
 * Enforces SEO best-practice character limits
 */
export const pageMetadataInputSchema = z.object({
  title: z
    .string()
    .min(10, "Title should be at least 10 characters")
    .max(60, "Title should be under 60 characters"),
  description: z
    .string()
    .min(50, "Description should be at least 50 characters")
    .max(160, "Description should be under 160 characters"),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url("Invalid OG image URL").optional(),
});

export type PageMetadataInput = z.infer<typeof pageMetadataInputSchema>;

/**
 * Page Metadata Schema
 * Comprehensive validation for all page metadata fields
 */
export const pageMetadataSchema = z.object({
  title: z.string().min(1).max(60, "Page title should be under 60 characters"),
  description: z
    .string()
    .min(1)
    .max(160, "Meta description should be under 160 characters"),
  keywords: z.array(z.string()).optional(),
  canonical: z.string().url("Invalid canonical URL").optional(),
  openGraph: openGraphSchema.optional(),
  twitter: twitterCardSchema.optional(),
  robots: z.enum(["index", "noindex", "follow", "nofollow"]).optional(),
  lang: z.string().default("en-GB"),
});

export type PageMetadata = z.infer<typeof pageMetadataSchema>;

/**
 * Organization JSON-LD Schema
 * Validates schema.org/Organization structured data
 */
export const organizationSchemaSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("Organization"),
  name: z.string(),
  url: z.string().url(),
  logo: z.string().url().optional(),
  description: z.string().optional(),
  sameAs: z.array(z.string().url()).optional(),
  contact: z
    .object({
      "@type": z.literal("ContactPoint"),
      telephone: z.string(),
      contactType: z.string(),
    })
    .optional(),
  address: z
    .object({
      "@type": z.literal("PostalAddress"),
      streetAddress: z.string(),
      addressLocality: z.string(),
      addressRegion: z.string(),
      postalCode: z.string(),
      addressCountry: z.string(),
    })
    .optional(),
});

export type OrganizationSchema = z.infer<typeof organizationSchemaSchema>;

/**
 * BreadcrumbList JSON-LD Schema
 * Validates schema.org/BreadcrumbList for navigation breadcrumbs
 */
export const breadcrumbListSchemaSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("BreadcrumbList"),
  itemListElement: z.array(
    z.object({
      "@type": z.literal("ListItem"),
      position: z.number().int().positive(),
      name: z.string(),
      item: z.string().url().optional(),
    }),
  ),
});

export type BreadcrumbListSchema = z.infer<typeof breadcrumbListSchemaSchema>;

/**
 * Product JSON-LD Schema (for projects/services)
 * Validates schema.org/Product structured data
 */
export const productSchemaSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("Product"),
  name: z.string(),
  description: z.string().optional(),
  image: z.array(z.string().url()).optional(),
  url: z.string().url(),
  category: z.string().optional(),
});

export type ProductSchema = z.infer<typeof productSchemaSchema>;

/**
 * FAQPage JSON-LD Schema
 * Validates schema.org/FAQPage for FAQ structured data
 */
export const faqPageSchemaSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("FAQPage"),
  mainEntity: z.array(
    z.object({
      "@type": z.literal("Question"),
      name: z.string(),
      acceptedAnswer: z.object({
        "@type": z.literal("Answer"),
        text: z.string(),
      }),
    }),
  ),
});

export type FAQPageSchema = z.infer<typeof faqPageSchemaSchema>;

/**
 * Utility: Validate page metadata
 * Returns validated metadata or throws ZodError
 */
export function validatePageMetadata(data: unknown): PageMetadata {
  return pageMetadataSchema.parse(data);
}

/**
 * Utility: Validate organization schema
 * Returns validated organization schema or throws ZodError
 */
export function validateOrganizationSchema(data: unknown): OrganizationSchema {
  return organizationSchemaSchema.parse(data);
}

/**
 * Utility: Validate breadcrumb schema
 * Returns validated breadcrumb schema or throws ZodError
 */
export function validateBreadcrumbSchema(data: unknown): BreadcrumbListSchema {
  return breadcrumbListSchemaSchema.parse(data);
}
