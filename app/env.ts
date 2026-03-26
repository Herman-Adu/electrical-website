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
    NEXT_IMAGE_UNOPTIMIZED: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().min(1).optional(),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
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
    NEXT_IMAGE_UNOPTIMIZED: process.env.NEXT_IMAGE_UNOPTIMIZED,
    KV_REST_API_URL:
      process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
    KV_REST_API_TOKEN:
      process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN:
      process.env.KV_REST_API_READ_ONLY_TOKEN ??
      process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.NODE_ENV !== "production" &&
    process.env.SKIP_ENV_VALIDATION === "true",
});
