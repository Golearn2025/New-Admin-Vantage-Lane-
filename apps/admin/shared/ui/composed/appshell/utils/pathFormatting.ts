/**
 * Path Formatting Utilities
 *
 * Performance optimized path transformation helpers.
 * Extracted from inline map functions for better performance.
 */

/**
 * Transforms word to title case
 */
export const toTitleCase = (word: string): string => 
  word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Formats path to readable label
 */
export function formatPathToLabel(path: string): string {
  const lastSegment = path.split('/').pop() || path;
  
  return lastSegment
    .split('-')
    .map(toTitleCase)
    .join(' ');
}
