/**
 * Operator Dashboard Route - Enterprise Dashboard with Operator Data
 * Uses same DashboardPage as admin but with organization-filtered data
 */

import { DashboardPage } from '@features/shared/dashboard';

export default function OperatorRoute() {
  return <DashboardPage />;
}
