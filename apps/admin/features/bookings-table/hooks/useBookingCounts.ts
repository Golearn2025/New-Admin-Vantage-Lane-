/**
 * useBookingCounts Hook
 * 
 * Fetches booking counts for each tab type
 * 
 * Compliant:
 * - React hooks best practices
 * - TypeScript strict
 * - Error handling
 * - Loading states
 */

'use client';

import { useState, useEffect } from 'react';
import type { CountsByTripType } from '../utils/createBookingTabs';

interface UseBookingCountsResult {
  counts: CountsByTripType | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBookingCounts(): UseBookingCountsResult {
  const [counts, setCounts] = useState<CountsByTripType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/bookings/counts');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch counts: ${response.statusText}`);
      }

      const data = await response.json();
      setCounts(data.counts);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('[useBookingCounts] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return {
    counts,
    isLoading,
    error,
    refetch: fetchCounts,
  };
}
