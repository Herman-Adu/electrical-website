/**
 * Project Category Hero Button Data
 * Data-driven configuration for hero action buttons
 * Designed for easy updates without touching the component
 */

export interface CategoriesHeroButton {
  label: string;
  href: string;
  isExternal: boolean;
}

export const categoriesHeroButtons: CategoriesHeroButton[] = [
  {
    label: "All Projects",
    href: "/projects",
    isExternal: false,
  },
  {
    label: "Start a Project",
    href: "/contact",
    isExternal: false,
  },
];
