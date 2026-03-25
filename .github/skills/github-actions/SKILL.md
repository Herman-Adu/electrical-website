---
name: github-actions
description: "Trigger and inspect GitHub Actions workflows as callable skills. Supports: triggering e2e tests, deploying preview environments, requesting Copilot code review on pull requests, running dependency audits, listing recent workflow runs, and summarising CI failures. Use this when asked to run CI, trigger workflows, deploy a preview, audit dependencies, or review a PR on the Herman-Adu/electrical-website repository."
---

# GitHub Actions Skill

Uses the **github-official** MCP server. All write operations (trigger, deploy, review) are **dry-run capable** — pass `dryRun: true` to preview without side effects.

## Supported Actions

| Action                   | Description                          | Destructive |
| ------------------------ | ------------------------------------ | ----------- |
| `trigger-e2e-tests`      | Trigger the e2e.yml workflow on main | Yes         |
| `deploy-preview`         | Trigger preview deploy for a PR      | Yes         |
| `request-copilot-review` | Request Copilot code review on a PR  | Yes         |
| `dependency-audit`       | Trigger dependency audit workflow    | Yes         |
| `list-recent-runs`       | List recent workflow runs            | No          |
| `summarize-failures`     | AI summary of failing job logs       | No          |

## When to use

- "Run the e2e tests on main"
- "Deploy a preview for PR #42"
- "Ask Copilot to review PR #37"
- "Show me the last 10 CI runs"
- "Why did the last workflow fail?"

## Steps

1. Identify the action from the user's request.
2. Confirm `pullNumber` for PR-scoped actions.
3. Always use `dryRun: true` first when the action is destructive, unless the user explicitly confirms.
4. Report the run ID and URL for triggered workflows.
5. For `summarize-failures`, present the AI summary directly.

## Guidelines

- Never trigger workflows without confirming the target branch/PR with the user.
- `dependency-audit` can expose security issues — present findings clearly.
- `list-recent-runs` results include status icons: ✅ success, ❌ failure, 🔄 in progress.
