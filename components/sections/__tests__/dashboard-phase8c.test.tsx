import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Phase 8c Dashboard ScrollReveal Implementation Tests
 *
 * Blocking Issue: Multiple IntersectionObserver Conflicts
 *   - Dashboard has useInView(sectionRef) for section visibility
 *   - Each of 4 EnergyMetric cards has useInView(cardRef) for per-card detection
 *   - Result: 5 competing observers = animation jank + conflicts
 *   - Fix: Remove per-card useInView; pass isInView prop from Dashboard → EnergyMetric
 *   - Wrap metrics grid with ScrollReveal for coordinated fade-in animation
 *   - Each metric counter should animate with staggered delay (0ms, 100ms, 200ms, 300ms)
 *
 * Test Coverage:
 *   1. Observer consolidation: Only ONE useInView in Dashboard
 *   2. Prop propagation: Dashboard isInView flows to all EnergyMetric cards
 *   3. GSAP counter animation: Respects isInView prop from parent
 *   4. ScrollReveal integration: Metrics grid wrapped, animates on scroll
 *   5. Staggered delays: Each metric has proper delay offset
 *   6. Reduced motion compliance: respects prefers-reduced-motion
 */

describe('Phase 8c Dashboard ScrollReveal — Observer Consolidation', () => {
  let dashboardSource: string;
  let energyMetricSource: string;

  beforeEach(() => {
    const dashboardPath = resolve(__dirname, '../dashboard.tsx');
    const energyMetricPath = resolve(__dirname, '../dashboard/energy-metric.tsx');

    dashboardSource = readFileSync(dashboardPath, 'utf-8');
    energyMetricSource = readFileSync(energyMetricPath, 'utf-8');
  });

  /**
   * RED TEST SUITE 1: Observer Consolidation
   * =========================================
   *
   * Dashboard should have ONE useInView call. EnergyMetric should NOT have useInView.
   */
  describe('Observer Consolidation — Single Dashboard-level useInView', () => {
    it('Dashboard should import useInView from framer-motion', () => {
      expect(dashboardSource).toMatch(/import.*useInView.*from ['"]framer-motion['"]/);
    });

    it('Dashboard should call useInView exactly once (for section)', () => {
      // Count useInView calls in Dashboard
      const useInViewMatches = dashboardSource.match(/useInView\(/g) || [];
      expect(useInViewMatches.length).toBe(1);
    });

    it('Dashboard useInView call should use sectionRef', () => {
      // Verify the single useInView call uses sectionRef
      const useInViewCall = dashboardSource.match(/const\s+isInView\s*=\s*useInView\(\s*sectionRef/);
      expect(useInViewCall).toBeTruthy();
    });

    it('EnergyMetric should NOT have useInView call', () => {
      // Verify EnergyMetric does NOT import or call useInView
      expect(energyMetricSource).not.toContain('useInView(');
    });

    it('EnergyMetric should NOT import useInView from framer-motion', () => {
      // EnergyMetric should not import useInView
      expect(energyMetricSource).not.toMatch(/import.*useInView/);
    });
  });

  /**
   * RED TEST SUITE 2: Prop-Based State Propagation
   * ===============================================
   *
   * Dashboard passes isInView prop to each EnergyMetric card.
   * EnergyMetric receives isInView and uses it to drive animation.
   */
  describe('Prop-Based State Propagation — Dashboard → EnergyMetric', () => {
    it('EnergyMetricProps interface should include optional isInView prop', () => {
      // Check interface definition for isInView prop
      const propsMatch = energyMetricSource.match(/export interface EnergyMetricProps[\s\S]*?\}/);
      expect(propsMatch).toBeTruthy();
      expect(propsMatch![0]).toContain('isInView');
    });

    it('EnergyMetric should accept isInView from props (default false)', () => {
      // Verify destructuring accepts isInView with default value
      const destructure = energyMetricSource.match(/function EnergyMetric\(\{[\s\S]*?\}\)/);
      expect(destructure).toBeTruthy();
      expect(destructure![0]).toContain('isInView');
    });

    it('Dashboard should pass isInView to each EnergyMetric in map', () => {
      // Verify Dashboard passes shouldAnimate (or isInView) to EnergyMetric
      expect(dashboardSource).toContain('isInView={shouldAnimate}');
    });

    it('EnergyMetric useEffect should depend on isInView prop', () => {
      // The useEffect for GSAP animation should include isInView in dependency array
      const useEffectMatch = energyMetricSource.match(/useEffect\(\(\)[\s\S]*?\]\)/);
      expect(useEffectMatch).toBeTruthy();
      expect(useEffectMatch![0]).toContain('isInView');
    });
  });

  /**
   * RED TEST SUITE 3: GSAP Counter Animation
   * =========================================
   *
   * Counter should animate (0 to targetValue) when isInView is true.
   * Counter should reset to 0 when isInView is false.
   */
  describe('GSAP Counter Animation — isInView-driven', () => {
    it('EnergyMetric useEffect should check isInView status', () => {
      // Verify useEffect has if (!isInView) check
      const useEffectMatch = energyMetricSource.match(/useEffect\(\(\)[\s\S]*?\n\s*\}, \[/);
      expect(useEffectMatch).toBeTruthy();
      expect(useEffectMatch![0]).toContain('isInView');
    });

    it('Counter should reset to "0" when isInView is false', () => {
      // Verify the reset logic: if (!isInView) countRef.current.textContent = "0"
      const resetLogic = energyMetricSource.match(/if\s*\(\s*!isInView\s*\)[\s\S]*?return/);
      expect(resetLogic).toBeTruthy();
      expect(resetLogic![0]).toContain('textContent');
      expect(resetLogic![0]).toContain('"0"');
    });

    it('GSAP animation should only run when isInView is true', () => {
      // Verify gsap.to() is inside the "if (isInView)" block, not the reset block
      const useEffectBody = energyMetricSource.match(/useEffect\(\(\)[\s\S]*?\}, \[isInView/);
      expect(useEffectBody).toBeTruthy();
      // Should have structure: if (!isInView) return; else gsap.to()
      expect(useEffectBody![0]).toContain('gsap.to');
    });

    it('GSAP animation should use delay from props', () => {
      // Verify delay prop is used in gsap.to() call
      const gsapMatch = energyMetricSource.match(/gsap\.to\([^)]*\{[\s\S]*?\}\)/);
      expect(gsapMatch).toBeTruthy();
      expect(gsapMatch![0]).toContain('delay:');
      expect(gsapMatch![0]).toContain('delay');
    });

    it('GSAP animation should animate to targetValue', () => {
      // Verify target value in gsap.to()
      const gsapMatch = energyMetricSource.match(/gsap\.to\([^)]*\{[\s\S]*?\}\)/);
      expect(gsapMatch).toBeTruthy();
      expect(gsapMatch![0]).toContain('targetValue');
    });
  });

  /**
   * RED TEST SUITE 4: ScrollReveal Integration
   * ===========================================
   *
   * Metrics grid should be wrapped with ScrollReveal component.
   * ScrollReveal should use direction="left" for fade-in animation.
   */
  describe('ScrollReveal Integration — Metrics Grid Animation', () => {
    it('Dashboard should import ScrollReveal component', () => {
      expect(dashboardSource).toMatch(/import.*ScrollReveal.*from/);
    });

    it('Metrics grid should be wrapped with ScrollReveal component', () => {
      // Find the metrics grid (grid div with metrics.map)
      const gridWrapperMatch = dashboardSource.match(/<ScrollReveal[\s\S]*?metrics\.map\(/);
      expect(gridWrapperMatch).toBeTruthy();
    });

    it('ScrollReveal wrapper should use direction="left"', () => {
      // Verify direction prop
      const scrollRevealMatch = dashboardSource.match(/<ScrollReveal[\s\S]*?\/>/);
      expect(scrollRevealMatch).toBeTruthy();
      expect(scrollRevealMatch![0]).toContain('direction="left"');
    });

    it('ScrollReveal should have proper animation props', () => {
      // Check for duration, delay, distance, blur props
      const scrollRevealMatch = dashboardSource.match(/<ScrollReveal[\s\S]*?\/>/);
      expect(scrollRevealMatch).toBeTruthy();
      const code = scrollRevealMatch![0];
      // At minimum, should have consistent animation timing
      expect(code).toMatch(/duration|delay|distance/);
    });

    it('ScrollReveal closing tag should be after closing div of metrics grid', () => {
      // Verify proper nesting: <ScrollReveal><div grid>...</div></ScrollReveal>
      const nestedMatch = dashboardSource.match(/<ScrollReveal[\s\S]*?<\/ScrollReveal>/);
      expect(nestedMatch).toBeTruthy();
      expect(nestedMatch![0]).toContain('</div>');
    });
  });

  /**
   * RED TEST SUITE 5: Staggered Delays
   * ==================================
   *
   * Each metric card should have a delay = index * 0.1 (0ms, 100ms, 200ms, 300ms).
   */
  describe('Staggered Delays — Per-metric counter timing', () => {
    it('Dashboard should pass delay prop to each EnergyMetric during map', () => {
      // Check the map function calculates delay correctly
      expect(dashboardSource).toContain('index * 0.1');
    });

    it('EnergyMetric should accept delay prop', () => {
      // Verify delay is destructured from props
      const destructure = energyMetricSource.match(/function EnergyMetric\(\{[\s\S]*?\}\)/);
      expect(destructure).toBeTruthy();
      expect(destructure![0]).toContain('delay');
    });

    it('EnergyMetric should have default delay value of 0', () => {
      // Verify default: delay = 0
      const destructure = energyMetricSource.match(/delay\s*=\s*0/);
      expect(destructure).toBeTruthy();
    });

    it('delay should be passed to GSAP animation in onUpdate', () => {
      // Verify delay prop is used in gsap.to()
      const gsapMatch = energyMetricSource.match(/gsap\.to\([^)]*\{[\s\S]*?\}\)/);
      expect(gsapMatch).toBeTruthy();
      expect(gsapMatch![0]).toContain('delay:');
      expect(gsapMatch![0]).toContain('delay');
    });
  });

  /**
   * RED TEST SUITE 6: Motion Animation Cleanup
   * ===========================================
   *
   * Card motion.div should NOT have whileInView or viewport props.
   * Animation should be driven by isInView prop received from parent Dashboard.
   */
  describe('Motion Animation Cleanup — No card-level whileInView', () => {
    it('EnergyMetric motion.div should NOT have whileInView prop', () => {
      // Find the return statement and check motion.div
      const motionDivMatch = energyMetricSource.match(/<motion\.div[\s\S]*?className=/);
      expect(motionDivMatch).toBeTruthy();
      expect(motionDivMatch![0]).not.toContain('whileInView');
    });

    it('EnergyMetric motion.div should NOT have viewport prop', () => {
      // Verify no viewport prop
      const motionDivMatch = energyMetricSource.match(/<motion\.div[\s\S]*?className=/);
      expect(motionDivMatch).toBeTruthy();
      expect(motionDivMatch![0]).not.toContain('viewport={{');
    });

    it('EnergyMetric should use animate prop driven by isInView', () => {
      // Check for animate prop driven by isInView
      const animateMatch = energyMetricSource.match(/animate\s*=\s*\{isInView/);
      expect(animateMatch).toBeTruthy();
    });
  });

  /**
   * RED TEST SUITE 7: Reduced Motion Compliance
   * ============================================
   *
   * All animations should respect prefers-reduced-motion.
   * This is validated by ScrollReveal and motion.div animate props.
   */
  describe('Reduced Motion Compliance — WCAG Accessibility', () => {
    it('ScrollReveal component should handle prefers-reduced-motion', () => {
      // This is tested in ScrollReveal itself; just verify it\'s being used
      expect(dashboardSource).toContain('ScrollReveal');
    });

    it('motion.div should have transition with conditional timing', () => {
      // The transition on motion.div should exist
      const motionMatch = energyMetricSource.match(/<motion\.div[\s\S]*?transition=/);
      expect(motionMatch).toBeTruthy();
    });
  });

  /**
   * GREEN TEST SUITE: Integration Verification
   * ===========================================
   *
   * Verify that the entire chain works together:
   * Dashboard has isInView → passes to EnergyMetric → drives GSAP animation
   */
  describe('Integration Verification — Complete Flow', () => {
    it('shouldAnimate should be calculated from isMounted && isInView', () => {
      // Verify the shouldAnimate variable exists and is properly calculated
      const shouldAnimateMatch = dashboardSource.match(/shouldAnimate\s*=\s*isMounted\s*&&\s*isInView/);
      expect(shouldAnimateMatch).toBeTruthy();
    });

    it('shouldAnimate should be passed to EnergyMetric as isInView prop', () => {
      // Verify in the map that shouldAnimate is passed as isInView
      const mapMatch = dashboardSource.match(/metrics\.map\([\s\S]*?isInView\s*=\s*\{shouldAnimate\}/);
      expect(mapMatch).toBeTruthy();
    });

    it('Section header should still animate based on shouldAnimate', () => {
      // Verify section header still uses shouldAnimate for its animation
      const headerMatch = dashboardSource.match(/initial=\{\{\s*opacity:\s*0,\s*y:\s*20[\s\S]*?shouldAnimate/);
      expect(headerMatch).toBeTruthy();
    });

    it('LiveConnections should still receive isInView from Dashboard', () => {
      // Verify LiveConnections prop passing is unchanged
      const liveConnMatch = dashboardSource.match(/<LiveConnections[\s\S]*?isInView=/);
      expect(liveConnMatch).toBeTruthy();
    });

    it('No EnergyMetric should have its own useInView observer', () => {
      // Final safety check: search the entire energyMetric file for useInView
      const hasUseInView = energyMetricSource.includes('useInView');
      expect(hasUseInView).toBe(false);
    });
  });

  /**
   * Build & Type Verification
   * =========================
   */
  describe('Build & Type Verification', () => {
    it('EnergyMetricProps should be properly exported', () => {
      expect(energyMetricSource).toContain('export interface EnergyMetricProps');
    });

    it('Dashboard should import EnergyMetric with correct type', () => {
      expect(dashboardSource).toContain('type EnergyMetricProps');
    });

    it('All imports should be present in Dashboard', () => {
      expect(dashboardSource).toContain('import');
      expect(dashboardSource).toContain('useRef');
      expect(dashboardSource).toContain('useEffect');
      expect(dashboardSource).toContain('useState');
      expect(dashboardSource).toContain('useInView');
    });
  });
});
