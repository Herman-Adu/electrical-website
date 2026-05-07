"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { projectCategories } from "@/data/projects";
import type { ProjectCategorySlug } from "@/types/projects";

export interface ProjectCategorySliderProps {
  counts?: Record<string, number>;
  className?: string;
}

interface CategoryOption {
  slug: ProjectCategorySlug;
  label: string;
}

// Only the four isSector categories are shown in the slider. Non-sector slugs
// (commercial-lighting, power-boards) are not surfaced as primary filter chips.
const CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { slug: "all", label: "All" },
  ...projectCategories
    .filter((c) => c.isSector)
    .map(({ slug, label }) => ({ slug, label })),
] as const;

export const VALID_SLUGS = new Set<ProjectCategorySlug>(
  CATEGORY_OPTIONS.map((c) => c.slug),
);

function isValidSlug(value: string | null): value is ProjectCategorySlug {
  return value !== null && VALID_SLUGS.has(value as ProjectCategorySlug);
}

// Chip base class — matches spec exactly (no shadow on base state).
const CHIP_BASE_CLASS =
  "inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20";

// Chip active class — matches spec exactly (no shadow on active state).
const CHIP_ACTIVE_CLASS = "bg-electric-cyan/20 ring-1 ring-electric-cyan/50";

export function ProjectCategorySlider({
  counts,
  className,
}: ProjectCategorySliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const rawCategory = searchParams?.get("category") ?? null;
  const active: ProjectCategorySlug = isValidSlug(rawCategory)
    ? rawCategory
    : "all";

  const activeChipRef = useRef<HTMLButtonElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Scroll the rail horizontally only — avoids scrollIntoView touching page vertical scroll.
  useEffect(() => {
    const chip = activeChipRef.current;
    const rail = sliderRef.current;
    if (!chip || !rail) return;
    const chipCenter = chip.offsetLeft + chip.offsetWidth / 2;
    rail.scrollLeft = chipCenter - rail.offsetWidth / 2;
  }, [active]);

  // Mouse wheel support — map both horizontal and vertical delta to scrollLeft so
  // chips beyond the visible rail are reachable without touch/trackpad.
  // { passive: false } is required to allow e.preventDefault().
  useEffect(() => {
    const rail = sliderRef.current;
    if (!rail) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      rail.scrollLeft += e.deltaX || e.deltaY;
    };
    rail.addEventListener("wheel", handleWheel, { passive: false });
    return () => rail.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse drag-to-scroll — lets desktop users click-drag the rail horizontally.
  // Suppresses click-through on buttons after a drag gesture.
  useEffect(() => {
    const rail = sliderRef.current;
    if (!rail) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hasMoved = false;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      hasMoved = false;
      startX = e.clientX;
      startScrollLeft = rail.scrollLeft;
      rail.style.cursor = "grabbing";
      rail.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      if (e.buttons === 0) {
        // mouse button released outside the window — clean up
        isDown = false;
        rail.style.cursor = "";
        rail.style.userSelect = "";
        return;
      }
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) hasMoved = true;
      rail.scrollLeft = startScrollLeft - dx;
    };

    const onMouseUp = () => {
      isDown = false;
      rail.style.cursor = "";
      rail.style.userSelect = "";
    };

    // Suppress click-through after drag
    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
        hasMoved = false;
      }
    };

    rail.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    rail.addEventListener("click", onClickCapture, true);

    return () => {
      rail.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      rail.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  const handleSelect = (slug: ProjectCategorySlug) => {
    if (slug === active) return;
    const target =
      slug === "all" ? "/projects" : `/projects?category=${slug}`;
    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  };

  // Sticky chip rail — pins below the global header on scroll. Requires NO
  // `overflow: hidden` ancestor between this nav and the viewport (verified
  // in `projects-list-section.tsx`, which intentionally omits overflow-hidden).
  // Top offsets (top-26 / lg:top-30) match the global header height.
  const navClassName = [
    "sticky top-26 lg:top-30 z-30 bg-background/95 backdrop-blur-md",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav aria-label="Filter projects by category" className={navClassName}>
      <div
        ref={sliderRef}
        className="w-full overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)]"
      >
        <ul className="flex w-max gap-2 pl-2 pr-8 py-3" role="list">
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = option.slug === active;
            return (
              <li key={option.slug} className="shrink-0">
                <button
                  ref={isActive ? activeChipRef : null}
                  type="button"
                  onClick={() => handleSelect(option.slug)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    CHIP_BASE_CLASS,
                    isActive ? CHIP_ACTIVE_CLASS : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {option.label}
                  <span className="ml-1 opacity-70">
                    {counts?.[option.slug] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
