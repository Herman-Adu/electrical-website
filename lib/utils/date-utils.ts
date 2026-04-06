/**
 * Date utility functions for form date constraints
 */

/**
 * Minimum date for service request scheduling
 * Set to today's date (can be used for date picker constraints)
 */
export const minDate = new Date().toISOString().split("T")[0];

/**
 * Format date for display
 */
export function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get next available date (skip weekends if needed)
 */
export function getNextAvailableDate(daysOffset = 1): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
}
