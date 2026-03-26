/**
 * Centralized site configuration
 * Single source of truth for all domain, organization, contact, social, and SEO metadata
 * Referenced by: metadata generation, sitemap, robots.txt, JSON-LD, RSS, email templates, footer
 */

import { env } from "@/app/env";

export const SITE_URL = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  // ========== ORGANIZATION ==========
  org: {
    name: "Nexgen Electrical Innovations",
    shortName: "Nexgen",
    legalName: "Nexgen Electrical Innovations Limited",
    tagline: "Powering the Future",
    description:
      "Expert electrical engineering and installations for commercial and industrial frontiers. High-voltage solutions delivered with precision.",
    longDescription:
      "Specialist in Advanced Energy Systems, EV Infrastructure, & High-Performance Commercial Installations.",
    /** Founded year for JSON-LD */
    founded: 2015,
    /** Industry/sector for JSON-LD */
    areaServed: ["GB", "England"],
    employeeCount: "2-10",
  },

  // ========== CONTACT & LOCATION ==========
  contact: {
    phone: "1800 NEX GEN", // Display format
    phoneInternational: "+44 1628 600 123", // International dialing (example - replace with actual)
    phoneEmergency: "1800639436", // Numeric format for tel: links
    email: "info@nexgen-electrical-innovations.co.uk",
    emergencyTag: "24/7 Emergency",
  },

  location: {
    primary: {
      name: "Headquarters",
      streetAddress: "46 Nursery Road",
      addressLocality: "Taplow",
      addressRegion: "England",
      postalCode: "SL6 0JZ",
      addressCountry: "GB",
      countryCode: "GB",
    },
  },

  // ========== SOCIAL & EXTERNAL LINKS ==========
  social: {
    // URLs are currently placeholders ("#") — replace with actual social profiles
    linkedIn: "#",
    twitter: "#",
    facebook: "#",
    instagram: "#",
  },

  // ========== SITE STRUCTURE & ROUTES ==========
  routes: {
    home: "/",
    about: "/about",
    services: "/services",
    projects: "/projects",
    projectsCategory: "/projects/category",
    contact: "/contact",
    notFound: "/not-found",
  },

  // ========== SITE METADATA DEFAULTS ==========
  metadata: {
    keywords: [
      "electrical engineering",
      "industrial installations",
      "commercial electrical",
      "power systems",
      "electrical innovations",
      "EV infrastructure",
      "advanced energy systems",
    ] as string[],
    author: "Nexgen Electrical Innovations",
    language: "en-GB",
    themeColor: "#020617", // dark background
  },

  // ========== SEO & ROBOTS ==========
  seo: {
    /** Allow all crawlers by default */
    allowRobots: true,
    /** Crawl delay (seconds) — no crawl delay; crawlers welcome */
    crawlDelay: 0,
    /** Disallow paths from robots.txt */
    disallow: ["/admin", "/_next", "/api"] as string[],
  },

  // ========== RSS & FEED ==========
  feed: {
    title: "Nexgen Electrical Innovations - Latest Projects & Updates",
    description:
      "Stay updated with our latest electrical engineering projects and industry innovations.",
    language: "en-gb",
  },

  // ========== JSON-LD SCHEMA HELPERS ==========
  getOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: this.org.name,
      description: this.org.description,
      url: SITE_URL,
      telephone: this.contact.phoneInternational || this.contact.phone,
      email: this.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: this.location.primary.streetAddress,
        addressLocality: this.location.primary.addressLocality,
        addressRegion: this.location.primary.addressRegion,
        postalCode: this.location.primary.postalCode,
        addressCountry: this.location.primary.addressCountry,
      },
      foundingDate: `${this.org.founded}`,
      areaServed: this.org.areaServed,
      priceRange: "£££",
    };
  },

  getContactPageSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Nexgen Electrical Innovations",
      description: "Get in touch with our electrical engineering experts",
      url: `${SITE_URL}${this.routes.contact}`,
    };
  },

  // ========== URL BUILDERS ==========
  getUrl(path: string): string {
    return `${SITE_URL}${path}`;
  },

  getCanonicalUrl(path: string): string {
    return this.getUrl(path);
  },

  getAbsoluteUrl(relativePath: string): URL {
    return new URL(relativePath, SITE_URL);
  },

  // ========== BREADCRUMB SCHEMA BUILDER ==========
  getBreadcrumbSchema(items: { name: string; path: string }[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: this.getUrl(item.path),
      })),
    };
  },
} as const;

/**
 * Type helpers for routes
 */
export type RouteKey = keyof typeof siteConfig.routes;
export type Route = (typeof siteConfig.routes)[RouteKey];

/**
 * Type helper for site config
 */
export type SiteConfig = typeof siteConfig;
