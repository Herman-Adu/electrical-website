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
