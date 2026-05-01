import Link from "next/link";
import type { NewsTopic } from "@/data/news/topics";

interface NewsTopicFilterProps {
  topics: NewsTopic[];
  activeSlug?: string;
}

export function NewsTopicFilter({ topics, activeSlug }: NewsTopicFilterProps) {
  return (
    <div role="group" aria-label="Browse articles by topic" className="flex overflow-x-auto scrollbar-hide gap-2 pb-1 scroll-smooth">
      {topics.map((topic) => (
        <Link key={topic.slug} href={`/news-hub/filter/${topic.slug}`}
          className={["flex-none whitespace-nowrap scroll-mx-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === topic.slug ? "bg-cyan-400 text-black" : "border border-border bg-card text-muted-foreground hover:border-cyan-400/50 hover:text-foreground",
          ].join(" ")}>
          {topic.label}
        </Link>
      ))}
    </div>
  );
}
