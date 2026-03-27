import * as React from "react";
import { cn } from "@/lib/utils";

type ResponsiveValue<T> = T | Partial<Record<"default" | "sm" | "md" | "lg" | "xl" | "2xl", T>>;

interface ComponentGridProps extends React.ComponentProps<"div"> {
  /**
   * Number of columns at each breakpoint.
   * Can be a single number or an object with breakpoint-specific values.
   *
   * @example
   * cols={3}                              // Always 3 columns
   * cols={{ default: 1, md: 2, lg: 4 }} // 1 on mobile, 2 on tablet, 4 on desktop
   */
  cols?: ResponsiveValue<number>;

  /**
   * Gap between grid items (applies to both row and column gaps).
   * Can be a Tailwind gap value (e.g., "4", "6", "8") or an object with breakpoint-specific values.
   *
   * @example
   * gap="4"                           // gap-4 everywhere
   * gap={{ default: "3", md: "6" }}  // gap-3 on mobile, gap-6 on desktop
   */
  gap?: ResponsiveValue<string>;

  /**
   * Enable CSS Grid auto-fit behavior with a minimum item width.
   * When enabled, the grid automatically calculates columns based on available space.
   * Example: autoFit="minmax(250px, 1fr)" creates flexible columns that shrink to 250px minimum.
   *
   * Note: When using autoFit, the `cols` prop is ignored.
   *
   * @example
   * autoFit="minmax(280px, 1fr)"
   * autoFit="minmax(200px, 1fr)"
   */
  autoFit?: string;

  /**
   * Render prop function for custom item rendering (children-as-function pattern).
   * Useful when each child item needs wrapped or styled consistently.
   *
   * @example
   * render={(item, index) => <Card key={item.id}>{item.name}</Card>}
   */
  render?: <T,>(item: T, index: number) => React.ReactNode;

  /**
   * Array of items to render (used with the render prop).
   * If not provided, uses React children directly.
   */
  items?: unknown[];

  /**
   * CSS Grid alignment for items (vertical alignment within grid cells).
   * @default "start"
   */
  items_?: "start" | "center" | "end" | "stretch";

  /**
   * CSS Grid alignment for content (horizontal alignment of grid content).
   * @default "start"
   */
  justify_?: "start" | "center" | "end" | "stretch";

  /**
   * Whether gap should use aspect ratio aware spacing.
   * @default false
   */
  aspectAware?: boolean;
}

/**
 * ComponentGrid - A flexible, responsive grid wrapper component
 *
 * Provides a modern, type-safe API for creating responsive grid layouts
 * with support for dynamic columns, flexible gap spacing, and CSS Grid auto-fit.
 *
 * @example
 * // Simple 3-column grid
 * <ComponentGrid cols={3} gap="4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ComponentGrid>
 *
 * @example
 * // Responsive columns with gap
 * <ComponentGrid
 *   cols={{ default: 1, md: 2, lg: 4 }}
 *   gap={{ default: "3", md: "6" }}
 * >
 *   {children}
 * </ComponentGrid>
 *
 * @example
 * // Auto-fit layout
 * <ComponentGrid autoFit="minmax(280px, 1fr)" gap="4">
 *   {children}
 * </ComponentGrid>
 *
 * @example
 * // Render prop pattern for consistent item styling
 * <ComponentGrid
 *   cols={{ default: 1, md: 2, lg: 3 }}
 *   gap="4"
 *   items={items}
 *   render={(item, idx) => (
 *     <Card key={item.id} className="h-full">
 *       {item.title}
 *     </Card>
 *   )}
 * />
 */
export const ComponentGrid = React.forwardRef<
  HTMLDivElement,
  ComponentGridProps
>(
  (
    {
      cols,
      gap = "4",
      autoFit,
      render,
      items: itemsArray,
      children,
      className,
      items_: itemsAlign = "start",
      justify_: justifyAlign = "start",
      aspectAware: _aspectAware = false,
      style,
      ...props
    },
    ref
  ) => {
    // Build responsive column classes
    const buildColsClasses = (): string => {
      // If autoFit is enabled, ignore cols
      if (autoFit) return "";

      // Handle single number case
      if (typeof cols === "number") {
        return `grid-cols-${cols}`;
      }

      // Handle responsive object case
      if (cols && typeof cols === "object") {
        const classNames: string[] = [];
        const defaultCols = cols.default || cols.sm || 1;
        classNames.push(`grid-cols-${defaultCols}`);

        if (cols.sm && cols.sm !== cols.default) classNames.push(`sm:grid-cols-${cols.sm}`);
        if (cols.md) classNames.push(`md:grid-cols-${cols.md}`);
        if (cols.lg) classNames.push(`lg:grid-cols-${cols.lg}`);
        if (cols.xl) classNames.push(`xl:grid-cols-${cols.xl}`);
        if (cols["2xl"]) classNames.push(`2xl:grid-cols-${cols["2xl"]}`);

        return classNames.join(" ");
      }

      return "grid-cols-1";
    };

    // Build responsive gap classes
    const buildGapClasses = (): string => {
      if (typeof gap === "string") {
        return `gap-${gap}`;
      }

      if (gap && typeof gap === "object") {
        const classNames: string[] = [];
        const defaultGap = gap.default || gap.sm || "4";
        classNames.push(`gap-${defaultGap}`);

        if (gap.sm && gap.sm !== gap.default) classNames.push(`sm:gap-${gap.sm}`);
        if (gap.md) classNames.push(`md:gap-${gap.md}`);
        if (gap.lg) classNames.push(`lg:gap-${gap.lg}`);
        if (gap.xl) classNames.push(`xl:gap-${gap.xl}`);
        if (gap["2xl"]) classNames.push(`2xl:gap-${gap["2xl"]}`);

        return classNames.join(" ");
      }

      return "gap-4";
    };

    // Build grid template columns for auto-fit
    const gridTemplateColumns = autoFit ? `repeat(auto-fit, ${autoFit})` : undefined;

    // Align select
    const alignItemsMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyItemsMap = {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
    };

    const colsClasses = buildColsClasses();
    const gapClasses = buildGapClasses();
    const alignClass = alignItemsMap[itemsAlign];
    const justifyClass = justifyItemsMap[justifyAlign];

    // Determine what to render
    const itemsToRender = render && itemsArray ? itemsArray : null;

    return (
      <div
        ref={ref}
        data-slot="component-grid"
        className={cn(
          "grid",
          {
            [colsClasses]: !autoFit,
            [gapClasses]: true,
            [alignClass]: true,
            [justifyClass]: true,
          },
          className
        )}
        style={{
          ...(autoFit && { gridTemplateColumns }),
          ...style,
        }}
        {...props}
      >
        {render && itemsToRender
          ? (itemsToRender as unknown[]).map((item, idx) => render(item, idx))
          : children}
      </div>
    );
  }
);

ComponentGrid.displayName = "ComponentGrid";

export type { ComponentGridProps };
