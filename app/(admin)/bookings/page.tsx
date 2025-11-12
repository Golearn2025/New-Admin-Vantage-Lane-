/**
 * All Bookings Page (Overview)
 *
 * Shows all bookings with tabs for trip types (One Way, Return, etc.)
 * No status filter - shows ALL bookings regardless of status
 */

import { BookingsWithTabs } from '@features/bookings-table';

export default function AllBookingsPage() {
  return (
    <BookingsWithTabs
      title="All Bookings"
      description="Overview of all bookings by type"
      showStatusFilter={true}
    />
  );
}
