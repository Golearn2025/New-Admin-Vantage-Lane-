/**
 * Driver Dashboard Route - Enterprise Dashboard with Driver Data
 * Uses same DashboardPage component as admin/operator but with driver-filtered data
 */

import { DriverDashboard } from '@features/driver/driver-dashboard';

export default function DriverRoute() {
  return <DriverDashboard />;
}
