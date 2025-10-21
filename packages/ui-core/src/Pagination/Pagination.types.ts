/**
 * Pagination Types
 * Type definitions for pagination component
 */

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Total number of items */
  totalItems: number;

  /** Number of items per page */
  pageSize: number;

  /** Callback when page changes */
  onPageChange: (page: number) => void;

  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  /** Available page size options */
  pageSizeOptions?: number[];

  /** Show page size selector */
  showPageSizeSelector?: boolean;

  /** Show info text ("Showing 1-10 of 52") */
  showInfo?: boolean;

  /** Show previous/next buttons */
  showPrevNext?: boolean;

  /** Show first/last buttons */
  showFirstLast?: boolean;

  /** Maximum page buttons to show */
  maxPageButtons?: number;

  /** Loading state */
  loading?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Additional CSS classes */
  className?: string;
}

export interface PaginationButtonProps {
  /** Page number or action ('prev', 'next', 'first', 'last') */
  page: number | 'prev' | 'next' | 'first' | 'last' | 'ellipsis';

  /** Current active page */
  currentPage: number;

  /** Button is disabled */
  disabled?: boolean;

  /** Click handler */
  onClick: () => void;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Additional CSS classes */
  className?: string;
}

export interface PaginationInfoProps {
  /** Current page (1-indexed) */
  currentPage: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of items */
  totalItems: number;

  /** Size variant */
  size?: 'small' | 'medium' | 'large';

  /** Additional CSS classes */
  className?: string;
}

export interface PageRange {
  start: number;
  end: number;
}
