import { useLayoutEffect, useState, useRef } from 'react';
import { getScrollOffset } from '@/lib/scroll-to-section';

interface UseIntersectionSectionsOptions {
  isActive?: boolean;
  sectionIds?: string[];
}

/**
 * Tracks which section is currently in viewport using IntersectionObserver.
 * Adjusts detection based on scroll direction:
 * - DOWN: Activate when section top reaches navbar
 * - UP: Activate when section is visible in viewport
 *
 * @param isActive - Only observe when true (e.g., dropdown is hovered)
 * @param sectionIds - Section IDs to observe; auto-detected if omitted
 * @returns ID of section currently in viewport, or null
 */
export function useIntersectionSections(
  isActive = true,
  sectionIds: string[] = [],
): string | null {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const prevScrollYRef = useRef(0);

  // Track scroll direction
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isActive) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollYRef.current) {
        setScrollDirection('down');
      } else if (currentScrollY < prevScrollYRef.current) {
        setScrollDirection('up');
      }
      prevScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isActive]);

  // Create observer with scroll-direction-aware rootMargin
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isActive) return;

    // Get navbar + breadcrumb offset for rootMargin
    const offset = getScrollOffset({
      includeNavbar: true,
      includeBreadcrumb: true,
      baseGap: 38,
    });

    // Adjust rootMargin based on scroll direction:
    // DOWN: Activate at section top (top 40% of viewport)
    // UP: Activate when section is visible (full height below navbar)
    const rootMarginValue = scrollDirection === 'up'
      ? `-${offset}px 0px 0px 0px`     // UP: Any part visible (full height)
      : `-${offset}px 0px -60% 0px`;   // DOWN: Only top 40% counts

    // Create observer with directional rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.length) return;

        // Find sections that are intersecting, sorted by viewport position
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );

        if (visibleEntries.length > 0) {
          const topSection = visibleEntries[0].target.id;
          setCurrentSection(topSection);

          console.log(`[scroll-diagnostics] Current section: ${topSection}`, {
            visibleCount: visibleEntries.length,
            offset,
            scrollDirection,
            rootMargin: rootMarginValue,
          });
        }
      },
      {
        rootMargin: rootMarginValue,
        threshold: [0, 0.25, 0.5],
      },
    );

    // Observe all section elements
    const sectionsToObserve = sectionIds.length > 0 ? sectionIds :
      Array.from(document.querySelectorAll('section[id]')).map(s => s.id);

    sectionsToObserve.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isActive, sectionIds, scrollDirection]);

  return currentSection;
}
