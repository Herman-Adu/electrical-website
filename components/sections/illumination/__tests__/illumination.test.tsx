import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Illumination Component Tests - Unit & Code Structure Verification
 *
 * These tests verify the viewport guard state implementation, opacity fix,
 * and hook setup without requiring complex Framer Motion mocking.
 */

describe('Illumination Component Implementation', () => {
  let illuminationSource: string;

  beforeEach(() => {
    const illuminationPath = resolve(__dirname, '../../illumination.tsx');
    illuminationSource = readFileSync(illuminationPath, 'utf-8');
  });

  describe('Viewport State Management', () => {
    it('should import useState and useEffect hooks', () => {
      expect(illuminationSource).toContain('import { useRef, useEffect, useState }');
    });

    it('should initialize enableParallaxMotion with useState<boolean>(false)', () => {
      expect(illuminationSource).toContain('const [enableParallaxMotion, setEnableParallaxMotion] = useState<boolean>(false)');
    });

    it('should set up useEffect with empty dependency array', () => {
      expect(illuminationSource).toContain('useEffect(() => {');
      expect(illuminationSource).toContain('}, [])');
    });

    it('should use window.matchMedia for viewport detection', () => {
      expect(illuminationSource).toContain('window.matchMedia("(min-width: 1024px)")');
    });

    it('should call updateViewportMode on initial load', () => {
      expect(illuminationSource).toContain('updateViewportMode()');
    });

    it('should use modern addEventListener API', () => {
      expect(illuminationSource).toContain('mediaQuery.addEventListener("change"');
    });

    it('should remove event listener on unmount', () => {
      expect(illuminationSource).toContain('return () => mediaQuery.removeEventListener("change"');
    });
  });

  describe('Opacity Animation Curve Fix', () => {
    it('should have fixed opacity keyframes [0, 0.15, 0.8, 1]', () => {
      const opacityMatch = illuminationSource.match(/useTransform\s*\(\s*scrollYProgress\s*,\s*\[\s*0\s*,\s*0\.15\s*,\s*0\.8\s*,\s*1\s*\]/);
      expect(opacityMatch).toBeTruthy();
    });

    it('should have fixed opacity values [1, 1, 1, 0] (starts visible)', () => {
      const opacityMatch = illuminationSource.match(/,\s*\[\s*1\s*,\s*1\s*,\s*1\s*,\s*0\s*\]\s*\)/);
      expect(opacityMatch).toBeTruthy();
    });

    it('should have comment explaining the opacity fix', () => {
      expect(illuminationSource).toContain('FIXED');
      expect(illuminationSource).toContain('visible on scroll arrival');
    });
  });

  describe('Props & Consistency', () => {
    it('should pass enableParallaxMotion prop to BackgroundParallax', () => {
      expect(illuminationSource).toContain('enableParallaxMotion={enableParallaxMotion}');
    });

    it('should pass imageY prop to BackgroundParallax', () => {
      expect(illuminationSource).toContain('imageY={imageY}');
    });

    it('should pass brightnessOverlayOpacity prop to BackgroundParallax', () => {
      expect(illuminationSource).toContain('brightnessOverlayOpacity={brightnessOverlayOpacity}');
    });

    it('should have containerRef for scroll tracking', () => {
      expect(illuminationSource).toContain('const containerRef = useRef<HTMLElement>(null)');
      expect(illuminationSource).toContain('useScroll({');
      expect(illuminationSource).toContain('target: containerRef');
    });
  });

  describe('No Breaking Changes', () => {
    it('should still have useIntersectionObserverAnimation hook', () => {
      expect(illuminationSource).toContain('useIntersectionObserverAnimation');
    });

    it('should still render stats grid', () => {
      expect(illuminationSource).toContain('StatsGrid');
    });

    it('should still render scan effects', () => {
      expect(illuminationSource).toContain('ScanEffects');
    });

    it('should still use SectionWrapper', () => {
      expect(illuminationSource).toContain('SectionWrapper');
    });

    it('should maintain section id "illumination"', () => {
      expect(illuminationSource).toContain('id="illumination"');
    });
  });
});
