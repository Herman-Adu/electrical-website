import type { ProjectNarrativeBlock as ProjectNarrativeBlockData } from "@/types/projects";

interface ProjectNarrativeBlockProps {
  block: ProjectNarrativeBlockData;
  className?: string;
}

export function ProjectNarrativeBlock({
  block,
  className,
}: ProjectNarrativeBlockProps) {
  const isMuted = block.background === "muted";

  return (
    <section
      id={block.anchorId}
      className={`py-10 ${isMuted ? "bg-muted/30 dark:bg-muted/10 rounded-xl px-6 md:px-10" : ""} ${className ?? ""}`}
    >
      <div className="max-w-prose space-y-4">
        {block.heading && (
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            {block.heading}
          </h3>
        )}
        {block.paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-foreground/80"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
