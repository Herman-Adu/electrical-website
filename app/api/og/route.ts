import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

/**
 * Dynamic Open Graph image generator for project detail pages
 * Route: /api/og?title=...&category=...&location=...
 * Usage: Set in project page metadata
 *
 * Simple SVG-based approach that works across all runtimes
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const BRAND_COLOR_HEX = "#00f3bd";
  const BRAND_COLOR_RGB = "0, 243, 189";

  const title = searchParams.get("title")?.slice(0, 100) || "Project";
  const category = searchParams.get("category")?.slice(0, 50) || "Electrical";
  const location = searchParams.get("location")?.slice(0, 50) || "";

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
    },
  });
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
