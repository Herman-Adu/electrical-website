# Implementation Guide: Server/Client Boundary Optimization

## electrical-website | ActionableRefactoring Specifications

**Document Version:** 1.0  
**Last Updated:** March 25, 2026  
**Target Audience:** Development Team  
**Scope:** Phase 1 & 2 Implementation Details

---

## QUICK START: Phase 1 (Week 1)

### Task 1.1: Remove "use client" from `icon-map.tsx`

**File:** `components/shared/icon-map.tsx`

**Current (Incorrect):**

```tsx
'use client';

import { Shield, Clock, Award, ... } from 'lucide-react';
import type { IconName } from '@/types/sections';

export const iconMap: Record<IconName, LucideIcon> = {
  Shield, Clock, Award, ...
};

export function getIcon(name: IconName): LucideIcon {
  return iconMap[name] || Zap;
}
```

**After (Correct):**

```tsx
// ✅ NO "use client" — this is pure JavaScript factory

import { Shield, Clock, Award, ... } from 'lucide-react';
import type { IconName } from '@/types/sections';

export const iconMap: Record<IconName, LucideIcon> = {
  Shield, Clock, Award, ...
};

export function getIcon(name: IconName): LucideIcon {
  return iconMap[name] || Zap;
}
```

**Why:** This component:

- Does NOT render JSX
- Does NOT use hooks
- Does NOT use browser APIs
- Is a pure function (icon factory)
- Can execute on server

**Testing:**

```tsx
// Test in RSC context
import { getIcon } from "@/components/shared/icon-map";

export async function TestServer() {
  const ZapIcon = getIcon("Zap");
  return <ZapIcon size={24} />; // ✅ Works in RSC
}
```

**Effort:** 2 minutes  
**Risk:** 🟢 NONE (it's a pure function)  
**Impact:** -1 KB bundle, removes unnecessary client boundary

---

### Task 1.2: Convert `service-page-renderer.tsx` to RSC

**File:** `components/services/service-page-renderer.tsx`

**Current (~60 LOC, marked "use client"):**

```tsx
'use client';

import React from 'react';
import { ServicePageHero } from './service-page-hero';
import { SectionProfile, SectionFeatures, ... } from '@/components/shared';
import { Footer } from '@/components/sections/footer';
import type { ServicePageData, PageSection, ... } from '@/types/sections';

interface ServicePageRendererProps {
  data: ServicePageData;
}

function renderSection(section: PageSection, index: number) {
  switch (section.type) {
    case 'profile':
      return <SectionProfile key={index} data={section.data as SectionProfileData} />;
    case 'features':
      return <SectionFeatures key={index} data={section.data as SectionFeaturesData} />;
    // ... more cases
    default:
      return null;
  }
}

export function ServicePageRenderer({ data }: ServicePageRendererProps) {
  return (
    <main className="min-h-screen bg-background">
      <ServicePageHero data={data.hero} />
      {data.intro && <SectionIntro data={data.intro} />}
      {data.sections.map((section, index) => renderSection(section, index))}
      <Footer />
    </main>
  );
}
```

**After (SAME CODE, no "use client"):**

```tsx
// ✅ REMOVE "use client" — this is a switch renderer/composer

import React from 'react';
import { ServicePageHero } from './service-page-hero';
import { SectionProfile, SectionFeatures, ... } from '@/components/shared';
import { Footer } from '@/components/sections/footer';
import type { ServicePageData, PageSection, ... } from '@/types/sections';

interface ServicePageRendererProps {
  data: ServicePageData;
}

function renderSection(section: PageSection, index: number) {
  switch (section.type) {
    case 'profile':
      return <SectionProfile key={index} data={section.data as SectionProfileData} />;
    case 'features':
      return <SectionFeatures key={index} data={section.data as SectionFeaturesData} />;
    // ... more cases
    default:
      return null;
  }
}

export function ServicePageRenderer({ data }: ServicePageRendererProps) {
  return (
    <main className="min-h-screen bg-background">
      <ServicePageHero data={data.hero} />
      {data.intro && <SectionIntro data={data.intro} />}
      {data.sections.map((section, index) => renderSection(section, index))}
      <Footer />
    </main>
  );
}
```

**Why:**

- This is a **"renderer"** (switch/conditional component)
- Takes data as prop
- Returns JSX without state/hooks
- Can be server-rendered
- Child components (`ServicePageHero`, etc.) manage their own client needs

**Testing:**

```tsx
// In app/services/[service]/page.tsx
import { ServicePageRenderer } from "@/components/services";
import { getServicePageData } from "@/data/services";

export default async function ServicePage({ params }) {
  const data = getServicePageData(params.service);
  return <ServicePageRenderer data={data} />; // ✅ Now RSC
}
```

**Effort:** 5 minutes  
**Risk:** 🟢 NONE (pure switch renderer)  
**Impact:** -2 KB bundle, improves architecture

---

### Task 1.3: Split `sections/services.tsx` → RSC + Island

**File:** `components/sections/services.tsx`  
**Current Size:** 276 LOC  
**Target:** 2 files (RSC + Island)

#### Step 1: Create Server Component (`services-layout.tsx`)

**New File:** `components/sections/services-layout.tsx` (RSC, ~100 LOC)

```tsx
// ✅ SERVER COMPONENT — orchestrates layout and data

import React from 'react';
import { ServicesGrid } from './services-grid';
import { ServicesAnimationWrapper } from './services-animation-wrapper';

const services = [
  {
    icon: Building2,
    title: 'Commercial Installations',
    description: '...',
    specs: [...],
    voltage: '440V',
  },
  // ... 5 more services
];

export function Services() {
  return (
    <section
      id="services"
      className="section-container section-padding bg-background"
    >
      {/* Background Elements (Static) */}
      <div className="absolute inset-0 blueprint-grid opacity-5" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--electric-cyan), transparent)',
          opacity: 0.3,
        }}
      />

      <div className="section-content">
        {/* Header - wrapped in animation island */}
        <ServicesAnimationWrapper>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-electric-cyan/20 mb-6">
              <div className="w-2 h-2 bg-electric-cyan animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Core Services
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4">
              Engineering <span className="text-electric-cyan">Excellence</span>
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg font-light">
              Comprehensive electrical solutions designed for the demands of
              modern commercial and industrial operations.
            </p>
          </div>
        </ServicesAnimationWrapper>

        {/* Services Grid (RSC) */}
        <ServicesGrid services={services} />
      </div>
    </section>
  );
}
```

#### Step 2: Create Grid Component (`services-grid.tsx`, RSC, ~80 LOC)

```tsx
// ✅ SERVER COMPONENT — renders service cards

import { ServiceCard } from "./service-card";
import type { Service } from "@/types/services";

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <ServiceCard key={service.title} service={service} index={index} />
      ))}
    </div>
  );
}
```

#### Step 3: Create Card Component (`service-card.tsx`, Client Island, ~80 LOC)

```tsx
// ⚠️ CLIENT COMPONENT — minimal, animation-only

"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import type { Service } from "@/types/services";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="group relative flex flex-col bg-card/50 border border-border rounded-2xl p-6 lg:p-8 hover:border-electric-cyan/30 transition-all duration-300 hover:shadow-xl hover:shadow-electric-cyan/5"
    >
      {/* Corner accent */}
      <div className="absolute top-3 right-3 w-10 h-10 border-t border-r border-electric-cyan/20 rounded-tr-xl group-hover:border-electric-cyan/40 transition-colors" />

      {/* Voltage badge */}
      <div className="absolute top-4 right-4">
        <span className="font-mono text-[9px] text-electric-cyan/40 group-hover:text-electric-cyan/80 tracking-widest transition-colors duration-300">
          {service.voltage}
        </span>
      </div>

      {/* Icon */}
      <div className="relative mb-6">
        <service.icon
          size={32}
          className="text-electric-cyan group-hover:text-white transition-colors"
        />
        <div className="absolute -inset-2 bg-electric-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-3 group-hover:text-electric-cyan transition-colors">
        {service.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 flex-1">
        {service.description}
      </p>

      {/* Specs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {service.specs.map((spec) => (
          <span
            key={spec}
            className="font-mono text-[9px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground tracking-wider"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Learn More Link */}
      <a
        href={`/services/${service.slug}`}
        className="text-sm text-muted-foreground hover:text-electric-cyan transition-colors"
      >
        Learn More →
      </a>
    </motion.div>
  );
}
```

#### Step 4: Create Animation Wrapper (`services-animation-wrapper.tsx`, Client Island, ~40 LOC)

```tsx
// ⚠️ CLIENT COMPONENT — header animation only

"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

interface ServicesAnimationWrapperProps {
  children: React.ReactNode;
}

export function ServicesAnimationWrapper({
  children,
}: ServicesAnimationWrapperProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
```

#### Step 5: Update Exports (`components/sections/index.ts`)

```tsx
export { Services } from "./services-layout";
export { ServicesGrid } from "./services-grid";
export { ServiceCard } from "./service-card";
export { ServicesAnimationWrapper } from "./services-animation-wrapper";
```

**Result:**

```
services/sections/ BEFORE:
├─ services.tsx (276 LOC, all client)

services/sections/ AFTER:
├─ services-layout.tsx (100 LOC, RSC)
├─ services-grid.tsx (80 LOC, RSC)
├─ service-card.tsx (80 LOC, Client Island)
└─ services-animation-wrapper.tsx (40 LOC, Client Island)

Total:
- Client LOC: 276 → 120 (57% reduction)
- Files: 1 → 4 (modular, testable)
- Data layer: Separated (RSC can fetch/preload)
```

**Effort:** 30 minutes  
**Risk:** 🟢 LOW (animations already inside motion.div)  
**Impact:** -18 KB bundle portion, improved modularity

---

## Validation Checklist (Phase 1)

After completing all 3 tasks:

- [ ] `icon-map.tsx` has NO "use client" directive
- [ ] `service-page-renderer.tsx` has NO "use client" directive
- [ ] `services/` folder has 4 files (layout, grid, card, wrapper)
- [ ] All client islands marked with ⚠️ `"use client"` at top
- [ ] `components/sections/index.ts` exports `Services` (from layout)
- [ ] App builds without errors: `npm run build`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Services page renders correctly
- [ ] No hydration warnings in browser console
- [ ] No visual regressions (animations still smooth)

---

## Phase 2: Shared Components (Week 2)

### Overview: Convert 5 Shared Components to RSC + Islands

**Files to refactor:**

1. `shared/section-features.tsx` (200 LOC)
2. `shared/section-intro.tsx` (180 LOC)
3. `shared/section-cta.tsx` (180 LOC)
4. `shared/section-profile.tsx` (200 LOC)
5. `shared/section-values.tsx` (150 LOC)

**Pattern (all follow same structure):**

```
ComponentName.tsx (RSC, ~80 LOC)
└─ Receives data via props
└─ Renders static content
└─ Wraps dynamic sections in <Suspense>

ComponentNameAnimation.tsx (Client, ~50 LOC)
└─ Wraps with motion.div
└─ Handles whileInView trigger
└─ No state, no complex logic
```

**Example: `shared/section-features.tsx`**

**Before (200 LOC, marked "use client"):**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Zap } from "lucide-react";
import { getIcon } from "./icon-map";
import type { SectionFeaturesData } from "@/types/sections";

export function SectionFeatures({ data }: { data: SectionFeaturesData }) {
  const { label, headline, description, pillars } = data;

  return (
    <section id={data.sectionId} className="section-container section-padding">
      {/* All motion animations inline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2>{headline}</h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
      >
        {pillars.map((pillar, idx) => (
          <motion.div key={pillar.title} variants={itemVariants}>
            {/* Pillar content... */}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

**After (Split into 2 files):**

File 1: `shared/section-features.tsx` (RSC, ~90 LOC)

```tsx
// ✅ SERVER COMPONENT — render layer

import React from "react";
import { getIcon } from "./icon-map";
import { SectionFeaturesAnimation } from "./section-features-animation";
import type { SectionFeaturesData } from "@/types/sections";

export function SectionFeatures({ data }: { data: SectionFeaturesData }) {
  const {
    sectionId,
    label,
    headline,
    headlineHighlight,
    description,
    pillars,
    checklist,
    partners,
  } = data;

  return (
    <section id={sectionId} className="section-container section-padding">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />

      {/* Borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan/50 to-transparent" />

      <div className="section-content">
        {/* Header with animation wrapper */}
        <SectionFeaturesAnimation>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap size={14} className="text-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                {label}
              </span>
              <Zap size={14} className="text-electric-cyan" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {headlineHighlight ? (
                <>
                  {headline.replace(headlineHighlight, "")}{" "}
                  <span className="text-electric-cyan">
                    {headlineHighlight}
                  </span>
                </>
              ) : (
                headline
              )}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
              {description}
            </p>
          </div>
        </SectionFeaturesAnimation>

        {/* Feature pillars (rendered by island) */}
        <SectionFeaturesAnimation>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {pillars.map((pillar, idx) => (
              <FeaturePillar key={pillar.title} pillar={pillar} idx={idx} />
            ))}
          </div>
        </SectionFeaturesAnimation>

        {/* Checklist + partners grid (static) */}
        {(checklist.length > 0 || partners.length > 0) && (
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {checklist.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">
                  What You Always Receive
                </h3>
                <div className="space-y-3">
                  {checklist.map((check) => (
                    <div key={check} className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-electric-cyan"
                      />
                      <span className="text-sm text-muted-foreground">
                        {check}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Partners section... */}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturePillar({ pillar, idx }: any) {
  const Icon = getIcon(pillar.icon);
  return (
    <div
      className={`relative p-7 rounded-2xl border transition-all duration-300 group ${pillar.highlight ? "border-electric-cyan/60 bg-electric-cyan/8" : "border-border bg-card/50 hover:border-electric-cyan/30"}`}
    >
      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-electric-cyan/30" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-electric-cyan/30" />

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${pillar.highlight ? "border-electric-cyan/40 bg-electric-cyan/15" : "border-border bg-card"}`}
      >
        <Icon
          size={22}
          className={
            pillar.highlight ? "text-electric-cyan" : "text-muted-foreground"
          }
        />
      </div>

      <h3 className="text-base font-bold text-foreground mb-3">
        {pillar.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {pillar.description}
      </p>

      {pillar.highlight && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
          <span className="font-mono text-[10px] text-electric-cyan tracking-widest uppercase">
            Core Commitment
          </span>
        </div>
      )}
    </div>
  );
}
```

File 2: `shared/section-features-animation.tsx` (Client Island, ~50 LOC)

```tsx
// ⚠️ CLIENT COMPONENT — animation wrapper only

"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionFeaturesAnimationProps {
  children: React.ReactNode;
}

export function SectionFeaturesAnimation({
  children,
}: SectionFeaturesAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
```

**Result for Phase 2 (All 5 components following same pattern):**

```
Existing:
├─ shared/section-features.tsx (200 LOC, client)
├─ shared/section-intro.tsx (180 LOC, client)
├─ shared/section-cta.tsx (180 LOC, client)
├─ shared/section-profile.tsx (200 LOC, client)
└─ shared/section-values.tsx (150 LOC, client)

After:
├─ shared/section-features.tsx (90 LOC, RSC)
├─ shared/section-features-animation.tsx (50 LOC, client)
├─ shared/section-intro.tsx (85 LOC, RSC)
├─ shared/section-intro-animation.tsx (50 LOC, client)
├─ shared/section-cta.tsx (85 LOC, RSC)
├─ shared/section-cta-animation.tsx (50 LOC, client)
├─ shared/section-profile.tsx (90 LOC, RSC)
├─ shared/section-profile-animation.tsx (50 LOC, client)
├─ shared/section-values.tsx (75 LOC, RSC)
└─ shared/section-values-animation.tsx (50 LOC, client)

Total:
- Client LOC: 910 → 250 (73% reduction)
- Files: 5 → 10 (modular, easier testing)
```

**Effort:** 90 minutes (18 min per component)  
**Risk:** 🟢 LOW  
**Impact:** -40 KB bundle portion

---

## Testing Strategy

### Unit Tests (Create for new components)

**File:** `components/shared/__tests__/section-features.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { SectionFeatures } from "../section-features";
import { mockSectionFeaturesData } from "@/test/fixtures";

describe("SectionFeatures", () => {
  it("renders headline with highlight", () => {
    render(<SectionFeatures data={mockSectionFeaturesData} />);
    expect(screen.getByText("Excellence")).toHaveClass("text-electric-cyan");
  });

  it("renders all feature pillars", () => {
    render(<SectionFeatures data={mockSectionFeaturesData} />);
    mockSectionFeaturesData.pillars.forEach((pillar) => {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
    });
  });

  it("renders checklist items", () => {
    render(<SectionFeatures data={mockSectionFeaturesData} />);
    mockSectionFeaturesData.checklist.forEach((check) => {
      expect(screen.getByText(check)).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Update existing)

**File:** `e2e/services.spec.ts`

```tsx
test("services section renders with animations", async ({ page }) => {
  await page.goto("/services");

  // Wait for animation to complete
  await page.waitForTimeout(1000);

  // Check cards are visible
  const cards = page.locator('[data-testid="service-card"]');
  expect(await cards.count()).toBe(6);

  // Check smooth scrolling works
  const firstCard = cards.first();
  await expect(firstCard).toBeVisible();
});
```

### Performance Tests (Lighthouse CI)

```bash
# Run before/after bundle analysis
npm run build
npm run analyze

# Expected: -18 KB on phase 1, -40 KB on phase 2
```

---

## Summary: Phase 1 & 2 Checklist

### Phase 1 Deliverables (Week 1)

- [ ] ✅ `icon-map.tsx` — "use client" removed
- [ ] ✅ `service-page-renderer.tsx` — "use client" removed
- [ ] ✅ `services/` — Split into 4 files (layout, grid, card, wrapper)
- [ ] ✅ Build passes: `npm run build`
- [ ] ✅ Tests pass: `npm run test:e2e`
- [ ] ✅ No hydration warnings
- [ ] ✅ No visual regressions
- [ ] ✅ Create PR for review

### Phase 2 Deliverables (Week 2)

- [ ] ✅ `shared/section-features.tsx` — Split into RSC + Island
- [ ] ✅ `shared/section-intro.tsx` — Split into RSC + Island
- [ ] ✅ `shared/section-cta.tsx` — Split into RSC + Island
- [ ] ✅ `shared/section-profile.tsx` — Split into RSC + Island
- [ ] ✅ `shared/section-values.tsx` — Split into RSC + Island
- [ ] ✅ Build passes: `npm run build`
- [ ] ✅ Tests pass: `npm run test:e2e`
- [ ] ✅ Create micro-component library doc
- [ ] ✅ Create PR for review

---

**Total Time Estimate:** ~250 minutes (~4-5 developer-hours)  
**Expected Impact:** 112 KB bundle reduction, -240ms hydration time  
**Risk Level:** 🟢 **LOW** (all render-layer or animation-only changes)
