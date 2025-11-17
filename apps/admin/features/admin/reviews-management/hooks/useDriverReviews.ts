/**
 * useDriverReviews Hook
 * 
 * Data fetching pentru driver reviews cu filtering și pagination.
 * Zero fetch în UI - toate API calls centralizate aici.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDriverReviews, type ReviewsListParams } from '@entities/review/api/reviewApi';
import type { DriverReview } from '@entities/review';

export interface UseDriverReviewsParams extends ReviewsListParams {
  enabled?: boolean;
}

export interface UseDriverReviewsReturn {
  reviews: DriverReview[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => void;
  setFilters: (filters: Partial<ReviewsListParams>) => void;
}

export function useDriverReviews(params: UseDriverReviewsParams = {}): UseDriverReviewsReturn {
  const { enabled = true, ...initialFilters } = params;

  const [reviews, setReviews] = useState<DriverReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFiltersState] = useState<ReviewsListParams>(initialFilters);

  const fetchReviews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getDriverReviews({ ...filters, page });
      
      setReviews(result.reviews);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMessage);
      console.error('Error fetching driver reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, filters, page]);

  // Fetch data when params change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Update filters and reset to page 1
  const setFilters = useCallback((newFilters: Partial<ReviewsListParams>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  // Refetch current data
  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
    setFilters
  };
}
