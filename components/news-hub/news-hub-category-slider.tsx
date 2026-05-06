"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { newsCategories } from "@/data/news";
import type { NewsCategorySlug } from "@/types/news";

interface NewsHubCategorySliderProps {
  className?: string;
}

interface CategoryOption {
  slug: NewsCategorySlug;
  label: string;
}

// Prepend synthetic "all" entry — newsCategories excludes it by design (NewsCategory.slug
// is `Exclude<NewsCategorySlug, "all">`). Label kept short for chip width.
const CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { slug: "all", label: "All" },
  ...newsCategories.map(({ slug, label }) => ({ slug, label })),
] as const;

const VALID_SLUGS = new Set<NewsCategorySlug>(
  CATEGORY_OPTIONS.map((c) => c.slug),
);

function isValidSlug(value: string | null): value is NewsCategorySlug {
  return value !== null && VALID_SLUGS.has(value as NewsCategorySlug);
}

// Verbatim from components/news-hub/news-hub-article-card.tsx:111 ("Read Article" link)
const CHIP_BASE_CLASS =
  "inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,189,0.15)]";

const CHIP_ACTIVE_CLASS =
  "bg-electric-cyan/20 ring-1 ring-electric-cyan/50 shadow-[0_0_15px_rgba(0,243,189,0.15)]";

export function NewsHubCategorySlider({
  className,
}: NewsHubCategorySliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const rawCategory = searchParams?.get("category") ?? null;
  const active: NewsCategorySlug = isValidSlug(rawCategory)
    ? rawCategory
    : "all";

  const activeChipRef = useRef<HTMLButtonElement | null>(null);

  // Center the active chip in the horizontal scroll viewport whenever the
  // active category changes (driven by URL).
  useEffect(() => {
    const node = activeChipRef.current;
    if (node === null) return;
    node.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      block: "nearest",
    });
  }, [active]);

  const handleSelect = (slug: NewsCategorySlug) => {
    if (slug === active) return;
    const target = slug === "all" ? "/news-hub" : `/news-hub?category=${slug}`;
    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  };

  // Sticky chip rail — pins below the global header on scroll. Requires NO
  // `overflow: hidden` ancestor between this nav and the viewport (verified
  // in `news-hub-grid-section.tsx`, which intentionally omits overflow-hidden).
  // Top offsets (top-26 / lg:top-30) match the global header height.
  const navClassName = [
    "sticky top-26 lg:top-30 z-30 bg-background/95 backdrop-blur-md",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav aria-label="Filter articles by category" className={navClassName}>
      <ul
        className="flex overflow-x-auto snap-x snap-mandatory scroll-px-4 gap-2 px-2 py-3 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,black_24px,black_calc(100%-24px),transparent_100%)]"
        role="list"
      >
        {CATEGORY_OPTIONS.map((option) => {
          const isActive = option.slug === active;
          return (
            <li key={option.slug} className="snap-start shrink-0">
              <button
                ref={isActive ? activeChipRef : null}
                type="button"
                onClick={() => handleSelect(option.slug)}
                aria-current={isActive ? "page" : undefined}
                className={[CHIP_BASE_CLASS, isActive ? CHIP_ACTIVE_CLASS : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
