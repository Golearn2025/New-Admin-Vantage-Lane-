/**
 * All Bookings Page (Overview)
 *
 * Shows all bookings with tabs for trip types (One Way, Return, etc.)
 * No status filter - shows ALL bookings regardless of status
 */

import { BookingsWithTabs } from '@features/shared/bookings-table';

export default function AllBookingsPage() {
  return (
    <BookingsWithTabs
      key="all-bookings"  // Force fresh mount, no cached state
      title="All Bookings"
      description="Overview of all bookings by type"
      showStatusFilter={true}
    />
  );
}
