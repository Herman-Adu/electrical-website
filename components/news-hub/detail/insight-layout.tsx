import React from "react";
import type { NewsArticle } from "@/types/news";
import type { TocItem } from "@/types/shared-content";
import { InsightStatStrip } from "./insight-stat-strip";
import { InsightMethodologySteps } from "./insight-methodology-steps";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { CaseStudyScopeList } from "./case-study-scope-list";
import { CaseStudySpecsGrid } from "./case-study-specs-grid";

export const DEFAULT_INSIGHT_TOC: readonly TocItem[] = [
  { id: "spotlight", label: "Spotlight", level: 1 },
  { id: "overview", label: "Overview", level: 1 },
  { id: "methodology", label: "Methodology", level: 1 },
  { id: "details", label: "Project Details", level: 1 },
  { id: "scope", label: "Project Scope", level: 1 },
  { id: "specifications", label: "Technical Specifications", level: 1 },
  { id: "takeaways", label: "Key Takeaways", level: 1 },
  { id: "testimonial", label: "Client Testimonial", level: 1 },
  { id: "gallery", label: "Project Gallery", level: 1 },
  { id: "conclusion", label: "Conclusion", level: 1 },
];

interface InsightLayoutProps {
  article: NewsArticle;
}

export function InsightLayout({ article }: InsightLayoutProps) {
  const { detail } = article;

  function renderSection(id: string) {
    switch (id) {
      case "spotlight":
        return detail.spotlight && detail.spotlight.length > 0 ? (
          <InsightStatStrip spotlight={detail.spotlight} />
        ) : null;

      case "overview":
        return <DetailIntroBlock intro={detail.intro} />;

      case "methodology":
        return detail.methodology && detail.methodology.length > 0 ? (
          <InsightMethodologySteps steps={detail.methodology} />
        ) : null;

      case "details":
        return detail.body && detail.body.length > 0 ? (
          <DetailBodyBlock body={detail.body} />
        ) : null;

      case "scope":
        return detail.scope && detail.scope.length > 0 ? (
          <CaseStudyScopeList scope={detail.scope} />
        ) : null;

      case "specifications":
        return detail.specifications && detail.specifications.length > 0 ? (
          <CaseStudySpecsGrid specifications={detail.specifications} />
        ) : null;

      case "takeaways":
        return <DetailTakeawayBlock takeaways={detail.takeaways} />;

      case "testimonial":
        return detail.quote ? (
          <DetailQuoteBlock quote={detail.quote} variant="primary" />
        ) : null;

      case "gallery":
        return detail.gallery && detail.gallery.length > 0 ? (
          <DetailGalleryBlock gallery={detail.gallery} />
        ) : null;

      case "conclusion":
        return detail.conclusion && detail.conclusion.length > 0 ? (
          <DetailConclusionBlock conclusion={detail.conclusion} />
        ) : null;

      default:
        return null;
    }
  }

  return (
    <div data-testid="insight-layout" className="space-y-16">
      {(detail.toc ?? DEFAULT_INSIGHT_TOC).map((item) => (
        <React.Fragment key={item.id}>
          {renderSection(item.id)}
        </React.Fragment>
      ))}
    </div>
  );
}
