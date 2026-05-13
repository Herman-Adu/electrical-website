---
name: github-ops
description: Use this skill WHENEVER you need to perform GitHub operations — creating PRs, merging branches, checking CI status, listing open PRs, reviewing comments, closing issues, or any GitHub API interaction. Invoke before any GitHub operation. Trigger phrases: "create a PR", "merge this", "check CI", "push to GitHub", "open a pull request", "GitHub status", "review PR", "close issue".
argument-hint: "[create-pr | merge | check-ci | list-prs | comment | close-issue]"
disable-model-invocation: true
---

# GitHub Ops

Executes GitHub operations via the Docker-hosted `github-official` MCP service.

## Pre-flight

Before executing any GitHub operation, check if the github-official container is running:

```bash
curl -s http://localhost:3100/github/health
```

If the response is not `{"status":"ok"}` or similar 200 response, start it:

```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d github-official
# Wait for health: check every 2s, max 15s
```

## Execution

All GitHub operations go through the Docker gateway REST API:

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "TOOL_NAME", "arguments": {...}}'
```

Common operations:

**Create PR:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "create_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "title": "...", "body": "...", "head": "BRANCH", "base": "main"}}'
```

**List open PRs:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "list_pull_requests", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "state": "open"}}'
```

**Get PR status / checks:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "get_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pull_number": PR_NUMBER}}'
```

**Merge PR:**
```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "merge_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pull_number": PR_NUMBER, "merge_method": "squash"}}'
```

## Available tools

Run `GET http://localhost:3100/github/tools/list` to get the full tool list with schemas.

## Repo constants

- Owner: `Herman-Adu`
- Repo: `nexgen-electrical-innovations`
- Default base: `main`
