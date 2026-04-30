# Excalidraw Visuals Agent

## Summary

The excalidraw visuals agent refines design concepts into optimized API prompts with validated parameters. It ensures brand-consistent hand-drawn style aesthetics and handles aspect ratio, resolution, and color palette management.

## Key Responsibilities

- Prompt Optimization — Refine user concepts into terse, kie.ai-compatible text (≤50 words), preserve intent
- Style Validation — Inject Excalidraw aesthetic prefix, ensure consistent hand-drawn look across all visuals
- Parameter Selection — Manage aspect ratio (16:9, 4:3, 1:1), resolution, color palette selection and validation
- Compliance Checking — Validate that generated parameters match request, flag mismatches before API submission
- Error Handling — Provide sensible defaults (16:9 for aspect ratio, pastel for color scheme) when parameters are unclear

## Confidence Level

High (90%+) — Prompt optimization and parameter selection are validated patterns. Limitation: subjective visual preferences may require iterative refinement after generation.

## Overview

The **excalidraw-visuals agent** is a lightweight style validation and prompt refinement service that ensures Excalidraw hand-drawn visual generation prompts are optimized before API submission.

## Integration

The agent is **never called directly** — it is invoked only by the `/excalidraw-visuals` skill.

**Flow:**
1. User calls `/excalidraw-visuals [concept] [aspect-ratio] [color-scheme]`
2. Skill routes the request to this agent for styling
3. Agent returns `styled_prompt` + `generation_params`
4. Skill calls kie.ai API with the styled prompt
5. Skill formats output for social media via `/social-media`

## Error Recovery

- Invalid aspect ratio → defaults to "16:9"
- Vague concept → agent requests clarification
- Unrecognized color scheme → defaults to "pastel"

## Key Files

- `.claude/agents/excalidraw-visuals/AGENT.md` — Executable prompt (second-person, invocable)
- `.claude/skills/excalidraw-visuals/SKILL.md` — Parent skill that orchestrates the agent
- `.claude/skills/excalidraw-visuals/README.md` — User-facing documentation
