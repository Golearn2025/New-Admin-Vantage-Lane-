/**
 * Pagination Types
 * 
 * Type definitions pentru pagination în DataTable.
 * <50 linii - respectă regulile proiectului!
 */

/**
 * Pagination state
 */
export interface PaginationState {
  /**
   * Current page (0-indexed)
   */
  pageIndex: number;
  
  /**
   * Number of items per page
   */
  pageSize: number;
  
  /**
   * Total number of items
   */
  totalCount: number;
}

/**
 * Pagination props
 */
export interface PaginationProps {
  /**
   * Current page (0-indexed)
   */
  pageIndex: number;
  
  /**
   * Page size
   */
  pageSize: number;
  
  /**
   * Total item count
   */
  totalCount: number;
  
  /**
   * Page size options
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];
  
  /**
   * Page change handler
   */
  onPageChange: (pageIndex: number) => void;
  
  /**
   * Page size change handler
   */
  onPageSizeChange: (pageSize: number) => void;
  
  /**
   * Show page size selector?
   * @default true
   */
  showPageSize?: boolean;
  
  /**
   * Show page info? (e.g., "1-25 of 100")
   * @default true
   */
  showPageInfo?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
}
