# Nano Banana Images Agent

## Summary

The nano banana images agent engineers hyper-realistic image prompts optimized for the Nano Banana 2 API. It structures descriptions into validated JSON, injects authenticity details, and ensures outputs are indistinguishable from professional photography.

## Key Responsibilities

- Prompt Engineering — Convert narrative descriptions into strict Nano Banana 2 JSON schema, maximize detail fidelity
- Detail Extraction — Infer subject characteristics, lighting conditions, environment context, camera properties and angles
- Authenticity Injection — Add physical imperfections (pores, wrinkles, wear, texture), grain, and realism markers
- Quality Validation — Assess outputs for realism, flag AI artifacts, ensure professional photography standards
- Resolution Optimization — Recommend resolution (1K/2K/4K) based on use case, output routing, and quality requirements

## Confidence Level

High (88%+) — Prompt engineering is validated against Nano Banana 2 specifications. Quality validation prevents obvious AI artifacts. Limitation: extreme lighting or unusual subjects may require manual refinement.

## Overview

The **nano-banana-images agent** is a lightweight prompt engineering and quality assurance service that structures raw image descriptions into optimized JSON prompts for the Nano Banana 2 (Gemini 3.1 Flash) API.

## What It Does

- **Prompt Structuring:** Converts narrative descriptions into strict Nano Banana 2 JSON schema
- **Detail Extraction:** Infers subject, lighting, environment, and camera characteristics
- **Authenticity Injection:** Adds physical imperfections (pores, wrinkles, wear) for hyper-realism
- **Quality Validation:** Ensures generated images will be realistic, not AI-stylized
- **Resolution Optimization:** Recommends resolution based on use case (1K/2K/4K)

## Integration

- **Receives from:** `/nano-banana-images` skill via Agent tool delegation (for prompt engineering and quality validation subtasks)
- **Returns to:** `/nano-banana-images` skill for API calls and image processing
- **Invocation pattern:** Body text in nano-banana-images SKILL.md delegates focused image prompt subtask (e.g., "Engineer a prompt for a professional headshot")
- **Data format:** Structured JSON prompt + quality checklist, optimized for Nano Banana 2 API

## Output Routing

Images are routed to appropriate subdirectories:

- **Professional headshots/portraits:** `images/clients/[name]/`
- **Product photography:** `images/brand/` or `images/clients/[client]/`
- **Lifestyle/lifestyle content:** `images/social/`

## Quality Standards

The agent validates:

- Authenticity score (target ≥0.90)
- Realism assessment ("hyper-realistic, not AI-obvious")
- Physical imperfections present (skin texture, wear, aging)
- No visible artifacts or AI errors
- Correct aspect ratio and resolution

## Error Recovery

- Generic description → requests clarification (lighting, location, clothing, mood)
- Invalid aspect ratio → defaults to "auto"
- Missing resolution → defaults based on use case (1K for headshots, 2K for product, 4K for hero)
- Credit exhaustion → recommends purchasing via kie.ai dashboard

## Key Files

- `.claude/agents/nano-banana-images/AGENT.md` — Executable prompt (second-person, invocable)
- `.claude/skills/nano-banana-images/SKILL.md` — Parent skill that orchestrates the agent
- `.claude/skills/nano-banana-images/README.md` — User-facing documentation
