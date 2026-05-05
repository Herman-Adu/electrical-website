import type { NewsArticle } from "@/types/news";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { CaseStudyStatusBadge } from "./case-study-status-badge";
import { CaseStudyProgressMetrics } from "./case-study-progress-metrics";
import { CaseStudyChallengeCards } from "./case-study-challenge-cards";
import { CaseStudySpecsGrid } from "./case-study-specs-grid";
import { CaseStudyScopeList } from "./case-study-scope-list";
import { CaseStudyResultsShowcase } from "./case-study-results-showcase";

interface CaseStudyLayoutProps {
  article: NewsArticle;
}

export function CaseStudyLayout({ article }: CaseStudyLayoutProps) {
  const { detail } = article;

  return (
    <div data-testid="case-study-layout" className="space-y-16">
      {/* Status badge header row */}
      <div className="flex items-center gap-4">
        <CaseStudyStatusBadge status="Completed" />
      </div>

      {/* Introduction */}
      <DetailIntroBlock intro={detail.intro} />

      {/* Performance Metrics */}
      {detail.spotlight && detail.spotlight.length > 0 && (
        <CaseStudyProgressMetrics metrics={detail.spotlight} />
      )}

      {/* Challenges & Solutions */}
      {detail.challenges && detail.challenges.length > 0 && (
        <CaseStudyChallengeCards challenges={detail.challenges} />
      )}

      {/* Project Scope */}
      {detail.scope && detail.scope.length > 0 && (
        <CaseStudyScopeList scope={detail.scope} />
      )}

      {/* Project Details (body) */}
      {detail.body && detail.body.length > 0 && (
        <DetailBodyBlock body={detail.body} />
      )}

      {/* Technical Specifications */}
      {detail.specifications && detail.specifications.length > 0 && (
        <CaseStudySpecsGrid specifications={detail.specifications} />
      )}

      {/* Results & Outcomes */}
      {detail.results && detail.results.length > 0 && (
        <CaseStudyResultsShowcase results={detail.results} />
      )}

      {/* Gallery */}
      {detail.gallery && detail.gallery.length > 0 && (
        <DetailGalleryBlock gallery={detail.gallery} />
      )}

      {/* Key Takeaways */}
      <DetailTakeawayBlock takeaways={detail.takeaways} />

      {/* Primary Quote */}
      {detail.quote && <DetailQuoteBlock quote={detail.quote} variant="primary" />}

      {/* Conclusion */}
      {detail.conclusion && detail.conclusion.length > 0 && (
        <DetailConclusionBlock conclusion={detail.conclusion} />
      )}
    </div>
  );
}
