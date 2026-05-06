import React from "react";
import type { NewsArticle } from "@/types/news";
import type { TocItem } from "@/types/shared-content";
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

const DEFAULT_CASE_STUDY_TOC: readonly TocItem[] = [
  { id: "overview", label: "Overview", level: 1 },
  { id: "metrics", label: "Metrics", level: 1 },
  { id: "challenges", label: "Challenges", level: 1 },
  { id: "scope", label: "Scope", level: 1 },
  { id: "details", label: "Details", level: 1 },
  { id: "specifications", label: "Specifications", level: 1 },
  { id: "results", label: "Results", level: 1 },
  { id: "takeaways", label: "Key Takeaways", level: 1 },
  { id: "gallery", label: "Gallery", level: 1 },
  { id: "testimonial", label: "Testimonial", level: 1 },
  { id: "conclusion", label: "Conclusion", level: 1 },
];

interface CaseStudyLayoutProps {
  article: NewsArticle;
}

export function CaseStudyLayout({ article }: CaseStudyLayoutProps) {
  const { detail } = article;

  function renderSection(id: string) {
    switch (id) {
      case "overview":
        return <DetailIntroBlock intro={detail.intro} />;

      case "metrics":
        return detail.spotlight && detail.spotlight.length > 0 ? (
          <CaseStudyProgressMetrics metrics={detail.spotlight} />
        ) : null;

      case "challenges":
        return detail.challenges && detail.challenges.length > 0 ? (
          <CaseStudyChallengeCards challenges={detail.challenges} />
        ) : null;

      case "scope":
        return detail.scope && detail.scope.length > 0 ? (
          <CaseStudyScopeList scope={detail.scope} />
        ) : null;

      case "details":
        return detail.body && detail.body.length > 0 ? (
          <DetailBodyBlock body={detail.body} />
        ) : null;

      case "specifications":
        return detail.specifications && detail.specifications.length > 0 ? (
          <CaseStudySpecsGrid specifications={detail.specifications} />
        ) : null;

      case "results":
        return detail.results && detail.results.length > 0 ? (
          <CaseStudyResultsShowcase results={detail.results} />
        ) : null;

      case "takeaways":
        return <DetailTakeawayBlock takeaways={detail.takeaways} />;

      case "gallery":
        return detail.gallery && detail.gallery.length > 0 ? (
          <DetailGalleryBlock gallery={detail.gallery} />
        ) : null;

      case "testimonial":
        return detail.quote ? (
          <DetailQuoteBlock quote={detail.quote} variant="primary" />
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
    <div data-testid="case-study-layout" className="space-y-16">
      {/* Status badge header row — fixed position, outside toc loop */}
      <div className="flex items-center gap-4">
        <CaseStudyStatusBadge status="Completed" />
      </div>

      {(detail.toc ?? DEFAULT_CASE_STUDY_TOC).map((item) => (
        <React.Fragment key={item.id}>
          {renderSection(item.id)}
        </React.Fragment>
      ))}
    </div>
  );
}
