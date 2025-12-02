/**
 * useBusinessIntelligence Hook
 *
 * Data fetching and state management for BI dashboard.
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchBusinessIntelligenceData } from '@entities/business-intelligence';
import type { BusinessIntelligenceData } from '@entities/business-intelligence';

interface UseBusinessIntelligenceReturn {
  data: BusinessIntelligenceData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasData: boolean;
}

export function useBusinessIntelligence(): UseBusinessIntelligenceReturn {
  const [data, setData] = useState<BusinessIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchBusinessIntelligenceData();
      setData(result);
    } catch (err) {
      console.error('Error fetching business intelligence data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    hasData: data?.hasData || false,
  };
}
