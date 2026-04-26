"use client";

import type { ProjectDetailContent } from "@/types/projects";
import type { adaptProjectTimeline } from "@/lib/timeline/adapters";
import { ProjectDetailIntro } from "./project-detail-intro";
import { ProjectScopeGrid } from "./project-scope";
import { ProjectChallengeSolution } from "./project-challenge-solution";
import { ProjectTimeline } from "./project-timeline";
import { ProjectGallery } from "./project-gallery";
import { ProjectTestimonialCard } from "./project-testimonial";

interface ProjectArticleContentProps {
  detail: ProjectDetailContent;
  canonicalTimeline: ReturnType<typeof adaptProjectTimeline> | null;
}

export function ProjectArticleContent({
  detail,
  canonicalTimeline,
}: ProjectArticleContentProps) {
  return (
    <div className="mt-2">
      {detail.intro && (
        <ProjectDetailIntro data={detail.intro} anchorId="overview" />
      )}

      {detail.scope && detail.scope.length > 0 && (
        <ProjectScopeGrid items={detail.scope} anchorId="scope" />
      )}

      {detail.challenge && detail.solution && (
        <ProjectChallengeSolution
          challenge={detail.challenge}
          solution={detail.solution}
          anchorId="challenge"
        />
      )}

      {(canonicalTimeline?.items.length ?? 0) > 0 && (
        <ProjectTimeline
          items={canonicalTimeline!.items}
          anchorId="timeline"
        />
      )}

      {detail.gallery && detail.gallery.length > 0 && (
        <ProjectGallery images={detail.gallery} anchorId="gallery" />
      )}

      {detail.testimonial && (
        <ProjectTestimonialCard
          testimonial={detail.testimonial}
          anchorId="testimonial"
        />
      )}
    </div>
  );
}
