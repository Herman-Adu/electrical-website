import { NavbarClient } from './navbar-client';

/**
 * Navbar Server Component
 * Renders the client-side navbar component with proper async server handling.
 * This allows the navigation to be placed in layout.tsx and appear on all pages.
 */
export function Navbar() {
  return <NavbarClient />;
}
