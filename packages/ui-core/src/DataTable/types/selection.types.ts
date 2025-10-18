/**
 * Selection Types
 * 
 * Type definitions pentru row selection în DataTable.
 * <40 linii - respectă regulile proiectului!
 */

/**
 * Selection state
 */
export interface SelectionState<TData = unknown> {
  /**
   * Selected row IDs (using getRowId function)
   */
  selectedIds: Set<string>;
  
  /**
   * Are all visible rows selected?
   */
  isAllSelected: boolean;
  
  /**
   * Is selection indeterminate? (some but not all selected)
   */
  isIndeterminate: boolean;
  
  /**
   * Get selected rows
   */
  getSelectedRows: () => TData[];
}

/**
 * Expandable row state
 */
export interface ExpandableState {
  /**
   * Expanded row IDs
   */
  expandedIds: Set<string>;
  
  /**
   * Toggle row expansion
   */
  toggleRow: (rowId: string) => void;
  
  /**
   * Is row expanded?
   */
  isExpanded: (rowId: string) => boolean;
}
