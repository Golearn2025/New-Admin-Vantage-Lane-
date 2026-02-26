/**
 * Notifications Route - Admin
 * Full notifications management page
 */

import dynamic from 'next/dynamic';

const NotificationsManagementPage = dynamic(
  () => import('@features/admin/notifications-management').then(mod => ({ default: mod.NotificationsManagementPage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading notifications...</div>,
    ssr: false 
  }
);

export default function NotificationsRoute() {
  return <NotificationsManagementPage />;
}
