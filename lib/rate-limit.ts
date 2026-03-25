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

type RateLimitMode = "kv" | "memory" | "off";

const hasKvConfig = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

const configuredMode =
  (process.env.CONTACT_RATE_LIMIT_MODE as RateLimitMode | undefined) ??
  (process.env.NODE_ENV === "production" ? "kv" : "memory");

const rateLimitMode: RateLimitMode =
  configuredMode === "off" ||
  configuredMode === "memory" ||
  configuredMode === "kv"
    ? configuredMode
    : "kv";

let kvDisabledWarned = false;
let modeWarned = false;

const blockedUntilByIpHash = new Map<string, number>();
const memoryCounters = new Map<string, { count: number; resetAt: number }>();

function canUseRateLimit(): boolean {
  if (rateLimitMode === "off") {
    if (!modeWarned) {
      console.warn("[RATE_LIMIT_DISABLED]", {
        message:
          "CONTACT_RATE_LIMIT_MODE=off. Contact form rate limiting is disabled.",
        timestamp: new Date().toISOString(),
      });
      modeWarned = true;
    }
    return false;
  }

  return true;
}

function canUseKv(): boolean {
  if (rateLimitMode !== "kv") {
    return false;
  }

  if (hasKvConfig) {
    return true;
  }

  if (!kvDisabledWarned) {
    console.warn("[RATE_LIMIT_KV_DISABLED]", {
      message:
        "KV_REST_API_URL and KV_REST_API_TOKEN are not configured. " +
        "Rate limiting will run in fail-open mode.",
      timestamp: new Date().toISOString(),
    });
    kvDisabledWarned = true;
  }

  return false;
}

function checkMemoryRateLimit(
  ipHash: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();

  const blockedUntil = blockedUntilByIpHash.get(ipHash);
  if (blockedUntil && blockedUntil > now) {
    return false;
  }

  const current = memoryCounters.get(ipHash);
  if (!current || current.resetAt <= now) {
    memoryCounters.set(ipHash, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const nextCount = current.count + 1;
  current.count = nextCount;

  if (nextCount > limit) {
    blockedUntilByIpHash.set(ipHash, current.resetAt);
    return false;
  }

  return true;
}

function getMemoryRemaining(ipHash: string, limit: number): number {
  const now = Date.now();
  const blockedUntil = blockedUntilByIpHash.get(ipHash);
  if (blockedUntil && blockedUntil > now) {
    return 0;
  }

  const current = memoryCounters.get(ipHash);
  if (!current || current.resetAt <= now) {
    return limit;
  }

  return Math.max(0, limit - current.count);
}

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
  if (!canUseRateLimit()) {
    return true;
  }

  if (!ip || ip === "unknown") {
    // Fallback: allow submission if IP unknown (fail-open)
    // Better to serve users than to block due to missing IP detection
    return true;
  }

  const ipHash = hashIp(ip);

  if (rateLimitMode === "memory") {
    return checkMemoryRateLimit(ipHash, limit, windowMs);
  }

  const blockedUntil = blockedUntilByIpHash.get(ipHash);
  if (blockedUntil && blockedUntil > Date.now()) {
    return false;
  }

  if (!canUseKv()) {
    return true;
  }

  try {
    const key = `rate:submit:${ipHash}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);

    // Increment counter atomically
    const count = await kv.incr(key);

    // Set TTL on first request from this IP
    if (count === 1) {
      await kv.expire(key, ttlSeconds);
    }

    // Check if limit exceeded
    const allowed = count <= limit;
    if (!allowed) {
      blockedUntilByIpHash.set(ipHash, Date.now() + windowMs);
    }

    return allowed;
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
  if (!canUseRateLimit()) {
    return limit;
  }

  if (!ip || ip === "unknown") {
    return limit;
  }

  const ipHash = hashIp(ip);

  if (rateLimitMode === "memory") {
    return getMemoryRemaining(ipHash, limit);
  }

  if (!canUseKv()) {
    return limit;
  }

  try {
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
