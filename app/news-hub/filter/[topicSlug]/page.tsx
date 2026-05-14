import { notFound } from "next/navigation";
import { NewsGridLayout } from "@/components/news-hub/news-grid-layout";
import { NewsHubCategoryTitle } from "@/components/news-hub";
import { NewsTopicHero } from "@/components/news-hub/news-topic-hero";
import { SectionIntro, ContentBreadcrumb } from "@/components/shared";
import { Footer } from "@/components/sections/footer";
import { allNewsArticles, getSidebarCardsByCategory } from "@/data/news";
import { getNewsArticlesByTopic, getNewsTopicBySlug, newsTopics } from "@/data/news/topics";
import { newsTopicIntros } from "@/data/news/topic-intros";
import type { NewsArticleListItem } from "@/types/news";

interface PageProps { params: Promise<{ topicSlug: string }>; }

export function generateStaticParams() {
  return newsTopics.map((t) => ({ topicSlug: t.slug }));
}

export default async function NewsTopicFilterPage({ params }: PageProps) {
  const { topicSlug } = await params;
  const topic = getNewsTopicBySlug(topicSlug);
  if (!topic) notFound();

  const articles = getNewsArticlesByTopic(topicSlug, allNewsArticles);
  const sidebarCards = getSidebarCardsByCategory("all");
  const introData = newsTopicIntros[topicSlug] ?? newsTopicIntros["residential"];

  const items: NewsArticleListItem[] = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    category: a.category,
    categoryLabel: a.categoryLabel,
    title: a.title,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    readTime: a.readTime,
    isFeatured: a.isFeatured,
    partnerLabel: a.partnerLabel,
    featuredImage: a.featuredImage,
  }));

  return (
    <main className="relative bg-background">
      <NewsTopicHero topic={topic} articleCount={items.length} />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub" },
          { label: "Topics", href: "/news-hub/category" },
          { label: topic.label, href: "#", isCurrent: true },
        ]}
        section="news"
      />

      <SectionIntro data={introData} />

      <section id="topic-articles" className="section-standard bg-background" style={{ overflow: 'visible' }}>
        <div className="section-content max-w-6xl">
          <NewsGridLayout
            items={items}
            sidebarCards={sidebarCards}
            title={<NewsHubCategoryTitle label={topic.label} />}
            initialCount={4}
            batchSize={3}
            emptyMessage={`No articles found for the ${topic.label} topic yet.`}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
