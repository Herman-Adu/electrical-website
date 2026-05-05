import type { NewsArticle } from "@/types/news";
import { ReviewHighlightQuote } from "./review-highlight-quote";
import { ReviewVerifiedBadge } from "./review-verified-badge";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { CaseStudyProgressMetrics } from "./case-study-progress-metrics";

interface ReviewLayoutProps {
  article: NewsArticle;
}

export function ReviewLayout({ article }: ReviewLayoutProps) {
  const { detail } = article;

  return (
    <div data-testid="review-layout" className="space-y-16">
      {/* Primary quote hero — renders first if present */}
      {detail.quote && <ReviewHighlightQuote quote={detail.quote} />}

      {/* Introduction */}
      <DetailIntroBlock intro={detail.intro} />

      {/* Verified client badge */}
      <ReviewVerifiedBadge
        clientName={article.author.name}
        role={article.author.role}
        isVerified
      />

      {/* Progress metrics */}
      {detail.spotlight && detail.spotlight.length > 0 && (
        <CaseStudyProgressMetrics spotlight={detail.spotlight} />
      )}

      {/* Body */}
      {detail.body && detail.body.length > 0 && (
        <DetailBodyBlock body={detail.body} />
      )}

      {/* Key takeaways */}
      <DetailTakeawayBlock takeaways={detail.takeaways} />

      {/* Gallery */}
      {detail.gallery && detail.gallery.length > 0 && (
        <DetailGalleryBlock gallery={detail.gallery} />
      )}

      {/* Conclusion */}
      {detail.conclusion && detail.conclusion.length > 0 && (
        <DetailConclusionBlock conclusion={detail.conclusion} />
      )}

      {/* Additional quotes grid */}
      {detail.additionalQuotes && detail.additionalQuotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detail.additionalQuotes.map((q, i) => (
            <DetailQuoteBlock key={i} quote={q} variant="secondary" />
          ))}
        </div>
      )}
    </div>
  );
}
