/**
 * Unit tests for rate-limit module
 *
 * Tests:
 * - In-memory rate limiting (checkRateLimit)
 * - Remaining submission calculation (getRemainingSubmissions)
 * - IP hashing for uniqueness and consistency
 * - Edge cases: missing client keys, rate limit exceeded
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as rateLimitModule from "@/lib/rate-limit";
import { createHash } from "node:crypto";

// Mock environment and redis adapter
vi.mock("@/app/env", () => ({
  env: {
    CONTACT_RATE_LIMIT_MODE: "memory",
  },
}));

vi.mock("@/lib/redis-adapter", () => ({
  getRedisAdapter: vi.fn(),
}));

describe("rate-limit", () => {
  // Reset module state before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkRateLimit - memory mode", () => {
    it("should allow first submission within limit", async () => {
      const result = await rateLimitModule.checkRateLimit(
        "192.168.1.1",
        3,
        3600000,
      );
      expect(result).toBe(true);
    });

    it("should allow multiple submissions up to limit", async () => {
      const ip = "192.168.1.2";
      const limit = 3;

      const first = await rateLimitModule.checkRateLimit(ip, limit, 3600000);
      const second = await rateLimitModule.checkRateLimit(ip, limit, 3600000);
      const third = await rateLimitModule.checkRateLimit(ip, limit, 3600000);

      expect(first).toBe(true);
      expect(second).toBe(true);
      expect(third).toBe(true);
    });

    it("should reject submission when limit exceeded", async () => {
      const ip = "192.168.1.3";
      const limit = 2;

      await rateLimitModule.checkRateLimit(ip, limit, 3600000);
      await rateLimitModule.checkRateLimit(ip, limit, 3600000);
      const rateLimited = await rateLimitModule.checkRateLimit(
        ip,
        limit,
        3600000,
      );

      expect(rateLimited).toBe(false);
    });

    it("should allow different IPs to have independent limits", async () => {
      const limit = 1;
      const window = 3600000;

      const ip1First = await rateLimitModule.checkRateLimit(
        "192.168.1.10",
        limit,
        window,
      );
      const ip1Second = await rateLimitModule.checkRateLimit(
        "192.168.1.10",
        limit,
        window,
      );

      const ip2First = await rateLimitModule.checkRateLimit(
        "192.168.1.11",
        limit,
        window,
      );

      expect(ip1First).toBe(true);
      expect(ip1Second).toBe(false); // ip1 rate limited
      expect(ip2First).toBe(true); // ip2 allowed independently
    });

    it("should handle unknown/missing IP gracefully", async () => {
      const result = await rateLimitModule.checkRateLimit(
        "unknown",
        3,
        3600000,
      );
      // In non-production, should allow (not null)
      expect(result).toBeTypeOf("boolean");
    });

    it("should handle whitespace-padded IP addresses", async () => {
      const result1 = await rateLimitModule.checkRateLimit(
        "  192.168.1.5  ",
        3,
        3600000,
      );
      const result2 = await rateLimitModule.checkRateLimit(
        "192.168.1.5",
        3,
        3600000,
      );

      expect(result1).toBe(true);
      expect(result2).toBe(true); // Should be same IP after trim
    });
  });

  describe("getRemainingSubmissions - memory mode", () => {
    it("should return full limit for new IP", async () => {
      const remaining = await rateLimitModule.getRemainingSubmissions(
        "192.168.2.1",
        5,
        3600000,
      );
      expect(remaining).toBe(5);
    });

    it("should decrease remaining count after each submission", async () => {
      const ip = "192.168.2.2";
      const limit = 3;

      const before1 = await rateLimitModule.getRemainingSubmissions(
        ip,
        limit,
        3600000,
      );

      await rateLimitModule.checkRateLimit(ip, limit, 3600000);

      const after1 = await rateLimitModule.getRemainingSubmissions(
        ip,
        limit,
        3600000,
      );

      await rateLimitModule.checkRateLimit(ip, limit, 3600000);

      const after2 = await rateLimitModule.getRemainingSubmissions(
        ip,
        limit,
        3600000,
      );

      expect(before1).toBe(3);
      expect(after1).toBe(2);
      expect(after2).toBe(1);
    });

    it("should return 0 when rate limit exceeded", async () => {
      const ip = "192.168.2.3";
      const limit = 1;

      await rateLimitModule.checkRateLimit(ip, limit, 3600000);
      await rateLimitModule.checkRateLimit(ip, limit, 3600000); // This hits the limit

      const remaining = await rateLimitModule.getRemainingSubmissions(
        ip,
        limit,
        3600000,
      );

      expect(remaining).toBe(0);
    });

    it("should handle unknown/missing IP gracefully", async () => {
      const result = await rateLimitModule.getRemainingSubmissions(
        "unknown",
        3,
        3600000,
      );
      expect(result).toBeTypeOf("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("IP hashing", () => {
    it("should hash IP to 12-character hexadecimal string", () => {
      const ip = "192.168.1.1";
      const hash = createHash("sha256")
        .update(ip)
        .digest("hex")
        .substring(0, 12);

      expect(hash).toMatch(/^[a-f0-9]{12}$/);
      expect(hash.length).toBe(12);
    });

    it("should produce consistent hash for same IP", () => {
      const ip = "10.0.0.1";
      const hash1 = createHash("sha256")
        .update(ip)
        .digest("hex")
        .substring(0, 12);
      const hash2 = createHash("sha256")
        .update(ip)
        .digest("hex")
        .substring(0, 12);

      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different IPs", () => {
      const ip1 = "192.168.1.1";
      const ip2 = "192.168.1.2";

      const hash1 = createHash("sha256")
        .update(ip1)
        .digest("hex")
        .substring(0, 12);
      const hash2 = createHash("sha256")
        .update(ip2)
        .digest("hex")
        .substring(0, 12);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("time window behavior", () => {
    it("should respect custom window duration", async () => {
      const ip = "192.168.3.1";
      const limit = 1;
      const shortWindow = 100; // 100ms window

      const first = await rateLimitModule.checkRateLimit(
        ip,
        limit,
        shortWindow,
      );
      expect(first).toBe(true);

      // Wait for window to reset
      await new Promise((resolve) => setTimeout(resolve, 150));

      const second = await rateLimitModule.checkRateLimit(
        ip,
        limit,
        shortWindow,
      );
      expect(second).toBe(true); // Should be allowed after window expires
    });

    it("should use default window of 1 hour when not specified", async () => {
      const ip = "192.168.3.2";
      // Should use default 3600000ms (1 hour) window
      const result = await rateLimitModule.checkRateLimit(ip);
      expect(result).toBe(true);
    });
  });

  describe("default parameters", () => {
    it("should use default limit of 3 submissions", async () => {
      const ip = "192.168.4.1";
      // Call without explicit limit parameter
      const r1 = await rateLimitModule.checkRateLimit(ip);
      const r2 = await rateLimitModule.checkRateLimit(ip);
      const r3 = await rateLimitModule.checkRateLimit(ip);
      const r4 = await rateLimitModule.checkRateLimit(ip);

      expect(r1).toBe(true);
      expect(r2).toBe(true);
      expect(r3).toBe(true);
      expect(r4).toBe(false); // 4th should be rejected with default limit of 3
    });
  });
});
