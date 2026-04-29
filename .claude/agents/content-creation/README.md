# Content Creation Agent

## Summary

The content creation agent generates actionable content ideas, outlines, and repurposing strategies. It transforms raw topics and research into structured content plans ready for development, with multiple format variations optimized for different audiences.

## Key Responsibilities

- Content Ideation — Generate blog topics, social media ideas, email series hooks with unique angles and audience hooks
- Outline Creation — Structure content with logical flow, sections, and appropriate depth for target readers
- Content Repurposing — Transform single source (blog → Twitter thread, video → article) while preserving core message
- Multi-format Expansion — Expand one idea into multiple formats (blog, social, email, case study) with platform-specific variations
- Research Synthesis — Convert research findings into content-ready insights, key messages, and narrative structures

## Confidence Level

High (90%+) — Content ideation methodology is robust and proven. Limitation: quality depends on research accuracy and audience context; narrow or specialized audiences may need additional context.

## Overview

The Content Creation Agent is a specialized Haiku-level sub-agent that performs focused content ideation, outlines, and repurposing. It handles one content task at a time and produces structured, ready-to-develop output.

**Model:** Haiku (fast, cost-efficient)
**Scope:** One content task at a time (leaf worker)
**Invocation:** Called by `/content-creation` skill when detailed ideation is required
**Output:** Content ideas, outlines, or repurposed assets with confidence levels

## Purpose

The Content Creation Agent handles:

- **Content ideation** — Generate blog topics, social media ideas, email series hooks
- **Outline creation** — Structure content with logical flow, sections, and depth
- **Content repurposing** — Transform one piece (blog → Twitter thread, video → article, etc.)
- **Multi-format expansion** — Expand one idea into multiple formats (blog, social, email, case study)
- **Research synthesis** — Convert research findings into content-ready insights and key messages

## When It's Called

Invoked by the Content Creation Skill in these scenarios:

1. **Content ideas needed** — "Generate 10 blog topics for TypeScript best practices"
2. **Outline required** — "Create an outline for a full-stack deployment guide"
3. **Content being repurposed** — "Turn this YouTube video script into a blog post"
4. **Multi-format thinking** — "Expand this idea into: blog post, 3 tweets, email sequence"
5. **Research to messaging** — "Convert this market research into key talking points"

## What It Does Well

✅ Fast idea generation (Haiku speed, cost-efficient)
✅ Clear, logical outlines (ready for writer to execute)
✅ Repurposing without losing core message
✅ Multi-format thinking (one source → many outputs)
✅ Research synthesis with tone markers

## What It Doesn't Do

❌ Final writing/copywriting (that's the skill's job)
❌ Fact-checking or validation (assumes research is accurate)
❌ Brand voice application (skill handles tone/voice customization)
❌ Publishing or distribution (skill handles platform routing)

## Integration with Content Creation Skill

**Inputs received from skill:**
- `subtask`: Content request (e.g., "Create outline for onboarding guide")
- `context`: Optional research, brand voice notes, target audience
- `samples`: Optional content to repurpose, prior examples, or reference material

**Outputs returned to skill:**
- **Summary** — 3–5 sentence reasoning
- **Ideas/Outline/Repurposed Content** — Structured deliverable
- **Notes** — Assumptions, tone markers, or recommendations
- **Confidence** — High/Medium/Low assessment

The skill then:
- Applies brand voice and personality
- Writes/polishes the content
- Adds graphics, formatting, CTAs
- Routes to publishing channels (`content/blogs/`, `content/social/`, etc.)

## Error Recovery

**If ideas are repetitive:**
- Provide more `context` about target audience or angle
- Specify format (e.g., "technical deep dives" vs. "quick tips")
- Ask agent to focus on one unique angle

**If outline lacks depth:**
- Provide example outlines as reference in `samples`
- Clarify the target reader level (beginner, expert, executive)
- Ask agent to expand key sections

**If repurposing loses core message:**
- Provide explicit key messages in `context`
- Specify the destination format clearly in `subtask`
- Ask agent to prioritize message fidelity

## Example Invocation

```
Subtask: Repurpose YouTube video script into blog post and 3 social tweets
Context:
  - Target audience: Full-stack JavaScript developers
  - Tone: Technical but approachable
  - Key message: TypeScript reduces bugs in production
Samples:
  Video script: (original video text)

Expected response:
  - Blog outline (intro, 3–4 sections, conclusion)
  - 3 standalone tweet angles with hooks
  - Notes on emphasis differences per format
```

## Common Subtask Patterns

### Pattern 1: Content Series Ideation
**When:** Planning multi-piece content around a theme or topic
**Steps:**
1. Provide: Topic, audience, format preferences (blog, social, email)
2. Agent generates: 5–10 ideas with unique angles, formats, and key messages
3. Skill: Selects best ideas, develops outlines, assigns writers

**Example subtask:** "Generate 8 blog topic ideas for TypeScript best practices. Target: intermediate developers. Angles: performance, DX, testing."

### Pattern 2: Content Repurposing Pipeline
**When:** Maximizing value from single source (e.g., YouTube video → blog + social)
**Steps:**
1. Provide: Original content (video script, article, presentation)
2. Agent analyzes: Key messages, angles for different formats
3. Agent outputs: Blog outline + 3 social tweet hooks + email series structure
4. Skill: Implements each format with brand voice, publishes

**Example subtask:** "Repurpose: YouTube video 'React Performance Patterns' → blog post + 4 tweets + email. Preserve technical depth in blog, emphasize quick wins in social."

### Pattern 3: Research to Content Translation
**When:** Converting research findings into customer-facing content
**Steps:**
1. Provide: Research report/insights + target audience level
2. Agent translates: Research → Key messages → Content angles
3. Skill: Develops outlines → Writers create content → Published

**Example subtask:** "Convert market research on full-stack hiring to: 5 blog ideas + LinkedIn article outline. Audience: CTOs at Series B SaaS."

## Integration

- **Receives from:** `/content-creation` skill via Agent tool delegation (for ideation and outline generation subtasks)
- **Returns to:** `/content-creation` skill for brand voice application and final content generation
- **Invocation pattern:** Body text in content-creation SKILL.md delegates focused content subtask (e.g., "Create outline for onboarding guide")
- **Data format:** Structured output with summary, ideas/outline/repurposed content, notes, and confidence level

## Integration Patterns

**With Brand-Voice Skill:**
- Content-Creation Agent generates outlines → Brand-Voice skill ensures consistency across tone/messaging → Final content published

**With Research Skill:**
- Research finds market insights → Content-Creation Agent translates to content angles → Skill produces final pieces

**With Social-Media Skill:**
- Content-Creation Agent provides outlines → Skill writes + formats for platform → Social skill optimizes and schedules

**Archive Integration:**
- All content ideation and outlines saved to `archives/content/` for future reference
- Enables content library growth and pattern recognition

## Advanced Scenarios

### Handling Audience Segmentation
**Problem:** Content needs to appeal to multiple audience levels (beginner + expert)
**Solution:**
- Specify audience level in `context`: "Primary: mid-level engineers, Secondary: architects"
- Agent generates variations or multi-layered outlines
- Skill can create separate content paths for each audience

### Multi-Format Content Strategy
**Workflow:**
1. Agent generates: One canonical outline (blog post)
2. Agent provides: Format variations (summary for Twitter, deep dive for LinkedIn, quick tip for email)
3. Skill implements: Each format adapted to platform norms
4. Archive: All variants linked to canonical source

### Handling Sensitive/Technical Topics
**Pattern:** For complex or sensitive content:
- Provide explicit key messages in `context` (what MUST be communicated)
- Ask agent to flag assumptions or nuances
- Iterate: Review assumptions, refine context, rerun agent

### Iterative Ideation
**Workflow:**
1. First invocation: Broad idea generation (high creativity)
2. Review ideas, select promising ones
3. Follow-up invocation: Deep dive into selected ideas (add examples, frameworks, angles)
4. Repeat: Refine outlines until ready for writing

## Worked Examples

For detailed, step-by-step examples of agent invocation patterns, see:
- **Full examples:** `.claude/agents/content-creation/worked-examples.md` (200+ lines)
- **Use cases:** Series ideation, content repurposing, research translation, multi-format thinking
- **Copy-paste ready:** All examples include realistic inputs, idea outputs, and outline structures

## Performance Notes

- **Latency:** ~12–22 seconds (Haiku model)
- **Token usage:** ~2,000–3,500 tokens per invocation
- **Cost:** ~$0.005–0.01 per invocation
- **Context budget:** 4,500–6,500 tokens available after instructions

Provide concise research/samples to maximize available ideation tokens.

## Debugging & Support

**If ideas are repetitive or shallow:**
- Provide more `context` about target audience and angles (agent needs specificity)
- Specify format constraints (e.g., "technical deep dives" vs. "quick tips")
- Ask agent to focus on one unique angle per idea

**If outline lacks depth:**
- Provide example outlines as reference in `samples`
- Clarify target reader level (beginner vs. expert)
- Ask agent to expand key sections or add examples to each point

**If repurposing loses core message:**
- Include explicit key messages in `context` (e.g., "Must communicate: TypeScript reduces production bugs")
- Specify destination format clearly in `subtask`
- Ask agent to prioritize message fidelity over format optimization

**For questions about agent behavior:**
- See `AGENT.md` for full system prompt and content constraints
- Review worked-examples.md for ideation patterns and expected outputs
