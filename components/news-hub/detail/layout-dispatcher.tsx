import type { NewsArticle } from "@/types/news";
import type { TimelineItem } from "@/types/timeline";
import { CaseStudyLayout } from "./case-study-layout";
import { InsightLayout } from "./insight-layout";
import { ArticleLayout } from "./article-layout";
import { NewsArticleContent } from "@/components/news-hub/news-article-content";

interface LayoutDispatcherProps {
  article: NewsArticle;
  timelineItems?: readonly TimelineItem[];
}

export function LayoutDispatcher({
  article,
  timelineItems,
}: LayoutDispatcherProps) {
  switch (article.category) {
    case "case-studies":
      return <CaseStudyLayout article={article} />;
    case "insights":
      return <InsightLayout article={article} />;
    case "reviews":
      // Phase 3 — fallback to existing content renderer
      return (
        <NewsArticleContent
          detail={article.detail}
          timelineItems={timelineItems}
        />
      );
    default:
      // residential, industrial, partners
      return <ArticleLayout article={article} />;
  }
}
