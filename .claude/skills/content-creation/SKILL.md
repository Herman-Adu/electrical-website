---
name: content-creation
description: Use when someone asks to generate high-quality content across all formats: blog posts, LinkedIn content, landing pages, newsletters, case studies, scripts, or content calendars.
argument-hint: "[content type and topic]"
disable-model-invocation: true
---

## Live Context (auto-injected)

Brand voice: !`cat context/brand-voice.md 2>/dev/null || echo "No brand voice defined. Use communication style from .claude/rules/communication-style.md for tone guidance."`

Current priorities: !`cat context/current-priorities.md 2>/dev/null || echo "No priorities defined. Ask the user what they want to focus on."`

Current goals: !`cat context/goals.md 2>/dev/null || echo "No quarterly goals defined. Ask the user for their target milestones."`

Communication style: !`cat .claude/rules/communication-style.md 2>/dev/null || echo "Default: approachable, friendly, human tone for external content."`

# Content Creation Skill

A system that generates high-quality, on-brand content across all formats.
This skill uses:

- Research Skill (for insights)
- Brand Voice Skill (for tone)
- Planning Skill (for strategy and timing)

It acts as the Marketing Department of the Executive Assistant.

## Execution Method

1. **Parse the request**
   - The request is: $ARGUMENTS
   - Identify the content type (post, blog, email, script, etc.)
   - Identify the goal (educate, convert, engage, announce)
   - Identify the audience
   - Identify the tone (default: brand voice)

2. **If needed, call the Content Creation Agent**
   - Call `.claude/agents/content-creation/AGENT.md` with:
     - `subtask`: [the specific content request: outline generation, idea generation, repurposing, multi-format expansion, or content ideation]
     - `context`: [optional research, brand voice notes, or prior context]
     - `samples`: [optional content to repurpose]
   - Use the agent for: ideation, outline generation, content repurposing, multi-format expansion
   - Do NOT use the agent for: final tone, polish, or brand voice application (keep at Opus level)
   - Run content subtask agents in parallel where subtasks are independent (e.g., ideation and outline generation can run simultaneously).

3. **Apply the Brand Voice Skill**
   - Ensure tone, style, vocabulary match the stored brand voice

4. **Integrate Research Skill (optional)**
   - Pull insights, data, or references from archived research

5. **Generate the content** (ultrathink)
   - Produce clean, structured, high-quality content
   - Follow best practices for the format

6. **Save to archive**
   - Write the final content to: `archives/content/YYYY-MM-DD-[type]-[slug].md`

7. **Return the final output**
   - Ready-to-publish content
   - Or multi-format content bundles

8. **Diagram hook (offer always)**
   - After every article or long-form content draft, offer: "Want a diagram for this? I can generate an architecture map, flowchart, or hub-and-spoke visual."
   - If yes: invoke `/diagram-orchestrator "[article title] [quick|draft|publish]"` with article context
   - Default to `publish` tier for blog articles (PNG output via kie.ai), `draft` tier for internal docs
   - Brand voice note: diagram prompts must use technical/neutral voice — do NOT pass the electrical-services brand voice to diagram skills

---

## News Hub Article Structure (Nexgen Electrical Innovations)

When creating a news hub article (`data/news/index.ts` entry), the following philosophy applies:

### THE RULE
The layout component system drives user behaviour — not paragraphs of prose. Potential clients reading walls of text will drift. Section headings, structured components, and scannable data keep them engaged and moving through the page.

### Field Priorities (highest first)

| Field | Rule | Component rendered |
|-------|------|--------------------|
| `spotlight` | Always 3 metrics — numbers clients can anchor to | `DetailStatStrip` |
| `intro` | **Max 1 paragraph** — hook + problem statement only. Stop there. | `DetailIntroBlock` |
| `methodology` / steps | Numbered actionable content. If it can be a step, make it a step. | `DetailStepsBlock` |
| `specifications` | Technical reference in a grid — measurements, standards, thresholds | `DetailSpecsBlock` |
| `scope` | Bulleted list — what's covered, what's included | `DetailListBlock` |
| `challenges` | Problem / solution pairs — client pain points + how Nexgen resolves them | `DetailSplitCardsBlock` |
| `results` | Outcomes with impact — what changed, what was achieved | `DetailHighlightListBlock` |
| `takeaways` | 4–6 scannable bullets — the "if you read nothing else" summary | `DetailTakeawayBlock` |
| `quote` | Client or engineer voice — one strong quote | `DetailQuoteBlock` |
| `body` | **Max 2 paragraphs** — supplementary detail that doesn't fit any structured field above | `DetailBodyBlock` |
| `conclusion` | 2 paragraphs max — so-what + clear CTA | `DetailConclusionBlock` |
| `heroIndicators` | Always 4 — value propositions shown in the hero, not the body | Hero section |

### What to avoid
- More than 1 intro paragraph — if you have 3 paragraphs of context, turn them into steps or scope items
- More than 2 body paragraphs — restructure as specs, challenges, or a list
- TOC entries for `overview` and `details` only — every article should have at least 5 TOC sections
- Generic labels like "Details" — every `TocItem.label` is rendered as an h2 heading on the page

### What good looks like
An article with: `spotlight` (3 metrics) + `intro` (1 paragraph) + `methodology` (6–8 steps) + `specifications` (1–2 groups) + `scope` (4–6 items) + `takeaways` (5 bullets) + `quote` + `conclusion` (2 paragraphs)

That is 7+ distinct component sections with clear headings — a page a client navigates, not a document they read.

---

## Output Format

### For posts:

# LinkedIn Post

{content}

---

### For blogs:

# Blog Title

## Outline

- …
- …

## Draft

{content}

---

### For emails:

# Subject

{subject}

# Body

{email}

---

### For content calendars:

# 30-Day Content Calendar

| Day | Topic | Format | Goal | Notes |
| --- | ----- | ------ | ---- | ----- |
| 1   | …     | …      | …    | …     |

---

## Integration Points

### Consumers
- **Social Media** — Consumes raw content and repurposes it for platform-specific formatting, distribution, and scheduling
- **Brand Voice** — References content drafts as samples to extract, validate, and refine brand voice guidelines
- **Client Management** — Uses content drafts (landing pages, email sequences, case studies) in client proposals and deliverables
- **Knowledge Memory** — Archives final content for long-term storage, retrieval, and pattern analysis

---

## Edge Cases & Error Recovery

| Scenario | Recovery |
|----------|----------|
| **Empty/unclear topic** | Ask user: "What's the core message? Who's the audience? What action do you want them to take?" |
| **Missing brand voice** | Inform: "No brand voice profile found. Using default professional tone. Update later if needed." |
| **Conflicting requirements** | Surface tension: "You want [A] and [B], but they affect tone differently. Recommend: [priority]. Okay?" |
| **Word count mismatch** | Adjust gracefully: "Target was [N] words; delivered [actual]. Need adjustment?" |
| **SEO conflicts with tone** | Surface trade-off: "Adding keywords [X] might affect voice. Recommend: [strategy]. Okay?" |

---

## Notes

- Always apply the Brand Voice Profile.
- Use Haiku for ideation and outlines.
- Use Opus for synthesis and final content.
- Integrate research when relevant.
- See `README.md` for documentation and content templates.
