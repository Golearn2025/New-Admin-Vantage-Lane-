/**
 * Sort Types
 * 
 * Type definitions pentru sorting în DataTable.
 * <40 linii - respectă regulile proiectului!
 */

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort state
 */
export interface SortState {
  /**
   * Column ID being sorted
   */
  columnId: string | null;
  
  /**
   * Sort direction
   */
  direction: SortDirection;
}
