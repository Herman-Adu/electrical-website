import Link from "next/link";
import type { BreadcrumbItem } from "@/types/shared-content";
import { BreadcrumbMobileToggle } from "./breadcrumb-mobile-toggle";

interface ContentBreadcrumbProps {
  /** Breadcrumb items - last item is current page */
  items: BreadcrumbItem[];
  /** Section identifier for styling */
  section: "projects" | "news" | "services" | "home" | "about" | "contact";
}

/**
 * Shared breadcrumb component using CSS sticky positioning.
 * Server component with minimal client island for mobile expand/collapse.
 *
 * Usage:
 * - Render directly below the hero section
 * - CSS sticky handles docking below navbar automatically
 * - Sidebar sticky offset should be 128px (80px nav + 40px breadcrumb + 8px gap)
 */
export function ContentBreadcrumb({ items, section }: ContentBreadcrumbProps) {
  // Guard: need at least one item
  if (!items.length) return null;

  // Split items: first, middle (collapsible on mobile), last (current)
  const firstItem = items[0];
  const middleItems = items.slice(1, -1);
  // When only one item, firstItem and lastItem are the same
  const lastItem = items.length > 1 ? items[items.length - 1] : null;
  const isSingleItem = items.length === 1;

  return (
    <div
      data-section={section}
      data-sticky-breadcrumb="true"
      className="sticky top-16 lg:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-electric-cyan/20"
    >
      <div className="section-content max-w-7xl py-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground overflow-hidden"
        >
          {/* Single item — current page only (e.g. Home) */}
          {isSingleItem ? (
            <span
              className="text-electric-cyan truncate min-w-0 font-medium"
              aria-current="page"
            >
              {firstItem.label}
            </span>
          ) : (
            <>
              {/* First link — always visible */}
              <Link
                href={firstItem.href}
                className="shrink-0 hover:text-electric-cyan transition-colors"
              >
                {firstItem.label}
              </Link>
              <span className="shrink-0 text-muted-foreground/40">/</span>

              {/* Desktop: show all middle links */}
              <div className="hidden sm:contents">
                {middleItems.map((item) => (
                  <div key={item.href} className="contents">
                    <Link
                      href={item.href}
                      className="shrink-0 hover:text-electric-cyan transition-colors"
                    >
                      {item.label}
                    </Link>
                    <span className="shrink-0 text-muted-foreground/40">/</span>
                  </div>
                ))}
              </div>

              {/* Mobile: expandable middle items */}
              <BreadcrumbMobileToggle items={middleItems} />

              {/* Last item — current page, always visible */}
              <span
                className="text-electric-cyan truncate min-w-0 font-medium"
                aria-current="page"
              >
                {lastItem!.label}
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
