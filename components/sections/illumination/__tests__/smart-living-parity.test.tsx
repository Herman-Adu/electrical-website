import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Illumination Component Pattern Tests
 *
 * Verifies that Illumination component follows the simplified pattern with:
 * - section-container for scroll-to consistency
 * - Scroll-based brightness adjustment (not parallax movement)
 * - Background image with gradient overlays
 */

describe('Illumination Component Pattern', () => {
  let illuminationSource: string;

  beforeAll(() => {
    const illuminationPath = resolve(__dirname, '../../illumination.tsx');
    illuminationSource = readFileSync(illuminationPath, 'utf-8');
  });

  describe('Scroll-based Effects Implementation', () => {
    it('should use useScroll from framer-motion', () => {
      expect(illuminationSource).toContain('useScroll');
    });

    it('should use useTransform for brightness adjustments', () => {
      expect(illuminationSource).toContain('brightness');
    });

    it('should use useSpring for smooth transitions', () => {
      expect(illuminationSource).toContain('useSpring');
    });

    it('should apply filter to background motion.div', () => {
      expect(illuminationSource).toContain('style={{ filter: imageFilter }}');
    });
  });

  describe('Background Image Pattern', () => {
    it('should import Image from next/image', () => {
      expect(illuminationSource).toContain('from "next/image"');
    });

    it('should use warehouse-lighting.jpg image', () => {
      expect(illuminationSource).toContain('warehouse-lighting.jpg');
    });

    it('should use object-cover for image sizing', () => {
      expect(illuminationSource).toContain('object-cover');
    });

    it('should have gradient overlays for text readability', () => {
      expect(illuminationSource).toContain('bg-linear-to-t');
      expect(illuminationSource).toContain('from-(--deep-black)');
    });
  });

  describe('Intersection Observer Pattern', () => {
    it('should use useIntersectionObserverAnimation hook', () => {
      expect(illuminationSource).toContain('useIntersectionObserverAnimation');
    });

    it('should initialize threshold at 0.3', () => {
      expect(illuminationSource).toContain('threshold: 0.3');
    });

    it('should pass inView to StatsGrid for animation triggering', () => {
      expect(illuminationSource).toContain('inView={inView}');
    });
  });

  describe('Layout Pattern — section-container consistency', () => {
    it('Illumination uses section-container + section-padding (not section-fluid)', () => {
      expect(illuminationSource).toContain('section-container');
      expect(illuminationSource).toContain('section-padding');
      expect(illuminationSource).not.toContain('section-fluid');
    });

    it('should have relative positioning with natural height for content-fit layout', () => {
      expect(illuminationSource).toContain('section-container section-padding relative');
      expect(illuminationSource).not.toContain('min-h-[120vh]');
    });

    it('should use z-0 for background and z-20 for content', () => {
      expect(illuminationSource).toContain('z-0');
      expect(illuminationSource).toContain('z-20');
    });
  });

  describe('Content Structure', () => {
    it('should have section-content class for horizontal gutters', () => {
      expect(illuminationSource).toContain('section-content');
    });

    it('should have motion.div for entrance animations', () => {
      expect(illuminationSource).toContain('motion.div');
    });

    it('should use whileInView for scroll-triggered animations', () => {
      expect(illuminationSource).toContain('whileInView');
      expect(illuminationSource).toContain('viewport={{ once: true }}');
    });
  });
});
