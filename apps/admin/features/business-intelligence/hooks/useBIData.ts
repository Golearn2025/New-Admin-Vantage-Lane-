/**
 * useBIData Hook — Main data orchestrator
 *
 * Fetches all BI data, calculates health + insights.
 * REGULA 9: Zero fetch in UI — all here.
 * File: < 200 lines
 */

'use client';

import type { BIData } from '@entities/business-intelligence';
import {
    calculateHealthScore,
    fetchBookingSummary,
    fetchCustomersSummary,
    fetchDriversSummary,
    fetchFleetSummary,
    fetchRevenueSummary,
    fetchRoutesSummary,
    generateAllInsights,
    generateLaunchPlan,
} from '@entities/business-intelligence';
import { useCallback, useEffect, useState } from 'react';

interface UseBIDataReturn {
  data: BIData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBIData(): UseBIDataReturn {
  const [data, setData] = useState<BIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const bookings = await fetchBookingSummary();
      const revenue = await fetchRevenueSummary();
      const routes = await fetchRoutesSummary();
      const drivers = await fetchDriversSummary();
      const fleet = await fetchFleetSummary();
      const customers = await fetchCustomersSummary();

      const partial: BIData = {
        bookings,
        revenue,
        routes,
        drivers,
        fleet,
        customers,
        health: { overall: 0, revenueStability: 0, clientDiversification: 0, completionRate: 0, fleetUtilization: 0, driverAvailability: 0 },
        insights: [],
        launchPlan: [],
      };

      partial.health = calculateHealthScore(partial);
      partial.insights = generateAllInsights(partial);
      partial.launchPlan = generateLaunchPlan(partial);

      setData(partial);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load BI data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, isLoading, error, refetch: fetchAll };
}
