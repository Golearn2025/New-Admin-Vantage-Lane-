/**
 * Prices Page
 * 
 * Route: /prices
 * Architecture: app/ layer - DOAR routing, zero business logic
 */

import dynamic from 'next/dynamic';

const PricesManagementPage = dynamic(
  () => import('@features/admin/prices-management').then(mod => ({ default: mod.PricesManagementPage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading prices...</div>,
    ssr: false 
  }
);

export default function PricesPage() {
  return <PricesManagementPage />;
}
