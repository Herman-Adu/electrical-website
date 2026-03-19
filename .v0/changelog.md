# Project Changelog

## Format
```
## [CHG-XXX] YYYY-MM-DD | Type | Complexity
**Description:** Brief description
**Files:** List of modified files
**Validation:** Build status
**Session:** Session ID
```

---

## Changelog Entries

### [CHG-002] 2026-03-19 | FEAT | L

**Description:** Implemented full theme toggle with light/dark mode support across all sections

**Files Modified:**
- `app/globals.css` - Added light theme CSS variables, fixed dark variant selector
- `app/layout.tsx` - Wired ThemeProvider with defaultTheme="dark"
- `components/ui/theme-toggle.tsx` - New animated sun/moon toggle component
- `components/hero/index.ts` - Removed duplicate navbar export
- `components/navigation/navbar-client.tsx` - Added theme toggle, semantic colors
- `components/hero/hero.tsx` - Updated to semantic tokens
- `components/hero/blueprint-background.tsx` - Theme-aware grid styling
- `components/sections/services.tsx` - Semantic color updates
- `components/sections/features.tsx` - Glass card styling for light mode
- `components/sections/illumination.tsx` - Forced white text (over dark image)
- `components/sections/schematic.tsx` - "PRECISION" text fix, semantic colors
- `components/sections/dashboard.tsx` - "GRID" text fix, terminal theming
- `components/sections/cta-power.tsx` - "Ready to Power" text fix
- `components/sections/footer.tsx` - Semantic color updates

**Validation:** Ready for PR

**Session:** SES-2026-03-19-002

---

### [CHG-001] 2026-03-19 | INIT | M

**Description:** Initialized .v0 agentic framework v2.0 with full platinum-grade setup

**Files:**
- `.v0/rules.md` - Project rules, platinum agreement, coding standards
- `.v0/state.json` - True state manager with drift detection
- `.v0/metrics.md` - Token dashboard, cost tracking (session + cumulative)
- `.v0/orchestrator.md` - Model matrix, gate system, workflow patterns
- `.v0/PHASE_STATE.md` - Phase tracking, recovery protocol
- `.v0/changelog.md` - This file
- `.v0/context-map.md` - File dependency graph, hot files

**Features Added:**
- Platinum agreement (no hallucination, no shortcuts, transparent costs)
- Gate system (GATE 1, 7, 15 checkpoints)
- Model matrix with health-based selection
- Complexity scoring (S/M/L/XL)
- Recovery protocol for session crashes
- Drift detection for state.json
- Cost projections and burn rate tracking
- Context preloading by task type

**Validation:** Pending build check

**Session:** SES-2026-03-19-001

---

## Change Types

| Type | Description |
|------|-------------|
| INIT | Initial setup, framework creation |
| FEAT | New feature or component |
| FIX | Bug fix |
| STYLE | Styling changes only |
| REFACTOR | Code restructure, no behavior change |
| DOCS | Documentation updates |
| PERF | Performance improvements |
| CONFIG | Configuration changes |

---

## Statistics

| Metric | Value |
|--------|-------|
| Total Changes | 2 |
| This Month | 2 |
| By Type | INIT: 1, FEAT: 1 |
| Files Touched | 21 |

---

## Pending Changes (Uncommitted)

None - all changes committed to state

---

## Rollback Reference

If rollback needed, restore from git:
```bash
git checkout HEAD~1 -- .v0/
```
