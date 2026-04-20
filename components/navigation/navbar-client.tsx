"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandSection } from "@/components/navigation/brand-section";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { ActionBar } from "@/components/navigation/action-bar";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";

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
      { name: "Quotation", href: "/quotation" },
    ],
  },
  {
    name: "Projects",
    href: "/projects",
    submenu: [
      { name: "All Projects", href: "/projects" },
      { name: "Browse Categories", href: "/projects/category" },
      { name: "Residential", href: "/projects/category/residential" },
      {
        name: "Commercial Lighting",
        href: "/projects/category/commercial-lighting",
      },
      { name: "Power Boards", href: "/projects/category/power-boards" },
    ],
  },
  {
    name: "News Hub",
    href: "/news-hub",
    submenu: [
      { name: "Latest News", href: "/news-hub" },
      { name: "Browse Categories", href: "/news-hub/category" },
      { name: "Residential", href: "/news-hub/category/residential" },
      { name: "Industrial", href: "/news-hub/category/industrial" },
      { name: "Partners", href: "/news-hub/category/partners" },
      { name: "Case Studies", href: "/news-hub/category/case-studies" },
      { name: "Insights", href: "/news-hub/category/insights" },
      { name: "Reviews", href: "/news-hub/category/reviews" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

export function NavbarClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    // Use passive flag for better scroll performance (can't prevent scroll anyway)
    window.addEventListener("scroll", handleScroll, { passive: true });
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
          scrollToElementWithOffset(element, { pageType: 'default' });
          window.location.hash = hashPart; // Triggers hashchange automatically
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
        currentPath === "/services" ||
        currentPath.startsWith("/services/") ||
        currentPath === "/quotation"
      );
    }

    if (targetPath === "/projects") {
      return (
        currentPath === "/projects" || currentPath.startsWith("/projects/")
      );
    }

    if (targetPath === "/news-hub") {
      return (
        currentPath === "/news-hub" || currentPath.startsWith("/news-hub/")
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
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-lg supports-backdrop-filter:bg-background/85 dark:supports-backdrop-filter:bg-background/75 bg-background/90 dark:bg-background/85 transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Brand */}
            <BrandSection />

            {/* Center: Desktop Nav */}
            <DesktopNav
              navLinks={navLinks}
              onScroll={scrollToSection}
              onNavigate={navigateTo}
              currentHash={currentHash}
            />

            {/* Right: Actions */}
            <div className="hidden lg:flex items-center h-full">
              <ActionBar />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
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
            className="fixed inset-x-0 top-16 bottom-0 z-49 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div
              id="mobile-navigation-menu"
              data-slot="mobile-nav"
              className="relative pt-6 xs:pt-4 px-4 xs:px-6 h-full overflow-y-auto"
            >
              <div className="flex flex-col gap-2 xs:gap-4">
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
                            className="flex items-center justify-between py-2 xs:py-3 border-b border-border w-full"
                          >
                            <Link
                              href={link.href}
                              onClick={closeMenus}
                              aria-current={getAriaCurrent(link.href)}
                              className={`text-lg xs:text-xl sm:text-2xl font-bold transition-colors flex-1 ${
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
                              type="button"
                              aria-label={`${openDropdown === link.name ? "Collapse" : "Expand"} ${link.name} menu`}
                              aria-expanded={openDropdown === link.name}
                              className="p-1 ml-2 text-muted-foreground hover:text-electric-cyan transition-colors flex-shrink-0"
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
                                      className={`w-full text-left text-sm xs:text-base sm:text-lg transition-colors py-2 xs:py-2.5 pl-6 xs:pl-8 border-b border-border/50 ${
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
                          className={`text-left text-lg xs:text-xl sm:text-2xl font-bold transition-colors py-2 xs:py-3 border-b border-border w-full ${
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
                  className="mt-4 w-full py-3 xs:py-4 bg-electric-cyan text-primary-foreground font-bold text-base xs:text-lg tracking-wide rounded-md"
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
              <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-border">
                <div className="font-mono text-[10px] xs:text-xs text-muted-foreground tracking-widest text-center pb-4">
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
