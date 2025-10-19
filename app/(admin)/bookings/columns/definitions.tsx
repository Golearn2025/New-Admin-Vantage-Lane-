/**
 * Bookings Columns - Definitions Merger
 * 
 * Combines part1 and part2 column definitions
 * Compliant: <20 lines
 */

import type { Column } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin/shared/api/contracts/bookings';
import { columnspart1 } from './definitions-part1';
import { columnspart2 } from './definitions-part2';

export const bookingsColumns: Column<BookingListItem>[] = [
  ...columnspart1,
  ...columnspart2,
];
