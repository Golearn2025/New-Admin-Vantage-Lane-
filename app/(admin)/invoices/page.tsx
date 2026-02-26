/**
 * Invoices Page
 * 
 * Routing only - zero logic
 * Import feature component from @features/
 */

import dynamic from 'next/dynamic';

const InvoicesTable = dynamic(
  () => import('@features/admin/invoices-table').then(mod => ({ default: mod.InvoicesTable })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading invoices...</div>,
    ssr: false 
  }
);

export default function InvoicesPage() {
  return <InvoicesTable />;
}
