# Excalidraw Diagram Skill

## Purpose

Generates editable `.excalidraw` JSON files for diagrams. Produces professional architecture diagrams, flowcharts, data models, dependency graphs, and conceptual visualizations that can be edited freely at excalidraw.com.

**Best for:**
- Architecture diagrams (Next.js, microservices, infrastructure)
- System flow diagrams (user journeys, request flows, CI/CD pipelines)
- Entity relationship diagrams (databases, data models)
- Dependency graphs (skill relationships, module dependencies)
- Conceptual diagrams (tech stacks, frameworks, processes)

## Prerequisites

- No prerequisites — skill generates pure JSON, viewable at excalidraw.com (free, no account needed)

## How to Use

### Direct invocation (specify concept):
```bash
/excalidraw-diagram "Next.js App Router request flow"
```

### With description:
```bash
/excalidraw-diagram "Adu Dev tech stack with tools and integrations"
```

## Arguments

- `[concept or system to diagram]` — What to diagram (required)

The skill will ask clarifying questions if needed:
- What specific aspect? (architecture, data flow, networking, etc.)
- What level of detail? (high-level overview vs. detailed internals)

## Output

### Generated file:
- **Format:** `.excalidraw` JSON file (text, git-friendly)
- **Location:** Current directory or specified path
- **Name:** `[concept-slug].excalidraw`

### In-conversation:
- Full JSON code block (copy-paste ready)
- Summary of what the diagram shows
- Instructions for viewing/editing at excalidraw.com

## How to View & Edit

1. **Option A (No download needed):**
   - Go to excalidraw.com
   - Copy the JSON code block from the conversation
   - Paste with Ctrl+V / Cmd+V
   - Edit freely, export as `.excalidraw` or PNG

2. **Option B (Download file):**
   - Save the `.excalidraw` file locally
   - Go to excalidraw.com
   - Click menu (hamburger) → "Open" → select the file
   - Edit and export

## Integration

**Feeds into:**
- Client deliverables (architecture proposals, RFPs, technical docs)
- `/content-creation` — Turn diagrams into educational blog posts
- `/excalidraw-visuals` — Generate PNG version for social media
- Documentation (README.md files, project specs)

**Used by:**
- Technical sales (show system design to prospects)
- Project planning (visualize implementation approach)
- Documentation (include in developer guides)
- Marketing (show tech stack/architecture in content)

## When NOT to Use

- ❌ Generating PNG images (use `/excalidraw-visuals` instead)
- ❌ Creating hand-drawn style visuals (use `/excalidraw-visuals`)
- ❌ Rendering existing diagrams (use `/excalidraw-visuals` for PNG export)
- ❌ Real-time collaborative diagramming (use excalidraw.com directly)

## Design Features

- **Color coding** — Zone colors (blue/yellow/green/purple/red) tell the story
- **Nesting** — Containment shown through nested boxes with consistent padding
- **Arrows** — Directional relationships labeled with intent
- **Typography** — 32–36px titles, 16–18px labels, consistent hierarchy
- **Whitespace** — Minimum 15px gaps between elements for clarity

## Security Considerations

- **File Generation:** Skill generates JSON only (no API keys required)
- **Data Privacy:** Diagrams are stored locally in `projects/excalidraw-diagram/`
- **No External APIs:** All processing is client-side (no data sent to external services)
- **File Access:** Skill only reads from local context/code; writes to designated output directory
- **Editable Format:** `.excalidraw` files can be viewed at excalidraw.com without account (free, public-by-default sharing)

## Common Use Cases

### Architecture Documentation
Document microservices, Next.js apps, or infrastructure stacks. E.g., `/excalidraw-diagram "Next.js + Vercel + PostgreSQL + Redis architecture"`.

### Client Deliverables
Create professional architecture/flow diagrams for proposals and documentation. Store in `archives/client-work/[client]/` for reuse.

### Internal Documentation
Diagram complex workflows, state machines, or dependency graphs to clarify team communication and onboarding.

### Portfolio Showcase
Use diagrams in case studies. Example: `/excalidraw-diagram "H&S Pepper Co ecommerce platform architecture"` then share via `/social-media`.

## Example Workflow

```
Herman: /excalidraw-diagram "Full Stack Fusion portfolio deployment architecture"
          ↓
Skill generates diagram showing:
  - GitHub repo → Vercel build → deployment → monitoring
  - Environment variables, secrets, CDN
  - Database connections, API layers
          ↓
Skill returns .excalidraw JSON
          ↓
Herman: Copy JSON, paste at excalidraw.com
        Edit to adjust layout or add annotations
        Export as PNG for proposal
          ↓
Herman: /excalidraw-visuals [concept]
        Convert diagram to hand-drawn PNG for social
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Can't open .excalidraw file" | Ensure excalidraw.com is used (not a desktop app). Paste JSON with Ctrl+V |
| "Diagram too cluttered" | Ask for a simpler version: `/excalidraw-diagram [concept] high-level overview` |
| "Colors don't match my brand" | Edit at excalidraw.com — click element and change colors in right panel |
| "Elements misaligned" | Skill attempts proper spacing. Re-request or manually adjust at excalidraw.com |

## Files Used

- `.claude/skills/excalidraw-diagram/SKILL.md` — Layout system, coordinate math, design principles
- `excalidraw.com` — Free viewer/editor (no installation needed)

## Related Skills

- `/excalidraw-visuals` — Generate PNG images from diagrams (hand-drawn style)
- `/visualization` — Create Mermaid diagrams (flowcharts, state machines, ERDs)
- `/code-generation` — Generate code from diagrams
- `/content-creation` — Write documentation around diagrams
