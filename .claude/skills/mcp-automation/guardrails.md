# MCP Automation Guardrails (P2.2)

Safety boundaries and restrictions for the MCP Automation skill.

## Core Principle

**Safe by Default:** MCP Automation cannot execute dangerous operations without explicit approval.

---

## Tool Whitelisting

### Allowed Tools

```
Read, Glob, Grep, Write, Edit
Git (status, log, diff, add, commit, fetch)
Bash (ls, cd, pwd, cat, cp, mv, mkdir, find, grep)
```

### Restricted Tools (Require Approval)

```
Bash rm/rmdir (file deletion)
Bash chmod (permission changes)
Git (force push, rebase -i, reset --hard)
System (reboot, shutdown, user management)
```

### Forbidden Tools

```
su, sudo (privilege escalation)
Network (curl to unapproved URLs)
System administration (systemctl, service control)
```

---

## Workflow Safety

### Safe Workflows (Pre-Approved)

- ✅ Research → Planning → Content → Archive
- ✅ Code Generation → Testing → Archive
- ✅ Content Creation → Brand Voice → Social Media → Archive
- ✅ Client Communication Sequence → Archive
- ✅ Multi-skill orchestration with approved tools only

### Requires Approval

- ⚠️ Any workflow using restricted tools
- ⚠️ Workflows modifying system configuration
- ⚠️ Workflows accessing external APIs
- ⚠️ Workflows affecting 3+ files or branches

### Forbidden Workflows

- ❌ Destructive operations (rm -rf, reset --hard)
- ❌ Privilege escalation (sudo, su)
- ❌ System modification (install packages, kernel changes)
- ❌ Network access to unapproved services

---

## Rate Limiting

To prevent runaway automation:

- **Max 5 skills** can be invoked in a single workflow
- **Max 100 files** can be written in a single run
- **Max 10 git commits** per workflow
- **Timeout:** 30 minutes max execution time

If limits are exceeded, workflow pauses and requests approval.

---

## Approval Gates

Workflows requiring approval must show:

1. **What will happen:** Clear description of each step
2. **What will change:** Files/systems affected
3. **How to undo:** Rollback instructions if needed
4. **Why needed:** Justification for the operation

Example:

```
WORKFLOW: Quarterly content campaign automation
STEPS:
  1. Research market trends (read only)
  2. Plan content calendar (write to archives/)
  3. Create 4 blog posts (write to archives/content/blog/)
  4. Format for social (write to archives/content/social/)
  5. Archive metadata (write to archives/)

CHANGES:
  - New files: 8 (4 blogs, 4 social)
  - Approx size: 50 KB total
  - Git commits: 2

UNDO:
  git revert --no-edit HEAD~1..HEAD
  git checkout -- archives/content/blog/ archives/content/social/

JUSTIFICATION:
  Automates routine quarterly campaign, saves 4 hours manual work
```

---

## Error Handling

If a step fails:

1. **Log the error** with full context
2. **Stop execution** (don't continue)
3. **Communicate failure** to user
4. **Offer alternatives** (manual completion, modified workflow, etc.)
5. **Never retry** automatically (requires user approval)

---

## Workflow Validation

Before execution, validate:

- [ ] All input files exist and are accessible
- [ ] All output directories exist and are writable
- [ ] No conflicts with existing files
- [ ] All dependencies are met
- [ ] Tool whitelist includes all tools needed
- [ ] Execution time estimate is < 30 minutes

---

## Logging & Audit Trail

Every workflow must produce:

1. **Execution log:** What was done, when, in what order
2. **File manifest:** What files were created/modified
3. **Git commits:** All commits made (if any)
4. **Metrics:** Duration, file count, success rate

Stored in: `archives/workflows/[date]_[workflow-name]_log.md`

---

## Security Checks

Before each workflow:

- [ ] No secrets in workflow definition
- [ ] No hardcoded passwords or API keys
- [ ] No unsafe shell expansions (e.g., `$USER_INPUT`)
- [ ] All file paths validated and normalized
- [ ] No privilege escalation attempts
- [ ] No network access to unknown hosts

---

## Rollback Strategy

If something goes wrong:

**For file changes:**

```bash
git diff HEAD
git checkout [file]
```

**For git commits:**

```bash
git revert --no-edit HEAD
git revert --no-edit HEAD~1..HEAD
```

**For directory creation:**

```bash
git clean -fd -- [created-directory]
```

Always test rollback procedure before running risky workflows.

---

## Guardrail Checklist

Use this before approving any workflow:

- [ ] Tool whitelist covers all operations
- [ ] No dangerous operations (rm, chmod, sudo)
- [ ] Approval gates for restricted tools
- [ ] Error handling defined
- [ ] Rollback procedure tested
- [ ] Logging enabled
- [ ] Execution time < 30 minutes
- [ ] File count < 100
- [ ] No secrets in workflow
- [ ] Validation checks pass

✅ All checklist items pass → Workflow is safe to execute

---

## Example Safe Workflows

### Workflow 1: Research + Plan + Archive

```yaml
name: "Quarterly research summary"
steps: 1. /research "latest SaaS trends"
  2. /planning "create Q2 content strategy"
  3. /knowledge-memory "archive research and plan"
tools_used: [Read, Glob, Grep, Write]
approvals: None (all tools approved)
estimated_time: 15 minutes
```

### Workflow 2: Content Campaign

```yaml
name: "Launch content campaign"
steps: 1. /content-creation "blog post on positioning"
  2. /brand-voice "apply voice"
  3. /social-media "format for LinkedIn, X"
  4. /mcp-automation "schedule posts"
  5. /knowledge-memory "archive campaign"
tools_used: [Read, Write, Edit, Git]
approvals: None (all tools approved)
estimated_time: 20 minutes
```

---

## Example Workflows Requiring Approval

### Workflow A: Destructive Cleanup

```yaml
name: "Archive old drafts"
steps:
  1. Find all _DRAFT files > 30 days old
  2. Move to archives/old-content/
  3. Commit to git
  4. Push to remote
tools_used: [Bash (find, mv), Git (push)]
approvals: REQUIRED
  - Reason: File movement + git push
  - Rollback: git revert commit(s), then restore moved files from git checkout
```

---

## Forbidden Example Workflows

### ❌ System Modification

```
steps:
  1. Install Python package
  2. Modify system config
  3. Restart service
→ DENIED: System modification not allowed
```

### ❌ Privilege Escalation

```
steps:
  1. sudo chown root file
  2. Escalate permissions
→ DENIED: Privilege escalation forbidden
```

### ❌ Unsafe Network Access

```
steps:
  1. curl https://untrusted-service.com/api
  2. Parse response
→ DENIED: Unapproved external service
```

---

## Checklist Before Approval

- [ ] Is this workflow necessary?
- [ ] Is there a safer alternative?
- [ ] What's the blast radius if it fails?
- [ ] Can it be easily undone?
- [ ] Is the user explicitly requesting this?
- [ ] Will it be logged for audit?
- [ ] Do all guardrails pass?

If yes to all → **APPROVE**
If no to any → **DENY and suggest alternatives**
