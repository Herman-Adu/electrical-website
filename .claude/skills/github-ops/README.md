# GitHub Ops Skill

GitHub operations proxy: create PRs, merge branches, check CI status, list open PRs, review comments, and close issues — all via the Docker-hosted `github-official` MCP service.

## When to Use

Use this skill WHENEVER you need to perform a GitHub operation on the Nexgen Electrical Innovations repository. The skill pre-checks the Docker service health before every operation and handles startup automatically.

**Trigger phrases:**
- "Create a PR for this branch"
- "Merge this branch / squash and merge"
- "Check CI status / are checks passing?"
- "List open PRs"
- "Comment on PR #N"
- "Close issue #N"
- `/github-ops [create-pr | merge | check-ci | list-prs | comment | close-issue]`

## How It Works

```
1. Health-check the Docker github-official container (port 3100)
2. If container is down, start it via docker compose
3. Execute the requested GitHub operation via REST to http://localhost:3100/github/tools/call
4. Return the API response to the caller
```

## Available Operations

All operations go through the Docker gateway REST API.

### Create Pull Request

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "create_pull_request",
    "arguments": {
      "owner": "Herman-Adu",
      "repo": "nexgen-electrical-innovations",
      "title": "feat: add emergency section hero copy",
      "body": "## Summary\n- ...\n\n## Test plan\n- ...",
      "head": "feat/emergency-hero-copy",
      "base": "main"
    }
  }'
```

### List Open PRs

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "list_pull_requests", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "state": "open"}}'
```

### Get PR Status / CI Checks

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "get_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pull_number": 123}}'
```

### Merge PR (squash)

```bash
curl -s -X POST http://localhost:3100/github/tools/call \
  -H 'Content-Type: application/json' \
  -d '{"name": "merge_pull_request", "arguments": {"owner": "Herman-Adu", "repo": "nexgen-electrical-innovations", "pull_number": 123, "merge_method": "squash"}}'
```

### Full Tool List

```bash
curl -s http://localhost:3100/github/tools/list
```

Returns the complete tool catalog with input schemas.

## Repository Constants

| Key | Value |
|-----|-------|
| Owner | `Herman-Adu` |
| Repo | `nexgen-electrical-innovations` |
| Default base | `main` |
| Gateway | `http://localhost:3100/github/tools/call` |

## Health Check

```bash
curl -s http://localhost:3100/github/health
# Expected: {"status":"ok"}
```

If the response is not 200 OK:

```bash
docker compose -f docker-compose.mcp.yml up --no-deps -d github-official
# Wait 15s, then retry health check
```

## Integration

- **Invoked by:** `orchestrator`, `mcp-automation`, `plan-sync` (after plan sync completes), any workflow that merges or creates PRs
- **Replaces:** `gh` CLI — the project CLAUDE.md mandates MCP tools over CLI for all GitHub operations
- **Related:** `playwright-ops` (browser verification after merge), `session-lifecycle` (session end includes a push)

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Container not running | Run `docker compose -f docker-compose.mcp.yml up --no-deps -d github-official`, wait 15s, retry |
| 401 Unauthorized | Check that `GITHUB_PERSONAL_ACCESS_TOKEN` is set in the Docker container environment |
| 422 Unprocessable Entity on PR create | Branch may not have commits ahead of base — verify branch state with `git log main..HEAD` |
| 409 Merge conflict | Rebase the branch on `main` locally, force-push, then retry merge |
| Rate limit (403) | Wait 60s and retry; avoid calling in tight loops |

## When NOT to Use

- Do NOT use `gh` CLI for GitHub operations — always use this skill via the Docker gateway
- Do NOT call GitHub's REST API directly — the Docker gateway handles auth and retries

## Related Files

- **SKILL.md:** `.claude/skills/github-ops/SKILL.md` — full execution instructions
- **Docker compose:** `docker-compose.mcp.yml` — MCP service definitions
- **Related skills:** `playwright-ops` (browser verification), `mcp-automation` (workflow orchestration)
