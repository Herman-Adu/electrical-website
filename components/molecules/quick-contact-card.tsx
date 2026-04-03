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
    <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-linear-to-r from-accent/10 to-transparent border-b border-border/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Quick Contact</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Choose your preferred way to reach us
        </p>
      </div>

      {/* Contact Methods */}
      <div className="p-4 space-y-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          const isExternal =
            method.href.startsWith("tel:") || method.href.startsWith("mailto:");

          const content = (
            <div
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                method.highlight
                  ? "bg-accent/10 border-accent/30 hover:bg-accent/20"
                  : "border-border hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  method.highlight ? "bg-accent/20" : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    method.highlight ? "text-accent" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    method.highlight ? "text-accent" : "text-foreground"
                  }`}
                >
                  {method.label}
                </p>
                <p className="text-sm text-foreground truncate">
                  {method.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
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
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-accent">15+</p>
            <p className="text-xs text-muted-foreground">Years Experience</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-accent">5000+</p>
            <p className="text-xs text-muted-foreground">Happy Clients</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-accent">24/7</p>
            <p className="text-xs text-muted-foreground">Emergency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
