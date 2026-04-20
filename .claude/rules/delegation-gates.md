# Delegation Gates

This rule file defines when orchestrator-mode work must dispatch specialist agents before implementation.

## Purpose

- **ENFORCE orchestrator-only mode** — The main agent must NEVER implement code directly (except trivial changes)
- **MANDATE SME delegation** — Every non-trivial task requires architecture/validation/security/QA review
- **MANDATE Docker memory persistence** — Every completed work unit (feature, learning, decision) → entity in Docker
- **Prevent knowledge loss** — Without persistence, future sessions rebuild context from scratch
- **Keep direct edits trivial only** — Single-file, <50 lines, obvious intent

---

## Mandatory Docker Memory Persistence

**BEFORE closing a session, create entities for:**

1. **Every completed feature** → `feat-*` entity with files, status, implementation details
2. **Every learning discovered** → `learn-*` entity with insight, problem, solution
3. **Every decision made** → `decide-*` entity with rationale, choice, alternatives considered
4. **Session summary** → `session-YYYY-MM-DD-*` entity with work completed, commits, build status

**THEN create relations:**
- Feature ← Decision (derives_from)
- Learning → Feature (documents)
- Learning → Session (reflection_on)
- Task → Decision (implements)

**THEN verify:**
- Search Docker: `search_nodes(query)` → confirms entities were saved

**See:** `.claude/reference/DOCKER_MEMORY_MCP_PATTERN.md` for the complete workflow.

---

## Default Gates

Use delegation when any of the following is true:

- **ALWAYS** — Multi-file changes (implies architecture review needed)
- **ALWAYS** — New features (implies design, validation, security, QA review)
- **ALWAYS** — Refactoring with behavior changes (implies regression testing)
- Crosses multiple domains (architecture, validation, security, QA).
- Introduces security/auth, data handling, or policy-sensitive changes.
- Is ambiguous enough to need trade-off analysis.
- Exceeds a small, obvious patch (roughly >50 LOC or >1 file with logic changes).

## Allowed Direct Implementation (Rare Exception)

Direct implementation is ONLY acceptable when ALL are true:

- Single-file or tightly scoped change (no multi-file refactors)
- Intent and acceptance criteria are explicit in the task description
- <50 lines of code (otherwise it's not "trivial")
- No security/compliance surface is introduced
- Quick local verification is possible (usually a simple edit)
- **AND the work is already planned** (not a decision point)

**Examples where direct implementation is OK:**
- Typo fixes (CLAUDE.md, docs, comments)
- Adding a single console.log for debugging
- Updating a version number in config
- Renaming a variable across one file
- Adding a missing import

**Examples that REQUIRE delegation (and persistence):**
- "Add dark mode" → Feature (needs architecture SME)
- "Optimize database queries" → Decision + feature (needs architecture + performance SME)
- "Add user authentication" → Feature + security (MUST delegate to security SME)
- "Create a reusable animation component" → Feature + learning (architecture + code-gen)

---

## Exit Criteria

Before marking session done, ensure:

- **Delegation complete:** If gated, SME analysis finished and findings documented
- **Tests pass:** `pnpm test` ✅
- **Build passes:** `pnpm build` ✅
- **Docker entities created:** All work captured in Docker memory (not .md files)
- **Relations linked:** Features ← decisions, learnings documented, session entity created
- **Entities verified:** `search_nodes()` confirms all entities were saved
- **No unresolved blockers:** Security/validation gates cleared
