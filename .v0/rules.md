# Nexgen Electrical - Project Rules v2.0

## Platinum Agreement

### Core Principles
1. **No Hallucination** - If unknown, I state "I don't know" and research
2. **No Shortcuts** - Build validates or we don't commit
3. **Transparent Costs** - Real token/cost tracking, not estimates
4. **State Honesty** - Drift detection flags mismatches immediately
5. **Validation-First** - 3-axis review (TypeScript, ESLint, Visual) before "done"

### Session Contract
- I load `.v0/` framework before any work
- I announce: Phase, Task, Model, Budget, Health
- I checkpoint at ops 7-8 and 15
- I update state files after each change batch
- I run `npm run build` before declaring completion

---

## Quick Reference

### Brand Colors (Semantic Tokens)
| Token | Hex | Usage |
|-------|-----|-------|
| `electric-cyan` | #00f2ff | CTAs, highlights, glows |
| `deep-slate` | #020617 | Main background |
| `pylon-grey` | #1e293b | Cards, panels, surfaces |
| `amber-warning` | #f59e0b | Alerts, warnings only |
| `foreground` | #f8fafc | Primary text |
| `muted-foreground` | #94a3b8 | Secondary text |

### Typography
| Element | Class | Font |
|---------|-------|------|
| Headings | `font-sans` | Inter |
| Body | `font-sans` | Inter |
| Technical/Labels | `font-mono` | IBM Plex Mono |
| Industrial Labels | `industrial-label` | Mono, 10px, uppercase |

### Animation Utilities (Pre-defined in globals.css)
```css
.blueprint-grid         /* Large grid overlay */
.blueprint-grid-fine    /* Small grid overlay */
.text-glow              /* Strong cyan glow */
.text-glow-subtle       /* Soft cyan glow */
.border-electric        /* Glowing border */
.industrial-label       /* Mono, 10px, uppercase, spaced */
.animate-voltage-pulse  /* Line animation */
.animate-glow-hum       /* Soft pulsing */
.animate-electric-pulse /* Box shadow pulse */
.animate-flicker        /* Light flicker */
```

---

## Architecture Patterns

### File Structure
```
app/
  layout.tsx           # Root layout, fonts, Navbar
  page.tsx             # Homepage (section composition)
  globals.css          # Theme tokens, animations, utilities
  contact/page.tsx     # Contact page
  [route]/page.tsx     # Additional pages

components/
  hero/                # Hero section + subcomponents
  navigation/          # Navbar (server + client split)
  sections/            # All page sections (BARREL EXPORT)
  ui/                  # shadcn/ui components
```

### Import Patterns (Mandatory)
```typescript
// Sections - ALWAYS barrel export
import { Services, Features, Dashboard } from '@/components/sections'

// Hero - ALWAYS barrel export
import { Hero } from '@/components/hero'

// Navigation - ALWAYS barrel export
import { Navbar } from '@/components/navigation'

// UI - Direct import
import { Button } from '@/components/ui/button'
```

### New Component Checklist
1. Create in correct directory
2. Add to barrel export (`index.ts`)
3. Import via barrel in consumer
4. Update `state.json` components list
5. Verify build passes

---

## Coding Standards

### DO
- Use semantic tokens (`bg-background`, `text-foreground`)
- Use custom brand colors (`text-electric-cyan`, `bg-pylon-grey`)
- Follow barrel export pattern for all non-UI components
- Use `font-mono` + `industrial-label` for technical labels
- Mobile-first: base → `md:` → `lg:`
- Test responsiveness at 375px, 768px, 1024px, 1440px

### DON'T
- Hardcode hex colors in components
- Create inline keyframes (use globals.css)
- Skip barrel exports
- Add colors without updating globals.css
- Use `space-x/y` (use `gap` instead)
- Mix margin/padding with gap on same element

---

## Validation Protocol

### 3-Axis Review (Before "Done")
1. **TypeScript** - No type errors (`npm run build`)
2. **ESLint** - No lint warnings
3. **Visual** - Matches design intent, responsive

### Build Command
```bash
npm run build
```
Must pass with 0 errors before any completion claim.

---

## Rule Index
| # | Rule | Category |
|---|------|----------|
| 1 | Load .v0/ framework at session start | Session |
| 2 | Announce phase/task/model/budget/health | Session |
| 3 | Checkpoint at ops 7-8 | Session |
| 4 | Checkpoint at ops 15 | Session |
| 5 | Use barrel exports for sections/hero/nav | Architecture |
| 6 | Mobile-first responsive design | Styling |
| 7 | Semantic tokens only, no hardcoded colors | Styling |
| 8 | 3-axis validation before completion | Quality |
| 9 | Update state.json after changes | State |
| 10 | Run npm run build before done | Quality |
| 11 | No shortcuts - full validation always | Platinum |
| 12 | Health-first model selection | Model |
| 13 | Model change = metrics update | Model |
