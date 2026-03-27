"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
} from "lucide-react";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";

const socialLinks = [
  {
    platform: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/nexgen-electrical",
    handle: "@nexgenelectrical",
  },
  {
    platform: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/nexgenelectrical",
    handle: "@nexgenelectrical",
  },
  {
    platform: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/nexgenelectrical",
    handle: "@nexgenelectrical",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/nexgenelectrical",
    handle: "@nexgenelectrical",
  },
  {
    platform: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@nexgenelectrical",
    handle: "@nexgenelectrical",
  },
];

interface ProjectSocialCTAProps {
  projectTitle: string;
  categorySlug: string;
}

export function ProjectSocialCTA({
  projectTitle,
  categorySlug,
}: ProjectSocialCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineLeft, lineRight } = useAnimatedBorders();

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 bg-card/30 overflow-hidden">
      <div className="section-content max-w-6xl" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Social Links */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                Connect With Us
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Follow Our{" "}
              <span className="text-electric-cyan">Latest Projects</span>
            </h3>

            <p className="text-muted-foreground mb-8 max-w-md">
              Stay updated with our work across London and the Home Counties.
              See behind-the-scenes content, project updates, and industry
              insights.
            </p>

            {/* Social links grid */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background/60 hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all duration-300"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-electric-cyan transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {social.platform}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 rounded-2xl border border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/5 via-transparent to-transparent backdrop-blur-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-electric-cyan/40" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-electric-cyan/40" />

            <h3 className="text-xl font-bold text-foreground mb-4">
              Interested in a Similar Project?
            </h3>

            <p className="text-muted-foreground mb-6">
              Whether you&apos;re planning an infrastructure upgrade, retrofit, or
              new installation, our team would love to discuss how we can help.
            </p>

            {/* Contact options */}
            <div className="space-y-3 mb-8">
              <a
                href="tel:+442012345678"
                className="flex items-center gap-3 text-muted-foreground hover:text-electric-cyan transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg border border-border bg-card/60 flex items-center justify-center group-hover:border-electric-cyan/40 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    +44 (0) 20 1234 5678
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mon-Fri, 8am-6pm
                  </p>
                </div>
              </a>

              <a
                href="mailto:projects@nexgenelectrical.co.uk"
                className="flex items-center gap-3 text-muted-foreground hover:text-electric-cyan transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg border border-border bg-card/60 flex items-center justify-center group-hover:border-electric-cyan/40 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    projects@nexgenelectrical.co.uk
                  </p>
                  <p className="text-xs text-muted-foreground">
                    We reply within 24 hours
                  </p>
                </div>
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-electric-cyan text-background font-medium hover:bg-electric-cyan/90 transition-colors"
              >
                Get a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/projects/category/${categorySlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-border text-foreground font-medium hover:border-electric-cyan/40 hover:text-electric-cyan transition-colors"
              >
                More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
