# Emergency Response Page Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 2 vague profile sections in `data/services/emergency.ts` with 3 domain-specific SectionProfile sections (residential, commercial, industrial), each with 4 highlights, bio, quote, credentials, placeholder image, and CTA.

**Architecture:** Data-only change — no new components, no type changes, no new files. The SectionProfile component and SectionProfileData type already support all required fields. Placeholder images are real project images; swap only `image.src` when van branding photos arrive.

**Tech Stack:** TypeScript, Next.js 16, Vitest (tests), Playwright (visual verification)

**Branch:** `feat/emergency-response-enrichment`
**Spec:** `docs/superpowers/specs/2026-05-12-emergency-response-enrichment-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `data/services/__tests__/emergency.test.ts` | Modify | Add profile section assertions (TDD — write first) |
| `data/services/emergency.ts` | Modify | Replace sections[0] and sections[3] with 3 domain profile sections |

---

## Task 1: Extend the test file (TDD — write failing tests first)

**Files:**
- Modify: `data/services/__tests__/emergency.test.ts`

The existing test file checks features sections. We add a new describe block that asserts
the three domain-specific profile sections exist with proper structure. These tests will
FAIL until Task 2 is complete — that is the intent.

- [ ] **Step 1.1: Read the current test file**

```bash
cat data/services/__tests__/emergency.test.ts
```

Expected: Shows the existing `SectionFeaturesData entries` describe block (3 tests). No profile section tests exist yet.

- [ ] **Step 1.2: Add profile section assertions to the test file**

Open `data/services/__tests__/emergency.test.ts` and **append** this describe block after the existing one (do not replace anything):

```typescript
import { describe, it, expect } from 'vitest';
import { emergencyPageData } from '../emergency';
import type { SectionFeaturesData, SectionProfileData } from '@/types/sections';

describe('emergency page data — SectionFeaturesData entries', () => {
  const featureSections = emergencyPageData.sections
    .filter((s) => s.type === 'features')
    .map((s) => s.data as SectionFeaturesData);

  it('has exactly 2 features sections', () => {
    expect(featureSections.length).toBe(2);
  });

  it('every features section has a non-empty checklist', () => {
    featureSections.forEach((data) => {
      expect(data.checklist).toBeDefined();
      expect(data.checklist!.length).toBeGreaterThan(0);
    });
  });

  it('every features section has non-empty partners', () => {
    featureSections.forEach((data) => {
      expect(data.partners).toBeDefined();
      expect(data.partners!.length).toBeGreaterThan(0);
    });
  });
});

describe('emergency page data — SectionProfileData entries', () => {
  const profileSections = emergencyPageData.sections
    .filter((s) => s.type === 'profile')
    .map((s) => s.data as SectionProfileData);

  it('has exactly 3 profile sections', () => {
    expect(profileSections.length).toBe(3);
  });

  it('profile sections cover residential, commercial, and industrial domains', () => {
    const sectionIds = profileSections.map((s) => s.sectionId);
    expect(sectionIds).toContain('residential-emergency');
    expect(sectionIds).toContain('commercial-emergency');
    expect(sectionIds).toContain('industrial-emergency');
  });

  it('every profile section has exactly 4 highlights', () => {
    profileSections.forEach((data) => {
      expect(data.highlights).toBeDefined();
      expect(data.highlights!.length).toBe(4);
    });
  });

  it('every highlight has a non-empty icon, title, and description', () => {
    profileSections.forEach((data) => {
      data.highlights!.forEach((h) => {
        expect(h.icon).toBeTruthy();
        expect(h.title.length).toBeGreaterThan(0);
        expect(h.description.length).toBeGreaterThan(0);
      });
    });
  });

  it('every profile section has a 2-paragraph bio', () => {
    profileSections.forEach((data) => {
      expect(data.bio.length).toBe(2);
      data.bio.forEach((p) => expect(p.length).toBeGreaterThan(0));
    });
  });

  it('every profile section has a quote', () => {
    profileSections.forEach((data) => {
      expect(data.quote).toBeTruthy();
    });
  });

  it('every profile section has a cta', () => {
    profileSections.forEach((data) => {
      expect(data.cta).toBeDefined();
      expect(data.cta!.label.length).toBeGreaterThan(0);
      expect(data.cta!.href.length).toBeGreaterThan(0);
    });
  });

  it('commercial section is reversed, others are not', () => {
    const commercial = profileSections.find((s) => s.sectionId === 'commercial-emergency');
    const residential = profileSections.find((s) => s.sectionId === 'residential-emergency');
    const industrial = profileSections.find((s) => s.sectionId === 'industrial-emergency');
    expect(commercial?.reversed).toBe(true);
    expect(residential?.reversed).toBeFalsy();
    expect(industrial?.reversed).toBeFalsy();
  });
});
```

Note: Replace the **entire file** with the content above (it includes the original tests).

- [ ] **Step 1.3: Run the new tests — verify they FAIL**

```bash
pnpm test data/services/__tests__/emergency.test.ts
```

Expected output: 3 original tests PASS, new profile tests FAIL:
```
✓ has exactly 2 features sections
✓ every features section has a non-empty checklist
✓ every features section has non-empty partners
✗ has exactly 3 profile sections — Expected 3, received 2
✗ profile sections cover residential, commercial, and industrial domains
✗ every profile section has exactly 4 highlights
...
```

If ALL tests pass, the data already has the right shape — skip to Task 3.
If the features tests fail, stop and investigate before proceeding.

---

## Task 2: Replace emergency.ts sections array

**Files:**
- Modify: `data/services/emergency.ts`

Replace the entire `sections` array with the 6-section version below.
Sections 1–3 are new domain-specific profiles. Sections 4–6 are the existing
features + CTA sections copied verbatim from the current file.

- [ ] **Step 2.1: Replace the sections array**

In `data/services/emergency.ts`, find and replace the entire `sections: [...]` array
(from `sections: [` to the matching closing `],`) with:

```typescript
  sections: [
    {
      type: "profile",
      data: {
        sectionId: "residential-emergency",
        label: "Home & Property",
        name: "Residential Emergency Callouts",
        title: "Fast, Safe Electrical Response for Homeowners",
        credentials: [
          "Consumer Unit Failures",
          "Electrical Fire Risk",
          "After-Hours Response",
          "Power Loss Investigation",
        ],
        bio: [
          "Whether it's a total power loss at midnight or a tripped board that won't reset, our residential emergency team provides rapid, professional response across Berkshire, Surrey, and the surrounding counties. We cover single-property faults, multi-unit blocks, and managed residential estates — arriving with the diagnostic equipment and common parts to identify and resolve most faults on a first visit.",
          "Our engineers are NICEIC-accredited and trained to work safely under pressure. We carry standard parts — consumer units, RCDs, MCBs, SPDs — so the most common residential faults are resolved same-visit, without waiting for a return appointment.",
        ],
        highlights: [
          {
            icon: "Clock" as const,
            title: "2-Hour Response",
            description: "Most residential callouts attended within 2 hours, including evenings and weekends.",
          },
          {
            icon: "AlertTriangle" as const,
            title: "Consumer Unit Failures",
            description: "Immediate diagnosis and safe isolation of faulty boards, RCDs, and MCBs.",
          },
          {
            icon: "Shield" as const,
            title: "Electrical Fire Risk",
            description: "Rapid fault finding to eliminate arc faults, overloads, and potential fire hazards.",
          },
          {
            icon: "Phone" as const,
            title: "24/7 Availability",
            description: "Night, weekend, and bank holiday cover — with no premium out-of-hours surcharge.",
          },
        ],
        quote:
          "When your home goes dark, you need someone who responds fast and gets it right the first time.",
        quoteAttribution: "NexGen Emergency Response Team",
        image: {
          src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-nest-thermostat-smart-heating.jpg",
          alt: "Nexgen residential emergency electrical response — placeholder",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: false,
        cta: { label: "Call Emergency Line", href: "/contact" },
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "commercial-emergency",
        label: "Business & Retail",
        name: "Commercial Emergency Callouts",
        title: "Protecting Business Operations When It Matters Most",
        credentials: [
          "Business Continuity",
          "Switchgear & Panel Restoration",
          "Compliance Emergencies",
          "Retail & Hospitality",
        ],
        bio: [
          "Electrical failures in commercial premises don't just cause inconvenience — they cost revenue, can breach licensing conditions, and may trigger immediate closure notices. Our commercial emergency service is built around business continuity. From a failed distribution board in a retail unit to a total site outage at a hotel, we arrive prepared to diagnose and restore power efficiently.",
          "We stock commercial-grade parts on our vehicles — breakers, busbars, isolation switches, and cable — so the most common commercial faults are resolved without ordering delays. For complex installations, we coordinate with your facilities manager and maintain full compliance documentation throughout.",
        ],
        highlights: [
          {
            icon: "Building2" as const,
            title: "Business Continuity",
            description: "Priority commercial response focused on restoring trading capability as fast as possible.",
          },
          {
            icon: "Zap" as const,
            title: "Switchgear Failures",
            description: "Emergency restoration of distribution boards, panels, and switchroom equipment.",
          },
          {
            icon: "ClipboardCheck" as const,
            title: "Compliance Emergencies",
            description: "Urgent remedial works and EICR investigations following fault or inspection failure.",
          },
          {
            icon: "Users" as const,
            title: "Sector Experience",
            description: "Retail, hospitality, offices, healthcare, and licensed premises all covered.",
          },
        ],
        quote:
          "A power failure costs far more than the repair. We know that — and our commercial response is built around speed and precision.",
        quoteAttribution: "NexGen Commercial Emergency Team",
        image: {
          src: "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
          alt: "Nexgen commercial emergency electrical response — placeholder",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: true,
        cta: { label: "Commercial Emergency Support", href: "/contact" },
      },
    },
    {
      type: "profile",
      data: {
        sectionId: "industrial-emergency",
        label: "Industrial & Manufacturing",
        name: "Industrial Emergency Callouts",
        title: "Critical Infrastructure Response for Industrial Facilities",
        credentials: [
          "Production Line Recovery",
          "High-Voltage Support",
          "Motor & Drive Failures",
          "Site-Wide Coordination",
        ],
        bio: [
          "For industrial sites, electrical downtime translates directly to production loss — often measured in thousands per hour. Our industrial emergency team is trained to work on complex, high-voltage installations including switchrooms, substations, motor control centres, and variable speed drive systems. We carry certified HV engineers and the specialist test equipment required for large-site diagnostics.",
          "We work alongside your in-house maintenance and engineering teams, integrating with existing LOTO procedures and site safety protocols. Our engineers understand the operational pressure to restore production — and the non-negotiable requirement to do so safely and correctly.",
        ],
        highlights: [
          {
            icon: "Activity" as const,
            title: "Production Line Recovery",
            description: "Critical electrical systems restored with focus on minimising production downtime.",
          },
          {
            icon: "Gauge" as const,
            title: "High-Voltage Support",
            description: "Certified HV engineers for substation, switchroom, and LV/HV interface emergencies.",
          },
          {
            icon: "Settings" as const,
            title: "Motor & Drive Failures",
            description: "Emergency diagnosis of VSD, motor control, and MCC panel faults under operational pressure.",
          },
          {
            icon: "MapPin" as const,
            title: "Site-Wide Coordination",
            description: "Coordinated emergency response for large facilities with multiple distribution points.",
          },
        ],
        quote:
          "Industrial downtime is measured in thousands per hour. Our engineers are trained to move fast — and to get it right every time.",
        quoteAttribution: "NexGen Industrial Emergency Team",
        image: {
          src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg",
          alt: "Nexgen industrial emergency electrical response — placeholder",
          priority: false,
        },
        imageAspect: "landscape" as const,
        reversed: false,
        cta: { label: "Industrial Emergency Line", href: "/contact" },
      },
    },
    {
      type: "features",
      data: {
        sectionId: "services",
        label: "Emergency Services",
        headline: "What We Handle",
        headlineHighlight: "Handle",
        description:
          "Our emergency team is equipped to diagnose and resolve the full spectrum of electrical emergencies.",
        pillars: [
          {
            icon: "AlertTriangle",
            title: "Power Failures",
            description:
              "Complete outages, partial failures, and intermittent power problems diagnosed and fixed fast.",
            highlight: true,
          },
          {
            icon: "Zap",
            title: "Tripping Circuits",
            description:
              "Persistent RCD trips, MCB failures, and nuisance tripping investigated and resolved.",
            highlight: false,
          },
          {
            icon: "Shield",
            title: "Dangerous Faults",
            description:
              "Burning smells, sparking, hot sockets, and exposed wiring made safe immediately.",
            highlight: false,
          },
          {
            icon: "Battery",
            title: "Equipment Failures",
            description:
              "Consumer unit failures, meter problems, and main fuse issues requiring urgent attention.",
            highlight: false,
          },
        ],
        checklist: [
          "Response within 60 minutes of your call",
          "24/7 availability including weekends and bank holidays",
          "No call-out fee — transparent, fixed-price emergency rates",
          "Fully equipped vans for first-visit resolution",
          "NICEIC certified for all emergency works",
          "Written report provided after every callout",
        ],
        partners: [
          { name: "NICEIC", abbr: "NIC" },
          { name: "Part P", abbr: "P.P" },
          { name: "NAPIT", abbr: "NAP" },
          { name: "ECS Gold", abbr: "ECS" },
          { name: "CHAS", abbr: "CHA" },
          { name: "ISO 9001", abbr: "ISO" },
        ],
      },
    },
    {
      type: "features",
      data: {
        sectionId: "sectors",
        label: "All Sectors Covered",
        headline: "Emergency Support for Every Sector",
        headlineHighlight: "Every Sector",
        description:
          "Whether you're a homeowner, business owner, or facility manager — we're here when you need us.",
        pillars: [
          {
            icon: "Building2",
            title: "Commercial",
            description:
              "Offices, retail, hospitality — we understand the cost of commercial downtime.",
            highlight: false,
          },
          {
            icon: "Factory",
            title: "Industrial",
            description:
              "Factories, warehouses, processing plants — rapid response to minimize production losses.",
            highlight: true,
          },
          {
            icon: "Home",
            title: "Residential",
            description:
              "Homes, flats, rental properties — keeping families safe around the clock.",
            highlight: false,
          },
          {
            icon: "Users",
            title: "Public Sector",
            description:
              "Schools, hospitals, council buildings — priority response for critical infrastructure.",
            highlight: false,
          },
        ],
        checklist: [
          "Specialist response for residential, commercial, and industrial sites",
          "Priority dispatch for critical infrastructure and public sector",
          "All work fully insured and liability-covered across all sectors",
          "Compliance documentation and certification issued after every job",
          "Follow-up visit and fault prevention report included",
          "Insurance-accepted emergency certification provided",
        ],
        partners: [
          { name: "NICEIC", abbr: "NIC" },
          { name: "Part P", abbr: "P.P" },
          { name: "NAPIT", abbr: "NAP" },
          { name: "ECS Gold", abbr: "ECS" },
          { name: "CHAS", abbr: "CHA" },
          { name: "ISO 9001", abbr: "ISO" },
        ],
        background: "dark",
      },
    },
    {
      type: "cta",
      data: {
        sectionId: "contact",
        finalCTA: {
          label: "Electrical Emergency?",
          headline: "Call Us Now",
          headlineHighlight: "Now",
          description:
            "Don't wait. Our emergency team is standing by 24/7 to take your call and dispatch help immediately.",
          primaryCTA: { label: "Emergency Callout", href: "tel:+442012345678" },
          secondaryCTA: { label: "Send Details", href: "/contact" },
        },
      },
    },
  ],
```

---

## Task 3: Run tests — all must pass

**Files:** No changes in this task.

- [ ] **Step 3.1: Run the emergency data tests**

```bash
pnpm test data/services/__tests__/emergency.test.ts
```

Expected: All 11 tests PASS (3 original features tests + 8 new profile tests):
```
✓ has exactly 2 features sections
✓ every features section has a non-empty checklist
✓ every features section has non-empty partners
✓ has exactly 3 profile sections
✓ profile sections cover residential, commercial, and industrial domains
✓ every profile section has exactly 4 highlights
✓ every highlight has a non-empty icon, title, and description
✓ every profile section has a 2-paragraph bio
✓ every profile section has a quote
✓ every profile section has a cta
✓ commercial section is reversed, others are not
```

If any test fails, fix `data/services/emergency.ts` before proceeding.

- [ ] **Step 3.2: Run the full test suite — confirm no regressions**

```bash
pnpm test
```

Expected: All pre-existing tests still pass. Total count may increase by 8 (new profile tests).
If any previously-passing test now fails, investigate before proceeding.

---

## Task 4: TypeScript + build verification

**Files:** No changes in this task.

- [ ] **Step 4.1: TypeScript strict check**

```bash
pnpm typecheck
```

Expected: Exit 0, zero errors. If errors appear:
- `Type '"ClipboardCheck"' is not assignable to type 'IconName'` — check `components/shared/icon-map.tsx` and use the correct name
- `Property 'imageAspect' does not exist` — verify `SectionProfileData` in `types/sections.ts` has the field
- `Property 'quoteAttribution' does not exist` — same check

- [ ] **Step 4.2: Production build**

```bash
pnpm build
```

Expected: Successful build, **84 static pages** (count unchanged — the emergency page already existed).
If page count drops, a data shape error caused the page to fail generation — check typecheck output first.

---

## Task 5: Playwright visual verification

**Files:** No changes in this task.

Assumes dev server is running on port 3000 (`pnpm dev` in a separate terminal).

- [ ] **Step 5.1: Navigate to the emergency page**

```bash
PLAYWRIGHT_REUSE_SERVER=true npx playwright test --headed --grep "emergency" 2>/dev/null || echo "No emergency playwright spec — run manual check"
```

If no Playwright spec exists, perform a manual browser check:
Open `http://localhost:3000/services/emergency` and verify:

1. **3 profile sections visible** — scroll down past the hero/intro. Three `SectionProfile` blocks
   should appear before the "What We Handle" features block.
2. **Residential section** — label "Home & Property", 4 highlight cards, quote block, "Call Emergency Line" CTA
3. **Commercial section** — label "Business & Retail", image on RIGHT (reversed layout), 4 highlight cards, "Commercial Emergency Support" CTA
4. **Industrial section** — label "Industrial & Manufacturing", 4 highlight cards, "Industrial Emergency Line" CTA
5. **Placeholder images** — each section shows a real project image (not broken)
6. **"What We Handle" features** — still present below the 3 profiles
7. **"All Sectors Covered" features** — dark background, still present
8. **CTA block** — "Electrical Emergency?" at bottom, still present

- [ ] **Step 5.2: Check responsive layout**

Resize browser to 768px width (tablet). Verify:
- Each profile section stacks (image above text or text above image)
- Highlights grid switches to 2 columns

Resize to 375px (mobile). Verify:
- Highlights grid switches to 1 column
- No horizontal overflow

- [ ] **Step 5.3: Check dark mode**

Toggle dark mode in browser dev tools or via the site's theme switch. Verify:
- Profile section backgrounds render correctly
- Quote block border visible
- CTA buttons readable

---

## Task 6: Commit and push

- [ ] **Step 6.1: Stage changed files**

```bash
git add data/services/emergency.ts data/services/__tests__/emergency.test.ts docs/superpowers/specs/2026-05-12-emergency-response-enrichment-design.md docs/superpowers/plans/2026-05-12-emergency-response-enrichment.md
```

- [ ] **Step 6.2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: emergency response page — residential, commercial, industrial domain sections

Replace 2 generic profile sections with 3 domain-specific SectionProfile sections.
Each section has 4 highlights, bio, quote, credentials, placeholder image, and CTA.
Placeholder images to be swapped for van branding photos when available.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6.3: Push**

```bash
git push
```

- [ ] **Step 6.4: Confirm on GitHub**

Visit the branch on GitHub and confirm the commit appears:
`https://github.com/Herman-Adu/nexgen-electrical-innovations/tree/feat/emergency-response-enrichment`

---

## Verification Checklist (before raising PR)

- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm build` — 84 static pages
- [ ] `pnpm test` — all tests pass (no regressions)
- [ ] `/services/emergency` — 3 profile sections, each with 4 highlight cards
- [ ] Commercial section — image appears on right (reversed)
- [ ] Mobile — highlights grid is single column
- [ ] Dark mode — renders correctly
- [ ] Placeholder images — all 3 load without 404
- [ ] CTA buttons — correct labels and `/contact` hrefs

---

## Post-Implementation: Image Swap Guide

When van branding photos arrive, update only these 3 lines in `data/services/emergency.ts`:

```typescript
// Residential — line ~53
src: "/images/services/emergency-residential-van.jpg",

// Commercial — line ~103
src: "/images/services/emergency-commercial-van.jpg",

// Industrial — line ~153
src: "/images/services/emergency-industrial-van.jpg",
```

No component, type, or test changes needed for the image swap.
