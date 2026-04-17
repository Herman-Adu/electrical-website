# Local Validation Setup Guide

This guide explains how to set up and use local validation checks before committing to GitHub.

## Why Local Validation?

The previous PR failed because validation checks were not run locally before pushing. Local validation lets you catch errors immediately, significantly reducing:
- Failed CI runs
- PR review delays
- Wasted GitHub Actions minutes
- Context window overhead for debugging GitHub failures

## Quick Start

### Run Validation Manually (Anytime)

```bash
node scripts/validate-claude-scaffold.mjs
```

Exit codes:
- `0` = all checks passed ✅
- `1` = validation failed ❌

### Install Pre-Commit Hook (Automatic)

Git hooks automatically run at certain stages. The pre-commit hook runs BEFORE each commit, allowing you to fix issues before they're committed.

**macOS/Linux:**
```bash
chmod +x .git/hooks/pre-commit
```

**Windows (Git for Windows):**
Git hooks work automatically. No additional setup needed.

**Windows (WSL/Bash):**
```bash
chmod +x .git/hooks/pre-commit
```

### Verify Hook is Active

Try committing with an invalid file (for testing):
```bash
echo "bad" > .claude/test-bad.md
git add .claude/test-bad.md
git commit -m "test: verify pre-commit hook"
```

Expected: Commit is blocked by validation. ✅

Clean up:
```bash
rm .claude/test-bad.md
git reset HEAD .claude/test-bad.md
```

## What Gets Validated

The validation script checks:

1. **Required Files**
   - Each agent directory has AGENT.md and README.md
   - Each skill directory has SKILL.md and README.md

2. **Frontmatter Validation**
   - AGENT.md files have `name` and `description` fields
   - SKILL.md files have `name` and `description` fields
   - Names match their directory names

3. **Broken References**
   - All backtick-quoted `.claude/` paths actually exist
   - No references to deleted files
   - Handles Windows (CRLF) and Unix (LF) line endings

## Common Validation Errors & Fixes

### ❌ Broken .claude reference

**Error:** `Broken .claude reference '.claude/rules/docker-memory-policy.md' in .claude/reference/MEMORY_QUICK_REFERENCE.md`

**Fix:** Check that the referenced file exists. If you deleted a file, update references to point to the new location.

```bash
# Example: docker-memory-policy.md was moved to memory-policy.md
# Update all references:
sed -i 's/docker-memory-policy\.md/memory-policy.md/g' .claude/reference/MEMORY_QUICK_REFERENCE.md
```

### ❌ Missing frontmatter 'description'

**Error:** `Missing frontmatter 'description' in .claude/agents/my-agent/AGENT.md`

**Fix:** Add `description:` field to the frontmatter:

```yaml
---
name: my-agent
description: Clear, pushy description of when to use this agent
role: Your role here
---
```

### ❌ Frontmatter name doesn't match directory

**Error:** `Frontmatter name 'my_agent' does not match directory 'my-agent' in .claude/agents/my-agent/AGENT.md`

**Fix:** Use kebab-case in frontmatter names:

```yaml
---
name: my-agent    # ✅ Matches directory name
description: ...
---
```

## Workflow Integration

### Before Committing Code Changes

```bash
# Make your changes
git add .

# Validation runs automatically
git commit -m "your commit message"
```

If validation fails:
1. Read the error message
2. Fix the issue
3. Re-commit

### If Hook Fails or You Need to Bypass

You can manually validate without committing:
```bash
node scripts/validate-claude-scaffold.mjs
```

Or temporarily skip the hook (not recommended):
```bash
git commit --no-verify -m "bypass pre-commit"
```

⚠️ **Warning:** Using `--no-verify` skips validation and may cause GitHub CI failures.

## CI/CD Integration

GitHub's Skill Sync Check uses the same validation logic. By running locally, you're using the same checks as GitHub, so:
- ✅ If local validation passes, GitHub will likely pass
- ✅ Failures are caught early, before pushing
- ✅ Reduces PR cycle time

## Future Enhancements

Potential improvements to the validation script:

1. **TypeScript validation** for AGENT.md mode/role/trigger fields
2. **SKILL.md validation** for argument-hint field
3. **Frontmatter YAML parsing** to validate field types
4. **Cross-reference validation** (e.g., agents can't reference deleted skills)
5. **Integration with pre-push hook** for additional checks before push

---

**Last Updated:** 2026-04-17
**Status:** Active
**Maintained by:** Orchestrator (Herman Adu / Claude Code)

## References

- **Validation Script:** `scripts/validate-claude-scaffold.mjs`
- **Orchestrator Contract:** `.claude/CLAUDE.md`
- **Frontmatter Schema:** `.claude/rules/frontmatter-schema.md`
