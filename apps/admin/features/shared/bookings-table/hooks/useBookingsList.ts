'use client';

/** useBookingsList Hook - Compliant with Realtime */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { BookingListItem, BookingsListResponse } from '@vantage-lane/contracts';
import { logger } from '@/lib/utils/logger';
import { createClient } from '@/lib/supabase/client';
import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';

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
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  // Convert statusFilter to string for stable dependency (memoized)
  // IMPORTANT: Create new array to avoid mutating prop!
  const statusFilterKey = useMemo(
    () => [...statusFilter].sort().join(','),
    [statusFilter]
  );

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });

      console.log('🔍 API CALL DEBUG:', {
        page: currentPage,
        pageSize: pageSize,
        statusFilter,
        selectedStatus
      });

      // If user selected specific dropdown status, use it
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      // Otherwise, if page has statusFilter prop (e.g., Past page), send multiple statuses
      else if (statusFilter.length > 0) {
        // For multiple statuses, send first one to API (we'll filter client-side)
        // This is a limitation - API only supports single status
        statusFilter.forEach(status => params.append('status_filter', status));
      }

      // Use authenticated fetch wrapper
      const data: BookingsListResponse = await fetchAuthedJson(`/api/bookings/list?${params}`);

      let filteredData = data.data;
      
      // API now handles filtering, just use the data
      filteredData = data.data;
      
      console.log('🔍 API RETURNED:', {
        statusFilter,
        selectedStatus,
        dataCount: data.data.length,
        firstBooking: data.data[0]?.reference,
        firstStatus: data.data[0]?.status
      });
      
      // Trip type filter (independent of status)
      if (tripTypeFilter && tripTypeFilter !== 'all') {
        filteredData = filteredData.filter((b) => b.trip_type === tripTypeFilter);
      }

      setBookings(filteredData);
      setTotalCount(statusFilter.length > 0 ? filteredData.length : data.pagination.total_count);
    } catch (err) {
      logger.error('Failed to fetch bookings in useBookingsList', {
        error: err instanceof Error ? err.message : String(err),
      });
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, selectedStatus, statusFilterKey, tripTypeFilter]);

  // Fetch single booking with complete data (for realtime)
  const fetchSingleBooking = useCallback(async (bookingId: string) => {
    try {
      // Use authenticated fetch wrapper
      const booking: BookingListItem = await fetchAuthedJson(`/api/bookings/${bookingId}`);

      // Check if booking passes current filters
      if (selectedStatus !== 'all' && booking.status !== selectedStatus) {
        logger.info('New booking filtered out by status', { bookingId, status: booking.status });
        return;
      }

      if (statusFilter.length > 0 && !statusFilter.includes(booking.status)) {
        logger.info('New booking filtered out by statusFilter', { bookingId });
        return;
      }

      if (tripTypeFilter && tripTypeFilter !== 'all' && booking.trip_type !== tripTypeFilter) {
        logger.info('New booking filtered out by tripType', { bookingId });
        return;
      }

      // Add booking to list (only if on page 1)
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
        setTotalCount((prev) => prev + 1);
        logger.info('✅ New booking added to list', { reference: booking.reference });

        // Remove isNew flag after 60 seconds (1 minute)
        setTimeout(() => {
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? { ...b, isNew: false } : b))
          );
        }, 60000);
      } else {
        // On other pages, just increment count
        setTotalCount((prev) => prev + 1);
        logger.info('New booking created but not on page 1', { reference: booking.reference });
      }
    } catch (err) {
      logger.error('Error fetching single booking', {
        error: err instanceof Error ? err.message : String(err),
        bookingId,
      });
    }
  }, [selectedStatus, statusFilter, tripTypeFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Realtime subscription for new bookings (INSERT only)
  useEffect(() => {
    const supabase = createClient();

    const setupRealtime = () => {
      logger.info('🔄 Setting up Bookings Realtime subscription');

      channelRef.current = supabase
        .channel(`bookings-list-realtime:${Date.now()}`, {
          config: {
            broadcast: { self: false },
            presence: { key: 'bookings-list' },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            logger.info('🆕 NEW BOOKING (Realtime):', payload.new);
            logger.info('📡 Fetching only this booking (not entire list)...');

            // Fetch ONLY the new booking with all JOINs
            fetchSingleBooking((payload.new as any).id);
          }
        )
        .subscribe((status, err) => {
          if (err) {
            logger.error('❌ Bookings Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            logger.info('✅ Bookings Realtime connected!');
          }
        });
    };

    setupRealtime();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        logger.info('🔌 Cleaning up Bookings Realtime subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [fetchSingleBooking]); // Dependency on fetchSingleBooking

  return { bookings, loading, error, totalCount, fetchBookings };
}
