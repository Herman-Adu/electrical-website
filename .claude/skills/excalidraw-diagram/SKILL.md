---
name: excalidraw-diagram
description: Use when someone asks to draw a diagram, make an Excalidraw diagram, or build an editable diagram. Default for all diagram requests.
disable-model-invocation: true
argument-hint: "[concept or system to diagram]"
---

## Workflow

### Step 0: Delegate to Agent (REQUIRED)

Call `.claude/agents/excalidraw-diagram/AGENT.md` with:
- Concept: $ARGUMENTS
- System or flow to diagram
- Clarifying details (specific aspect, level of detail)

The agent will validate the request and return a plan for the diagram.

### Template Library
Load the closest matching template from `.claude/skills/excalidraw-diagram/templates/`:
- `architecture.excalidraw.json` — system/component maps
- `flowchart.excalidraw.json` — process/decision flows
- `comparison.excalidraw.json` — side-by-side trade-offs
- `state-machine.excalidraw.json` — lifecycle/status transitions
- `hub-and-spoke.excalidraw.json` — centralized topology
- `timeline.excalidraw.json` — chronological sequences
- `data-flow.excalidraw.json` — pipeline/data movement

Use the template as a starting structure. Customize colors, labels, and layout for the specific concept.

### Step 1: Understand the request
From the agent's returned plan, confirm:
- What concept or system are we diagramming?
- What are the major components or sections?
- What is the flow or relationship between them?

If the agent requested clarification, ask 1-2 questions:
- What specific aspect? (architecture, networking, volumes, etc.)
- What level of detail? (high-level overview vs. detailed internals)

### Step 2: Research if needed
If you're not confident about the technical accuracy of the concept, research it before diagramming. Verify:
- Correct component names and relationships
- Proper hierarchy and nesting
- Accurate data flow direction

### Step 3: Plan the layout (ultrathink)
Synthesize the concept complexity and visual requirements. Before writing any JSON, sketch the layout mentally:
- What are the major sections? (left-to-right or top-to-bottom)
- What is nested inside what?
- What arrows connect what?

Write down the section plan:
```
[Section A: w=170] --40px gap-- [Section B: w=170] --40px gap-- [Section C: w=640]
```

### Step 4: Generate elements
Build elements in order:
1. Outer boxes / containers first
2. Section header text
3. Nested elements (top to bottom within each section)
4. Arrows and arrow labels last

### Step 5: Save and deliver
1. Save to `archives/diagrams/YYYY-MM-DD-[concept-slug].excalidraw`
2. Show the full JSON in a code block so the user can copy it directly
3. Briefly describe what the diagram shows and what each color zone represents
4. Tell the user how to use the file:

> **How to view and edit your diagram:**
> - Go to excalidraw.com (free, no account needed)
> - Option A: Click the menu (top-left hamburger icon) > "Open" > select the `.excalidraw` file
> - Option B: Copy the JSON code block above, open excalidraw.com, and paste it with Ctrl+V / Cmd+V
> - Every element is fully editable -- drag to move, grab handles to resize, double-click to edit text

### Step 6: Handle feedback
If the user asks for changes:
- Shifting an element = update x/y on that element + all elements that depend on it
- Changing text = update both `text` and `originalText` fields
- Adding a zone = assign it a new color from the palette, keep spacing consistent
- If a diagram gets complex (20+ elements), build it section by section to avoid coordinate errors

---

## Critical Rule: Text Contrast

Text inside colored shapes must be readable. Use `#1e1e1e` (near-black) for all text inside filled shapes. Never use the zone's stroke color for text sitting on that zone's background (e.g., cyan text on a cyan card is unreadable). Reserve the zone's strokeColor for shape borders and arrows only.

---

## Design Principles

**Color tells the story:** One color per logical zone. Everything in the "input" zone is blue. Everything in the "output" zone is green. The viewer should understand structure before reading a word.

**Nesting shows containment:** If X lives inside Y, X's box is drawn inside Y's box with consistent padding. Coordinates are absolute, not relative: `child_x = parent_x + padding`.

**Labels are short:** 2-5 words per label. Longer explanations become annotations with smaller fontSize and muted color (`#64748b`).

**White space is structure:** 15px minimum gap between siblings. 40px minimum between major sections.

**Arrows carry intent:** Color arrows to match purpose. Label every non-obvious arrow.

---

## Layout System

Always plan coordinates before writing JSON.

1. Identify major sections (left-to-right or top-to-bottom)
2. Assign fixed width and starting x to each section
3. Calculate gaps: 40-60px between major sections, 15-25px between siblings
4. Work top-to-bottom within sections: `next_y = current_y + current_height + gap`

**Padding rules:**
- Outer box to inner label: 8-10px top offset
- Outer box to nested box: 10-15px offset on all sides
- Sibling elements: 10-15px gap

**Text width trick:** Set text width = parent box width. Text centers automatically when `textAlign: "center"`.

**Arrow labels:** Position as separate text elements, 20-25px above the arrow's midpoint y, with width and x matching the arrow.

**Coordinate math example:**
```
Section A: x=30,  w=170  -> right edge = 200
Gap:                        40px
Section B: x=240, w=170  -> right edge = 410
Gap:                        40px
Section C: x=450, w=600  -> right edge = 1050
```

---

## Color System

| Zone | Use for | strokeColor | backgroundColor |
|------|---------|-------------|-----------------|
| Cyan | Primary nodes, key decisions, entry points | `#006e56` | `#c2fff1` |
| Teal | Secondary nodes, flows, services | `#00b2a9` | `#e0faf6` |
| Deep | Headers, containers, system boundaries | `#004a3a` | `#b3f5e6` |
| Amber | Warnings, decisions, highlights, callouts | `#d97706` | `#fef3c7` |
| Slate | Neutral nodes, external systems, annotations | `#334155` | `#f1f5f9` |
| Pylon | Connectors, arrows, tertiary elements | `#64748b` | `#e2e8f0` |

For nested elements, vary the fill intensity:
- Outer: lightest (e.g., `#e0faf6` teal / `#c2fff1` cyan)
- Inner: medium (e.g., `#b3f5e6` deep)
- Deep inner: use a slightly darker stroke variant

---

## Typography Scale

| Role | fontSize | fontFamily |
|------|----------|------------|
| Diagram title | 32-36 | 2 (Helvetica) |
| Section header | 20-24 | 2 |
| Element label | 16-18 | 2 |
| Annotation | 14-15 | 2 |
| Small note | 12-13 | 2 |
| Hand-drawn style | any | 1 (Virgil) |
| Code label | 14-16 | 3 (Cascadia) |

Text width = parent box width. Text x/y offset ~8-10px from box x/y for padding.

---

## Element Schema

Every element needs these base fields. Do not omit any.

### Base fields (all types)
```json
{
  "id": "unique-string",
  "type": "rectangle|ellipse|diamond|arrow|line|text|freedraw",
  "x": 0, "y": 0,
  "width": 100, "height": 50,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": null,
  "boundElements": [],
  "updated": 1,
  "link": null,
  "locked": false
}
```

### Text fields (add to base)
```json
{
  "text": "Label text",
  "fontSize": 16,
  "fontFamily": 2,
  "textAlign": "center",
  "verticalAlign": "top",
  "containerId": null,
  "originalText": "Label text",
  "lineHeight": 1.25
}
```

### Arrow fields (add to base)
```json
{
  "points": [[0, 0], [100, 0]],
  "lastCommittedPoint": null,
  "startBinding": null,
  "endBinding": null,
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

### Key values
- **fontFamily:** 2 = Helvetica (default, professional), 1 = Virgil (hand-drawn style only), 3 = Cascadia (monospace)
- **roughness:** 0 = smooth, 1 = slightly rough (default Excalidraw feel), 2 = very rough
- **fillStyle:** `"solid"` for clean diagrams, `"hachure"` for classic Excalidraw hatching
- **roundness:** `null` = sharp corners, `{"type": 3}` = rounded rectangles, `{"type": 2}` = curved arrows
- **strokeStyle:** `"solid"`, `"dashed"` (optional connections), `"dotted"`

---

## Common Patterns

### Labeled box
```
[Rect: x, y, w, h]
[Title text: x, y+10, w, fontSize=18]
[Subtitle: x, y+38, w, fontSize=14, strokeColor=#64748b]
```

### Nested container
```
[Host rect: x=0, y=0, w=640, h=500]
[Host label: x=0, y=10, w=640]
[Item 1: x=15, y=50, w=190, h=200]
[Item 2: x=225, y=50, w=190, h=200]
[Item 3: x=435, y=50, w=190, h=200]
```

### Arrow with label
```
[Arrow: x=start_x, y=mid_y, width=gap_width, points=[[0,0],[gap_width,0]]]
[Label: x=start_x, y=mid_y-25, width=gap_width, textAlign=center]
```

---

## JSON Wrapper

Every diagram uses this shell:
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ ... ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Ambiguous concept | Ask 2-3 clarifying questions before generating JSON |
| Complex system (30+ elements) | Recommend multi-diagram approach or zoom in on subsystem |
| Unusual diagram type | Validate user intent; suggest standard type as alternative |
| JSON generation fails | Provide diagram in markdown format as fallback |
| Editing errors at excalidraw.com | Provide backup as PNG export or original markdown description |
```
