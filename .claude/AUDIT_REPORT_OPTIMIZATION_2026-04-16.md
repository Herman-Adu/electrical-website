---
title: Skills & Agents Optimization Audit
date: 2026-04-16
status: recommendations
---

# Comprehensive Optimization Audit: Skills, Agents & CLAUDE.md

## Executive Summary

Your orchestrator system is well-structured but has optimization opportunities:
- **CLAUDE.md:** 316 lines, 25% can be condensed or moved to reference
- **Skills:** 5 skills × ~280 avg lines each = 1,400 lines total
- **Issue:** Duplication between SKILL.md (instructions) and README.md (docs)
- **Opportunity:** Consolidate by making SKILL.md lean and moving content to README.md
- **Docker bloat:** mcp-automation SKILL.md contains domain-specific infrastructure logic that should be separated

---

## 1. CLAUDE.md Analysis (.claude/CLAUDE.md)

### Current State
- **Lines:** 316
- **Last updated:** 2026-04-15
- **Audience:** Orchestrator + all agents

### Optimization Recommendations

| Section | Lines | Status | Action |
|---------|-------|--------|--------|
| Core Principles | 5 | ✅ Keep | Concise, essential |
| Required Delegation Sequence | 40 | ✅ Keep | Core contract, referenced frequently |
| Execution Lifecycle | 45 | ⚠️ Trim | Flowchart is large; text is repetitive. Move detailed narrative to reference. |
| When to Use Delegation | 12 | ✅ Keep | Helpful decision table |
| Canonical Locations | 45 | ⚠️ Trim | Directory tree is wide; text explains each. Compress paths, move to reference. |
| Integration Matrix | 25 | ⚠️ Trim | Flowchart is ASCII art and large. Replace with compact table. |
| Execution Timing & Resource Expectations | 14 | 🗑️ Move | Move entire table to `.claude/reference/EXECUTION_TIMING.md` |
| Error Recovery & Blockers | 10 | 🗑️ Move | Move to `.claude/reference/ERROR_RECOVERY.md` |
| Memory System | 12 | ✅ Keep | Brief, essential |
| Example: Complete Orchestrator Flow | 35 | ✅ Optional | Useful but could be moved to WORKED_EXAMPLES file |
| Notes & Future Enhancements | 7 | 🗑️ Delete | All items are already completed or superseded. Clean up. |

### Recommended Changes

**Before (316 lines):**
```
Core Principles (5) + Delegation (40) + Lifecycle (45) + Locations (45) + Matrix (25) 
+ Timing (14) + Recovery (10) + Memory (12) + Example (35) + Notes (7) = 238 essential
```

**After (estimated ~210 lines):**
- Keep: Core contract sections (140 lines)
- Compress: Directory tree + integration matrix (40 lines)
- Move to reference docs: Timing, recovery, examples, worked examples (organize in `.claude/reference/`)

**Files to create:**
1. `.claude/reference/EXECUTION_TIMING.md` — Timing table + resource expectations
2. `.claude/reference/ERROR_RECOVERY.md` — Error handling strategies
3. WORKED_EXAMPLES file — Multi-step orchestration scenarios

**Action:** Remove "Notes & Future Enhancements" section (all completed).

---

## 2. Skills Analysis

### Overview

| Skill | SKILL.md | README.md | Total | Issue |
|-------|----------|-----------|-------|-------|
| planning | 354 lines | ~200 lines | 550+ | Context Files Setup (100 lines) is docs, not instruction |
| code-generation | 278 lines | ~150 lines | 428+ | Duplicate workflow descriptions in both files |
| knowledge-memory | 165 lines | ~150 lines | 315+ | Clear separation; minimal duplication |
| mcp-automation | 207 lines | ~180 lines | 387+ | Docker infrastructure logic dominates SKILL.md; 50+ lines of Docker cruft |
| skill-builder | 34 lines | ~200 lines | 234+ | SKILL.md is minimal (good); README has all content |
| **TOTAL** | **1,038** | **~880** | **~1,918** | **Significant duplication** |

### Skill-by-Skill Analysis

#### planning/SKILL.md (354 lines)

**Problem:** "Context Files Setup" section (lines 30–130) is documentation, not execution instructions.

**Current structure:**
1. Frontmatter ✅
2. Live Context injection ✅
3. **Context Files Setup** 🗑️ (100 lines of setup docs)
4. Execution Method ✅

**Recommendation:**
- Move "Context Files Setup" entirely to `planning/README.md`
- Keep SKILL.md to ~200 lines (frontmatter + execution method)
- Result: SKILL.md becomes concise instruction, README becomes documentation hub

**Optimization savings:** ~100 lines saved in SKILL.md

---

#### code-generation/SKILL.md (278 lines)

**Problem:** "Super Powers Workflow" and "Standard Workflow" sections are duplicated/repeated. Both SKILL.md and README have similar workflow descriptions.

**Current structure:**
1. Frontmatter ✅
2. Project Stack injection ✅
3. **Super Powers Workflow** (65 lines) — detailed explanation
4. **Standard Workflow** (50 lines) — detailed explanation
5. **When to Use Each Workflow** (20 lines) — decision table
6. Output Format ✅
7. Best Practices ✅

**Recommendation:**
- Move workflow **details** to `code-generation/README.md`
- SKILL.md should contain only:
  - Frontmatter
  - 2-3 sentence overview of Super Powers + Standard workflows
  - Execution Method (high-level steps, not full details)
  - Output Format & Best Practices (concise)
- Keep decision table (useful in SKILL.md for quick reference)

**Optimization savings:** ~80 lines from SKILL.md

---

#### mcp-automation/SKILL.md (207 lines)

**Problem:** Docker infrastructure logic (lines 28–115) is domain-specific and unrelated to general MCP automation. This was likely imported from a Docker-heavy project and doesn't fit the electrical-website scope.

**Current structure:**
1. Frontmatter ✅
2. **Docker Infrastructure Validation** 🗑️ (90 lines of Docker-specific logic)
3. Context7 injection ✅
4. Parse request ✅
5. Execution method ✅

**Recommendation:**
- **Delete entire Docker Infrastructure Validation section.** It includes:
  - `docker-compose ps` checks
  - RestartCount monitoring
  - Tier-1 vs Tier-2 service logic
  - Container startup logic
  - Idle cleanup logic
  - This is NOT relevant to MCP automation in a Next.js project.

- Replace with simple, generic: "Check required tools are available (GitHub, Playwright, Context7, etc.)"

- If Docker orchestration becomes relevant later, create a separate DOCKER_WORKFLOWS file and reference it.

**Optimization savings:** ~85 lines removed; SKILL.md becomes ~120 lines

---

#### knowledge-memory/SKILL.md (165 lines)

**Assessment:** ✅ Well-organized. SKILL.md is concise instruction + routing table. README provides templates. Minimal duplication.

**Status:** No changes needed. This is a good model for the others.

---

#### skill-builder/SKILL.md (34 lines)

**Assessment:** ✅ Excellent example of lean SKILL.md. All the substance is in README.md.

**Status:** No changes needed. Reference this as a model.

---

### Skills Consolidation Strategy

**Phase 1: Separate Instruction from Documentation**

| Skill | Current | Target SKILL.md | Target README.md | Action |
|-------|---------|-----------------|------------------|--------|
| planning | 554 lines | ~200 (remove docs) | ~400 (add Context Files Setup) | Move Context Files Setup to README |
| code-generation | 428 lines | ~150 (remove details) | ~350 (add workflow details) | Move workflow details to README |
| knowledge-memory | 315 lines | 165 ✅ | 150 ✅ | No action needed |
| mcp-automation | 387 lines | ~120 (delete Docker) | ~280 (keep as-is) | Delete Docker section entirely |
| skill-builder | 234 lines | 34 ✅ | 200 ✅ | No action needed |

**Result:** SKILL.md files become instruction-focused (~690 lines total), README files become documentation-focused (~1,380 lines total). Clear separation of concerns.

---

## 3. Agents Analysis

### Overview

| Agent | AGENT.md | README.md | Total | Assessment |
|-------|----------|-----------|-------|------------|
| planning | ~70 lines | ~150 lines | 220 | ✅ Good separation |
| code-generation | ~100 lines | ~200 lines | 300 | ✅ Good separation |
| knowledge-memory | ~80 lines | ~120 lines | 200 | ✅ Concise, clear |
| mcp-automation | ~80 lines | ~180 lines | 260 | ✅ Good separation |
| skill-builder | ~60 lines | ~100 lines | 160 | ✅ Lean, focused |

**Assessment:** ✅ All agents are well-structured. No major changes needed.

---

## 4. Overall File Count & Organization

### Current File Structure

```
.claude/
├── CLAUDE.md (316 lines) ⚠️ Can trim to ~210
│
├── rules/ (3 files complete, 2 TODO)
│   ├── naming-conventions.md ✅
│   ├── frontmatter-schema.md ✅
│   ├── README.md ✅
│   ├── delegation-gates.md (TODO)
│   └── security-constraints.md (TODO)
│
├── security/ (1 file complete, 2 TODO)
│   ├── SECRETS_POLICY.md ✅
│   ├── OWASP_CHECKLIST.md (TODO)
│   └── AUTH_PATTERNS.md (TODO)
│
├── reference/ (no files, should have 3+)
│   ├── SKILLS.md (skill registry — does this exist?)
│   ├── EXECUTION_TIMING.md (MISSING — move from CLAUDE.md)
│   ├── ERROR_RECOVERY.md (MISSING — move from CLAUDE.md)
│   ├── WORKED_EXAMPLES.md (MISSING — expand Example section)
│   └── (playbook/, examples/, diagrams/ mentioned but empty)
│
├── agents/ (5 agents, all complete)
│   ├── planning/
│   ├── code-generation/
│   ├── knowledge-memory/
│   ├── mcp-automation/
│   └── skill-builder/
│
├── skills/ (5 skills, all complete but need consolidation)
│   ├── planning/
│   ├── code-generation/
│   ├── knowledge-memory/
│   ├── mcp-automation/
│   └── skill-builder/
│
├── tests/ (empty, TODO)
├── memory/ (presumed exists, auto-hydrated)
└── ...
```

### Cleanup Needed

1. **CLAUDE.md:** Remove "Notes & Future Enhancements" section
2. **reference/:** Create 3 new files from CLAUDE.md content
3. **skills/:** Consolidate SKILL.md/README.md content (separate instruction from docs)
4. **mcp-automation/SKILL.md:** Delete Docker section entirely

---

## 5. Optimization Checklist

### Phase 1: Immediate Cleanup (30 min)
- [ ] **CLAUDE.md:** Delete "Notes & Future Enhancements" section (7 lines removed)
- [ ] **mcp-automation/SKILL.md:** Delete "Docker Infrastructure Validation" section (lines 28–115; 88 lines removed)
- [ ] **mcp-automation/SKILL.md:** Replace with 5-line generic tool-availability check

**Impact:** -95 lines, improve clarity, remove domain-specific cruft

### Phase 2: Move Content to Reference (30 min)
- [ ] Create `.claude/reference/EXECUTION_TIMING.md` with timing table + resource expectations from CLAUDE.md
- [ ] Create `.claude/reference/ERROR_RECOVERY.md` with error handling strategies from CLAUDE.md
- [ ] Create WORKED_EXAMPLES file with example orchestration flow + additional scenarios
- [ ] Update CLAUDE.md to reference these docs instead of including them

**Impact:** CLAUDE.md becomes ~100 lines shorter, reference docs become searchable

### Phase 3: Consolidate Skills (1 hour)
- [ ] **planning/SKILL.md:** Move "Context Files Setup" section to `planning/README.md` (~100 lines)
  - Keep execution method in SKILL.md
  - SKILL.md becomes concise (~200 lines)
  
- [ ] **code-generation/SKILL.md:** Move workflow details to `code-generation/README.md` (~80 lines)
  - SKILL.md keeps high-level overview + best practices
  - SKILL.md becomes concise (~150 lines)
  
- [ ] Verify **knowledge-memory/** and **skill-builder/** need no changes ✅

**Impact:** Skills become instruction-focused, documentation becomes organized in README files

### Phase 4: Update .claude/CLAUDE.md References (15 min)
- [ ] Update "Canonical Locations" to reference `.claude/reference/` for execution timing details
- [ ] Update "Integration Matrix" section to reference WORKED_EXAMPLES file
- [ ] Compress directory tree representation (remove verbose explanations)

**Impact:** CLAUDE.md becomes authoritative contract, not documentation dump

---

## 6. Token & Context Savings Estimate

### Before Optimization
- CLAUDE.md: 316 lines
- Skills: 1,038 lines (SKILL.md) + 880 lines (README.md) = 1,918 lines
- **Total:** ~2,234 lines in instruction files

### After Optimization
- CLAUDE.md: ~210 lines (-106 lines, -33%)
- Skills SKILL.md: ~690 lines (-348 lines, -34%)
- Reference docs: ~150 lines (new, moved content)
- **Total:** ~1,050 lines (-1,184 lines, -53% reduction in primary instruction files)

### Context Savings
- **Orchestrator context window:** Loading CLAUDE.md + all 5 SKILL.md files
  - Before: 316 + 1,038 = 1,354 lines (~4,000 tokens)
  - After: 210 + 690 = 900 lines (~2,700 tokens)
  - **Savings: ~1,300 tokens per session (~32% reduction)**

---

## 7. Quality Improvements

### Readability
✅ **Before:** Long, dense SKILL.md files mixed instruction + documentation  
✅ **After:** Lean SKILL.md (instruction), detailed README.md (documentation)  
**Benefit:** Users can quickly skim SKILL.md to understand execution, dive into README for details

### Maintainability
✅ **Before:** Multiple places to update when workflow changes (SKILL.md + README.md)  
✅ **After:** SKILL.md is source of truth for execution; README reflects execution  
**Benefit:** Single source of truth per skill

### Discoverability
✅ **Before:** Execution timing scattered throughout CLAUDE.md  
✅ **After:** Centralized in `.claude/reference/EXECUTION_TIMING.md`  
**Benefit:** Easy to find and reference specific timing / resource expectations

### Scope Clarity
✅ **Before:** mcp-automation SKILL.md mixed general MCP + Docker-specific logic  
✅ **After:** General MCP automation in SKILL.md; Docker patterns in reference (if needed)  
**Benefit:** Skill is universally applicable, not tied to one project's infrastructure

---

## 8. Recommendations (Prioritized)

### 🔴 CRITICAL (Do First)
1. **Delete Docker section from mcp-automation/SKILL.md** — This is domain-specific cruft that doesn't belong in a general-purpose skill. 88 lines removed, improves clarity.

2. **Move Context Files Setup from planning/SKILL.md to README.md** — It's documentation, not instruction. 100 lines moves, SKILL.md becomes lean.

### 🟠 HIGH (Do Next)
3. **Create `.claude/reference/EXECUTION_TIMING.md`** — Centralize resource expectations, timing estimates. Makes CLAUDE.md leaner.

4. **Create `.claude/reference/ERROR_RECOVERY.md`** — Centralize error handling strategies. Makes CLAUDE.md reference-able.

5. **Compress mcp-automation/SKILL.md** — Replace 88 lines of Docker logic with 5 lines of generic tool-check. Improves readability.

### 🟡 MEDIUM (Do After)
6. **Move workflow details from code-generation/SKILL.md to README.md** — 80 lines move, improves instruction clarity.

7. **Remove "Notes & Future Enhancements" from CLAUDE.md** — All items completed or superseded. Cleaner document.

8. **Compress directory trees & integration matrix in CLAUDE.md** — Use tables instead of wide ASCII art. More compact, same info.

### 🟢 LOW (Optional, Future)
9. **Create WORKED_EXAMPLES file** — Expand current example section, add 2–3 more scenarios. Helps new users understand orchestration.

10. **Populate `.claude/rules/delegation-gates.md` and `security-constraints.md`** — Currently TODO; these would support the orchestrator pattern.

---

## 9. Implementation Plan

### Session 1: Critical Cleanup (30 min)
```
1. Delete Docker section from mcp-automation/SKILL.md (line 28–115)
2. Replace with 5-line tool-check
3. Update mcp-automation README if Docker is mentioned there
4. Test: mcp-automation skill still works without Docker logic
```

### Session 2: Planning Skill Consolidation (30 min)
```
1. Move lines 30–130 (Context Files Setup) from planning/SKILL.md to planning/README.md
2. Condense SKILL.md execution method
3. Verify planning skill still works
4. Test: planning skill invocation still clear
```

### Session 3: Reference Documentation (30 min)
```
1. Create .claude/reference/EXECUTION_TIMING.md (from CLAUDE.md lines 220–235)
2. Create .claude/reference/ERROR_RECOVERY.md (from CLAUDE.md lines 239–249)
3. Update CLAUDE.md to link to these instead
4. Remove original sections from CLAUDE.md
```

### Session 4: Code-Gen Consolidation (30 min)
```
1. Move code-generation/SKILL.md workflow sections to README
2. Simplify SKILL.md execution method
3. Test: skill invocation still clear
```

### Session 5: Polish (15 min)
```
1. Remove "Notes & Future Enhancements" from CLAUDE.md
2. Compress directory tree representation
3. Final review & commit
```

---

## 10. Success Criteria

After optimization:
- ✅ CLAUDE.md < 250 lines (currently 316; target 50-line reduction)
- ✅ All SKILL.md files < 200 lines each (currently planning=354, code-gen=278)
- ✅ No Docker logic in mcp-automation/SKILL.md (currently 88 lines of cruft)
- ✅ Clear separation: SKILL.md = instruction, README.md = documentation
- ✅ Orchestrator context window reduced by 30%+ (1,300 token savings per session)
- ✅ All 5 skills remain functional and easy to invoke

---

**Report Generated:** 2026-04-16  
**Status:** Ready for implementation  
**Effort Estimate:** 2–2.5 hours total (5 sessions × 30 min)

