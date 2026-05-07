import { Suspense } from 'react';
import { NavbarClient } from './navbar-client';

/**
 * Navbar Server Component
 * Wraps NavbarClient in a Suspense boundary so that useSearchParams() inside
 * NavbarClient does not block static generation of pages that include the
 * root layout.
 */
export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarClient />
    </Suspense>
  );
}
