import type { NewsArticle } from "@/types/news";
import type { TimelineItem } from "@/types/timeline";
import { CaseStudyLayout } from "./case-study-layout";
import { NewsArticleContent } from "@/components/news-hub/news-article-content";

interface LayoutDispatcherProps {
  article: NewsArticle;
  timelineItems?: readonly TimelineItem[];
}

export function LayoutDispatcher({
  article,
  timelineItems,
}: LayoutDispatcherProps) {
  if (article.category === "case-studies") {
    return <CaseStudyLayout article={article} />;
  }

  // Phase 2/3 fallback — all other categories use the existing content renderer
  return (
    <NewsArticleContent
      detail={article.detail}
      timelineItems={timelineItems}
    />
  );
}
