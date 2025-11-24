/**
 * Active Bookings Page
 *
 * Shows bookings in active states:
 * - PENDING: New bookings waiting for driver
 * - ASSIGNED: Driver assigned, pending pickup
 * - EN_ROUTE: Driver heading to pickup
 * - ARRIVED: Driver at pickup location
 * - IN_PROGRESS: Trip in progress
 */

import { BookingsWithTabs } from '@features/shared/bookings-table';

// ✅ No statusFilter - Active page shows ALL bookings with dropdown filtering
export default function ActiveBookingsPage() {
  return (
    <BookingsWithTabs
      key="active-bookings"  // Separate state from All Bookings
      title="Active Bookings"
      description="All bookings with status filtering"
      showStatusFilter={true}
    />
  );
}
