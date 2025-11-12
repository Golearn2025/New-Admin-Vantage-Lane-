/**
 * Driver Page - Redirects to bookings
 * 
 * Driver functionality has been consolidated into the main admin dashboard.
 */

import { redirect } from 'next/navigation';

export default function DriverPage() {
  redirect('/bookings');
}
