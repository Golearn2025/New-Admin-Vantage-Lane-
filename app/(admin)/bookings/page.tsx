/**
 * All Bookings Page (Overview)
 *
 * Shows all bookings across all states
 * Use /bookings/active or /bookings/past for filtered views
 */

import { BookingsTable } from './BookingsTable';

export default function AllBookingsPage() {
  return (
    <BookingsTable
      title="All Bookings"
      description="Overview of all bookings"
      showStatusFilter={true}
    />
  );
}
