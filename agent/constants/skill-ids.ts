import type { SkillId } from "../types/core";

function sid(s: string): SkillId {
  return s as SkillId;
}

/**
 * All skill IDs as typed constants.
 * Must match the directory name under .github/skills/<id>/SKILL.md
 * and the SkillManifest.id field.
 */
export const SKILLS = {
  CODE_SEARCH: sid("code-search"),
  BROWSER_TEST: sid("browser-testing"),
  GITHUB_ACTIONS: sid("github-actions"),
  SEND_NOTIFICATION: sid("send-notification"),
  REASONING_CHAIN: sid("reasoning-chain"),
  HEALTH_CHECK: sid("health-check"),
  NEXTJS_AGENT_SETUP: sid("nextjs-agent-setup"),
  SKILL_BUILDER: sid("skill-builder"),
} as const satisfies Record<string, SkillId>;
