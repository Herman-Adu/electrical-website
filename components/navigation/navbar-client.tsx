"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  {
    name: "Home",
    href: "/",
    submenu: [
      { name: "Services", href: "/#services" },
      { name: "Illumination", href: "/#illumination" },
      { name: "Features", href: "/#features" },
      { name: "Architecture", href: "/#architecture" },
      { name: "Dashboard", href: "/#dashboard" },
      { name: "Smart Living", href: "/#smart-living" },
      { name: "Power Your Vision", href: "/#power-vision" },
    ],
  },
  {
    name: "About",
    href: "/about",
    submenu: [
      { name: "Our Story", href: "/about#company-intro" },
      { name: "Our Directors", href: "/about#directors" },
      { name: "Company History", href: "/about#timeline" },
      { name: "Vision & Mission", href: "/about#vision-mission" },
      { name: "Certifications", href: "/about#certifications" },
      { name: "Community", href: "/about#community" },
      { name: "Why Choose Us", href: "/about#why-choose-us" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    submenu: [
      { name: "Commercial & Retail", href: "/services/commercial" },
      { name: "Industrial & Infrastructure", href: "/services/industrial" },
      { name: "Residential & Domestic", href: "/services/residential" },
      { name: "Emergency Response", href: "/services/emergency" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

export function NavbarClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHash = () => {
      setCurrentHash(window.location.hash || "");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentHash(window.location.hash || "");
  }, [pathname]);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const scrollToSection = (href: string) => {
    const [pathPart, hashPart] = href.split("#");
    const hasHash = typeof hashPart === "string" && hashPart.length > 0;

    if (hasHash) {
      const targetPath = pathPart || pathname;
      if (targetPath === pathname) {
        const selector = `#${hashPart}`;
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `${targetPath}${selector}`);
          setCurrentHash(selector);
          closeMenus();
          return;
        }
      }
    }

    router.push(href);
    closeMenus();
  };

  const navigateTo = (href: string) => {
    router.push(href);
    closeMenus();
  };

  const normalizePath = (path: string) => {
    if (!path || path === "/") return "/";
    return path.endsWith("/") ? path.slice(0, -1) : path;
  };

  const isSubmenuActive = (href: string) => {
    const [rawPath, rawHash] = href.split("#");
    const targetPath = normalizePath(rawPath || "/");
    const currentPath = normalizePath(pathname);

    if (rawHash) {
      return currentPath === targetPath && currentHash === `#${rawHash}`;
    }

    return currentPath === targetPath;
  };

  const isTopLevelActive = (href: string, hasSubmenu: boolean) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    if (targetPath === "/services") {
      return (
        currentPath === "/services" || currentPath.startsWith("/services/")
      );
    }

    if (hasSubmenu) {
      return currentPath === targetPath;
    }

    return currentPath === targetPath;
  };

  const getAriaCurrent = (href: string): "page" | "location" | undefined => {
    const [rawPath, rawHash] = href.split("#");
    const targetPath = normalizePath(rawPath || "/");
    const currentPath = normalizePath(pathname);

    if (rawHash) {
      return currentPath === targetPath && currentHash === `#${rawHash}`
        ? "location"
        : undefined;
    }

    return currentPath === targetPath ? "page" : undefined;
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-lg supports-backdrop-filter:bg-background/85 dark:supports-backdrop-filter:bg-background/75 bg-background/90 dark:bg-background/85 transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Zap
                  size={24}
                  className="text-electric-cyan group-hover:animate-pulse transition-all"
                />
                <div className="absolute inset-0 bg-electric-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-sm lg:text-base tracking-tight leading-none">
                  NEXGEN
                </span>
                <span className="font-mono text-[8px] lg:text-[9px] text-electric-cyan/60 tracking-[0.2em] uppercase">
                  Electrical
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const topLevelActive =
                  isTopLevelActive(link.href, Boolean(link.submenu)) ||
                  Boolean(
                    link.submenu?.some((item) => isSubmenuActive(item.href)),
                  );

                return (
                  <div key={link.name} className="relative group">
                    {link.submenu ? (
                      <>
                        <div className="flex items-center gap-0.5">
                          <Link
                            href={link.href}
                            aria-current={getAriaCurrent(link.href)}
                            className={`relative text-sm transition-colors font-medium tracking-wide ${
                              topLevelActive
                                ? "text-electric-cyan"
                                : "text-muted-foreground dark:text-foreground/90 hover:text-foreground"
                            }`}
                          >
                            {link.name}
                            <span
                              className={`absolute -bottom-1 left-0 z-10 h-px bg-electric-cyan transition-all duration-300 ${
                                topLevelActive
                                  ? "w-full"
                                  : "w-0 group-hover:w-full"
                              }`}
                            />
                          </Link>
                          <ChevronDown
                            size={14}
                            className={`group-hover:rotate-180 transition-transform duration-300 mt-0.5 ${
                              topLevelActive
                                ? "text-electric-cyan"
                                : "text-muted-foreground dark:text-foreground/90"
                            }`}
                          />
                        </div>

                        {/* Desktop Dropdown - render only after mount to avoid hydration mismatch */}
                        {mounted && (
                          <div className="absolute left-0 top-full mt-4 w-48 backdrop-blur-lg supports-backdrop-filter:bg-background/85 dark:supports-backdrop-filter:bg-background/75 bg-background/90 dark:bg-background/85 border border-electric-cyan/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 shadow-lg">
                            {link.submenu.map((item) =>
                              (() => {
                                const submenuActive = isSubmenuActive(
                                  item.href,
                                );
                                return (
                                  <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    aria-current={getAriaCurrent(item.href)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-all border-b border-border/50 last:border-b-0 ${
                                      submenuActive
                                        ? "text-electric-cyan bg-electric-cyan/10"
                                        : "text-popover-foreground/80 hover:text-electric-cyan hover:bg-electric-cyan/10"
                                    }`}
                                  >
                                    {item.name}
                                  </button>
                                );
                              })(),
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => navigateTo(link.href)}
                        aria-current={getAriaCurrent(link.href)}
                        className={`relative text-sm transition-colors font-medium tracking-wide ${
                          topLevelActive
                            ? "text-electric-cyan"
                            : "text-muted-foreground dark:text-foreground/90 hover:text-foreground"
                        }`}
                      >
                        {link.name}
                        <span
                          className={`absolute -bottom-1 left-0 z-10 h-px bg-electric-cyan transition-all duration-300 ${
                            topLevelActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                );
              })}

              <button className="px-5 py-2 bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-medium tracking-wide hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all duration-300">
                Get Quote
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative pt-20 px-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => {
                  const topLevelActive =
                    isTopLevelActive(link.href, Boolean(link.submenu)) ||
                    Boolean(
                      link.submenu?.some((item) => isSubmenuActive(item.href)),
                    );

                  return (
                    <div key={link.name}>
                      {link.submenu ? (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between py-2 border-b border-border w-full"
                          >
                            <Link
                              href={link.href}
                              onClick={closeMenus}
                              aria-current={getAriaCurrent(link.href)}
                              className={`text-2xl font-bold transition-colors ${
                                topLevelActive
                                  ? "text-electric-cyan"
                                  : "text-foreground hover:text-electric-cyan"
                              }`}
                            >
                              {link.name}
                            </Link>
                            <button
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === link.name ? null : link.name,
                                )
                              }
                              className="p-1 text-muted-foreground hover:text-electric-cyan transition-colors"
                            >
                              <ChevronDown
                                size={20}
                                className={`transition-transform ${topLevelActive ? "text-electric-cyan" : ""} ${openDropdown === link.name ? "rotate-180" : ""}`}
                              />
                            </button>
                          </motion.div>

                          {/* Mobile Dropdown */}
                          <AnimatePresence>
                            {openDropdown === link.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                {link.submenu.map((item) => {
                                  const submenuActive = isSubmenuActive(
                                    item.href,
                                  );

                                  return (
                                    <motion.button
                                      key={item.name}
                                      onClick={() => scrollToSection(item.href)}
                                      aria-current={getAriaCurrent(item.href)}
                                      className={`w-full text-left text-lg transition-colors py-2 pl-4 border-b border-border/50 ${
                                        submenuActive
                                          ? "text-electric-cyan"
                                          : "text-muted-foreground hover:text-electric-cyan"
                                      }`}
                                    >
                                      {item.name}
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => navigateTo(link.href)}
                          aria-current={getAriaCurrent(link.href)}
                          className={`text-left text-2xl font-bold transition-colors py-2 border-b border-border w-full ${
                            topLevelActive
                              ? "text-electric-cyan"
                              : "text-foreground hover:text-electric-cyan"
                          }`}
                        >
                          {link.name}
                        </motion.button>
                      )}
                    </div>
                  );
                })}

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-4 w-full py-4 bg-electric-cyan text-primary-foreground font-bold text-lg tracking-wide"
                >
                  Get Quote
                </motion.button>

                {/* Mobile Theme Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  className="flex items-center justify-between py-3 border-t border-border mt-4"
                >
                  <span className="text-sm text-muted-foreground font-medium">
                    Theme
                  </span>
                  <ThemeToggle />
                </motion.div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-8 left-6 right-6">
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest text-center">
                  24/7 EMERGENCY SERVICES AVAILABLE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
