/**
 * Payments Page
 * 
 * Routing only - zero logic
 * Import feature component from @features/
 */

import dynamic from 'next/dynamic';

const PaymentsOverview = dynamic(
  () => import('@features/admin/payments-overview').then(mod => ({ default: mod.PaymentsOverview })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payments...</div>,
    ssr: false 
  }
);

export default function PaymentsPage() {
  return <PaymentsOverview />;
}
