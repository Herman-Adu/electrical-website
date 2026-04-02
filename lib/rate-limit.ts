/**
 * Redis-based rate limiter for contact form submissions
 *
 * Uses:
 * - Production: Vercel KV (Redis-compatible) for distributed rate limiting
 * - Development: Docker Redis or fallback (in-memory)
 * - Fallback: In-memory cache if Redis unavailable
 *
 * Key format: rate:submit:{ip-hash}
 * TTL: Set to window duration for automatic cleanup
 */

import { createHash } from "node:crypto";
import { env } from "@/app/env";
import { getRedisAdapter } from "@/lib/redis-adapter";

type RateLimitMode = "redis" | "memory" | "off";

const isProduction = process.env.NODE_ENV === "production";

const configuredMode: RateLimitMode =
  env.CONTACT_RATE_LIMIT_MODE ?? (isProduction ? "redis" : "memory");

const rateLimitMode: RateLimitMode =
  configuredMode === "off" ||
  configuredMode === "memory" ||
  configuredMode === "redis"
    ? configuredMode
    : "redis";

if (isProduction && rateLimitMode !== "redis") {
  throw new Error("CONTACT_RATE_LIMIT_MODE must be redis in production");
}

let modeWarned = false;

const blockedUntilByIpHash = new Map<string, number>();
const memoryCounters = new Map<string, { count: number; resetAt: number }>();

function canUseRateLimit(): boolean {
  if (rateLimitMode === "off") {
    if (!modeWarned) {
      console.warn("[RATE_LIMIT_DISABLED]", {
        message:
          "CONTACT_RATE_LIMIT_MODE=off. Contact form rate limiting is disabled for non-production environments.",
        timestamp: new Date().toISOString(),
      });
      modeWarned = true;
    }
    return false;
  }

  return true;
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
 * Hash IP to shorter key for Redis storage
 * Reduces storage footprint and obfuscates IPs in logs
 *
 * @param ip Client IP address
 * @returns 12-character hash derived from SHA-256
 */
function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").substring(0, 12);
}

function normalizeClientKey(ip: string): string | null {
  const trimmed = ip.trim();
  if (!trimmed || trimmed === "unknown") {
    return null;
  }

  return trimmed;
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

  const clientKey = normalizeClientKey(ip);
  if (!clientKey) {
    if (isProduction) {
      console.warn("[RATE_LIMIT_CLIENT_KEY_MISSING]", {
        message: "Missing client key in production; rejecting submission.",
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    return checkMemoryRateLimit("dev-unknown-client", limit, windowMs);
  }

  const ipHash = hashIp(clientKey);

  // Memory-only mode
  if (rateLimitMode === "memory") {
    return checkMemoryRateLimit(ipHash, limit, windowMs);
  }

  // Check ephemeral block (applies to both memory and redis modes)
  const blockedUntil = blockedUntilByIpHash.get(ipHash);
  if (blockedUntil && blockedUntil > Date.now()) {
    return false;
  }

  try {
    const redis = await getRedisAdapter();
    const key = `rate:submit:${ipHash}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);

    // Increment counter atomically
    const count = await redis.incr(key);

    // Set TTL on first request from this IP in this window
    if (count === 1) {
      await redis.expire(key, ttlSeconds);
    }

    // Check if limit exceeded
    const allowed = count <= limit;
    if (!allowed) {
      blockedUntilByIpHash.set(ipHash, Date.now() + windowMs);
    }

    return allowed;
  } catch (error) {
    const logKey = isProduction
      ? "[RATE_LIMIT_PRODUCTION_ERROR]"
      : "[RATE_LIMIT_REDIS_FALLBACK]";

    console.error(logKey, {
      message: error instanceof Error ? error.message : "Unknown error",
      ipHash,
      timestamp: new Date().toISOString(),
    });

    if (isProduction) {
      return false;
    }

    return checkMemoryRateLimit(ipHash, limit, windowMs);
  }
}

/**
 * Get remaining submissions for an IP
 * Returns 0 if limit exceeded or Redis unavailable (conservative estimate)
 *
 * @param ip Client IP address
 * @param limit Max submissions allowed
 * @param windowMs Time window in milliseconds
 * @returns Number of submissions remaining in this window
 */
export async function getRemainingSubmissions(
  ip: string,
  limit: number = 3,
  _windowMs: number = 3600000,
): Promise<number> {
  if (!canUseRateLimit()) {
    return limit;
  }

  const clientKey = normalizeClientKey(ip);
  if (!clientKey) {
    return isProduction ? 0 : getMemoryRemaining("dev-unknown-client", limit);
  }

  const ipHash = hashIp(clientKey);

  // Memory-only mode
  if (rateLimitMode === "memory") {
    return getMemoryRemaining(ipHash, limit);
  }

  try {
    const redis = await getRedisAdapter();
    const key = `rate:submit:${ipHash}`;

    const countStr = await redis.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;
    return Math.max(0, limit - count);
  } catch (error) {
    const logKey = isProduction
      ? "[RATE_LIMIT_PRODUCTION_ERROR]"
      : "[RATE_LIMIT_REDIS_FALLBACK]";

    console.error(logKey, {
      message: error instanceof Error ? error.message : "Unknown error",
      ipHash,
      timestamp: new Date().toISOString(),
    });

    if (isProduction) {
      return 0;
    }

    return getMemoryRemaining(ipHash, limit);
  }
}
