"use client";

import { type ReactNode } from "react";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import { ContentSidebar } from "./content-sidebar";
import type { SidebarCard } from "@/types/shared-content";

interface CategoryPageLayoutProps {
  main: ReactNode;
  sidebarCards: SidebarCard[];
  sidebarTitle?: string;
  sidebarDescription?: string;
}

export function CategoryPageLayout({
  main,
  sidebarCards,
  sidebarTitle = "Resources",
  sidebarDescription = "Guides, consultations, and client testimonials.",
}: CategoryPageLayoutProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } = useAnimatedBorders();

  return (
    <section ref={sectionRef} className="relative section-padding bg-background">
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">{main}</div>
          <div className="lg:col-span-4">
            <ContentSidebar
              cards={sidebarCards}
              title={sidebarTitle}
              description={sidebarDescription}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
