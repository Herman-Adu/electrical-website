---
name: diagram-orchestrator
description: Use this skill WHENEVER someone asks to diagram, draw, visualize, map out, flowchart, or show how something works — even if they don't say "diagram" explicitly. Trigger on: "how does X work", "show me the flow", "compare A vs B", "draw the architecture", "make a state machine", "hub and spoke", "timeline of", "data pipeline", "map out the system", "visualize this", "what's the topology", "workflow for", "process flow", "photo", "headshot", "realistic image", "site photo", "team photo", "project photo". Routes to the correct tier automatically: Mermaid for quick inline diagrams (≤5 nodes), Excalidraw JSON for editable drafts (6–15 nodes), kie.ai PNG for publish-quality images (16+ nodes or blog/docs context), nano-banana-images for realistic photos and photography. Handles 8 diagram types: architecture, flowchart, comparison, state-machine, hub-and-spoke, timeline, data-flow, photo. Use even when the user says "quick sketch" or just pastes a list of components and asks you to "show it visually".
argument-hint: "[diagram-type] [concept or system name] [quick|draft|publish]"
disable-model-invocation: true
compatibility: Requires visualization skill + excalidraw-diagram skill + excalidraw-visuals skill (kie.ai optional for Tier 3) + nano-banana-images skill (optional for Tier 4 photo generation)
---

## Diagram Orchestrator

Single entry point for ALL diagram requests. Analyze the request, route to the correct tier, and return the result with a companion summary.

---

## Step 1: Parse Intent

Extract from `$ARGUMENTS`:

1. **Diagram type** — one of: `architecture`, `flowchart`, `comparison`, `state-machine`, `hub-and-spoke`, `timeline`, `data-flow`
   - If not explicit, infer from keywords:
     - "flow", "process", "decision" → `flowchart`
     - "system", "component", "architecture", "stack" → `architecture`
     - "vs", "compare", "versus", "trade-off" → `comparison`
     - "state", "lifecycle", "status", "transition" → `state-machine`
     - "hub", "spoke", "central", "topology", "radiates" → `hub-and-spoke`
     - "timeline", "chronological", "history", "sequence of events" → `timeline`
     - "pipeline", "data flow", "data movement", "stream" → `data-flow`
     - "photo", "photography", "realistic", "headshot", "portrait", "team", "site" → `photo`

2. **Node count estimate** — count distinct named entities in the concept:
   - ≤5 identifiable nodes → lean Tier 1
   - 6–15 → lean Tier 2
   - 16+ → lean Tier 3
   - If unclear: estimate conservatively (assume medium = 8–10 nodes)

3. **Output keyword** — scan args for override keywords:
   - `quick` or `inline` → force Tier 1
   - `draft` or `editable` → force Tier 2
   - `publish` or `png` or `blog` → force Tier 3
   - `photo` or `realistic` or `headshot` → force Tier 4

4. **Context clues** — note if user mentions: blog post, docs, README, presentation (→ lean Tier 3); internal notes, sketch, rough (→ lean Tier 2).

---

## Step 2: Routing Decision

Apply this decision tree in order:

```
1.   Is there an override keyword 'photo'/'realistic'/'headshot'? → Tier 4 (nano-banana-images)
1.5. Is diagram type 'photo' OR override keyword 'photo'/'realistic'/'headshot'? → Tier 4
2.   Is there another override keyword? → Apply keyword tier, skip node count
3.   Is node count ≤5?                  → Tier 1 (Mermaid via visualization)
4.   Is node count 6–15?                → Tier 2 (Excalidraw JSON via excalidraw-diagram)
5.   Is node count 16+?                 → Tier 3 (kie.ai PNG via excalidraw-visuals)
6.   Cannot estimate node count?        → Default Tier 2, notify user
```

**Auto-escalation rule:** If mid-generation the actual node count exceeds the tier's limit, escalate automatically and notify:
> "Your diagram grew to 16 nodes — escalating to Tier 3 (kie.ai PNG) for a cleaner result."

### Routing Table — All 8 Diagram Types

| Diagram Type   | Default Tier | Keyword Overrides           | Sequential Thinking? |
|----------------|-------------|------------------------------|----------------------|
| `architecture` | 2           | `quick` → 1, `publish` → 3  | Yes (always)         |
| `flowchart`    | 1           | `draft` → 2, `publish` → 3  | No (≤10 nodes)       |
| `comparison`   | 1           | `draft` → 2, `publish` → 3  | No                   |
| `state-machine`| 2           | `quick` → 1, `publish` → 3  | Yes (>8 states)      |
| `hub-and-spoke`| 2           | `quick` → 1, `publish` → 3  | No                   |
| `timeline`     | 1           | `draft` → 2, `publish` → 3  | No                   |
| `data-flow`    | 2           | `quick` → 1, `publish` → 3  | Yes (always)         |
| `photo`        | 4           | — (always Tier 4)            | No                   |

**Tier Summary:**

| Tier | Tool                   | Skill                  | Node Range    | Output          |
|------|------------------------|------------------------|---------------|-----------------|
| 1    | Mermaid (inline)       | `visualization`        | ≤5 nodes      | `.md` file      |
| 2    | Excalidraw JSON        | `excalidraw-diagram`   | 6–15 nodes    | `.excalidraw`   |
| 3    | kie.ai PNG             | `excalidraw-visuals`   | 16+ nodes     | `.png` file     |
| 4    | nano-banana-images     | `nano-banana-images`   | N/A (photo)   | `.jpg` file     |

---

## Step 3: Sequential Thinking Gate

For `architecture`, `data-flow`, and `state-machine` diagrams (Tier 2 or 3), invoke sequential thinking before generation:

```
mcp__MCP_DOCKER__sequential_thinking__sequentialthinking({
  thought: "Planning [diagram-type] diagram for [concept]. Identifying nodes, relationships, hierarchy...",
  nextThoughtNeeded: true
})
```

Use sequential thinking to:
- Enumerate all nodes systematically (prevents missing components)
- Identify bidirectional vs unidirectional relationships
- Detect hierarchical containment (parent → child groupings)
- Validate that the chosen tier can handle the complexity

Skip sequential thinking for: `flowchart` ≤10 nodes, `comparison`, `timeline`, `hub-and-spoke` ≤8 spokes.

---

## Step 4: Delegate to Downstream Skill

Build the delegation payload and call the appropriate skill. Always inject brand palette and enforce neutral/technical voice.

### Tier 1 → visualization skill

Pass:
- Diagram type (map to Mermaid subtype — see table below)
- Concept/nodes
- Brand palette (for theme override if supported)
- Output path override: `archives/diagrams/YYYY-MM-DD-[slug]-mermaid.md`

**Diagram type → Mermaid subtype mapping:**

| Orchestrator Type | Mermaid Subtype          |
|-------------------|--------------------------|
| `flowchart`       | `flowchart LR` or `TD`   |
| `architecture`    | `graph LR`               |
| `comparison`      | `graph LR` (two branches)|
| `state-machine`   | `stateDiagram-v2`        |
| `hub-and-spoke`   | `graph TD` (star layout) |
| `timeline`        | `timeline`               |
| `data-flow`       | `flowchart LR`           |

### Tier 2 → excalidraw-diagram skill

Pass:
- Concept, components array, relationships array
- Brand palette injected as color zone overrides:
  - Primary nodes: `strokeColor: "#006e56"`, `backgroundColor: "#c2fff1"`
  - Secondary: `strokeColor: "#00b2a9"`, `backgroundColor: "#e0faf6"`
  - Containers: `strokeColor: "#004a3a"`, `backgroundColor: "#b3f5e6"`
  - Warnings: `strokeColor: "#d97706"`, `backgroundColor: "#fef3c7"`
  - Neutral: `strokeColor: "#334155"`, `backgroundColor: "#f1f5f9"`
  - Connectors/arrows: `strokeColor: "#64748b"`
- Output path override: `archives/diagrams/YYYY-MM-DD-[slug]-draft.excalidraw`

### Tier 3 → excalidraw-visuals skill

Pass:
- Full concept description with all nodes enumerated
- Layout template (hub-and-spoke, left-to-right, comparison, etc.)
- Brand palette for color assignments (map to kie.ai pastel equivalents)
- Output path override: `archives/diagrams/YYYY-MM-DD-[slug]-publish.png`

### Tier 4 → nano-banana-images skill

Pass:
- Subject description (person, team, site, equipment)
- Context (LinkedIn headshot, project portfolio, marketing)
- Style directives from nexgen brand guidelines
- Output path override: `images/nexgen/[category]/[slug]-[YYYY-MM-DD].jpg`

**Output routing:**
- Team/headshots → `images/nexgen/team/[slug]-[YYYY-MM-DD].jpg`
- Site/project   → `images/nexgen/projects/[slug]-[YYYY-MM-DD].jpg`
- Marketing/social → `images/nexgen/marketing/[slug]-[YYYY-MM-DD].jpg`

**CRITICAL:** Do NOT pass electrical-services brand voice to any downstream skill. Use technical/neutral language only. Describe diagrams in engineering terms, not marketing language.

---

## Step 5: Output Path Naming Convention

All orchestrated diagrams save to: `archives/diagrams/`

Format: `archives/diagrams/YYYY-MM-DD-[slug]-[tier-suffix].[ext]`

| Tier | Suffix     | Extension     | Example |
|------|-----------|---------------|---------|
| 1    | `mermaid` | `.md`         | `2026-04-30-memory-architecture-mermaid.md` |
| 2    | `draft`   | `.excalidraw` | `2026-04-30-mcp-stack-hub-spoke-draft.excalidraw` |
| 3    | `publish` | `.png`        | `2026-04-30-graphrag-vs-rag-comparison-publish.png` |
| 4    | `photo`   | `.jpg`        | `2026-04-30-herman-adu-headshot-photo.jpg` |

**Slug rules:**
- Kebab-case from the concept name (max 5 words)
- Strip articles (a, an, the), prepositions
- Example: "Architecture of the MCP Docker stack" → `mcp-docker-stack`

---

## Step 6: Present Result + README Companion

After the downstream skill returns, present:

1. **File path** — absolute path to the generated file
2. **Tier used** — state which tier was applied and why
3. **3-line companion summary** (always include):
   ```
   What it shows: [one sentence — what the diagram represents]
   Key insight:   [one sentence — the most important relationship or pattern visible]
   Next step:     [one sentence — how to use or extend this diagram]
   ```
4. **If auto-escalated:** explain why the tier changed
5. **If Tier 2 (Excalidraw):** include how-to-open instructions
6. **If Tier 3 (PNG):** include the rendered image path

---

## Error Handling

| Scenario | Recovery |
|----------|----------|
| No diagram type detected | Infer from concept keywords; if still unclear, ask 1 question: "Is this a flow (steps in sequence), structure (components), or comparison?" |
| Node count cannot be estimated | Default to Tier 2 and note assumption; offer to re-route after user confirms count |
| Downstream skill unavailable | Fallback: Tier 1 → try Tier 2 → try Tier 3 → return structured text description with note |
| Concept too vague | Ask one clarifying question before proceeding: "What are the 3–5 main components?" |
| Tier 3 PNG fails (kie.ai error) | Fallback to Tier 2 Excalidraw automatically; notify user |
| Sequential thinking times out | Proceed without it; flag: "Sequential thinking skipped — diagram may need manual validation" |
| Output directory missing | Create `archives/diagrams/` automatically before writing |
| Circular dependencies detected | Flag them explicitly in the companion summary; suggest feedback-loop arrow style |

---

## Do NOT Use This Skill When

- The "diagram" is a simple table (use a Markdown table instead)
- The request is for a UI wireframe or mockup (use a dedicated design tool)
- The concept has 1–2 elements only (write a sentence instead)
- The user explicitly asks for a non-supported format (Visio, draw.io — note limitation)
