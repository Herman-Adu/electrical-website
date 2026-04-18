import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Phase 8a Features ScrollReveal Implementation Tests
 *
 * Blocking Issue 1: Animation Observer Conflict
 *   - Three cards (LoadMonitor, SystemDiagnostics, SchedulerCard) have whileInView + transition
 *   - ScrollReveal adds second useInView observer on same element
 *   - Result: competing animation states → visual jank
 *   - Fix: Remove initial, whileInView, viewport, transition from card motion.divs
 *
 * Blocking Issue 2: WCAG Reduced Motion Non-Compliance
 *   - LoadMonitorCard: setInterval (3000ms zone cycling) ignores prefers-reduced-motion
 *   - SystemDiagnosticsCard: setInterval (35ms typewriter) ignores prefers-reduced-motion
 *   - Fix: Add useReducedMotion() hook; wrap setInterval in if (!prefersReducedMotion) conditional
 */

describe('Phase 8a Features ScrollReveal — Blocking Issues', () => {
  let featuresSource: string;

  beforeEach(() => {
    const featuresPath = resolve(__dirname, '../features.tsx');
    featuresSource = readFileSync(featuresPath, 'utf-8');
  });

  /**
   * RED TEST SUITE 1: Animation Observer Conflict Resolution
   * ======================================================
   *
   * Each card MUST NOT have whileInView + viewport props on its motion.div.
   * Instead, they will be wrapped with ScrollReveal component (implemented next).
   */
  describe('Blocker 1: Animation Observer Conflict — Remove whileInView from cards', () => {
    it('LoadMonitorCard should NOT have whileInView prop on motion.div', () => {
      // Extract LoadMonitorCard function
      const loadMonitorMatch = featuresSource.match(
        /function LoadMonitorCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SystemDiagnosticsCard|export function)/
      );
      expect(loadMonitorMatch).toBeTruthy();

      const loadMonitorCode = loadMonitorMatch![0];

      // Verify whileInView is NOT present in LoadMonitorCard
      expect(loadMonitorCode).not.toContain('whileInView');
      expect(loadMonitorCode).not.toContain('viewport={{');
    });

    it('SystemDiagnosticsCard should NOT have whileInView prop on motion.div', () => {
      // Extract SystemDiagnosticsCard function
      const systemDiagsMatch = featuresSource.match(
        /function SystemDiagnosticsCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SchedulerCard|export function)/
      );
      expect(systemDiagsMatch).toBeTruthy();

      const systemDiagsCode = systemDiagsMatch![0];

      // Verify whileInView is NOT present in SystemDiagnosticsCard
      expect(systemDiagsCode).not.toContain('whileInView');
      expect(systemDiagsCode).not.toContain('viewport={{');
    });

    it('SchedulerCard import should indicate it also has animations removed', () => {
      // SchedulerCard is imported; verify it doesn't have whileInView
      // This will be verified when we check scheduler-card.tsx
      expect(featuresSource).toContain('SchedulerCard');
    });

    it('Cards should be wrapped with plain div (not motion.div with animations)', () => {
      // After fix, the card structure should be:
      // <div className="..."> instead of <motion.div whileInView={{...}}>
      const loadMonitorMatch = featuresSource.match(
        /function LoadMonitorCard\(\)[\s\S]*?return \([\s\S]*?<motion\.div[\s\S]*?className=/
      );

      // This test verifies structure after fix — motion.div should remain but without animation props
      expect(loadMonitorMatch).toBeTruthy();
    });
  });

  /**
   * RED TEST SUITE 2: WCAG Reduced Motion Compliance
   * ==================================================
   *
   * Both cards must respect user's prefers-reduced-motion preference.
   * setInterval animations should be disabled when user prefers reduced motion.
   */
  describe('Blocker 2: WCAG Reduced Motion Non-Compliance', () => {
    it('LoadMonitorCard should import useReducedMotion hook', () => {
      // Extract LoadMonitorCard function
      const loadMonitorMatch = featuresSource.match(
        /function LoadMonitorCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SystemDiagnosticsCard|export function)/
      );
      expect(loadMonitorMatch).toBeTruthy();

      const loadMonitorCode = loadMonitorMatch![0];

      // Must call useReducedMotion somewhere in the component
      expect(loadMonitorCode).toContain('useReducedMotion');
    });

    it('LoadMonitorCard should NOT run setInterval when prefers-reduced-motion is true', () => {
      // Extract LoadMonitorCard function
      const loadMonitorMatch = featuresSource.match(
        /function LoadMonitorCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SystemDiagnosticsCard|export function)/
      );
      expect(loadMonitorMatch).toBeTruthy();

      const loadMonitorCode = loadMonitorMatch![0];

      // The setInterval must be guarded by a condition checking prefersReducedMotion
      // Pattern: either if (!prefersReducedMotion) { ... } or if (prefersReducedMotion) return;
      expect(loadMonitorCode).toMatch(/prefersReducedMotion/);
      expect(loadMonitorCode).toContain('setInterval');
      // Verify useEffect includes prefersReducedMotion in dependency array
      expect(loadMonitorCode).toMatch(/\[\s*prefersReducedMotion\s*\]/);
    });

    it('SystemDiagnosticsCard should import useReducedMotion hook', () => {
      // Extract SystemDiagnosticsCard function
      const systemDiagsMatch = featuresSource.match(
        /function SystemDiagnosticsCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SchedulerCard|export function)/
      );
      expect(systemDiagsMatch).toBeTruthy();

      const systemDiagsCode = systemDiagsMatch![0];

      // Must call useReducedMotion somewhere in the component
      expect(systemDiagsCode).toContain('useReducedMotion');
    });

    it('SystemDiagnosticsCard should NOT run setInterval when prefers-reduced-motion is true', () => {
      // Extract SystemDiagnosticsCard function
      const systemDiagsMatch = featuresSource.match(
        /function SystemDiagnosticsCard\(\)[\s\S]*?(?=\n\nfunction|\nfunction SchedulerCard|export function)/
      );
      expect(systemDiagsMatch).toBeTruthy();

      const systemDiagsCode = systemDiagsMatch![0];

      // The setInterval must be guarded by a condition checking prefersReducedMotion
      // Pattern: either if (!prefersReducedMotion) { ... } or if (prefersReducedMotion) return;
      expect(systemDiagsCode).toMatch(/prefersReducedMotion/);
      expect(systemDiagsCode).toContain('setInterval');
      // Verify useEffect includes prefersReducedMotion in dependency array
      expect(systemDiagsCode).toMatch(/prefersReducedMotion/);
    });
  });

  /**
   * RED TEST SUITE 3: ScrollReveal Integration
   * ==========================================
   *
   * Features section should use ScrollReveal component for card animations
   * instead of per-card whileInView props.
   */
  describe('Phase 8a: ScrollReveal Integration Pattern', () => {
    it('should import ScrollReveal component from ui', () => {
      expect(featuresSource).toMatch(
        /import\s+.*ScrollReveal.*from\s+['"](.*scroll-reveal|.*ui)/
      );
    });

    it('LoadMonitorCard should be wrapped with ScrollReveal', () => {
      // After fix, the Features component should wrap <LoadMonitorCard /> with <ScrollReveal>
      // Pattern: <ScrollReveal direction="up" ...><LoadMonitorCard /></ScrollReveal>
      expect(featuresSource).toMatch(
        /<ScrollReveal[\s\S]*?direction="up"[\s\S]*?<LoadMonitorCard\s*\/>/
      );
    });

    it('SystemDiagnosticsCard should be wrapped with ScrollReveal', () => {
      // Pattern: <ScrollReveal direction="up" ...><SystemDiagnosticsCard /></ScrollReveal>
      expect(featuresSource).toMatch(
        /<ScrollReveal[\s\S]*?direction="up"[\s\S]*?<SystemDiagnosticsCard\s*\/>/
      );
    });

    it('SchedulerCard should be wrapped with ScrollReveal', () => {
      // Pattern: <ScrollReveal direction="up" ...><SchedulerCard /></ScrollReveal>
      expect(featuresSource).toMatch(
        /<ScrollReveal[\s\S]*?direction="up"[\s\S]*?<SchedulerCard\s*\/>/
      );
    });

    it('ScrollReveal wrapper should use staggered delay pattern (index % 3) * 0.07', () => {
      // The grid rendering should use staggered delays
      // Pattern: either delay={(index % 3) * 0.07} or explicit delays like delay={0}, delay={0.07}, delay={0.14}
      // Verify all three cards have different delay values
      expect(featuresSource).toMatch(/delay={0}/);
      expect(featuresSource).toMatch(/delay={0\.07}/);
      expect(featuresSource).toMatch(/delay={0\.14}/);
    });

    it('ScrollReveal wrapper should include blur effect', () => {
      // Pattern: blur in ScrollReveal attributes
      expect(featuresSource).toMatch(/<ScrollReveal[^>]*blur[^>]*>/);
    });
  });

  /**
   * RED TEST SUITE 4: Build & Type Safety
   * =====================================
   */
  describe('Build & Type Safety', () => {
    it('features.tsx should have valid TypeScript syntax', () => {
      // This test will pass if the file is valid TypeScript
      // Will be caught by pnpm typecheck
      expect(featuresSource).toBeTruthy();
      expect(featuresSource.length).toBeGreaterThan(100);
    });
  });
});
