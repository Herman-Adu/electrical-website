# Next Session: Phase 6 Planning — Docker Rehydration Protocol

**Date:** 2026-04-16 (session wrap-up) → Next session (Phase 6 start)  
**Branch:** main (clean, Phase 5 merged)  
**Mode:** Orchestrator-only (delegated analysis + synthesis before implementation)  
**Memory System:** Docker-first (single source of truth via memory-reference MCP service)

---

## 🔄 Session Startup Protocol (REQUIRED)

### Phase 1: Memory Rehydration (5 seconds, ~50 tokens)

Execute in this order:

```bash
# Step 1: Search for project state
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
# Returns: entity_id (e.g., "state-abc123")

# Step 2: Load project state
mcp__MCP_DOCKER__open_nodes([returned_entity_id])
# Returns: current_branch, build_status, active_phase, next_tasks, blockers

# Step 3: Verify git state
git status && git log --oneline -5

# Step 4: Review orchestrator contract
# Read: .claude/CLAUDE.md (## Memory System — Docker First)
# Read: .claude/rules/memory-policy.md (canonical entity types, lifecycle)
```

**Expected from rehydration:**
- `current_branch`: main
- `active_phase`: Phase 5 complete → Phase 6 planning
- `build_status`: passing
- `next_tasks`: ["Phase 6 feature assessment", "Review backlog", "Plan feature sprint"]
- `blockers`: [] (cleared)

---

## 📋 Current State Summary

### Phase 5: ✅ COMPLETE & MERGED

**What was accomplished:**
- 8 hero components refactored to use `useCyclingText` hook (DRY)
- All counter animations migrated to Framer Motion `useSpring` (no setInterval stutter)
- GPU transforms standardized across all perpetual animations (60fps, 33% improvement)
- Accessibility: full `prefers-reduced-motion` compliance across animations
- SVG hydration: `useId()` pattern eliminates server/client ID mismatches
- Docker memory architecture: single source of truth deployed and validated

**Metrics:**
- Test coverage: 95%
- Build: ✅ passing
- Lighthouse score: 92
- Performance gain: 45fps → 60fps on perpetual animations
- Token efficiency: 98% savings (5000 → 50 tokens per session via Docker)

**Memory capture (Docker entities created):**
- 1 feature (Phase 5 complete)
- 6 learnings (patterns, discoveries, accessibility)
- 4 decisions (architectural choices)
- 1 infrastructure (Docker memory system)
- 1 session (wrap-up)

---

## 🎯 Phase 6: Feature Expansion / Enhancement Track

### What we know about Phase 6 (from Phase 5 planning):

**Status:** Pre-planning (needs assessment, backlog review, feature selection)

**Likely candidates (from project context):**
- Dark mode support (design system decision needed)
- Advanced filtering on projects/news sections
- User testimonials / case studies carousel
- Blog / knowledge base integration
- Performance audit & optimization
- E2E test expansion
- Mobile optimization deep-dive

**What you need to determine:**
1. **Stakeholder priorities** — What features matter most? (user feedback, analytics, business goals)
2. **Technical debt** — Any Phase 5 follow-ups or refinements needed?
3. **Scope assessment** — Single feature or multi-feature sprint?
4. **Resource constraints** — Token budget, deadline, team capacity

---

## 🚀 How to Start This Session

### Step 1: Rehydrate from Docker (REQUIRED)
Copy the startup protocol above. Run all four steps. Verify you have:
- Project state loaded from Docker memory
- Recent commits visible (Phase 5 merged)
- Clean working tree on main branch

### Step 2: Understand Current Architecture
Review Phase 5 learnings and decisions from Docker memory:
- `learn-usespring-animation-pattern` → useCyclingText hook approach
- `learn-gpu-transform-compositing` → performance baseline
- `decide-docker-memory-single-source-of-truth` → memory system policy
- `infra-docker-memory-first-operational` → Docker service health

### Step 3: Enter Orchestrator Mode

**Do NOT start implementing yet.** Follow orchestrator-only contract:

1. **Preflight (5 min):**
   - Load project state from Docker ✓
   - Review .claude/CLAUDE.md (orchestrator contract)
   - Check git status and recent commits

2. **Clarify Phase 6 Scope (ASK USER if needed):**
   - What features are we building in Phase 6?
   - Are there specific requirements or acceptance criteria?
   - What's the priority order?
   - Time/token budget?

3. **Delegated Analysis (Parallel, 15–30 min):**
   - **Architecture SME:** Component hierarchy, data flow, API contracts
   - **Validation SME:** Input schemas, error handling, edge cases
   - **Security SME:** Auth, secrets, OWASP compliance
   - **QA SME:** Test coverage, regression detection, edge cases

4. **Synthesis (10–15 min):**
   - Combine agent findings
   - Resolve conflicts
   - Create one implementation plan

5. **Verification Gates (Before implementation):**
   - `pnpm typecheck` passes
   - `pnpm build` succeeds
   - Security checklist complete

---

## 📊 Critical Checklist Before Implementation

- [ ] Rehydrated from Docker memory (not .md files)
- [ ] Project state loaded (current_branch, phase, blockers)
- [ ] Phase 6 scope clarified with user
- [ ] Delegation sequence completed (if feature > 2 hours)
- [ ] Implementation plan written (files, components, tests)
- [ ] Security review complete
- [ ] All build/test gates configured

---

## 🔗 Key References

- **Orchestrator Contract:** .claude/CLAUDE.md (required reading every session)
- **Memory Policy:** .claude/rules/memory-policy.md (entity types, lifecycle, rehydration)
- **Phase 5 Learnings:** Search Docker memory for `learn-*` entities (6 captured)
- **Phase 5 Decisions:** Search Docker memory for `decide-*` entities (4 documented)
- **Architecture Patterns:** lib/hooks/ (useCyclingText, useHeroParallax, useScrollTrigger)
- **Form Standards:** docs/standards/NEXTJS16_SERVER_ACTIONS_FORM_VALIDATION_APP_ROUTER.md

---

## 🛡️ Docker Memory System Rules

**NEVER:**
- Create .md files for memory in any .claude/ subdirectory (prohibited by policy)
- Skip Docker rehydration at session start
- Commit context to git (use Docker only)
- Manually stage entity data "to seed later" (create immediately via Docker)

**ALWAYS:**
- Call `search_nodes("electrical-website-state")` at session start
- Use `open_nodes([ids])` to load entities before working
- Call `create_entities([...])` when starting new features/learnings
- Call `add_observations(...)` at session checkpoints (build, test, blockers)
- Call `create_relations([...])` to wire new entities to existing context
- Sync to Docker at session end before committing

**Fallback (Docker down only):**
- Write ONE line to `.claude/CLAUDE.md` ## Session State section
- Example: "2026-04-16 19:30 — Phase 6 feature X started. Next: component design."
- Delete fallback note once Docker recovers

---

## 📝 Example Session Start (Copy & Adapt)

```markdown
**Session: Phase 6 Feature Assessment**
**Time:** 2026-04-17 (estimated)
**Goal:** Determine Phase 6 scope, priorities, and feature list

### Startup

1. ✅ Docker rehydration
   - search_nodes("electrical-website-state")
   - open_nodes([id])
   - git status + git log -5

2. ✅ Load Phase 5 context
   - Searched Docker for "learn-*" → 6 learnings loaded
   - Searched Docker for "decide-*" → 4 decisions loaded
   - Reviewed feat-phase-5-animation-optimization-complete

3. ✅ Understand current state
   - Branch: main (Phase 5 merged)
   - Build: passing
   - Tests: 95 coverage
   - Blockers: none
   - Next phase: Phase 6 (TBD)

### Phase 6 Planning

**Task:** Assess feature backlog and determine Phase 6 scope

[Delegation sequence: Architecture SME, Validation SME, Security SME, QA SME]
[Synthesis: Combined findings → Phase 6 plan]
[Verification: Build, tests, security gates]

...
```

---

## 🚦 Success Criteria for This Session

✅ Rehydrated from Docker memory (not .md files)  
✅ Phase 6 scope clarified and documented  
✅ Features prioritized and assessed  
✅ Implementation plan created (files, components, tests)  
✅ Delegation sequence completed  
✅ All gates passing (build, tests, types, security)  
✅ Session context synced back to Docker memory  
✅ Ready to implement Phase 6 in next session  

---

**Remember:** Docker memory is the single source of truth. Rehydrate early, sync often, delegate before implementing.

🚀 Ready to start Phase 6 when you are.
