// PAYOUTS page
import dynamic from 'next/dynamic';

const PayoutsTable = dynamic(
  () => import('@features/admin/payouts-table').then(mod => ({ default: mod.PayoutsTable })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payouts...</div>,
    ssr: false 
  }
);

export default function PayoutsPage() {
  return <PayoutsTable />;
}
