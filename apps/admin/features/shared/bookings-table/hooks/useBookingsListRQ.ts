'use client';

/**
 * React Query Bookings List Hook - STEP 3A Implementation
 * Parallel hook to useBookingsList.ts - same interface, better caching
 * 
 * SAFETY: Feature flag controlled - can switch back to old hook instantly
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingListItem, BookingsListResponse } from '@vantage-lane/contracts';
import { logger } from '@/lib/utils/logger';
import { createClient } from '@/lib/supabase/client';
import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';
import { playBookingNotificationSound } from '@admin-shared/utils/notificationSound';

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
  const queryClient = useQueryClient();
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

      channelRef.current = supabase
        .channel(`bookings-list-rq:${Date.now()}`, {
          config: {
            broadcast: { self: false },
            presence: { key: 'bookings-list-rq' },
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
            logger.info('🆕 NEW BOOKING (React Query Realtime):', payload.new);
            logger.info('📡 INJECT via queryClient.setQueryData (STEP 3A - NO invalidate)');

            const newBookingRaw = payload.new as any;
            
            // Check if we should inject based on current page and filters
            const shouldInject = currentPage === 1 && (
              selectedStatus === 'all' || 
              selectedStatus === 'active' || 
              selectedStatus === 'pending' ||
              (selectedStatus === 'new' && ['NEW', 'PENDING'].includes(newBookingRaw.status))
            );

            if (shouldInject) {
              // STEP 3A.3: Update cache directly with queryClient.setQueryData
              queryClient.setQueryData(queryKey, (oldData: BookingsListResponse | undefined) => {
                if (!oldData) return oldData;

                // Map raw DB row to BookingListItem format (same as useBookingsList)
                const newBookingItem: BookingListItem = {
                  id: newBookingRaw.id,
                  reference: newBookingRaw.reference || 'N/A',
                  status: 'pending' as const,
                  customer_name: 'New Customer', // Will be populated by full data later
                  pickup_location: 'Loading...', // Will be populated by segments
                  destination: 'Loading...', // Will be populated by segments  
                  scheduled_at: newBookingRaw.pickup_time || newBookingRaw.start_at,
                  created_at: newBookingRaw.created_at,
                  trip_type: 'oneway' as const,
                  fare_amount: 0, // Will be populated by pricing
                  currency: newBookingRaw.currency || 'GBP',
                  operator_name: '',
                  driver_name: null,
                  // Minimal required fields
                  is_urgent: false,
                  is_new: true,
                  category: 'EXEC',
                  vehicle_model: null,
                  customer_phone: '',
                  customer_email: null,
                  customer_total_bookings: 0,
                  customer_loyalty_tier: null,
                  customer_status: null,
                  customer_total_spent: 0,
                  distance_miles: null,
                  duration_min: null,
                  hours: null,
                  passenger_count: null,
                  bag_count: null,
                  flight_number: null,
                  notes: null,
                  return_date: null,
                  return_time: null,
                  return_flight_number: null,
                  fleet_executive: null,
                  fleet_s_class: null,
                  fleet_v_class: null,
                  fleet_suv: null,
                  base_price: 0,
                  platform_fee: 0,
                  operator_net: 0,
                  driver_payout: 0,
                  platform_commission_pct: null,
                  driver_commission_pct: null,
                  paid_services: [],
                  free_services: [],
                  payment_method: 'CARD',
                  payment_status: 'pending',
                  driver_id: newBookingRaw.driver_id,
                  driver_phone: null,
                  driver_email: null,
                  driver_rating: null,
                  vehicle_id: newBookingRaw.vehicle_id,
                  vehicle_make: null,
                  vehicle_model_name: null,
                  vehicle_year: null,
                  vehicle_color: null,
                  vehicle_plate: null,
                  assigned_at: null,
                  assigned_by_name: null,
                  operator_rating: null,
                  operator_reviews: null,
                  source: 'web' as const,
                  legs: [],
                };

                // INJECT at top + update total count
                const updatedData: BookingsListResponse = {
                  ...oldData,
                  data: [newBookingItem, ...oldData.data].slice(0, pageSize),
                  pagination: {
                    ...oldData.pagination,
                    total_count: (oldData.pagination?.total_count || 0) + 1,
                  },
                };

                return updatedData;
              });
              
              logger.info('✅ NEW BOOKING injected via React Query cache', {
                id: newBookingRaw.id,
                reference: newBookingRaw.reference,
                query_key: queryKey
              });
              
              // 🔊 SINGLE SOUND SOURCE - consistent with useBookingsList
              playBookingNotificationSound();
            } else {
              logger.info('📊 New booking not injected (wrong page/filter)', {
                current_page: currentPage,
                selected_status: selectedStatus,
                booking_status: newBookingRaw.status
              });
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            logger.error('❌ React Query Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            logger.info('✅ React Query Realtime connected!');
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
  }, [queryKey, currentPage, selectedStatus, pageSize, queryClient]);

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

  return { 
    bookings, 
    loading: isLoading, 
    error, 
    totalCount, 
    fetchBookings 
  };
}
