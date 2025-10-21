/**
 * Bookings Columns - Type Definitions
 */

import type { Column } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';

export interface BookingsColumnsProps {
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  allSelected?: boolean;
  selectedIds?: Set<string>;
}

export type BookingColumn = Column<BookingListItem>;
