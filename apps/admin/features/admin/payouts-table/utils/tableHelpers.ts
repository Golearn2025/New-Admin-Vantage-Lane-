/**
 * PayoutsTable Helpers
 * Metrics calculation and export handlers
 * < 50 lines - RULES.md compliant
 */

import type { Payout } from '../types';
import type { PayoutsFilters } from '../hooks/usePayoutsFilters';

export function calculatePayoutMetrics(data: Payout[]) {
  const totalPayouts = data.length;
  const totalAmount = `£${(data.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)}`;
  const pendingPayouts = data.filter(p => p.status === 'pending').length;
  const completedPayouts = data.filter(p => p.status === 'completed').length;

  return {
    totalPayouts: totalPayouts.toString(),
    totalAmount,
    pendingPayouts: pendingPayouts.toString(),
    completedPayouts: completedPayouts.toString(),
  };
}

export function handleExportAll(format: 'excel' | 'csv', count: number) {
  alert(`Exporting all ${count} payouts to ${format.toUpperCase()}`);
  // TODO: Implement actual export logic
}

export function handleExportSelected(format: 'excel' | 'csv', count: number) {
  alert(`Exporting ${count} selected payouts to ${format.toUpperCase()}`);
  // TODO: Implement actual export logic
}

export function filterPayouts(data: Payout[], filters: PayoutsFilters): Payout[] {
  let filtered = [...data];

  if (filters.driverId) {
    filtered = filtered.filter(p => p.driverName?.includes(filters.driverId));
  }
  if (filters.status) {
    filtered = filtered.filter(p => p.status === filters.status);
  }
  if (filters.dateRange.from) {
    const fromDate = new Date(filters.dateRange.from);
    filtered = filtered.filter(p => new Date(p.createdAt || '') >= fromDate);
  }
  if (filters.dateRange.to) {
    const toDate = new Date(filters.dateRange.to);
    filtered = filtered.filter(p => new Date(p.createdAt || '') <= toDate);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.id?.toLowerCase().includes(searchLower) ||
      p.driverName?.toLowerCase().includes(searchLower) ||
      p.status?.toLowerCase().includes(searchLower)
    );
  }
  return filtered;
}

export function getBulkActions(handleExportSelected: (format: 'excel' | 'csv') => void) {
  return [
    {
      id: 'export-excel',
      label: 'Export Selected (Excel)',
      onClick: () => handleExportSelected('excel'),
    },
    {
      id: 'export-csv',
      label: 'Export Selected (CSV)',
      onClick: () => handleExportSelected('csv'),
    },
  ];
}
