# Nexgen Electrical Website - Project Rules

## Quick Reference (Read First)

### Brand Colors
- Primary: `electric-cyan` (#00f2ff) - CTAs, highlights, glows
- Background: `deep-slate` (#020617) - Main bg
- Surface: `pylon-grey` (#1e293b) - Cards, panels
- Warning: `amber-warning` (#f59e0b) - Alerts only

### Fonts
- Headings/Body: `font-sans` (Inter)
- Labels/Code/Tech: `font-mono` (IBM Plex Mono)

### CSS Utilities (Already Defined)
```
.blueprint-grid         - Large grid overlay
.blueprint-grid-fine    - Small grid overlay
.text-glow              - Strong cyan glow
.text-glow-subtle       - Soft cyan glow
.border-electric        - Glowing border
.industrial-label       - Mono, 10px, uppercase, spaced
.animate-voltage-pulse  - Line animation
.animate-glow-hum       - Soft pulsing
.animate-electric-pulse - Box shadow pulse
.animate-flicker        - Light flicker
```

## Architecture

### File Structure
```
app/
  layout.tsx       - Root layout, fonts, Navbar
  page.tsx         - Homepage (section composition)
  globals.css      - Theme tokens, animations
  contact/page.tsx - Contact page

components/
  hero/            - Hero section + subcomponents
  navigation/      - Navbar (server + client)
  sections/        - All page sections (barrel export)
  ui/              - shadcn/ui components
```

### Component Patterns
1. **Sections** use barrel export: `import { Services } from '@/components/sections'`
2. **Hero** uses barrel export: `import { Hero } from '@/components/hero'`
3. **Navigation** uses barrel: `import { Navbar } from '@/components/navigation'`
4. **UI** direct import: `import { Button } from '@/components/ui/button'`

### Styling Rules
1. Use semantic tokens: `bg-background`, `text-foreground`, `bg-card`
2. Use custom colors: `bg-deep-slate`, `text-electric-cyan`, `bg-pylon-grey`
3. Never hardcode colors - always use CSS variables
4. Mobile-first: base styles, then `md:` and `lg:` prefixes

## Do's and Don'ts

### DO
- Use existing animation utilities from globals.css
- Follow barrel export pattern for new sections
- Use `font-mono` for technical labels
- Use `industrial-label` class for small caps text
- Test mobile responsiveness

### DON'T
- Add new colors without updating globals.css
- Create inline keyframes (use globals.css)
- Skip barrel exports for new components
- Use raw hex colors in components
