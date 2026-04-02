/**
 * Redis adapter for development and production
 *
 * Uses:
 * - Local: Docker Redis MCP server (dev environment)
 * - Production: Vercel KV (Redis-compatible)
 * - Fallback: In-memory cache
 *
 * This abstracts away the underlying Redis implementation,
 * allowing seamless switching between environments.
 */

import { env } from "@/app/env";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const localRedisHosts = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "[::1]",
  "host.docker.internal",
]);

interface RedisAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { ex?: number }): Promise<"OK">;
  del(keys: string[]): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<0 | 1>;
}

function assertLocalEndpoint(variableName: string, urlValue: string): void {
  const parsedUrl = new URL(urlValue);

  if (!localRedisHosts.has(parsedUrl.hostname)) {
    throw new Error(
      `${variableName} must point to a local Redis endpoint in development. Received host: ${parsedUrl.hostname}`,
    );
  }
}

// ============================================================================
// Production: Vercel KV
// ============================================================================

async function createVercelKvAdapter(): Promise<RedisAdapter> {
  if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) {
    throw new Error(
      "Production rate limiting requires KV_REST_API_URL and KV_REST_API_TOKEN.",
    );
  }

  try {
    const { kv } = await import("@vercel/kv");

    return {
      async get(key: string) {
        return await kv.get(key);
      },
      async set(key: string, value: string, options?: { ex?: number }) {
        if (options?.ex) {
          await kv.setex(key, options.ex, value);
        } else {
          await kv.set(key, value);
        }
        return "OK";
      },
      async del(keys: string[]) {
        if (keys.length === 0) return 0;
        return await kv.del(...keys);
      },
      async incr(key: string) {
        return await kv.incr(key);
      },
      async expire(key: string, seconds: number) {
        return (await kv.expire(key, seconds)) ? 1 : 0;
      },
    };
  } catch (error) {
    console.error("[RedisAdapter] Failed to create Vercel KV adapter:", error);
    throw error;
  }
}

// ============================================================================
// Development: Docker Redis via REST API or native ioredis
// ============================================================================

async function createDockerRedisAdapter(): Promise<RedisAdapter> {
  const redisRestUrl = env.REDIS_REST_URL;
  const redisUrl = env.REDIS_URL;
  const useRestApi = env.REDIS_USE_REST_API === "true";

  if (useRestApi) {
    if (!redisRestUrl) {
      throw new Error(
        "REDIS_REST_URL is required when REDIS_USE_REST_API=true.",
      );
    }

    assertLocalEndpoint("REDIS_REST_URL", redisRestUrl);

    return {
      async get(key: string) {
        try {
          const response = await fetch(`${redisRestUrl}/get/${key}`);
          if (!response.ok) return null;
          const data = (await response.json()) as { value?: string };
          return data.value || null;
        } catch (error) {
          console.error("[RedisAdapter] REST get failed:", error);
          throw error;
        }
      },
      async set(key: string, value: string, options?: { ex?: number }) {
        try {
          const url = new URL(`${redisRestUrl}/set/${key}`);
          url.searchParams.set("value", value);
          if (options?.ex) {
            url.searchParams.set("ex", String(options.ex));
          }

          const response = await fetch(url.toString(), { method: "POST" });
          if (!response.ok) throw new Error("Failed to set");
          return "OK";
        } catch (error) {
          console.error("[RedisAdapter] REST set failed:", error);
          throw error;
        }
      },
      async del(keys: string[]) {
        try {
          if (keys.length === 0) return 0;
          const response = await fetch(`${redisRestUrl}/del`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys }),
          });
          if (!response.ok) return 0;
          const data = (await response.json()) as { deleted?: number };
          return data.deleted || 0;
        } catch (error) {
          console.error("[RedisAdapter] REST del failed:", error);
          return 0;
        }
      },
      async incr(key: string) {
        try {
          const response = await fetch(`${redisRestUrl}/incr/${key}`, {
            method: "POST",
          });
          if (!response.ok) throw new Error("Failed to increment");
          const data = (await response.json()) as { value?: number };
          return data.value || 0;
        } catch (error) {
          console.error("[RedisAdapter] REST incr failed:", error);
          throw error;
        }
      },
      async expire(key: string, seconds: number) {
        try {
          const response = await fetch(
            `${redisRestUrl}/expire/${key}/${seconds}`,
            { method: "POST" },
          );
          if (!response.ok) return 0;
          const data = (await response.json()) as { success?: boolean };
          return data.success ? 1 : 0;
        } catch (error) {
          console.error("[RedisAdapter] REST expire failed:", error);
          return 0;
        }
      },
    };
  }

  if (redisUrl) {
    assertLocalEndpoint("REDIS_URL", redisUrl);

    const { default: Redis } = await import("ioredis");
    const client = new Redis(redisUrl, {
      enableOfflineQueue: false,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    await client.connect();

    return {
      async get(key: string) {
        return await client.get(key);
      },
      async set(key: string, value: string, options?: { ex?: number }) {
        if (options?.ex) {
          await client.set(key, value, "EX", options.ex);
        } else {
          await client.set(key, value);
        }

        return "OK";
      },
      async del(keys: string[]) {
        if (keys.length === 0) return 0;
        return await client.del(...keys);
      },
      async incr(key: string) {
        return await client.incr(key);
      },
      async expire(key: string, seconds: number) {
        return (await client.expire(key, seconds)) > 0 ? 1 : 0;
      },
    };
  }

  throw new Error(
    "Development rate limiting requires REDIS_URL, REDIS_REST_URL, or CONTACT_RATE_LIMIT_MODE=memory.",
  );
}

// ============================================================================
// Fallback: In-Memory Cache
// ============================================================================

function createMemoryAdapter(): RedisAdapter {
  const store = new Map<string, { value: string; expiresAt?: number }>();
  const intervals = new Map<string, NodeJS.Timeout>();

  const cleanup = (key: string) => {
    store.delete(key);
    const interval = intervals.get(key);
    if (interval) {
      clearTimeout(interval);
      intervals.delete(key);
    }
  };

  return {
    async get(key: string) {
      const entry = store.get(key);
      if (!entry) return null;
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        cleanup(key);
        return null;
      }
      return entry.value;
    },
    async set(key: string, value: string, options?: { ex?: number }) {
      const expiresAt = options?.ex
        ? Date.now() + options.ex * 1000
        : undefined;
      store.set(key, { value, expiresAt });

      // Set expiration timer
      if (expiresAt) {
        const existing = intervals.get(key);
        if (existing) clearTimeout(existing);
        const timeout = setTimeout(() => cleanup(key), expiresAt - Date.now());
        intervals.set(key, timeout);
      }

      return "OK";
    },
    async del(keys: string[]) {
      let count = 0;
      for (const key of keys) {
        if (store.has(key)) {
          count++;
          cleanup(key);
        }
      }
      return count;
    },
    async incr(key: string) {
      const entry = store.get(key);
      const current =
        entry && (!entry.expiresAt || entry.expiresAt > Date.now())
          ? parseInt(entry.value, 10)
          : 0;
      const next = current + 1;
      store.set(key, { value: String(next), expiresAt: entry?.expiresAt });
      return next;
    },
    async expire(key: string, seconds: number) {
      const entry = store.get(key);
      if (!entry) return 0;
      const expiresAt = Date.now() + seconds * 1000;
      const existing = intervals.get(key);
      if (existing) clearTimeout(existing);
      store.set(key, { ...entry, expiresAt });
      const timeout = setTimeout(() => cleanup(key), seconds * 1000);
      intervals.set(key, timeout);
      return 1;
    },
  };
}

// ============================================================================
// Singleton Instance
// ============================================================================

let adapterInstance: RedisAdapter | null = null;

export async function getRedisAdapter(): Promise<RedisAdapter> {
  if (adapterInstance) {
    return adapterInstance;
  }

  if (isProduction) {
    try {
      adapterInstance = await createVercelKvAdapter();
      console.warn("[RedisAdapter] Using Vercel KV (production)");
    } catch (error) {
      console.warn(
        "[RedisAdapter] Vercel KV unavailable, using memory cache as fallback",
        error,
      );
      adapterInstance = createMemoryAdapter();
    }
  } else if (isDevelopment) {
    try {
      adapterInstance = await createDockerRedisAdapter();
      console.warn("[RedisAdapter] Using local Redis (development)");
    } catch (error) {
      console.warn(
        "[RedisAdapter] Local Redis unavailable, using memory cache",
        error,
      );
      adapterInstance = createMemoryAdapter();
    }
  } else {
    adapterInstance = createMemoryAdapter();
    console.warn("[RedisAdapter] Using memory cache (fallback)");
  }

  return adapterInstance;
}

// For testing, allow reset
export function resetRedisAdapter() {
  adapterInstance = null;
}
