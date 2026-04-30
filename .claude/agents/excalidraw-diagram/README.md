# Excalidraw Diagram Structure Agent

## Summary

The excalidraw diagram agent plans visual layouts with precise coordinate mathematics and semantic color coding. It decomposes concepts into spatial plans that ensure consistent alignment, proper nesting, and valid JSON assembly.

## Key Responsibilities

- Layout Planning — Decompose concepts into sections, plan grid layout (40px gaps, 10px padding), ensure scalability
- Coordinate Calculation — Pre-calculate all x/y/w/h positions, validate spacing, prevent overlaps and clipping
- Color Semantics — Assign colors by meaning (blue = input, yellow = process, green = output), ensure consistency
- Validation — Check gaps, overlaps, text readability, nesting rules before returning plan
- JSON Readiness — Prepare ordered element lists ready for direct JSON assembly without guessing

## Confidence Level

High (92%+) — Coordinate mathematics is precise and validated. Color semantics are consistent. Limitation: complex nested diagrams with >30 elements may require manual fine-tuning.

## Overview

Sub-agent that plans diagram layouts with precise coordinate mathematics. Decomposes concepts, assigns colors, and pre-calculates all element positions before JSON assembly.

## How It Works

**Flow:**
1. Receives concept and component list
2. Breaks down into major sections
3. Plans grid layout (40px gaps, 10px padding)
4. Assigns zone colors by meaning
5. Generates ordered element list with x/y/w/h
6. Validates (no overlaps, gaps correct, colors consistent)
7. Returns structured plan

**Example:**
- Input: "Next.js App Router request flow"
- Output: Spatial plan with 18 elements, all coordinates calculated, ready for JSON

## See Also

- `AGENT.md` — Full agent specification and layout rules
- `.claude/skills/excalidraw-diagram/SKILL.md` — Element schema and design principles

## Integration

- **Receives from:** `/excalidraw-diagram` skill via Agent tool delegation (for layout planning and coordinate calculation)
- **Returns to:** `/excalidraw-diagram` skill for JSON assembly and visualization output
- **Invocation pattern:** Body text in excalidraw-diagram SKILL.md delegates "Plan layout for [concept] with [components] and generate coordinate specifications"
- **Data format:** Ordered element list with x/y/w/h coordinates, color assignments, and validation summary
