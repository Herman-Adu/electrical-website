/**
 * Rate Limiter for Server Actions
 *
 * Simple in-memory rate limiting to prevent abuse.
 * For production, consider using Upstash Redis for distributed rate limiting.
 *
 * @example
 * const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60000 })
 * const result = await limiter.check(identifier)
 * if (!result.allowed) {
 *   return { error: "Too many requests" }
 * }
 */

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limits
// Note: This resets on server restart. Use Redis for persistent rate limiting.
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);

  // Don't prevent Node from exiting
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

/**
 * Create a rate limiter with specified configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  startCleanup();

  return {
    /**
     * Check if a request is allowed
     * @param identifier - Unique identifier (e.g., IP address, user ID)
     */
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const key = identifier;
      const entry = rateLimitStore.get(key);

      // If no entry or window has passed, create new entry
      if (!entry || entry.resetAt < now) {
        rateLimitStore.set(key, {
          count: 1,
          resetAt: now + config.windowMs,
        });
        return {
          allowed: true,
          remaining: config.maxRequests - 1,
          resetAt: now + config.windowMs,
        };
      }

      // Increment count
      entry.count++;

      // Check if over limit
      if (entry.count > config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.resetAt,
        };
      }

      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    },

    /**
     * Reset rate limit for an identifier
     */
    reset(identifier: string): void {
      rateLimitStore.delete(identifier);
    },
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  /** Form submissions: 5 requests per minute */
  formSubmission: createRateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  }),

  /** Contact form: 3 requests per minute */
  contactForm: createRateLimiter({
    maxRequests: 3,
    windowMs: 60 * 1000,
  }),

  /** Quotation requests: 3 requests per 5 minutes */
  quotationRequest: createRateLimiter({
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
  }),

  /** Email verification: 3 requests per 10 minutes */
  emailVerification: createRateLimiter({
    maxRequests: 3,
    windowMs: 10 * 60 * 1000,
  }),
};

/**
 * Get client IP from headers (for use in server actions)
 * Note: In production, this should be extracted from request headers
 */
export function getClientIdentifier(headers?: Headers): string {
  if (!headers) {
    return "unknown";
  }

  // Try various headers for IP address
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}
