'use client';

/**
 * React Query Bookings List Hook - STEP 3A Implementation
 * Parallel hook to useBookingsList.ts - same interface, better caching
 * 
 * SAFETY: Feature flag controlled - can switch back to old hook instantly
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { newBookingFlashStore } from '@admin-shared/stores/newBookingFlashStore';
import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingListItem, BookingsListResponse } from '@vantage-lane/contracts';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

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
  newBookingIds: Set<string>;
  dismissNewBooking: (id: string) => void;
}

// STEP 3A.2: Stable query key factory
const createQueryKey = (params: {
  page: number;
  pageSize: number;
  selectedStatus: string;
  statusFilter: string[];
  tripTypeFilter: string | null;
}) => [
  'bookings',
  'list',
  {
    page: params.page,
    pageSize: params.pageSize,
    status: params.selectedStatus,
    filters: params.statusFilter.sort().join(','), // Stable array order
    tripType: params.tripTypeFilter,
  }
] as const;

export function useBookingsListRQ({
  statusFilter = [],
  selectedStatus = 'all',
  tripTypeFilter = null,
  currentPage,
  pageSize,
}: Props): Return {
  const [error, setError] = useState<string | null>(null);
  const newBookingIds = useSyncExternalStore<Set<string>>(
    newBookingFlashStore.subscribe,
    newBookingFlashStore.getSnapshot,
    newBookingFlashStore.getSnapshot,
  );
  const queryClient = useQueryClient();
  const queryClientRef = useRef(queryClient);
  queryClientRef.current = queryClient;
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  // STEP 3A.2: Stable query key
  const queryKey = useMemo(() => 
    createQueryKey({
      page: currentPage,
      pageSize,
      selectedStatus,
      statusFilter,
      tripTypeFilter,
    }), 
    [currentPage, pageSize, selectedStatus, statusFilter, tripTypeFilter]
  );

  // React Query for bookings data
  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<BookingsListResponse> => {
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      if (tripTypeFilter) {
        params.append('trip_type', tripTypeFilter);
      }

      logger.info('🔄 React Query fetching bookings:', {
        url: `/api/bookings/list?${params}`,
        queryKey
      });

      const response = await fetchAuthedJson<BookingsListResponse>(
        `/api/bookings/list?${params}`
      );

      logger.info('✅ React Query bookings loaded:', {
        count: response.data?.length || 0,
        total: response.pagination?.total_count || 0
      });

      return response;
    },
    staleTime: 30 * 1000, // 30 seconds - reasonable for live data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Extract data with fallbacks
  const bookings = queryData?.data || [];
  const totalCount = queryData?.pagination?.total_count || 0;

  // STEP 3A.3: Realtime integration with queryClient.setQueryData (NO invalidateQueries!)
  useEffect(() => {
    const setupRealtime = () => {
      const supabase = createClient();

      logger.info('🔄 Setting up React Query Realtime subscription');

      // Debounce refetch to avoid multiple rapid invalidations
      let refetchTimer: ReturnType<typeof setTimeout> | null = null;
      const debouncedRefetch = () => {
        if (refetchTimer) clearTimeout(refetchTimer);
        refetchTimer = setTimeout(() => {
          queryClientRef.current.invalidateQueries({ queryKey: ['bookings', 'list'] });
        }, 500);
      };

      channelRef.current = supabase
        .channel('bookings-realtime-v2')
        // NEW booking → refetch (flash + sound handled by NotificationsProvider)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            logger.info('🆕 NEW BOOKING (Realtime):', { id: (payload.new as any).id });
            debouncedRefetch();
          }
        )
        // UPDATED booking → status change, assignment, etc.
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            logger.info('📝 BOOKING UPDATED (Realtime):', {
              id: (payload.new as any).id,
              old_status: (payload.old as any).status,
              new_status: (payload.new as any).status,
            });
            debouncedRefetch();
          }
        )
        // UPDATED booking_legs → driver accepted, status timestamps, etc.
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'booking_legs',
          },
          (payload) => {
            logger.info('🦵 BOOKING LEG UPDATED (Realtime):', {
              id: (payload.new as any).id,
              old_status: (payload.old as any).status,
              new_status: (payload.new as any).status,
              driver_id: (payload.new as any).assigned_driver_id,
            });
            debouncedRefetch();
          }
        )
        // NEW booking_legs → new leg created (e.g. fleet)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'booking_legs',
          },
          (payload) => {
            logger.info('🆕 NEW BOOKING LEG (Realtime):', payload.new);
            debouncedRefetch();
          }
        )
        .subscribe((status, err) => {
          if (err) {
            logger.error('❌ React Query Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            logger.info('✅ React Query Realtime connected (bookings + booking_legs)!');
          }
        });
    };

    setupRealtime();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        logger.info('🔌 Cleaning up React Query Realtime subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual refetch function (same interface as useBookingsList)
  const fetchBookings = async () => {
    try {
      await refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      logger.error('❌ React Query refetch failed:', err);
    }
  };

  const dismissNewBooking = useCallback((id: string) => {
    newBookingFlashStore.dismiss(id);
  }, []);

  return { 
    bookings, 
    loading: isLoading, 
    error, 
    totalCount, 
    fetchBookings,
    newBookingIds,
    dismissNewBooking,
  };
}
