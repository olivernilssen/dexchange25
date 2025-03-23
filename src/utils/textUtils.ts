/**
 * Utility functions for text manipulation
 */

/**
 * Cleans a session title by removing the word "Break" if it appears at the end
 */
export function cleanSessionTitle(title: string): string {
  // Remove "Break" if it's at the end of the title (with optional space before it)
  return title.replace(/\s*Break$/i, '');
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}