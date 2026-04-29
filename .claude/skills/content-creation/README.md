# Content Creation Skill

Marketing department in a box: blogs, posts, emails, landing pages, scripts, and content calendars. Transform ideas into polished, on-brand content across all formats and platforms.

## Purpose

Content Creation delivers production-ready marketing content that aligns with brand voice, target audience, and business objectives. Use this skill to:

- **Write Blogs & Guides** — In-depth articles, tutorials, thought leadership
- **Create Social Posts** — Individual posts, threads, captions across platforms
- **Draft Communications** — Emails, newsletters, cold outreach, follow-ups
- **Build Landing Pages** — Conversion-focused copy for products and services
- **Plan Content** — Editorial calendars, content themes, posting schedules
- **Repurpose Content** — Convert one piece into multiple formats
- **Brainstorm Ideas** — Generate content themes aligned with strategy

This skill ensures all content is on-brand, audience-focused, and optimized for its intended platform.

## When to Use

- Write blogs, articles, or technical guides
- Create social media content (posts, captions, threads)
- Draft emails (newsletters, cold outreach, follow-ups)
- Write landing page copy
- Create content calendars
- Repurpose content across formats
- Brainstorm content ideas

**Trigger:** `/content-creation "[type and topic]"`

## How It Works

```
1. You describe content need (type, audience, purpose)
2. Skill researches tone (Brand Voice) + context
3. Agents ideate, outline, and generate
4. Opus synthesizes final polished content
5. Saved to archives/content/
```

## Key Features

- **Multi-Format** — Blogs, posts, emails, landing pages, scripts
- **Brand-Consistent** — Uses Brand Voice for tone + messaging
- **Research-Backed** — Integrates findings from Research skill
- **Repurposing** — Convert 1 post → 10 formats
- **SEO-Aware** — Optional optimization for search
- **Context-Aware** — Uses current priorities and goals for relevance
- **Platform-Optimized** — Formats adapted for each platform (LinkedIn, Twitter, etc.)

## Examples

### Example 1: Blog Post Series Outline

```
/content-creation "Blog post on 'Building AI Systems for Automation'"
```

**Skill Output:**
- 2,000+ word blog post with sections (intro, 3 core points, case study, conclusion)
- Optimized title and meta description
- Pull quotes for social sharing
- Internal links to other resources
- SEO keywords identified
- Call-to-action aligned with business goals

**Output Location:** `archives/content/2026-03-11-building-ai-systems-blog.md`

### Example 2: Social Media Thread

```
/content-creation "X thread about TypeScript for AI engineers"
```

**Skill Output:**
- 5-7 connected tweets forming coherent thread
- Each tweet optimized for engagement (hooks, examples, CTA)
- Variations provided (casual vs. professional tones)
- Hashtags and mentions suggested
- Best posting time recommendation
- Conversion path (link to blog, offer, etc.)

**Output Location:** `archives/content/2026-03-11-typescript-ai-thread.md`

### Example 3: Email Sequence

```
/content-creation "Cold outreach email sequence for AI consulting"
```

**Skill Output:**
- Email 1: Initial outreach with value hook
- Email 2: Social proof and case study
- Email 3: Final CTA with deadline urgency
- Personalization variables identified
- A/B testing recommendations
- Success metrics to track (open rate, click rate, reply rate)

**Output Location:** `archives/content/2026-03-11-cold-outreach-sequence.md`

## Output

Content saved to: `archives/content/[YYYY-MM-DD]-[title].md`

Includes:
- Main content (ready to publish)
- Metadata (audience, platform, keywords, CTA)
- Variations (tones, lengths, platforms)
- Social sharing copy and hashtags
- Performance recommendations

## Integration

**Works Best With:**
- **Research** — Data-driven content backed by research
- **Brand Voice** — Consistent tone and messaging
- **Social Media** — Formats content for platform distribution
- **Planning** — Define content strategy before creation
- **Knowledge Memory** — Archive and retrieve past content

**Example Workflow:**
```
1. Planning "Q1 content strategy and themes"
2. Research "Emerging AI trends for 2026"
3. Content Creation "Blog post on AI trends research"
4. Brand Voice "Review tone and messaging consistency"
5. Social Media "Repurpose blog into social posts"
6. Knowledge Memory "Archive content and performance metrics"
```

## Content Quality Criteria

All content meets these standards:

| Criterion | Standard |
|-----------|----------|
| **Brand Voice** | Consistent with tone guidelines (personal, approachable, educational) |
| **Audience Fit** | Tailored to target personas and knowledge level |
| **Clarity** | Clear, well-structured, easy to scan |
| **Originality** | Unique perspective, not generic rephrasing |
| **Calls-to-Action** | Clear, aligned with business objectives |
| **Proofreading** | Grammar, spelling, formatting correct |
| **Length** | Appropriate for format and platform |
| **Links** | Strategic internal/external links where helpful |
| **SEO** | Keywords naturally incorporated (blogs only) |

## When NOT to Use

❌ Do NOT use content-creation for:
- Simple one-off social media posts (use social-media skill instead)
- Technical documentation requiring code samples (use code-generation)
- Legal/compliance copy (consult legal team first)
- Purely informational content without strategic goal
- Content without a defined audience
- Internal meeting notes (use client-management for structure)

## Error Handling & Troubleshooting

| Issue | Solution |
|-------|----------|
| **Too generic** | Specify audience and use case (who reads it, what they need) |
| **Misses brand voice** | Run `/brand-voice` first to clarify tone guidelines |
| **Outdated information** | Request `/research` for current data before creation |
| **Wrong format** | Clarify platform (LinkedIn vs. Twitter vs. blog = different tone) |
| **Too long** | Break into series (blog + 5 social posts) instead of one post |
| **No clear CTA** | Define success metric (signup, download, consultation booking) |

## Examples & Reference

- **Full worked examples:** `references/examples/content-creation/worked-examples.md`
- **Integration patterns:** `references/SKILLS.md` (Content Campaign workflow)
- **Brand voice guide:** `references/rules/communication-style.md`
- **Past content:** `archives/content/` (review style, tone, structure)

---

**For full documentation, see [`SKILL.md`](SKILL.md)**
