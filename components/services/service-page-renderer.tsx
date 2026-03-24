'use client';

import React from 'react';
import { ServicePageHero } from './service-page-hero';
import { SectionProfile, SectionFeatures, SectionValues, SectionIntro, SectionCTA } from '@/components/shared';
import { Footer } from '@/components/sections/footer';
import type { ServicePageData, PageSection, SectionProfileData, SectionFeaturesData, SectionValuesData, SectionIntroData, SectionCTAData } from '@/types/sections';

interface ServicePageRendererProps {
  data: ServicePageData;
}

function renderSection(section: PageSection, index: number) {
  switch (section.type) {
    case 'profile':
      return <SectionProfile key={index} data={section.data as SectionProfileData} />;
    case 'features':
      return <SectionFeatures key={index} data={section.data as SectionFeaturesData} />;
    case 'values':
      return <SectionValues key={index} data={section.data as SectionValuesData} />;
    case 'intro':
      return <SectionIntro key={index} data={section.data as SectionIntroData} />;
    case 'cta':
      return <SectionCTA key={index} data={section.data as SectionCTAData} />;
    default:
      return null;
  }
}

export function ServicePageRenderer({ data }: ServicePageRendererProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <ServicePageHero data={data.hero} />

      {/* Dynamic sections */}
      {data.sections.map((section, index) => renderSection(section, index))}

      {/* Footer */}
      <Footer />
    </main>
  );
}
