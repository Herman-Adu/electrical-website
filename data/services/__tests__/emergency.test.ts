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
