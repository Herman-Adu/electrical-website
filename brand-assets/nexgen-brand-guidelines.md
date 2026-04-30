# Nexgen Electrical Innovations Brand Guidelines

## Brand Identity Philosophy

Nexgen Electrical Innovations Ltd is a NICEIC Approved Contractor serving London and South East England — a company built on a decade of precision engineering, trusted partnerships, and gold-standard electrical work. The visual identity reflects the professional confidence of a firm that works in environments where accuracy is non-negotiable and safety is paramount.

The brand communicates two core signals derived from the industry and the company's character:

1. **Electric Cyan — Controlled Power** — The brand primary `#00b2a9` is neither aggressive nor passive. It evokes the clean hum of live current, precision instrumentation, and modern electrical infrastructure. It signals competence, not flair.
2. **Industrial Precision** — Clean geometry, measured whitespace, and restrained typography echo the discipline of electrical engineering: every connection intentional, nothing wasted.

### Design Principle: Light, Professional, Trustworthy

Unlike technology or creative brands that default to dark themes, Nexgen leads with a **light theme** as the primary application. Electrical contractors operate in the physical world — they present to clients in daylight, produce paper certificates and compliance reports, appear in local directories and on-site signage. The light-first approach signals professional legitimacy, regulatory confidence, and approachability to a broad client base that includes homeowners, facilities managers, and commercial property owners.

Dark theme is reserved for high-impact hero sections, image-backed sections, and digital marketing contexts where contrast and drama are appropriate.

### NICEIC Badge — The Trust Anchor

The NICEIC Approved Contractor accreditation is a core brand asset and must be treated as a trust signal in every appropriate context. It should appear prominently in headers, footers, proposals, and anywhere the brand is being introduced to a prospective client. It is never decorative — it is substantive proof of compliance and competence.

---

## Color Palette

### Light Theme (Primary)

The light theme is the primary application for all Nexgen brand output. Use this for:
- Primary website sections, service pages, and component surfaces
- Print materials, compliance documents, proposals, and letterheads
- Email newsletters and client-facing PDFs
- Social media content with high information density
- Infographics and educational materials

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `electric-cyan` | `#00b2a9` | Brand primary — buttons, links, accents, icons | Light-mode primary value from `globals.css` |
| `electric-cyan-mid` | `#00c99d` | Hover states, secondary emphasis | Slightly brighter than primary |
| `electric-cyan-strong` | `#006e56` | Deep teal — headings, section anchors, focus rings | High contrast on white |
| `electric-cyan-deep` | `#004a3a` | Dark forest — container borders, sidebar, deep surfaces | Closest to near-black in the brand |
| `electric-cyan-soft` | `#c2fff1` | Light mint — tinted card backgrounds, subtle highlights | Light, airy tint |
| `amber-warning` | `#d97706` | CTAs, warnings, status indicators | Never overused; anchor-energy on light bg |
| `deep-slate` | `#f8fafc` | Page background | Near-white, slight blue-grey cool tone |
| `pylon-grey` | `#e2e8f0` | Card surfaces, panel backgrounds | Subtle cool-grey |
| `slate-dark` | `#f1f5f9` | Elevated surfaces, table rows | Slightly warmer than pylon-grey |
| `text-primary` | `#0f172a` | Headings, strong emphasis | Deep navy-charcoal for richness |
| `text-secondary` | `#334155` | Body text, labels | Slate mid-tone; comfortable to read |
| `text-muted` | `#64748b` | Captions, placeholders, secondary labels | Subdued, accessible |

**Light Theme Composition Example:**
```
Page background:  #f8fafc  (deep-slate)
Card surface:     #e2e8f0  (pylon-grey) or white (#ffffff)
Primary button:   white text on #006e56 (electric-cyan-strong)
Hover state:      white text on #00b2a9 (electric-cyan)
CTA / warning:    white text on #d97706 (amber-warning)
Body text:        #334155 on #f8fafc
Heading text:     #0f172a
Caption:          #64748b
Accent tint:      #c2fff1 (mint background on feature cards)
```

### Dark Theme (Secondary)

The dark theme is used selectively for maximum visual impact. Apply it for:
- Full-bleed hero sections with image backgrounds
- Dark-panel alternating sections on the homepage
- Social media posts that require drama and standout
- Digital campaign assets

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `electric-cyan` (dark) | `#00f3bd` | Primary accent, glow effects, highlights | Brighter variant for dark bg readability |
| `electric-cyan-soft` (dark) | `#8dffe3` | Secondary glows, hover highlights | |
| `electric-cyan-mid` (dark) | `#00c99d` | Interactive states | |
| `electric-cyan-deep` (dark) | `#002b22` | Very deep surface tint | |
| `deep-slate` (dark) | `#020617` | Primary dark background | Near-black with blue-slate tint |
| `pylon-grey` (dark) | `#1e293b` | Cards, elevated dark surfaces | Dark blue-slate |
| `slate-dark` (dark) | `#0f172a` | Deep panel surfaces | |
| `amber-warning` (dark) | `#f59e0b` | CTA, warning, standout elements | Brighter amber for dark contexts |
| `text-primary` (dark) | `#ffffff` | Headings on dark | Pure white |
| `text-secondary` (dark) | `oklch(0.985 0 0)` | Body text on dark | Near-white |
| `text-muted` (dark) | `oklch(0.556 0.02 260)` | Captions, subdued labels | |

**Dark Theme Composition Example:**
```
Background:       #020617  (deep-slate dark)
Card surface:     #1e293b  (pylon-grey dark)
Primary accent:   #00f3bd  (electric-cyan dark)
CTA button:       #00f3bd text on #1e293b background
Hover:            #8dffe3
Body text:        white on dark bg
Caption:          muted slate
Border:           oklch(0.269 0.03 260)
```

### Special Visual Effects

These are defined in `globals.css` and represent the Nexgen visual signature for hero sections and industrial-themed backgrounds:

| Effect | Variable | Value |
|---|---|---|
| Grid overlay (standard) | `--electric-cyan-grid` | `rgba(0, 243, 189, 0.1)` |
| Grid overlay (fine) | `--electric-cyan-grid-fine` | `rgba(0, 243, 189, 0.05)` |
| Glow subtle | `--electric-cyan-glow-subtle` | `rgba(0, 243, 189, 0.5)` |
| Border glow | `--electric-cyan-border-glow` | `rgba(0, 243, 189, 0.3)` |
| Border inset | `--electric-cyan-border-inset` | `rgba(0, 243, 189, 0.1)` |

The `.blueprint-grid` class applies a 40px-spaced grid pattern. The `.blueprint-grid-fine` class applies a 10px fine grid — use on dark hero sections for an industrial schematic aesthetic.

### Accessibility Notes

- **Light theme:** `#006e56` (electric-cyan-strong) on white exceeds WCAG AA (contrast ratio ~7.5:1)
- **Light theme:** `#00b2a9` on white is borderline at standard text sizes — use for large headings and UI elements only, not small body text
- **Amber (#d97706) on white** passes WCAG AA for large text; verify for small text
- **Dark theme:** `#00f3bd` on `#020617` exceeds WCAG AA comfortably
- **Never use color alone** to communicate status or meaning; pair with icons and text labels
- **Reduced motion:** The `glow-hum` animation respects `prefers-reduced-motion` — the CSS is already implemented

---

## Typography

### Font Stack

The project uses **Inter** as the primary sans-serif and **IBM Plex Mono** as the monospace font. Both are defined in `globals.css` as CSS custom properties and injected via Next.js font loading.

| Role | Font | Weight(s) | Usage |
|---|---|---|---|
| Display / H1 | Inter | 800 ExtraBold | Hero headlines, section-opening statements, maximum impact |
| Headings H2–H3 | Inter | 700 Bold | Section titles, card headings, subheadings |
| Headings H4–H5 | Inter | 600 SemiBold | Sub-section labels, sidebar items |
| Body Text | Inter | 400 Regular | Running paragraphs, descriptions, default reading |
| Emphasis / Strong | Inter | 500 Medium | In-body callouts, strong phrases |
| Labels / UI | Inter | 500 Medium | Button text, form labels, nav items, certification badges |
| Industrial Labels | IBM Plex Mono | 400 | Specification labels, certifications, technical tags |
| Code / Technical | IBM Plex Mono | 400–500 | Inline code, compliance reference numbers, spec sheets |

### Rationale

**Inter** is chosen for:
- High legibility at all sizes — critical for compliance-driven documents
- Professional, modern aesthetic fitting for a regulated trade contractor
- Excellent x-height for body text on both screen and print
- Full character set supporting British English conventions

**IBM Plex Mono** is chosen for:
- Carries an industrial, precision instrument feel appropriate for an electrical brand
- Distinguishes specification labels, part numbers, and certification codes from prose
- The `.industrial-label` CSS class in `globals.css` pairs IBM Plex Mono with `letter-spacing: 0.3em` and `text-transform: uppercase` — use this class for any badge, certification tag, or specification label

### Type Scale (px)

| Role | Size | Line Height | Margin Below |
|---|---|---|---|
| H1 (Display) | 48–56 | 1.15 | 32 |
| H2 | 36–40 | 1.25 | 24 |
| H3 | 28–32 | 1.35 | 16 |
| H4 | 22–24 | 1.4 | 12 |
| Body | 16 | 1.6 | 8 |
| Small / Caption | 14 | 1.5 | 4 |
| Industrial Label | 10–12 (mono) | 1.2 | 4 |

### Typography Rules

1. **Cyan accents on headings:** Highlight one key word or phrase per H2/H3 in `#006e56` or `#00b2a9` — never the full heading
2. **Sentence case for headings:** All headings use sentence case; ALL CAPS reserved for industrial labels and compliance badges only
3. **Generous line height:** Minimum 1.5 for body text on any background
4. **Monospace for specs:** All certification numbers, regulation references (e.g. "18th Edition BS 7671"), and technical identifiers use IBM Plex Mono
5. **No decorative fonts:** Never introduce a display typeface beyond Inter; the brand personality is precision, not personality

---

## Logo Usage

### Logo Variants

Nexgen has four logo files located in `brand-assets/`:

1. **`nexgen-logo-full.png`** — Full horizontal lockup with wordmark
   - Primary logo for most contexts
   - Use on light backgrounds (white, `#f8fafc`, light section panels)
   - Minimum width: 160px
   - Recommended contexts: website header, proposals, printed documents, email header

2. **`nexgen-logo-round.png`** — Circular badge / icon format
   - Use for compact spaces where the full lockup would be illegible
   - Recommended contexts: social media profile images, favicon at large scale, app icons, circular avatar contexts, vehicle livery
   - Minimum size: 48px diameter

3. **`nexgen-transparent-banner.png`** — Horizontal banner with transparent background
   - Use when compositing over photography, section backgrounds, or gradient panels
   - Requires contrast check before use — confirm legibility against background
   - Recommended contexts: hero overlays, presentation slides with photographic backgrounds, print banners

4. **`Transparent full NEXGEN logo 2.png`** — Alternate full transparent variant
   - Secondary transparent full-lockup for specialty compositing situations
   - Use when `nexgen-transparent-banner.png` does not fit the compositional need
   - Always verify contrast and clearance before use

### Logo Placement Rules

- **Top-left corner:** Standard placement for website headers, documents, compliance certificates, proposals
- **Bottom-right corner:** Standard placement for content cards, social posts, marketing photography overlays
- **Centered:** Only in standalone brand moments — email headers, splash screens, certificate covers
- **Minimum clearance:** 16px on all sides (white/clear space around logo)
- **Minimum size:** 120px wide for full lockup; never scale below 80px wide
- **No modifications:** Never rotate, flip, recolour, add drop shadows, or stretch any logo variant

### Logo Selection by Context

| Context | Logo Choice | Background | Size |
|---|---|---|---|
| Light website header | `nexgen-logo-full.png` | `#f8fafc` or white | 150–180px wide |
| Dark hero section overlay | `nexgen-transparent-banner.png` | Dark / photographic bg | 160–200px wide |
| Email header | `nexgen-logo-full.png` | White | 160–180px wide |
| Social media post (corner) | `nexgen-transparent-banner.png` or `nexgen-logo-round.png` | Varies | 80–100px |
| Social profile image | `nexgen-logo-round.png` | Brand primary bg | Full crop |
| Printed proposal cover | `nexgen-logo-full.png` | White | 180–220px wide |
| Compliance certificate | `nexgen-logo-full.png` | White | 140–160px wide |
| Presentation slide | `nexgen-transparent-banner.png` | Dark card / photo | 120–160px wide |
| Photography bottom-right overlay | `nexgen-transparent-banner.png` | Varies | 80–100px |
| Vehicle livery / signage | `nexgen-logo-full.png` or round | White panel | Size-to-context |

---

## Design Principles

### 1. Light Theme is the Primary Context

Unlike technology or creative brands, Nexgen operates in a regulated, safety-critical trade. Its clients — homeowners, facilities managers, architects, local authorities — expect a professional, authoritative presentation. Light backgrounds convey compliance, legibility, and trust.

**Use light backgrounds for:**
- All compliance and certificate documents
- Proposals, quotations, and tender responses
- Email correspondence and newsletters
- Website service pages and informational content
- Print materials of any kind

**Use dark backgrounds for:**
- Full-bleed hero photography sections
- Alternating high-drama homepage panels
- Social media posts designed for standout in a feed
- Digital advertising assets

### 2. Electric Cyan is the Signal, Not the Surface

The `#00b2a9` cyan is the single accent in the light-theme world. It marks what matters: primary buttons, active states, key icons, heading highlights. It should never flood a layout.

**Do:**
- Cyan text accent on one keyword per heading
- Cyan icon at section entry points
- Cyan underline or left-border on feature cards
- Cyan background only on small chips, badges, or callout blocks — never full sections

**Do not:**
- Cyan background fills for full sections or hero panels
- Multiple competing cyan elements within the same card
- Cyan on cyan (e.g. cyan text on mint `#c2fff1` background without contrast check)

### 3. Industrial Precision — Not Startup Minimalism

This brand is not a tech startup. It is a regulated trade contractor with over a decade of physical, safety-critical work behind it. Design must signal authority, expertise, and precision — not playfulness, disruption, or consumer-tech friendliness.

**Express precision through:**
- Sharp corners with very low border-radius (`--radius: 0.25rem` is set in globals.css — maintain this)
- Grid-based layouts with strict alignment
- Consistent spacing increments (do not eyeball; use the spacing scale)
- Monospace type for all technical labels and specification references
- Blueprint grid backgrounds on dark hero sections (`.blueprint-grid` utility class)

**Avoid:**
- Excessive rounded corners or pill shapes (they signal consumer apps, not trade contractors)
- Gradients as primary backgrounds
- Illustrative or hand-drawn graphic elements
- Playful iconography or emoji-style visuals

### 4. Amber as the Call-to-Action Anchor

`#d97706` (amber-warning in light theme) serves a dual purpose: it marks urgent CTAs and important warnings. The amber creates warm contrast against the cool cyan palette and draws the eye on light-background surfaces without competing with the electric-cyan brand signal.

**Amber usage rules:**
- One primary amber CTA per visible viewport section
- Use amber for primary "Get a Quote", "Book Inspection", and contact trigger buttons
- Use amber for warning or compliance-status indicators (e.g. "Certificate Overdue")
- Never use amber and cyan simultaneously on the same small element (they compete)

### 5. NICEIC and Certification Badges — Always Visible

The NICEIC Approved Contractor badge, SafeContractor, Achilles Gold, CHAS, ISO 9001, Part P, and ECS credentials are trust anchors, not decoration. They must appear:
- In the website footer on every page
- In the header area of proposals, tenders, and quotation documents
- In the "About" section alongside director profiles
- In email signature blocks

Present certification badges in a consistent row with appropriate clearance. Never resize or alter official accreditation marks.

### 6. Photography Over Illustration

Nexgen's credibility is physical: real electricians, real installations, real certificates. Photography of actual work and real team members is always preferred over stock illustration or AI-generated scene filler.

**Photography must show:**
- Clean, organised, professional workmanship
- Properly equipped team members in PPE
- Completed, high-quality installations (not mid-work chaos)
- Real London/South East England environments where possible

---

## Applications

### Website

- **Light theme default** for all service pages, about, projects, contact, and blog sections
- **Dark hero panels** for the homepage hero and alternating impact sections
- **Header:** Light background, `nexgen-logo-full.png` top-left, nav in `text-secondary` (`#334155`)
- **Section rhythm:** Alternate between white and `#f8fafc` for visual breathing room
- **CTA buttons:** Amber (`#d97706`) for primary conversion actions; cyan-strong (`#006e56`) for secondary/informational actions
- **NICEIC badge:** Always visible in footer; optionally in header announcement bar

### Email Newsletter

- **Background:** White (`#ffffff`)
- **Headers:** Inter Bold, `#0f172a` or `#006e56`
- **Body text:** `#334155` on white
- **Primary CTA block:** Amber (`#d97706`) background, white text
- **Feature blocks:** Mint tint (`#c2fff1`) background, `#004a3a` text — use for compliance tips, news items
- **Footer:** `nexgen-logo-full.png`, NICEIC badge, company registration details
- **Certification row:** Footer of every email — NICEIC, SafeContractor, CHAS

### Social Media

- **LinkedIn (primary channel for B2B):** Professional project photography with logo overlay bottom-right; stats-based posts in light-theme layout; certifications visible on profile banner
- **Facebook/Instagram (residential awareness):** Warmer treatment; before/after installation shots; team photography; amber CTA overlays
- **Profile images:** `nexgen-logo-round.png` on brand primary background (`#006e56` recommended)
- **Post templates:** Light card design for informational posts; dark photographic background for project showcase posts

### Presentations (Tender, Pitch, RFP)

- **Slide background:** White or very light (`#f8fafc`)
- **Accent blocks:** `#c2fff1` (mint) for highlight panels; `#006e56` for heading bars
- **Logo:** Top-left every slide in standard non-cover layouts; full-cover on title slide
- **Certification row:** Visible on title slide and final slide
- **Typography:** Inter headings, IBM Plex Mono for specification labels and compliance references
- **Photography:** Real site photos, team portraits where available

### Print (Business Cards, Letterhead, Compliance Documents)

- **Letterhead:** White, logo top-left, cyan-strong (`#006e56`) header line, company registration bottom
- **Business cards:** White face, `#006e56` back panel with logo reversed white; or white both sides with cyan accent line
- **Compliance certificates:** White background, logo top, NICEIC badge, certification number in IBM Plex Mono
- **Van livery / signage:** Full-colour `nexgen-logo-full.png`, white background or `#006e56` green panel

### Infographics and Diagrams

- **Background:** White or `#f8fafc` for light versions; `#020617` for dark/digital versions
- **Blueprint grid:** Apply `.blueprint-grid` utility on dark sections for the Nexgen industrial signature look
- **Accent color:** Cyan for data/flow elements; amber for warnings, thresholds, or critical labels
- **Typography:** Inter headings; IBM Plex Mono for labels, specifications, part references
- **Logo placement:** Bottom-right, 80–100px wide
- **Icons:** Minimal line-style, 24x24 grid, 1.5px stroke, matching `text-primary` or cyan

---

## Developer Implementation

### CSS Variable Template

These are the authoritative Nexgen brand variables, sourced directly from `app/globals.css`:

```css
/* ===== NEXGEN BRAND CSS VARIABLES ===== */

:root {
  /* Core Brand Colors — Light Theme (Default) */
  --electric-cyan: #00b2a9;
  --electric-cyan-dim: rgba(0, 243, 189, 0.6);
  --electric-cyan-soft: #c2fff1;
  --electric-cyan-mid: #00c99d;
  --electric-cyan-strong: #006e56;
  --electric-cyan-deep: #004a3a;
  --electric-cyan-grid: rgba(0, 243, 189, 0.1);
  --electric-cyan-grid-fine: rgba(0, 243, 189, 0.05);
  --electric-cyan-glow-subtle: rgba(0, 243, 189, 0.5);
  --electric-cyan-border-glow: rgba(0, 243, 189, 0.3);
  --electric-cyan-border-inset: rgba(0, 243, 189, 0.1);
  --deep-slate: #f8fafc;
  --deep-black: #020617;
  --pylon-grey: #e2e8f0;
  --slate-dark: #f1f5f9;
  --amber-warning: #d97706;

  /* Semantic — Light Theme */
  --background: oklch(0.985 0.002 240);
  --foreground: oklch(53.736% 0.00125 199.806);
  --primary: #006e56;
  --primary-foreground: #ffffff;
  --accent: #c2fff1;
  --accent-foreground: #004a3a;
  --ring: #009b79;
  --radius: 0.25rem;

  /* Typography */
  --font-sans: var(--font-inter), "Inter", system-ui, sans-serif;
  --font-mono: var(--font-ibm-plex-mono), "IBM Plex Mono", monospace;

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

/* ===== DARK THEME ===== */
.dark {
  --electric-cyan: #00f3bd;
  --electric-cyan-soft: #8dffe3;
  --electric-cyan-mid: #00c99d;
  --electric-cyan-strong: #006e56;
  --electric-cyan-deep: #002b22;
  --electric-cyan-grid: rgba(0, 243, 189, 0.14);
  --electric-cyan-grid-fine: rgba(0, 243, 189, 0.07);
  --electric-cyan-glow-subtle: rgba(0, 243, 189, 0.55);
  --electric-cyan-border-glow: rgba(0, 243, 189, 0.4);
  --electric-cyan-border-inset: rgba(0, 243, 189, 0.16);
  --deep-slate: #020617;
  --deep-black: #020617;
  --pylon-grey: #1e293b;
  --slate-dark: #0f172a;
  --amber-warning: #f59e0b;

  --background: oklch(0.024 0.006 285.885);
  --foreground: oklch(0.985 0 0);
  --primary: #00f3bd;
  --primary-foreground: #00241d;
  --accent: #00c99d;
  --accent-foreground: #001a14;
}
```

### Tailwind Config Reference

```javascript
// tailwind.config.js — Nexgen brand extension
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "var(--electric-cyan)",
          "cyan-strong": "var(--electric-cyan-strong)",
          "cyan-deep": "var(--electric-cyan-deep)",
          "cyan-soft": "var(--electric-cyan-soft)",
          "cyan-mid": "var(--electric-cyan-mid)",
          amber: "var(--amber-warning)",
        },
        surface: {
          base: "var(--deep-slate)",
          card: "var(--pylon-grey)",
          raised: "var(--slate-dark)",
          dark: "var(--deep-black)",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
    },
  },
};
```

### Key Utility Classes (from globals.css)

| Class | Effect | Use for |
|---|---|---|
| `.blueprint-grid` | 40px cyan grid overlay | Dark hero sections, diagram backgrounds |
| `.blueprint-grid-fine` | 10px fine cyan grid | Technical content backgrounds |
| `.text-glow` | Triple-shadow cyan glow | Dark-bg display headings, bold dark-section statements |
| `.text-glow-subtle` | Soft 5px cyan glow | Accent labels on dark backgrounds |
| `.border-electric` | Cyan border + inset/outer glow | Active card borders, selected states |
| `.industrial-label` | Mono, 10px, 0.3em tracking, uppercase | Certification badges, spec tags, part numbers |
| `.animate-glow-hum` | 2s breathing glow animation | Live-status indicators, active circuit elements |
| `.section-fluid` | Fluid padding via `clamp(3rem, 8vh, 10rem)` | Standard section wrapper |
| `.section-content` | `max-w-[80rem]` + responsive gutters | Standard content container |

---

## Image Generation Guidelines

This section is consumed by the `nano-banana-images` skill and any AI image generation tool producing Nexgen-branded photography. All generated images must comply with these directives before use.

### Style Directives

**People and workers:**
- All workers on site must wear full PPE: high-visibility vest (yellow/orange), hard hat (white or yellow), safety boots, where applicable gloves
- Staff should appear confident, skilled, and professional — not casual or unqualified
- No unsafe postures, no bypassed safety equipment, no improvised tools
- Team portraits may be less formal but must still convey competence and pride

**Environments:**
- Clean, organised, professional electrical installations — think finished commercial fit-outs, neat domestic consumer units, tidy cable management
- Environments should be bright and well-maintained — NOT dark, messy, or chaotic job sites
- Acceptable environments: office fit-outs, domestic properties (London terrace/flat), commercial units, clean warehouse/industrial space, outdoor substation work in daylight
- Avoid: cluttered utility corridors, unsafe scaffolding, disorganised storage rooms

**Lighting:**
- Bright, natural daylight preferred where context allows
- Well-lit indoor environments — no dramatic shadows or moody low-key lighting in most contexts
- Exception: dark theme hero images may use controlled, dramatic lighting for visual impact, but must remain professional, not gritty

**Mood:**
- Confident, competent, trustworthy — the Nexgen team is experienced and takes pride in their work
- No gritty or grimy industrial aesthetic
- No overly corporate or stock-photo stiffness — aim for authentic professionalism

**Colour grading:**
- Slightly cool-neutral or natural colour grading — consistent with the teal/cyan brand palette
- Avoid heavy warm filters, orange film emulation, or high-contrast moody edits
- Light, airy treatment for residential contexts; clean and crisp for commercial

**What to avoid:**
- Visible safety violations (missing PPE, unsafe ladder usage, unguarded live work)
- Dirty, disorganised workspaces presented as representative of Nexgen
- Stock-photo clichés (overly posed smiling workers, generic office handshake shots)
- Dark, moody aesthetics unless explicitly in a dark-theme hero context

### Camera Defaults for Nexgen

These are the recommended camera simulation parameters for AI image generation prompts:

**Portrait — Team and Headshots:**
- Focal length: 85mm equivalent
- Aperture: f/2.0 (soft background separation)
- ISO: 200 (clean, low-noise)
- Lighting: Warm natural window light or softbox; light background or branded backdrop
- Colour: Neutral to slightly warm
- Use for: Director profiles, team page, staff spotlights

**Site / Installation Photography:**
- Focal length: 24–35mm wide angle
- Aperture: f/5.6 (deep field, environment in context)
- ISO: 400 (indoor site lighting)
- Lighting: Bright interior or exterior daylight
- Colour: Clean, cool-neutral
- Use for: Project showcase, case studies, before/after documentation

**Product / Equipment Close-Up:**
- Focal length: 100mm macro equivalent
- Aperture: f/4.0 (subject sharp, background soft)
- ISO: 200
- Background: Clean white, light grey, or very light `#f8fafc`
- Lighting: Even studio light
- Use for: Consumer unit showcase, cable management detail, smart home device, EV charger close-up

**Marketing / Social Composite:**
- Focal length: 35–50mm
- Aperture: f/4.0–f/5.6
- ISO: 200–400
- Lighting: Bright lifestyle lighting — outdoor, natural, aspirational
- Use for: Residential campaigns, social media awareness, local advertising

### Logo Overlay Rules

When placing the Nexgen logo on generated images:

- **Position:** Always bottom-right corner
- **Size:** 80–100px wide (equivalent; at standard 1:1 or 4:5 social ratio)
- **Logo choice:** Use `nexgen-transparent-banner.png` (or `nexgen-logo-full.png` on light backgrounds)
- **Light logo on dark/photographic backgrounds:** Ensure minimum clearance of 16px from edges
- **Avoid placing logo over complex, high-contrast detail** — use a subtle dark scrim (15–20% opacity dark gradient bottom-right) if background is too busy
- **Never** resize the logo below 80px wide or alter its proportions

### Output Routing for Nexgen Images

Use these paths when saving AI-generated and sourced images to the project:

```
Team / staff headshots      → images/nexgen/team/[name-slug]-[YYYY-MM-DD].jpg
Site / project photos       → images/nexgen/projects/[project-slug]-[YYYY-MM-DD].jpg
Marketing / social          → images/nexgen/marketing/[subject-slug]-[YYYY-MM-DD].jpg
Brand library (curated)     → images/nexgen/brand/[subject-slug]-[YYYY-MM-DD].jpg
```

**Naming convention examples:**
```
images/nexgen/team/richard-barber-2026-04-30.jpg
images/nexgen/team/gavin-little-2026-04-30.jpg
images/nexgen/projects/commercial-fit-out-canary-wharf-2026-04-30.jpg
images/nexgen/marketing/ev-charger-residential-2026-04-30.jpg
images/nexgen/brand/niceic-badge-context-2026-04-30.jpg
```

---

## Content Voice and Tone

### Brand Voice

- **Authoritative but approachable** — Deep expertise, communicated plainly. No jargon for its own sake.
- **Direct and accountable** — No hedging. Nexgen makes commitments and delivers on them.
- **Community-aware** — The company serves real people in real places. Warmth and local pride are appropriate.
- **Safety-conscious** — Safety is never minimised or treated as a checkbox. It is a genuine value.
- **Proud without arrogance** — A decade of proven work earns confidence; that confidence is conveyed through facts and results, not boasting.

### Messaging Pillars

1. **NICEIC Approved — Compliance by Default** — Not a bonus; the baseline. Clients can rely on every installation meeting or exceeding regulation.
2. **London and South East — Local Expertise** — Deep familiarity with the region, its housing stock, its commercial property types, and its building regulations.
3. **Precision Engineering** — Every circuit, every connection, executed to exacting standards.
4. **Trusted Partnership** — Long-term client relationships built on transparency, reliability, and consistent delivery.
5. **Community Investment** — Apprenticeships, local sponsorships, charitable electrical services — Nexgen gives back to the communities it powers.

### Tone Examples

**Too formal / corporate:**
> "Nexgen Electrical Innovations leverages accredited competency frameworks to actualise compliant infrastructure solutions across the residential and commercial sectors."

**Too casual:**
> "We sort your electrics, sorted. Hit us up!"

**Right tone:**
> "NICEIC Approved electricians covering London and the South East. From a single circuit to a full commercial fit-out — every job done right, every time."

---

## Quality Checklist

Use this checklist before approving any Nexgen brand asset:

- [ ] **Theme:** Light theme default; dark theme only for hero sections, photographic overlays, or digital campaigns
- [ ] **Cyan usage:** Accent only on light theme (buttons, icon highlights, one heading keyword); more liberal on dark theme
- [ ] **Amber CTA:** Present and prominent for primary conversion actions; not overused
- [ ] **Logo:** Correct variant selected for background; minimum size respected; clear space maintained
- [ ] **NICEIC badge:** Visible in footer, proposals, certificates, and where trust is being established
- [ ] **Typography:** Inter for all display and body; IBM Plex Mono for specification labels and certifications
- [ ] **Contrast:** All body text meets WCAG AA (4.5:1); large headings meet WCAG AA (3:1 minimum)
- [ ] **Border radius:** Low (`0.25rem` default) — never pill shapes for primary UI elements
- [ ] **Photography:** Real or realistic; PPE present; professional environments; correct camera defaults applied
- [ ] **Voice:** Direct, accountable, community-aware — no jargon, no boasting, no hedging
- [ ] **No clutter:** Light-theme layouts must breathe; generous whitespace is non-negotiable
- [ ] **Blueprint grid:** Used only on dark sections as a considered design choice, not applied indiscriminately
- [ ] **Reduced motion:** All animations respect `prefers-reduced-motion` (already implemented in globals.css)

---

## Version History

| Date | Version | Changes |
|---|---|---|
| 2026-04-30 | 1.0 | Initial Nexgen Electrical Innovations brand guidelines. Light theme primary. Color palette sourced from globals.css. Four logo variants documented. Image generation guidelines for nano-banana-images skill. |

---

## Reference Files

**Brand Assets Location:** `brand-assets/` (logos and reference images)

**CSS Variables Source:** `app/globals.css` — authoritative; this document reflects its values

**Company Data Source:** `data/about/index.ts` — company name, directors, certifications, values

**Skill Reference:** `.claude/skills/nano-banana-images/` (image generation with Nexgen brand support)

**Template Reference:** `brand-assets/example/adu-dev-brand-guidelines.md` (structural template this document follows)
