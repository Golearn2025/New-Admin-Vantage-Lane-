/**
 * Past Bookings Page
 *
 * Shows bookings in final states:
 * - COMPLETED: Trip finished successfully
 * - CANCELLED: Booking cancelled (by customer, driver, or admin)
 */

import { BookingsTable } from '@features/shared/bookings-table';

// ✅ Constant outside component prevents array recreation on every render
const PAST_STATUS_FILTER = ['completed', 'cancelled'];
const PAST_FILTER_OPTIONS = ['completed', 'cancelled']; // Dropdown options

export default function PastBookingsPage() {
  return (
    <BookingsTable
      statusFilter={PAST_STATUS_FILTER}
      title="Past Bookings"
      description="Completed and cancelled bookings"
      showStatusFilter={true}
      statusFilterOptions={PAST_FILTER_OPTIONS}
    />
  );
}
