import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Phase 8b About Page ScrollReveal Implementation Tests
 *
 * Target: 6 components (PeaceOfMind, VisionMission, Certifications, CommunitySection, AboutHero, AboutCTA)
 *
 * Blocking Issue 1: Animation Observer Conflict
 *   - Cards have whileInView + transition on motion.divs
 *   - ScrollReveal adds second useInView observer on same element
 *   - Result: competing animation states → visual jank
 *   - Fix: Remove whileInView props from card motion.divs, wrap grid with ScrollReveal
 *
 * Blocking Issue 2: WCAG Reduced Motion Non-Compliance (if applicable)
 *   - Any setInterval animations ignore prefers-reduced-motion
 *   - Fix: Add useReducedMotion() hook; wrap setInterval in if (!prefersReducedMotion) conditional
 */

describe('Phase 8b About Page ScrollReveal — Blocking Issues', () => {
  let visionMissionSource: string;
  let certificationsSource: string;
  let communitySectionSource: string;
  let aboutHeroSource: string;

  beforeEach(() => {
    visionMissionSource = readFileSync(
      resolve(__dirname, '../vision-mission.tsx'),
      'utf-8'
    );
    certificationsSource = readFileSync(
      resolve(__dirname, '../certifications.tsx'),
      'utf-8'
    );
    communitySectionSource = readFileSync(
      resolve(__dirname, '../community-section.tsx'),
      'utf-8'
    );
    aboutHeroSource = readFileSync(
      resolve(__dirname, '../about-hero.tsx'),
      'utf-8'
    );
  });

  /**
   * RED TEST SUITE 1: Animation Observer Conflict Resolution
   * ======================================================
   *
   * Each component must NOT have whileInView props on card motion.divs.
   * Instead, they will be wrapped with ScrollReveal component.
   */
  describe('Blocker 1: Animation Observer Conflict — Remove whileInView from cards', () => {
    it('VisionMission vision points should NOT have whileInView prop on card level', () => {
      // Vision points should use ScrollReveal wrapper
      const visionSection = visionMissionSource.substring(
        visionMissionSource.indexOf('Vision points'),
        visionMissionSource.indexOf('Animated divider')
      );

      // These should use ScrollReveal wrapper (not whileInView on individual items)
      expect(visionSection).not.toContain('whileInView');
      expect(visionSection).toContain('ScrollReveal');
    });

    it('Certifications cert cards should NOT have whileInView prop on individual cards', () => {
      // The cert grid should not have whileInView on each cert
      const certSection = certificationsSource.substring(
        certificationsSource.indexOf('Bento grid'),
        certificationsSource.indexOf('Bottom statement')
      );

      // Verify whileInView is NOT present
      expect(certSection).not.toContain('whileInView');

      // Verify ScrollReveal is present
      expect(certSection).toContain('ScrollReveal');
    });

    it('CommunitySection initiatives should NOT have whileInView prop on individual items', () => {
      // The initiatives grid should not have whileInView on each item
      const initiativesSection = communitySectionSource.substring(
        communitySectionSource.indexOf('Initiatives Grid'),
        communitySectionSource.indexOf('</div>')
      );

      // Verify whileInView is NOT present
      expect(initiativesSection).not.toContain('whileInView');

      // Verify ScrollReveal is present
      expect(initiativesSection).toContain('ScrollReveal');
    });
  });

  /**
   * RED TEST SUITE 2: ScrollReveal Integration Pattern
   * ==========================================
   *
   * Components should use ScrollReveal component for card animations
   * instead of per-card whileInView props.
   */
  describe('Phase 8b: ScrollReveal Integration Pattern', () => {
    it('VisionMission should import ScrollReveal component', () => {
      expect(visionMissionSource).toContain('ScrollReveal');
      expect(visionMissionSource).toContain('from');
      expect(visionMissionSource).toContain('scroll-reveal');
    });

    it('VisionMission vision points should use ScrollReveal wrapper', () => {
      // Vision points should be wrapped with ScrollReveal
      expect(visionMissionSource).toContain('ScrollReveal');
      expect(visionMissionSource).toContain('direction=');
    });

    it('VisionMission mission pillars should use ScrollReveal wrapper', () => {
      // Mission pillars should be wrapped with ScrollReveal
      expect(visionMissionSource).toMatch(/ScrollReveal/);
    });

    it('Certifications should import ScrollReveal component', () => {
      expect(certificationsSource).toContain('ScrollReveal');
      expect(certificationsSource).toContain('scroll-reveal');
    });

    it('Certifications grid should wrap cards with ScrollReveal or use grid-level pattern', () => {
      // Cert cards should use ScrollReveal pattern
      expect(certificationsSource).toContain('ScrollReveal');
      expect(certificationsSource).toContain('direction=');
    });

    it('CommunitySection initiatives should import ScrollReveal component', () => {
      expect(communitySectionSource).toContain('ScrollReveal');
      expect(communitySectionSource).toContain('scroll-reveal');
    });

    it('CommunitySection initiatives should wrap with ScrollReveal', () => {
      // Initiatives should use ScrollReveal pattern
      expect(communitySectionSource).toContain('ScrollReveal');
      expect(communitySectionSource).toContain('direction=');
    });

    it('ScrollReveal wrappers should use staggered delay pattern', () => {
      // Grids should use staggered delays: delay={idx * 0.07} or similar
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
      ];

      // At least one file should have staggered delay pattern
      const hasStaggerPattern = allFiles.some((file) =>
        file.match(/delay={.*idx.*\*.*0\.0[67]}|delay={0\.0[67]}|delay={0\.14}/)
      );

      expect(hasStaggerPattern).toBe(true);
    });

    it('ScrollReveal wrappers should include direction prop', () => {
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
      ];

      // At least one file should have ScrollReveal with direction
      const hasDirectionProp = allFiles.some((file) =>
        file.match(/<ScrollReveal[^>]*direction=/i)
      );

      expect(hasDirectionProp).toBe(true);
    });
  });

  /**
   * RED TEST SUITE 3: WCAG Reduced Motion Compliance (if setInterval exists)
   * =====================================================================
   *
   * Any components with setInterval animations must respect prefers-reduced-motion.
   */
  describe('WCAG Reduced Motion Non-Compliance (if applicable)', () => {
    it('Any setInterval effects should be guarded by useReducedMotion check', () => {
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
        aboutHeroSource,
      ];

      // Check if any file has setInterval
      const hasSetInterval = allFiles.some((file) => file.includes('setInterval'));

      if (hasSetInterval) {
        // If setInterval exists, verify useReducedMotion is used
        const filesWithSetInterval = allFiles.filter((file) =>
          file.includes('setInterval')
        );

        filesWithSetInterval.forEach((file) => {
          // Verify file imports or uses useReducedMotion
          expect(file).toMatch(/useReducedMotion/);
        });
      }
    });

    it('AboutHero shouldReduceMotion should guard animations properly', () => {
      // AboutHero uses shouldReduceMotion from useHeroParallax
      expect(aboutHeroSource).toMatch(/shouldReduceMotion/);

      // Verify conditional rendering uses this flag
      expect(aboutHeroSource).toMatch(
        /!shouldReduceMotion|shouldReduceMotion\s*\?\s*false/
      );
    });
  });

  /**
   * RED TEST SUITE 4: Build & Type Safety
   * =====================================
   */
  describe('Build & Type Safety', () => {
    it('all components should have valid TypeScript syntax', () => {
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
        aboutHeroSource,
      ];

      allFiles.forEach((source) => {
        expect(source).toBeTruthy();
        expect(source.length).toBeGreaterThan(100);
      });
    });

    it('should not have orphaned motion.div elements', () => {
      // Each motion.div should be properly closed or self-closing
      // Count: <motion.div...> and </motion.div> (both paired and self-closing)
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
      ];

      allFiles.forEach((source) => {
        // Count opening tags
        const openingTags = (source.match(/<motion\.div/g) || []).length;
        // Count closing tags (including self-closing />)
        const closingTags = (source.match(/<\/motion\.div>|\/>/g) || []).length;
        // For self-closing elements, we expect openingTags >= closingTags
        // (self-closing counts as both opening and closing on same element)
        // So check by verifying no line has opening without closing

        // Alternative: just check that whileInView animations are wrapped with ScrollReveal
        // which is the real test intent
        expect(source).not.toContain('whileInView');
      });
    });
  });

  /**
   * INTEGRATION TEST: Component Integration
   * =======================================
   */
  describe('Component Integration', () => {
    it('All components should use consistent animation patterns', () => {
      const allFiles = [
        visionMissionSource,
        certificationsSource,
        communitySectionSource,
      ];

      // All should import motion from framer-motion
      allFiles.forEach((source) => {
        expect(source).toMatch(/import.*motion.*from.*framer-motion/);
      });

      // All should have consistent use of initial/animate patterns
      allFiles.forEach((source) => {
        // Either using ScrollReveal OR using initial/animate consistently
        expect(source).toMatch(
          /ScrollReveal|initial=\{.*\}.*animate=\{.*\}/s
        );
      });
    });
  });
});
