"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Menu, X, Home, Wrench, FileText, BookOpen, Phone } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/atoms/theme-toggle"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/quotation", label: "Get a Quote", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: BookOpen, matchPrefix: true },
  { href: "/contact", label: "Contact Us", icon: Phone },
]

export function Navbar({ fullWidth = false }: { fullWidth?: boolean }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Close mobile menu when viewport reaches desktop size (md: 768px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMobileMenuOpen(false)
      }
    }

    // Check initial state
    handleMediaChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaChange)
    
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [])

  const isActive = (link: typeof navLinks[0]) => {
    if (link.matchPrefix) {
      return pathname.startsWith(link.href)
    }
    return pathname === link.href
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur-xl shadow-sm"
      >
        <div className={fullWidth ? "px-4" : "container mx-auto px-4 sm:px-6 lg:px-8"}>
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {/* Electric glow effect behind logo */}
                <div className="absolute inset-0 rounded-lg bg-accent/20 blur-md" />
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/30">
                  <Zap className="w-6 h-6 text-accent" fill="currentColor" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-lg font-semibold text-foreground md:hidden lg:block">Electrical Services</h1>
                <p className="text-xs text-muted-foreground hidden sm:block md:hidden lg:block">Professional & Reliable</p>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(link)
                      ? "bg-accent/10 text-accent border border-accent/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Theme toggle and mobile menu button */}
            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 z-50 w-full max-w-xs bg-background border-l border-border shadow-xl md:hidden"
            >
              <nav className="flex flex-col p-4 h-full">
                <div className="space-y-1">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive(link)
                              ? "bg-accent/10 text-accent border border-accent/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Emergency contact at bottom of mobile menu */}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="px-4 py-3 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1">24/7 Emergency Service</p>
                    <p className="text-lg font-semibold text-accent">0800 123 4567</p>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
