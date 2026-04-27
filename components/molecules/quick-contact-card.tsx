/**
 * MOLECULE: QuickContactCard
 *
 * Displays quick contact options with icons
 */

"use client";

import { Phone, Mail, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

const contactMethods = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+44 1628 600 123",
    href: "tel:+441628600123",
    description: "Mon-Fri, 8am-6pm",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@nexgen-electrical-innovations.co.uk",
    href: "mailto:info@nexgen-electrical-innovations.co.uk",
    description: "We respond within 24 hours",
  },
  {
    icon: Zap,
    label: "Emergency",
    value: "24/7 Service",
    href: "/#service-request",
    description: "For urgent electrical issues",
    highlight: true,
  },
];

export function QuickContactCard() {
  return (
    <div className="rounded-xl bg-linear-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 shadow-[0_20px_60px_-40px_hsl(174_100%_35%_/_0.15)] dark:shadow-[0_20px_60px_-40px_rgba(0,243,189,0.2)] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-electric-cyan/10 border border-accent/20 border-b ">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-electric-cyan dark:text-accent" />
          <h3 className="font-semibold text-electric-cyan dark:text-foreground/80">
            Quick Contact
          </h3>
        </div>
        <p className="text-xs text-foreground dark:text-foreground/80 mt-1">
          Choose your preferred way to reach us
        </p>
      </div>

      {/* Contact Methods */}
      <div className="p-4 space-y-3 flex flex-col gaap-6">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          const isExternal =
            method.href.startsWith("tel:") || method.href.startsWith("mailto:");

          const content = (
            <div
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                method.highlight
                  ? "bg-electric-cyan/10 dark:bg-accent/10 border-electric-cyan/30 dark:border-accent/30 hover:bg-accent/30 dark:hover:bg-electric-cyan/10"
                  : "border-border hover:border-electric-cyan/50 dark:hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  method.highlight
                    ? "border border-electric-cyan/30 bg-accent/20"
                    : "bg-muted/40 border border-electric-cyan/30"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    method.highlight
                      ? "text-electric-cyan"
                      : "text-electric-cyan"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    method.highlight
                      ? "text-electric-cyan"
                      : "text-foreground dark:text-foreground/80"
                  }`}
                >
                  {method.label}
                </p>
                <p className="text-sm text-foreground dark:text-foreground/80 truncate">
                  {method.value}
                </p>
                <p className="text-xs text-foreground dark:text-foreground/80 mt-0.5">
                  {method.description}
                </p>
              </div>
            </div>
          );

          if (isExternal) {
            return (
              <a key={method.label} href={method.href}>
                {content}
              </a>
            );
          }

          return (
            <Link key={method.label} href={method.href}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg border border-electric-cyan/30 bg-muted/50">
            <p className="text-lg font-bold text-electric-cyan">10+</p>
            <p className="text-xs text-foreground dark:text-foreground/80">
              <span>Years</span>
              <br />
              <span>Experience</span>
            </p>
          </div>
          <div className="p-2 rounded-lg border border-electric-cyan/30 bg-muted/50">
            <p className="text-lg font-bold text-electric-cyan">100's+</p>
            <p className="text-xs text-foreground dark:text-foreground/80">
              <span>Happy</span>
              <br />
              <span>Clients</span>
            </p>
          </div>
          <div className="p-2 rounded-lg border border-electric-cyan/30 bg-muted/50">
            <p className="text-lg font-bold text-electric-cyan">24/7</p>
            <p className="text-xs text-foreground dark:text-foreground/80">
              <span>Emergency</span>
              <br />
              <span>Services</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
