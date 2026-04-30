"use client";

import type { ProjectDetailContent } from "@/types/projects";
import type { adaptProjectTimeline } from "@/lib/timeline/adapters";
import { ProjectDetailIntro } from "./project-detail-intro";
import { ProjectScopeGrid } from "./project-scope";
import { ProjectChallengeSolution } from "./project-challenge-solution";
import { ProjectTimeline } from "./project-timeline";
import { ProjectGallery } from "./project-gallery";
import { ProjectTestimonialCard } from "./project-testimonial";
import { ProjectNarrativeBlock } from "./project-narrative-block";

interface ProjectArticleContentProps {
  detail: ProjectDetailContent;
  canonicalTimeline: ReturnType<typeof adaptProjectTimeline> | null;
}

export function ProjectArticleContent({
  detail,
  canonicalTimeline,
}: ProjectArticleContentProps) {
  const narrativeAt = (position: string) =>
    detail.narrativeBlocks?.filter((b) => b.position === position) ?? [];

  return (
    <div className="mt-2">
      {detail.intro && (
        <ProjectDetailIntro data={detail.intro} anchorId="overview" />
      )}

      {narrativeAt("after-intro").map((block, i) => (
        <ProjectNarrativeBlock key={i} block={block} />
      ))}

      {detail.scope && detail.scope.length > 0 && (
        <ProjectScopeGrid items={detail.scope} anchorId="scope" />
      )}

      {narrativeAt("after-scope").map((block, i) => (
        <ProjectNarrativeBlock key={i} block={block} />
      ))}

      {detail.challenge && detail.solution && (
        <ProjectChallengeSolution
          challenge={detail.challenge}
          solution={detail.solution}
          anchorId="challenge"
        />
      )}

      {narrativeAt("after-challenge").map((block, i) => (
        <ProjectNarrativeBlock key={i} block={block} />
      ))}

      {(canonicalTimeline?.items.length ?? 0) > 0 && (
        <ProjectTimeline
          items={canonicalTimeline!.items}
          anchorId="timeline"
        />
      )}

      {narrativeAt("after-timeline").map((block, i) => (
        <ProjectNarrativeBlock key={i} block={block} />
      ))}

      {detail.gallery && detail.gallery.length > 0 && (
        <ProjectGallery images={detail.gallery} anchorId="gallery" />
      )}

      {narrativeAt("after-gallery").map((block, i) => (
        <ProjectNarrativeBlock key={i} block={block} />
      ))}

      {detail.testimonial && (
        <ProjectTestimonialCard
          testimonial={detail.testimonial}
          anchorId="testimonial"
        />
      )}
    </div>
  );
}
