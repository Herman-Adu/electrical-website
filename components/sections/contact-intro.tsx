import Link from "next/link";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Clock,
  MessageSquare,
} from "lucide-react";
import { ContentBreadcrumb } from "@/components/shared/content-breadcrumb";

const commitments = [
  "Dedicated electrical specialists assigned to your enquiry",
  "Clear next steps with practical recommendations",
  "Secure handling of your details and project information",
];

export function ContactIntro() {
  return (
    <>
      <ContentBreadcrumb
        section="contact"
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <section className="section-container border-b border-foreground/20 dark:border-border/40 bg-muted/20 pt-18 pb-10 sm:pt-14 sm:pb-12">
        <div className="section-content">
          <div className="relative overflow-hidden rounded-2xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm shadow-[0_20px_60px_-40px_hsl(174_100%_35%_/_0.15)] dark:shadow-[0_20px_60px_-40px_rgba(0,243,189,0.2)] px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[hsl(174_100%_35%)]/40 dark:via-electric-cyan/40 to-transparent" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-5 lg:items-center">
              <div className="lg:col-span-3">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
                  <span className="font-mono text-xs tracking-[0.2em] uppercase text-[hsl(174_100%_35%)]/80 dark:text-electric-cyan/80">
                    Contact Journey
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
                  Speak With{" "}
                  <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">Nexgen Electrical</span>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Whether you need emergency support, project guidance, or a
                  quote, we&apos;ll route your request to the right engineer and
                  respond with clear, actionable next steps.
                </p>

                <ul className="mt-5 space-y-3">
                  {commitments.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(174_100%_35%)] dark:text-electric-cyan" />
                      <span className="text-sm text-foreground/70 dark:text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2">
                <div className="rounded-xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-white/60 dark:bg-background/60 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2 text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                      Response Window
                    </span>
                  </div>

                  <p className="mb-5 text-sm text-foreground/70 dark:text-muted-foreground">
                    Typical enquiries are answered within 24–48 hours. Emergency
                    requests are prioritised immediately.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Link
                      href="#contact-form-section"
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-[hsl(174_100%_35%)] dark:bg-electric-cyan px-4 py-3 text-xs font-semibold tracking-[0.14em] text-white dark:text-background uppercase transition-all hover:shadow-[0_0_24px_rgba(0,243,189,0.3)] dark:hover:shadow-[0_0_24px_rgba(0,243,189,0.3)]"
                    >
                      Start Enquiry
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="tel:+442079460958"
                      className="inline-flex items-center justify-center gap-2 rounded-sm border border-[hsl(174_100%_35%)]/25 dark:border-border px-4 py-3 text-xs font-semibold tracking-[0.14em] text-foreground dark:text-foreground uppercase transition-colors hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan"
                    >
                      <Phone className="h-4 w-4" />
                      Call Emergency Line
                    </Link>

                    <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Existing request? Add your reference in Step 3.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
