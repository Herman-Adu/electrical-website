# News-Hub Multi-Article-Type Implementation Standards

**Last Updated:** March 30, 2026  
**Scope:** electrical-website news-hub system  
**Status:** Authoritative Engineering Playbook

---

## Table of Contents

1. [Coding Standards](#1-coding-standards)
   1.5. [Animation & Motion Standards](#15-animation--motion-standards)
2. [Component Development Rules](#2-component-development-rules)
3. [Data Layer Integration](#3-data-layer-integration)
4. [Routing Conventions](#4-routing-conventions)
5. [Type Safety & Validation](#5-type-safety--validation)
6. [SEO & Metadata Standards](#6-seo--metadata-standards)
7. [Performance & Caching](#7-performance--caching)
8. [Testing Requirements](#8-testing-requirements)
9. [Migration Rules](#9-migration-rules)
10. [Documentation Requirements](#10-documentation-requirements)

---

## 1. Coding Standards

### TypeScript Requirements

- **Strict Mode:** All files must compile with `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters`.
- **No `any` type:** Use branded types, generics, or `unknown` with type narrowing instead.
- **Type inference:** Prefer inferring types from Zod schemas rather than hand-writing interfaces where possible.

```typescript
// ✅ GOOD: Inferred from Zod schema
const ArticleSchema = z.object({
  id: z.string().brand<"ArticleId">(),
  title: z.string().min(1).max(200),
  featured: z.boolean().default(false),
});

type Article = z.infer<typeof ArticleSchema>;

// ❌ BAD: Redundant manual interface
interface Article {
  id: string;
  title: string;
  featured: boolean;
}
```

### Naming Conventions

#### Components

Pattern: `<ArticleType><Purpose><Variant>`

- **Card components:** `CaseStudyCard`, `PressReleaseCard`, `WhitepaperCard`
- **Hero components:** `CaseStudyHero`, `PressReleaseHero`
- **Detail layouts:** `CaseStudyDetailLayout`, `PressReleaseDetailLayout`
- **Shared utilities:** Stay generic: `ArticleCardSkeleton`, `ArticleHeroImage`

```typescript
// ✅ GOOD: Type-specific naming
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  /* ... */
}
export function PressReleaseDetailLayout({
  release,
}: PressReleaseDetailLayoutProps) {
  /* ... */
}

// ❌ BAD: Too generic or ambiguous
export function ArticleCard({ data }: ArticleCardProps) {
  /* ... */
}
export function DetailCard({ item }: DetailCardProps) {
  /* ... */
}
```

#### Functions & Helpers

- **Data fetchers:** `get<Type>BySlug()`, `get<Type>Featured()`, `getAll<Type>s()`
- **Type guards:** `is<Type>()`, `assert<Type>()`
- **Transformers:** `transform<Type>ToCard()`, `serialize<Type>ForOg()`

```typescript
// ✅ GOOD: Clear naming with type info
export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null>;
export function isCaseStudy(value: unknown): value is CaseStudy;
export function transformCaseStudyToCard(cs: CaseStudy): CaseStudyCardProps;

// ❌ BAD: Unclear intent
export async function getArticle(slug: string);
export function isValid(value: unknown);
export function format(data: Article);
```

#### Variables & Constants

- Use **camelCase** for variables/functions, **PascalCase** for types/components
- Constants: **UPPER_SNAKE_CASE** for environment-like, **camelCase** for computed/imported
- Discriminator values: lowercase with hyphens (`'case-study'`, `'press-release'`, `'whitepaper'`)

```typescript
// ✅ GOOD
const ARTICLE_TYPES = ["case-study", "press-release", "whitepaper"] as const;
const DEFAULT_PAGE_SIZE = 10;
const caseStudySlug = params.slug;

// ❌ BAD
const ArticleTypes = ["caseStudy", "pressRelease", "whitepaper"];
const default_page_size = 10;
const CaseStudySlug = params.slug;
```

### Export/Import Patterns

**Rule:** Never use `export * from`. Use explicit named exports.

```typescript
// ✅ GOOD: types/news.ts
export type { CaseStudy };
export { CaseStudySchema };
export { isCaseStudy };

// Import in components
import type { CaseStudy } from "@/types/news";
import { CaseStudySchema, isCaseStudy } from "@/types/news";

// ❌ BAD: Wildcard exports
export * from "./case-study";
export * from "./helpers";
```

**Aggregation file pattern** (data/news/index.ts):

```typescript
// data/news/index.ts - SINGLE POINT OF TRUTH for data exports
export { getCaseStudyBySlug, getCaseStudyFeatured } from "./case-studies";
export {
  getPressReleaseBySlug,
  getPressReleaseFeatured,
} from "./press-releases";
export { getWhitepaperBySlug, getWhitepaperFeatured } from "./whitepapers";
```

### PropType Definitions

**Use function declaration with props type union:**

```typescript
// ✅ GOOD: Modern approach, allows for easier debugging
interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  variant?: "compact" | "full";
  onSelect?: (id: string) => void;
}

export function CaseStudyCard(props: CaseStudyCardProps) {
  const { caseStudy, variant = "full", onSelect } = props;
  // ...
}

// ✅ ALSO GOOD: For simple props-only components
export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  // ...
}

// ❌ AVOID: React.FC shorthand
export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  // Forces children prop, less flexible
};
```

### Client vs Server Component Markers

**Default: Server Component** unless you need browser APIs or interactivity.

```typescript
// ✅ GOOD: Server component by default
// components/news-hub/case-studies/case-study-detail-layout.tsx
import { CaseStudyHeader } from './case-study-header';
import { RelatedCaseStudies } from './related-case-studies';

export function CaseStudyDetailLayout({ caseStudy }: Props) {
  // All children are server components by default
  return (
    <div>
      <CaseStudyHeader caseStudy={caseStudy} />
      <Content />
      <RelatedCaseStudies />
    </div>
  );
}

// ✅ ONLY "use client" at leaf components with interactivity
// components/news-hub/case-studies/case-study-carousel.tsx
'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function CaseStudyCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      {/* Interactive carousel logic */}
    </div>
  );
}

// ❌ BAD: Using "use client" too high in component tree
'use client';

import { getRelatedCaseStudies } from '@/data/news';

export function CaseStudyDetailLayout() {
  const related = getRelatedCaseStudies(); // Can't use async in client component!
}
```

---

## 1.5. Animation & Motion Standards

### Guiding Principles

All article type components **MUST** follow consistent animation patterns to maintain:

- **Smooth 60fps motion** (no jank, no flicker)
- **Professional, organic feel** (spring-based, not linear)
- **Accessibility compliance** (respect `prefers-reduced-motion`)
- **Mobile-friendly performance** (parallax disabled on small viewports)

### Animation Library & Hook Usage

**Use Framer Motion for all complex animations:**

```typescript
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
```

**Always check for reduced motion:**

```typescript
const shouldReduceMotion = useReducedMotion();

// Then gate animations accordingly
transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 120 }}
```

### Standard Spring Configuration

**For entrance/exit animations (cards, heroes, sections):**

```typescript
const STANDARD_SPRING = {
  type: "spring" as const,
  damping: 25,      // Natural organic feel (20-30 range)
  stiffness: 120,   // Snappy but not harsh (100-150 range)
  mass: 1,          // Standard inertia
};

// Usage:
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={STANDARD_SPRING}
  viewport={{ once: true }}
/>
```

### Parallex & Scroll Effects (Desktop Only)

**For depth/parallax effects in CaseStudyHero, TechInsightDetail:**

```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end start"],
});

// Desktop-only parallax
const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
const contentY = isDesktop
  ? useTransform(scrollYProgress, [0, 1], ["0%", "8%"])
  : 0;

// Mobile: disable parallax to avoid jank
useEffect(() => {
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  setIsDesktop(!isMobile);
}, []);
```

**Constraints:**

- Parallax displacement ≤ 30% (avoid over-exaggeration)
- Only on desktop (lg: breakpoint minimum)
- Always gate to viewport-linked transforms

### Staggered Children (Tag Lists, Metrics, Related Articles)

**For sequential entrance of list/grid items:**

```typescript
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,  // 80ms between each child
      delayChildren: 0.15,    // Wait before starting
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

<motion.ul
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.label}
    </motion.li>
  ))}
</motion.ul>
```

### SVG Path Animations (Icons, Decorative Lines)

**For inline icon drawing or line reveals:**

```typescript
<motion.path
  initial={{ pathLength: 0, opacity: 0 }}
  whileInView={{ pathLength: 1, opacity: 1 }}
  transition={{
    pathLength: { type: "spring", damping: 25, stiffness: 120, duration: 0.8 },
    opacity: { duration: 0.3 },
  }}
  strokeLinecap="round"
  strokeLinejoin="round"
  stroke="currentColor"
  strokeWidth={2}
/>
```

**Keep stroke widths ≥ 1.5px for legibility**

### Tailwind CSS Micro-Animations

**For simple hover states, focus indicators, and transitions:**

```typescript
// Color transitions (borders, text)
className = "transition-colors hover:border-electric-cyan/40";

// Transform transitions (rotate, scale, translate)
className = "transition-transform group-hover:translate-x-1";

// Opacity fades
className = "transition-opacity hover:opacity-80";

// Combine multiple with duration override
className = "transition-all duration-300 hover:scale-105";
```

**Standard Tailwind animation durations:**

- `duration-75` — 75ms (micro-interactions, cursor feedback)
- `duration-100` — 100ms (icon rotations, small hover effects)
- `duration-300` — 300ms (standard button hover, border fades)
- `duration-500` — 500ms (modal opens, large component expansion)

**MUST NOT:**

- ❌ Use `duration-700`+ (feels sluggish, worse on slow networks)
- ❌ Animate `width`, `height` directly (causes reflow; use `scaleX`, `scaleY`)
- ❌ Chain multiple transforms without clear easing curve
- ❌ Use `visibility` toggle (causes flashing; use `opacity` instead)

### Per-Component Animation Checklist

#### CaseStudy Components

- [ ] Hero image: parallax effect (desktop only, 15% displacement)
- [ ] Title + subtitle: spring fade-in (0.4–0.5s)
- [ ] Metrics grid: staggered entry (0.08s between items)
- [ ] Spotlight metric: subtle glow pulse (not spinning; organic feel)
- [ ] CTA button: hover scale (1.03x) + border color fade

#### TechnicalInsight Components

- [ ] Hero: parallax content (6–8% displacement)
- [ ] Difficulty badge: entrance spring
- [ ] Tech stack tags: staggered list (0.06s)
- [ ] Code snippet: fade-in, syntax highlight on demand
- [ ] References link: underline animation on hover

#### BlogPost Components

- [ ] Hero: author bio fade-in
- [ ] Series nav: slide-in from left (0.4s spring)
- [ ] Table of contents: staggered link appearance
- [ ] Body text: avoid animation (readability)
- [ ] Related posts: grid stagger (0.08s)

#### ElectricalInsight Components

- [ ] Alert badge: pulsing fill (2–3s loop, subtle)
- [ ] Compliance refs: staggered reveal (0.06s)
- [ ] Timeline: smooth horizontal scroll-snap
- [ ] Impact statement: emphasis color transition

#### Shared Components

- [ ] MetaBar (date, author, read time): staggered fade-in
- [ ] RelatedArticles grid: children stagger (0.08s)
- [ ] CTA section buttons: hover scale + shadow

### Performance Validation

**Before every commit, verify:**

- [ ] Lighthouse Performance ≥ 85 (check "Cumulative Layout Shift")
- [ ] No animations trigger on mobile (parallax, scroll effects disabled)
- [ ] `useReducedMotion()` check in all major animations
- [ ] `will-change` sparingly (≤2–3 per page maximum)
- [ ] All timings in 300–800ms range (responsive feel)
- [ ] Spring damping 25–30, stiffness 100–120 (no wild bouncing)
- [ ] No layout shifts during animation (use transform, opacity only)

---

## 2. Component Development Rules

### Folder Structure & Ownership

```
components/news-hub/
├── shared/
│   ├── article-card-skeleton.tsx          # All types use this
│   ├── article-hero-image.tsx             # Generic hero image component
│   ├── article-metadata.tsx               # Dates, authors, reading time
│   └── factory/
│       ├── article-card-factory.tsx       # Polymorphic card renderer
│       └── article-detail-factory.tsx     # Polymorphic detail renderer
├── case-studies/
│   ├── case-study-card.tsx               # Type-specific
│   ├── case-study-hero.tsx
│   ├── case-study-detail-layout.tsx      # Full page layout
│   ├── case-study-client-badge.tsx       # "use client" if needed
│   └── index.ts
├── press-releases/
│   ├── press-release-card.tsx
│   ├── press-release-hero.tsx
│   ├── press-release-detail-layout.tsx
│   ├── press-release-timeline.tsx        # Press-release-specific
│   └── index.ts
└── whitepapers/
    ├── whitepaper-card.tsx
    ├── whitepaper-hero.tsx
    ├── whitepaper-detail-layout.tsx
    ├── whitepaper-download-cta.tsx       # Type-specific
    └── index.ts
```

**Ownership Rules:**

- **Shared folder owns:** Components usable by 2+ article types
- **Type-specific folders own:** Components used by only that type
- **Type-specific folder exports:** Only public components (index.ts exports)

```typescript
// components/news-hub/case-studies/index.ts
export { CaseStudyCard } from "./case-study-card";
export { CaseStudyHero } from "./case-study-hero";
export { CaseStudyDetailLayout } from "./case-study-detail-layout";
export type { CaseStudyCardProps } from "./case-study-card";
```

### Creating a New Type-Specific Card Component

**Step 1: Define component prop interface**

```typescript
// components/news-hub/case-studies/case-study-card.tsx
import type { CaseStudy } from "@/types/news";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  variant?: "compact" | "full";
  className?: string;
}
```

**Step 2: Use standard layout pattern**

```typescript
export function CaseStudyCard(props: CaseStudyCardProps) {
  const { caseStudy, variant = 'full', className } = props;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-lg border border-slate-200 bg-white',
        'transition-all duration-300 hover:shadow-lg hover:border-primary-500',
        className,
      )}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <ArticleHeroImage
          src={caseStudy.imageUrl}
          alt={caseStudy.title}
          priority={false}
        />
      </div>

      {/* Content container */}
      <div className="p-4">
        {/* Badge: Case Study-specific */}
        <div className="mb-3 inline-flex">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-900">
            Case Study
          </span>
        </div>

        {/* Metadata: Shared component */}
        <ArticleMetadata
          date={caseStudy.date}
          readingTime={caseStudy.readingTime}
          author={caseStudy.clientName}
        />

        {/* Content */}
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900">
          {caseStudy.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600">
          {caseStudy.excerpt}
        </p>

        {/* CTA */}
        <a
          href={`/news-hub/case-studies/${caseStudy.slug}`}
          className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Read Case Study →
        </a>
      </div>
    </article>
  );
}
```

**Step 3: Export with types**

```typescript
export type { CaseStudyCardProps };
```

### Creating a New Type-Specific Hero Component

Hero components should be **Server Components** unless they require client-side interactivity (fade-in animations, parallax, etc.).

```typescript
// components/news-hub/case-studies/case-study-hero.tsx
import type { CaseStudy } from '@/types/news';
import { ArticleHeroImage } from '../shared/article-hero-image';

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
  showBreadcrumb?: boolean;
}

export function CaseStudyHero(props: CaseStudyHeroProps) {
  const { caseStudy, showBreadcrumb = true } = props;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900">
      {/* Background image */}
      <div className="absolute inset-0">
        <ArticleHeroImage
          src={caseStudy.imageUrl}
          alt={caseStudy.title}
          priority={true}
          className="absolute inset-0"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        {showBreadcrumb && (
          <nav className="mb-6 flex items-center space-x-2 text-sm text-slate-300">
            <a href="/news-hub">News Hub</a>
            <span>/</span>
            <a href="/news-hub/case-studies">Case Studies</a>
            <span>/</span>
            <span className="text-white">{caseStudy.title}</span>
          </nav>
        )}

        {/* Badge */}
        <div className="mb-4 inline-flex">
          <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-200">
            Case Study
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
          {caseStudy.title}
        </h1>

        {/* Client info: Case Study-specific */}
        <div className="mb-6 flex items-center space-x-4 text-slate-200">
          <div>
            <p className="text-sm text-foreground/70">Client</p>
            <p className="font-semibold">{caseStudy.clientName}</p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <p className="text-sm text-foreground/70">Industry</p>
            <p className="font-semibold">{caseStudy.industry}</p>
          </div>
        </div>

        {/* Excerpt */}
        <p className="max-w-2xl text-lg text-slate-300">
          {caseStudy.excerpt}
        </p>
      </div>
    </div>
  );
}
```

### Creating a Detail Layout Component

Detail layouts are **Server Components** that orchestrate the full article view.

```typescript
// components/news-hub/case-studies/case-study-detail-layout.tsx
import type { CaseStudy } from '@/types/news';
import { CaseStudyHero } from './case-study-hero';
import { CaseStudyContent } from './case-study-content';
import { RelatedCaseStudies } from './related-case-studies';

interface CaseStudyDetailLayoutProps {
  caseStudy: CaseStudy;
  relatedCaseStudies: CaseStudy[];
}

export function CaseStudyDetailLayout(props: CaseStudyDetailLayoutProps) {
  const { caseStudy, relatedCaseStudies } = props;

  return (
    <div className="w-full">
      {/* Hero section */}
      <CaseStudyHero caseStudy={caseStudy} />

      {/* Main content */}
      <div className="mx-auto max-w-4xl">
        <article className="px-4 py-12 sm:px-6 lg:px-0">
          <CaseStudyContent caseStudy={caseStudy} />
        </article>

        {/* Divider */}
        <div className="mx-auto max-w-3xl border-t border-slate-200" />

        {/* Related articles */}
        {relatedCaseStudies.length > 0 && (
          <section className="py-12">
            <h2 className="mb-8 text-2xl font-bold">Related Case Studies</h2>
            <RelatedCaseStudies caseStudies={relatedCaseStudies} />
          </section>
        )}
      </div>
    </div>
  );
}
```

### Using the Polymorphic Factory Pattern

The factory pattern enables routing-level article type switching.

```typescript
// components/news-hub/shared/factory/article-card-factory.tsx
import type { Article } from '@/types/news';
import { CaseStudyCard } from '../case-studies/case-study-card';
import { PressReleaseCard } from '../press-releases/press-release-card';
import { WhitepaperCard } from '../whitepapers/whitepaper-card';

interface ArticleCardFactoryProps {
  article: Article;
  className?: string;
}

/**
 * Polymorphic renderer for article cards.
 * Routes to type-specific card component based on discriminator.
 *
 * @param article - Validated article with type discriminator
 * @returns Type-specific card component or error boundary
 */
export function ArticleCardFactory(props: ArticleCardFactoryProps) {
  const { article, className } = props;

  switch (article.type) {
    case 'case-study':
      return <CaseStudyCard caseStudy={article} className={className} />;

    case 'press-release':
      return <PressReleaseCard release={article} className={className} />;

    case 'whitepaper':
      return <WhitepaperCard whitepaper={article} className={className} />;

    default: {
      // TypeScript exhaustiveness check:
      const _exhaustive: never = article;
      console.error('Unknown article type:', _exhaustive);
      return <div className="p-4 text-red-600">Unknown article type</div>;
    }
  }
}
```

Use in list pages:

```typescript
// app/news-hub/page.tsx
import { getALLArticles } from '@/data/news';
import { ArticleCardFactory } from '@/components/news-hub/shared/factory/article-card-factory';

export default async function NewsHubPage() {
  const articles = await getAllArticles();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCardFactory
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}
```

### Styling Conventions

**Tailwind Utility Usage:**

1. **Use logical grouping** - group related utilities for readability
2. **Order: layout → sizing → colors → interactivity**
3. **Use cn() for conditional classes** (from shadcn/ui)
4. **Extract repeated patterns into component abstractions** (not CSS classes)

```typescript
// ✅ GOOD: Organized, readable
className={cn(
  // Layout
  'relative flex flex-col',
  // Sizing
  'w-full h-48 p-4',
  // Colors
  'rounded-lg border border-slate-200 bg-white',
  // Interactive
  'transition-all duration-300 hover:shadow-lg hover:border-primary-500',
  // Conditional
  variant === 'compact' && 'h-32 p-3',
  className,
)}

// ❌ BAD: Random order, hard to maintain
className="p-4 w-full bg-white hover:shadow-lg h-48 border row flex border-slate-200 rounded-lg hover:border-primary-500 transition-all flex-col relative duration-300"
```

---

## 3. Data Layer Integration

### File Structure & Organization

```
data/news/
├── index.ts                    # Single aggregation point
├── case-studies/
│   ├── index.ts               # Re-exports helpers & data
│   ├── schema.ts              # Zod schema
│   ├── types.ts               # TypeScript types (inferred from schema)
│   ├── data.ts                # Raw article data
│   └── helpers.ts             # get<Type>BySlug, etc.
├── press-releases/
│   ├── schema.ts
│   ├── types.ts
│   ├── data.ts
│   └── helpers.ts
└── whitepapers/
    ├── schema.ts
    ├── types.ts
    ├── data.ts
    └── helpers.ts
```

### Data Structure Requirements

Every article type MUST have:

1. **id** (string, UUID or slug-based)
2. **type** (discriminator literal: `'case-study'` | `'press-release'` | `'whitepaper'`)
3. **title** (string, 1-200 chars)
4. **slug** (string, URL-safe, unique per type)
5. **excerpt** (string, 50-300 chars)
6. **imageUrl** (string, valid URL or relative path)
7. **publishedDate** (ISO 8601 date string)
8. **content** (string, markdown or HTML)

Optional but encouraged:

- `featured` (boolean) - for homepage highlights
- `readingTime` (number) - minutes to read
- `tags` (string[]) - for filtering/search
- `author` (string) - byline
- `seoDescription` (string) - meta description override

```typescript
// data/news/case-studies/types.ts
import type { z } from "zod";
import { CaseStudySchema } from "./schema";

export type CaseStudy = z.infer<typeof CaseStudySchema>;
```

### Zod Validation Schema Requirements

**Every article type requires a schema in schema.ts:**

```typescript
// data/news/case-studies/schema.ts
import { z } from "zod";

// Base schema: common fields
const BaseArticleSchema = z.object({
  id: z.string().min(1),
  type: z.literal("case-study"),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(50).max(300),
  imageUrl: z.string().url(),
  publishedDate: z.string().datetime(),
  content: z.string().min(100),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5),
  tags: z.array(z.string()).default([]),
});

// Extended schema: case-study-specific fields
export const CaseStudySchema = BaseArticleSchema.extend({
  clientName: z.string().min(1).max(100),
  industry: z.string().min(1).max(100),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
  challenge: z.string().min(50).max(500),
  solution: z.string().min(50).max(500),
  results: z.string().min(50).max(500),
});

// Type inference
export type CaseStudy = z.infer<typeof CaseStudySchema>;
```

### Helper Function Naming & Implementation

**Pattern: `get<Type><Modifier>()`**

```typescript
// data/news/case-studies/helpers.ts
import { CaseStudySchema } from "./schema";
import type { CaseStudy } from "./types";
import { CASE_STUDIES_DATA } from "./data";

/**
 * Fetch single case study by slug.
 * Validates against schema.
 */
export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const raw = CASE_STUDIES_DATA.find((cs) => cs.slug === slug);
  if (!raw) return null;

  try {
    return CaseStudySchema.parse(raw);
  } catch (error) {
    console.error(`Invalid case study data for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch featured case studies.
 * Returns max 3 by default, sorted by publish date descending.
 */
export async function getCaseStudyFeatured(limit = 3): Promise<CaseStudy[]> {
  return CASE_STUDIES_DATA.filter((cs) => cs.featured)
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    )
    .slice(0, limit)
    .map((raw) => {
      try {
        return CaseStudySchema.parse(raw);
      } catch {
        return null;
      }
    })
    .filter((cs): cs is CaseStudy => cs !== null);
}

/**
 * Fetch all case studies, optionally filtered by tag.
 */
export async function getAllCaseStudies(tag?: string): Promise<CaseStudy[]> {
  return CASE_STUDIES_DATA.filter((cs) => !tag || cs.tags.includes(tag))
    .map((raw) => {
      try {
        return CaseStudySchema.parse(raw);
      } catch {
        return null;
      }
    })
    .filter((cs): cs is CaseStudy => cs !== null);
}

/**
 * Fetch case studies related to given case study (by tags).
 */
export async function getRelatedCaseStudies(
  caseStudy: CaseStudy,
  limit = 3,
): Promise<CaseStudy[]> {
  const relatedTags = caseStudy.tags.slice(0, 2); // Use first 2 tags
  if (relatedTags.length === 0) {
    return getCaseStudyFeatured(limit);
  }

  const matches = CASE_STUDIES_DATA.filter(
    (cs) =>
      cs.slug !== caseStudy.slug &&
      relatedTags.some((tag) => cs.tags.includes(tag)),
  )
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    )
    .slice(0, limit);

  return matches
    .map((raw) => {
      try {
        return CaseStudySchema.parse(raw);
      } catch {
        return null;
      }
    })
    .filter((cs): cs is CaseStudy => cs !== null);
}
```

### Export Pattern from data/news/index.ts

**Single aggregation point for all data exports:**

```typescript
// data/news/index.ts
// Case Studies
export {
  getCaseStudyBySlug,
  getCaseStudyFeatured,
  getAllCaseStudies,
  getRelatedCaseStudies,
} from "./case-studies/helpers";
export type { CaseStudy } from "./case-studies/types";
export { CaseStudySchema } from "./case-studies/schema";

// Press Releases
export {
  getPressReleaseBySlug,
  getPressReleaseFeatured,
  getAllPressReleases,
} from "./press-releases/helpers";
export type { PressRelease } from "./press-releases/types";
export { PressReleaseSchema } from "./press-releases/schema";

// Whitepapers
export {
  getWhitepaperBySlug,
  getWhitepaperFeatured,
  getAllWhitepapers,
} from "./whitepapers/helpers";
export type { Whitepaper } from "./whitepapers/types";
export { WhitepaperSchema } from "./whitepapers/schema";

// Polymorphic union type
export type Article = CaseStudy | PressRelease | Whitepaper;

// Type guards
export { isCaseStudy, isPressRelease, isWhitepaper } from "./type-guards";
```

---

## 4. Routing Conventions

### URL Pattern Rules

| Article Type  | Pattern                           | Example                                                |
| ------------- | --------------------------------- | ------------------------------------------------------ |
| Case Study    | `/news-hub/case-studies/[slug]`   | `/news-hub/case-studies/tesla-factory-renovation`      |
| Press Release | `/news-hub/press-releases/[slug]` | `/news-hub/press-releases/2026-expansion-announcement` |
| Whitepaper    | `/news-hub/whitepapers/[slug]`    | `/news-hub/whitepapers/renewable-energy-guide-2026`    |
| Hub/List      | `/news-hub`                       | —                                                      |
| Hub/Type List | `/news-hub/[type]`                | `/news-hub/case-studies` (optional)                    |

**Slug requirements:**

- Lowercase, hyphen-separated
- URL-safe: no spaces, special chars except hyphens
- 3-80 characters
- Unique within article type (not globally)
- Immutable once published (redirect old URLs if renamed)

```typescript
// VALIDATION HELPER
import { z } from "zod";

const SlugSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens");

export function validateSlug(slug: string): slug is string {
  try {
    SlugSchema.parse(slug);
    return true;
  } catch {
    return false;
  }
}
```

### Route File Naming & Organization

```
app/news-hub/
├── page.tsx                           # /news-hub - hub list
├── layout.tsx                         # Shared layout for all news-hub routes
├── case-studies/
│   ├── page.tsx                       # /news-hub/case-studies (optional type list)
│   ├── layout.tsx                     # Case study routes layout
│   └── [slug]/
│       ├── page.tsx                   # /news-hub/case-studies/[slug] - DETAIL PAGE
│       ├── layout.tsx                 # Individual article layout (metadata, etc.)
│       └── not-found.tsx              # Custom 404 for missing case studies
├── press-releases/
│   ├── page.tsx
│   ├── layout.tsx
│   └── [slug]/
│       ├── page.tsx
│       ├── layout.tsx
│       └── not-found.tsx
└── whitepapers/
    ├── page.tsx
    ├── layout.tsx
    └── [slug]/
        ├── page.tsx
        ├── layout.tsx
        └── not-found.tsx
```

### Dynamic Segment Conventions

**Single slug per detail page:**

```typescript
// app/news-hub/case-studies/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/data/news';
import { CaseStudyDetailLayout } from '@/components/news-hub/case-studies';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage(props: CaseStudyPageProps) {
  const params = await props.params;
  const { slug } = params;

  // Validate slug format first
  if (!slug || typeof slug !== 'string' || slug.length > 80) {
    notFound();
  }

  // Fetch article
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) {
    notFound();
  }

  // Fetch related
  const relatedCaseStudies = await getRelatedCaseStudies(caseStudy, 3);

  return (
    <CaseStudyDetailLayout
      caseStudy={caseStudy}
      relatedCaseStudies={relatedCaseStudies}
    />
  );
}
```

### Query Param Validation Rules

Query params must be validated at route entry point.

```typescript
// app/news-hub/page.tsx
import { z } from 'zod';

const NewsHubSearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  tag: z.string().optional(),
  sort: z.enum(['recent', 'popular']).default('recent'),
});

interface NewsHubPageProps {
  searchParams: Promise<Record<string, string[] | string | undefined>>;
}

export default async function NewsHubPage(props: NewsHubPageProps) {
  const searchParams = await props.searchParams;

  // Parse and validate
  const result = NewsHubSearchSchema.safeParse(searchParams);
  if (!result.success) {
    // Invalid params - redirect to default or show error
    return <div>Invalid search parameters</div>;
  }

  const { page, tag, sort } = result.data;
  // ... fetch articles with filters
}
```

### Static Generation Config

**Every detail page must have `generateStaticParams`:**

```typescript
// app/news-hub/case-studies/[slug]/page.tsx
import { getAllCaseStudies } from "@/data/news";

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();

  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export const revalidate = 3600; // ISR: revalidate every hour

export const dynamicParams = true; // Allow new slugs without rebuild
```

**For type list pages** (optional, e.g., `/news-hub/case-studies`):

```typescript
// app/news-hub/case-studies/page.tsx
export const revalidate = 1800; // ISR: 30 minutes
export const dynamic = "force-static"; // Prerender at build time
```

---

## 5. Type Safety & Validation

### Zod Schemas for Each Article Type

**All schemas located in `data/news/<type>/schema.ts`:**

```typescript
// data/news/press-releases/schema.ts
import { z } from "zod";

export const PressReleaseSchema = z.object({
  id: z.string().min(1),
  type: z.literal("press-release"),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(50).max(300),
  imageUrl: z.string().url(),
  publishedDate: z.string().datetime(),
  content: z.string().min(100),
  featured: z.boolean().default(false),
  readingTime: z.number().int().positive().default(5),
  tags: z.array(z.string()).default([]),

  // Press Release-specific fields
  location: z.string().min(2).max(100),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export type PressRelease = z.infer<typeof PressReleaseSchema>;
```

### Discriminated Union Usage

**Articles MUST use type discriminator:**

```typescript
// types/news.ts (or in a central types aggregation)
import type { CaseStudy } from "@/data/news/case-studies/types";
import type { PressRelease } from "@/data/news/press-releases/types";
import type { Whitepaper } from "@/data/news/whitepapers/types";

/**
 * Discriminated union of all article types.
 * Type property is discriminator for exhaustiveness checking.
 */
export type Article = CaseStudy | PressRelease | Whitepaper;

/**
 * Type-safe article filtering logic MUST use discriminator.
 */
export function getArticleTypeLabel(article: Article): string {
  switch (article.type) {
    case "case-study":
      return "Case Study";
    case "press-release":
      return "Press Release";
    case "whitepaper":
      return "Whitepaper";
    default: {
      const _exhaustive: never = article;
      console.error("Unknown article type:", _exhaustive);
      return "Unknown";
    }
  }
}
```

### Type Guards That Must Be Created

**One type guard per article type, in `data/news/type-guards.ts`:**

```typescript
// data/news/type-guards.ts
import type { CaseStudy, PressRelease, Whitepaper, Article } from "./types";

export function isCaseStudy(value: unknown): value is CaseStudy {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "case-study" &&
    "clientName" in value &&
    "industry" in value
  );
}

export function isPressRelease(value: unknown): value is PressRelease {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "press-release" &&
    "location" in value
  );
}

export function isWhitepaper(value: unknown): value is Whitepaper {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "whitepaper" &&
    "downloadUrl" in value
  );
}

/**
 * Assert article is of specific type, throw if not.
 */
export function assertCaseStudy(
  article: Article,
): asserts article is CaseStudy {
  if (!isCaseStudy(article)) {
    throw new Error(`Expected CaseStudy, got ${article.type}`);
  }
}

export function assertPressRelease(
  article: Article,
): asserts article is PressRelease {
  if (!isPressRelease(article)) {
    throw new Error(`Expected PressRelease, got ${article.type}`);
  }
}

export function assertWhitepaper(
  article: Article,
): asserts article is Whitepaper {
  if (!isWhitepaper(article)) {
    throw new Error(`Expected Whitepaper, got ${article.type}`);
  }
}
```

### Search Params Validation Approach

**Centralized schema per route:**

```typescript
// lib/news-hub/search-params.ts
import { z } from "zod";

export const NewsHubSearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  tag: z.string().min(1).max(50).optional(),
  sort: z.enum(["recent", "popular", "title"]).default("recent"),
  type: z.enum(["case-study", "press-release", "whitepaper"]).optional(),
});

export type NewsHubSearchParams = z.infer<typeof NewsHubSearchSchema>;

export function parseNewsHubSearchParams(
  raw: Record<string, string[] | string | undefined>,
): NewsHubSearchParams {
  // This will throw on invalid data - catch in page.tsx
  return NewsHubSearchSchema.parse(raw);
}
```

Use in page:

```typescript
// app/news-hub/page.tsx
import { parseNewsHubSearchParams } from '@/lib/news-hub/search-params';

interface NewsHubPageProps {
  searchParams: Promise<Record<string, string[] | string | undefined>>;
}

export default async function NewsHubPage(props: NewsHubPageProps) {
  const raw = await props.searchParams;

  let params: NewsHubSearchParams;
  try {
    params = parseNewsHubSearchParams(raw);
  } catch (error) {
    console.error('Invalid search params:', error);
    // Return error page or default params
    return <div>Invalid filters</div>;
  }

  // Use validated params
  const articles = await getArticlesByFilters(params);
  // ...
}
```

### Error Handling Strategy

**Never suppress validation errors silently:**

```typescript
// ✅ GOOD: Log and handle gracefully
export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const raw = CASE_STUDIES_DATA.find((cs) => cs.slug === slug);
  if (!raw) {
    console.warn(`Case study not found: ${slug}`);
    return null;
  }

  try {
    return CaseStudySchema.parse(raw);
  } catch (error) {
    console.error(`Validation failed for case study "${slug}":`, error);
    if (error instanceof z.ZodError) {
      console.error("Issues:", error.issues);
    }
    return null;
  }
}

// ❌ BAD: Silent failure
export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const raw = CASE_STUDIES_DATA.find((cs) => cs.slug === slug);
  return CaseStudySchema.parse(raw).catch(() => null); // Swallows errors
}
```

---

## 6. SEO & Metadata Standards

### Metadata Export Requirements

**Every detail page must export metadata:**

```typescript
// app/news-hub/case-studies/[slug]/page.tsx
import type { Metadata } from "next";
import { getCaseStudyBySlug } from "@/data/news";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: CaseStudyPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const caseStudy = await getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
      robots: { index: false },
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://nexgen-electrical-innovations.co.uk";
  const canonicalUrl = `${siteUrl}/news-hub/case-studies/${caseStudy.slug}`;

  return {
    title: caseStudy.title,
    description: caseStudy.seoDescription || caseStudy.excerpt,
    keywords: caseStudy.tags.join(", "),
    canonical: canonicalUrl,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: caseStudy.publishedDate,
      authors: [caseStudy.clientName],
      images: [
        {
          url: caseStudy.imageUrl,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: caseStudy.excerpt,
      images: [caseStudy.imageUrl],
    },
  };
}

// Page component...
```

### OG Image Generation Rules

Delegate to `/api/og` endpoint with type-specific parameters:

```typescript
// In metadata generation
const ogImageUrl = new URL("/api/og", siteUrl);
ogImageUrl.searchParams.set("type", "case-study");
ogImageUrl.searchParams.set("title", caseStudy.title);
ogImageUrl.searchParams.set("clientName", caseStudy.clientName);

return {
  openGraph: {
    images: [ogImageUrl.toString()],
  },
};
```

**API endpoint** must validate type & parameters:

```typescript
// app/api/og/route.ts
import { z } from "zod";

const OgImageSchema = z.object({
  type: z.enum(["case-study", "press-release", "whitepaper"]),
  title: z.string().min(1).max(100),
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .default("#1F2937"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  const result = OgImageSchema.safeParse(params);
  if (!result.success) {
    return new Response("Invalid OG parameters", { status: 400 });
  }

  // Generate image based on type and params
  // ...
}
```

### Canonical URL Strategy

**Hard rule: Each article has exactly one canonical URL**

```typescript
// data/news/case-studies/helpers.ts
export function getCaseStudyCanonical(caseStudy: CaseStudy): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexgen-electrical-innovations.co.uk';
  return `${siteUrl}/news-hub/case-studies/${caseStudy.slug}`;
}

// In layout or page.tsx
<link rel="canonical" href={getCaseStudyCanonical(caseStudy)} />
```

### Schema.org Structured Data Formats

**Case Study → schema:Case Study** (if supported, else schema:Article)  
**Press Release → schema:NewsArticle**  
**Whitepaper → schema:Report or schema:ScholarlyArticle**

```typescript
// lib/news-hub/structured-data.ts
import type { CaseStudy, PressRelease, Whitepaper } from '@/data/news';

export function generateCaseStudySchema(caseStudy: CaseStudy, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.excerpt,
    image: caseStudy.imageUrl,
    datePublished: caseStudy.publishedDate,
    author: {
      '@type': 'Organization',
      name: caseStudy.clientName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexgen Electrical Innovations',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleBody: caseStudy.content,
  };
}

export function generatePressReleaseSchema(release: PressRelease, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: release.title,
    description: release.excerpt,
    image: release.imageUrl,
    datePublished: release.publishedDate,
    articleBody: release.content,
    locationCreated: {
      '@type': 'Place',
      name: release.location,
    },
  };
}

// Use in layout
export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = generateCaseStudySchema(caseStudy, siteUrl);

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### robots.txt Rules for Article Routes

```
# Allow all search engines to crawl articles
User-agent: *
Allow: /news-hub/

# No indexing of draft articles (if you use query params)
Disallow: /news-hub/*?draft=true

# Respect Crawl-delay for specific patterns
User-agent: AdsBot-Google
Crawl-delay: 1
```

---

## 7. Performance & Caching

### ISR Revalidation Times

| Route                                    | Strategy                 | Revalidation                 |
| ---------------------------------------- | ------------------------ | ---------------------------- |
| `/news-hub` (hub list)                   | Static + ISR             | 30 minutes (1800s)           |
| `/news-hub/[type]` (type list, optional) | Static + ISR             | 30 minutes (1800s)           |
| `/news-hub/case-studies/[slug]`          | Static + ISR             | 1 hour (3600s)               |
| `/news-hub/press-releases/[slug]`        | Static + ISR             | 1 hour (3600s)               |
| `/news-hub/whitepapers/[slug]`           | Static + ISR             | 1 hour (3600s)               |
| `/api/og`                                | No cache (let CDN cache) | Cache-Control: max-age=86400 |

```typescript
// app/news-hub/case-studies/[slug]/page.tsx
export const revalidate = 3600; // 1 hour ISR

// app/news-hub/page.tsx
export const revalidate = 1800; // 30 minutes ISR
```

### Static Prerendering Requirement Verification

**Every article MUST be prerendered at build time:**

```typescript
// app/news-hub/case-studies/[slug]/page.tsx
export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();

  // Log prerendering for monitoring
  console.log(
    `[generateStaticParams] Prerendering ${caseStudies.length} case studies`,
  );

  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export const dynamicParams = true; // Allow new slugs after build (ISR)
```

**Implement build-time verification:**

```typescript
// scripts/verify-prerendering.mjs
import {
  getAllCaseStudies,
  getAllPressReleases,
  getAllWhitepapers,
} from "./data/news/index.js";

async function verifyPrerendering() {
  const caseStudies = await getAllCaseStudies();
  const pressReleases = await getAllPressReleases();
  const whitepapers = await getAllWhitepapers();

  const total = caseStudies.length + pressReleases.length + whitepapers.length;

  console.log(`✓ Prerendering ${total} articles`);
  console.log(`  - Case Studies: ${caseStudies.length}`);
  console.log(`  - Press Releases: ${pressReleases.length}`);
  console.log(`  - Whitepapers: ${whitepapers.length}`);

  if (total === 0) {
    console.warn("⚠ No articles found to prerender");
    process.exit(1);
  }
}

verifyPrerendering().catch((error) => {
  console.error("Prerendering verification failed:", error);
  process.exit(1);
});
```

Add to package.json:

```json
{
  "scripts": {
    "build": "next build && node scripts/verify-prerendering.mjs"
  }
}
```

### Image Optimization Rules

**All featured images MUST use Next.js Image component:**

```typescript
import Image from 'next/image';

export function ArticleHeroImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      className={cn('object-cover', className)}
      quality={85}
    />
  );
}
```

**Requirements:**

- Use `fill` + `object-cover` for full-bleed images
- Set `priority={true}` only for above-the-fold images (hero sections)
- Use `sizes` prop for responsive optimization
- Quality: 85 for hero images (balance quality vs size)
- Formats: WebP with JPEG fallback (Next.js handles automatically)

### Code Splitting Expectations

**Route-specific components should NOT be imported globally:**

```typescript
// ✅ GOOD: Lazy load route-specific component
const CaseStudyDetailLayout = dynamic(
  () => import('@/components/news-hub/case-studies/case-study-detail-layout'),
  { loading: () => <DetailSkeleton /> }
);

// ❌ BAD: All components in main bundle
import { CaseStudyDetailLayout } from '@/components/news-hub/case-studies';
import { PressReleaseDetailLayout } from '@/components/news-hub/press-releases';
import { WhitepaperDetailLayout } from '@/components/news-hub/whitepapers';
```

### Bundle Impact Guidelines

**Target metrics:**

- Main bundle (all routes): < 200 KB (gzipped)
- News hub: < 150 KB (gzipped) - including all types
- Single article page: < 100 KB (gzipped)

**Monitor with:**

```bash
pnpm build
npx next-bundle-analyzer
```

---

## 8. Testing Requirements

### Component Snapshot Tests

**Use Vitest + Testing Library for all components:**

```typescript
// components/news-hub/case-studies/__tests__/case-study-card.spec.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CaseStudyCard } from '../case-study-card';
import type { CaseStudy } from '@/types/news';

const mockCaseStudy: CaseStudy = {
  id: 'cs-1',
  type: 'case-study',
  title: 'Tesla Factory Renovation',
  slug: 'tesla-factory-renovation',
  excerpt: 'A comprehensive case study of our electrical systems upgrade',
  imageUrl: 'https://example.com/image.jpg',
  publishedDate: '2026-01-01T00:00:00Z',
  content: 'Full content here...',
  featured: true,
  readingTime: 8,
  tags: ['manufacturing', 'industrial'],
  clientName: 'Tesla',
  industry: 'Automotive',
  metrics: [
    { label: 'Power Efficiency', value: '+45%' },
    { label: 'Downtime', value: '-60%' },
  ],
  challenge: 'Challenge description',
  solution: 'Solution description',
  results: 'Results description',
};

describe('CaseStudyCard', () => {
  it('renders with required props', () => {
    const { container } = render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title', () => {
    const { getByText } = render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    expect(getByText('Tesla Factory Renovation')).toBeInTheDocument();
  });

  it('renders client name in metadata', () => {
    const { getByText } = render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    expect(getByText('Tesla')).toBeInTheDocument();
  });

  it('renders with compact variant', () => {
    const { container } = render(
      <CaseStudyCard caseStudy={mockCaseStudy} variant="compact" />
    );
    expect(container.firstChild).toHaveClass('h-32');
  });

  it('has correct href', () => {
    const { getByRole } = render(<CaseStudyCard caseStudy={mockCaseStudy} />);
    const link = getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/news-hub/case-studies/tesla-factory-renovation'
    );
  });
});
```

### Integration Test Scenarios

**Test factory pattern & type narrowing:**

```typescript
// __tests__/article-factory.spec.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ArticleCardFactory } from '@/components/news-hub/shared/factory/article-card-factory';
import type { Article } from '@/types/news';

describe('ArticleCardFactory (polymorphic rendering)', () => {
  const mockCaseStudy: Article = {
    id: 'cs-1',
    type: 'case-study',
    title: 'Case Study Example',
    // ... other fields
  };

  const mockPressRelease: Article = {
    id: 'pr-1',
    type: 'press-release',
    title: 'Press Release Example',
    // ... other fields
  };

  it('renders CaseStudyCard for case-study type', () => {
    const { getByText } = render(<ArticleCardFactory article={mockCaseStudy} />);
    expect(getByText('Case Study')).toBeInTheDocument();
  });

  it('renders PressReleaseCard for press-release type', () => {
    const { getByText } = render(
      <ArticleCardFactory article={mockPressRelease} />
    );
    expect(getByText('Press Release')).toBeInTheDocument();
  });

  it('handles unknown type gracefully', () => {
    const unknownArticle = {
      ...mockCaseStudy,
      type: 'unknown',
    } as any;

    const { getByText } = render(
      <ArticleCardFactory article={unknownArticle} />
    );
    expect(getByText(/unknown article type/i)).toBeInTheDocument();
  });
});
```

### E2E Test Coverage for Routing

**Use Playwright for routing validation:**

```typescript
// e2e/news-hub.spec.ts
import { test, expect } from "@playwright/test";

test.describe("News Hub Routing", () => {
  test("should load hub page", async ({ page }) => {
    await page.goto("/news-hub");
    await expect(page).toHaveTitle(/news|articles/i);
  });

  test("should load case study detail page", async ({ page }) => {
    await page.goto("/news-hub/case-studies/tesla-factory-renovation");
    await expect(page.locator("h1")).toContainText("Tesla Factory");
  });

  test("should return 404 for unknown article", async ({ page }) => {
    const response = await page.goto("/news-hub/case-studies/unknown-article");
    expect(response?.status()).toBe(404);
  });

  test("case study type badge renders", async ({ page }) => {
    await page.goto("/news-hub/case-studies/tesla-factory-renovation");
    await expect(page.locator("text=Case Study")).toBeVisible();
  });

  test("navigation to related articles works", async ({ page }) => {
    await page.goto("/news-hub/case-studies/tesla-factory-renovation");
    await page.click('a:has-text("Related Case Studies")');
    // Verify we're still on a valid case study page
    await expect(page).toHaveURL(/\/news-hub\/case-studies\/.+/);
  });
});
```

### Data Fetch Testing Requirements

**Test schema validation & error handling:**

```typescript
// data/news/case-studies/__tests__/helpers.spec.ts
import { describe, it, expect, beforeAll } from "vitest";
import { getCaseStudyBySlug, getAllCaseStudies } from "../helpers";

describe("Case Study Data Helpers", () => {
  it("returns null for unknown slug", async () => {
    const result = await getCaseStudyBySlug("unknown-slug");
    expect(result).toBeNull();
  });

  it("validates returned data against schema", async () => {
    const result = await getCaseStudyBySlug("valid-slug");
    if (result) {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("type", "case-study");
      expect(result).toHaveProperty("clientName");
      expect(result.publishedDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("returns featured articles in descending date order", async () => {
    const results = await getAllCaseStudies();
    const featured = results.filter((cs) => cs.featured);

    for (let i = 1; i < featured.length; i++) {
      const prev = new Date(featured[i - 1].publishedDate);
      const curr = new Date(featured[i].publishedDate);
      expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime());
    }
  });
});
```

### Accessibility Standards (WCAG 2.1 AA minimum)

**Requirements:**

- All images have `alt` text
- Color contrast ratio ≥ 4.5:1 for text
- Heading hierarchy: h1, h2, h3 (no skipping levels)
- Links have descriptive anchor text (not "click here")
- Form inputs have associated labels
- Interactive elements keyboard accessible
- Focus visible on all interactive elements

**Test with axe-core:**

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("News Hub Accessibility", () => {
  test("case study detail page complies with WCAG 2.1 AA", async ({ page }) => {
    await page.goto("/news-hub/case-studies/tesla-factory-renovation");
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test("hub list page has proper heading hierarchy", async ({ page }) => {
    await page.goto("/news-hub");
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();

    // Verify h1 exists and is first
    const firstHeading = headings[0];
    expect(await firstHeading.evaluate((el) => el.tagName)).toBe("H1");

    // Verify no skipped levels
    let prevLevel = 1;
    for (const heading of headings) {
      const tag = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tag[1]);
      expect(Math.abs(level - prevLevel)).toBeLessThanOrEqual(1);
      prevLevel = level;
    }
  });

  test("interactive elements keyboard accessible", async ({ page }) => {
    await page.goto("/news-hub");
    const card = page.locator("article").first();
    await card.focus();
    await page.keyboard.press("Enter");
    expect(page.url()).toContain("/news-hub/");
  });
});
```

---

## 9. Migration Rules

### Handling Existing Articles During Type Introduction

**Strategy: Gradual migration with dual-support period**

**Phase 1: Coexistence (Weeks 1-2)**

```typescript
// types/news-legacy.ts
export interface LegacyArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedDate: string;
  // NO type discriminator
}

// types/news.ts
export type Article = CaseStudy | PressRelease | Whitepaper;
export type AnyArticle = Article | LegacyArticle;

// Adapter function
export function adaptLegacyArticle(legacy: LegacyArticle): Article {
  // Infer type from metadata, tags, or ask user
  return {
    ...legacy,
    type: "case-study", // or infer from content analysis
    featured: false,
    readingTime: Math.ceil(legacy.content.split(/\s+/).length / 200),
    tags: [],
  };
}
```

**Phase 2: Migration (Weeks 2-4)**

Create migration script:

```typescript
// scripts/migrate-articles.ts
import { LegacyArticle } from "@/types/news-legacy";
import { adaptLegacyArticle } from "@/types/news";
import { writeFile } from "fs/promises";

async function migrateArticles() {
  const legacyArticles: LegacyArticle[] = []; // Load from DB/JSON

  const migratedByType = {
    "case-study": [] as any[],
    "press-release": [] as any[],
    whitepaper: [] as any[],
  };

  for (const legacy of legacyArticles) {
    const adapted = adaptLegacyArticle(legacy);
    migratedByType[adapted.type].push(adapted);
  }

  // Write to new structure
  await writeFile(
    "data/news/case-studies/data.ts",
    JSON.stringify(migratedByType["case-study"], null, 2),
  );
  // ... repeat for other types

  console.log(`✓ Migrated ${legacyArticles.length} articles`);
  console.log(`  - Case Studies: ${migratedByType["case-study"].length}`);
  console.log(`  - Press Releases: ${migratedByType["press-release"].length}`);
  console.log(`  - Whitepapers: ${migratedByType["whitepaper"].length}`);
}

migrateArticles().catch(console.error);
```

**Phase 3: Cutover (Week 4)**

- Remove `LegacyArticle` type
- Remove dual-rendering logic
- Point all routes to new structure
- Test all routes in staging
- Deploy to production

### Breaking Changes to types/news.ts

**Document all breaking changes:**

```typescript
// types/news.ts
/**
 * BREAKING CHANGES in v2.0.0 (2026-03)
 *
 * - Added required `type` discriminator field to all articles
 * - Renamed `author` to type-specific fields (e.g., `clientName` for case studies)
 * - Moved article metadata to separate schema files
 * - Removed `category` field (replaced with `type`)
 * - Required `readingTime` field (previously optional)
 *
 * MIGRATION GUIDE:
 * 1. Run `scripts/migrate-articles.ts`
 * 2. Update imports to use specific types (import { CaseStudy } ...)
 * 3. Update route handlers to use factory pattern
 * 4. Remove old component imports
 */
```

### Deprecation of Old Component Names

Use TypeScript deprecation comments:

```typescript
/**
 * @deprecated Since v2.0.0. Use CaseStudyCard instead.
 * This component will be removed in v3.0.0.
 */
export const ArticleCard = CaseStudyCard;

/**
 * @deprecated Since v2.0.0. Use CaseStudyDetailLayout, PressReleaseDetailLayout, or WhitepaperDetailLayout.
 */
export const ArticleDetail = () => null;
```

### Data Transformation Scripts Requirements

**All transformation scripts must:**

1. Validate input data before transformation
2. Log detailed migration report
3. Have dry-run mode
4. Create backups
5. Support rollback

```typescript
// scripts/transform-article-images.ts
import { getAllCaseStudies } from "@/data/news";
import { writeFile, readFile } from "fs/promises";

const DRY_RUN = process.env.DRY_RUN !== "false";

interface TransformReport {
  total: number;
  transformed: number;
  failed: string[];
  newImageUrls: Map<string, string>;
}

async function transformArticleImages() {
  const report: TransformReport = {
    total: 0,
    transformed: 0,
    failed: [],
    newImageUrls: new Map(),
  };

  // Backup original data
  if (!DRY_RUN) {
    const backup = JSON.stringify(await getAllCaseStudies(), null, 2);
    await writeFile("data/news/case-studies/data.backup.json", backup);
  }

  const articles = await getAllCaseStudies();
  report.total = articles.length;

  for (const article of articles) {
    try {
      const newUrl = transformImageUrl(article.imageUrl);
      report.newImageUrls.set(article.slug, newUrl);
      report.transformed++;

      if (!DRY_RUN) {
        // Update article
        article.imageUrl = newUrl;
      }
    } catch (error) {
      report.failed.push(`${article.slug}: ${String(error)}`);
    }
  }

  // Log report
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Transform Report (${DRY_RUN ? "DRY RUN" : "LIVE"})`);
  console.log(`${"=".repeat(50)}`);
  console.log(`Total articles: ${report.total}`);
  console.log(`Successfully transformed: ${report.transformed}`);
  console.log(`Failed: ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.log("\nFailed:");
    report.failed.forEach((msg) => console.log(`  - ${msg}`));
  }

  if (!DRY_RUN) {
    console.log(
      "\n✓ Transformation complete. Backup saved to data/news/case-studies/data.backup.json",
    );
  }
}

transformArticleImages().catch(console.error);
```

---

## 10. Documentation Requirements

### JSDoc Requirements per Component

**Every component must have JSDoc commentary:**

````typescript
/**
 * Case Study Card Component
 *
 * Renders a featured case study with image, metadata, and call-to-action.
 *
 * @component
 * @example
 * ```tsx
 * const cs = await getCaseStudyBySlug('tesla-factory');
 * return <CaseStudyCard caseStudy={cs} variant="full" />
 * ```
 *
 * @param props - Component props
 * @param props.caseStudy - CaseStudy object (validated against CaseStudySchema)
 * @param props.variant - Card size variant: 'compact' (h-32) or 'full' (h-48). Default: 'full'
 * @param props.className - Optional Tailwind classes to merge
 *
 * @returns JSX element for the card
 *
 * @throws Does not throw. Invalid data should be validated upstrea using getCaseStudyBySlug
 *
 * @see [CaseStudy Schema](./schema.ts)
 * @see [Case Study Detail Layout](./case-study-detail-layout.tsx) for full article view
 */
export function CaseStudyCard(props: CaseStudyCardProps) {
  // ...
}
````

### README.md in Each Type Folder

**Create `components/news-hub/<type>/README.md`:**

```markdown
# Case Study Components

## Overview

Components for rendering Case Study articles in the news hub system.

## Components

### CaseStudyCard

Renders a card for case study previews in lists.

**Location:** `case-study-card.tsx`  
**Props:** `CaseStudyCardProps`  
**Used in:** Hub list pages, related articles sections

### CaseStudyHero

Hero section for individual case study pages.

**Location:** `case-study-hero.tsx`  
**Props:** `CaseStudyHeroProps`  
**Features:** Breadcrumb, client badge, industry metadata

### CaseStudyDetailLayout

Full page layout for case study articles.

**Location:** `case-study-detail-layout.tsx`  
**Props:** `CaseStudyDetailLayoutProps`  
**Orchestrates:** Hero, content, related articles

## Adding a New Case Study

1. Add entry to `data/news/case-studies/data.ts`
2. Ensure all required fields per CaseStudySchema
3. Run `pnpm build` and verify prerendering
4. Test at `/news-hub/case-studies/[slug]`

## Data Structure

See `data/news/case-studies/schema.ts` for validation rules.

Required fields:

- id, type, title, slug, excerpt, imageUrl, publishedDate, content
- clientName, industry

Optional fields:

- featured, readingTime, tags, metrics, challenge, solution, results

## Styling

All components use Tailwind CSS with consistent utility patterns.
See [styling conventions](../../README.md#styling-conventions).
```

### Design Decision Documentation (ADR Style)

**Create `.github/adr/ADR-001-polymorphic-factory.md`:**

````markdown
# ADR-001: Polymorphic Factory Pattern for Article Types

**Status:** Accepted in v2.0.0 (2026-03)  
**Deciders:** Engineering team  
**Date:** 2026-03-27

## Context

We need to support multiple article types (Case Studies, Press Releases, Whitepapers) with
different rendering logic, metadata, and structure. The system must:

1. Support adding new article types without modifying existing type components
2. Maintain type safety at compile time
3. Enable clean routing (same route structure for all types)
4. Allow type-specific UI customization

## Decision

Use **discriminated union types** + **polymorphic factory pattern** for article routing.

### Technical Approach

1. Define a `type` discriminator on all articles
2. Use TypeScript's type narrowing (switch on discriminator)
3. Create factory components that route to type-specific renderers
4. Leverage exhaustiveness checking for compile-time safety

### Example

```typescript
// Union type with discriminator
type Article = CaseStudy | PressRelease | Whitepaper;

// Factory component with exhaustiveness check
function ArticleCardFactory(article: Article) {
  switch (article.type) {
    case 'case-study': return <CaseStudyCard {article} />;
    case 'press-release': return <PressReleaseCard {article} />;
    case 'whitepaper': return <WhitepaperCard {article} />;
    default: const _: never = article; // Compile-time safety
  }
}
```
````

## Consequences

### Positive

- ✅ Type-safe at compile time
- ✅ Easy to add new article types (add type + case in factory)
- ✅ Clear visual distinction between article types
- ✅ Encourages single responsibility (each factory handles one concern)
- ✅ No shared component logic pollution

### Negative

- ⚠ More component files (one per type)
- ⚠ Potential code duplication in styling/layouts
- ⚠ Must remember to update factory when adding types

## Alternatives Considered

1. **Single "ArticleCard" component with type checking in props**
   - Rejected: Would require type narrowing props, less clean
2. **Render props pattern**
   - Rejected: More complex, less readable than factory
3. **Strategy pattern with class hierarchy**
   - Rejected: Overkill for React components, TypeScript not ideal

## References

- [Discriminated Unions - TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)
- [Factory Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/factory-method)

````

### Migration Guide for Existing Content

**Create `.github/guides/MIGRATION_GUIDE_V2.md`:**

```markdown
# News Hub v2.0 Migration Guide

## Overview

News Hub v2.0 introduces multi-article-type support with a new data structure and routing system.

## What Changed

| Aspect | v1.0 | v2.0 |
|---|---|---|
| Article structure | Flat (no type) | Discriminated by type |
| Components | Generic ArticleCard | Type-specific cards |
| Routes | `/news-hub/[slug]` | `/news-hub/[type]/[slug]` |
| Data location | Single data.ts | Organized by type in data/news/ |
| Validation | Manual checks | Zod schemas |

## Migration Steps

### 1. Backup Existing Articles

```bash
cp -r data/articles data/articles.backup.v1
````

### 2. Run Migration Script

```bash
pnpm run migrate:articles
```

This will:

- Analyze your existing articles
- Classify by type (or prompt for manual classification)
- Transform to new schema
- Write to `data/news/<type>/data.ts`

### 3. Update Route Handlers

Old routes:

```typescript
// OLD: app/news-hub/[slug]/page.tsx
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);
  return <ArticleDetail article={article} />;
}
```

New routes:

```typescript
// NEW: app/news-hub/case-studies/[slug]/page.tsx
export default async function CaseStudyPage({ params }) {
  const caseStudy = await getCaseStudyBySlug(params.slug);
  return <CaseStudyDetailLayout caseStudy={caseStudy} />;
}

// Also for press-releases/, whitepapers/
```

### 4. Update Links

```typescript
// OLD
<Link href={`/news-hub/${article.slug}`}>{article.title}</Link>

// NEW: Use helper
<Link href={`/news-hub/case-studies/${caseStudy.slug}`}>{caseStudy.title}</Link>

// OR: Use factory to determine URL
function getArticleUrl(article: Article): string {
  return `/news-hub/${article.type}s/${article.slug}`;
}
```

### 5. Verify

```bash
pnpm build  # Should prerender all articles without error
pnpm test   # Run integration tests
```

### Rollback

If issues arise:

```bash
rm -rf data/news
mv data/articles.backup.v1 data/articles
git checkout app/news-hub  # Restore old route handlers
```

## Troubleshooting

**Q: Articles not showing in hub list**  
A: Ensure `featured: true` is set for articles you want displayed.

**Q: Build fails with "Unknown article type"**  
A: Check that all articles have valid `type` discriminator (`'case-study'`, `'press-release'`, or `'whitepaper'`).

**Q: Links are broken**  
A: Update links to use new route pattern: `/news-hub/[type]/[slug]`

## Support

For issues, refer to:

- [Implementation Standards](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md)
- [Data Layer](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#3-data-layer-integration)
- Slack: #news-hub-support

```

---

## Summary

This comprehensive standards document provides:

✅ **Coding Standards** - TypeScript, naming, export patterns, prop definitions
✅ **Component Rules** - Folder structure, creation workflows, factory pattern
✅ **Data Layer** - Schema organization, validation, helper naming
✅ **Routing** - URL patterns, static generation, query validation
✅ **Type Safety** - Zod schemas, discriminated unions, type guards
✅ **SEO** - Metadata, OG images, structured data, canonical URLs
✅ **Performance** - ISR strategies, image optimization, code splitting
✅ **Testing** - Component tests, E2E coverage, accessibility
✅ **Migration** - Phased approach, deprecation, transformation scripts
✅ **Documentation** - JSDoc, READMEs, ADRs, migration guides

All sections include **code examples** and **actionable guidelines** ready for developer implementation.
```
