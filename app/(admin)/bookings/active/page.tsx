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

import { BookingsWithTabs } from '@features/bookings-table';

export default function ActiveBookingsPage() {
  return (
    <BookingsWithTabs
      statusFilter={['pending', 'assigned', 'en_route', 'arrived', 'in_progress']}
      title="Active Bookings"
      description="Current bookings in progress"
      showStatusFilter={true}
    />
  );
}
