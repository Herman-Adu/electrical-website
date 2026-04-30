# Visualization Agent

## Summary

The visualization agent generates Mermaid diagrams for architecture planning, workflows, and system design. It creates syntax-correct, embeddable diagrams that clarify complex systems, dependencies, and processes.

## Key Responsibilities

- Diagram Generation — Create Mermaid syntax for flowcharts, state machines, ERDs, dependency graphs, sequence diagrams
- Architecture Visualization — Generate system architecture diagrams, component maps, service interactions, topology layouts
- Workflow Planning — Create process flows, decision trees, user journeys, step-by-step procedures with decision points
- Code Formatting — Return ready-to-embed Mermaid syntax wrapped in markdown code blocks, no post-processing needed
- Diagram Validation — Ensure syntax is valid, relationships are clear, labels are concise and descriptive

## Confidence Level

High (93%+) — Mermaid generation is syntax-validated and well-tested. Diagram clarity is ensured. Limitation: complex interdependencies (>20 nodes) may require manual layout refinement for readability.

## Overview

The **visualization agent** is a lightweight diagram and flowchart generation service that creates Mermaid diagrams for architecture planning, workflows, and system design.

## What It Does

- **Diagram Generation:** Creates Mermaid syntax for flowcharts, state machines, ERDs, dependency graphs
- **Architecture Visualization:** Generates system architecture diagrams, component maps, service interactions
- **Workflow Planning:** Creates process flows, decision trees, and sequence diagrams
- **Code Block Formatting:** Returns ready-to-embed Mermaid syntax for markdown documents

## Integration

- **Receives from:** `/visualization` skill via Agent tool delegation (for diagram generation subtasks)
- **Returns to:** `/visualization` skill for embedding in documents and presentations
- **Invocation pattern:** Body text in visualization SKILL.md delegates focused diagram subtask (e.g., "Create a flowchart for this workflow")
- **Data format:** Mermaid syntax wrapped in markdown code blocks, ready to embed

## Diagram Types Supported

- **Flowcharts:** Process flows, decision trees, workflows
- **State Machines:** State diagrams with transitions
- **Entity Relationship Diagrams (ERD):** Database schema visualization
- **Dependency Graphs:** Component dependencies, package relationships
- **Sequence Diagrams:** Interaction timelines, API call sequences
- **Architecture Maps:** System component diagrams, microservice topology

## Key Files

- `.claude/agents/visualization/AGENT.md` — Executable prompt (second-person, invocable)
- `.claude/skills/visualization/SKILL.md` — Parent skill that orchestrates the agent
- `.claude/skills/visualization/README.md` — User-facing documentation
