# Claude Code Project Instructions — electrical-website

This is the electrical-website project: a Next.js 16 App Router application built with strict TypeScript and orchestrator-driven development patterns.

## Quick Links

- **Orchestrator Contract:** [.claude/CLAUDE.md](.claude/CLAUDE.md) — Delegation sequences, execution lifecycle
- **Security & Secrets:** [.claude/security/SECRETS_POLICY.md](.claude/security/SECRETS_POLICY.md) — How to handle sensitive data
- **Form Standards:** [docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md](docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md) — Multi-step form pattern
- **GitHub Conventions:** [.github/copilot-instructions.md](.github/copilot-instructions.md) — Skill naming, workflows

---

## Core Development Rules

### Next.js & TypeScript Standards

- **Framework:** Next.js 16 App Router (strict TypeScript required)
- **Default:** Server Components — use `"use client"` **only** for browser interactivity
- **Mutations:** Prefer Server Actions over client-side state mutations
- **Validation:** All external input validated with Zod **before** processing
- **Build Gate:** `pnpm typecheck && pnpm build` must pass before commit

### Next.js Documentation Priority

Before **any** Next.js work, resolve local docs in this exact order:

1. `node_modules/next/dist/docs/` (preferred when present)
2. `node_modules/next/docs/`
3. `node_modules/next/README.md` (minimum fallback)
4. Context7 library docs (if packaged docs unavailable)

Run `pnpm run status:next-docs` to discover which source exists in this workspace.

**Why:** Local docs reflect your exact installed version — always fresher than training data.

### Secret Handling (Restricted Files)

- **Never output** secret values from `.env*`, terminal logs, screenshots, or file attachments
- **Masked reporting only:** Use `[REDACTED]` or reference variable names instead
- **Contaminated session?** Treat credentials as compromised and instruct immediate rotation
- **Uncertainty = block:** If you're not sure whether content is sensitive, mask it and don't quote it

**Correct Examples:**
- ✅ "Missing variable: DATABASE_URL"
- ✅ "Checked .env.local — DATABASE_URL is present"
- ❌ "Database URL is mysql://user:password@host"

### Multi-Step Forms

All forms with multiple steps **must** follow [docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md](docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md):

- **Structure:** Server page shell (authorization) + client form island (interactivity)
- **Validation:** Authoritative server-side Zod schema via Server Action
- **CAPTCHA/Anti-Bot:** Tokens must be ephemeral — reset on expiry, retry, and uncertain verification
- **Submission:** Native `<form action={serverAction}>` where practical

---

## Development Workflow

### Starting Work

1. **Check Project Context**
   ```bash
   git log --oneline -10          # Recent commits
   git status                     # Current state
   pnpm run status:next-docs      # Available Next.js docs
   ```

2. **Load Orchestrator Contract**
   - Review [.claude/CLAUDE.md](.claude/CLAUDE.md) for delegation sequences
   - Review [.claude/security/SECRETS_POLICY.md](.claude/security/SECRETS_POLICY.md)
   - Check `.claude/memory/` for active project context

3. **Clarify Requirements**
   - If ambiguous, ask before implementing
   - Document edge cases and success criteria
   - For work 2+ hours, use Super Powers workflow (brainstorm → plan → execute)

### Code Review Before Commit

```bash
pnpm typecheck              # TypeScript strict mode
pnpm build                  # Production build test
pnpm test                   # Run tests (if applicable)
```

Commit only after all checks pass.

---

## Project Structure

```
electrical-website/
├── app/                        # Next.js App Router
├── components/                 # React components (server + client)
├── lib/                       # Utilities, hooks, schemas
├── types/                     # Shared TypeScript types
├── public/                    # Static assets
├── docs/
│   └── standards/             # Development standards
├── .claude/                   # Claude Code orchestrator
│   ├── agents/               # SME sub-agents
│   ├── skills/               # Reusable workflow skills
│   ├── rules/                # Naming, security, frontmatter rules
│   ├── security/             # Security policies
│   ├── reference/            # Playbooks, examples, docs
│   └── CLAUDE.md            # Orchestrator-only contract
├── .github/                   # GitHub workflows
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Orchestrator-Only Development Pattern

This project uses a **specialized delegation model** where the main Claude agent acts as an orchestrator:

1. **Preflight:** Load memory, clarify requirements, check context
2. **Delegate:** Dispatch SME agents for specialized analysis (architecture, validation, security, QA)
3. **Synthesize:** Combine agent findings into one execution plan
4. **Implement:** Execute targeted code generation via orchestrator coordination
5. **Verify:** Run build, tests, security checks
6. **Sync:** Update memory and task tracking

**Why:** Specialized agents provide better analysis than generalist reasoning. This reduces rework and catches issues early.

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for the full orchestrator contract and required delegation sequences.

---

## Super Powers Workflow (Large Features)

For features requiring 2+ hours of work, use the **Super Powers pattern**:

**1. Brainstorm** (extended thinking)
   - Explore scope, user stories, architecture, edge cases
   - Output: Spec document (500–1000 words)

**2. Plan** (Context7 docs + sequential reasoning)
   - Design component hierarchy, API surface, test structure
   - Output: Implementation roadmap

**3. Execute** (subagent orchestration + TDD)
   - Generate tests first (unit + integration + edge cases)
   - Generate implementation code to make tests pass
   - Generate docs

**4. Verify** (auto-review)
   - Check code against spec
   - Verify tests pass
   - Validate types and build

**Token Savings:** 60–70% reduction vs. baseline (3,000–5,000 tokens vs. 8,000 baseline).

See [.claude/skills/code-generation/SKILL.md](.claude/skills/code-generation/SKILL.md) for detailed steps.

---

## When to Use Skills

The `.claude/skills/` directory contains reusable workflows. Key skills:

| Skill | When to Use |
|-------|-----------|
| **planning** | Break goals into tasks, create roadmaps, define milestones |
| **code-generation** | Build features (Super Powers), refactor, debug, write tests |
| **knowledge-memory** | Capture learnings, update memory, preserve context |
| **mcp-automation** | Orchestrate multi-step workflows, integrate external APIs |
| **skill-builder** | Audit, create, optimize, or evaluate skills |

See `.claude/reference/SKILLS.md` for the full registry.

---

## Commands

```bash
# Setup
pnpm install                    # Install dependencies

# Development
pnpm dev                        # Start dev server (localhost:3000)
pnpm typecheck                  # Check TypeScript
pnpm build                      # Production build
pnpm test                       # Run tests

# Project inspection
pnpm run status:next-docs       # Check available Next.js docs

# Git
git log --oneline -10           # Recent commits
git status                      # Current state
git branch -a                   # All branches
```

---

## Support & Feedback

- **Help with Claude Code:** `/help`
- **Report Issues:** https://github.com/anthropics/claude-code/issues
- **Update This File:** Edit and commit changes to `CLAUDE.md`

---

## Last Updated

**2026-04-15** — Comprehensive orchestrator-driven CLAUDE.md (reformatted from AGENTS.md)
