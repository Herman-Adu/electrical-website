# Excalidraw Visuals Skill

## Purpose

Generates hand-drawn style PNG images via kie.ai. Creates educational, friendly visuals for social media, blogs, presentations, and marketing content. Produces "sketchy" Excalidraw-style diagrams with clean typography and intentional color coding.

**Best for:**
- LinkedIn educational content (AI, development, business tips)
- TikTok/YouTube Shorts visual hooks
- Blog post headers and explainer graphics
- Social media carousel graphics
- Presentation slides (before/after comparisons, process flows)
- Tutorial visuals (step-by-step guides)

## Prerequisites

- `KIE_AI_API_KEY` in `.env` (kie.ai API key, ~$0.02–$0.09 per image)
- Node.js installed
- `scripts/excalidraw-visuals/generate-visual.js` script available
- `brand-assets/excalidraw-style-reference.png` (optional, improves consistency)

## How to Use

### Direct invocation:
```bash
/excalidraw-visuals "The AI Development Loop: Prompt → Code → Test → Refine"
```

### With specific layout:
```bash
/excalidraw-visuals "Claude Code Workflow" (layout: left-to-right flow)
```

## Arguments

- `[concept to visualize]` — What to create a visual for (required)
- Aspect ratio (optional, default: 16:9): `1:1` (square), `4:5` (Instagram)

## Output

### Generated file:
- **Format:** PNG image (3–5MB)
- **Location:** `projects/excalidraw-visuals/YYYY-MM-DD-[slug].png`
- **Style:** Hand-drawn Excalidraw feel with rounded boxes, wobbly lines, soft pastels

### In-conversation:
- File path for preview
- One-line summary
- Question: "Adjustments needed?"

## Integration

**Feeds into:**
- `/social-media` — Auto-format for LinkedIn, TikTok, Twitter
- `/content-creation` — Accompany text content with visuals
- Blog posts (hero images, section breaks)
- Email campaigns (visual hooks)

**Upstream from:**
- `/idea-mining` → content idea
- `/content-creation` → copy to accompany visual
- `/planning` → visual guide for execution

## When NOT to Use

- ❌ Editable diagrams (use `/excalidraw-diagram` for `.excalidraw` JSON)
- ❌ Highly realistic product images (use `/nano-banana-images`)
- ❌ Branded infographics (use `/infographic-creator` with Adu Dev branding)
- ❌ Photographs or portraits (use `/nano-banana-images`)

## Cost & Performance

- **Cost:** ~$0.02–$0.09 per image (depends on complexity)
- **Generation time:** 15–45 seconds
- **Quality:** 2K–4K resolution, suitable for all platforms

Track usage: https://kie.ai/dashboard/usage

## Security Considerations

- **API Key Management:** `KIE_AI_API_KEY` stored in `.env` (never commit to git)
- **Rate Limiting:** Kie.ai enforces 100 req/min per API key
- **Data Privacy:** Prompts are sent to kie.ai servers; avoid including sensitive data
- **Cost Control:** Monitor dashboard regularly; set up budget alerts at kie.ai/dashboard
- **Key Rotation:** Rotate API keys quarterly or if compromised
- **Environment Variables:** Use `.env.local` or `.env.production` for environment-specific keys

## Style Guide

**Locked style prefix** — Consistent across all visuals:
- Architect-style handwriting, neat and legible
- Rounded rectangle boxes with 2–3px dark gray outlines
- Wobbly hand-drawn lines and arrows (not ruler-straight)
- Soft pastel color palette (blue, yellow, green, coral, purple)
- Simple stick figures (no facial features), robots with antennas, document icons
- Clean white background, generous whitespace
- Educational, friendly, polished (not sloppy)

**Text minimization:**
- Max 3 words per label (prefer 1–2)
- Titles max 5 words
- Total word count <30 (max 50)

See `.claude/skills/excalidraw-visuals/style-guide.md` for full reference.

## Example Workflow

```
Herman: /idea-mining "AI development tools"
          ↓
Idea: "Compare Claude Code vs Cursor"
          ↓
Herman: /excalidraw-visuals "Claude Code vs Cursor — Side-by-side comparison"
          ↓
PNG generated: projects/excalidraw-visuals/2026-03-11-claude-vs-cursor.png
          ↓
Herman: /social-media --platform linkedin --asset [image path]
          ↓
LinkedIn post scheduled with optimized copy and hashtags
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Generation failed (402 error)" | Check kie.ai/dashboard for credits. Top up if needed. |
| "Generation slow (>45s)" | Normal for complex visuals. Check .env for KIE_AI_API_KEY validity. |
| "Output doesn't match style" | Provide `brand-assets/excalidraw-style-reference.png` for consistency. |
| "Text is hard to read" | Reduce word count. Skill auto-minimizes, but simpler = clearer. |
| "Colors not right for brand" | Style prefix is locked for consistency. Request PNG with different layout/concept instead. |

## Files Used

- `.claude/skills/excalidraw-visuals/SKILL.md` — Full execution steps and prompt template
- `.claude/skills/excalidraw-visuals/style-guide.md` — Detailed style reference (colors, fonts, layouts)
- `scripts/excalidraw-visuals/generate-visual.js` — Node.js generation script
- `brand-assets/excalidraw-style-reference.png` — Optional: style consistency reference
- `projects/excalidraw-visuals/` — Output directory

## Related Skills

- `/excalidraw-diagram` — Generate editable `.excalidraw` JSON diagrams
- `/nano-banana-images` — Hyper-realistic image generation
- `/infographic-creator` — Adu Dev-branded educational infographics
- `/social-media` — Auto-format visuals for each platform
- `/content-creation` — Pair visuals with written content
