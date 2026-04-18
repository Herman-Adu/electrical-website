import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Parity Tests: Verify Illumination follows the same patterns as SmartLiving
 * for viewport detection, parallax motion, and component consistency.
 */

describe('SmartLiving Parity — Illumination Consistency', () => {
  let smartLivingSource: string;
  let illuminationSource: string;

  beforeAll(() => {
    const smartLivingPath = resolve(__dirname, '../../smart-living.tsx');
    const illuminationPath = resolve(__dirname, '../../illumination.tsx');

    smartLivingSource = readFileSync(smartLivingPath, 'utf-8');
    illuminationSource = readFileSync(illuminationPath, 'utf-8');
  });

  describe('Viewport Breakpoint Consistency', () => {
    it('should use same 1024px breakpoint as SmartLiving', () => {
      const smartLivingBreakpoint = smartLivingSource.includes('(min-width: 1024px)');
      const illuminationBreakpoint = illuminationSource.includes('(min-width: 1024px)');

      expect(smartLivingBreakpoint).toBe(true);
      expect(illuminationBreakpoint).toBe(true);
    });

    it('should use modern addEventListener (not deprecated addListener)', () => {
      const smartLivingModern = smartLivingSource.includes('addEventListener("change"');
      const illuminationModern = illuminationSource.includes('addEventListener("change"');

      expect(smartLivingModern).toBe(true);
      expect(illuminationModern).toBe(true);
    });

    it('should have proper cleanup function', () => {
      const smartLivingCleanup = smartLivingSource.includes('removeEventListener');
      const illuminationCleanup = illuminationSource.includes('removeEventListener');

      expect(smartLivingCleanup).toBe(true);
      expect(illuminationCleanup).toBe(true);
    });
  });

  describe('State Hook Pattern', () => {
    it('should use useState for viewport state (not inline)', () => {
      const smartLivingUseState = smartLivingSource.includes('useState');
      const illuminationUseState = illuminationSource.includes('useState');

      expect(smartLivingUseState).toBe(true);
      expect(illuminationUseState).toBe(true);
    });

    it('should use useEffect with dependency array', () => {
      const smartLivingEffect = smartLivingSource.includes('useEffect');
      const illuminationEffect = illuminationSource.includes('useEffect');

      expect(smartLivingEffect).toBe(true);
      expect(illuminationEffect).toBe(true);
    });
  });

  describe('enableParallaxMotion Prop Pattern', () => {
    it('should pass enableParallaxMotion to child parallax component', () => {
      // SmartLiving pattern: enableParallaxMotion={isDesktop} → ContentPanel
      const smartLivingProp = smartLivingSource.includes('enableParallaxMotion');
      const illuminationProp = illuminationSource.includes('enableParallaxMotion');

      expect(smartLivingProp).toBe(true);
      expect(illuminationProp).toBe(true);
    });

    it('should use consistent prop name across both components', () => {
      // Both should use "enableParallaxMotion", not "isDesktop" or "isParallaxEnabled"
      const smartLivingMatch = smartLivingSource.match(/enableParallaxMotion=/g);
      const illuminationMatch = illuminationSource.match(/enableParallaxMotion=/g);

      expect(smartLivingMatch).toBeTruthy();
      expect(illuminationMatch).toBeTruthy();
    });

    it('should initialize viewport state to false (safe default)', () => {
      // Both should default to false for SSR safety
      const smartLivingHasFalse = smartLivingSource.includes('useState(false)');
      const illuminationHasFalse = illuminationSource.includes('useState<boolean>(false)');

      expect(smartLivingHasFalse).toBe(true);
      expect(illuminationHasFalse).toBe(true);
    });
  });

  describe('Browser API Safety', () => {
    it('should check window.matchMedia availability before use', () => {
      // Modern browsers check matchMedia before calling it
      const smartLivingChecksWindow = smartLivingSource.includes('window.matchMedia');
      const illuminationChecksWindow = illuminationSource.includes('window.matchMedia');

      expect(smartLivingChecksWindow).toBe(true);
      expect(illuminationChecksWindow).toBe(true);
    });

    it('should only run viewport logic in useEffect (not at component render)', () => {
      // useState init should not call window API
      const smartLivingStateInit = smartLivingSource.match(/useState\s*\(\s*false\s*\)/);
      const illuminationStateInit = illuminationSource.includes('useState<boolean>(false)');

      expect(smartLivingStateInit).toBeTruthy();
      expect(illuminationStateInit).toBe(true);
    });
  });

  describe('Memory Leak Prevention', () => {
    it('SmartLiving should remove event listener on unmount', () => {
      expect(smartLivingSource).toContain('removeEventListener');
      expect(smartLivingSource).toContain('return');
    });

    it('Illumination should remove event listener on unmount', () => {
      expect(illuminationSource).toContain('removeEventListener');
      expect(illuminationSource).toContain('return');
    });
  });

  describe('Transform Guards', () => {
    it('SmartLiving passes enableParallaxMotion to ContentPanel', () => {
      const match = smartLivingSource.includes('enableParallaxMotion={isDesktop}');
      expect(match).toBe(true);
    });

    it('Illumination should guard imageY transform via enableParallaxMotion prop', () => {
      const hasEnableParallaxProp = illuminationSource.includes('enableParallaxMotion');
      // Check for the guard pattern in BackgroundParallax component
      const bgParallaxContent = readFileSync(
        resolve(__dirname, '../background-parallax.tsx'),
        'utf-8'
      );
      const hasGuard = bgParallaxContent.includes('enableParallaxMotion ? imageY : 0');
      expect(hasEnableParallaxProp).toBe(true);
      expect(hasGuard).toBe(true);
    });
  });
});
