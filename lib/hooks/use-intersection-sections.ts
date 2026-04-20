import { useLayoutEffect, useState } from 'react';
import { getScrollOffset } from '@/lib/scroll-to-section';

interface UseIntersectionSectionsOptions {
  isActive?: boolean;
  sectionIds?: string[];
}

/**
 * Tracks which section is currently in viewport using IntersectionObserver.
 * Avoids useEffect to ensure observer syncs with rendering before paint.
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

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !isActive) return;

    // Get navbar + breadcrumb offset for rootMargin
    const offset = getScrollOffset({
      includeNavbar: true,
      includeBreadcrumb: true,
      baseGap: 38,
    });

    // Create observer with margin that accounts for fixed navbar + breadcrumb
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

          // Diagnostic logging
          console.log(`[scroll-diagnostics] Current section: ${topSection}`, {
            visibleCount: visibleEntries.length,
            offset,
            rootMargin: `-${offset}px 0px -60% 0px`,
          });
        }
      },
      {
        // Negative margin accounts for navbar + breadcrumb height
        // Negative bottom margin makes only top 40% count as "in viewport"
        rootMargin: `-${offset}px 0px -60% 0px`,
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
  }, [isActive, sectionIds]);

  return currentSection;
}
