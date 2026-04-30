# Nano Banana Images Skill

## Purpose

Generates hyper-realistic, highly-controlled images using the Nano Banana 2 (Gemini 3.1 Flash) model. Produces professional product photos, lifestyle images, headshots, and custom photography via parameterized JSON prompting and kie.ai API.

**Best for:**
- LinkedIn professional headshots and author photos
- Product photography (H&S Pepper Co, brand assets)
- Lifestyle/social content (authentic, unretouched aesthetic)
- Case study hero images
- Portfolio thumbnails
- Brand photography for client deliverables

## Prerequisites

- `KIE_AI_API_KEY` in `.env` (kie.ai API key, ~$0.02–$0.09 per image)
- Python 3.x with Pillow (for post-processing)
- `scripts/generate_kie.py` script available
- Access to the full JSON schema in `SKILL.md` (complete parameter reference)

## How to Use

### Basic invocation (dense narrative):
```bash
/nano-banana-images "Professional headshot: Herman Adu, software engineer, dark blazer, sitting at desk, natural office lighting, friendly expression, camera: Sony A7IV with 85mm lens"
```

### Structured JSON schema (complex, multi-panel):
For detailed control over lighting, composition, imperfections, and materials, use the full JSON schema. See SKILL.md for complete structure.

## Arguments

- `[subject or scene description]` — What to generate

## Output

### Generated image:
- **Format:** JPG or PNG (3–8MB)
- **Location:** Routed to appropriate subfolder (see Routing Rules below)
- **Resolution:** 1K–4K (configurable)
- **Style:** Hyper-realistic, unretouched, authentic

### Parameters:
- Aspect ratio: `3:4` (portrait), `16:9` (landscape), `1:1` (square), `auto`
- Resolution: `1K`, `2K`, `4K` (default 1K for speed, 4K for quality)

### Routing Rules

Output path depends on subject and context:

- **Person / LinkedIn / Social:** `images/social/[subject-slug]-[YYYY-MM-DD].jpg`
  - Example: Herman headshot → `images/social/herman-adu-headshot-2026-03-11.jpg`
- **Client Product Photos:** `images/clients/[client-slug]/[subject-slug]-[YYYY-MM-DD].jpg`
  - Example: H&S Pepper product → `images/clients/h-and-s-pepper-co/red-peppers-product-2026-03-11.jpg`
- **Web / Blog Hero:** `images/web/[subject-slug]-[YYYY-MM-DD].jpg`
  - Example: Blog hero → `images/web/modern-office-hero-2026-03-11.jpg`
- **Brand Photography (curated):** `images/brand/[subject-slug]-[YYYY-MM-DD].jpg`
  - Example: Team photo → `images/brand/ais-team-collaboration-2026-03-11.jpg`

## Integration

**Feeds into:**
- LinkedIn profile / author photos
- Brand assets (website, marketing)
- Social media content
- Client deliverables (case studies, portfolio)
- `/social-media` — Format and schedule
- `/content-creation` — Pair images with copy

**Upstream from:**
- Brand strategy (how should Herman look?)
- Content planning (what lifestyle/product shots needed?)
- Client photography briefs

## When NOT to Use

- ❌ Hand-drawn diagrams (use `/excalidraw-visuals`)
- ❌ Branded educational graphics (use `/infographic-creator`)
- ❌ Quick sketches or wireframes (use `/excalidraw-diagram`)
- ❌ Cartoon or stylized illustrations (use `/excalidraw-visuals` for Excalidraw style)

## Advanced: Two Prompting Paradigms

### Paradigm 1: Structured JSON Schema (Recommended for Complex Images)

Use when you need precise control over:
- Lighting behavior (directional, color temp, falloff)
- Camera specifications (focal length, aperture, ISO)
- Physical imperfections (pores, freckles, wear-and-tear)
- Multi-panel layouts (collages, product arrays)

Example:
```json
{
  "task": "professional_headshot",
  "output": { "type": "single_image", "aspect_ratio": "3:4", "resolution": "ultra_high" },
  "subject": {
    "type": "human_portrait",
    "human_details": {
      "identity": "Herman Adu, 30s, software engineer",
      "appearance": "visible pores, slight beard stubble, friendly expression, minimal makeup",
      "outfit": "dark charcoal blazer over white t-shirt"
    }
  },
  "environment": {
    "location": "modern office",
    "lighting": { "type": "natural window light, soft and diffused", "quality": "uneven, realistic" }
  }
}
```

See SKILL.md for the full schema breakdown (100+ lines of detailed structure).

### Paradigm 2: Dense Narrative Format (Faster for APIs)

Use when you want quick generation with high-quality prompting:
```json
{
  "prompt": "Professional headshot of Herman Adu, software engineer, 30s, visible pores and subtle stubble showing authenticity, dark charcoal blazer, friendly relaxed expression, sitting at modern desk with natural window light creating soft shadows, 85mm portrait lens at f/2.0 creating shallow depth of field, ISO 200, warm color temperature. Do NOT beautify, smooth, or alter facial features. No makeup styling.",
  "negative_prompt": "plastic skin, airbrushed, beauty filter, studio retouching, CGI, stylized, cartoon, illustration",
  "api_parameters": { "resolution": "4K", "aspect_ratio": "3:4" }
}
```

## Cost & Performance

- **Cost:** ~$0.02–$0.09 per image (simple to complex)
- **Generation time:** 30–90 seconds
- **Resolution:** 1K (fast), 2K (balanced), 4K (high quality)

Track usage: https://kie.ai/dashboard/usage

## Key Techniques for Realism

1. **Camera Mathematics:** Specify exact focal length, aperture, ISO
   - Example: `85mm lens, f/1.8, ISO 200` (portrait standard)
   - Forces optical physics mimicry, not digital rendering

2. **Explicit Imperfections:** Name specific flaws
   - Instead of "realistic skin": `visible pores, mild redness, subtle freckles, light acne marks`

3. **Direct Commands:** Use imperatives in positive prompt
   - `Do not beautify or alter facial features. No makeup styling. No retouching.`

4. **Lighting Behavior:** Describe what light does, not just where it is
   - Instead of "natural light": `soft diffused window light creating gentle shadows on cheekbones`

5. **Negative Stack:** Massive list of "no AI styling" blockers
   - `no skin smoothing, no anatomy normalization, no CGI, no plastic look, no editorial proportions`

## Security Considerations

- **API Key Management:** `KIE_AI_API_KEY` stored in `.env` (never commit to git)
- **Image Data Privacy:** Generated images are processed and stored on kie.ai servers temporarily
- **Prompt Data:** Detailed prompts are sent to kie.ai; avoid including real personal information
- **Cost Control:** Monitor kie.ai dashboard for usage; set budget alerts
- **File Storage:** Generated images stored locally in `images/[subfolder]/` (social, web, brand, or clients); consider data retention policy
- **Key Security:** Rotate API keys quarterly; revoke if exposed

## Common Use Cases

### LinkedIn Professional Headshots
Generate custom headshots for Herman's LinkedIn profile. E.g., `/nano-banana-images "professional headshot, Herman in tech office, casual business wear, warm lighting"`.

### Product Photography (H&S Pepper Co)
Create product images for ecommerce. E.g., `/nano-banana-images "bottle of hot sauce on rustic wood table, dramatic lighting"`.

### Brand Asset Library
Build a library of lifestyle images for content and marketing. Archive in `brand-assets/generated-imagery/`.

### Case Study Hero Images
Generate custom hero images for Full Stack Fusion case studies. E.g., `/nano-banana-images "engineer coding at desk, modern setup, blue mood lighting"`.

## Example Workflow

```
Herman: /nano-banana-images "LinkedIn headshot: Herman Adu, friendly expression, wearing tech company t-shirt, sitting in modern office, natural daylight from window, authentic unretouched skin"
          ↓
Skill routes to: images/social/ (LinkedIn = social profile content)
          ↓
Image generated via kie.ai, saved to images/social/herman-adu-headshot-2026-03-11.jpg
          ↓
Herman: /social-media --platform linkedin --asset images/social/herman-adu-headshot-2026-03-11.jpg --caption "Ready for new opportunities"
          ↓
LinkedIn post scheduled with optimized headline and engagement hook
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Generation failed (402 error)" | Check kie.ai/dashboard for credits. Top up if needed. |
| "Image looks plastic/over-smoothed" | Increase negative prompt weight on "beauty filters" and "skin smoothing". Add more imperfections. |
| "Wrong aspect ratio" | Explicitly specify in schema: `"aspect_ratio": "3:4"` for portrait |
| "Lighting doesn't match description" | Be specific: `direct on-camera flash with sharp highlights` vs. vague `good lighting` |
| "Face doesn't match description" | Add to negative: `not matching reference identity, wrong age, altered appearance` |

## Files Used

- `.claude/skills/nano-banana-images/SKILL.md` — Full schema and paradigms
- `.claude/skills/nano-banana-images/SKILL.md` — Full JSON schema, paradigms, and parameter reference
- `scripts/generate_kie.py` — Python kie.ai API wrapper
- `images/social/`, `images/web/`, `images/brand/`, `images/clients/*/` — Output directories (routed based on context)
- `references/IMAGE-OUTPUT-ORGANIZATION.md` — Routing guide and directory structure

## Related Skills

- `/excalidraw-visuals` — Hand-drawn style graphics (not realistic)
- `/infographic-creator` — Branded educational graphics
- `/social-media` — Format and schedule headshots
- `/brand-voice` — Ensure visual style matches Herman's brand
- `/content-creation` — Pair images with author bio or case study copy
