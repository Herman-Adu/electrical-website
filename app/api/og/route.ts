import { env } from "@/app/env";
import { parseOGQueryParams } from "@/lib/schemas/og";
import { z } from "zod";

export const runtime = "edge";

/**
 * Dynamic Open Graph image generator for project detail pages
 * Route: /api/og?title=...&category=...&location=...
 * Usage: Set in project page metadata
 *
 * Simple SVG-based approach that works across all runtimes
 * Includes origin validation to prevent unauthorized OG image generation
 */

/**
 * Validate if the request origin is allowed
 * Prevents unauthorized OG image generation from external sources
 */
function validateOrigin(request: Request): boolean {
  const origin =
    request.headers.get("origin") || request.headers.get("referer");

  if (!origin) {
    // Allow requests without origin (e.g., direct browser visits, SEO crawlers)
    // These are legitimate use cases
    return true;
  }

  try {
    // Extract origin from referer if needed
    const requestOrigin = origin.startsWith("http")
      ? new URL(origin).origin.toLowerCase()
      : origin.toLowerCase();

    // Check against whitelist
    const allowedOrigins = env.OG_ROUTE_ALLOWED_ORIGINS;
    return allowedOrigins.some((allowed) => {
      // Direct origin match
      if (requestOrigin === allowed) {
        return true;
      }

      // Subdomain match: extract domain and check if request is from subdomain
      try {
        const allowedUrl = new URL(allowed);
        const allowedDomain = allowedUrl.hostname;

        const requestUrl = new URL(requestOrigin);
        const requestDomain = requestUrl.hostname;

        // Exact hostname match or subdomain of allowed domain
        return (
          requestDomain === allowedDomain ||
          requestDomain.endsWith("." + allowedDomain)
        );
      } catch {
        // Invalid URL format, no match
        return false;
      }
    });
  } catch {
    // Invalid origin header, reject
    return false;
  }
}

export async function GET(request: Request) {
  // 1. Validate origin
  if (!validateOrigin(request)) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Prevent caching of 403 responses
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const { searchParams } = new URL(request.url);

  // 2. Validate query parameters
  let params;
  try {
    params = parseOGQueryParams(searchParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Bad Request: Invalid parameters", {
        status: 400,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }
    throw error;
  }

  const BRAND_COLOR_HEX = params.accentColor || "#00f3bd";
  const BRAND_COLOR_RGB = params.accentColor
    ? hexToRgb(BRAND_COLOR_HEX)
    : "0, 243, 189";

  const title = params.title || "Project";
  const category = params.category || "Electrical";
  const location = params.location || "";

  // Generate SVG dynamically
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <!-- Background gradient -->
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#020617;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#0f1419;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a1f2e;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0" />
        <stop offset="50%" style="stop-color:${BRAND_COLOR_HEX};stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)" />

    <!-- Top accent line -->
    <rect width="1200" height="3" fill="url(#accent)" />

    <!-- Category badge -->
    <text x="60" y="100" font-family="monospace" font-size="24" font-weight="600" 
          fill="${BRAND_COLOR_HEX}" text-transform="uppercase" letter-spacing="2">
      ${escapeXmlText(category)}
    </text>

    <!-- Title -->
    <text x="60" y="220" font-family="system-ui, sans-serif" font-size="64" font-weight="700"
          fill="#ffffff" text-anchor="start">
      ${wrapText(title, 60)}
    </text>

    <!-- Location -->
    ${
      location
        ? `<text x="60" y="340" font-family="system-ui, sans-serif" font-size="24"
          fill="#a0a9b8">📍 ${escapeXmlText(location)}</text>`
        : ""
    }

    <!-- Footer divider -->
    <line x1="60" y1="420" x2="1140" y2="420" stroke="rgba(${BRAND_COLOR_RGB}, 0.1)" stroke-width="1" />

    <!-- Footer branding -->
    <text x="60" y="470" font-family="monospace" font-size="16" font-weight="700"
          fill="${BRAND_COLOR_HEX}" letter-spacing="2">⚡ NEXGEN</text>
    <text x="250" y="470" font-family="monospace" font-size="16"
          fill="#666b78">Electrical Innovations</text>

    <!-- Footer domain -->
    <text x="1140" y="470" font-family="monospace" font-size="16"
          fill="#666b78" text-anchor="end">nexgen-electrical-innovations.co.uk</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      // CSP: Only allow inline SVG content
      "Content-Security-Policy":
        "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    },
  });
}

/**
 * Convert hex color to RGB string
 * @param hex - Hex color in format #RRGGBB
 * @returns RGB string in format "r, g, b"
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 243, 189"; // fallback

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(", ");
}

function escapeXmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return escapeXmlText(text);

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(escapeXmlText(currentLine.trim()));
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  lines.push(escapeXmlText(currentLine.trim()));

  // Return lines as SVG text elements with y-offset
  return lines
    .map(
      (line, index) =>
        `<tspan x="60" dy="${index === 0 ? "0" : "70"}">${line}</tspan>`,
    )
    .join("");
}
