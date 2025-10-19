/**
 * Past Bookings Page
 * 
 * Shows bookings in final states:
 * - COMPLETED: Trip finished successfully
 * - CANCELLED: Booking cancelled (by customer, driver, or admin)
 */

import { BookingsTable } from '../BookingsTable';

export default function PastBookingsPage() {
  return (
    <BookingsTable
      statusFilter={['completed', 'cancelled']}
      title="Past Bookings"
      description="Completed and cancelled bookings"
      showStatusFilter={true}
    />
  );
}
