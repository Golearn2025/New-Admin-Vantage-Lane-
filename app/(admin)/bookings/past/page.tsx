/**
 * Past Bookings Page
 *
 * Shows bookings in final states:
 * - COMPLETED: Trip finished successfully
 * - CANCELLED: Booking cancelled (by customer, driver, or admin)
 */

import dynamic from 'next/dynamic';

const BookingsWithTabs = dynamic(
  () => import('@features/shared/bookings-table').then(mod => ({ default: mod.BookingsWithTabs })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>,
    ssr: false 
  }
);

// ✅ Constant outside component prevents array recreation on every render
const PAST_STATUS_FILTER: ('completed' | 'cancelled')[] = ['completed', 'cancelled'];

export default function PastBookingsPage() {
  return (
    <BookingsWithTabs
      key="past-bookings"
      statusFilter={PAST_STATUS_FILTER}
      title="Past Bookings"
      description="Completed and cancelled bookings"
      showStatusFilter={true}
    />
  );
}
