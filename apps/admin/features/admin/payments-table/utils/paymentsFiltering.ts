/**
 * Payments Filtering Utilities
 * 
 * Centralized filtering logic for payments data
 * 
 * ✅ Zero any types
 * ✅ Pure functions
 * ✅ Reusable filtering logic
 */

import type { Payment } from '../types';

interface FiltersState {
  status?: string;
  dateRange: {
    from?: Date | null | string;
    to?: Date | null | string;
  };
  amountRange: {
    min?: number | null;
    max?: number | null;
  };
  search?: string;
}

export function filterPayments(data: Payment[], filters: FiltersState): Payment[] {
  let filtered = [...data];

  // Status filter
  if (filters.status) {
    filtered = filtered.filter(p => p.status === filters.status);
  }

  // Date range filter
  if (filters.dateRange.from) {
    const fromDate = new Date(filters.dateRange.from);
    filtered = filtered.filter(p => {
      const paymentDate = new Date(p.createdAt || '');
      return paymentDate >= fromDate;
    });
  }
  if (filters.dateRange.to) {
    const toDate = new Date(filters.dateRange.to);
    filtered = filtered.filter(p => {
      const paymentDate = new Date(p.createdAt || '');
      return paymentDate <= toDate;
    });
  }

  // Amount range filter
  if (filters.amountRange.min !== null) {
    filtered = filtered.filter(p => (p.amount || 0) / 100 >= (filters.amountRange.min || 0));
  }
  if (filters.amountRange.max !== null) {
    filtered = filtered.filter(p => (p.amount || 0) / 100 <= (filters.amountRange.max || 0));
  }

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.id?.toLowerCase().includes(searchLower) ||
      p.bookingId?.toLowerCase().includes(searchLower) ||
      p.status?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}
