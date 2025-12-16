/**
 * Driver Dashboard - Enterprise Dashboard with Driver-Specific Data
 * 
 * Uses the full DashboardPage component with driver data filtering.
 * Cards and charts automatically filter based on driver's role and auth_user_id.
 */

'use client';

import { DashboardPage } from '@features/shared/dashboard';

/**
 * Driver Dashboard Component
 * 
 * Renders enterprise dashboard with:
 * - Driver-specific stats (trips, earnings, documents status)
 * - Recent trips table
 * - Earnings charts
 * - Document upload reminders
 */
export function DriverDashboard() {
  return <DashboardPage />;
}
