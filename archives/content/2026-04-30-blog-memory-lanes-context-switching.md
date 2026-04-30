---
topic: memory-lanes-context-switching
audience: senior-dev
status: draft
date: 2026-04-30
wordCount: ~2000
publicationTarget: blog
series: ai-memory-architecture
---

# Memory Lanes: How We Gave Our AI Context-Switching Superpowers for Multi-Branch Development

If you've used an AI coding assistant for more than a week on a real project, you've hit this wall: you switch branches, start a new session, and the AI is back to being a stranger. It doesn't know what you were doing on that feature branch. It doesn't know why you made that architectural decision three weeks ago. It doesn't know that the `SectionValues` component uses CSS Grid `minmax()` and any change there has to stay within the established layout contract.

You re-explain. It catches up. You lose fifteen minutes — minimum.

Now multiply that by three active pull requests, two developers hot-switching between bug fixes and feature work, and a codebase that's been accumulating decisions for six months. The context tax isn't a nuisance anymore. It's a structural drag on how fast your team can move with AI.

We built Memory Lanes to solve this. Here's how it works, what we learned, and how you can replicate the pattern with any AI tool that supports session hooks.

---

## The Problem: Branch Switching Breaks AI Context

The fundamental issue is architectural. LLMs have no persistent state between sessions — every conversation starts from a blank slate. Your AI tool might support memory features, but those features are typically global: one memory pool for all your work, all your branches, all your contexts. When you're three weeks into a feature branch and switch to main to review a PR, then switch back, the AI has to be reconstructed from scratch.

Here's what that looks like in practice on a reasonably complex project:

- **Branch: `feat/phase-8-scrollreveal-production`** — 18 commits in, working on scroll-reveal animation compliance. The AI knows the `ScrollReveal` wrapper component API, the Framer Motion `whileInView` configuration, the viewport margin conventions, and which components still need animation passes.
- **git checkout main** — PR review needed. The AI's context is now about main branch state.
- **git checkout feat/phase-8-scrollreveal-production** — Back to feature work. AI context: zero. You're re-explaining the ScrollReveal wrapper from scratch.

Each context rebuild took us 20–30 minutes. With three active branches, that's up to 90 minutes of context overhead per developer per day. For a team of five, that's nearly a full engineer's productive hours — gone — every single day.

The solution wasn't to use a smarter AI. It was to give the AI a smarter memory structure.

---

## The Memory Lane Concept

A Memory Lane is a persistent context container scoped to a single git branch. Every branch gets its own lane. When you activate a branch, its lane activates automatically — loading the AI context for that specific branch, that specific set of decisions, that specific in-progress state. When you switch away, the lane pauses, preserving everything. When you come back, it resumes.

Think of it like application state management, but for AI session context.

Each lane progresses through a lifecycle:

```
PENDING → ACTIVE → PAUSED → COMPLETED → ARCHIVED → HARD_DELETED
```

- **PENDING**: Lane registered but not yet used
- **ACTIVE**: Current branch — full context loaded at session start
- **PAUSED**: Branch switched away — context preserved, not loaded
- **COMPLETED**: Branch merged or abandoned — lane enters wind-down
- **ARCHIVED**: Work done — lightweight reference only, not loaded at startup
- **HARD_DELETED**: Automated cleanup after archival period

The key insight is **tier-based rehydration**. At session start, we enforce a ≤3,000 token budget for all context injection. ACTIVE lanes get full detail. PAUSED lanes get a compact summary. ARCHIVED lanes are loaded only if explicitly requested. This keeps session startup fast regardless of how many lanes exist in the project.

---

## How Automation Works: No Manual Steps

The system is entirely hook-driven. There is no `memory-lane activate` command you run. There is no `memory-lane save` before you switch branches. The automation handles it.

**PostCheckout Hook** — fires on every `git checkout`:
1. Reads the current branch name
2. Finds the matching lane config in `config/memory-lanes/[branch-name].json`
3. If the lane exists: sets status to ACTIVE, updates `last_accessed_at`
4. Finds the previously active lane (from `config/active-memory-lanes.json`)
5. Sets the previous lane to PAUSED, writes `lastSyncedAt`
6. Updates `config/active-memory-lanes.json` with the new active lane

```json
// config/memory-lanes/feat-phase-8-scrollreveal-production.json
{
  "branch": "feat/phase-8-scrollreveal-production",
  "status": "ACTIVE",
  "opened_at": "2026-04-20T10:15:00.000Z",
  "last_accessed_at": "2026-04-30T09:24:27.501Z",
  "lastSyncedAt": "2026-04-30T09:20:42.950Z",
  "emergencySummary": "f70bb07 Phase 8 Final Push: Fix all 13 e2e tests + responsive breakpoints (#92) | 164e1ad fix: Phase 8 CLS resolution | Active: ScrollReveal animation compliance pass, About+Services pages complete"
}
```

**Stop Hook** — fires when the AI session ends:
1. Reads the current active lane
2. Writes a fresh `emergencySummary` — last N commit hashes plus a session summary string
3. Updates `lastSyncedAt`
4. Does NOT write to Docker memory directly — that's the AI's job before session end

**PostCommit Hook** — fires after `git commit`:
1. Appends the new commit hash and message to the active lane's `emergencySummary`
2. Keeps the lane's commit history current without manual maintenance

The hooks are registered in `.claude/settings.json` under the `hooks` key. Each hook is a shell command executed by the Claude Code harness — not by Claude itself. This matters: the hooks run even if Claude crashes, even if the session ends abnormally, even if the user closes the terminal mid-session.

---

## Tier-Based Rehydration and the Emergency Cascade

At session start, `scripts/memory-rehydrate.mjs` runs and assembles the context injection. The token budget is ≤3,000 tokens total. Here's how it allocates:

| Lane Status | Context Included | Approx Tokens |
|---|---|---|
| ACTIVE | Full lane detail + last 5 commits + Docker entity summary | ~1,800 |
| PAUSED (recent) | Summary + last 2 commits | ~400 per lane |
| PAUSED (stale >7 days) | One-line reference only | ~50 per lane |
| ARCHIVED | Not included (loaded on demand) | 0 |

When the Docker memory service is available, the AI gets rich structured context — Docker `search_nodes()` pulls the full project knowledge graph, `open_nodes()` loads specific entities. But what happens when Docker is down?

This is the **emergency cascade**:

1. **Try Docker first** — `search_nodes()` with 5-second timeout
2. **On timeout/failure** — fall back to lane `emergencySummary` (plain JSON, always available, no network dependency)
3. **emergencySummary** contains: last N commit hashes, session summary string, active branch state
4. **Minimum viable context**: even with Docker completely down, the AI gets enough to not start from zero

We've had Docker offline twice during active development. Both times the emergency fallback meant the AI came up with the last 3–4 commits and a session summary — not perfect, but functional. No lost context, no blank slate restart.

---

## Real-World Results

The `feat/phase-8-scrollreveal-production` branch is a good case study. It accumulated 18 commits over ten days of development. During that period, we switched between the feature branch and main at least forty times for PR reviews, hotfixes, and parallel work.

Without Memory Lanes, each of those forty branch switches would have required context reconstruction. At 20 minutes per rebuild, that's over thirteen hours of context overhead for one feature branch.

With Memory Lanes: the PostCheckout hook fires in under 100ms. Session startup with rehydration takes under 15 seconds (Docker query + context assembly). The AI resumes with full awareness of the ScrollReveal wrapper API, the viewport configuration, the 13 e2e test failures that were fixed, and the specific Framer Motion patterns we'd settled on.

Zero manual steps. Zero context loss.

The other concrete result: the `learn-transforms-preserve-scroll-anchors` learning entity in Docker — discovered during Phase 8 when we found that CSS `transform` and `filter` effects don't affect `getBoundingClientRect()` layout calculations — survived every branch switch. Future sessions on related branches can search for and load that learning without re-deriving it from scratch.

---

## Building Your Own

The Memory Lane pattern doesn't require Claude Code specifically. Any AI coding tool that supports hooks or session lifecycle events can implement it. The core components are:

1. **Branch-scoped config files** — one JSON per branch, tracking status, timestamps, and emergency summary
2. **A global active-lane tracker** — one file that knows which lane is currently active
3. **PostCheckout equivalent** — a hook that fires on branch switch, activates/pauses lanes
4. **Session-end equivalent** — a hook that syncs state before the session closes
5. **A rehydration script** — assembles context from the active lane within a token budget

The implementation in our stack uses Claude Code's PostCheckout and Stop hooks, Node.js scripts, and Docker memory-reference for the knowledge graph layer. But the shell script that manages lane state transitions is 80 lines of Node.js — not a framework, just a state machine over JSON files.

The universal version:
```
branch checkout → detect branch → activate matching context → pause previous context
session end → write summary to lane file → update sync timestamp
session start → load active lane context within token budget → inject into AI session
```

If your AI tool supports "custom context injection at session start" — that's all you need. The lane files are plain JSON. The hooks are shell commands. The whole thing is 200 lines of glue code on top of whatever knowledge store you're already using.

---

## What We'd Do Differently

Two things we'd change if we rebuilt this today:

**Token budget is a blunt instrument.** We enforce ≤3,000 tokens globally, but the right budget depends on how complex the active branch is. A branch with 30+ commits and 5 related Docker entities needs more budget than a one-commit hotfix. A smarter rehydration script would allocate budget based on lane age and entity count, not a fixed cap.

**PAUSED lane summaries degrade too fast.** After seven days paused, a lane drops to one-line reference. In practice, we've resumed branches after a two-week break expecting more context than we got. The degradation curve should be configurable per branch type — feature branches should retain more context longer than hotfix branches.

Both are fixable with more configuration. The core pattern — hook-driven, branch-scoped, tier-based — is solid.

---

## The Broader Pattern

Memory Lanes are a specific implementation of a more general idea: **AI context should be branch-aware, automatically managed, and degrade gracefully**. The chaos of multi-branch AI-assisted development is a solved problem. You don't have to start every session from zero.

The tooling to build this exists today — hooks, JSON, a knowledge graph MCP service, and a rehydration script. The pattern is generic. Claude Code is what we used; the architecture works with any tool that lets you inject context at session start and run code on branch switch.

If you're spending fifteen minutes per branch switch re-explaining your project to an AI, you've already paid for the weekend it takes to build this.

---

*Part of the ai-memory-architecture series: building production-grade persistent memory for AI-assisted development workflows.*
