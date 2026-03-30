# ADR-008: Polymorphic Factory Pattern for Multi-Article-Type System

**Status:** Accepted  
**Date:** 2026-03-30  
**Deciders:** Engineering Team  
**Version:** 2.0.0

## Context

The news hub system needs to support multiple article types (Case Studies, Press Releases, Whitepapers, and potentially more) with:

1. Different component renderings for each type
2. Unique metadata and fields per type
3. Type-specific routing and SEO strategies
4. The ability to add new types without breaking existing code
5. Full type safety at compile-time

**Previous approach** (v1.0):

- Single flat "Article" type with optional fields
- Generic components that tried to fit all types
- Type detection at runtime with string comparisons
- Difficult to add new types without touching many files
- No TypeScript exhaustiveness checking

## Decision

Use **discriminated union types** combined with a **polymorphic factory pattern** for article routing and rendering.

### Technical Approach

#### 1. Discriminated Union Type

Every article has a required `type` field that acts as a discriminator:

```typescript
// Types are completely separate, each with their own schema
type CaseStudy = {
  type: "case-study";
  clientName: string;
  industry: string;
  // ... case-study-specific fields
};

type PressRelease = {
  type: "press-release";
  location: string;
  contactEmail?: string;
  // ... press-release-specific fields
};

// Union that combines all types
type Article = CaseStudy | PressRelease | Whitepaper;
```

#### 2. TypeScript Type Narrowing

After checking the discriminator, TypeScript automatically narrows the type:

```typescript
if (article.type === "case-study") {
  // TypeScript now knows: article is CaseStudy
  console.log(article.clientName); // ✓ Property exists
  console.log(article.location); // ✗ Compile error
}
```

#### 3. Polymorphic Factory Components

Factory components route to type-specific renderers with exhaustiveness guarantees:

```typescript
export function ArticleCardFactory(article: Article) {
  switch (article.type) {
    case 'case-study':
      return <CaseStudyCard caseStudy={article} />;

    case 'press-release':
      return <PressReleaseCard release={article} />;

    case 'whitepaper':
      return <WhitepaperCard whitepaper={article} />;

    default:
      // TypeScript: If a new type is added to Article union
      // and not handled here, this line causes a compile error
      const _exhaustive: never = article;
      console.error('Unknown article type:', _exhaustive);
      return null;
  }
}
```

#### 4. Schema-Driven Type Generation

Each article type has a Zod schema. Types are inferred from schemas, not hand-written:

```typescript
// Define schema once (source of truth)
const CaseStudySchema = z.object({
  type: z.literal("case-study"),
  clientName: z.string(),
  industry: z.string(),
  // ...
});

// Type automatically inferred
type CaseStudy = z.infer<typeof CaseStudySchema>;
```

### File Organization

```
data/news/
├── case-studies/
│   ├── schema.ts       # Zod schema (source of truth)
│   ├── types.ts        # type CaseStudy = z.infer<typeof CaseStudySchema>
│   ├── data.ts         # Array of case studies
│   ├── helpers.ts      # getCaseStudyBySlug, etc.
│   └── index.ts        # Re-exports
├── press-releases/     # Same structure
├── whitepapers/        # Same structure
└── index.ts            # Single aggregation point for all exports

components/news-hub/
├── shared/
│   └── factory/
│       ├── article-card-factory.tsx       # Routes to type-specific cards
│       └── article-detail-factory.tsx     # Routes to type-specific layouts
├── case-studies/
│   ├── case-study-card.tsx
│   ├── case-study-hero.tsx
│   └── case-study-detail-layout.tsx
├── press-releases/     # Similar structure
└── whitepapers/        # Similar structure

app/news-hub/
├── page.tsx            # Hub list (uses factory for all types)
├── case-studies/
│   ├── page.tsx        # Optional type-specific list page
│   └── [slug]/
│       └── page.tsx    # Detail page
├── press-releases/     # Similar structure
└── whitepapers/        # Similar structure
```

## Consequences

### Advantages ✅

1. **Type Safety at Compile-Time**
   - TypeScript catches type mismatches during build
   - No stringly-typed type checks at runtime
   - Exhaustiveness checking prevents missing handlers

2. **Adding New Types is Straightforward**
   - Create schema → Generate type → Create components → Add factory case
   - Only 4 files need changes (schema, components, factory, route)
   - No modifications to existing article types

3. **Clear Separation of Concerns**
   - Each type lives in its own folder
   - Type-specific logic doesn't leak into shared code
   - Easy to reason about complexity

4. **Single Responsibility**
   - CaseStudyCard only knows how to render a Case Study
   - Factory only knows how to route
   - No bloated generic components

5. **Data Validation is Centralized**
   - Every type has a Zod schema
   - Parsing happens once at data fetch time
   - No runtime surprises

6. **Extensibility**
   - Adding Case Study-specific features (e.g., metrics display) doesn't affect other types
   - New optional fields can be added to schemas without breaking existing code
   - Could eventually support tags-based rendering or other filtering

### Disadvantages ⚠️

1. **More Component Files**
   - Each type needs card + hero + detail layout
   - More to maintain, but provides clarity

2. **Potential Code Duplication**
   - Card components may share similar structure
   - Mitigation: Extract common UI patterns into `shared/` folder
   - Examples: `ArticleCardSkeleton`, `ArticleMetadata`, `ArticleHeroImage`

3. **Onboarding Complexity**
   - Developers new to system need to understand discriminated unions
   - Mitigation: Quick reference guide and well-documented examples

4. **Must Update Factory When Adding Types**
   - Forgetting to add case in factory is caught by TypeScript (compiler error)
   - Good because it forces awareness, not a true disadvantage

## Alternatives Considered

### 1. Generic "ArticleCard" Component with Runtime Checks

```typescript
// ❌ REJECTED
function ArticleCard({ article, renderAs }: { article: any; renderAs: string }) {
  if (renderAs === 'case-study') {
    return <div>{(article as CaseStudy).clientName}</div>;
  }
  // ... more checks
}
```

**Rejected because:**

- Type casting loses type safety
- Hard to discover what fields are available
- No compiler help for missing type handlers
- Mixing concerns in one component

### 2. Render Props Pattern

```typescript
// ❌ REJECTED
function ArticleCard({
  article,
  renderCaseStudy,
  renderPressRelease,
}: {
  article: Article;
  renderCaseStudy: (cs: CaseStudy) => ReactNode;
  renderPressRelease: (pr: PressRelease) => ReactNode;
}) {
  if (article.type === 'case-study') {
    return renderCaseStudy(article);
  }
  // ...
}

// Usage (very verbose)
<ArticleCard
  article={article}
  renderCaseStudy={(cs) => <CaseStudyCardContent {cs} />}
  renderPressRelease={(pr) => <PressReleaseCardContent {pr} />}
/>
```

**Rejected because:**

- More verbose
- Less readable
- Forces prop drilling
- Factory pattern is cleaner

### 3. Component Registry / Plugin System

```typescript
// ❌ REJECTED (overkill for this use case)
const componentRegistry = {
  'case-study': CaseStudyCard,
  'press-release': PressReleaseCard,
};

function renderArticle(article: Article) {
  const Component = componentRegistry[article.type];
  return <Component article={article} />;
}
```

**Rejected because:**

- Over-engineered for the current scope
- Harder to trace where components come from
- Less IDE support for code navigation
- Factory switch is simpler and just as effective

### 4. Strategy Pattern with Classes

```typescript
// ❌ REJECTED (not idiomatic React)
abstract class ArticleRenderer {
  abstract render(article: Article): ReactNode;
}

class CaseStudyRenderer extends ArticleRenderer {
  render(article: CaseStudy) {
    /* ... */
  }
}
```

**Rejected because:**

- OOP patterns are less idiomatic in React
- Requires more boilerplate
- TypeScript's functional type narrowing is more elegant

## Migration Strategy

### Phase 1: Coexistence (Weeks 1-2)

- New types use discriminated union system
- Old articles temporarily supported via adapter
- Both routing systems available in parallel

### Phase 2: Migration (Weeks 2-4)

- Run migration script to transform existing articles
- Point routes to new components
- Verify all links work
- Keep old components as fallback

### Phase 3: Cleanup (Week 4+)

- Remove old components and types
- Remove fallback logic
- Deprecate old data format
- Full cutover to v2.0

## Verification

### Build-Time Checks

- TypeScript compilation: verifies discriminator and case coverage
- `generateStaticParams()`: ensures all articles prerendered
- Eslint: checks for unused imports, proper naming

### Runtime Checks

- Zod schema validation: ensures data conforms before rendering
- Try-catch in data helpers: handles schema validation errors
- Error boundary: catches rendering errors gracefully

### Testing

- Unit: Component snapshot tests (verify output shape)
- Integration: Factory tests (verify routing logic)
- E2E: Playwright tests (verify routes and user flows)
- Accessibility: axe-core automated accessibility checks

## References

- **TypeScript Handbook - Discriminated Unions:** https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
- **Zod - TypeScript Schema Validation:** https://zod.dev/
- **Factory Pattern (Refactoring Guru):** https://refactoring.guru/design-patterns/factory-method
- **React Type Safety:** https://react-typescript-cheatsheet.netlify.app/
- **Visual Studio Code - Type Narrowing:** https://code.visualstudio.com/Docs/typescript/typescript-editing

## Related ADRs

- ADR-007: Zod Schema-First Data Validation
- ADR-009: ISR Caching Strategy for News Hub
- ADR-010: SEO Metadata Generation Architecture

## Questions & Answers

**Q: What if I need to add a field that applies to all types?**  
A: Add to each schema separately. If truly universal, create a base schema and extend it per type.

**Q: Can I create a component used by multiple types?**  
A: Yes, put it in `components/news-hub/shared/` folder. Examples: ArticleMetadata, ArticleHeroImage.

**Q: What if the factory gets too large?**  
A: That's a good sign you should add more types. The switch statement clarity is worth it up to ~10 types. Beyond that, consider a registry.

**Q: How do I handle rendering errors gracefully?**  
A: Use React error boundaries around factory, or return error component from individual type components.

**Q: Will this approach work for filtering mixed article types?**  
A: Yes! Use discriminated union type guards to narrow before accessing type-specific fields.

---

**Document Owner:** Engineering Team  
**Last Reviewed:** 2026-03-30  
**Next Review:** 2026-06-30 (after launch feedback)
