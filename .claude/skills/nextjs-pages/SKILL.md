---
name: nextjs-pages
description: Use before writing any new Next.js page or route to determine the correct rendering strategy. Trigger phrases: new page, add a route, SSG, ISR, SSR, PPR, revalidate, dynamic route, data fetching.
argument-hint: "[describe the page: what data it shows and how often it changes]"
disable-model-invocation: true
---

# Next.js Pages — Rendering Decision

Every new page goes through this decision tree before writing code.

## Decision Tree

```
Step 1: Is ALL content known at build time and it never changes?
  YES → SSG (default)
        No special config. Server Component with no await on dynamic APIs.
        Example: /about, /services/emergency, static marketing pages.

Step 2: Does content update on a schedule (minutes to days)?
  YES → ISR
        Add at the route segment level (page.tsx or layout.tsx):
        export const revalidate = N  // N in seconds

        Examples:
          export const revalidate = 3600  // refresh hourly
          export const revalidate = 86400 // refresh daily
          export const revalidate = 0     // always fresh (same as SSR)

        Use for: news articles, project listings, service pages that update occasionally.

Step 3: Does every request need fresh data? (auth, personalisation, search, cart)
  YES → SSR
        export const dynamic = 'force-dynamic'

        Also auto-opted in by: cookies(), headers(), searchParams at page root.
        Use for: dashboards, account pages, search results, checkout.

Step 4: Does the page have BOTH a static shell AND dynamic sections?
  YES → PPR (Partial Pre-rendering)
        REQUIRES: next.config.ts → experimental: { ppr: true }

        Pattern:
        // page.tsx
        export default function Page() {
          return (
            <main>
              <StaticHero />           {/* rendered at build time */}
              <Suspense fallback={<Skeleton />}>
                <DynamicSection />     {/* rendered per-request */}
              </Suspense>
            </main>
          );
        }

        CRITICAL RULE: never await cookies(), headers(), or searchParams at
        the page root. Pass the promise DOWN to the Suspense-wrapped child:

        // ✅ Correct
        export default function Page({ searchParams }) {
          return (
            <Suspense>
              <ResultList searchParamsPromise={searchParams} />
            </Suspense>
          );
        }

        // ❌ Wrong — breaks the static shell
        export default async function Page({ searchParams }) {
          const params = await searchParams;  // opts entire page to SSR
          ...
        }
```

## Config reference

**ISR:**
```typescript
// app/news/[slug]/page.tsx
export const revalidate = 3600; // revalidate at most every hour

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  return <ArticleLayout article={article} />;
}
```

**SSR:**
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession(); // fresh every request
  return <Dashboard session={session} />;
}
```

**PPR:**
```typescript
// next.config.ts
const config: NextConfig = {
  experimental: { ppr: true },
};

// app/products/page.tsx
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <main>
      <ProductHero />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />   {/* fetches fresh inventory per-request */}
      </Suspense>
    </main>
  );
}
```

## Commit message gate

Every new page commit must include the rendering strategy:
```
feat: add /services/electrical-testing page (ISR revalidate=86400)
feat: add /dashboard page (SSR force-dynamic)
feat: add /products page (PPR — static shell + dynamic grid)
```

## Current project patterns

- Service pages (`/services/*`): ISR `revalidate = 86400` (content updated by client)
- Emergency page: ISR `revalidate = 3600`
- Static pages (`/about`, `/contact`): SSG (default)
- No PPR pages yet (requires `experimental.ppr: true` to be enabled)
