import type { NewsArticle } from "@/types/news";
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

interface InsightLayoutProps {
  article: NewsArticle;
}

export function InsightLayout({ article }: InsightLayoutProps) {
  const { detail } = article;

  return (
    <div data-testid="insight-layout" className="space-y-16">
      {/* Spotlight stat strip */}
      {detail.spotlight && detail.spotlight.length > 0 && (
        <InsightStatStrip spotlight={detail.spotlight} />
      )}

      {/* Introduction */}
      <DetailIntroBlock intro={detail.intro} />

      {/* Methodology steps */}
      {detail.methodology && detail.methodology.length > 0 && (
        <InsightMethodologySteps steps={detail.methodology} />
      )}

      {/* Body */}
      {detail.body && detail.body.length > 0 && (
        <DetailBodyBlock body={detail.body} />
      )}

      {/* Project scope */}
      {detail.scope && detail.scope.length > 0 && (
        <CaseStudyScopeList scope={detail.scope} />
      )}

      {/* Technical specifications */}
      {detail.specifications && detail.specifications.length > 0 && (
        <CaseStudySpecsGrid specifications={detail.specifications} />
      )}

      {/* Key takeaways */}
      <DetailTakeawayBlock takeaways={detail.takeaways} />

      {/* Primary quote */}
      {detail.quote && <DetailQuoteBlock quote={detail.quote} variant="primary" />}

      {/* Gallery */}
      {detail.gallery && detail.gallery.length > 0 && (
        <DetailGalleryBlock gallery={detail.gallery} />
      )}

      {/* Conclusion */}
      {detail.conclusion && detail.conclusion.length > 0 && (
        <DetailConclusionBlock conclusion={detail.conclusion} />
      )}
    </div>
  );
}
