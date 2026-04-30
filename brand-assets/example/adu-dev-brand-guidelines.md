# Adu Dev Brand Guidelines

## Brand Identity Philosophy

Adu Dev is Herman Adu's full-stack web development agency. The brand represents technical precision, modern craft, and continuous momentum. The visual identity amplifies two core signals from the Adu Dev logo:

1. **Orange Orbit** — Energy, momentum, continuous delivery, and circular motion
2. **Angular Letterforms** — Precision, sharp geometry, technical craft, and clean engineering

### Design Principle: Orange is the Accent
The distinctive orange from the logo is the single accent color. It should never be used as a background or compete with content. Instead, let it lead and guide the eye to key CTAs and moments of emphasis. Backgrounds are always dark and confident.

---

## Color Palette

### Dark Theme (Primary)

The dark theme is the primary application. Use this for:
- Primary website and marketing materials
- Client pitches and proposals
- Social media content
- Infographics and educational materials
- Product interfaces and dashboards

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `bg-base` | `#0F0F0F` | Main background | Near-black charcoal, from logo |
| `bg-surface` | `#1A1A1A` | Cards, panels, surfaces | Slightly elevated from base |
| `bg-raised` | `#242424` | Elevated UI elements, modals | High contrast with base |
| `border` | `#2D2D2D` | Dividers, hairlines | Subtle definition |
| `brand-orange` | `#F47C00` | Primary accent, CTAs, hover states | Direct from Adu Dev logo |
| `brand-orange-light` | `#FF9430` | Hover effects, glows, secondary emphasis | 15% lighter for depth |
| `brand-orange-deep` | `#D06A00` | Active/pressed states, depth | 15% darker for interaction |
| `text-primary` | `#FFFFFF` | Headings, strong emphasis | Pure white for contrast |
| `text-secondary` | `#CACACA` | Body text, readable content | Light grey from logo |
| `text-muted` | `#6B6B6B` | Captions, placeholders, disabled | Subdued for hierarchy |

**Dark Theme Usage Example:**
```
Background: #0F0F0F
Card (elevated): #1A1A1A
CTA Button: #F47C00 text on #1A1A1A bg
Hover State: #FF9430
Body Text: #CACACA on #0F0F0F
Caption: #6B6B6B
```

### Light Theme

Light theme is secondary and used when:
- Email newsletters and print materials
- Light-background contexts (white paper documents, PDFs)
- Accessible alternatives where dark theme causes contrast issues
- Special use cases (client-specific requirements)

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `bg-base` | `#FFFFFF` | Main background | Pure white |
| `bg-surface` | `#F7F7F7` | Cards, panels | Warm off-white |
| `bg-raised` | `#EEEEEE` | Elevated elements, boxes | Subtle definition |
| `border` | `#E0E0E0` | Dividers, borders | Light but visible |
| `brand-orange` | `#E07000` | Primary accent (darker for WCAG AA on white) | Meets contrast requirements |
| `brand-orange-light` | `#F47C00` | Logo orange, hover states | Original logo orange |
| `brand-orange-deep` | `#C06000` | Active/pressed states | Deeper for interaction |
| `text-primary` | `#1A1A1A` | Headings | Dark charcoal |
| `text-secondary` | `#4D4D4D` | Body text | From logo dark grey |
| `text-muted` | `#9B9B9B` | Captions, placeholders | Muted grey |

**Light Theme Usage Example:**
```
Background: #FFFFFF
Card: #F7F7F7
CTA Button: white text on #E07000 bg
Body Text: #4D4D4D on #FFFFFF
Caption: #9B9B9B
```

### Accessibility Notes

- **Dark theme:** All combinations exceed WCAG AA (4.5:1) contrast ratios
- **Light theme:** Orange primary (#E07000) is darker to meet contrast on white; logo orange (#F47C00) reserved for hover/secondary states
- **Interactive states:** Provide `hover`, `active`, and `disabled` variants for all buttons and links
- **Color-blind safe:** Never use color alone to convey meaning; pair with icons, text labels, or patterns

---

## Typography

### Font Stack

| Role | Font | Weight(s) | Usage |
|---|---|---|---|
| Display / H1 | Inter | 800 ExtraBold | Large hero headlines, section titles, maximum visual impact |
| Headings H2–H4 | Inter | 700 Bold | Subheadings, section breaks, emphasis |
| Body Text | Inter | 400 Regular | Running prose, descriptions, default reading |
| Emphasis / Strong | Inter | 500 Medium | In-body callouts, strong words within paragraphs |
| Code / Monospace | JetBrains Mono | 400–500 | Code snippets, technical labels, variable names |
| Labels / UI | Inter | 500 Medium | Button text, form labels, UI controls |

### Rationale

**Inter** is chosen for:
- Readability across screen sizes (high x-height, generous letterforms)
- Professional, modern aesthetic (default for web agencies in 2026)
- Worldwide language support (crucial for global clients)
- Optimized for screen rendering (web-safe)

**JetBrains Mono** is chosen for:
- Modern monospace font (establishes technical identity)
- Signals "developer-first" positioning
- Clear distinction in code blocks and technical content
- Professional open-source connotation

### Type Scale (px)

| Role | Size | Line Height | Margin Below |
|---|---|---|---|
| H1 (Display) | 48–56 | 1.2 | 32 |
| H2 | 36–40 | 1.3 | 24 |
| H3 | 28–32 | 1.4 | 16 |
| H4 | 24 | 1.4 | 12 |
| Body | 16 | 1.6 | 8 |
| Small / Caption | 14 | 1.5 | 4 |
| Code | 14–16 (monospace) | 1.5 | 8 |

### Typography Rules

1. **One accent per heading:** Use orange only for a single keyword or phrase per H2/H3, never entire headings
2. **Generous line height:** Minimum 1.4 for readability on dark backgrounds
3. **Letter spacing:** Standard (normal); no tracking adjustments unless in all-caps UI labels (+0.05em)
4. **Case:** Sentence case for headings and body; ALL CAPS reserved for UI labels and emphasis marks only

---

## Logo Usage

### Logo Variants

Adu Dev has four logo files in `brand-assets/`:

1. **`adudev-cropped.png`** — Dark letterforms (#4D4D4D) + orange orbit (#F47C00) on **white/light backgrounds**
   - Use on light backgrounds (white, light grey, light website sections)
   - Minimum size: 120px wide

2. **`adudev-light-cropped.png`** — Light letterforms (#CACACA) + orange orbit (#F47C00) on **dark backgrounds**
   - Use on dark backgrounds (#0F0F0F, #1A1A1A, dark website sections)
   - Minimum size: 120px wide

3. **`adu-dev-logo-transparent-background.png`** — Transparent variant (mixed tones)
   - Use when compositing over gradients or complex backgrounds
   - Requires contrast check before use

4. **`adudev-light-Logo-medium.png`** — Alternate light variant
   - Secondary light logo for specialty use cases

### Logo Placement Rules

- **Top-left corner:** Standard placement for website headers, documents, infographics
- **Bottom-right corner:** Optional secondary placement in footers or content cards
- **Centered:** Only in hero sections or standalone brand moments (rare)
- **Minimum clearance:** 20px on all sides (white/clear space)
- **Minimum size:** 120px wide; never scale below 80px
- **No modifications:** Never rotate, flip, stretch, or change colors

### Logo Context Examples

| Context | Logo Choice | Background | Size |
|---|---|---|---|
| Dark website header | `adudev-light-cropped.png` | `#0F0F0F` | 140–160px |
| Light website section | `adudev-cropped.png` | `#FFFFFF` | 140–160px |
| Dark infographic | `adudev-light-cropped.png` | `#0F0F0F` | 100–120px (top-left) |
| Light infographic | `adudev-cropped.png` | `#FFFFFF` | 100–120px (top-left) |
| Email footer | `adudev-cropped.png` | `#FFFFFF` | 100–120px |
| Client presentation slide | `adudev-light-cropped.png` | `#1A1A1A` (dark card) | 120–150px |
| Social media post | `adudev-light-cropped.png` | `#0F0F0F` | 80–100px (corner) |

---

## Design Principles

### 1. Orange is the Accent, Not the Background

The orange orbit from the logo is the single hero accent. It should guide attention and emphasize key moments: CTAs, highlights, interactive hover states. Never use orange as a background or fill large areas.

**✅ Do:**
- Orange button text on dark background
- Orange accent line above a section heading
- Orange hover effect on links
- One orange icon per section

**❌ Don't:**
- Orange background fills
- Full-width orange sections
- Multiple orange elements competing for attention
- Orange text on dark backgrounds (poor contrast)

### 2. Geometry and Sharp Angles

The Adu Dev letterforms have angular, precise geometry. Reflect this in:
- Sharp corners on cards (no excessive border-radius; use 4–8px)
- Minimal rounded elements
- Geometric icon design (lines, angles, not curves)
- Grid-based layouts with precise alignment
- Diagonal lines or angular accent shapes (subtle, not overwhelming)

**Visual accent:** Consider subtle diagonal lines, angled dividers, or geometric shapes to echo the logo's letterform precision.

### 3. Generous Whitespace

Dark backgrounds can feel heavy. Counter this with generous margins, padding, and negative space. Let content breathe.

**Spacing rules:**
- Section padding: 64px (desktop), 32px (mobile)
- Card padding: 24–32px
- Line spacing: 1.4–1.6 for body text
- Margin below headings: At least 16px
- Avoid visual clutter; never fill > 60% of any container

### 4. Motion and Momentum

The orbit metaphor suggests continuous motion and momentum. Apply this to:
- Smooth transitions on interactive elements (200–300ms)
- Subtle animations on scroll or hover
- Loading states that suggest progress
- Flowing, circular motion in micro-interactions (not rigid or stiff)

**Examples:**
- Hover on CTA: Smooth color shift from `#F47C00` → `#FF9430`
- Loading: Rotating orbit icon (circular motion, orange)
- Transition: Slide-in from edges with 200ms easing

### 5. Dark, Confident, Tech-Forward

Backgrounds are dark and confident. The dark theme (#0F0F0F) is the primary context. This signals:
- Modernity and tech sophistication
- Confidence and professionalism
- A developer-first brand (dark mode is default in IDEs)

Avoid light, pastel, or warm backgrounds for primary brand applications.

---

## Theme Switching (Dark + Light)

### When to Offer Light Theme

Offer the light theme alternative when:
- User explicitly requests it (accessibility or brand flexibility)
- Email newsletters require light backgrounds for readability
- PDF or print documents need white backgrounds
- Client-specific requirement or brand integration

### Implementation Pattern

```css
/* Dark theme (default) */
:root {
  --bg-base: #0F0F0F;
  --bg-surface: #1A1A1A;
  --brand-orange: #F47C00;
  --text-primary: #FFFFFF;
  --text-secondary: #CACACA;
}

/* Light theme (opt-in) */
[data-theme="light"] {
  --bg-base: #FFFFFF;
  --bg-surface: #F7F7F7;
  --brand-orange: #E07000;
  --text-primary: #1A1A1A;
  --text-secondary: #4D4D4D;
}
```

### Dark-to-Light Transition Checklist

When switching to light theme:
1. ✅ Change background to white (`#FFFFFF`)
2. ✅ Use `#E07000` for primary orange (darker for contrast)
3. ✅ Change text-primary to `#1A1A1A`
4. ✅ Update all shadows (use subtle grey, not black)
5. ✅ Verify contrast ratios (WCAG AA minimum: 4.5:1)
6. ✅ Test logos (use `adudev-cropped.png` on light bg)

---

## Visual Elements

### Icons

Icons follow a minimal line-style design language:
- **Weight:** 1.5–2px stroke weight
- **Corners:** Sharp angles (not rounded)
- **Grid:** 24×24 or 32×32 px baseline
- **Color:** Match text-primary or use brand-orange for emphasis
- **Examples:** Code brackets, circles/orbits, arrow shapes, geometric patterns

### Imagery

Imagery is technical and professional:
- Code snippets and development environments (screenshots, not illustrations)
- Website mockups and UI designs
- Technical diagrams and architecture charts
- Minimal photography (developer portraits, workspace, hardware)
- Avoid: Stock photos, illustrations, heavy filters

### Dividers and Borders

- **Color:** `#2D2D2D` (border token)
- **Weight:** 1px
- **Style:** Solid lines only (no dashed or dotted)
- **Spacing:** 32–48px margin on either side
- **Alternative:** Subtle geometric shapes (thin diagonal line, minimal angle)

### Backgrounds and Gradients

- **Primary:** Solid `#0F0F0F` (no gradients)
- **Secondary surfaces:** Solid `#1A1A1A` (no noise or texture)
- **Avoid:** Gradients, patterns, textures, or animated backgrounds
- **Justification:** Dark, clean, professional; let content take focus

---

## Content Voice and Tone

### Brand Voice (Adu Dev)

- **Professional but approachable** — Expert knowledge delivered without jargon
- **Direct and clear** — No fluff; respect the reader's time
- **Confident** — Proven track record in fullstack development
- **Forward-thinking** — Stay current with technology and best practices
- **Client-focused** — Always frame decisions around client outcomes and ROI

### Messaging Pillars

1. **Full-Stack Mastery** — End-to-end development from database to UI
2. **Delivery Excellence** — Projects completed on time, on budget, production-ready
3. **Client Partnership** — Not a vendor; a genuine partner in success
4. **Modern Tech Stack** — React, Node.js, TypeScript, databases, deployment best practices
5. **Continuous Momentum** — Iterative improvement, agile mindset, always shipping

### Tone Examples

**❌ Too formal / corporate:**
> "Adu Dev Solutions leverages synergistic methodologies to actualize enterprise-grade applications."

**❌ Too casual / unprofessional:**
> "yo, we build sick websites lol. hit us up 🔥"

**✅ Right tone (Adu Dev):**
> "Full-stack development that ships on time. From API design to React UIs, we build production-grade applications."

---

## Applications

### Website

- **Homepage:** Dark background, hero section with orange CTA, generous whitespace
- **Service pages:** Grid layout with geometric accent shapes, code examples
- **Portfolio:** Client case studies with screenshots, technical writeups
- **Header:** Logo top-left (light version), navigation in text-secondary

### Email Newsletter

- **Background:** `#FFFFFF` (light theme)
- **Headers:** Inter Bold, text-primary (`#1A1A1A`)
- **CTAs:** Orange background (`#E07000`), white text
- **Accent blocks:** Light grey background (`#F7F7F7`), bordered with `#E0E0E0`
- **Footer:** Logo and copyright, text-muted

### Social Media

- **Instagram / LinkedIn Posts:** Dark background (`#0F0F0F`), orange accent elements
- **Profile graphics:** Light logo variant on dark bg
- **Story templates:** Dark theme with orange CTAs
- **Color:** Consistent orange orbit in every post

### Presentations (Client Pitch, RFP)

- **Slide background:** Dark (`#1A1A1A`)
- **Accent blocks:** Subtle grey dividers or orange bars
- **Logo:** Top-left or bottom-right (light variant)
- **Code examples:** Monospace on dark bg, syntax highlighting with orange accents
- **Typography:** Inter headings, no decorative fonts

### Infographics

- **Background:** Dark (`#0F0F0F`) or light (`#FFFFFF`) depending on context
- **Accent color:** Orange for emphasis, CTAs, key stats
- **Typography:** Inter headings + JetBrains Mono for code/data
- **Logo placement:** Top-left corner, sized 80–120px
- **Icons:** Minimal line-style, matching text color or orange

### Print (Business Cards, Letterhead)

- **Card background:** White or dark (`#0F0F0F` black card)
- **Logo:** Standard dark or light variant
- **Accent line:** Thin orange line, geometric angle
- **Typography:** Inter (web-safe fallback: system sans-serif)
- **Spacing:** Generous margins, clean layout

---

## Developer Implementation

### CSS Variable Template

```css
:root {
  /* Dark Theme (default) */
  --color-bg-base: #0F0F0F;
  --color-bg-surface: #1A1A1A;
  --color-bg-raised: #242424;
  --color-border: #2D2D2D;
  --color-brand-orange: #F47C00;
  --color-brand-orange-light: #FF9430;
  --color-brand-orange-deep: #D06A00;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #CACACA;
  --color-text-muted: #6B6B6B;

  /* Typography */
  --font-display: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Monaco", monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light theme override */
[data-theme="light"] {
  --color-bg-base: #FFFFFF;
  --color-bg-surface: #F7F7F7;
  --color-bg-raised: #EEEEEE;
  --color-border: #E0E0E0;
  --color-brand-orange: #E07000;
  --color-brand-orange-light: #F47C00;
  --color-brand-orange-deep: #C06000;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4D4D4D;
  --color-text-muted: #9B9B9B;
}
```

### Tailwind Config Reference

If using Tailwind CSS:

```javascript
module.exports = {
  theme: {
    colors: {
      transparent: "transparent",
      bg: {
        base: "var(--color-bg-base)",
        surface: "var(--color-bg-surface)",
        raised: "var(--color-bg-raised)",
      },
      brand: {
        orange: "var(--color-brand-orange)",
        "orange-light": "var(--color-brand-orange-light)",
        "orange-deep": "var(--color-brand-orange-deep)",
      },
      text: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
      },
    },
    fontFamily: {
      display: "var(--font-display)",
      mono: "var(--font-mono)",
    },
  },
};
```

---

## Quality Checklist

Use this checklist before approving any Adu Dev asset:

- [ ] **Color palette:** Dark theme default; light theme only where explicitly approved
- [ ] **Orange usage:** Accent only (buttons, icons, highlights); never background
- [ ] **Logo:** Correct variant for background (light on dark, dark on light)
- [ ] **Typography:** Inter for display/body, JetBrains Mono for code
- [ ] **Contrast:** All text meets WCAG AA (4.5:1 minimum)
- [ ] **Spacing:** Generous margins; content never exceeds 60% of container
- [ ] **Icons:** Minimal line-style, geometric, matching brand precision
- [ ] **Motion:** Smooth transitions (200–300ms), circular/orbital metaphor where applicable
- [ ] **Voice:** Professional, direct, client-focused (never corporate jargon or excessive casual)
- [ ] **No clutter:** Designs are clean and confident; dark background is intentional and professional

---

## Version History

| Date | Version | Changes |
|---|---|---|
| 2026-03-12 | 1.0 | Initial Adu Dev brand guidelines; dark theme primary, light theme secondary |

---

## Questions or Updates?

This document is the source of truth for Adu Dev brand consistency. For updates or clarifications, contact Herman Adu directly or file a decision in `decisions/log.md`.

**Brand Assets Location:** `brand-assets/` (logos, reference images, templates)

**Skill Reference:** `.claude/skills/infographic-creator/` (Adu Dev brand support for generating infographics)
