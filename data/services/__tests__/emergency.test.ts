import { describe, it, expect } from 'vitest';
import { emergencyPageData } from '../emergency';
import type { SectionFeaturesData } from '@/types/sections';

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
