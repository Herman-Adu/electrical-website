import React from "react";
import type { NewsArticle } from "@/types/news";
import type { TocItem } from "@/types/shared-content";
import type { TimelineItem } from "@/types/timeline";
import { ArticleLocationPill } from "./article-location-pill";
import { DetailStatStrip } from "./detail-stat-strip";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { DetailTimelineBlock } from "./detail-timeline-block";
import { DetailListBlock } from "./detail-list-block";
import { DetailSplitCardsBlock } from "./detail-split-cards-block";
import { DetailSpecsBlock } from "./detail-specs-block";
import { DetailHighlightListBlock } from "./detail-highlight-list-block";
import { DetailInfographicBlock } from "./detail-infographic-block";
import { DetailStepsBlock } from "./detail-steps-block";
import { DetailGetStartedBlock } from "./detail-get-started-block";

export const DEFAULT_ARTICLE_TOC: readonly TocItem[] = [
  { id: "overview", label: "Overview", level: 1 },
  { id: "details", label: "Project Details", level: 1 },
  { id: "scope", label: "Project Scope", level: 1 },
  { id: "methodology", label: "Methodology", level: 1 },
  { id: "challenges", label: "Challenges", level: 1 },
  { id: "timeline", label: "Timeline", level: 1 },
  { id: "specifications", label: "Technical Specifications", level: 1 },
  { id: "results", label: "Results", level: 1 },
  { id: "takeaways", label: "Key Takeaways", level: 1 },
  { id: "gallery", label: "Project Gallery", level: 1 },
  { id: "conclusion", label: "Conclusion", level: 1 },
  { id: "testimonial", label: "Client Testimonial", level: 1 },
];

interface ArticleLayoutProps {
  article: NewsArticle;
  timelineItems?: readonly TimelineItem[];
}

export function ArticleLayout({ article, timelineItems }: ArticleLayoutProps) {
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

      case "details":
        return null;

      case "scope":
        return detail.scope && detail.scope.length > 0 ? (
          <DetailListBlock scope={detail.scope} title={title} />
        ) : null;

      case "methodology":
        return detail.methodology && detail.methodology.length > 0 ? (
          <DetailStepsBlock steps={detail.methodology} title={title} />
        ) : null;

      case "challenges":
        return detail.challenges && detail.challenges.length > 0 ? (
          <DetailSplitCardsBlock challenges={detail.challenges} title={title} />
        ) : null;

      case "timeline":
        return timelineItems && timelineItems.length > 0 ? (
          <DetailTimelineBlock items={timelineItems} title={title} />
        ) : null;

      case "specifications":
        return detail.specifications && detail.specifications.length > 0 ? (
          <DetailSpecsBlock specifications={detail.specifications} title={title} />
        ) : null;

      case "results":
        return detail.results && detail.results.length > 0 ? (
          <DetailHighlightListBlock results={detail.results} title={title} />
        ) : null;

      case "takeaways":
        return <DetailTakeawayBlock takeaways={detail.takeaways} title={title} />;

      case "gallery":
        return detail.gallery && detail.gallery.length > 0 ? (
          <DetailGalleryBlock gallery={detail.gallery} title={title} />
        ) : null;

      case "conclusion":
        return detail.conclusion && detail.conclusion.length > 0 ? (
          <DetailConclusionBlock conclusion={detail.conclusion} title={title} />
        ) : null;

      case "infographic":
        return detail.infographic ? (
          <DetailInfographicBlock
            src={detail.infographic.src}
            alt={detail.infographic.alt}
            caption={detail.infographic.caption}
          />
        ) : null;

      case "testimonial":
        return (
          <>
            {detail.quote && (
              <DetailQuoteBlock quote={detail.quote} variant="primary" />
            )}
            {detail.additionalQuotes && detail.additionalQuotes.length > 0 && (
              <section className="grid gap-6 sm:grid-cols-2">
                {detail.additionalQuotes.map((q, index) => (
                  <DetailQuoteBlock
                    key={`aq-${index}`}
                    quote={q}
                    variant="secondary"
                  />
                ))}
              </section>
            )}
          </>
        );

      case "get-started":
        return <DetailGetStartedBlock />;

      default:
        return null;
    }
  }

  return (
    <div data-testid="article-layout" className="space-y-16">
      {/* Location pill — fixed position, outside toc loop */}
      {article.location && (
        <ArticleLocationPill location={article.location} />
      )}

      {(detail.toc ?? DEFAULT_ARTICLE_TOC).map((item) => (
        <React.Fragment key={item.id}>
          {renderSection(item.id, item.label)}
        </React.Fragment>
      ))}
    </div>
  );
}
