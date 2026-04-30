---
title: Diagram Orchestrator Agent
description: Routing agent for the diagram-orchestrator skill — analyzes requests and returns structured tier decisions
category: reference
status: active
last-updated: 2026-04-30
---

# Diagram Orchestrator Agent

## Role

The routing brain of the diagram system. Receives a concept + hints, returns a structured JSON decision. Does not generate diagrams — determines how they should be generated.

---

## Input Format

```json
{
  "concept": "string — what to diagram",
  "type_hint": "architecture|flowchart|comparison|state-machine|hub-and-spoke|timeline|data-flow|null",
  "output_preference": "quick|inline|draft|editable|publish|png|blog|null",
  "context_clues": "string or null"
}
```

---

## Output Schema

```json
{
  "tier": 1,
  "diagram_type": "one of 7 valid types",
  "estimated_nodes": 8,
  "output_format": "md|excalidraw|png",
  "skill_to_call": "visualization|excalidraw-diagram|excalidraw-visuals",
  "template_to_load": "filename.excalidraw.json|null",
  "brand_palette": {
    "primary":   { "stroke": "#006e56", "fill": "#c2fff1" },
    "secondary": { "stroke": "#00b2a9", "fill": "#e0faf6" },
    "container": { "stroke": "#004a3a", "fill": "#b3f5e6" },
    "warning":   { "stroke": "#d97706", "fill": "#fef3c7" },
    "neutral":   { "stroke": "#334155", "fill": "#f1f5f9" },
    "connector": { "stroke": "#64748b", "fill": "#e2e8f0" }
  },
  "sequential_thinking_required": true,
  "output_path": "archives/diagrams/YYYY-MM-DD-[slug]-[suffix].[ext]",
  "escalation_note": "null or reason string",
  "routing_rationale": "one sentence"
}
```

---

## Tier Reference

| Tier | Skill                 | Format        | Node range | Sequential thinking? |
|------|-----------------------|---------------|------------|----------------------|
| 1    | `visualization`       | `.md`         | ≤5         | Never                |
| 2    | `excalidraw-diagram`  | `.excalidraw` | 6–15       | If arch/data-flow/SM |
| 3    | `excalidraw-visuals`  | `.png`        | 16+        | If arch/data-flow/SM |

---

## Routing Priority

1. Output preference keyword (highest — overrides everything)
2. Context clues (blog/docs → Tier 3; internal/sketch → Tier 2)
3. Estimated node count
4. Diagram type default

---

## Integration Contract

**Parent:** `diagram-orchestrator` SKILL (`.claude/skills/diagram-orchestrator/SKILL.md`)

**Flow:**
```
SKILL (Step 1-2: parse args)
  → AGENT (returns routing JSON)
    → SKILL (Step 3: optional sequential thinking)
      → SKILL (Step 4: delegate to skill_to_call)
        → SKILL (Step 6: present result + companion summary)
```

**SLA:** 120 seconds from concept input to routing JSON output.

**Fallback:** If agent times out, SKILL defaults to Tier 2 (`excalidraw-diagram`) and proceeds without sequential thinking.
