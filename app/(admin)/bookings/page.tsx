/**
 * All Bookings Page (Overview)
 *
 * Shows all bookings with tabs for trip types (One Way, Return, etc.)
 * No status filter - shows ALL bookings regardless of status
 */

import dynamic from 'next/dynamic';

const BookingsWithTabs = dynamic(
  () => import('@features/shared/bookings-table').then(mod => ({ default: mod.BookingsWithTabs })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>,
    ssr: false 
  }
);

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
