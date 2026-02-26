/**
 * Support Tickets Page - Router
 * Next.js 14 App Router page for support tickets management
 */

import dynamic from 'next/dynamic';

const SupportTicketsManagementPage = dynamic(
  () => import('@/features/admin/support-tickets/components/SupportTicketsManagementPage').then(mod => ({ default: mod.SupportTicketsManagementPage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading support tickets...</div>,
    ssr: false 
  }
);

export default function SupportTicketsPage() {
  return <SupportTicketsManagementPage />;
}
