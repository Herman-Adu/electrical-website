import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Illumination Component Tests - Simplified Pattern
 *
 * Tests verify the component uses section-container pattern for correct scroll-to behavior,
 * has background image with scroll-based brightness adjustment, and maintains proper content structure.
 */

describe('Illumination Component Implementation', () => {
  let illuminationSource: string;

  beforeEach(() => {
    const illuminationPath = resolve(__dirname, '../../illumination.tsx');
    illuminationSource = readFileSync(illuminationPath, 'utf-8');
  });

  describe('Section Structure — section-container pattern', () => {
    it('should use section-container class (not section-fluid)', () => {
      expect(illuminationSource).toContain('section-container');
      expect(illuminationSource).not.toContain('section-fluid');
    });

    it('should use section-padding class', () => {
      expect(illuminationSource).toContain('section-padding');
    });

    it('should NOT import SectionWrapper', () => {
      expect(illuminationSource).not.toMatch(
        /from ['"]@\/components\/ui\/section-wrapper['"]/
      );
    });

    it('should use section-content class for horizontal gutters', () => {
      expect(illuminationSource).toContain('section-content');
    });

    it('should size naturally to fit content with balanced padding', () => {
      expect(illuminationSource).toContain('section-container section-padding relative');
      expect(illuminationSource).not.toContain('min-h-[120vh]');
      expect(illuminationSource).not.toContain('min-h-screen');
    });

    it('should maintain section id "illumination"', () => {
      expect(illuminationSource).toContain('id="illumination"');
    });
  });

  describe('Background Image & Scroll-based Effects', () => {
    it('should import useScroll and useTransform from framer-motion', () => {
      expect(illuminationSource).toContain('useScroll');
      expect(illuminationSource).toContain('useTransform');
    });

    it('should use brightness and saturation transforms on scroll', () => {
      expect(illuminationSource).toContain('brightness');
      expect(illuminationSource).toContain('saturation');
    });

    it('should apply imageFilter to background image', () => {
      expect(illuminationSource).toContain('style={{ filter: imageFilter }}');
    });

    it('should render warehouse lighting image', () => {
      expect(illuminationSource).toContain('warehouse-lighting.jpg');
    });

    it('should have gradient overlays for readability', () => {
      expect(illuminationSource).toContain('bg-linear-to-t from-(--deep-black)');
      expect(illuminationSource).toContain('bg-linear-to-r from-(--deep-black)');
    });
  });

  describe('Content Structure & Consistency', () => {
    it('should have IntersectionObserverAnimation hook', () => {
      expect(illuminationSource).toContain('useIntersectionObserverAnimation');
    });

    it('should still render stats grid', () => {
      expect(illuminationSource).toContain('StatsGrid');
    });

    it('should still render scan effects', () => {
      expect(illuminationSource).toContain('ScanEffects');
    });

    it('should have containerRef for scroll tracking', () => {
      expect(illuminationSource).toContain('containerRef = useRef<HTMLElement>(null)');
    });

    it('should have eyebrow text with ILLUMINATING EXCELLENCE', () => {
      expect(illuminationSource).toContain('Illuminating Excellence');
    });

    it('should have main heading Powering the Spaces', () => {
      expect(illuminationSource).toContain('Powering the Spaces');
    });

    it('should have description text about LED retrofits', () => {
      expect(illuminationSource).toContain('high-bay LED retrofits');
    });

    it('should have VIEW OUR PROJECTS button', () => {
      expect(illuminationSource).toContain('View Our Projects');
    });
  });

  describe('Animation Patterns', () => {
    it('should use motion.div for entrance animations', () => {
      expect(illuminationSource).toContain('motion.div');
    });

    it('should use whileInView viewport animations', () => {
      expect(illuminationSource).toContain('whileInView');
      expect(illuminationSource).toContain('viewport={{ once: true }}');
    });

    it('should NOT use parallax Y transforms', () => {
      expect(illuminationSource).not.toContain('imageY');
      expect(illuminationSource).not.toContain('contentY');
    });

    it('should NOT use parallax opacity animation', () => {
      // Old opacity transform for fade effect should not be present
      expect(illuminationSource).not.toMatch(/\[1, 1, 1, 0\]/);
    });
  });

  describe('Stats Grid Integration', () => {
    it('should render stats data with Projects Delivered', () => {
      expect(illuminationSource).toContain('2400');
      expect(illuminationSource).toContain('Projects Delivered');
    });

    it('should render stats data with Years Experience', () => {
      expect(illuminationSource).toContain('15');
      expect(illuminationSource).toContain('Industry Excellence');
    });

    it('should render stats data with Client Satisfaction', () => {
      expect(illuminationSource).toContain('99.7');
      expect(illuminationSource).toContain('Client Satisfaction');
    });

    it('should render stats data with Emergency Response', () => {
      expect(illuminationSource).toContain('24');
      expect(illuminationSource).toContain('Emergency Response');
    });

    it('should pass inView prop to StatsGrid', () => {
      expect(illuminationSource).toContain('inView={inView}');
    });
  });
});
