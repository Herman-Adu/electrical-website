// Stub — implementation pending (Task 4)
import type { NewsArticle } from "@/types/news";

interface ReviewLayoutProps {
  article: NewsArticle;
}

export function ReviewLayout({ article }: ReviewLayoutProps) {
  return (
    <div data-testid="review-layout">
      {article.detail?.intro?.map((text: string, i: number) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}
