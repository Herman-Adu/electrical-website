import { z } from "zod";
import type { AgentIntent, SkillContext } from "../types/core";
import type { SkillManifest } from "../types/skill";
import { MCP } from "../constants/mcp-servers";
import { SKILLS } from "../constants/skill-ids";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const InputSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  bodyText: z.string().min(1),
  bodyHtml: z.string().optional(),
  /** ISO 8601 datetime string for scheduling. Omit to send immediately. */
  scheduledAt: z.string().optional(),
  /** Set by orchestrator when dryRun is active. Callers should not set this. */
  _dryRun: z.boolean().default(false),
});

const OutputSchema = z.object({
  sent: z.boolean(),
  dryRun: z.boolean(),
  messageId: z.string().optional(),
  scheduledAt: z.string().optional(),
  summary: z.string(),
});

export type SendNotificationInput = z.infer<typeof InputSchema>;
export type SendNotificationOutput = z.infer<typeof OutputSchema>;

// ─── Fitness keywords ─────────────────────────────────────────────────────────

const NOTIFICATION_KEYWORDS = [
  "send email",
  "notify",
  "notification",
  "email",
  "alert",
  "message",
  "contact",
  "resend",
  "mail",
] as const;

// ─── Skill Manifest ───────────────────────────────────────────────────────────

export const sendNotificationSkill: SkillManifest<
  SendNotificationInput,
  SendNotificationOutput
> = {
  id: SKILLS.SEND_NOTIFICATION,
  version: "1.0.0",
  description:
    "Send an email notification using Resend. Supports plain text and HTML bodies, " +
    "and optional scheduling. " +
    "Use this when asked to send an email, notify a user, or deliver an alert via email.",
  requiredServers: [MCP.RESEND],
  costTier: "cheap",
  dryRunCapable: true,

  inputSchema: InputSchema,
  outputSchema: OutputSchema,

  fitness(intent: AgentIntent): number {
    if (intent.category === "notification") return 0.97;

    const desc = intent.description.toLowerCase();
    const hits = NOTIFICATION_KEYWORDS.filter((kw) => desc.includes(kw)).length;
    if (hits === 0) return 0;

    return Math.min(0.9, 0.4 + hits * 0.15);
  },

  async execute(
    input: SendNotificationInput,
    ctx: SkillContext,
  ): Promise<SendNotificationOutput> {
    if (ctx.dryRun) {
      return {
        sent: false,
        dryRun: true,
        summary: `[DRY RUN] Would send email to ${input.to}: "${input.subject}"`,
        scheduledAt: input.scheduledAt,
      };
    }

    const result = await ctx.callMcp<{ id: string }>(MCP.RESEND, "send-email", {
      to: input.to,
      subject: input.subject,
      text: input.bodyText,
      html: input.bodyHtml,
      scheduledAt: input.scheduledAt,
    });

    return {
      sent: true,
      dryRun: false,
      messageId: result.id,
      scheduledAt: input.scheduledAt,
      summary: `Email sent to ${input.to}. Message ID: ${result.id}`,
    };
  },
};
