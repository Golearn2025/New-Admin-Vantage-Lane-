/** useBookingsList Hook - Compliant: <80 lines */

import { useState, useEffect, useCallback } from 'react';
import type { BookingListItem, BookingsListResponse } from '@admin/shared/api/contracts/bookings';
import { logger } from '@/lib/utils/logger';

interface Props {
  statusFilter?: string[];
  selectedStatus?: string;
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

export function useBookingsList({ statusFilter = [], selectedStatus = 'all', currentPage, pageSize }: Props): Return {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });
      
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      const response = await fetch(`/api/bookings/list?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data: BookingsListResponse = await response.json();
      
      let filteredData = data.data;
      if (statusFilter.length > 0) {
        filteredData = data.data.filter((b) => statusFilter.includes(b.status));
      }
      
      setBookings(filteredData);
      setTotalCount(statusFilter.length > 0 ? filteredData.length : data.pagination.total_count);
    } catch (err) {
      logger.error('Failed to fetch bookings in useBookingsList', { error: err instanceof Error ? err.message : String(err) });
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedStatus, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return { bookings, loading, error, totalCount, fetchBookings };
}
