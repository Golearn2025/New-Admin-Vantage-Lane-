/**
 * useBookingsApi Hook
 * 
 * Data fetching and API calls for bookings - focused on data layer
 */

'use client';

import { useCallback } from 'react';
import type { BookingListItem, BookingsListResponse } from '@vantage-lane/contracts';
import { logger } from '@/lib/utils/logger';
import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';

interface UseBookingsApiParams {
  currentPage: number;
  pageSize: number;
  selectedStatus: string;
  statusFilter: string[];
  tripTypeFilter: string | null;
}

export function useBookingsApi({
  currentPage,
  pageSize,
  selectedStatus,
  statusFilter,
  tripTypeFilter,
}: UseBookingsApiParams) {
  
  const fetchBookings = useCallback(async (): Promise<{
    bookings: BookingListItem[];
    totalCount: number;
  }> => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });

      // Add status filter
      if (selectedStatus && selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      // Add trip type filter
      if (tripTypeFilter) {
        params.append('trip_type', tripTypeFilter);
      }

      logger.info('📡 Fetching bookings with params:', {
        page: currentPage,
        pageSize,
        selectedStatus,
        statusFilter,
        tripTypeFilter,
      });

      // Use authenticated fetch wrapper
      const data: BookingsListResponse = await fetchAuthedJson(`/api/bookings/list?${params}`);

      let filteredData = data.data;
      
      // Client-side filtering if needed
      if (statusFilter.length > 0 && selectedStatus === 'all') {
        filteredData = data.data.filter((booking) => {
          return statusFilter.includes(booking.status);
        });
      }

      logger.info('✅ Bookings fetched successfully', {
        count: filteredData.length,
        totalCount: data.pagination.total_count,
      });

      return {
        bookings: filteredData,
        totalCount: data.pagination.total_count,
      };

    } catch (error) {
      logger.error('❌ Error fetching bookings:', error);
      throw error;
    }
  }, [currentPage, pageSize, selectedStatus, statusFilter, tripTypeFilter]);

  const fetchSingleBooking = useCallback(async (bookingId: string): Promise<BookingListItem> => {
    try {
      // Use authenticated fetch wrapper
      const booking: BookingListItem = await fetchAuthedJson(`/api/bookings/${bookingId}`);
      
      logger.info('✅ Single booking fetched successfully', {
        id: bookingId,
        status: booking.status,
      });

      return booking;

    } catch (error) {
      logger.error('❌ Error fetching single booking:', error);
      throw error;
    }
  }, []);

  return {
    fetchBookings,
    fetchSingleBooking,
  };
}
