/**
 * TableFilters Types
 * 100% Reutilizabil - Generic filter system
 */

export interface FilterOption {
  label: string;
  value: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface AmountRange {
  min: number | null;
  max: number | null;
}

export interface TableFiltersProps {
  /** Status filter options */
  statusOptions?: FilterOption[];
  /** Current status value */
  statusValue?: string;
  /** Status change handler */
  onStatusChange?: (value: string) => void;
  
  /** Enable date range filter */
  showDateRange?: boolean;
  /** Current date range */
  dateRange?: DateRange;
  /** Date range change handler */
  onDateRangeChange?: (range: DateRange) => void;
  
  /** Enable amount range filter */
  showAmountRange?: boolean;
  /** Current amount range */
  amountRange?: AmountRange;
  /** Amount range change handler */
  onAmountRangeChange?: (range: AmountRange) => void;
  
  /** Enable search */
  showSearch?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Search value */
  searchValue?: string;
  /** Search change handler */
  onSearchChange?: (value: string) => void;
  
  /** Clear all filters handler */
  onClearAll?: () => void;
}
