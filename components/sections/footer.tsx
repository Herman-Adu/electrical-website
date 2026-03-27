import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

const footerLinks = {
  services: [
    { name: "Commercial Installations", href: "/services" },
    { name: "Industrial Systems", href: "/services" },
    { name: "Power Distribution", href: "/services" },
    { name: "Safety Systems", href: "/services" },
    { name: "Energy Management", href: "/services" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#directors" },
    { name: "Careers", href: "/contact" },
    { name: "News & Updates", href: "#" },
    { name: "Case Studies", href: "#" },
  ],
  support: [
    { name: "Contact", href: "#contact" },
    { name: "Emergency Services", href: "#" },
    { name: "Maintenance Plans", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "FAQs", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Licensing", href: "#" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background overflow-hidden">
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--electric-cyan), transparent)",
          opacity: 0.2,
        }}
      />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block group mb-6">
              <div className="relative h-10 sm:h-12 w-auto">
                <Image
                  src="/images/nexgen-logo-full.png"
                  alt="NEXGEN Electrical Innovations"
                  width={200}
                  height={48}
                  className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Powering the next generation of commercial and industrial
              innovation with precision-engineered electrical solutions.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:border-electric-cyan/30 hover:text-electric-cyan transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-[10px] text-electric-cyan tracking-[0.2em] uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] text-electric-cyan tracking-[0.2em] uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-[10px] text-electric-cyan tracking-[0.2em] uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Card */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-mono text-[10px] text-electric-cyan tracking-[0.2em] uppercase mb-4">
              24/7 Emergency
            </h4>
            <div className="p-4 border border-electric-cyan/20 bg-card/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full" />
                <span className="font-mono text-[9px] text-emerald-500 tracking-widest">
                  ONLINE
                </span>
              </div>
              {/* Logo mark for emergency branding */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src="/images/nexgen-logo-round.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <a
                    href="tel:+442012345678"
                    className="text-foreground font-bold text-base hover:text-electric-cyan transition-colors block"
                  >
                    +44 (0) 20 1234 5678
                  </a>
                </div>
              </div>
              <p className="text-muted-foreground/60 text-xs">
                Rapid response team ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
              {currentYear} NEXGEN ELECTRICAL INNOVATIONS. ALL RIGHTS RESERVED.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-mono text-[10px] text-muted-foreground/60 tracking-widest hover:text-electric-cyan transition-colors"
                >
                  {link.name.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Technical Badge */}
            <div className="font-mono text-[9px] text-muted-foreground/40 tracking-widest">
              POWERED BY NEXGEN_CORE v4.2.1
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Circuit Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden opacity-10">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 100 L200 100 L250 50 L400 50 L450 100 L600 100"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M600 100 L800 100 L850 30 L1000 30 L1050 100 L1200 100"
            stroke="var(--electric-cyan)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </footer>
  );
}
