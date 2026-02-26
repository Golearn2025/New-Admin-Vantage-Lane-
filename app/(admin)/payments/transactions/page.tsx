/**
 * Transactions Page
 * 
 * Routing only - zero logic
 * Import feature component from @features/
 */

import dynamic from 'next/dynamic';

const PaymentsTable = dynamic(
  () => import('@features/admin/payments-table').then(mod => ({ default: mod.PaymentsTable })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading transactions...</div>,
    ssr: false 
  }
);

export default function TransactionsPage() {
  return <PaymentsTable />;
}
