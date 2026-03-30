# News Hub Quick Reference

**Quick implementation checklist when adding a new article type or feature.**

---

## Adding a New Article Type

### Step 1: Define Schema & Types (30 min)

```bash
# Create type structure
mkdir -p data/news/<type-name>
```

```typescript
// data/news/<type-name>/schema.ts
import { z } from 'zod';

export const <Type>Schema = z.object({
  id: z.string(),
  type: z.literal('<type-name>'),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(50).max(300),
  imageUrl: z.string().url(),
  publishedDate: z.string().datetime(),
  content: z.string().min(100),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5),
  tags: z.array(z.string()).default([]),
  // Type-specific fields here
});

export type <Type> = z.infer<typeof <Type>Schema>;
```

### Step 2: Create Data Helpers (15 min)

```typescript
// data/news/<type-name>/helpers.ts
import { <Type>Schema } from './schema';
import type { <Type> } from './types';

export async function get<Type>BySlug(slug: string): Promise<<Type> | null> {
  const raw = <TYPE>_DATA.find(t => t.slug === slug);
  if (!raw) return null;
  try { return <Type>Schema.parse(raw); } catch (e) { console.error(e); return null; }
}

export async function get<Type>Featured(limit = 3): Promise<<Type>[]> {
  return <TYPE>_DATA.filter(t => t.featured)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit)
    .map(raw => <Type>Schema.safeParse(raw).data)
    .filter((t): t is <Type> => t !== null);
}

export async function getAll<Type>s(tag?: string): Promise<<Type>[]> {
  return <TYPE>_DATA.filter(t => !tag || t.tags.includes(tag))
    .map(raw => <Type>Schema.safeParse(raw).data)
    .filter((t): t is <Type> => t !== null);
}
```

### Step 3: Create Components (45 min)

```bash
mkdir -p components/news-hub/<type-name>
```

Create three files:

1. **Card component** (`<type-name>-card.tsx`)
   - Layout: image/badge/metadata/title/excerpt/link
   - Props: the type object + variants

2. **Hero component** (`<type-name>-hero.tsx`)
   - Server component
   - Use ArticleHeroImage for image
   - Type-specific metadata

3. **Detail layout** (`<type-name>-detail-layout.tsx`)
   - Orchestrates hero + content + related
   - Server component

**Export from index.ts:**

```typescript
export { <Type>Card } from './<type-name>-card';
export { <Type>Hero } from './<type-name>-hero';
export { <Type>DetailLayout } from './<type-name>-detail-layout';
```

### Step 4: Register in Factory (5 min)

```typescript
// components/news-hub/shared/factory/article-card-factory.tsx
case '<type-name>':
  return <<Type>Card <type-name>={article} className={className} />;
```

### Step 5: Create Routes (20 min)

```
app/news-hub/<type-name>/
├── page.tsx              # Optional: list page
├── layout.tsx
└── [slug]/
    ├── page.tsx          # generateStaticParams + metadata
    ├── layout.tsx
    └── not-found.tsx
```

Boilerplate for page.tsx:

```typescript
import { notFound } from 'next/navigation';
import { get<Type>BySlug, getRelated<Type>s } from '@/data/news';
import { <Type>DetailLayout } from '@/components/news-hub/<type-name>';

export async function generateStaticParams() {
  const items = await getAll<Type>s();
  return items.map(t => ({ slug: t.slug }));
}

export const revalidate = 3600; // ISR: 1 hour
export const dynamicParams = true;

export async function generateMetadata({ params }: Props) {
  const params_await = await params;
  const item = await get<Type>BySlug(params_await.slug);
  if (!item) return { title: 'Not Found' };
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: { title: item.title, description: item.excerpt, type: 'article' },
  };
}

export default async function Page({ params }: Props) {
  const params_await = await params;
  const item = await get<Type>BySlug(params_await.slug);
  if (!item) notFound();
  const related = await getRelated<Type>s(item);
  return <<Type>DetailLayout item={item} related={related} />;
}
```

### Step 6: Update Aggregation Exports (2 min)

```typescript
// data/news/index.ts
export { get<Type>BySlug, getAll<Type>s, getRelated<Type>s } from './<type-name>/helpers';
export type { <Type> } from './<type-name>/types';
export { <Type>Schema } from './<type-name>/schema';
```

```typescript
// types/news.ts
export type Article = CaseStudy | PressRelease | Whitepaper | <Type>;
```

### Step 7: Tests & Verification (30 min)

Create snapshot tests:

```typescript
// components/news-hub/<type-name>/__tests__/<type-name>-card.spec.ts
import { render } from '@testing-library/react';
import { <Type>Card } from '../<type-name>-card';

const mock<Type> = { /* ... */ };

describe('<Type>Card', () => {
  it('renders', () => {
    const { container } = render(<<Type>Card <type-name>={mock<Type>} />);
    expect(container).toMatchSnapshot();
  });
});
```

Run build & verify prerendering:

```bash
pnpm build
# Check: "✓ Prerendering X <type>s"
```

---

## Naming Patterns Quick Reference

| What          | Pattern                        | Example                                          |
| ------------- | ------------------------------ | ------------------------------------------------ |
| Component     | `<Type><Purpose>`              | `CaseStudyCard`, `PressReleaseHero`              |
| Data helper   | `get<Type><Modifier>()`        | `getCaseStudyBySlug()`, `getCaseStudyFeatured()` |
| Type          | `<Type>`                       | `CaseStudy`, `PressRelease`                      |
| Schema        | `<Type>Schema`                 | `CaseStudySchema`                                |
| Type guard    | `is<Type>()`                   | `isCaseStudy()`                                  |
| Route         | `/news-hub/<type-name>/[slug]` | `/news-hub/case-studies/example-slug`            |
| Discriminator | lowerce-hyphen                 | `'case-study'`, `'press-release'`                |

---

## Checklist: Adding New Article Type

- [ ] Schema defined in `data/news/<type>/schema.ts`
- [ ] Types inferred: `data/news/<type>/types.ts`
- [ ] Helpers created: `get<Type>BySlug`, `getAll<Type>s`, `getRelated<Type>s`
- [ ] Data file created: `data/news/<type>/data.ts` (at least 1 article)
- [ ] Exports aggregated in `data/news/index.ts`
- [ ] Card component: `components/news-hub/<type>/<type>-card.tsx`
- [ ] Hero component: `components/news-hub/<type>/<type>-hero.tsx`
- [ ] Detail layout: `components/news-hub/<type>/<type>-detail-layout.tsx`
- [ ] Components exported from `components/news-hub/<type>/index.ts`
- [ ] Factory updated: switch case added in `ArticleCardFactory`
- [ ] Type union updated: `Article | <Type>` in `types/news.ts`
- [ ] Routes created: `app/news-hub/<type-name>/[slug]/page.tsx`
- [ ] Metadata generation: `generateMetadata()` in page
- [ ] Static params: `generateStaticParams()` in page
- [ ] Component tests: `.spec.ts` file created
- [ ] Build succeeds: `pnpm build`
- [ ] Routes verified: navigate to `/news-hub/<type-name>/example`
- [ ] All routes return 404 for unknown slugs: `notFound()` called

---

## Common Patterns

### Use Factory for Lists

```typescript
// ✅ render mixed article types
{articles.map(a => <ArticleCardFactory key={a.id} article={a} />)}
```

### Type-Specific Component

```typescript
// ✅ Single type use
{caseStudy && <CaseStudyCard caseStudy={caseStudy} />}
```

### Type Narrowing

```typescript
// ✅ TypeScript guarantees type after switch
if (article.type === "case-study") {
  // Now article is CaseStudy, not Article
  client = article.clientName; // ✓ OK
}
```

### Server Components by Default

```typescript
// ✅ No "use client" needed
export function CaseStudyDetailLayout({ caseStudy }: Props) {
  // Can use async/await, data fetching
  return <div>...</div>;
}
```

### "use client" Only for Interactivity

```typescript
// ✅ Use client only for the carousel
"use client";

export function CaseStudyCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  // Interactive logic
}
```

---

## Validation Quick Rules

- **Always validate with Zod** - never skip schema checking
- **Log errors** - don't silently return null without logging
- **Search params** - validate with schema before use
- **Type guards** - create per type, use for narrowing
- **No `any`** - use `unknown` with type narrowing instead

---

## Performance Checklist

- [ ] `revalidate` set on detail pages (3600s)
- [ ] `dynamicParams = true` for new slugs
- [ ] `generateStaticParams()` implemented
- [ ] Images use `<Image>` with `fill` + `sizes`
- [ ] `priority={true}` ONLY on hero images
- [ ] No client-side data fetching in layouts
- [ ] Related articles limited to 3 items

---

## Deployment Checklist

- [ ] All routes render without errors: `pnpm build`
- [ ] All articles prerendered: check build log
- [ ] Links work: test in production preview
- [ ] SEO meta tags: check in DevTools
- [ ] OG images: test with og-image-preview tool
- [ ] 404 pages: test with invalid slug
- [ ] Mobile responsive: test on Safari/Chrome mobile
- [ ] Lighthouse: > 80 on Performance/SEO

---

## Troubleshooting

| Issue                                          | Solution                                      |
| ---------------------------------------------- | --------------------------------------------- |
| Build fails: "Unknown article type"            | Check `type` field matches discriminator      |
| Route returns 404                              | Verify slug matches exactly (case-sensitive)  |
| Component doesn't render                       | Check props type matches interface            |
| TypeScript errors: "not assignable to Article" | Ensure type has correct discriminator         |
| Image not showing                              | Verify imageUrl is valid URL or relative path |
| ISR not updating                               | Clear `.next` cache: `rm -rf .next`           |
| Tests failing                                  | Ensure mock objects match full schema         |

---

## Animation & Motion Standards (Quick Reference)

### Animation Checklist for New Article Types

When creating `<Type>-card.tsx`, `<Type>-hero.tsx`, `<Type>-detail-layout.tsx`:

- [ ] **Spring Transitions** – Use Framer Motion with `damping: 25, stiffness: 120, mass: 1` for organic feel
- [ ] **Staggered Children** – Container uses `staggerChildren: 0.08` (80ms delay per item)
- [ ] **Parallax (Desktop-Only)** – Implement via `useParallaxImage` hook, gated with media query helper (≤30% displacement)
- [ ] **SVG Animations** – Use `pathLength: 0 → 1` for loading states, separate opacity timing
- [ ] **Reduced Motion** – Always wrap entry animations with `useReducedMotion()` check
- [ ] **Tailwind Micro-Anims** – Use `transition-colors`, `transition-transform`, `duration-300` for micro-interactions
- [ ] **Lighthouse ≥85** – Verify no unintended layout shifts, parallax disabled on mobile (<1024px)

### Standard Spring Configuration

```typescript
// ✅ Default spring config for smooth, organic animations
const spring = { type: "spring", damping: 25, stiffness: 120, mass: 1 };
transition={shouldReduceMotion ? { duration: 0 } : spring}
```

### Staggered Children Pattern

```typescript
// ✅ For lists of cards or article elements
const containerVariants: Variants = {
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  visible: { opacity: 1, transition: spring },
};

// In JSX:
<motion.div variants={containerVariants} initial="hidden" whileInView="visible">
  {articles.map((a) => (
    <motion.div key={a.id} variants={itemVariants}>
      <ArticleCard article={a} />
    </motion.div>
  ))}
</motion.div>
```

### Parallax (Desktop-Only Pattern)

```typescript
// ✅ Desktop-gated parallax from SmartLiving pattern
const shouldReduceMotion = useReducedMotion();
const isDesktop = useMediaQuery("(min-width: 1024px)");

const scrollYProgress = useScroll().scrollYProgress; // or custom scroll tracking
const imageY =
  isDesktop && !shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], ["0%", "6%"])
    : 0;

// Never exceed 30% displacement; adjust range for subtler effect
```

### Reduced Motion Handling

```typescript
// ✅ Always check before animating entry/on-scroll effects
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={{ opacity: 1 }}
  transition={
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring", damping: 25, stiffness: 120 }
  }
>
  Content
</motion.div>
```

### Tailwind Micro-Animations

```tsx
// ✅ For hover/click states without Framer Motion overhead
<button className="transition-colors duration-300 hover:bg-cyan-600">
  Click me
</button>

<div className="transition-transform duration-300 group-hover:translate-x-1">
  Hover container
</div>

// Avoid width/height transitions; use transform/opacity instead
// Duration ranges: 150–300ms for micro, 300–600ms for moderately complex
```

### Per-Component Animation Expectations

| Component Type         | Animation Pattern                                                         | Notes                                     |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| `<Type>-card.tsx`      | Staggered entry (spring), hover scale (Tailwind), optional parallax hover | Keep to 200–300ms totals                  |
| `<Type>-hero.tsx`      | Spring entry with stagger, optional SVG path animations, parallax bg      | Parallax gated to desktop; ≤30% shift     |
| `<Type>-detail-layout` | Minimal entry (fade), preserved parallax from hero, smooth scroll         | No entry animation on detail (feels slow) |
| Status badges          | Pulse or spring scale, no blinking                                        | useReducedMotion checks mandatory         |
| Related articles list  | Staggered fade-in (80ms delay), no parallax for related items             | Keep related animations subtle            |

### Performance Validation

After implementing animations:

- [ ] **No Mobile Parallax** – Verify parallax disabled on <1024px with media query helper
- [ ] **useReducedMotion Active** – Test with `prefers-reduced-motion: reduce` DevTools setting
- [ ] **No Layout Shifts** – Run Lighthouse > 80 (CLS < 0.1)
- [ ] **Stagger ≤ 200ms** – Total reveal time for 6+ items stays <500ms
- [ ] **Spring Configs Consistent** – All springs use `damping: 25, stiffness: 120`
- [ ] **Will-Change Limits** – Max 2 elements with `will-change` per component (cache overhead)
- [ ] **Build & Test** – `pnpm build`, `pnpm test`, verify zero errors

---

**Last Updated:** 2026-03-30  
**Full Standards:** [NEWS_HUB_IMPLEMENTATION_STANDARDS.md](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md)
