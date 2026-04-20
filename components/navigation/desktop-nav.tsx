"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Reusable desktop navigation with active link detection, hover/focus dropdowns,
 * and keyboard-accessible submenu interactions for Next.js App Router layouts.
 */
export interface DesktopNavSubmenuItem {
  name: string;
  href: string;
}

export interface DesktopNavLink {
  name: string;
  href: string;
  submenu?: DesktopNavSubmenuItem[];
}

export interface DesktopNavProps {
  navLinks: DesktopNavLink[];
  onScroll: (href: string) => void;
  onNavigate: (href: string) => void;
  currentHash: string;
}

const normalizePath = (path: string): string => {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export function DesktopNav({
  navLinks,
  onScroll,
  onNavigate,
  currentHash: propCurrentHash,
}: DesktopNavProps) {
  const pathname = usePathname();
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [focusedDropdown, setFocusedDropdown] = useState<string | null>(null);

  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const submenuItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Use currentHash prop directly — parent (NavbarClient) manages hash state
  const currentHash = propCurrentHash;

  const isSubmenuActive = (href: string): boolean => {
    const [rawPath, rawHash] = href.split("#");
    const targetPath = normalizePath(rawPath || "/");
    const currentPath = normalizePath(pathname);

    if (rawHash) {
      return currentPath === targetPath && currentHash === `#${rawHash}`;
    }

    return currentPath === targetPath;
  };

  const isTopLevelActive = (href: string, hasSubmenu: boolean): boolean => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    if (targetPath === "/services") {
      return (
        currentPath === "/services" || currentPath.startsWith("/services/")
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

  const activeMap = useMemo(() => {
    return navLinks.reduce<Record<string, boolean>>((accumulator, link) => {
      const topLevel = isTopLevelActive(link.href, Boolean(link.submenu));
      const submenu = Boolean(
        link.submenu?.some((item) => isSubmenuActive(item.href)),
      );
      accumulator[link.name] = topLevel || submenu;
      return accumulator;
    }, {});
  }, [navLinks, pathname, propCurrentHash]);

  const isDropdownOpen = (linkName: string): boolean => {
    return hoveredDropdown === linkName || focusedDropdown === linkName;
  };

  const handleTopLevelKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    link: DesktopNavLink,
  ) => {
    if (!link.submenu?.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedDropdown(link.name);
      const firstSubmenuItem = link.submenu[0];
      if (!firstSubmenuItem) return;
      const submenuRefKey = `${link.name}-${firstSubmenuItem.name}`;
      submenuItemRefs.current[submenuRefKey]?.focus();
    }

    if (event.key === "Escape") {
      setHoveredDropdown(null);
      setFocusedDropdown(null);
      triggerRefs.current[link.name]?.focus();
    }
  };

  const handleSubmenuKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    linkName: string,
  ) => {
    if (event.key !== "Escape") return;
    setHoveredDropdown(null);
    setFocusedDropdown(null);
    triggerRefs.current[linkName]?.focus();
  };

  return (
    <div
      className="hidden lg:flex items-center justify-center flex-1 gap-8"
      aria-label="Desktop navigation"
    >
      {navLinks.map((link) => {
        const topLevelActive = activeMap[link.name] ?? false;

        return (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() =>
              setHoveredDropdown(link.submenu ? link.name : null)
            }
            onMouseLeave={() => setHoveredDropdown(null)}
            onFocusCapture={() => {
              if (link.submenu) setFocusedDropdown(link.name);
            }}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              ) {
                setFocusedDropdown(null);
              }
            }}
            onKeyDown={(event) => handleTopLevelKeyDown(event, link)}
          >
            {link.submenu ? (
              <>
                <div className="group flex items-center gap-0.5">
                  <Link
                    href={link.href}
                    ref={(element) => {
                      triggerRefs.current[link.name] = element;
                    }}
                    aria-label={`Navigate to ${link.name}`}
                    aria-haspopup="menu"
                    aria-expanded={isDropdownOpen(link.name)}
                    aria-controls={`${link.name.toLowerCase().replace(/\s+/g, "-")}-submenu`}
                    aria-current={getAriaCurrent(link.href)}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(link.href);
                    }}
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
                  </Link>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform duration-300 mt-0.5 ${
                      isDropdownOpen(link.name) ? "rotate-180" : "rotate-0"
                    } ${
                      topLevelActive
                        ? "text-electric-cyan"
                        : "text-muted-foreground dark:text-foreground/90"
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen(link.name) && (
                    <motion.div
                      id={`${link.name.toLowerCase().replace(/\s+/g, "-")}-submenu`}
                      role="menu"
                      aria-label={`${link.name} submenu`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-4 w-56 backdrop-blur-lg supports-backdrop-filter:bg-background/85 dark:supports-backdrop-filter:bg-background/75 bg-background/90 dark:bg-background/85 border border-electric-cyan/20 rounded-lg pt-2 shadow-lg"
                    >
                      {link.submenu.map((item) => {
                        const submenuActive = isSubmenuActive(item.href);
                        const submenuRefKey = `${link.name}-${item.name}`;

                        return (
                          <button
                            key={item.name}
                            ref={(element) => {
                              submenuItemRefs.current[submenuRefKey] = element;
                            }}
                            type="button"
                            role="menuitem"
                            aria-label={`Navigate to ${item.name}`}
                            aria-current={getAriaCurrent(item.href)}
                            onClick={() => onScroll(item.href)}
                            onKeyDown={(event) =>
                              handleSubmenuKeyDown(event, link.name)
                            }
                            className={`w-full text-left px-4 py-2 text-sm transition-all border-b border-border/50 last:border-b-0 ${
                              submenuActive
                                ? "text-electric-cyan bg-electric-cyan/10"
                                : "text-popover-foreground/80 hover:text-electric-cyan hover:bg-electric-cyan/10"
                            }`}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                type="button"
                aria-label={`Navigate to ${link.name}`}
                aria-current={getAriaCurrent(link.href)}
                onClick={() => onNavigate(link.href)}
                className={`group relative text-sm transition-colors font-medium tracking-wide ${
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
    </div>
  );
}
