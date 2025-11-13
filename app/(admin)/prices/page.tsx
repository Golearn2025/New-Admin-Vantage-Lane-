/**
 * Prices Page
 * 
 * Route: /prices
 * Architecture: app/ layer - DOAR routing, zero business logic
 */

import { PricesManagementPage } from '@features/admin/prices-management';

export default function PricesPage() {
  return <PricesManagementPage />;
}
