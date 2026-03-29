import type { NextConfig } from "next";
import { env } from "./app/env";

const nextConfig: NextConfig = {
  output: process.env.PLAYWRIGHT_TEST ? undefined : "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  images: {
    unoptimized: env.NEXT_IMAGE_UNOPTIMIZED ?? false,
  },
  cacheLife: {
    default: {
      revalidate: 3600, // 1 hour default
      stale: 86400, // serve stale for 24h
    },
    categories: {
      revalidate: 86400, // 24 hours
      stale: 604800, // serve stale for 7 days
    },
    projects: {
      revalidate: 259200, // 72 hours
      stale: 2592000, // serve stale for 30 days
    },
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value:
              process.env.NODE_ENV === "development"
                ? // Development: Allow more for dev tools and HMR
                  "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://challenges.cloudflare.com https: ws: wss:; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'"
                : // Production: Strict CSP with minimal external access
                  "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/contact",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
