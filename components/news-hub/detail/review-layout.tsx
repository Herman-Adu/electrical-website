import React from "react";
import type { NewsArticle } from "@/types/news";
import type { TocItem } from "@/types/shared-content";
import { ReviewHighlightQuote } from "./review-highlight-quote";
import { ReviewVerifiedBadge } from "./review-verified-badge";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { DetailMetricsBlock } from "./detail-metrics-block";
import { DetailGetStartedBlock } from "./detail-get-started-block";

const DEFAULT_REVIEW_TOC: readonly TocItem[] = [
  { id: "client-quote", label: "Client Quote", level: 1 },
  { id: "overview", label: "Overview", level: 1 },
  { id: "metrics", label: "Metrics", level: 1 },
  { id: "details", label: "Details", level: 1 },
  { id: "takeaways", label: "Key Takeaways", level: 1 },
  { id: "gallery", label: "Gallery", level: 1 },
  { id: "conclusion", label: "Conclusion", level: 1 },
];

interface ReviewLayoutProps {
  article: NewsArticle;
}

export function ReviewLayout({ article }: ReviewLayoutProps) {
  const { detail } = article;

  function renderSection(id: string, title: string) {
    switch (id) {
      case "client-quote":
        return detail.quote ? (
          <ReviewHighlightQuote quote={detail.quote} />
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

      case "metrics":
        return detail.spotlight && detail.spotlight.length > 0 ? (
          <DetailMetricsBlock metrics={detail.spotlight} title={title} />
        ) : null;

      case "details":
        return null;

      case "takeaways":
        return <DetailTakeawayBlock takeaways={detail.takeaways} title={title} />;

      case "gallery":
        return detail.gallery && detail.gallery.length > 0 ? (
          <DetailGalleryBlock gallery={detail.gallery} title={title} />
        ) : null;

      case "conclusion":
        return (
          <>
            {detail.conclusion && detail.conclusion.length > 0 && (
              <DetailConclusionBlock conclusion={detail.conclusion} title={title} />
            )}
            {detail.additionalQuotes && detail.additionalQuotes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {detail.additionalQuotes.map((q, i) => (
                  <DetailQuoteBlock
                    key={`quote-${q.author}-${i}`}
                    quote={q}
                    variant="secondary"
                  />
                ))}
              </div>
            )}
          </>
        );

      case "get-started":
        return <DetailGetStartedBlock tags={article.tags} />;

      default:
        return null;
    }
  }

  return (
    <div data-testid="review-layout" className="space-y-16">
      {/* Verified client badge — fixed position, outside toc loop */}
      <ReviewVerifiedBadge
        clientName={article.author.name}
        role={article.author.role}
        isVerified
      />

      {(detail.toc ?? DEFAULT_REVIEW_TOC).map((item) => (
        <React.Fragment key={item.id}>
          {renderSection(item.id, item.label)}
        </React.Fragment>
      ))}
    </div>
  );
}
