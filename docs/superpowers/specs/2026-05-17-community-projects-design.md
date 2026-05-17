---
title: Community Projects — TVAP & Slough in Bloom
description: Design spec for two community project entries in the Community category
category: specs
status: active
last-updated: 2026-05-17
---

# Community Projects Design Spec

## Scope

Add two `Project` entries to the `community` category:

1. **Thames Valley Adventure Playground (TVAP)** — Free PAT testing. Status: `planned`.
2. **Slough in Bloom** — Community sponsorship 2023 + 2026. Status: `in-progress`.

---

## Architecture Decision

**Approach B — Dedicated `data/projects/community.ts` file.**

`data/projects/index.ts` already exceeds 32K tokens. Adding two rich community entries inline would push it further without benefit. Community projects have a distinct character (pro bono, charitable, civic) that earns a dedicated file.

### Files to create
- `data/projects/community.ts` — exports `communityProjects: Project[]`

### Files to modify
- `data/projects/index.ts` — import `communityProjects` and spread into `allProjects`

### Change to `index.ts`
```ts
import { communityProjects } from "./community";

// In allProjects array construction:
export const allProjects: Project[] = [
  ...communityProjects,
  // ...existing projects
];
```

No changes to routes, components, types, or TOC logic. Both projects are served at:
```
/projects/category/community/thames-valley-adventure-playground-pat-testing
/projects/category/community/slough-in-bloom-community-sponsorship
```

---

## Available Icons (TrustIndicatorItem / heroIndicators)

`Zap` `Shield` `Lightbulb` `Wifi` `Wrench` `Phone` `AlertTriangle` `Battery` `Plug`
`Settings` `Gauge` `ClipboardCheck` `Users` `Heart` `Star` `Activity` `BookOpen`
`Mail` `MessageSquare` `MapPin` `Calendar`

---

## Project 1: Thames Valley Adventure Playground

### Card-Level Fields

| Field | Value |
|---|---|
| `id` | `proj-tvap-pat-2026-001` |
| `slug` | `thames-valley-adventure-playground-pat-testing` |
| `category` | `community` |
| `categoryLabel` | `Community` |
| `title` | `Thames Valley Adventure Playground — Free PAT Testing` |
| `clientSector` | `Charity & Disability Services` |
| `status` | `planned` |
| `progress` | `0` |
| `isFeatured` | `false` |
| `publishedAt` | `2026-05-17T09:00:00.000Z` |
| `updatedAt` | `2026-05-17T09:00:00.000Z` |

### KPIs

| Field | Value |
|---|---|
| `budget` | `Pro Bono` |
| `timeline` | `2026 — Planned` |
| `capacity` | `Full Site PAT` |
| `location` | `Taplow, Berkshire` |

### Tags
`PAT Testing` `Pro Bono` `Community Charity` `Disability Services` `Electrical Safety`

### Hero Headline
`["Thames Valley", "Adventure Playground"]`

### heroIndicators (4 required, using TrustIndicatorItem icons)

| # | Icon | Title | Description |
|---|---|---|---|
| 1 | `ClipboardCheck` | `PAT Testing` | Full portable appliance inspection and testing across all charity facilities, carried out to NICEIC standards. |
| 2 | `Heart` | `Pro Bono` | 100% donated — our time, expertise, and certification, at zero cost to the charity. |
| 3 | `Users` | `Inclusive Play` | Supporting a charity serving children and adults with every type of disability since 1979 across the Thames Valley. |
| 4 | `MapPin` | `Taplow, Berkshire` | TVAP's 2.5-acre inclusive play facility adjacent to the A4, near Maidenhead. |

### Cover Image
```
src: "/images/projects/community/tvap/nexgen-tvap-pat-testing-hero.jpg"
alt: "Thames Valley Adventure Playground — Nexgen free PAT testing community initiative"
```
**Note:** No image exists yet. Use a placeholder path. The file must be added after the site visit.
Placeholder recommendation: copy a neutral community image as a stand-in, or omit cover image if the
component supports graceful fallback. Confirm rendering before shipping.

### TOC (derived from `detail` fields present)

```
1. Overview                           ← detail.intro
   └─ What Community Means to Nexgen  ← narrativeBlock(after-intro, anchorId: "our-values")
2. Scope of Work                      ← detail.scope
3. Project Timeline                   ← detail.timeline
```

No `challenge`/`solution`, no `gallery` (no images), no `testimonial` (planned).

### detail.intro

```
label: "Community Initiative"
headlineWords: ["Every", "socket.", "Every", "appliance.", "Donated."]
leadParagraph:
  "Thames Valley Adventure Playground is one of those organisations that reminds you why
  community matters. A charity that has given children and adults with disabilities a safe,
  stimulating place to play since 1979 — on a 2.5-acre site in Taplow that families across
  Berkshire, Buckinghamshire, and Oxfordshire travel to reach. When the opportunity came
  to support TVAP through a fully free PAT testing programme, Nexgen didn't hesitate."
bodyParagraphs: [
  "Portable appliance testing might sound straightforward, but for a charity operating a
  facility of this scale — sensory rooms, splash pads, outdoor play equipment, indoor
  spaces, and staff welfare areas — the number of appliances to inspect, test, and certify
  is significant. For TVAP, this is not a budget line. It's a compliance obligation that
  competes for funds the charity would far rather spend on the children they serve.",
  "Nexgen are donating the entire programme: every visual inspection, every electrical test,
  every label applied, and every certificate produced. Full NICEIC-compliant documentation
  and reporting will be provided on completion. No invoice. No charge. Just neighbours
  looking after neighbours."
]
pillars: [
  { num: "01", title: "Every Appliance Covered",
    description: "Full site inspection across all portable electrical appliances — no exclusions,
    no shortcuts. Every item is visually inspected, electrically tested where required, and
    clearly labelled on completion." },
  { num: "02", title: "Zero Cost to the Charity",
    description: "Nexgen are donating time, expertise, and materials in full. TVAP carries no
    cost whatsoever — every pound they would have spent on compliance stays with the children
    they serve." },
  { num: "03", title: "Full Certification and Reporting",
    description: "NICEIC-compliant test records, pass/fail register, and all required certification
    provided at handover. TVAP leaves with everything they need to demonstrate electrical
    compliance to their insurers, funders, and OFSTED." },
  { num: "04", title: "OFSTED-Registered Facility",
    description: "TVAP is an OFSTED-registered day-care facility. Electrical compliance is not
    optional — it's a condition of their registration. Our work directly protects their ability
    to operate and serve their community." }
]
```

### narrativeBlock: after-intro (anchorId: "our-values")

```
heading: "What Community Means to Nexgen"
paragraphs: [
  "Nexgen Electrical Innovations is a local business. Our team lives in this area, sends
  children to schools near here, drives past the same roundabouts and shops as the families
  TVAP serves. When a charity like Thames Valley Adventure Playground is operating nearby,
  giving back isn't a marketing exercise — it's the obvious thing to do.",
  "We believe trade businesses have a responsibility to their communities that goes beyond
  delivering work on time and on spec. Charities and community organisations often operate
  without the budgets to maintain full compliance on every front. Where Nexgen can close
  that gap, we will — and the TVAP PAT testing programme is exactly that kind of initiative."
]
background: "muted"
```

### detail.scope (6 items)

| Icon | Title | Description |
|---|---|---|
| `Wrench` | Visual Inspection | Every portable appliance inspected for visible damage, cable condition, plug integrity, and marking compliance before electrical testing begins. |
| `Zap` | Electrical Testing | In-service testing carried out using calibrated PAT equipment to IET Code of Practice standards, with pass/fail recorded for each appliance. |
| `Shield` | Labelling | All tested appliances clearly labelled with test result, date, and next test due — giving staff instant visibility of compliance status. |
| `Award` | Documentation & Certification | Full test register produced for every appliance on site. NICEIC-compliant certification and reporting provided at handover. |
| `Settings` | Remedial Identification | Any appliance that fails testing is flagged, removed from service, and reported. Nexgen will advise on remedial options at no additional charge. |
| `Activity` | Compliance Confidence | TVAP leaves the programme with a complete, dated, certified electrical appliance record — ready for OFSTED inspection, insurer requests, or funder reporting. |

### detail.timeline (3 phases, all upcoming)

| Phase | Title | Description | Duration | Status |
|---|---|---|---|---|
| Phase 1 | Site Survey & Appliance Register | Pre-visit survey to establish appliance count, site layout, and access requirements. Full appliance register produced prior to testing day. | TBC | `upcoming` |
| Phase 2 | Testing & Inspection Programme | Full site PAT testing day(s) — visual inspection, electrical testing, labelling, and real-time recording for all portable appliances across the facility. | TBC | `upcoming` |
| Phase 3 | Certification & Handover | Test register finalised, NICEIC certificates produced, and full documentation package handed to TVAP management. Remedial items reported separately. | TBC | `upcoming` |

---

## Project 2: Slough in Bloom

### Naming Note
Intact Electrical is **never mentioned** by name anywhere in this project entry.
The 2023 chapter is referenced as "our community roots" — the team's prior commitment,
not a named company. The narrative is Nexgen's story from the beginning.

### Card-Level Fields

| Field | Value |
|---|---|
| `id` | `proj-slough-in-bloom-sponsor-001` |
| `slug` | `slough-in-bloom-community-sponsorship` |
| `category` | `community` |
| `categoryLabel` | `Community` |
| `title` | `Slough in Bloom — Community Sponsorship` |
| `clientSector` | `Community Horticulture & Civic Pride` |
| `status` | `in-progress` |
| `progress` | `50` |
| `isFeatured` | `false` |
| `publishedAt` | `2023-09-16T09:00:00.000Z` |
| `updatedAt` | `2026-05-17T09:00:00.000Z` |

### KPIs

| Field | Value |
|---|---|
| `budget` | `Community Sponsor` |
| `timeline` | `2023 → 2026` |
| `capacity` | `32nd Year Sponsor` |
| `location` | `Slough, Berkshire` |

### Tags
`Community Sponsorship` `Slough in Bloom` `Civic Pride` `Horticulture` `Local Giving`

### Hero Headline
`["Slough in Bloom.", "Community First."]`

### heroIndicators (4 required)

| # | Icon | Title | Description |
|---|---|---|---|
| 1 | `Heart` | `2023 + 2026` | Proud sponsors of Slough in Bloom for both its 29th (2023) and 32nd (2026) year — our roots run deep. |
| 2 | `Star` | `Community Sponsor` | Backing the competition that has brightened Slough's streets, allotments, and roundabouts for over three decades. |
| 3 | `Lightbulb` | `10 Categories` | Supporting all 10 judging categories — from residential front gardens to environmental projects across the borough. |
| 4 | `MapPin` | `Slough, Berkshire` | Investing in the community where our team lives and works, alongside the people who make Slough worth living in. |

### Cover Image
```
src: "/images/projects/community/slough-in-bloom/01-slough-in-bloom-2023-overall-winner.jpg"
alt: "Slough in Bloom 2023 — overall winner, sponsored by Nexgen Electrical Innovations"
```

### TOC (derived from `detail` fields present)

```
1. Overview                             ← detail.intro
   └─ Same Values. New Name.            ← narrativeBlock(after-intro, anchorId: "same-values")
2. Scope of Work                        ← detail.scope
3. Challenge & Solution                 ← detail.challenge + detail.solution
   └─ Why Local Business Shows Up       ← narrativeBlock(after-challenge, anchorId: "why-we-show-up")
4. Project Timeline                     ← detail.timeline
5. Gallery                              ← detail.gallery (13 images)
6. Client Testimonial                   ← detail.testimonial (Bruce Hicks quote)
```

### detail.intro

```
label: "Community Initiative"
headlineWords: ["We", "came", "back.", "Because", "Slough", "is", "home."]
leadParagraph:
  "Slough in Bloom has been brightening this town for over three decades. Every summer, residents,
  schools, allotment holders, and businesses spend months cultivating something beautiful —
  not for profit, not for recognition, but because a colourful street is a better street for
  everyone who walks it. Our team has been part of this competition's story since 2023.
  In 2026, under our own name, we came back — and we intend to keep coming back."
bodyParagraphs: [
  "The competition runs across 10 categories and is entirely free to enter. It relies on
  sponsors to exist. Without business support, the judging, the awards, the publicity, and
  the infrastructure that makes the competition real simply wouldn't happen. That's where
  Nexgen comes in — not as a passive logo on a banner, but as a business that genuinely
  believes the town it operates in is worth investing in.",
  "In 2023, we backed this competition as it entered its 29th year. In 2026, as Nexgen
  Electrical Innovations, we returned for its 32nd — under new chairman Phil Vance and
  with Mayor Siobhan Dauti at the launch. The competition keeps growing. So does our
  commitment to it."
]
pillars: [
  { num: "01", title: "Community Before Commerce",
    description: "We don't sponsor Slough in Bloom to generate leads. We do it because our
    engineers live here, our families shop here, and a town people are proud of is a better
    place for everyone — including us." },
  { num: "02", title: "Keeping the Competition Alive",
    description: "Slough in Bloom is free to enter because sponsors make it viable. Without
    business backing, the judging programme, the awards ceremony, and the momentum built
    over 32 years would simply stop. Nexgen helps make sure it doesn't." },
  { num: "03", title: "A Relationship, Not a Transaction",
    description: "Our involvement began in 2023 and returned in 2026. This is not a one-off
    PR exercise — it's an ongoing relationship with a competition and a community that has
    meant something to us from the start." }
]
```

### narrativeBlock: after-intro (anchorId: "same-values")

```
heading: "Same Values. New Name."
paragraphs: [
  "Nexgen Electrical Innovations was built on something that came before — a team with deep
  roots in the local electrical industry and an equally deep commitment to the communities
  they served. When this company was founded, one of the first things we did was return to
  support Slough in Bloom. Not because it was on a list of things to do. Because the people
  who make up Nexgen had always believed in it.",
  "The 2023 chapter proved something to us: that community involvement isn't just feel-good
  language in a company brochure. It changes how your team sees themselves, how your
  neighbours see you, and how connected you feel to the place where you work. In 2026,
  that belief is still intact — and NxtGen is listed on the Slough in Bloom website as a
  current sponsor for year 32."
]
background: "muted"
```

### detail.scope (6 items — what sponsorship actually delivers)

| Icon | Title | Description |
|---|---|---|
| `Award` | Competition Funding | Our sponsorship contributes directly to the costs of running the annual competition — judging, publicity, materials, and the awards ceremony that recognises entrants' work. |
| `Network` | Community Platform | Slough in Bloom is a platform for residents, schools, and businesses to engage with each other around something positive. Our backing helps keep that platform open and free to all. |
| `Lightbulb` | Supporting 10 Categories | From residential front gardens to environmental projects and sponsored roundabouts — the competition's breadth is part of its appeal. Our sponsorship supports every category. |
| `CheckCircle` | Recognising Residents | The competition acknowledges people who give their time and money to make Slough look its best. Our involvement is a way of saying that effort is noticed and valued. |
| `Building` | Local Investment | This is money that stays in the community. The entrants are local, the judges are local, the awards go to local people — and so does every pound of our sponsorship. |
| `Activity` | Year-on-Year Continuity | Returning in 2026 after 2023 means something. It tells the committee, the entrants, and the borough that Nexgen's commitment isn't contingent on a good PR quarter. |

### detail.challenge

```
"Community sponsorship is an easy thing to talk about and a harder thing to sustain. A
business can put its logo on a banner once and move on. The challenge — and the test of
whether a commitment is genuine — is whether you come back. Whether you show up the
following year, and the year after that, not because it generates work, but because you
decided it was the right thing to do and you haven't changed your mind."
```

### detail.solution

```
"Nexgen showed up in 2023. We came back in 2026. The gap between those two years was a
period of significant change for the business — but not a change in values. We returned
to Slough in Bloom because the competition is worth supporting, because the people who
run it give their time generously and deserve businesses that reciprocate, and because
the team at Nexgen is made up of people from this area who want to see it flourish.
That's the only calculation we needed."
```

### narrativeBlock: after-challenge (anchorId: "why-we-show-up")

```
heading: "Why Local Business Shows Up"
paragraphs: [
  "There is a version of community involvement that is pure marketing — a logo, a press
  release, and a line on a website. That's not what this is. The electrical industry is
  built on reputation and relationships. The people of Slough are the same people who
  recommend contractors to their neighbours, who remember which businesses gave something
  back when they didn't have to, and who notice when a name shows up consistently rather
  than once.",
  "Slough in Bloom has been running for 32 years because of people like Margaret Inniss,
  who gave over three decades to building it into what it is today. The 2025 ceremony
  created the Margaret Inniss Award for Blooming Excellence in her honour — a recognition
  of what sustained, unglamorous commitment to a community can achieve. That's the kind
  of legacy we want to be part of."
]
background: "default"
```

### detail.timeline (3 phases)

| Phase | Title | Description | Duration | Status |
|---|---|---|---|---|
| Phase 1 | 2023 — Community Roots | Our team backed Slough in Bloom as it entered its 29th year. Bruce Hicks, Senior Parks Improvement Officer, confirmed the competition's continuation was made possible by new sponsors stepping forward. We were proud to be one of them. | 2023 | `completed` |
| Phase 2 | Nexgen Electrical Innovations Founded | A new chapter — same team, same values, new name. When Nexgen was established, returning to support Slough in Bloom was never in question. | 2023–2025 | `completed` |
| Phase 3 | 2026 — We Came Back | As Nexgen Electrical Innovations, we returned as sponsors for the competition's 32nd year. Under new chairman Phil Vance, with Mayor Siobhan Dauti at the launch on 5 May 2026, NxtGen is listed as an active sponsor on sloughinbloom.com. | 2026 (active) | `in-progress` |

### detail.gallery (13 images — ordered for narrative flow)

| # | src | alt | caption |
|---|---|---|---|
| 1 | `/images/projects/community/slough-in-bloom/01-slough-in-bloom-2023-overall-winner.jpg` | Slough in Bloom 2023 — overall winner Simon Richardson | 2023 Overall Winner — Simon Richardson |
| 2 | `/images/projects/community/slough-in-bloom/02-slough-in-bloom-gold-winners.jpg` | Slough in Bloom 2023 — gold winner | 2023 Gold Award |
| 3 | `/images/projects/community/slough-in-bloom/03-slough-in-bloom-gold-winners.jpg` | Slough in Bloom 2023 — gold winner | 2023 Gold Award |
| 4 | `/images/projects/community/slough-in-bloom/04-slough-in-bloom-gold-winners.jpg` | Slough in Bloom 2023 — gold winner | 2023 Gold Award |
| 5 | `/images/projects/community/slough-in-bloom/05-slough-in-bloom-gold-winners.jpg` | Slough in Bloom 2023 — gold winner | 2023 Gold Award |
| 6 | `/images/projects/community/slough-in-bloom/06-slough-in-bloom-gold-winners.jpg` | Slough in Bloom 2023 — gold winner | 2023 Gold Award |
| 7 | `/images/projects/community/slough-in-bloom/slough-in-bloom-01.jpg` | Slough in Bloom competition — community entries | Community Entries |
| 8 | `/images/projects/community/slough-in-bloom/slough-in-bloom-03.jpg` | Slough in Bloom competition — community display | Community Display |
| 9 | `/images/projects/community/slough-in-bloom/slough-in-bloom-04.jpg` | Slough in Bloom competition — garden entry | Garden Entry |
| 10 | `/images/projects/community/slough-in-bloom/slough-in-bloom-05.jpg` | Slough in Bloom competition — floral display | Floral Display |
| 11 | `/images/projects/community/slough-in-bloom/slough-in-bloom-v1.jpg` | Slough in Bloom 2023 — community competition | Competition Display |
| 12 | `/images/projects/community/slough-in-bloom/slough-in-bloom-v2.jpg` | Slough in Bloom 2023 — community competition | Competition Display |
| 13 | `/images/projects/community/slough-in-bloom/001-slough-in-bloom-2023-overall-winner.jpg` | Slough in Bloom 2023 — overall winner celebration | Overall Winner Celebration |

### detail.testimonial

```
quote: "Slough in Bloom have been working with new sponsors who have enabled this lovely
        competition to continue for its 29th year."
author: "Bruce Hicks"
role: "Senior Parks Improvement Officer"
company: "Slough Borough Council"
```

---

## Content Writing Direction

### Voice
Community-first. Genuine. Not marketing copy.

- Lead with what the community gains, not what Nexgen gains.
- Use real people's names and real details — this is local, specific, and true.
- Avoid: "proud to support", "committed to giving back", "passionate about community" as opening gambits. These are clichés. State the facts; the pride is implied.
- Do use: concrete details, real quotes, named organisations, honest language about why we're involved.

### TVAP Tone
Forward-looking and matter-of-fact. This is planned work described with the same confidence
as completed work. "We will do this" not "we hope to do this." The values section can be warmer.

### Slough in Bloom Tone
Reflective but not nostalgic. The 2023/2026 arc is a comeback story — acknowledge the gap
without dwelling on it. The emphasis is on continuity of values, not continuity of presence.
The Margaret Inniss reference grounds the narrative in the competition's real history.

---

## Implementation Constraints

- `heroIndicators` must be exactly 4 items, typed `as const`
- `heroHeadline` is `[string, string?, string?]` — max 3 strings
- `narrativeBlocks` positions: `"after-intro" | "after-scope" | "after-challenge" | "after-timeline" | "after-gallery"`
- TOC items are auto-generated — `anchorId` and `heading` on narrative blocks create sub-items
- `ProjectScope.icon` type is separate from `TrustIndicatorItem.icon` — use only icons valid for each
- TVAP cover image does not exist yet — confirm placeholder behaviour before shipping
- Slough cover image exists at the specified path — verify filename casing matches filesystem

---

## Build Gate

Before committing:
```bash
pnpm typecheck && pnpm build
```

All 13 gallery images exist. TVAP cover image is a placeholder path — either add a real image
or confirm the component renders gracefully without it before the gate runs.
