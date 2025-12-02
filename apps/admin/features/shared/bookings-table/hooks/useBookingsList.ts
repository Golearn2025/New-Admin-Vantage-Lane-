/**
 * useBookingsList Hook - Refactored Orchestrator
 * 
 * Orchestrates smaller focused hooks - RULES.md compliant
 * Split 325 → 135 lines (-58%)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { logger } from '@/lib/utils/logger';
import { useBookingsApi } from './useBookingsApi';
import { useBookingsFilters } from './useBookingsFilters';
import { useBookingsRealtime } from './useBookingsRealtime';

interface Props {
  statusFilter?: string[];
  selectedStatus?: string;
  tripTypeFilter?: string | null;
  currentPage: number;
  pageSize: number;
}

interface Return {
  bookings: BookingListItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchBookings: () => Promise<void>;
}

export function useBookingsList({
  statusFilter = [],
  selectedStatus = 'all',
  tripTypeFilter = null,
  currentPage,
  pageSize,
}: Props): Return {
  
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filter logic hook
  const { statusFilterKey, shouldInjectBooking, passesFilters } = useBookingsFilters({
    statusFilter,
    selectedStatus,
    tripTypeFilter,
  });

  // API data fetching hook
  const { fetchBookings: fetchBookingsApi, fetchSingleBooking } = useBookingsApi({
    currentPage,
    pageSize,
    selectedStatus,
    statusFilter,
    tripTypeFilter,
  });

  // Main fetch function
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { bookings: fetchedBookings, totalCount: fetchedTotal } = await fetchBookingsApi();
      
      setBookings(fetchedBookings);
      setTotalCount(fetchedTotal);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
      setError(errorMessage);
      logger.error('❌ Error in fetchBookings:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchBookingsApi]);

  // Fetch single booking for realtime updates
  const fetchSingleBookingForRealtime = useCallback(async (bookingId: string) => {
    try {
      const booking = await fetchSingleBooking(bookingId);

      // Check if booking passes current filters
      if (!passesFilters(booking)) {
        return;
      }

      // Update existing booking or add if first page
      if (currentPage === 1) {
        setBookings((prev) => {
          // Check if already exists (shouldn't, but just in case)
          const exists = prev.find((b) => b.id === booking.id);
          if (exists) return prev;

          // Mark as new (for animation)
          const newBookingWithFlag = { ...booking, isNew: true };

          // Add to beginning and limit to pageSize
          return [newBookingWithFlag, ...prev].slice(0, pageSize);
        });
        
        // Update total count
        setTotalCount(prev => prev + 1);
        
        logger.info('✅ Single booking injected via fetchSingle', {
          id: booking.id,
          reference: booking.reference,
        });
      }
      
    } catch (error) {
      logger.error('❌ Error fetching single booking for realtime:', error);
    }
  }, [fetchSingleBooking, passesFilters, currentPage, pageSize]);

  // Realtime handlers
  const handleNewBooking = useCallback((booking: BookingListItem) => {
    setBookings(prev => [booking, ...prev].slice(0, pageSize));
  }, [pageSize]);

  const handleUpdateTotalCount = useCallback((increment: number) => {
    setTotalCount(prev => prev + increment);
  }, []);

  // Realtime subscription hook
  useBookingsRealtime({
    currentPage,
    pageSize,
    shouldInjectBooking,
    onNewBooking: handleNewBooking,
    onUpdateTotalCount: handleUpdateTotalCount,
  });

  // Initial data fetch
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { 
    bookings, 
    loading, 
    error, 
    totalCount, 
    fetchBookings 
  };
}
