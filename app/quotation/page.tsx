import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/sections";
import { QuotationHero } from "@/components/sections/quotation-hero";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { QuotationFormContainer } from "@/features/quotation";
import quotationData from "@/data/strapi-mock/marketing/quotation.json";
import { createPageMetadata } from "@/lib/metadata";
import type { MarketingQuotationContent } from "@/types/marketing";
import type { SectionIntroData } from "@/types/sections";

export const metadata: Metadata = createPageMetadata({
  title: "Professional Quotation | Nexgen Electrical Innovations",
  description:
    "Request a detailed project quotation through our structured 7-step process for residential, commercial, and industrial electrical works.",
  path: "/quotation",
  keywords: [
    "electrical quotation",
    "project estimate",
    "commercial electrical quote",
    "industrial electrical pricing",
    "Nexgen quotation",
  ],
});

const quotationContent = quotationData as MarketingQuotationContent;
const { header, trustIndicators, faq } = quotationContent;

const quotationIntroData: SectionIntroData = {
  sectionId: "quotation-intro",
  label: "Professional Quotation Workflow",
  headlineWords: ["From", "Brief", "To", "Bankable", "Proposal"],
  leadParagraph:
    "Our quotation process is engineered for technical clarity, predictable delivery, and commercial confidence. Every step captures the right scope inputs so your estimate is accurate and actionable.",
  bodyParagraphs: [
    "This seven-step flow aligns project objectives, site realities, budget windows, and compliance expectations before pricing is finalized.",
    "The result is a quotation package your technical, operations, and procurement teams can review quickly and approve with confidence.",
  ],
  pillars: [
    {
      num: "01",
      title: "Scope Precision",
      description:
        "Capture technical requirements early to reduce revision cycles and pricing ambiguity.",
    },
    {
      num: "02",
      title: "Commercial Clarity",
      description:
        "Align timeline, budget, and delivery constraints into one structured decision-ready brief.",
    },
    {
      num: "03",
      title: "Execution Readiness",
      description:
        "Produce a quotation pathway that transitions smoothly into planning and delivery.",
    },
  ],
};

export default function QuotationPage() {
  return (
    <main className="min-h-screen bg-background">
      <QuotationHero header={header} trustIndicators={trustIndicators} />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Quotation", href: "/quotation", isCurrent: true },
        ]}
        section="services"
      />

      <SectionIntro data={quotationIntroData} />

      <section
        id="quotation-form-section"
        className="section-container py-10 sm:py-14"
      >
        <div className="section-content max-w-5xl">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric-cyan mb-3">
              7-Step Quotation Submission
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Build Your Project Brief
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete the full one-column workflow below to give our
              engineering team the detail needed for a precise, professional
              quotation.
            </p>
          </div>

          <QuotationFormContainer />
        </div>
      </section>

      <section
        id="quotation-campaign"
        className="section-container py-10 sm:py-14 border-t border-border bg-muted/20"
      >
        <div className="section-content max-w-5xl">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric-cyan mb-3">
              Campaign Confidence Metrics
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Signals That Support Commercial Decisions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trustIndicators.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-electric-cyan/20 bg-card/60 p-6 text-center"
              >
                <p className="text-3xl font-bold text-electric-cyan">
                  {item.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="quotation-marketing"
        className="section-container py-10 sm:py-14"
      >
        <div className="section-content max-w-4xl">
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric-cyan mb-3">
              Marketing & Buyer Enablement
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {faq.items.map((item) => (
              <article
                key={item.question}
                className="rounded-xl border border-border bg-card/40 p-6"
              >
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  {item.question}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="quotation-cta"
        className="section-container py-12 sm:py-16 border-t border-electric-cyan/20 bg-electric-cyan/5"
      >
        <div className="section-content max-w-4xl">
          <div className="rounded-2xl border border-electric-cyan/30 bg-card/70 p-8 sm:p-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric-cyan mb-3">
              Quotation Action Lane
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready To Finalize Your Scope?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Submit your seven-step quotation now, or talk to our team first to
              align technical requirements, timeline expectations, and budget
              boundaries.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <a href="#quotation-form-section">
                  Continue Quotation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/contact">
                  Speak With Our Team
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
