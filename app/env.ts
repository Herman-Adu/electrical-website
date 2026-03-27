import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    CONTACT_ADMIN_EMAIL: z.string().email(),
    CONTACT_FROM_EMAIL: z.string().email().default("noreply@nexgen.com.au"),
    CONTACT_FROM_NAME: z.string().min(1).default("Nexgen Electrical"),
    CONTACT_RESPONSE_TIME_HOURS: z.coerce.number().int().positive().default(2),
    CONTACT_RATE_LIMIT_WINDOW_HOURS: z.coerce
      .number()
      .int()
      .positive()
      .default(1),
    CONTACT_RATE_LIMIT: z.coerce.number().int().positive().default(3),
    CONTACT_RATE_LIMIT_MODE: z.enum(["redis", "memory", "off"]).optional(),
    OG_ROUTE_ALLOWED_ORIGINS: z
      .string()
      .default(
        "http://localhost:3000,https://nexgen-electrical-innovations.co.uk,https://cdn.nexgen-electrical-innovations.co.uk,https://api.nexgen-electrical-innovations.co.uk",
      )
      .transform((val) =>
        val.split(",").map((origin) => origin.trim().toLowerCase()),
      ),
    NEXT_IMAGE_UNOPTIMIZED: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    // Turnstile CAPTCHA
    TURNSTILE_SECRET_KEY: z.string().min(1),
    // Production: Vercel KV
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().min(1).optional(),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1).optional(),
    // Development: Docker Redis
    REDIS_URL: z.string().url().optional(),
    REDIS_REST_URL: z.string().url().optional(),
    REDIS_USE_REST_API: z.enum(["true", "false"]).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_ADMIN_EMAIL: process.env.CONTACT_ADMIN_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_FROM_NAME: process.env.CONTACT_FROM_NAME,
    CONTACT_RESPONSE_TIME_HOURS: process.env.CONTACT_RESPONSE_TIME_HOURS,
    CONTACT_RATE_LIMIT_WINDOW_HOURS:
      process.env.CONTACT_RATE_LIMIT_WINDOW_HOURS,
    CONTACT_RATE_LIMIT: process.env.CONTACT_RATE_LIMIT,
    CONTACT_RATE_LIMIT_MODE: process.env.CONTACT_RATE_LIMIT_MODE,
    OG_ROUTE_ALLOWED_ORIGINS: process.env.OG_ROUTE_ALLOWED_ORIGINS,
    NEXT_IMAGE_UNOPTIMIZED: process.env.NEXT_IMAGE_UNOPTIMIZED,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    // Production: Vercel KV
    KV_REST_API_URL:
      process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
    KV_REST_API_TOKEN:
      process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN:
      process.env.KV_REST_API_READ_ONLY_TOKEN ??
      process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN,
    // Development: Docker Redis
    REDIS_URL: process.env.REDIS_URL,
    REDIS_REST_URL: process.env.REDIS_REST_URL,
    REDIS_USE_REST_API: process.env.REDIS_USE_REST_API,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.NODE_ENV !== "production" &&
    process.env.SKIP_ENV_VALIDATION === "true",
});
