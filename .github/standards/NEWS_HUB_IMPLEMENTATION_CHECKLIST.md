# News Hub Implementation Checklist

**Purpose:** Step-by-step validation that a new article type meets all standards.

**How to Use:**

1. Copy this checklist when starting a new article type
2. Check items as you complete them
3. Final verification scan before merging PR
4. Attach as PR description

---

## Phase 0: Planning

- [ ] Article type name decided (`case-study`, `press-release`, `whitepaper`, etc.)
- [ ] Type-specific fields documented (beyond base Article fields)
- [ ] Example content/data prepared
- [ ] Stakeholder approval obtained

---

## Phase 1: Data Layer (Schema → Helpers)

### 1.1 Schema Definition

- [ ] File created: `data/news/<type>/schema.ts`
- [ ] Base fields included: `id`, `type`, `title`, `slug`, `excerpt`, `imageUrl`, `publishedDate`, `content`
- [ ] Type-specific fields added (e.g., `clientName` for case studies)
- [ ] All fields have appropriate Zod validators
- [ ] `featured` field defaults to `false`
- [ ] `readingTime` calculated or provided (default: 5)
- [ ] `tags` array provided (default: empty array)
- [ ] Type discriminator is literal: `z.literal('<type-name>')`
- [ ] Schema exports correctly

**Verification:**

```bash
cd data/news/<type>
cat schema.ts | grep "z.literal"  # Verify discriminator
```

### 1.2 Type Inference

- [ ] File created: `data/news/<type>/types.ts`
- [ ] Type inferred from schema: `type <Type> = z.infer<typeof <Type>Schema>`
- [ ] No manual interface definitions (schema is source of truth)
- [ ] Exports correctly

### 1.3 Sample Data

- [ ] File created: `data/news/<type>/data.ts`
- [ ] At least 1 valid sample article (required for tests)
- [ ] At least 1 "featured" article for homepage testing
- [ ] All fields populated according to schema
- [ ] Slugs are valid: `[a-z0-9-]+`
- [ ] No placeholder URLs (real or valid relative paths)

**Verification:**

```typescript
// Quick test
import { <Type>Schema } from './schema';
import { <TYPE>_DATA } from './data';
<TYPE>_DATA.forEach(d => <Type>Schema.parse(d)); // Should not throw
```

### 1.4 Helper Functions

- [ ] File created: `data/news/<type>/helpers.ts`
- [ ] Function: `get<Type>BySlug(slug: string): Promise<<Type> | null>`
- [ ] Function: `get<Type>Featured(limit?): Promise<<Type>[]>`
- [ ] Function: `getAll<Type>s(tag?): Promise<<Type>[]>`
- [ ] Function: `getRelated<Type>s(<type>: <Type>, limit?): Promise<<Type>[]>`
- [ ] All helpers include try-catch with logging
- [ ] Zod schema validation happens in each helper
- [ ] Return types are correct (null vs empty array)
- [ ] Functions handle edge cases (empty results, invalid data)

**Verification:**

```typescript
// Test each helper
import * as helpers from "./helpers";
const cs = (await helpers.get) < Type > BySlug("sample-slug");
const featured = (await helpers.get) < Type > Featured();
const all = (await helpers.getAll) < Type > s();
```

### 1.5 Folder index.ts

- [ ] File created: `data/news/<type>/index.ts`
- [ ] All helpers re-exported
- [ ] Types re-exported
- [ ] Schema re-exported

```typescript
// Example structure
export type { <Type> } from './types';
export { <Type>Schema } from './schema';
export { get<Type>BySlug, get<Type>Featured, getAll<Type>s, getRelated<Type>s } from './helpers';
```

### 1.6 Root Aggregation

- [ ] Updated: `data/news/index.ts`
- [ ] Folder exports imported
- [ ] Added to aggregate `Article` type union
- [ ] Type guard created in `type-guards.ts`

---

## Phase 2: Components

### 2.1 Card Component

- [ ] File created: `components/news-hub/<type>/<type>-card.tsx`
- [ ] Props interface defined: `interface <Type>CardProps { <type>: <Type>; variant?: ...; className?: string; }`
- [ ] Component is Server Component (no `'use client'` unless necessary)
- [ ] JSDoc comment block included
- [ ] Image uses `ArticleHeroImage` component
- [ ] Badge clearly identifies type
- [ ] Uses `ArticleMetadata` for date/author/readingTime
- [ ] Excerpt truncated with `line-clamp-2`
- [ ] CTA link to detail page correct
- [ ] Link href: `/news-hub/<type-name>/<slug>` format
- [ ] Styling consistent: colors, spacing, hover effects
- [ ] Responsive: works on mobile (sm:), tablet (md:), desktop (lg:)
- [ ] Type exported with props interface

**Code Pattern:**

```typescript
export function <Type>Card(props: <Type>CardProps) {
  const { <type>, variant = 'full', className } = props;
  // Use cn() for conditional classes
  // Use ArticleHeroImage, ArticleMetadata
  // Render badge with type name
  // Link to /news-hub/<type-name>/{<type>.slug}
}
```

### 2.2 Hero Component

- [ ] File created: `components/news-hub/<type>/<type>-hero.tsx`
- [ ] Props interface defined: `interface <Type>HeroProps { <type>: <Type>; showBreadcrumb?: boolean; }`
- [ ] Component is Server Component
- [ ] JSDoc comment block included
- [ ] Background image uses `ArticleHeroImage` with `priority={true}`
- [ ] Overlay gradient applied (dark gradient for text readability)
- [ ] Breadcrumb navigation present (if `showBreadcrumb` = true)
- [ ] Badge clearly identifies type
- [ ] Title (h1) displayed prominently
- [ ] Type-specific metadata shown (e.g., client name for case studies)
- [ ] Excerpt/summary paragraph included
- [ ] Mobile responsive
- [ ] Proper semantic HTML

**Code Pattern:**

```typescript
export function <Type>Hero(props: <Type>HeroProps) {
  const { <type>, showBreadcrumb } = props;
  // ArticleHeroImage with priority={true}
  // Overlay div with gradient (bg-gradient-to-r)
  // Relative z-10 content div for text
  // Breadcrumb nav if showBreadcrumb
  // Type badge
  // h1 for title
  // Type-specific fields (client, location, etc.)
  // Excerpt paragraph
}
```

### 2.3 Detail Layout Component

- [ ] File created: `components/news-hub/<type>/<type>-detail-layout.tsx`
- [ ] Props interface: `interface <Type>DetailLayoutProps { <type>: <Type>; related<Type>s: <Type>[]; }`
- [ ] Component is Server Component
- [ ] JSDoc comment block included
- [ ] Renders `<Type>Hero` component
- [ ] Renders `<Type>Content` component (or renders content directly)
- [ ] Horizontal divider between sections
- [ ] "Related <Types>" section if related articles exist
- [ ] Related articles rendered using `ArticleCardFactory` or cards
- [ ] Proper semantic HTML structure
- [ ] Max-width container for readability

**Code Pattern:**

```typescript
export function <Type>DetailLayout(props: <Type>DetailLayoutProps) {
  const { <type>, related<Type>s } = props;
  return (
    <div>
      <<Type>Hero <type>={<type>} />
      <main className="container mx-auto">
        <article>
          // Content here
        </article>
        {related<Type>s.length > 0 && (
          <section>
            <h2>Related <Type>s</h2>
            // Render related
          </section>
        )}
      </main>
    </div>
  );
}
```

### 2.4 Folder index.ts

- [ ] File created: `components/news-hub/<type>/index.ts`
- [ ] Main components exported (Card, Hero, DetailLayout)
- [ ] Prop interfaces exported
- [ ] No wildcard exports

```typescript
export { <Type>Card } from './<type>-card';
export { <Type>Hero } from './<type>-hero';
export { <Type>DetailLayout } from './<type>-detail-layout';

export type { <Type>CardProps } from './<type>-card';
export type { <Type>HeroProps } from './<type>-hero';
export type { <Type>DetailLayoutProps } from './<type>-detail-layout';
```

### 2.5 Factory Pattern Integration

- [ ] Updated: `components/news-hub/shared/factory/article-card-factory.tsx`
- [ ] Import added for new Card component
- [ ] Case added in switch statement
- [ ] Exhaustiveness check still present (const \_: never = ...)
- [ ] Returns correct component with correct prop destructuring

```typescript
case '<type-name>':
  return <<Type>Card <type>={article} className={className} />;
```

---

## Phase 3: Routing

### 3.1 Route File Structure

- [ ] Directory created: `app/news-hub/<type-name>/` (note: pluralize if needed)
- [ ] Directory created: `app/news-hub/<type-name>/[slug]/`
- [ ] Main page file: `app/news-hub/<type-name>/[slug]/page.tsx`
- [ ] Layout file (optional): `app/news-hub/<type-name>/[slug]/layout.tsx`
- [ ] Not-found file (optional): `app/news-hub/<type-name>/[slug]/not-found.tsx`

### 3.2 Detail Page (page.tsx)

- [ ] Correct file path: `app/news-hub/<type-name>/[slug]/page.tsx`
- [ ] Props interface includes `params: Promise<{ slug: string }>`
- [ ] Await params: `const params = await props.params`
- [ ] Validate slug before fetching: check type and length
- [ ] Fetch article: `await get<Type>BySlug(slug)`
- [ ] Handle not found: call `notFound()` if `null`
- [ ] Fetch related articles: `await getRelated<Type>s(<type>)`
- [ ] Component rendered: `<<Type>DetailLayout />`
- [ ] `generateStaticParams()` implemented
- [ ] All articles from `getAll<Type>s()` returned
- [ ] `revalidate` set to 3600 (1 hour)
- [ ] `dynamicParams = true` set
- [ ] `generateMetadata()` implemented
- [ ] Metadata title, description set
- [ ] OpenGraph metadata included
- [ ] Canonical URL set correctly

**Code Template:**

```typescript
// app/news-hub/<type-name>/[slug]/page.tsx

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { get<Type>BySlug, getAll<Type>s, getRelated<Type>s } from '@/data/news';
import { <Type>DetailLayout } from '@/components/news-hub/<type-name>';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await getAll<Type>s();
  return items.map(item => ({ slug: item.slug }));
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const item = await get<Type>BySlug(p.slug);
  if (!item) return { title: 'Not Found' };

  return {
    title: item.title,
    description: item.seoDescription || item.excerpt,
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  if (!p.slug || typeof p.slug !== 'string') notFound();

  const item = await get<Type>BySlug(p.slug);
  if (!item) notFound();

  const related = await getRelated<Type>s(item, 3);

  return <<Type>DetailLayout <type>={item} related<Type>s={related} />;
}
```

### 3.3 Metadata & SEO

- [ ] `generateMetadata()` returns full Metadata object
- [ ] `title` set to article title
- [ ] `description` set to excerpt (or seoDescription field)
- [ ] `keywords` set from tags
- [ ] `canonical` URL includes full domain
- [ ] `openGraph.type` set to 'article'
- [ ] `openGraph.images` includes imageUrl with dimensions
- [ ] `twitter.card` set to 'summary_large_image'
- [ ] `robots.index` set correctly (true for live articles)

### 3.4 URL Validation

- [ ] Slug format validated: `[a-z0-9-]+` regex
- [ ] Slug length checked: 3-80 characters
- [ ] Slug case-sensitive comparison (lowercase)
- [ ] Invalid slugs return 404

---

## Phase 4: Tests

### 4.1 Component Tests

- [ ] Test file created: `components/news-hub/<type>/__tests__/<type>-card.spec.ts`
- [ ] Mock data object created matching <Type> schema
- [ ] Test: component renders without errors
- [ ] Test: snapshot test passes
- [ ] Test: title text present
- [ ] Test: type badge present
- [ ] Test: link href correct
- [ ] All variants tested (if applicable)
- [ ] Tests import from correct paths

**Example Structure:**

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { <Type>Card } from '../<type>-card';
import type { <Type> } from '@/data/news';

describe('<Type>Card', () => {
  it('renders without errors', () => {
    const { container } = render(<<Type>Card <type>={mock<Type>} />);
    expect(container).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<<Type>Card <type>={mock<Type>} />);
    expect(container).toMatchSnapshot();
  });

  it('displays title', () => {
    const { getByText } = render(<<Type>Card <type>={mock<Type>} />);
    expect(getByText(mock<Type>.title)).toBeInTheDocument();
  });

  it('has correct link', () => {
    const { getByRole } = render(<<Type>Card <type>={mock<Type>} />);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', `/news-hub/<type-name>/${mock<Type>.slug}`);
  });
});
```

### 4.2 Factory Tests

- [ ] Test: Factory renders correct card for type
- [ ] Test: Unknown type returns error component
- [ ] Test: All types handled in factory

### 4.3 Data Helper Tests

- [ ] Test: `get<Type>BySlug` returns article for valid slug
- [ ] Test: `get<Type>BySlug` returns null for invalid slug
- [ ] Test: Schema validation happens
- [ ] Test: `get<Type>Featured` returns only featured
- [ ] Test: Featured sorted by date descending
- [ ] Test: `getAll<Type>s()` returns all

### 4.4 E2E Tests

- [ ] Test: Route loads without error
- [ ] Test: Detail page displays title
- [ ] Test: Navigation to related article works
- [ ] Test: 404 for invalid slug
- [ ] Test: Metadata visible in HTML

---

## Phase 5: Validation & Verification

### 5.1 TypeScript Compilation

- [ ] Run: `pnpm build`
- [ ] ✓ No TypeScript errors
- [ ] ✓ No ESLint errors
- [ ] ✓ Discriminated union type checks pass

**Verification:**

```bash
pnpm build 2>&1 | grep -i "error"  # Should be empty
```

### 5.2 Static Generation

- [ ] Build log shows articles prerendered
- [ ] Output includes: `✓ Prerendering X <type>s`
- [ ] All slugs from `getAll<Type>s()` included
- [ ] Prerendering time is reasonable (< 5s for standard load)

**Verification:**

```bash
pnpm build 2>&1 | grep -i "prerender"
pnpm build 2>&1 | grep -i "<type-name>"
```

### 5.3 Route Testing

- [ ] Local dev server started: `pnpm dev`
- [ ] Route accessible: `http://localhost:3000/news-hub/<type-name>/sample-slug`
- [ ] Page loads without errors
- [ ] Title displays correctly
- [ ] Images load
- [ ] Links work
- [ ] 404 shows for invalid slug

**Manual Testing:**

```
1. Navigate to detail page
2. Check DevTools Console (no red errors)
3. Check Page Source (metadata tags present)
4. Test link to related article
5. Go back (browser back button works)
```

### 5.4 Hub List Page

- [ ] Route `/news-hub` loads
- [ ] Article card(s) from new type display
- [ ] Card uses correct type badge
- [ ] Card link correct
- [ ] Featured articles show correctly

### 5.5 SEO & Metadata

- [ ] Browser DevTools → Head: `<title>` correct
- [ ] Browser DevTools → Head: `<meta name="description">` present
- [ ] Browser DevTools → Head: `<link rel="canonical">` present
- [ ] Open Graph tags present - run og-image-preview
- [ ] robots.txt allows indexing
- [ ] structuredData valid - use JSON-LD Validator

**Check Metadata:**

```bash
curl http://localhost:3000/news-hub/<type-name>/sample-slug 2>/dev/null | grep -E "<title>|meta name=\"description\"|og:image|canonical"
```

### 5.6 Performance

- [ ] Lighthouse Score > 80 for Performance
- [ ] Lighthouse Score > 90 for SEO
- [ ] Lighthouse Score > 95 for Accessibility
- [ ] First Contentful Paint < 2s
- [ ] No console errors in DevTools
- [ ] Images optimized (WebP format loaded)

**Run Lighthouse:**

```bash
# In Chrome DevTools:
1. F12 → Lighthouse tab
2. Generate report for Performance, SEO, Accessibility
3. Check scores and fix any warnings
```

### 5.7 Accessibility

- [ ] All images have alt text
- [ ] Color contrast ≥ 4.5:1 verified (DevTools or online tool)
- [ ] Heading hierarchy correct (h1, h2, h3 - no skips)
- [ ] Links have descriptive text (not "click here")
- [ ] Interactive elements keyboard accessible
- [ ] Focus visible on keyboard nav
- [ ] Screen reader tested (NVDA or JAWS)

**Quick A11y Check:**

```bash
# Axe DevTools Chrome extension, or:
# npm install -g axe-cli
# axe http://localhost:3000/news-hub/<type-name>/sample-slug
```

### 5.8 Mobile Responsiveness

- [ ] DevTools Mobile view (iPhone 375px)
- [ ] Text readable without zoom
- [ ] Images scale correctly
- [ ] Touch targets adequate (≥44px)
- [ ] No horizontal scroll
- [ ] DevTools Tablet view (iPad 768px)
- [ ] Desktop view (1920px) - full-width content OK

---

## Phase 6: Code Quality

### 6.1 Linting

- [ ] Run: `pnpm lint`
- [ ] ✓ No errors
- [ ] ✓ No warnings (or documented exceptions)
- [ ] Consistent naming throughout

### 6.2 Code Review Standards

- [ ] All files follow naming conventions
- [ ] Components have JSDoc comments
- [ ] Props interfaces defined and exported
- [ ] No `any` types
- [ ] Error handling present (try-catch in data helpers)
- [ ] No console.log() statements (use console.error/warn)
- [ ] Imports organized: external → internal → types
- [ ] No unused variables or imports

### 6.3 Documentation

- [ ] README created: `components/news-hub/<type>/README.md`
- [ ] Lists all components and their purpose
- [ ] Includes example usage
- [ ] Links to implementation standards
- [ ] JSDoc complete on all public functions
- [ ] Type definitions documented

---

## Phase 7: Deployment Preparation

### 7.1 Commit & Push

- [ ] All files staged: `git add .`
- [ ] Commit message clear: `feat(news-hub): add <Type> article type support`
- [ ] Branch name: `feat/news-hub-<type-name>`
- [ ] Pushed to GitHub: `git push origin feat/news-hub-<type-name>`

### 7.2 Pull Request

- [ ] PR title: `feat(news-hub): add <Type> article type support`
- [ ] PR description includes:
  - [ ] Overview of changes
  - [ ] Files modified (list main files)
  - [ ] Testing instructions
  - [ ] Screenshots of new article page
  - [ ] Link to this checklist (mark items complete)
  - [ ] Related ADRs/Standards docs reference

### 7.3 CI Verification

- [ ] GitHub Actions pass:
  - [ ] Lint check ✓
  - [ ] TypeScript compilation ✓
  - [ ] Build ✓
  - [ ] Tests (if applicable) ✓
- [ ] Deploy preview generated (Vercel)
- [ ] Preview URL accessible

### 7.4 Code Review

- [ ] PR reviewed by ≥1 team member
- [ ] Feedback addressed
- [ ] All review comments resolved
- [ ] Approved by reviewer

### 7.5 Final Verification Pre-Merge

- [ ] `pnpm build` succeeds locally
- [ ] All routes tested in production preview
- [ ] Metadata tags correct in preview
- [ ] No console errors in preview
- [ ] Ready for merge ✓

---

## Final Sign-Off

| Item          | Status     | Notes                             |
| ------------- | ---------- | --------------------------------- |
| Data Layer    | ✓ Complete | schema, types, helpers, data      |
| Components    | ✓ Complete | card, hero, detail layout         |
| Routing       | ✓ Complete | page.tsx, metadata, static params |
| Tests         | ✓ Complete | component & E2E tests pass        |
| SEO/Metadata  | ✓ Complete | title, description, OG tags       |
| Performance   | ✓ Complete | Lighthouse > 80                   |
| Accessibility | ✓ Complete | WCAG 2.1 AA compliant             |
| Code Quality  | ✓ Complete | lint, types, naming               |
| Documentation | ✓ Complete | README, JSDoc, standards          |
| Deployment    | ✓ Ready    | PR reviewed, CI passing           |

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-03-30  
**Print & Use:** Download and use as PR checklist
