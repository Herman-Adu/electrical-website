# Context Map

## Purpose
Reduce token usage by documenting file relationships and hot files.
Read this instead of exploring the filesystem.

---

## Architecture Overview

```
app/
├── layout.tsx ─────────────┬─> components/navigation/navbar.tsx
│                           └─> app/globals.css
├── page.tsx ───────────────┬─> components/hero/index.ts (barrel)
│                           └─> components/sections/index.ts (barrel)
├── globals.css ────────────── (standalone, theme source of truth)
└── contact/
    └── page.tsx ───────────── components/sections/contact.tsx

components/
├── hero/
│   ├── index.ts (barrel) ──┬─> hero.tsx
│   │                       ├─> blueprint-background.tsx
│   │                       ├─> circuit-svg.tsx
│   │                       └─> mouse-glow.tsx
│   └── [subcomponents]
├── navigation/
│   ├── index.ts (barrel) ──┬─> navbar.tsx (server)
│   │                       └─> navbar-client.tsx (client)
│   └── [subcomponents]
├── sections/
│   ├── index.ts (barrel) ──┬─> services.tsx
│   │                       ├─> features.tsx
│   │                       ├─> schematic.tsx
│   │                       ├─> dashboard.tsx
│   │                       ├─> cta-power.tsx
│   │                       ├─> footer.tsx
│   │                       ├─> illumination.tsx
│   │                       ├─> smart-living.tsx
│   │                       ├─> contact.tsx
│   │                       └─> scheduler-card.tsx
│   └── [subcomponents]
└── ui/ ────────────────────── shadcn components (direct import)
```

---

## Dependency Graph

### Core Dependencies
```
globals.css
    └── All components (theme tokens)

layout.tsx
    ├── globals.css
    ├── navigation/navbar.tsx
    └── next/font/google (Inter, IBM Plex Mono)

page.tsx
    ├── hero/index.ts
    └── sections/index.ts
```

### Component Dependencies
```
hero.tsx
    ├── blueprint-background.tsx
    ├── circuit-svg.tsx
    ├── mouse-glow.tsx
    └── ui/button.tsx

sections/*.tsx
    └── ui/* (various)

navbar.tsx
    └── navbar-client.tsx
```

---

## Hot Files by Task

### Styling Task
**Must Read:**
- `.v0/rules.md` (tokens, utilities)
- `app/globals.css` (only if adding new utilities)

**Skip Reading:**
- Individual components (tokens in rules.md)

### New Section Task
**Must Read:**
- `.v0/rules.md` (patterns)
- `components/sections/index.ts` (barrel export)
- `app/page.tsx` (import pattern)
- One existing section as template

**Skip Reading:**
- Other sections (pattern documented)
- globals.css (tokens in rules.md)

### Navigation Task
**Must Read:**
- `components/navigation/navbar.tsx`
- `components/navigation/navbar-client.tsx`
- `app/layout.tsx`

### Hero Task
**Must Read:**
- `components/hero/hero.tsx`
- `components/hero/index.ts`
- Relevant subcomponent only

### New Page Task
**Must Read:**
- `app/layout.tsx` (understand wrapper)
- One existing page as template
- `.v0/rules.md` (patterns)

**Skip Reading:**
- All sections (use barrel import)

---

## File Sizes (Approximate)

| File | Lines | Read Priority |
|------|-------|---------------|
| globals.css | ~400 | Medium (tokens in rules.md) |
| layout.tsx | ~50 | Low (stable) |
| page.tsx | ~30 | Low (just imports) |
| hero.tsx | ~150 | On-demand |
| navbar.tsx | ~100 | On-demand |
| sections/*.tsx | ~50-150 each | On-demand |

---

## Import Cheatsheet

```typescript
// Hero (always barrel)
import { Hero } from '@/components/hero'

// Navigation (always barrel)
import { Navbar } from '@/components/navigation'

// Sections (always barrel)
import { 
  Services, 
  Features, 
  Schematic,
  Dashboard,
  CTAPower,
  Footer,
  Illumination,
  SmartLiving 
} from '@/components/sections'

// UI (direct import)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

---

## State Sync Checklist

When adding new files, update:
1. Barrel export (`index.ts`)
2. `state.json` → components.[category].files
3. `context-map.md` → architecture diagram (if structural)
4. `changelog.md` → new entry
