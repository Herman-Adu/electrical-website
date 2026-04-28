# Naming Conventions (Cheatsheet)
> Full reference: `.claude/rules/archives/naming-conventions-full.md`

| Type | Convention | Example |
|------|-----------|---------|
| Files / Directories | `kebab-case` | `form-input.tsx`, `use-mobile.ts` |
| React Components | `PascalCase` | `FormInput`, `NavBar` |
| Functions / Variables / Hooks | `camelCase` | `calculateCost`, `useFormState` |
| Immutable Constants | `SCREAMING_SNAKE` | `MAX_RETRIES` |
| Booleans | `is/has/can/should` prefix | `isLoading`, `hasError` |
| Event Handlers | `handle/on` prefix | `handleClick`, `onSelect` |
| Server Actions | `kebab-case` file, `camelCase` export | `submit-form.ts` → `submitForm()` |
| Zod Schemas / Interfaces | `PascalCase` | `ProjectSchema`, `ProjectCard` |
| Docker entities | `kebab-case` + type prefix | `feat-hero-refactor`, `learn-gpu-compositing` |

Docker entity prefixes: `feat-` `learn-` `decide-` `infra-` `session-` `task-` `plan-`
Session format: `session-YYYY-MM-DD-seq` (e.g. `session-2026-04-28-001`)
