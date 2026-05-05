import type { NewsArticle } from "@/types/news";
import { ArticleLocationPill } from "./article-location-pill";
import { DetailIntroBlock } from "./detail-intro-block";
import { DetailBodyBlock } from "./detail-body-block";
import { DetailTakeawayBlock } from "./detail-takeaway-block";
import { DetailQuoteBlock } from "./detail-quote-block";
import { DetailConclusionBlock } from "./detail-conclusion-block";
import { DetailGalleryBlock } from "./detail-gallery-block";
import { CaseStudyScopeList } from "./case-study-scope-list";
import { CaseStudyChallengeCards } from "./case-study-challenge-cards";
import { CaseStudySpecsGrid } from "./case-study-specs-grid";
import { CaseStudyResultsShowcase } from "./case-study-results-showcase";

interface ArticleLayoutProps {
  article: NewsArticle;
}

export function ArticleLayout({ article }: ArticleLayoutProps) {
  const { detail } = article;

  return (
    <div data-testid="article-layout" className="space-y-16">
      {/* Location pill */}
      {article.location && (
        <ArticleLocationPill location={article.location} />
      )}

      {/* Gallery — image-led, shown early */}
      {detail.gallery && detail.gallery.length > 0 && (
        <DetailGalleryBlock gallery={detail.gallery} />
      )}

      {/* Introduction */}
      <DetailIntroBlock intro={detail.intro} />

      {/* Body */}
      {detail.body && detail.body.length > 0 && (
        <DetailBodyBlock body={detail.body} />
      )}

      {/* Scope */}
      {detail.scope && detail.scope.length > 0 && (
        <CaseStudyScopeList scope={detail.scope} />
      )}

      {/* Methodology & Approach */}
      {detail.methodology && detail.methodology.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Methodology &amp; Approach
          </h2>
          <div className="space-y-4">
            {detail.methodology.map((paragraph, index) => (
              <p
                key={`method-${index}`}
                className="text-base leading-8 text-foreground/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Challenges & Solutions */}
      {detail.challenges && detail.challenges.length > 0 && (
        <CaseStudyChallengeCards challenges={detail.challenges} />
      )}

      {/* Technical specifications */}
      {detail.specifications && detail.specifications.length > 0 && (
        <CaseStudySpecsGrid specifications={detail.specifications} />
      )}

      {/* Results */}
      {detail.results && detail.results.length > 0 && (
        <CaseStudyResultsShowcase results={detail.results} />
      )}

      {/* Key takeaways */}
      <DetailTakeawayBlock takeaways={detail.takeaways} />

      {/* Primary quote */}
      {detail.quote && <DetailQuoteBlock quote={detail.quote} variant="primary" />}

      {/* Additional quotes — 2-col grid */}
      {detail.additionalQuotes && detail.additionalQuotes.length > 0 && (
        <section className="grid gap-6 sm:grid-cols-2">
          {detail.additionalQuotes.map((q, index) => (
            <DetailQuoteBlock key={`aq-${index}`} quote={q} variant="secondary" />
          ))}
        </section>
      )}

      {/* Conclusion */}
      {detail.conclusion && detail.conclusion.length > 0 && (
        <DetailConclusionBlock conclusion={detail.conclusion} />
      )}
    </div>
  );
}
