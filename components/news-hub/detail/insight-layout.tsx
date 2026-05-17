import React from "react";
import type { NewsArticle } from "@/types/news";
import type { TocItem } from "@/types/shared-content";
import { DetailStatStrip } from "./detail-stat-strip";
import { DetailStepsBlock } from "./detail-steps-block";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { DetailListBlock } from "./detail-list-block";
import { DetailSpecsBlock } from "./detail-specs-block";
import { DetailSplitCardsBlock } from "./detail-split-cards-block";
import { DetailInfographicBlock } from "./detail-infographic-block";
import { DetailGetStartedBlock } from "./detail-get-started-block";

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

  function renderSection(id: string, title: string) {
    switch (id) {
      case "spotlight":
        return detail.spotlight && detail.spotlight.length > 0 ? (
          <DetailStatStrip spotlight={detail.spotlight} />
        ) : null;

      case "overview":
        return (
          <DetailIntroBlock
            intro={detail.intro}
            title={title}
            eyebrow={article.categoryLabel}
            body={detail.body}
            pillars={detail.pillars}
          />
        );

      case "methodology":
        return detail.methodology && detail.methodology.length > 0 ? (
          <DetailStepsBlock steps={detail.methodology} title={title} />
        ) : null;

      case "details":
        return null;

      case "scope":
        return detail.scope && detail.scope.length > 0 ? (
          <DetailListBlock scope={detail.scope} title={title} />
        ) : null;

      case "specifications":
        return detail.specifications && detail.specifications.length > 0 ? (
          <DetailSpecsBlock specifications={detail.specifications} title={title} />
        ) : null;

      case "challenges":
        return detail.challenges && detail.challenges.length > 0 ? (
          <DetailSplitCardsBlock challenges={detail.challenges} title={title} />
        ) : null;

      case "takeaways":
        return <DetailTakeawayBlock takeaways={detail.takeaways} title={title} />;

      case "testimonial":
        return detail.quote ? (
          <DetailQuoteBlock quote={detail.quote} variant="primary" />
        ) : null;

      case "gallery":
        return detail.gallery && detail.gallery.length > 0 ? (
          <DetailGalleryBlock gallery={detail.gallery} title={title} />
        ) : null;

      case "infographic":
        return detail.infographic ? (
          <DetailInfographicBlock
            src={detail.infographic.src}
            alt={detail.infographic.alt}
            caption={detail.infographic.caption}
          />
        ) : null;

      case "conclusion":
        return detail.conclusion && detail.conclusion.length > 0 ? (
          <DetailConclusionBlock conclusion={detail.conclusion} title={title} />
        ) : null;

      case "body-context":
        return detail.bodyContext && detail.bodyContext.length > 0 ? (
          <DetailBodyBlock body={detail.bodyContext} title={title} id="body-context" />
        ) : null;

      case "get-started":
        return <DetailGetStartedBlock tags={article.tags} />;

      default:
        return null;
    }
  }

  return (
    <div data-testid="insight-layout" className="space-y-16">
      {(detail.toc ?? DEFAULT_INSIGHT_TOC).map((item) => (
        <React.Fragment key={item.id}>
          {renderSection(item.id, item.label)}
        </React.Fragment>
      ))}
    </div>
  );
}
