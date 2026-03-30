# News Hub Multi-Article-Type System

## Implementation Framework & Standards

**Status:** Authoritative Standards (v2.0.0)  
**Date:** March 30, 2026  
**Scope:** electrical-website news-hub

---

## 📋 Overview

This directory contains the complete implementation framework for the multi-article-type news hub system, including coding standards, architectural decisions, implementation guides, and verification checklists.

**What this solves:**

- Scattered standards → single source of truth
- Unclear patterns → codified best practices
- Inconsistent implementations → reproducible checklist
- Type safety gaps → discriminated union patterns
- Onboarding friction → quick reference guide

---

## 📚 Documents

### 1. **[NEWS_HUB_IMPLEMENTATION_STANDARDS.md](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md)**

**The Authoritative Playbook** (8,000+ words)

Comprehensive engineering standards covering:

- ✅ **Coding Standards**: TypeScript, naming conventions, export patterns, prop definitions, client vs server components
- ✅ **Component Development Rules**: Folder structure, creation workflows (card, hero, detail layout), factory pattern
- ✅ **Data Layer Integration**: File organization, schema requirements, helper naming, aggregation patterns
- ✅ **Routing Conventions**: URL patterns, file naming, dynamic segments, query validation, ISR strategy
- ✅ **Type Safety & Validation**: Zod schemas, discriminated unions, type guards, error handling
- ✅ **SEO & Metadata Standards**: Metadata export, OG images, canonical URLs, structured data, robots.txt
- ✅ **Performance & Caching**: ISR revalidation times, static prerendering, image optimization, code splitting, bundle guidelines
- ✅ **Testing Requirements**: Component snapshots, integration tests, E2E coverage, accessibility (WCAG 2.1 AA)
- ✅ **Migration Rules**: Phased cutover strategy, deprecation, data transformation scripts
- ✅ **Documentation Requirements**: JSDoc standards, READMEs, ADRs, migration guides

**Use When:** You need definitive answers on any implementation detail.

---

### 2. **[NEWS_HUB_QUICK_REFERENCE.md](./NEWS_HUB_QUICK_REFERENCE.md)**

**Developer Quick Guide** (1,500 words)

Fast-reference companion:

- 7-step guide to adding a new article type
- Naming patterns quick table
- Common patterns (factory, type narrowing, etc.)
- Checklist for new types
- Quick troubleshooting guide

**Use When:** Actively implementing and need quick answers or pattern examples.

---

### 3. **[ADR-008-polymorphic-factory-pattern.md](../adr/ADR-008-polymorphic-factory-pattern.md)**

**Architectural Decision Record**

Explains the design decision:

- ✅ Context: Why we needed this system
- ✅ Decision: Discriminated unions + factory pattern
- ✅ Consequences: Advantages and disadvantages
- ✅ Alternatives considered: Why each was rejected
- ✅ Migration strategy: Phased approach
- ✅ Verification: Build-time and runtime checks
- ✅ Q&A: Common questions answered

**Use When:** You need to understand WHY a decision was made, or explaining to others.

---

### 4. **[NEWS_HUB_IMPLEMENTATION_CHECKLIST.md](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md)**

**Phase-by-Phase Implementation Checklist** (3,500+ words)

7-phase verification for each new article type:

- Phase 0: Planning
- Phase 1: Data Layer (schema → helpers)
- Phase 2: Components (card → hero → detail)
- Phase 3: Routing (page.tsx, metadata, generateStaticParams)
- Phase 4: Tests (component, factory, data, E2E)
- Phase 5: Validation (TypeScript, routes, SEO, performance, accessibility)
- Phase 6: Code Quality (linting, review standards, documentation)
- Phase 7: Deployment (commit, PR, CI, merge)

**Use When:** Implementing a new article type - copy, check items off, attach to PR.

---

## 🚀 Quick Start

### Implementing a New Article Type

**Time Estimate:** 3-4 hours

1. **Check standards** - Read relevant sections of [NEWS_HUB_IMPLEMENTATION_STANDARDS.md](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md)
2. **Reference patterns** - Use [NEWS_HUB_QUICK_REFERENCE.md](./NEWS_HUB_QUICK_REFERENCE.md)
3. **Follow the flow** - Use [NEWS_HUB_IMPLEMENTATION_CHECKLIST.md](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md)
4. **Understand the why** - Review [ADR-008](../adr/ADR-008-polymorphic-factory-pattern.md) for architectural context

**File Structure to Create:**

```
data/news/<type>/
├── schema.ts          # Zod validation (source of truth)
├── types.ts           # TypeScript type inference
├── data.ts            # Sample data
├── helpers.ts         # get<Type>BySlug, etc.
└── index.ts           # Re-exports

components/news-hub/<type>/
├── <type>-card.tsx              # Card component
├── <type>-hero.tsx              # Hero component
├── <type>-detail-layout.tsx     # Detail layout
├── __tests__/
│   └── <type>-card.spec.ts
├── README.md
└── index.ts

app/news-hub/<type-name>/
├── layout.tsx
└── [slug]/
    ├── page.tsx        # Main page (generateStaticParams, generateMetadata)
    ├── layout.tsx
    └── not-found.tsx
```

**Example: Adding "Whitepaper" Type**

```bash
# Phase 1: Data
mkdir -p data/news/whitepapers
# Create schema.ts, types.ts, data.ts, helpers.ts

# Phase 2: Components
mkdir -p components/news-hub/whitepapers/__tests__
# Create whitepaper-card.tsx, whitepaper-hero.tsx, whitepaper-detail-layout.tsx

# Phase 3: Routes
mkdir -p app/news-hub/whitepapers/[slug]
# Create page.tsx, layout.tsx, not-found.tsx

# Phase 4: Tests
# Create __tests__ files

# Phase 5-7: Validate and deploy
pnpm build
pnpm lint
# Test locally, create PR
```

---

## 📏 Key Standards at a Glance

### Naming Conventions

| Item            | Pattern                        | Example                                            |
| --------------- | ------------------------------ | -------------------------------------------------- |
| Component       | `<Type><Purpose>`              | `WhitepaperCard`, `CaseStudyHero`                  |
| Helper function | `get<Type><Modifier>()`        | `getWhitepaperBySlug()`, `getWhitepaperFeatured()` |
| Route           | `/news-hub/<type-name>/[slug]` | `/news-hub/whitepapers/renewable-energy-guide`     |
| Type            | `<Type>`                       | `Whitepaper`, `CaseStudy`                          |
| Schema          | `<Type>Schema`                 | `WhitepaperSchema`                                 |
| Discriminator   | `lowercase-kebab`              | `'whitepaper'`, `'case-study'`                     |

### File Organization

**Rule:** Each article type → its own folder with complete isolation.

```
data/news/<type>/          # Data layer (schema, helpers, data)
components/news-hub/<type>/  # UI layer (card, hero, detail)
app/news-hub/<type-name>/  # Routing layer (page.tsx, dynamic segments)
```

### Component Development

**Rule:** Server Component by default, `"use client"` only for browser interactivity.

```typescript
// ✅ Server component (default)
export function WhitepaperCard({ whitepaper }: Props) {
  return <div>{whitepaper.title}</div>;
}

// ✓ Client component only for interactivity
'use client';
export function WhitepaperCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  return <div>{...carousel logic...}</div>;
}
```

### Type Safety

**Rule:** Discriminated union with exhaustiveness checking.

```typescript
// All types must have a type discriminator
type Article = Whitepaper | CaseStudy | PressRelease;

// Switch statements must be exhaustive
switch (article.type) {
  case 'whitepaper': return <WhitepaperCard {...} />;
  case 'case-study': return <CaseStudyCard {...} />;
  case 'press-release': return <PressReleaseCard {...} />;
  default: const _: never = article; // TypeScript error if missing
}
```

### Validation

**Rule:** Always validate with Zod, never skip schema checks.

```typescript
// ✅ Validate every time
const result = WhitepaperSchema.parse(rawData);

// ❌ Don't skip
const article = rawData as Whitepaper;
```

### SEO

**Rule:** Every detail page exports metadata with OG tags.

```typescript
export async function generateMetadata(props) {
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: { title, description, images: [image] },
    robots: { index: true },
  };
}
```

### Performance

**Rule:** ISR revalidation with static prerendering.

```typescript
// Prerender all articles at build time
export async function generateStaticParams() {
  return (await getAllWhitepapers()).map((w) => ({ slug: w.slug }));
}

// Revalidate every hour
export const revalidate = 3600;

// Allow new articles without rebuild
export const dynamicParams = true;
```

---

## 🔍 Common Scenarios

### Adding a New Article Type

**→ Start here:**

1. Review [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 2](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#2-component-development-rules)
2. Follow [NEWS_HUB_QUICK_REFERENCE.md - Quick Start](./NEWS_HUB_QUICK_REFERENCE.md#adding-a-new-article-type)
3. Use [NEWS_HUB_IMPLEMENTATION_CHECKLIST.md](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md)

### Understanding the Architecture

**→ Start here:**

1. Read [ADR-008](../adr/ADR-008-polymorphic-factory-pattern.md)
2. Review [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 1.2-1.5](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#component-development-rules) (factory pattern)

### Creating a Component

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 2](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#2-component-development-rules)
2. Reference code examples in each subsection (2.3, 2.4, 2.5)

### Setting Up Data Layer

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 3](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#3-data-layer-integration)
2. Code examples at 3.1-3.4

### Implementing Routing

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 4](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#4-routing-conventions)
2. Boilerplate template at 4.3

### Testing & Validation

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 5, 8](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#5-type-safety--validation)
2. [NEWS_HUB_IMPLEMENTATION_CHECKLIST.md - Phase 4 & 5](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md#phase-4-tests)

### SEO & Metadata

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 6](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#6-seo--metadata-standards)
2. Code examples at 6.1-6.4

### Performance Optimization

**→ Start here:**

1. [NEWS_HUB_IMPLEMENTATION_STANDARDS.md - Section 7](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md#7-performance--caching)
2. Specific requirements at 7.1-7.4

---

## ✅ Quality Assurance

### Before Creating a PR

**Use this checklist:**

```bash
# 1. Code Quality
pnpm lint          # ✓ No errors
pnpm build          # ✓ Builds successfully

# 2. Type Safety
# Check TypeScript catches errors:
# - Missing type discriminator?
# - Incomplete factory switch?

# 3. Routing & SEO
# Navigate to /news-hub/<type-name>/example-slug
# Check Page Source for metadata tags

# 4. Performance
# Run in Chrome DevTools Lighthouse
# Target: Performance > 80, SEO > 90

# 5. Accessibility
# Use axe DevTools Chrome extension
# Target: WCAG 2.1 AA compliant

# 6. Tests
pnpm test           # ✓ All tests pass

# 7. Documentation
# Review JSDoc comments
# Check README.md present
```

### PR Template

Include in pull request description:

```markdown
## Changes

- Added Whitepaper article type support
- Files: data/news/whitepapers, components/news-hub/whitepapers, app/news-hub/whitepapers
- Updated: data/news/index.ts, factory components, type union

## Testing

- [ ] Build succeeds: `pnpm build`
- [ ] Types verified: `pnpm build` (no TypeScript errors)
- [ ] Routes tested: /news-hub/whitepapers/example-slug loads
- [ ] Metadata present: title, description, OG tags in source
- [ ] SEO validated: Lighthouse > 80/90
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Tests pass: `pnpm test`

## References

- [Implementation Standards](../standards/NEWS_HUB_IMPLEMENTATION_STANDARDS.md)
- [ADR-008: Factory Pattern](../adr/ADR-008-polymorphic-factory-pattern.md)
- [Quick Reference](../standards/NEWS_HUB_QUICK_REFERENCE.md)
```

---

## 🎯 Implementation Success Criteria

✅ **All of the following must be true:**

1. **Data Layer**
   - Schema with all required fields
   - Sample data passes schema validation
   - Helpers implement all standard functions

2. **Components**
   - Card, Hero, DetailLayout created
   - All are Server Components (except interactive leaves)
   - JSDoc comments present
   - Exported from folder index.ts

3. **Routing**
   - Detail page at /news-hub/<type-name>/[slug]
   - generateStaticParams and generateMetadata implemented
   - revalidate set to 3600 (ISR)
   - dynamicParams = true
   - notFound() called for invalid slugs

4. **Type Safety**
   - Type added to Article union
   - Factory pattern updated with case
   - TypeScript compilation passes with no errors
   - Exhaustiveness check in factory

5. **Testing**
   - Component snapshots pass
   - At least 3 test cases per component
   - E2E routes tested
   - All tests pass: `pnpm test`

6. **SEO & Performance**
   - Metadata exports with title, description, OG
   - Lighthouse Performance > 80, SEO > 90
   - Images optimized using next/image
   - No console errors

7. **Accessibility**
   - Images have alt text
   - Color contrast > 4.5:1
   - Heading hierarchy correct
   - WCAG 2.1 AA compliant

8. **Code Quality**
   - `pnpm lint` passes
   - `pnpm build` succeeds
   - No `any` types
   - No unused variables
   - JSDoc complete

9. **Documentation**
   - README in component folder
   - Migration guide if needed
   - ADR reference in code comments

10. **Deployment**
    - PR reviewed and approved
    - CI passing (lint, build, tests)
    - No merge conflicts
    - Ready to deploy 🚀

---

## 📖 Learning Path

**New to the system?** Follow this order:

1. **Understand the why** → Read [ADR-008](../adr/ADR-008-polymorphic-factory-pattern.md) (~15 min)
2. **Learn the standards** → Skim [NEWS_HUB_IMPLEMENTATION_STANDARDS.md](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md) (~20 min)
3. **Get patterns** → Read [NEWS_HUB_QUICK_REFERENCE.md](./NEWS_HUB_QUICK_REFERENCE.md) (~10 min)
4. **Follow the checklist** → Use [NEWS_HUB_IMPLEMENTATION_CHECKLIST.md](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md) (~3 hours implementation + testing)

**Total time:** 4-5 hours to go from nothing to merged PR

---

## 🤝 Getting Help

**Question?** Check this order:

1. **Quick answer needed** → [NEWS_HUB_QUICK_REFERENCE.md](./NEWS_HUB_QUICK_REFERENCE.md) (1 min)
2. **Pattern / example needed** → [NEWS_HUB_IMPLEMENTATION_STANDARDS.md](./NEWS_HUB_IMPLEMENTATION_STANDARDS.md) section (5 min)
3. **Why was this decided?** → [ADR-008](../adr/ADR-008-polymorphic-factory-pattern.md) (10 min)
4. **Step-by-step process** → [NEWS_HUB_IMPLEMENTATION_CHECKLIST.md](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md) (reference while building)
5. **Still stuck?** → Ask in Slack #engineering or create issue

---

## 📊 Metrics & Monitoring

Track implementation success:

- **Code Coverage:** Component test coverage > 80%
- **Build Time:** Full build < 60s
- **Page Load:** First Contentful Paint < 2s
- **Lighthouse:** Performance > 80, SEO > 90, A11y > 95
- **Type Safety:** 0 TypeScript errors
- **Bundle Size:** Per-route bundle < 100KB gzipped

---

## 🔄 Continuous Improvement

This standards document is living.

**To propose changes:**

1. Create branch: `docs/news-hub-standards-update`
2. Update relevant section(s)
3. Create PR with rationale
4. Update version number and "Last Updated" date
5. Tag #engineering for review

**Version History:**

- v2.0.0 (2026-03-30): Initial multi-article-type system standards
- v2.1.0 (TBD): Post-launch refinements based on feedback

---

## 📋 Document Metadata

| Aspect           | Value                         |
| ---------------- | ----------------------------- |
| **Version**      | 2.0.0                         |
| **Status**       | Authoritative / Active        |
| **Last Updated** | 2026-03-30                    |
| **Scope**        | electrical-website news-hub   |
| **Owner**        | Engineering Team              |
| **Review Cycle** | Every 6 months or post-launch |
| **Related ADRs** | ADR-008 (Factory Pattern)     |

---

**Ready to implement? Start with the [Quick Reference](./NEWS_HUB_QUICK_REFERENCE.md) or jump to the [Checklist](./NEWS_HUB_IMPLEMENTATION_CHECKLIST.md).**
