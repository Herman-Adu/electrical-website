---
name: excalidraw-visuals
description: Use when someone asks for a hand-drawn visual, PNG image, rendered diagram, visual explanation, or says "excalidraw image" or "excalidraw visual". This generates PNG images, not editable files.
disable-model-invocation: true
argument-hint: "[concept to visualize]"
---

## Brand Voice & Style (auto-injected)

!`cat context/brand-voice.md 2>/dev/null || echo "Default: hand-drawn aesthetic, educational tone, clean design."`

## Prerequisites

Before using this skill, make sure you have:
1. A kie.ai API key (sign up at https://kie.ai) added to `.env` as `KIE_AI_API_KEY`
2. Node.js installed
3. The generation script at `scripts/excalidraw-visuals/generate-visual.js`
4. The style reference image at `brand-assets/excalidraw-style-reference.png`

---

Read the full visual specification before building any prompt:
- `style-guide.md` (in this skill's folder) -- color system, font spec, shape rules, icon vocabulary, layout templates, text minimization rules

---

## Style Prefix (LOCKED)

This exact text is prepended to EVERY prompt. Never modify it per-request.

```
Excalidraw-style hand-drawn diagram on a clean white background. All text uses neat, consistent architect-style handwriting -- legible, slightly rounded letters with medium stroke weight. Letter sizes are uniform within each label. Titles are bold and larger. Body labels are smaller but equally neat. This is NOT sloppy handwriting -- it looks like a designer wrote it carefully with a thick marker.

Shapes are rounded rectangles with a 2-3px slate (#334155) hand-drawn outline and brand-palette fills. Lines and arrows are slightly wobbly and hand-drawn, not ruler-straight. Arrowheads are simple triangles. Nothing is pixel-perfect -- everything has a natural, sketched feel with visible stroke texture.

Color palette: electric teal (#00b2a9 stroke / #e0faf6 fill), deep cyan (#006e56 stroke / #c2fff1 fill), rich amber (#d97706 stroke / #fef3c7 fill), deep forest (#004a3a stroke / #b3f5e6 fill), industrial slate (#334155 stroke / #f1f5f9 fill). All text is near-black (#1e1e1e). All lines and arrows are slate (#334155). Background is always clean white.

People are simple stick figures with round heads, no facial features. AI agents/robots have a round head with two dot eyes and a small antenna. Documents have a folded corner. Gears represent automation. All icons are simple line drawings, not detailed or cartoonish.

Layout is clean and spacious with generous whitespace. Visual hierarchy is clear -- title is largest, labels are short (max 3 words each). The overall feel is educational, friendly, and slightly more polished than basic Excalidraw -- colored fills, intentional spacing, consistent sizing, and meaningful color coding elevate it.

Do NOT include: realistic photos, gradients, drop shadows, 3D effects, corporate clip art, stock imagery, dark backgrounds, heavy borders.
```

---

## Step 1: Gather Input

The concept to visualize: $ARGUMENTS

If the request is vague, ask one clarifying question about what specific angle or flow to show.

From the user (if not in $ARGUMENTS):
- What specific elements, steps, or labels to include
- Aspect ratio preference (default: 16:9)

## Step 2: Choose a Layout Template

Pick the best layout from the style guide:

| Template | Best For |
|----------|----------|
| Left-to-Right Flow | Processes, sequences, transformations |
| Hub and Spoke | Capabilities, features around a central concept |
| Top-to-Bottom Hierarchy | Levels, layers, progressive depth |
| Side-by-Side Comparison | Before/after, old vs new, option A vs B |
| Numbered Steps List | Frameworks, checklists, ordered instructions |
| Cycle / Loop | Feedback loops, iterative processes |

## Step 3: Plan the Text (Minimize It)

Plan every piece of text that will appear in the image before writing the prompt:

1. **Title:** Max 5 words. Prefer 3.
2. **Box labels:** Max 3 words each. Prefer 1-2.
3. **Annotations:** Max 4 words each.
4. **Total word count:** Target under 30 words. Absolute max 50.

**Spelling protection:**
- Flag any word over 8 characters and shorten it
- Use icons instead of words where possible
- Use abbreviations (API, AI, DB, CLI)
- Remove articles and prepositions

## Step 4: Delegate to Validation Agent

Before building the final prompt, delegate to the excalidraw-visuals agent with:
- The concept and layout template chosen
- Aspect ratio preference
- Any color scheme requirements

The agent will:
- Inject the locked Excalidraw style prefix
- Minimize word count (≤50 words)
- Validate colors are pastel and brand-compliant
- Return a styled prompt ready for API submission

## Step 4B: Manual Prompt Construction (If Agent Not Used)

Construct the prompt in this exact structure:

```
[STYLE PREFIX]

STYLE REFERENCE: Match the visual style of the reference image exactly -- same font, same shapes, same colors, same level of polish.

Diagram concept: [TITLE -- max 5 words]

Layout: [TEMPLATE NAME] -- [brief spatial description]

Elements (left to right / top to bottom):
1. [Element name] -- [color] fill, [icon if any], label: "[EXACT TEXT]"
2. [Element name] -- [color] fill, [icon if any], label: "[EXACT TEXT]"
3. ...

Connections:
- Arrow from [1] to [2], label: "[TEXT or none]"
- Arrow from [2] to [3]
...

Title at top center, bold and large: "[EXACT TITLE TEXT]"
```

**Rules:**
- Be explicit about spatial positions ("on the left", "top center", "bottom right")
- Assign a specific color from the palette to every filled element
- Name every element and its exact label text
- Describe connections/arrows with direction

## Step 5: Assign Colors by Meaning

- **Flows:** Cyan (input) -> Amber (process) -> Teal (output)
- **Comparisons:** Amber (old/bad/slow) vs Teal (new/good/fast)
- **Hub and spoke:** Cyan center, mixed colors for spokes
- **Hierarchies:** Cyan (top) -> Teal (middle) -> Deep (bottom)
- **Lists/grids:** Alternate colors row by row

Never leave color choice to the model. Always specify.

## Step 6: Generate the Image

**Always include the style reference image.** This is mandatory for visual consistency.

```bash
set -a; source .env; set +a
node scripts/excalidraw-visuals/generate-visual.js "<FULL_PROMPT>" "archives/diagrams/[YYYY-MM-DD]-[slug]-visuals.png" "[ASPECT_RATIO]" --input "brand-assets/excalidraw-style-reference.png"
```

You can pass additional reference images (logos, screenshots, etc.) via extra `--input` arguments:
```bash
node scripts/excalidraw-visuals/generate-visual.js "<FULL_PROMPT>" "archives/diagrams/[YYYY-MM-DD]-[slug]-visuals.png" "[ASPECT_RATIO]" --input "brand-assets/excalidraw-style-reference.png" "path/to/another-image.png"
```

Aspect ratios: `16:9` (default), `1:1`, `4:5`

If `brand-assets/excalidraw-style-reference.png` does not exist, generate without it and tell the user to add a style reference image for consistent results.

## Step 7: Present Result

- Show the file path for preview
- One-line summary of what the visual shows
- Ask if adjustments are needed

If adjustments needed: modify only the diagram-specific portion. Never change the style prefix.

---

## File Locations

| What | Path |
|------|------|
| Style guide | `.claude/skills/excalidraw-visuals/style-guide.md` |
| Script | `scripts/excalidraw-visuals/generate-visual.js` |
| Style reference | `brand-assets/excalidraw-style-reference.png` |
| Output | `archives/diagrams/` |
| API key | `.env` (KIE_AI_API_KEY) |

## Notes

- Uses Nano Banana API via kie.ai (~$0.02-0.09 per image)
- Pass `model: fast` for quick drafts (~$0.02/image), `model: quality` for blog/publish output (~$0.09/image)
- The style prefix is locked. Only the diagram description changes per-request.
- The style reference image is the #1 consistency lever. Always include it.
- If generation fails, check `.env` for KIE_AI_API_KEY
- When in doubt, fewer words and more icons

## Error Handling

| Scenario | Recovery |
|----------|----------|
| API rate limit (429) | Queue and retry in 60s |
| Insufficient credits (402) | Notify user, suggest topping up at kie.ai/dashboard |
| Generation slow (>45s) | Normal for complex visuals; check KIE_AI_API_KEY validity |
| Style mismatch | Provide brand-assets/excalidraw-style-reference.png |
| Text hard to read | Reduce word count (keep <30 words) |
