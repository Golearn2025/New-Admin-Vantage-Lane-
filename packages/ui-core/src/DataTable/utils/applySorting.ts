/**
 * applySorting Utility
 * 
 * Applies sorting to table data based on column configuration
 * Enterprise pattern - 100% reusable across all tables
 * 
 * RULES.md compliant:
 * - Zero TypeScript 'any'
 * - Pure function (no side effects)
 * - Type-safe with generics
 */

import type { UseSortingReturn } from '../hooks/useSorting';
import type { Column } from '../types/index';

/**
 * Apply sorting to data array based on current sort state
 * 
 * @param data - Array of data to sort
 * @param sorting - Sorting state from useSorting hook
 * @param columns - Column definitions with accessor functions
 * @returns Sorted array (new array, does not mutate original)
 */
export function applySorting<T>(
  data: T[],
  sorting: UseSortingReturn | undefined,
  columns: Column<T>[]
): T[] {
  // No sorting applied
  if (!sorting || !sorting.columnId || !sorting.direction) {
    return data;
  }

  // Find column definition
  const column = columns.find((col) => col.id === sorting.columnId);
  if (!column || !column.accessor) {
    console.warn(`Column "${sorting.columnId}" not found or has no accessor`);
    return data;
  }

  // Extract accessor for type narrowing (already checked above)
  const accessor = column.accessor!;

  // Create new sorted array (immutable)
  return [...data].sort((a, b) => {
    // Get values using column accessor
    const aValue = accessor(a);
    const bValue = accessor(b);

    // Handle null/undefined values (always sort to end)
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Compare values
    let result = 0;
    
    // String comparison (case-insensitive)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
    }
    // Number comparison
    else if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    }
    // Date comparison
    else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime();
    }
    // Boolean comparison
    else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      result = aValue === bValue ? 0 : aValue ? 1 : -1;
    }
    // Generic comparison (fallback)
    else {
      result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }

    // Apply sort direction
    return sorting.direction === 'asc' ? result : -result;
  });
}
