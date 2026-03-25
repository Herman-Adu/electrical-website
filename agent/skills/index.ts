export { codeSearchSkill } from "./code-search.skill";
export type { CodeSearchInput, CodeSearchOutput } from "./code-search.skill";

export { browserTestSkill } from "./browser-test.skill";
export type { BrowserTestInput, BrowserTestOutput } from "./browser-test.skill";

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

import { skillRegistry } from "../registry";
import { codeSearchSkill } from "./code-search.skill";
import { browserTestSkill } from "./browser-test.skill";
import { githubActionsSkill } from "./github-actions.skill";
import { sendNotificationSkill } from "./send-notification.skill";
import { reasoningChainSkill } from "./reasoning-chain.skill";
import { healthCheckSkill } from "./health-check.skill";

/**
 * Register all built-in skills into the global registry.
 * This file is the single entry point — import it once in orchestrator.ts.
 */
export function registerAllSkills(): void {
  skillRegistry.register(codeSearchSkill);
  skillRegistry.register(browserTestSkill);
  skillRegistry.register(githubActionsSkill);
  skillRegistry.register(sendNotificationSkill);
  skillRegistry.register(reasoningChainSkill);
  skillRegistry.register(healthCheckSkill);
}
