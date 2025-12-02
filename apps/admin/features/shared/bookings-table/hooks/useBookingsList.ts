'use client';

/** useBookingsList Hook - Compliant with Realtime */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
            logger.info('📡 INJECT without refetch (STEP 2 - Realtime Standardization)');

            const newBookingRaw = payload.new as any;
            
            // Check if we should inject based on current page and filters
            const shouldInject = currentPage === 1 && (
              selectedStatus === 'all' || 
              selectedStatus === 'active' || 
              selectedStatus === 'pending' ||
              (selectedStatus === 'new' && ['NEW', 'PENDING'].includes(newBookingRaw.status))
            );

            if (shouldInject) {
              // Map raw DB row to BookingListItem format (minimal)
              const newBookingItem: BookingListItem = {
                id: newBookingRaw.id,
                reference: newBookingRaw.reference || 'N/A',
                status: 'pending' as const, // Always show as pending initially
                customer_name: newBookingRaw.customer_name || 'New Customer',
                pickup_location: newBookingRaw.pickup_address || 'Pickup Location TBD',
                destination: newBookingRaw.dropoff_address || 'Destination TBD',
                scheduled_at: newBookingRaw.pickup_time,
                created_at: newBookingRaw.created_at,
                trip_type: 'oneway' as const,
                fare_amount: typeof newBookingRaw.price_total === 'string' ? 
                  parseFloat(newBookingRaw.price_total) * 100 : 
                  (newBookingRaw.price_total || 0) * 100,
                currency: newBookingRaw.currency || 'GBP',
                operator_name: newBookingRaw.organization_name || '',
                driver_name: newBookingRaw.driver_name || null,
                // Minimal required fields
                is_urgent: false,
                is_new: true, // Mark as new for 24h
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
                base_price: typeof newBookingRaw.price_total === 'string' ? 
                  parseFloat(newBookingRaw.price_total) * 100 : 
                  (newBookingRaw.price_total || 0) * 100,
                platform_fee: 0,
                operator_net: typeof newBookingRaw.price_total === 'string' ? 
                  parseFloat(newBookingRaw.price_total) * 100 : 
                  (newBookingRaw.price_total || 0) * 100,
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
                vehicle_model_name: newBookingRaw.vehicle_name,
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

              // INJECT at top of list + update total count
              setBookings(prev => [newBookingItem, ...prev].slice(0, pageSize));
              setTotalCount(prev => prev + 1);
              
              logger.info('✅ NEW BOOKING injected into list without refetch', {
                id: newBookingItem.id,
                reference: newBookingItem.reference,
                total_count_new: totalCount + 1
              });
              
              // 🔊 SINGLE SOUND SOURCE - Play notification sound
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
