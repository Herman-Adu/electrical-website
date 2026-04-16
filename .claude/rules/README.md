# Rules Directory

Central rule set for `.claude` agents and skills. These files define **how** work is done, **when** to delegate, and **what** is non-negotiable.

## Files to Create/Populate

| File | Purpose | Status |
|------|---------|--------|
| `naming-conventions.md` | Variable, function, component naming patterns | ✅ COMPLETE |
| `frontmatter-schema.md` | SKILL.md + AGENT.md frontmatter validation rules | ✅ COMPLETE |
| `delegation-gates.md` | When orchestrator must delegate vs. implement directly | ⚠️ TODO |
| `security-constraints.md` | Non-negotiable security rules (OWASP, secrets, auth) | ⚠️ TODO |

## Current Policy Status

✅ **Complete:**
- [.claude/security/SECRETS_POLICY.md](../security/SECRETS_POLICY.md) — Secrets handling, masking, exposure recovery
- [naming-conventions.md](naming-conventions.md) — File/directory/code naming standards (kebab-case, camelCase, PascalCase)
- [frontmatter-schema.md](frontmatter-schema.md) — SKILL.md and AGENT.md frontmatter validation rules

⚠️ **To Be Created:**
- Rules/delegation-gates.md
- Rules/security-constraints.md

## How to Use These Files

**For Orchestrator:**
- Before delegating work, check `delegation-gates.md` to confirm delegation is required
- Before approving generated skills, check `frontmatter-schema.md`
- Before committing code, check `security-constraints.md`

**For Agents:**
- Follow naming conventions from `naming-conventions.md` when generating code
- Validate skill frontmatter against `frontmatter-schema.md` when auditing
- Apply constraints from `security-constraints.md` when reviewing

**For Users:**
- Add project-specific conventions here as they stabilize
- Reference these rules when providing feedback to Claude

## Next Steps

1. Create `naming-conventions.md` after 3–5 features complete (identify patterns)
2. Create `frontmatter-schema.md` after skill-builder stabilizes
3. Create `delegation-gates.md` after 10 features (understand orchestration patterns)
4. Create `security-constraints.md` after security review (document non-negotiables)
