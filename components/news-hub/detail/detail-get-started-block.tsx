import type { SidebarCard } from "@/types/shared-content";
import { ProjectSupplementalSection } from "@/components/projects/project-supplemental-section";

const DEFAULT_CARDS: SidebarCard[] = [
  {
    id: "article-cta-quote",
    type: "cta",
    eyebrow: "Free Site Assessment",
    title: "Request a Service Quotation",
    description:
      "Get a clear, no-obligation quote from Nexgen's qualified engineering team.",
    ctaLabel: "Get Quote",
    href: "/get-quote",
    section: "news",
    targetCategories: [],
  },
  {
    id: "article-cta-contact",
    type: "campaign",
    eyebrow: "Expert Consultation",
    title: "Speak to Our Engineers",
    description:
      "Have a project question? Our team is available for technical consultation.",
    ctaLabel: "Contact Us",
    href: "/contact",
    section: "news",
    targetCategories: [],
  },
];

interface DetailGetStartedBlockProps {
  tags?: string[];
  cards?: SidebarCard[];
}

export function DetailGetStartedBlock({
  tags = [],
  cards,
}: DetailGetStartedBlockProps) {
  return (
    <ProjectSupplementalSection
      tags={tags}
      cards={cards ?? DEFAULT_CARDS}
      tagsLabel="Article Tags"
      title="Get Started"
      description="Ready to discuss your requirements?"
    />
  );
}
