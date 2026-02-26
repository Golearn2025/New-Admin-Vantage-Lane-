/**
 * Dashboard Route - Routing Only (ZERO Logic)
 * All business logic moved to @features/dashboard
 */

import dynamic from 'next/dynamic';

const DashboardPage = dynamic(
  () => import('@features/shared/dashboard').then(mod => ({ default: mod.DashboardPage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>,
    ssr: false 
  }
);

export default function DashboardRoute() {
  return <DashboardPage />;
}
