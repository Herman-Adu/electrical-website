import Link from 'next/link';
import { Suspense } from 'react';
import { NavbarClient } from './navbar-client';

// Static fallback rendered before NavbarClient hydrates.
// Ensures nav links are present in the initial HTML for crawlers and E2E tests
// that check the DOM at domcontentloaded before client-side hydration completes.
function NavbarFallback() {
  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/services">Services</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/news-hub">News Hub</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}

/**
 * Navbar Server Component
 * Wraps NavbarClient in a Suspense boundary so that useSearchParams() inside
 * NavbarClient does not block static generation of pages that include the
 * root layout.
 */
export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarClient />
    </Suspense>
  );
}
