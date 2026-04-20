---
title: Library Agent Registry
description: Central registry of all animation/scroll library sub-agents with discovery patterns and Docker integration
category: reference
status: active
last-updated: 2026-04-20
---

# Library Agent Registry

**Central registry of specialized library agents** that orchestrate library-specific work in the animation and scroll domains.

Each agent is registered as an `infrastructure` entity in Docker, enabling discovery, reuse, and contextual learning accumulation.

---

## Agent Directory

### 1. Framer Motion Agent

**File:** `.claude/agents/framer-motion/AGENT.md`

**Entity Details:**
- Type: `infrastructure` (library agent)
- Entity Name: `agent-framer-motion`
- Category: Animation Library (React component animations)
- SLA: 180 seconds

**Capabilities:**

| Subtask | Purpose | Use When |
|---------|---------|----------|
| Implement | Build smooth entrance/exit, state, gesture animations | Adding new animation to a component |
| Create Variants | Define reusable animation pattern library | Multiple components need same animation style |
| Gesture Interactions | Implement hover, tap, drag animations | Building interactive animations |
| Staggered Animations | Coordinate list/grid animations | Animating multiple items with delay |
| Validate | Verify 60fps smooth, accessibility, no console warnings | QA phase before shipping |

**Discovery Triggers:**

- `"framer motion"`
- `"animation library"`
- `"motion component"`
- `"gesture interaction"`
- `"spring physics"`
- `"variant animation"`

**Contributes to Docker:**

- `learn-framer-motion-{pattern}` — Animation patterns discovered
- `learn-gesture-{interaction-type}` — Gesture behavior insights
- Observations: component_name, animation_type, 60fps status, accessibility notes

**Prior Learnings (Example):**

```
learn-framer-motion-spring-physics
- Best stiffness values for different animation types
- Damping settings for natural feel

learn-gesture-whilehover-tap-conflicts
- How to handle simultaneous hover + tap on mobile
- Touch device specific gotchas

learn-framer-motion-scroll-viewport-once
- viewport={{ once: true }} prevents re-trigger on scroll
- Critical for performance in long pages
```

**Next Steps:**
- Search `"learn-framer-motion-*"` before each dispatch
- Load prior patterns to inform implementation
- Create new learning entities as patterns emerge

---

### 2. GSAP ScrollTrigger Agent

**File:** `.claude/agents/gsap-scrolltrigger/AGENT.md`

**Entity Details:**
- Type: `infrastructure` (library agent)
- Entity Name: `agent-gsap-scrolltrigger`
- Category: Scroll Animation Library (diagnosis & optimization)
- SLA: 180 seconds

**Capabilities:**

| Subtask | Purpose | Use When |
|---------|---------|----------|
| Diagnose | Find root cause of flicker, layout shift, performance jank | Animation has visual problem |
| Fix | Apply ScrollTrigger patterns to stop flickering | Animation is broken or janky |
| Implement | Create entrance/reveal animation with zero flicker | Building new scroll animation from scratch |
| Optimize | Batch animations, add GPU acceleration, cleanup | Performance needs improvement |
| Validate | Verify 60fps smooth, no jank, correct alignment | QA phase before shipping |

**Discovery Triggers:**

- `"scroll animation"`
- `"scrolltrigger fix"`
- `"flicker"`
- `"layout shift"`
- `"scroll performance"`
- `"jank on scroll"`

**Contributes to Docker:**

- `learn-scrolltrigger-{pattern}` — Fix patterns (transform-only, cleanup, once:true)
- `learn-scroll-{issue-type}` — Root causes (flicker, layout shift, jank)
- Observations: component_name, issue_type, root_cause, fps_before/after

**Prior Learnings (Example):**

```
learn-scrolltrigger-transform-only-rule
- Animating position/width causes layout shift
- Solution: Use transform: translateZ(0) instead
- Confidence: HIGH

learn-scrolltrigger-cleanup-critical
- Memory leaks occur when useEffect cleanup missing
- Solution: Return cleanup function with killAll()
- Confidence: HIGH

learn-scrolltrigger-will-change-css
- Missing will-change CSS causes jank
- Add: will-change: transform, contain: layout paint
- Confidence: HIGH
```

**Performance Metrics Tracked:**

```
Before Fix → After Fix
45fps → 60fps (33% improvement)
Flicker: YES → NO
Layout shift: 15px → 0px
```

**Next Steps:**
- Search `"learn-scrolltrigger-*"` before diagnosing
- Load prior fixes to check if issue is known
- Create new learning entity for novel root causes

---

### 3. AOS Scroll Reveal Agent

**File:** `.claude/agents/aos-scroll-reveal/AGENT.md`

**Entity Details:**
- Type: `infrastructure` (library agent)
- Entity Name: `agent-aos-scroll-reveal`
- Category: Scroll Animation Library (bulk/low-config)
- SLA: 150 seconds

**Capabilities:**

| Subtask | Purpose | Use When |
|---------|---------|----------|
| Implement | Add AOS animations (fade, slide, zoom) to elements | Bulk-adding entrance effects |
| Setup | Initialize AOS in layout with configuration | Project-wide setup |
| Stagger | Coordinate sequential animations on lists/grids | Multiple items with delay pattern |
| Optimize | Tune offset, duration, easing for performance | Performance issues on slow devices |
| Validate | Test smoothness, flicker, accessibility | QA phase before shipping |

**Discovery Triggers:**

- `"AOS"`
- `"scroll reveal"`
- `"bulk animation"`
- `"entrance effect"`
- `"simple animation"`
- `"data-aos"`

**Contributes to Docker:**

- `learn-aos-config-{component-type}` — Optimal configurations discovered
- `learn-aos-performance-{device-type}` — Performance notes for devices
- Observations: num_elements, stagger_delay, fps, mobile_disabled_flag

**Prior Learnings (Example):**

```
learn-aos-config-hero-sections
- Duration: 600ms, Offset: 100px, Easing: ease-out-cubic
- Stagger: 50ms, Disable mobile: false
- Works well on fast devices

learn-aos-config-list-items
- Duration: 400ms, Offset: 50px, Stagger: 75ms per item
- Adjust stagger based on list density

learn-aos-performance-mobile-optimization
- Slow phones need: disable: 'phone' or reduce to 300ms
- Monitor Frame rate on iPhone SE / Android budget phones
```

**Configuration Patterns:**

```json
{
  "component_type": "hero-sections",
  "optimal_config": {
    "duration": 600,
    "easing": "ease-out-cubic",
    "offset": 100,
    "once": true,
    "mirror": false
  },
  "tested_on": ["Desktop", "iPad", "iPhone 12"],
  "avg_fps": 59.8,
  "disable_mobile": false
}
```

**Next Steps:**
- Search `"learn-aos-config-*"` for component type before config
- Check `"learn-aos-performance-*"` for device-specific notes
- Create new config learning as new component types are animated

---

## Discovery & Dispatch Workflow

### When Orchestrator Needs Animation Work

```
┌─────────────────────────────────────────────────────────────┐
│ User Request: "Build animation for hero section"            │
├─────────────────────────────────────────────────────────────┤
│ STEP 1: Categorize animation need                           │
│  - Component animations? → Framer Motion agent              │
│  - Scroll entrance effects? → AOS agent                     │
│  - Scroll animation broken? → ScrollTrigger agent           │
├─────────────────────────────────────────────────────────────┤
│ STEP 2: Search Docker for agent                            │
│  mcp__MCP_DOCKER__search_nodes("agent-framer-motion")      │
│  → Returns: entity_id, capabilities, SLA                    │
├─────────────────────────────────────────────────────────────┤
│ STEP 3: Load agent configuration                            │
│  mcp__MCP_DOCKER__open_nodes([entity_id])                  │
│  → Returns: Full agent metadata + execution history         │
├─────────────────────────────────────────────────────────────┤
│ STEP 4: Search for prior learnings                          │
│  mcp__MCP_DOCKER__search_nodes("learn-framer-motion-*")    │
│  → Returns: Prior patterns, gotchas, best practices         │
├─────────────────────────────────────────────────────────────┤
│ STEP 5: Dispatch agent with context                         │
│  Include spec + prior learnings in prompt                   │
│  Agent works with full library domain knowledge             │
├─────────────────────────────────────────────────────────────┤
│ STEP 6: Create learning entity at session end               │
│  mcp__MCP_DOCKER__create_entities([learn-{pattern}])        │
│  Enable future discovery via search_nodes()                 │
└─────────────────────────────────────────────────────────────┘
```

### Example: Dispatching Framer Motion Agent

**Orchestrator action:**

```bash
# Step 1: Search for agent
mcp__MCP_DOCKER__search_nodes("agent-framer-motion")
# Returns: entity_id = "abc123"

# Step 2: Load agent config
mcp__MCP_DOCKER__open_nodes(["abc123"])
# Returns: capabilities, SLA (180s), subtasks available

# Step 3: Search for learnings
mcp__MCP_DOCKER__search_nodes("learn-framer-motion-scroll-viewport")
# Returns: learn-framer-motion-scroll-viewport-once (prior discovery)

# Step 4: Build dispatch prompt with injected learnings
prompt = """
Dispatch Framer Motion Agent

Subtask: Implement
Target: HeroSection component (new entrance animation)

Context:
- Prior learning: viewport={{ once: true }} prevents re-trigger
- Use this pattern in your implementation
- Document if you discover new variations

Agent config:
- SLA: 180 seconds
- Return format: structured
"""

# Step 5: Call agent (orchestrator coordinates)
# Agent returns: component code + new learning discovered

# Step 6: At session end, persist learning
mcp__MCP_DOCKER__create_entities([{
  "type": "learning",
  "name": "learn-framer-motion-gesture-stagger-conflict",
  "properties": {
    "title": "Gesture animations conflict with staggered children",
    "discovery_context": "HeroSection implementation",
    ...
  }
}])
```

---

## Registry Fields Reference

Every agent in the registry includes:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **name** | string | Agent identifier | `framer-motion`, `gsap-scrolltrigger` |
| **entity_name** | string | Docker entity name | `agent-framer-motion` |
| **category** | string | Functional area | `Animation Library`, `Scroll Animation` |
| **file** | path | Agent definition file | `.claude/agents/framer-motion/AGENT.md` |
| **mode** | string | Agent mode (analyze/execute/synthesize) | `execute` |
| **sla_seconds** | number | Target execution time | `180`, `150` |
| **trigger_keywords** | array | Search terms that dispatch this agent | `["gesture", "animation"]` |
| **capabilities** | array | Available subtasks | `[implement, create-variants, gesture]` |
| **contributes_entities** | array | Entity types created after execution | `[learning, decision]` |
| **discovery_pattern** | string | How to find this agent in Docker | `search_nodes("agent-{name}")` |

---

## Future Expansion

### Adding a New Library Agent

When adding a new library (e.g., `Three.js`, `Pixi.js`, `Motion Canvas`):

1. **Create agent definition:** Create `AGENT.md` in `.claude/agents/[library-name]/`
   - Include full Docker Integration section (with entity type, discovery triggers, SLA)
   - Document all capabilities and supported subtasks
   - Follow existing library agent patterns (see Framer Motion, GSAP agents above)

2. **Register in Docker:** Create entity at session end with template pattern:
   ```bash
   mcp__MCP_DOCKER__create_entities([{
     "type": "infrastructure",
     "name": "agent-[library-name]",
     "properties": { agent metadata }
   }])
   ```

3. **Add to this registry:** Document in LIBRARY_AGENT_REGISTRY.md
   - Include capabilities table
   - List discovery triggers
   - Describe learnings structure

4. **Link to INTEGRATION_MATRIX.md:** Update discovery flow

5. **Enable search:** Future dispatches find agent via template:
   ```bash
   mcp__MCP_DOCKER__search_nodes("agent-[library]")
   ```

### Template for New Library Agent

```markdown
# {Library Name} Agent

**Entity Name:** `agent-{library-kebab}`  
**Category:** {Domain} Library  
**SLA:** {seconds}  

## Capabilities

| Subtask | Purpose | Use When |
|---------|---------|----------|
| ... | ... | ... |

## Discovery Triggers

- "keyword"
- "another keyword"

## Contributes to Docker

- `learn-{library}-{pattern}`
- Observations: field1, field2, field3

## Prior Learnings (Template)

```
learn-{library}-{pattern-name}
- Issue: [what problem]
- Solution: [how to fix]
- Confidence: [HIGH/MEDIUM/LOW]
```
```

---

## Summary

**3 Library Agents Registered:**

| Agent | Entity Name | Category | SLA | Learnings |
|-------|-----------|----------|-----|-----------|
| Framer Motion | `agent-framer-motion` | Component Animation | 180s | spring physics, gestures, scroll viewport |
| GSAP ScrollTrigger | `agent-gsap-scrolltrigger` | Scroll Animation Fix | 180s | transform-only, cleanup, will-change |
| AOS Scroll Reveal | `agent-aos-scroll-reveal` | Bulk Animation | 150s | config per component type, mobile perf |

**Discovery Method:**
```bash
mcp__MCP_DOCKER__search_nodes("agent-{library-name}")
```

**Learnings Accumulation:**
- Search: `learn-{library}-*`
- Load: `open_nodes([entity_ids])`
- Inject into dispatch prompt
- Create new learnings after each execution

**Next Session:** Orchestrator finds all 3 agents automatically via search_nodes(), loads prior learnings, and dispatches with full context.

---

**Last Updated:** 2026-04-20  
**Status:** Active — 3 agents registered, discoverable, learnings-enabled  
**Related:** INTEGRATION_MATRIX.md (workflow patterns), memory-policy.md (entity schema)
