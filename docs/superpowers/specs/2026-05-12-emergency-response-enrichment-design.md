---
title: Emergency Response Page Enrichment — Design Spec
description: Replace 2 vague profile sections with 3 domain-specific SectionProfile sections (residential, commercial, industrial) each with 4 highlights, bio, quote, credentials, and placeholder images
category: specs
status: active
last-updated: 2026-05-12
---

# Emergency Response Page Enrichment

## Goal

Bring `/services/emergency` to the same standard as the completed service pages
(residential, commercial, industrial) by replacing the 2 incomplete profile sections
with 3 domain-specific profile sections — one per service domain — each with:
- 4 `highlights` (icon + title + description)
- 2-paragraph `bio`
- `quote` + `quoteAttribution`
- `credentials` badges
- `cta` button
- Placeholder `image` (van branding photos to be swapped in when ready)
- `imageAspect: "landscape"`

No component changes. This is a **data-only update** to `data/services/emergency.ts`.

---

## Current State

`data/services/emergency.ts` — 5 sections:
1. Profile "Rapid Emergency Callout" — **no highlights, generic image**
2. Features "What We Handle"
3. Features "All Sectors Covered" (dark bg)
4. Profile "Fast & Accurate Fault Finding" — **no highlights, reversed, generic image**
5. CTA "Electrical Emergency?"

Both profile sections use generic images (`/images/services-emergency.jpg`,
`/images/system-diagnostics.jpg`) and lack the `highlights` grid that defines the
enriched service page pattern established in PR #163.

---

## Target State

6 sections total:
1. **Profile** — "Residential Emergency Callouts" ← replaces section 1
2. **Profile** — "Commercial Emergency Callouts" ← replaces section 4 (reversed)
3. **Profile** — "Industrial Emergency Callouts" ← new third domain section
4. **Features** — "What We Handle" (keep as-is)
5. **Features** — "All Sectors Covered" (keep as-is, dark bg)
6. **CTA** — "Electrical Emergency?" (keep as-is)

Ordering places the 3 domain profiles first as the primary narrative, followed by
the features sections that reinforce with detail, then the CTA.

---

## Section 1 — Residential Emergency Callouts

```typescript
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
        icon: "Clock",
        title: "2-Hour Response",
        description: "Most residential callouts attended within 2 hours, including evenings and weekends.",
      },
      {
        icon: "AlertTriangle",
        title: "Consumer Unit Failures",
        description: "Immediate diagnosis and safe isolation of faulty boards, RCDs, and MCBs.",
      },
      {
        icon: "Shield",
        title: "Electrical Fire Risk",
        description: "Rapid fault finding to eliminate arc faults, overloads, and potential fire hazards.",
      },
      {
        icon: "Phone",
        title: "24/7 Availability",
        description: "Night, weekend, and bank holiday cover — with no premium out-of-hours surcharge.",
      },
    ],
    quote: "When your home goes dark, you need someone who responds fast and gets it right the first time.",
    quoteAttribution: "NexGen Emergency Response Team",
    image: {
      src: "/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-nest-thermostat-smart-heating.jpg",
      alt: "Nexgen residential emergency electrical response — placeholder",
      priority: false,
    },
    imageAspect: "landscape",
    reversed: false,
    cta: { label: "Call Emergency Line", href: "/contact" },
  },
},
```

---

## Section 2 — Commercial Emergency Callouts

```typescript
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
        icon: "Building2",
        title: "Business Continuity",
        description: "Priority commercial response focused on restoring trading capability as fast as possible.",
      },
      {
        icon: "Zap",
        title: "Switchgear Failures",
        description: "Emergency restoration of distribution boards, panels, and switchroom equipment.",
      },
      {
        icon: "ClipboardCheck",
        title: "Compliance Emergencies",
        description: "Urgent remedial works and EICR investigations following fault or inspection failure.",
      },
      {
        icon: "Users",
        title: "Sector Experience",
        description: "Retail, hospitality, offices, healthcare, and licensed premises all covered.",
      },
    ],
    quote: "A power failure costs far more than the repair. We know that — and our commercial response is built around speed and precision.",
    quoteAttribution: "NexGen Commercial Emergency Team",
    image: {
      src: "/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg",
      alt: "Nexgen commercial emergency electrical response — placeholder",
      priority: false,
    },
    imageAspect: "landscape",
    reversed: true,
    cta: { label: "Commercial Emergency Support", href: "/contact" },
  },
},
```

---

## Section 3 — Industrial Emergency Callouts

```typescript
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
        icon: "Activity",
        title: "Production Line Recovery",
        description: "Critical electrical systems restored with focus on minimising production downtime.",
      },
      {
        icon: "Gauge",
        title: "High-Voltage Support",
        description: "Certified HV engineers for substation, switchroom, and LV/HV interface emergencies.",
      },
      {
        icon: "Settings",
        title: "Motor & Drive Failures",
        description: "Emergency diagnosis of VSD, motor control, and MCC panel faults under operational pressure.",
      },
      {
        icon: "MapPin",
        title: "Site-Wide Coordination",
        description: "Coordinated emergency response for large facilities with multiple distribution points.",
      },
    ],
    quote: "Industrial downtime is measured in thousands per hour. Our engineers are trained to move fast — and to get it right every time.",
    quoteAttribution: "NexGen Industrial Emergency Team",
    image: {
      src: "/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg",
      alt: "Nexgen industrial emergency electrical response — placeholder",
      priority: false,
    },
    imageAspect: "landscape",
    reversed: false,
    cta: { label: "Industrial Emergency Line", href: "/contact" },
  },
},
```

---

## Sections 4–6 — Unchanged

Keep existing sections verbatim:
- Features "What We Handle" (`sectionId: "services"`)
- Features "All Sectors Covered" (`sectionId: "sectors"`, `background: "dark"`)
- CTA "Electrical Emergency?" (`sectionId: "contact"`)

---

## Icon Verification

All icons confirmed present in `components/shared/icon-map.tsx`:

| Section | Icon | Confirmed |
|---------|------|-----------|
| Residential | Clock | ✅ |
| Residential | AlertTriangle | ✅ |
| Residential | Shield | ✅ |
| Residential | Phone | ✅ |
| Commercial | Building2 | ✅ |
| Commercial | Zap | ✅ |
| Commercial | ClipboardCheck | ✅ |
| Commercial | Users | ✅ |
| Industrial | Activity | ✅ |
| Industrial | Gauge | ✅ |
| Industrial | Settings | ✅ |
| Industrial | MapPin | ✅ |

---

## Placeholder Images

Images are real project photos used as placeholders. Swap paths when van branding
photos arrive — no type or component changes needed, only `image.src` updates.

| Section | Placeholder Path |
|---------|-----------------|
| Residential | `/images/projects/residential/calcot-park-golf-club/nexgen-calcot-park-nest-thermostat-smart-heating.jpg` |
| Commercial | `/images/projects/commercial/dhl/nexgen-dhl-reading-completed-operational-facility.jpg` |
| Industrial | `/images/projects/industrial/harvey-nichols/nexgen-harvey-nichols-chiller-bank-commissioned.jpg` |

---

## Verification Gates

1. `pnpm typecheck` — zero errors
2. `pnpm build` — 84 static pages (count unchanged)
3. Playwright: `/services/emergency` renders 3 profile sections, each showing 4 highlight cards
4. Responsive: highlights grid is 4-col desktop / 2-col tablet / 1-col mobile
5. Dark + light mode: both render correctly
6. `reversed: true` on Commercial section — image appears on right (desktop)

---

## Files Changed

| File | Change |
|------|--------|
| `data/services/emergency.ts` | Replace sections[0] and sections[3] with 3 new domain-specific profile sections |

No component changes. No type changes. No new files.
