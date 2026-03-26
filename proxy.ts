import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy: IP Detection and Request Enrichment
 *
 * Extracts true client IP from reverse proxy headers and attaches to request.
 * Follows the fallback chain recommended by Vercel and Cloudflare.
 *
 * Header priority (in order):
 * 1. x-forwarded-for (standard for reverse proxies, multiple IPs possible)
 * 2. cf-connecting-ip (Cloudflare)
 * 3. x-real-ip (nginx/other reverse proxies)
 * 4. req.socket.remoteAddress (direct connection - development)
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const clientIp = extractClientIp(request);

  // Attach client IP to request for server actions and API routes
  requestHeaders.set("x-client-ip", clientIp);

  // Create response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Extract true client IP from request headers
 *
 * Production-grade IP extraction handling multiple deployment scenarios:
 * - Vercel (uses x-forwarded-for)
 * - Cloudflare (uses cf-connecting-ip)
 * - Self-hosted nginx/reverse proxy (uses x-real-ip)
 * - Direct connections (uses socket.remoteAddress)
 *
 * @param request NextRequest object
 * @returns Client IP address, or 'unknown' if unable to determine
 */
function extractClientIp(request: NextRequest): string {
  const trustedHeaders = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
  ];

  for (const candidate of trustedHeaders) {
    if (candidate && isValidIp(candidate)) {
      return candidate.trim();
    }
  }

  // Only trust x-forwarded-for when on Vercel edge
  if (request.headers.has("x-vercel-id")) {
    const xForwardedFor = request.headers.get("x-forwarded-for");
    if (xForwardedFor) {
      const clientIp = xForwardedFor.split(",")[0]?.trim();
      if (clientIp && isValidIp(clientIp)) {
        return clientIp;
      }
    }
  }

  // 4. Fallback to socket/connection context (development/direct)
  type RequestWithConnectionInfo = NextRequest & {
    socket?: { remoteAddress?: string | null };
    connection?: { remoteAddress?: string | null };
  };

  const requestWithConnection = request as RequestWithConnectionInfo;
  const remoteAddress =
    requestWithConnection.socket?.remoteAddress ??
    requestWithConnection.connection?.remoteAddress ??
    null;

  if (typeof remoteAddress === "string" && isValidIp(remoteAddress)) {
    return remoteAddress;
  }

  return "unknown";
}

/**
 * Validate IP address format (basic check)
 *
 * Accepts both IPv4 and IPv6, rejects obviously invalid formats
 *
 * @param ip IP address to validate
 * @returns true if appears to be valid IP format
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") {
    return false;
  }

  const trimmed = ip.trim();

  // Check for IPv4 format (very basic - just ensure it has dots and numbers)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$|^::1$|^fe80:|^::ffff:/i;

  // Check for IPv6 format
  const ipv6Regex = /^([\da-f]{0,4}:){2,7}[\da-f]{0,4}$/i;

  return ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed);
}

// Configure which routes should use proxy
// Apply to all routes (including API routes and server actions)
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
