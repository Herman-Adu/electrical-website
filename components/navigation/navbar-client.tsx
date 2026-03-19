'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ChevronDown } from 'lucide-react';

const navLinks = [
  { 
    name: 'Home', 
    href: '/',
    submenu: [
      { name: 'Services', href: '#services' },
      { name: 'Illumination', href: '#illumination' },
      { name: 'Features', href: '#features' },
      { name: 'Architecture', href: '#architecture' },
      { name: 'Dashboard', href: '#dashboard' },
      { name: 'Smart Living', href: '#smart-living' },
      { name: 'Power Your Vision', href: '#power-vision' },
    ]
  },
  { name: 'Contact', href: '/contact' },
];

export function NavbarClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const navigateTo = (href: string) => {
    window.location.href = href;
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[var(--deep-slate)]/90 backdrop-blur-md border-b border-[var(--electric-cyan)]/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Zap 
                  size={24} 
                  className="text-[var(--electric-cyan)] group-hover:animate-pulse transition-all" 
                />
                <div className="absolute inset-0 bg-[var(--electric-cyan)]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm lg:text-base tracking-tight leading-none">
                  NEXGEN
                </span>
                <span className="font-mono text-[8px] lg:text-[9px] text-[var(--electric-cyan)]/60 tracking-[0.2em] uppercase">
                  Electrical
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.submenu ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        <a
                          href={link.href}
                          className="relative text-sm text-slate-400 hover:text-white transition-colors font-medium tracking-wide"
                        >
                          {link.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-cyan)] group-hover:w-full transition-all duration-300" />
                        </a>
                        <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300 mt-0.5" />
                      </div>
                      
                      {/* Desktop Dropdown */}
                      <div className="absolute left-0 mt-0 w-48 bg-[var(--deep-slate)]/95 backdrop-blur-md border border-[var(--electric-cyan)]/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                        {link.submenu.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => scrollToSection(item.href)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-[var(--electric-cyan)] hover:bg-[var(--electric-cyan)]/10 transition-all border-b border-slate-800/50 last:border-b-0"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => navigateTo(link.href)}
                      className="relative text-sm text-slate-400 hover:text-white transition-colors font-medium tracking-wide"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-cyan)] group-hover:w-full transition-all duration-300" />
                    </button>
                  )}
                </div>
              ))}
              
              <button className="px-5 py-2 bg-[var(--electric-cyan)]/10 border border-[var(--electric-cyan)]/30 text-[var(--electric-cyan)] text-sm font-medium tracking-wide hover:bg-[var(--electric-cyan)]/20 hover:border-[var(--electric-cyan)]/50 transition-all duration-300">
                Get Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
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
              className="absolute inset-0 bg-[var(--deep-slate)]/95 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="relative pt-20 px-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <div key={link.name}>
                    {link.submenu ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between py-2 border-b border-slate-800 w-full"
                        >
                          <a
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-bold text-white hover:text-[var(--electric-cyan)] transition-colors"
                          >
                            {link.name}
                          </a>
                          <button
                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                            className="p-1 text-slate-400 hover:text-[var(--electric-cyan)] transition-colors"
                          >
                            <ChevronDown 
                              size={20} 
                              className={`transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </motion.div>
                        
                        {/* Mobile Dropdown */}
                        <AnimatePresence>
                          {openDropdown === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {link.submenu.map((item) => (
                                <motion.button
                                  key={item.name}
                                  onClick={() => scrollToSection(item.href)}
                                  className="w-full text-left text-lg text-slate-300 hover:text-[var(--electric-cyan)] transition-colors py-2 pl-4 border-b border-slate-800/50"
                                >
                                  {item.name}
                                </motion.button>
                              ))}
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
                        className="text-left text-2xl font-bold text-white hover:text-[var(--electric-cyan)] transition-colors py-2 border-b border-slate-800 w-full"
                      >
                        {link.name}
                      </motion.button>
                    )}
                  </div>
                ))}
                
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-4 w-full py-4 bg-[var(--electric-cyan)] text-[var(--deep-slate)] font-bold text-lg tracking-wide"
                >
                  Get Quote
                </motion.button>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-8 left-6 right-6">
                <div className="font-mono text-[10px] text-slate-600 tracking-widest text-center">
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
