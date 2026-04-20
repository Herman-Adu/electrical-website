# Naming Conventions

This file documents the naming standards for this project. Apply these conventions consistently across all code and files.

## File & Directory Names

**Standard:** `kebab-case`

- **React Components:** `form-input.tsx`, `navbar.tsx`, `project-card-shell.tsx`
- **Utilities/Hooks:** `use-schematic-animation.ts`, `use-mobile.ts`
- **Server Actions:** `submit-contact-form.ts`, `fetch-projects-data.ts`
- **Types/Schemas:** `user-schema.ts`, `project-types.ts`
- **Styles/CSS:** `global-styles.css`, `theme-variables.css`

**Directories:** `kebab-case`

```
components/
├── ui/                    # Reusable UI primitives
├── atoms/                 # Single-responsibility components (form-input, button)
├── molecules/             # Composite components (navbar, header)
├── sections/              # Page sections (hero, footer, cta)
├── navigation/            # Navigation-specific components
├── services/              # Service/domain-specific components
├── news-hub/              # Feature-specific components
├── projects/              # Feature-specific components
└── shared/                # Truly shared utilities (icon-map, section-features)
```

## Code Identifiers

### React Components

**Standard:** `PascalCase`

- Function components: `FormInput`, `NavBar`, `ProjectCardShell`
- Exported from `form-input.tsx`: named export `FormInput`
- Props interfaces: `FormInputProps`, `NavBarProps`

```typescript
// file: components/atoms/form-input.tsx
export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function FormInput({ label, value, onChange }: FormInputProps) {
  // ...
}
```

### Functions & Variables (Non-Components)

**Standard:** `camelCase`

- **Functions:** `calculateProjectCost`, `formatDateString`, `validateEmail`
- **Variables:** `isLoading`, `projectCount`, `userPreferences`
- **Constants:** `MAX_RETRIES`, `DEFAULT_TIMEOUT` (SCREAMING_SNAKE_CASE if truly immutable)
- **Hooks:** `useFormState`, `useProjectData`, `usePaginationControls`

```typescript
// Utilities
export const formatProjectDate = (date: Date) => { /* ... */ };
export const projectStatusMap = { active: 'Active', archived: 'Archived' };

// Hooks
export function useSchematicAnimation() { /* ... */ }
export function useMobileBreakpoint() { /* ... */ }
```

### Server Actions & API Routes

**Standard:** `kebab-case` for files, `camelCase` for function exports

```typescript
// file: app/actions/submit-contact-form.ts
'use server';

export async function submitContactForm(formData: FormData) {
  // ...
}

// file: app/api/projects/route.ts
export async function GET(request: Request) {
  // ...
}
```

### Types & Interfaces

**Standard:** `PascalCase` with `Type` or `Props` suffix if needed

```typescript
// Interfaces
export interface ProjectCard {
  id: string;
  title: string;
  category: string;
}

// Type aliases
export type ProjectStatus = 'active' | 'archived' | 'draft';
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };

// Props interfaces (component-specific)
export interface ProjectCardProps extends ProjectCard {
  onSelect?: (id: string) => void;
}
```

### Database/Schema Names

**Standard:** `snake_case` for tables, columns; `PascalCase` for Zod schemas

```typescript
// Database tables/columns (in migrations or comments)
// Table: projects
// Columns: project_id, project_name, created_at, updated_at

// Zod schemas
export const ProjectSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string().min(1),
  createdAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

## Special Cases

### Boolean Variables

Prefix with `is`, `has`, `can`, `should`, `will`, `did`:

```typescript
const isLoading = false;
const hasError = true;
const canDelete = user.role === 'admin';
const shouldRender = !isLoading && data !== null;
```

### Private/Internal Functions

Prefix with underscore (for truly internal functions):

```typescript
// Only use for internal utilities that should not be exported
const _calculateTax = (amount: number) => { /* ... */ };

// Prefer marking as internal via comment or JSDoc instead
/**
 * @internal - Do not export or use outside this module
 */
export function internalUtility() { }
```

### Event Handlers

Prefix with `on` followed by action name:

```typescript
const handleClick = () => { /* ... */ };
const handleFormSubmit = (e: React.FormEvent) => { /* ... */ };
const onProjectSelect = (projectId: string) => { /* ... */ };
```

## Docker Entity Names

Docker memory entities follow a strict naming scheme to ensure discoverability and consistency.

### Entity Type Prefixes (Required)

| Entity Type | Prefix | Purpose | Example |
|-------------|--------|---------|---------|
| `project_state` | (none) | Single project state entity | `electrical-website-state` |
| `feature` | `feat-` | Completed/in-progress work units | `feat-phase-5-animation-optimization` |
| `learning` | `learn-` | Technical patterns and insights | `learn-gpu-transform-compositing` |
| `decision` | `decide-` | Architectural choices with rationale | `decide-memory-docker-over-files` |
| `infrastructure` | `infra-` | Docker services, MCP tools, CI/CD | `infra-mcp-docker-services` |
| `session` | `session-` | Work session summaries with timestamps | `session-2026-04-16-001` |
| `task` | `task-` | Atomic work items with status | `task-animation-optimize-hero` |
| `plan` | `plan-` | Implementation roadmaps with phases | `plan-phase-6-feature-roadmap` |

### Naming Rules (Mandatory)

1. **Casing:** `kebab-case` only — lowercase, hyphens as separators, NO underscores or spaces
2. **Type Prefix:** Always include the prefix above (except `project_state`)
3. **Specificity:** Be specific enough to find via substring search
   - ❌ Bad: `learn-bug`, `feat-fix`, `decide-standard`
   - ✅ Good: `learn-scroll-trigger-ios-timing`, `feat-hero-parallax-refactor`, `decide-animation-library-choice`
4. **Dates (for sessions only):** Use `YYYY-MM-DD-seq` format: `session-2026-04-16-001`, `session-2026-04-16-002`
5. **Uniqueness:** Search Docker before creating to avoid duplicates

### Valid Examples

```
electrical-website-state
feat-phase-5-animation-optimization
learn-gpu-transform-compositing
decide-memory-docker-over-files
infra-mcp-docker-services
session-2026-04-16-001
task-animation-optimize-hero
plan-phase-6-feature-roadmap
```

### Invalid Examples (Never Use)

```
ProjectState                    ← not kebab-case
feature_phase5                  ← uses underscore, not hyphen
learning                        ← too generic, unsearchable
Decision123                     ← unnecessary numbers
session_2026_04_16             ← should use hyphens, not underscores
feat phase 5 animation          ← spaces not allowed
```

### Validation Checklist

- [ ] Entity name starts with correct type prefix (or is `project_state`)
- [ ] Uses `kebab-case` throughout (lowercase + hyphens only)
- [ ] No spaces, underscores, uppercase, or special characters
- [ ] Specific enough to find via partial search
- [ ] Searched Docker first to verify no duplicate
- [ ] If session entity: uses `session-YYYY-MM-DD-seq` format exactly

---

## Checklist for Code Review

- [ ] File names are `kebab-case`
- [ ] Directories are `kebab-case`
- [ ] React components are `PascalCase`
- [ ] Functions/utilities/hooks are `camelCase`
- [ ] Types/interfaces are `PascalCase`
- [ ] Boolean variables have `is`, `has`, `can`, `should` prefix
- [ ] Event handlers start with `on` or `handle`
- [ ] No inconsistent casing (mixed `camelCase` and `PascalCase` in same context)

## Notes

- This project uses **TypeScript strict mode** — naming clarity is enforced by the compiler
- Use meaningful names (avoid single-letter variables except in loops: `for (const i of items)`)
- Descriptive names reduce documentation overhead

---

**Last Updated:** 2026-04-15  
**Status:** Ready for adoption
