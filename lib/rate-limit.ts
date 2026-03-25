/**
 * Redis-based rate limiter for contact form submissions
 *
 * Uses Vercel KV (Redis-compatible) for distributed rate limiting.
 * Automatically expires entries after the window period.
 * Supports both local development (with fallback) and Vercel production.
 *
 * Key format: rate:submit:{ip-hash}
 * TTL: Set to window duration for automatic cleanup
 */

import { kv } from "@vercel/kv";

/**
 * Hash IP to shorter key for KV storage
 * Reduces storage footprint and obfuscates IPs in logs
 *
 * @param ip Client IP address
 * @returns 5-character hash
 */
function hashIp(ip: string): string {
  let hash = 0;

  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36).substring(0, 5);
}

/**
 * Check and record a submission for rate limiting
 * Uses Redis INCR for atomic counter increment
 *
 * @param ip Client IP address
 * @param limit Max submissions allowed in window
 * @param windowMs Time window in milliseconds
 * @returns true if submission is allowed, false if rate limit exceeded
 */
export async function checkRateLimit(
  ip: string,
  limit: number = 3,
  windowMs: number = 3600000, // 1 hour default
): Promise<boolean> {
  if (!ip || ip === "unknown") {
    // Fallback: allow submission if IP unknown (fail-open)
    // Better to serve users than to block due to missing IP detection
    return true;
  }

  try {
    const ipHash = hashIp(ip);
    const key = `rate:submit:${ipHash}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);

    // Increment counter atomically
    const count = await kv.incr(key);

    // Set TTL on first request from this IP
    if (count === 1) {
      await kv.expire(key, ttlSeconds);
    }

    // Check if limit exceeded
    return count <= limit;
  } catch (error) {
    // KV unavailable: fail-open for better availability
    // Log error for monitoring but don't block user
    console.error("[RATE_LIMIT_KV_ERROR]", {
      message: error instanceof Error ? error.message : "Unknown error",
      ip: ip === "unknown" ? undefined : ip.substring(0, 4), // Log first octet only
      timestamp: new Date().toISOString(),
    });

    return true; // Allow submission when KV fails
  }
}

/**
 * Get remaining submissions for an IP
 * Returns 0 if limit exceeded or KV unavailable (conservative estimate)
 *
 * @param ip Client IP address
 * @param limit Max submissions allowed
 * @param windowMs Time window in milliseconds
 * @returns Number of submissions remaining in this window
 */
export async function getRemainingSubmissions(
  ip: string,
  limit: number = 3,
  windowMs: number = 3600000,
): Promise<number> {
  if (!ip || ip === "unknown") {
    return limit;
  }

  try {
    const ipHash = hashIp(ip);
    const key = `rate:submit:${ipHash}`;

    const count = (await kv.get<number>(key)) || 0;
    return Math.max(0, limit - count);
  } catch (error) {
    // KV unavailable: return limit pessimistically
    console.error("[RATE_LIMIT_KV_ERROR]", {
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    return 0; // Conservative: assume limit reached
  }
}
