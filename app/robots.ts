import type { MetadataRoute } from "next";
import { siteConfig, SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * Robots.txt generation
 * Configures crawl behavior and points to sitemap
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: siteConfig.seo.allowRobots ? "/" : "",
        disallow: siteConfig.seo.disallow,
        crawlDelay: siteConfig.seo.crawlDelay || undefined,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
