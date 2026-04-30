---
name: nano-banana-images
description: Use when someone asks to generate a hyper-realistic image, create a professional headshot, produce product photography, or build a visual concept for a scene or subject.
disable-model-invocation: true
argument-hint: "[subject or scene description]"
---

## Brand Guidelines (auto-injected)

!`cat brand-assets/adu-dev-brand-guidelines.md 2>/dev/null || echo "No brand guidelines available. Use professional, modern aesthetics with clean design."`

# Nano Banana 2 Image Generation Master

## Goal

The purpose of this skill is to provide a standardized, highly controlled method for generating images using AI model Nano Banana 2 (or any underlying model connected to the `generate_image` tool). By strictly enforcing a structured JSON parameter schema, this skill neutralizes native model biases (like over-smoothing, dataset-averaging, or "plastic" AI styling) and ensures raw, unretouched, hyper-realistic outputs.

## Prerequisites

- Access to the `generate_image` tool.
- A clear understanding of the user's desired Subject, Lighting, and Camera characteristics.

## Core Schema Structure

When constructing a prompt for the `generate_image` tool, you **MUST** use the following JSON schema as the foundation. Fill in the string values with extreme, microscopic detail.

```json
{
  "task": "string - High-level goal (e.g., 'sports_selfie_collage', 'single_macro_portrait')",

  "output": {
    "type": "string - e.g., 'single_image', '4-panel_collage'",
    "layout": "string - e.g., '1x1', '2x2_grid', 'side-by-side'",
    "aspect_ratio": "string - e.g., '3:4', '16:9', '4:5'",
    "resolution": "string - e.g., 'ultra_high', 'medium_low'",
    "camera_style": "string - e.g., 'smartphone_front_camera', 'professional_dslr'"
  },

  "image_quality_simulation": {
    "sharpness": "string - e.g., 'tack_sharp', 'slightly_soft_edges'",
    "noise": "string - e.g., 'unfiltered_sensor_grain', 'visible_film_grain', 'clean_digital'",
    "compression_artifacts": "boolean - true if attempting to simulate uploaded UGC",
    "dynamic_range": "string - e.g., 'limited', 'hdr_capable'",
    "white_balance": "string - e.g., 'slightly_warm', 'cool_fluorescent'",
    "lens_imperfections": [
      "array of strings - e.g., 'subtle chromatic aberration', 'minor lens distortion', 'vignetting'"
    ]
  },

  "subject": {
    "type": "string - e.g., 'human_portrait', 'nature_macro', 'infographic_flatlay'",
    "human_details": {
      "//": "Use this block ONLY for human subjects",
      "identity": "string",
      "appearance": "string - Extremely specific (e.g., visible pores, mild redness)",
      "outfit": "string"
    },
    "object_or_nature_details": {
      "//": "Use this block for non-human subjects",
      "material_or_texture": "string - e.g., 'brushed aluminum', 'dew-covered velvety petals'",
      "wear_and_tear": "string - e.g., 'subtle scratches on the anodized finish', 'browning edges on leaves'",
      "typography": "string - e.g., 'clean sans-serif overlaid text, perfectly legible'"
    }
  },

  "multi_panel_layout": {
    "grid_panels": [
      {
        "panel": "string - e.g., 'top_left', 'full_frame' (if not a grid)",
        "pose": "string - e.g., 'slight upward selfie angle, relaxed smile'",
        "action": "string - e.g., 'holding phone with one hand, casual posture'"
      }
    ]
  },

  "environment": {
    "location": "string - e.g., 'gym or outdoor sports area'",
    "background": "string - What is behind the subject (e.g., 'blurred gym equipment')",
    "lighting": {
      "type": "string - e.g., 'natural or overhead gym lighting', 'harsh direct sunlight'",
      "quality": "string - e.g., 'uneven, realistic, non-studio', 'high-contrast dramatic'"
    }
  },

  "embedded_text_and_overlays": {
    "text": "string (optional)",
    "location": "string (optional)"
  },

  "structural_preservation": {
    "preservation_rules": [
      "array of strings - e.g., 'Exact physical proportions must be preserved'"
    ]
  },

  "controlnet": {
    "pose_control": {
      "model_type": "string - e.g., 'DWPose'",
      "purpose": "string",
      "constraints": ["array of strings"],
      "recommended_weight": "number"
    },
    "depth_control": {
      "model_type": "string - e.g., 'ZoeDepth'",
      "purpose": "string",
      "constraints": ["array of strings"],
      "recommended_weight": "number"
    }
  },

  "explicit_restrictions": {
    "no_professional_retouching": "boolean - typically true for realism",
    "no_studio_lighting": "boolean - typically true for candid shots",
    "no_ai_beauty_filters": "boolean - mandatory true to avoid plastic look",
    "no_high_end_camera_look": "boolean - true if simulating smartphones"
  },

  "negative_prompt": {
    "forbidden_elements": [
      "array of strings - Massive list of 'AI style' blockers required for extreme realism. Example stack: 'anatomy normalization', 'body proportion averaging', 'dataset-average anatomy', 'wide-angle distortion not in reference', 'lens compression not in reference', 'cropping that removes volume', 'depth flattening', 'mirror selfies', 'reflections', 'beautification filters', 'skin smoothing', 'plastic skin', 'airbrushed texture', 'stylized realism', 'editorial fashion proportions', 'more realistic reinterpretation'"
    ]
  }
}
```

## Paradigm 2: The Dense Narrative Format (Optimized for APIs like Kie.ai)

When executing API calls to standard generation endpoints (which often only accept string prompts), it is incredibly powerful to condense the logic above into a dense, flat JSON string containing a massive descriptive text block.

```json
{
  "prompt": "string - A dense, ultra-descriptive narrative. Use specific camera math (85mm lens, f/1.8, ISO 200), explicit flaws (visible pores, mild redness, subtle freckles, light acne marks), lighting behavior (direct on-camera flash creating sharp highlights), and direct negative commands (Do not beautify or alter facial features).",
  "negative_prompt": "string - A comma-separated list of explicit realism blockers (no plastic skin, no CGI).",
  "image_input": [
    "array of strings (URLs) - Optional. Input images to transform or use as reference (up to 14). Formatting: URL to jpeg, png, or webp. Max size: 30MB."
  ],
  "api_parameters": {
    "google_search": "boolean - Optional. Use Google Web Search grounding",
    "resolution": "string - Optional. '1K', '2K', or '4K' (default 1K)",
    "output_format": "string - Optional. 'jpg' or 'png' (default jpg)",
    "aspect_ratio": "string - Optional. Overrides CLI aspect_ratio (e.g., '16:9', '4:5', 'auto')"
  },
  "settings": {
    "resolution": "string",
    "style": "string - e.g., 'documentary realism'",
    "lighting": "string - e.g., 'direct on-camera flash'",
    "camera_angle": "string",
    "depth_of_field": "string - e.g., 'shallow depth of field'",
    "quality": "string - e.g., 'high detail, unretouched skin'"
  }
}
```

## Best Practices & Natural Language Hacks

1.  **Camera Mathematics:** Always define exact focal length, aperture, and ISO (e.g., `85mm lens, f/2.0, ISO 200`). This forces the model to mimic optical physics rather than digital rendering.
2.  **Explicit Imperfections:** Words like "realistic" are not enough. Dictate flaws: `mild redness`, `subtle freckles`, `light acne marks`, `unguided grooming`.
3.  **Direct Commands:** Use imperative negative commands _inside_ the positive prompt paragraph: `Do not beautify or alter facial features. No makeup styling.`
4.  **Lighting Behavior:** Don't just name the light, name what it does: `direct flash photography, creating sharp highlights on skin and a slightly shadowed background.`
5.  **Non-Human Materials (Products/Nature):** When generating non-humans, replace skin/outfit logic with extreme material physics. Define surface scoring (e.g., "micro-scratches on anodized aluminum"), light scattering (e.g., "subsurface scattering through dew-covered petals"), or graphic layouts (e.g., "flat-lay composition, clean sans-serif typography").
6.  **Mandatory Negative Stack:** You MUST include the extensive negative prompt block (e.g., forbidding "skin smoothing" and "anatomy normalization").
7.  **Avoid Over-Degradation (The Noise Trap):** While simulating camera flaws (like `compression artifacts`) can help realism, pushing extreme `ISO 3200` or `heavy film grain` in complex, contrast-heavy environments (like neon night streets) actually triggers the model's "digital art/illustration" biases. Keep ISO settings below 800 and rely on _physical subject imperfections_ (like peach fuzz or asymmetrical pores) rather than heavy camera noise to sell the realism.

## Master Reference Guide

For the full schema breakdown, parameter options, and complex JSON structing for multi-panel grids, reference the core schema sections above or extend further as needed for your specific image request.

## Determining Output Routing

Before executing the API call, decide where to save the image based on context:

- **Person / LinkedIn Content?** Route to: `images/social/[subject-slug]-[YYYY-MM-DD].jpg`
- **Client Product Photos?** Route to: `images/clients/[client-slug]/[subject-slug]-[YYYY-MM-DD].jpg`
- **Web/Blog Hero Image?** Route to: `images/web/[subject-slug]-[YYYY-MM-DD].jpg`
- **Brand Photography (curated)?** Route to: `images/brand/[subject-slug]-[YYYY-MM-DD].jpg`
- **Uncertain/Default?** Use: `images/social/[subject-slug]-[YYYY-MM-DD].jpg`

**Routing Examples:**
- "Herman Adu professional headshot for LinkedIn" → `images/social/herman-adu-headshot-2026-03-11.jpg`
- "H&S Pepper red peppers product photo for ecommerce" → `images/clients/h-and-s-pepper-co/red-peppers-product-2026-03-11.jpg`
- "Modern office hero for Full Stack Fusion blog" → `images/web/modern-office-hero-2026-03-11.jpg`
- "Adu Dev team collaboration for brand library" → `images/brand/adu-dev-team-collaboration-2026-03-11.jpg`

## Agent Delegation: Prompt Structuring

Call `.claude/agents/nano-banana-images/AGENT.md` with:
- Subject type (person, product, nature, scene)
- Camera/lighting characteristics (inferred or specified)
- Desired output format (single_image, 2x2_grid, collage, etc.)
- Context about usage (LinkedIn, website, marketing, client work)

The agent will:
- Extract subject type and infer camera/lighting characteristics
- Add physical imperfections for authenticity
- Structure the prompt into the Nano Banana 2 JSON schema
- Validate resolution and aspect ratio recommendations
- Return a validated prompt ready for API execution

This reduces context overhead and ensures consistent prompt quality across all image generations.

## Execution via Kie.ai (Python Workflow) (ultrathink)

When executing Nano Banana 2 prompts against the Kie.ai API, synthesize all prompt details and brand guidelines, then use the dedicated Python pipeline.

**Prerequisites:**

1. Your `.env` file must contain `KIE_AI_API_KEY="your_key"`.
2. A JSON prompt file matching the **Dense Narrative Format** saved in `/prompts/`.

**Execution:**
Run the custom Python script to hit the `createTask` and `recordInfo` API endpoints, which safely handles payload serialization and image downloading:

```bash
set -a; source .env; set +a
python scripts/generate_kie.py prompts/your_prompt.json images/social/output_image.jpg "4:5"
```

_(The aspect ratio parameter defaults to "auto" if omitted). Use the routed path from the section above instead of the default `images/social/` if context indicates a different destination._

## How to use this skill

When a user asks you to generate a highly detailed, realistic, or complex image, you must construct the prompt string formatted EXACTLY like the JSON schema above. Pass that entire JSON string as the `Prompt` argument to the `generate_image` tool.

## Error Handling

| Scenario | Recovery |
|----------|----------|
| API rate limit exceeded | Retry after 60s with exponential backoff |
| Insufficient credits | Notify user to purchase credits at kie.ai/dashboard |
| Generated image too artificial | Request regeneration with adjusted lighting/imperfections |
| Aspect ratio mismatch | Use requested ratio with optional cropping instructions |
| Too generic description | Ask for more details (lighting, mood, setting) |
