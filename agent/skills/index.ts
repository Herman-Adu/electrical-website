export { codeSearchSkill } from "./code-search.skill";
export type { CodeSearchInput, CodeSearchOutput } from "./code-search.skill";

export { browserTestSkill } from "./browser-testing.skill";
export type {
  BrowserTestInput,
  BrowserTestOutput,
} from "./browser-testing.skill";

export { githubActionsSkill } from "./github-actions.skill";
export type {
  GitHubActionsInput,
  GitHubActionsOutput,
} from "./github-actions.skill";

export { sendNotificationSkill } from "./send-notification.skill";
export type {
  SendNotificationInput,
  SendNotificationOutput,
} from "./send-notification.skill";

export { reasoningChainSkill } from "./reasoning-chain.skill";
export type {
  ReasoningChainInput,
  ReasoningChainOutput,
} from "./reasoning-chain.skill";

export { healthCheckSkill } from "./health-check.skill";
export type { HealthCheckInput, HealthCheckOutput } from "./health-check.skill";

export { nextjsAgentSetupSkill } from "./nextjs-agent-setup.skill";
export type {
  NextjsAgentSetupInput,
  NextjsAgentSetupOutput,
} from "./nextjs-agent-setup.skill";

export { skillBuilderSkill } from "./skill-builder.skill";
export type {
  SkillBuilderInput,
  SkillBuilderOutput,
} from "./skill-builder.skill";

import { skillRegistry } from "../registry";
import { codeSearchSkill } from "./code-search.skill";
import { browserTestSkill } from "./browser-testing.skill";
import { githubActionsSkill } from "./github-actions.skill";
import { sendNotificationSkill } from "./send-notification.skill";
import { reasoningChainSkill } from "./reasoning-chain.skill";
import { healthCheckSkill } from "./health-check.skill";
import { nextjsAgentSetupSkill } from "./nextjs-agent-setup.skill";
import { skillBuilderSkill } from "./skill-builder.skill";

/**
 * Register all built-in skills into the global registry.
 * This file is the single entry point — import it once in orchestrator.ts.
 */
export function registerAllSkills(): void {
  const manifests = [
    codeSearchSkill,
    browserTestSkill,
    githubActionsSkill,
    sendNotificationSkill,
    reasoningChainSkill,
    healthCheckSkill,
    nextjsAgentSetupSkill,
    skillBuilderSkill,
  ] as const;

  for (const manifest of manifests) {
    if (!skillRegistry.get(manifest.id)) {
      skillRegistry.register(manifest);
    }
  }
}
