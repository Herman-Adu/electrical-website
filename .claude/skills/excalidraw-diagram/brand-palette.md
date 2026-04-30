---
title: Brand Palette — Diagram System
description: Locked color palette for all diagram tiers (Mermaid, Excalidraw JSON, kie.ai PNG)
category: reference
status: active
last-updated: 2026-04-30
---

# Brand Palette — Diagram System

> Source of truth. All diagram skills and templates derive their colors from this file.
> Do not edit without updating all 3 skills + 7 templates + style-guide.md.

## Primary Palette

| Role   | Stroke / Fill (dark) | Background Fill (light) | Semantic use |
|--------|---------------------|------------------------|-------------|
| Cyan   | `#006e56`           | `#c2fff1`              | Primary nodes, key decisions, entry points |
| Teal   | `#00b2a9`           | `#e0faf6`              | Secondary nodes, flows, connections |
| Deep   | `#004a3a`           | `#b3f5e6`              | Headers, containers, section boundaries |
| Amber  | `#d97706`           | `#fef3c7`              | Warnings, highlights, callouts, decision diamonds |
| Slate  | `#334155`           | `#f1f5f9`              | Neutral nodes, annotations, supporting elements |
| Pylon  | `#64748b`           | `#e2e8f0`              | Tertiary elements, connector lines, arrows |

## Excalidraw Defaults

```json
{
  "roughness": 0,
  "fontFamily": 2,
  "strokeWidth": 2,
  "fontSize": 16,
  "strokeColor": "#1e1e1e",
  "fillStyle": "solid",
  "roundness": { "type": 3 }
}
```

| Setting | Value | Note |
|---------|-------|------|
| `roughness` | `0` | Professional / pixel-clean |
| `fontFamily` | `2` | Helvetica — brand standard |
| `strokeWidth` | `2` | Consistent weight |
| `fontSize` (node) | `16` | Primary labels |
| `fontSize` (sub-label) | `14` | Secondary labels |
| `fontSize` (annotation) | `12` | Small notes |
| `roundness` | `{"type": 3}` | Rounded rectangles |
| `fillStyle` | `"solid"` | No hatching |

## Mermaid Color Directives

Apply via `classDef` or inline `style` in Mermaid diagrams:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#c2fff1", "primaryBorderColor": "#006e56", "secondaryColor": "#e0faf6", "tertiaryColor": "#fef3c7"}}}%%
```

| Class name | fill | stroke |
|-----------|------|--------|
| `cyan` | `#c2fff1` | `#006e56` |
| `teal` | `#e0faf6` | `#00b2a9` |
| `deep` | `#b3f5e6` | `#004a3a` |
| `amber` | `#fef3c7` | `#d97706` |
| `slate` | `#f1f5f9` | `#334155` |
| `pylon` | `#e2e8f0` | `#64748b` |

```mermaid
classDef cyan fill:#c2fff1,stroke:#006e56,color:#1e1e1e
classDef teal fill:#e0faf6,stroke:#00b2a9,color:#1e1e1e
classDef deep fill:#b3f5e6,stroke:#004a3a,color:#1e1e1e
classDef amber fill:#fef3c7,stroke:#d97706,color:#1e1e1e
classDef slate fill:#f1f5f9,stroke:#334155,color:#1e1e1e
classDef pylon fill:#e2e8f0,stroke:#64748b,color:#1e1e1e
```

## kie.ai Style Prompt Suffix (Tier 3)

Append to every kie.ai prompt for brand consistency:

```
minimal professional diagram, electric teal (#00b2a9) and deep cyan (#006e56) color scheme, clean geometric shapes, white background, no gradients, no drop shadows, brand-consistent, Helvetica-style typography, dark charcoal (#1e1e1e) text
```

## Semantic Color Assignment Rules

| Diagram element | Recommended color |
|----------------|------------------|
| Entry / start point | Cyan |
| Process / transformation | Teal |
| Container / system boundary | Deep |
| Decision / warning / alert | Amber |
| Neutral / supporting | Slate |
| Connector / flow indicator | Pylon |
| Success / output | Teal |
| Error / failure path | Amber |
| External system | Slate |

## Text Contrast Rule

All text inside filled shapes: `#1e1e1e` (near-black).
Never use a zone's stroke color for text on that zone's background.
Arrow labels: `#334155` (Slate dark) on white.
