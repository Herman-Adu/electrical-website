# Next.js Pages — Rendering Decision Skill

Pre-implementation decision gate: determines the correct rendering strategy (SSG, ISR, SSR, or PPR) for every new Next.js page before any code is written.

## When to Use

Invoke this skill BEFORE writing code for any new page or route. It prevents choosing the wrong rendering strategy (a hard-to-fix mistake) by working through a structured decision tree first.

**Trigger phrases:**
- "Create a new page at /services/X"
- "Add a route for the news section"
- "Should this page use SSG or SSR?"
- "What rendering strategy for the dashboard?"
- "New page — what revalidate value should I set?"
- `/nextjs-pages [describe the page and how often its data changes]`

## How It Works

```
1. You describe the page: what data it shows and how often it changes
2. Skill walks through the 4-step decision tree
3. Skill outputs: rendering strategy + exact config code
4. Skill records the strategy in the commit message gate format
```

## The Decision Tree

### Step 1: Is all content known at build time and never changes?
**YES → SSG** (default, no config needed)
- Static marketing pages, `/about`, `/services/emergency`
- Server Component with no dynamic APIs

### Step 2: Does content update on a schedule (minutes to days)?
**YES → ISR** — add `export const revalidate = N` at the route segment level
```typescript
// app/news/[slug]/page.tsx
export const revalidate = 3600; // refresh at most hourly
```
- Use for: news articles, project listings, service pages

### Step 3: Does every request need fresh data?
**YES → SSR** — add `export const dynamic = 'force-dynamic'`
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';
```
- Auto-opted in by: `cookies()`, `headers()`, `searchParams` at page root
- Use for: dashboards, account pages, search results

### Step 4: Does the page have BOTH a static shell AND dynamic sections?
**YES → PPR** (requires `experimental.ppr: true` in `next.config.ts`)
```typescript
export default function Page({ searchParams }) {
  return (
    <main>
      <StaticHero />
      <Suspense fallback={<Skeleton />}>
        <DynamicSection searchParamsPromise={searchParams} />
      </Suspense>
    </main>
  );
}
```
- Critical: NEVER `await searchParams` at page root — pass the promise to the Suspense child

## Current Project Patterns

| Page pattern | Strategy | Config |
|-------------|----------|--------|
| Service pages (`/services/*`) | ISR | `revalidate = 86400` |
| Emergency page | ISR | `revalidate = 3600` |
| Static pages (`/about`, `/contact`) | SSG | Default (no config) |
| PPR pages | None yet | Requires `experimental.ppr: true` |

## Usage Examples

### Example 1: Adding a News Article Page

```
/nextjs-pages "News article page at /news/[slug] — fetches from CMS, articles change daily"
```

Decision: ISR with `revalidate = 86400` (86400 seconds = 24 hours)

Output config:
```typescript
export const revalidate = 86400;
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  return <ArticleLayout article={article} />;
}
```

### Example 2: Adding a User Dashboard

```
/nextjs-pages "Dashboard at /dashboard — shows user-specific data, must be fresh per request"
```

Decision: SSR (force-dynamic)

Output config:
```typescript
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const session = await getSession();
  return <Dashboard session={session} />;
}
```

### Example 3: Static About Page

```
/nextjs-pages "About page — company info, never changes"
```

Decision: SSG (default, no config needed)

```typescript
// No export const revalidate needed — Server Component is SSG by default
export default function AboutPage() {
  return <AboutLayout />;
}
```

## Commit Message Gate

Every new page commit MUST include the rendering strategy:

```
feat: add /services/electrical-testing page (ISR revalidate=86400)
feat: add /dashboard page (SSR force-dynamic)
feat: add /products page (PPR — static shell + dynamic grid)
```

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Unclear how often data changes | Ask: "Does this data change hourly, daily, or per-request?" |
| PPR requested but not enabled | Check `next.config.ts` for `experimental.ppr: true`; add if missing |
| `await searchParams` at page root breaks PPR | Move await inside the Suspense-wrapped child component |
| Wrong strategy chosen after implementation | ISR → SSR is safe; SSR → SSG may require restructuring data fetching |

## When NOT to Use

- You are modifying an existing page (strategy is already decided — just keep it)
- You are adding a component to an existing page (not a routing change)
- The page is already implemented and tested (strategy change is a separate decision)

## Related Files

- **SKILL.md:** `.claude/skills/nextjs-pages/SKILL.md` — full decision tree with code references
- **Next.js config:** `next.config.ts` — PPR experimental flag lives here
- **Related skills:** `code-generation` (implements the page after strategy is decided)
