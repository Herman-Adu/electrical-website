import type { NewsArticle } from "@/types/news";
import type { TimelineItem } from "@/types/timeline";
import { CaseStudyLayout } from "./case-study-layout";
import { InsightLayout } from "./insight-layout";
import { ArticleLayout } from "./article-layout";
import { ReviewLayout } from "./review-layout";

interface LayoutDispatcherProps {
  article: NewsArticle;
  timelineItems?: readonly TimelineItem[];
}

export function LayoutDispatcher({ article }: LayoutDispatcherProps) {
  switch (article.category) {
    case "case-studies":
      return <CaseStudyLayout article={article} />;
    case "insights":
      return <InsightLayout article={article} />;
    case "reviews":
      return <ReviewLayout article={article} />;
    default:
      // residential, industrial, partners
      return <ArticleLayout article={article} />;
  }
}
