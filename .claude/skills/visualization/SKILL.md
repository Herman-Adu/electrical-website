---
name: visualization
description: Use when someone asks to create a diagram, flowchart, architecture map, ERD, state machine, dependency graph, or any visual representation. Generates Mermaid code blocks saved as .md files.
argument-hint: "[diagram-type] [description or source file]"
disable-model-invocation: true
---

## Current Priorities (auto-injected)

!`cat context/current-priorities.md 2>/dev/null || echo "No priorities. Ask user for diagram focus and scope."`

## File Locations & Context

Mermaid diagram examples available at: `archives/diagrams/` (primary) or `references/diagrams/` (legacy, if populated)

# Visualization Skill

A system that generates production-quality Mermaid diagrams from technical specifications, code, schemas, or system documentation.

This skill specializes in:
- Workflow diagrams (flowcharts, swimlanes, sequence diagrams)
- Architecture diagrams (system design, component relationships)
- State machines (lifecycle, phase transitions)
- Data models (ERDs, schema diagrams)
- Dependency graphs (skill dependencies, module relationships)

## When to Use This Skill

**Use visualization when:**
- You need to document system architecture or data models
- Creating flowcharts for business processes or workflows
- Building state machines for phase transitions or status tracking
- Visualizing dependencies (skills, modules, components)
- Explaining complex relationships or system interactions
- Creating Gantt charts for project timelines
- You want GitHub-renderable Mermaid diagrams saved to archives

**Don't use visualization when:**
- Creating static images/graphics (use excalidraw-diagram or nano-banana-images instead)
- You need pixel-perfect design or brand styling (those skills handle it)
- Diagrams are trivial or throwaway (sketching on whiteboard is faster)
- You need non-Mermaid formats (Visio, draw.io, etc.)

**Common misconception:**
- "Visualization only for tech diagrams" — False. Use it for any structured relationships: org charts, project dependencies, workflows, timelines.

**Pairs well with:**
- `/code-generation` — Visualize code architecture and data flow
- `/planning` — Visualize project phases and timeline (Gantt charts)
- `/knowledge-memory` — Archive diagrams to `archives/diagrams/` for documentation
- `/excalidraw-diagram` — Create visual mockups; visualization documents architecture

---

## Output Paths

**System diagrams** → `archives/diagrams/` (primary) / `references/diagrams/` (legacy)
**Project/planning diagrams** → `archives/plans/`
**Client architecture/ERDs** → `archives/client-work/[client]/`

## Execution Method

1. **Parse the request**
   - The request is: $ARGUMENTS
   - Identify the diagram type (flowchart, stateDiagram, graph, entityRelationship, sequenceDiagram, classDiagram, etc.)
   - Extract source material (code, schema, description, file path)
   - Determine output path (references/diagrams, archives/plans, or archives/client-work)

2. **Fetch context via Context7** (if needed)
   - Before complex diagram generation, resolve relevant documentation:
   - Identify diagram domain (e.g., "React architecture", "database schema", "API design")
   - Call `mcp__plugin_context7_context7__resolve-library-id [domain-library-name]` to identify relevant docs
   - Call `mcp__plugin_context7_context7__get-library-docs [library-id]` to fetch current conventions
   - Inject resolved context into agent to ensure diagrams align with current best practices
   - Fallback: If library resolution fails, proceed with agent using standard diagram patterns
   - **Why:** Ensures diagrams reflect current architecture patterns, not outdated conventions

3. **Extract structure** (ultrathink)
   - For small diagrams (<10 nodes): Extract nodes and edges directly
   - For complex diagrams (≥10 nodes): Delegate to agent with extended thinking
     - Call `.claude/agents/visualization/AGENT.md` with:
       - `source`: Technical source material (code, schema, docs, system description)
       - `diagram_type`: Target Mermaid diagram type
       - `complexity_level`: Simple, medium, or complex
       - `context`: Context7 library docs if resolved
     - Agent extracts nodes, edges, relationships, labels using extended reasoning
     - Extended thinking helps identify implicit relationships and dependencies
     - Skill assembles into Mermaid syntax

   **Why (ultrathink) for complex diagrams:**
   - Helps identify hidden relationships in intricate systems
   - Improves accuracy when diagrams have >15 nodes or multiple connection types
   - Essential for architecture maps and dependency graphs
   - Ensures structural integrity of complex visualizations

4. **Validate diagram structure** (ultrathink)
   - Check for closed brackets
   - Verify node IDs are unique
   - Ensure edge references are valid
   - Validate diagram type syntax

5. **Generate Mermaid code block**
   - Create `.md` file with:
     ```
     # [Diagram Title]

     [Description/context]

     \`\`\`mermaid
     [diagram syntax]
     \`\`\`
     ```
   - Format: Standard Mermaid 10.x syntax
   - Include descriptive title and context
   - Add legend if needed (>5 node types)

6. **Save to archive**
   - Write to: `archives/diagrams/YYYY-MM-DD-[type]-[subject].md` (primary)
   - Or: `references/diagrams/YYYY-MM-DD-[type]-[subject].md` (legacy)
   - Or: `archives/plans/[phase]/diagrams/`
   - Or: `archives/client-work/[client]/diagrams/`

7. **Return the output**
   - Show generated Mermaid preview (text)
   - Show file path
   - Include rendering notes

---

## Diagram Types Supported

| Type | Use Case | Example |
|------|----------|---------|
| `flowchart` | Workflows, business processes, decision trees | Launch a new service, content pipeline |
| `stateDiagram-v2` | State machines, lifecycle, phase transitions | Phase Tracker lifecycle, order status |
| `graph` | Dependency graphs, system architecture, relationships | Skill dependencies, system components |
| `erDiagram` | Entity relationships, data models, databases | Client data model, schema design |
| `sequenceDiagram` | Interactions, message flows, communication | API request/response, skill composition |
| `classDiagram` | Object models, inheritance, class structure | Code architecture, type hierarchy |
| `gantt` | Project timelines, task schedules, milestones | Project timeline, release schedule |

---

## Brand Colors (Mermaid)

Apply via `%%{init}%%` or `classDef` for brand-consistent diagrams:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#c2fff1", "primaryBorderColor": "#006e56", "secondaryColor": "#e0faf6", "tertiaryColor": "#fef3c7"}}}%%
```

Class definitions:
```
classDef cyan fill:#c2fff1,stroke:#006e56,color:#1e1e1e
classDef teal fill:#e0faf6,stroke:#00b2a9,color:#1e1e1e
classDef deep fill:#b3f5e6,stroke:#004a3a,color:#1e1e1e
classDef amber fill:#fef3c7,stroke:#d97706,color:#1e1e1e
classDef slate fill:#f1f5f9,stroke:#334155,color:#1e1e1e
classDef pylon fill:#e2e8f0,stroke:#64748b,color:#1e1e1e
```

---

## Input/Output Specifications

**Input:**
- Diagram type (or auto-detect from description)
- Source material (code, documentation, description)
- Optional: output path override
- Optional: styling preferences (colors, shapes)

**Output:**
- `.md` file with Mermaid code block
- Rendering-ready (can be viewed in GitHub, VS Code preview, online tools)
- Archive path documented
- Integration notes (what this diagram depends on, what depends on it)

---

## Integration Points

### Sources
- **System documentation** → Code architecture diagrams
- **Database schemas** → ERD diagrams
- **Planning Skill** → Workflow/timeline diagrams
- **Phase Tracker** → State machine diagrams
- **SKILL-DEPENDENCY-DIAGRAM.md** → Dependency graphs
- **Project specs** → Component diagrams

### Consumers
- **ONBOARDING.md** → Embedded workflow diagrams
- **Project documentation** → Architecture references
- **Client deliverables** → Architecture ERDs
- **README files** → System overview diagrams

---

## Notes

**Directory Creation:** `archives/diagrams/` does not exist by default. The skill must create it on first use. Ensure write permissions and document in integration notes. Legacy path `references/diagrams/` is secondary.

**Mermaid Syntax:** This skill generates Mermaid 10.x syntax. Validate with official Mermaid documentation if syntax changes.

**Complex Diagrams:** For diagrams with 15+ nodes, use the agent delegation path to avoid token bloat and improve accuracy of structure extraction.

**Styling:** Mermaid diagrams support CSS styling. Apply consistent color schemes via themes (dark, light, neutral).

---

## Example Invocations

### Simple Flowchart
```
/visualization "Create a flowchart for the content creation workflow: Research → Planning → Creation → Brand Voice → Social Media → Archive"
```

### State Machine
```
/visualization "Generate a Mermaid state machine for the Phase Tracker lifecycle. Source: .claude/skills/phase-tracker/SPECIFICATIONS.md"
```

### Dependency Graph
```
/visualization "Create a Mermaid graph showing all 14 skills and their dependencies. Source: references/SKILL-DEPENDENCY-DIAGRAM.md"
```

### ERD from Schema
```
/visualization "Generate an ERD for the following database schema: [paste schema here]. Client: Nexgen Electrical. Output: archives/client-work/nexgen-electrical/erd.md"
```

---

## Error Handling

| Scenario | Recovery |
|----------|----------|
| **Mermaid syntax error** | Validate generated syntax before saving. If invalid (unclosed brackets, undefined node references), regenerate with corrections. Show user: "Fixed syntax error on line X" |
| **Agent returns incomplete structure** | For complex diagrams, if agent misses relationships, alert user: "Generated structure seems sparse. Did I miss edges?" and ask for clarification |
| **Diagram type mismatch** | If request keywords conflict ("flowchart" + "relationships"), ask for clarification: "Should I create a flowchart or ERD?" |
| **Very large diagram (30+ nodes)** | Recommend splitting: "Consider 2 focused diagrams instead of 1 cluttered diagram" |
| **File write permission error** | If output path is read-only, suggest alternative: "Cannot write to references/diagrams/. Try archives/plans/ instead?" |
| **Empty or vague request** | Detect empty arguments and ask: "Please describe what to diagram (e.g., 'system architecture', 'user flow')" |
| **Directory doesn't exist** | Create output directory automatically: `mkdir -p archives/diagrams/` before writing |
| **Node reference error** | If edge references undefined node, alert user and fix: "Node 'order_item' referenced but not defined. Removing edge." |

---
