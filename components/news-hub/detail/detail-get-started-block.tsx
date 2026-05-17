import Link from "next/link";
import { DetailSectionHeading } from "./detail-section-heading";

export function DetailGetStartedBlock() {
  return (
    <section id="get-started" className="space-y-6">
      <DetailSectionHeading title="Get Started" />
      <div className="rounded-2xl border border-electric-cyan/30 bg-gradient-to-br from-background to-[hsl(174_100%_35%)]/5 p-8">
        <p className="text-foreground/70 leading-relaxed mb-6">
          Have a project in mind? The Nexgen engineering team offers free site assessments — clear scope, honest programme, no obligation.
        </p>
        <Link
          href="/get-quote"
          className="inline-block bg-electric-cyan text-background font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get a Free Assessment
        </Link>
      </div>
    </section>
  );
}
