import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence handling.
 *
 * Combines `clsx` for conditional class joining with `tailwind-merge` to resolve
 * conflicting Tailwind utilities. This prevents specificity wars when combining
 * base classes with overrides.
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, or undefined)
 * @returns A string of merged and de-duplicated Tailwind CSS classes
 *
 * @example
 * // Conditional classes
 * cn('px-2 py-1', isActive && 'bg-blue-500')
 * // => 'px-2 py-1 bg-blue-500'
 *
 * @example
 * // Override conflicting utilities
 * cn('px-2 py-1', 'py-4')
 * // => 'px-2 py-4' (removes duplicate py-1)
 *
 * @example
 * // Dark mode variants
 * cn('bg-white dark:bg-slate-900', 'dark:bg-slate-800')
 * // => 'bg-white dark:bg-slate-800' (merge variant overrides)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
