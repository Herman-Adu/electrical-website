import { notFound } from "next/navigation";
import Link from "next/link";
import { allNewsArticles } from "@/data/news";
import { getNewsArticlesByTopic, getNewsTopicBySlug, newsTopics } from "@/data/news/topics";

interface PageProps { params: Promise<{ topicSlug: string }>; }

export function generateStaticParams() {
  return newsTopics.map((t) => ({ topicSlug: t.slug }));
}

export default async function NewsTopicFilterPage({ params }: PageProps) {
  const { topicSlug } = await params;
  const topic = getNewsTopicBySlug(topicSlug);
  if (!topic) notFound();
  const articles = getNewsArticlesByTopic(topicSlug, allNewsArticles);
  return (
    <main className="min-h-screen pt-24">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/news-hub/category" className="text-sm text-muted-foreground hover:text-foreground">← Back to Channels</Link>
          <h1 className="mt-4 text-3xl font-bold">{topic.label}</h1>
          <p className="mt-2 text-muted-foreground">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
        </div>
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles found for this topic.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/news-hub/category/${article.category}/${article.slug}`} className="rounded-xl border bg-card p-5 hover:border-cyan-400/50 transition-colors">
                <p className="text-xs text-muted-foreground">{article.categoryLabel}</p>
                <h3 className="mt-1 font-semibold">{article.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
