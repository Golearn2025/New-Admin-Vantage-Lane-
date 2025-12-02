/**
 * useBookingsFilters Hook
 * 
 * Filter and parameter logic for bookings - focused on filter state management
 */

'use client';

import { useMemo } from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';

interface UseBookingsFiltersParams {
  statusFilter: string[];
  selectedStatus: string;
  tripTypeFilter: string | null;
}

export function useBookingsFilters({
  statusFilter,
  selectedStatus,
  tripTypeFilter,
}: UseBookingsFiltersParams) {
  
  // Convert statusFilter to string for stable dependency (memoized)
  // IMPORTANT: Create new array to avoid mutating prop!
  const statusFilterKey = useMemo(
    () => [...statusFilter].sort().join(','),
    [statusFilter]
  );

  // Check if a booking should be injected based on current filters
  const shouldInjectBooking = useMemo(() => {
    return (booking: any, currentPage: number) => {
      // Only inject on first page
      if (currentPage !== 1) return false;

      // Check status filter
      const statusMatch = selectedStatus === 'all' || 
        selectedStatus === 'active' || 
        selectedStatus === 'pending' ||
        (selectedStatus === 'new' && ['NEW', 'PENDING'].includes(booking.status));

      // Check trip type filter  
      const tripTypeMatch = !tripTypeFilter || booking.trip_type === tripTypeFilter;

      return statusMatch && tripTypeMatch;
    };
  }, [selectedStatus, tripTypeFilter]);

  // Check if a booking passes current filters (for realtime updates)
  const passesFilters = useMemo(() => {
    return (booking: BookingListItem) => {
      // Status filter check
      if (selectedStatus !== 'all' && booking.status !== selectedStatus) {
        return false;
      }

      // Additional statusFilter check
      if (statusFilter.length > 0) {
        if (!statusFilter.includes(booking.status)) {
          return false;
        }
      }

      // Trip type filter check
      if (tripTypeFilter && booking.trip_type !== tripTypeFilter) {
        return false;
      }

      return true;
    };
  }, [selectedStatus, statusFilter, tripTypeFilter]);

  return {
    statusFilterKey,
    shouldInjectBooking,
    passesFilters,
  };
}
