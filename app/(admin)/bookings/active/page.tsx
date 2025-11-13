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

type BookingStatus = 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress';

// ✅ Constant outside component prevents array recreation on every render
const ACTIVE_STATUS_FILTER: BookingStatus[] = ['pending', 'assigned', 'en_route', 'arrived', 'in_progress'];

export default function ActiveBookingsPage() {
  return (
    <BookingsWithTabs
      statusFilter={ACTIVE_STATUS_FILTER}
      title="Active Bookings"
      description="Current bookings in progress"
      showStatusFilter={true}
    />
  );
}
