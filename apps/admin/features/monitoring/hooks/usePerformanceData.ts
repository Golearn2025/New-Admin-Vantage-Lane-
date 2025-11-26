/**
 * usePerformanceData Hook
 * 
 * Performance data din Sentry
 * Conform RULES.md: <50 linii
 */

import { useState, useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";

interface PerformanceData {
  metrics: any;
  queries: any[];
  cache: any;
  loading: boolean;
}

export function usePerformanceData(): PerformanceData {
  const [data, setData] = useState<PerformanceData>({
    metrics: null,
    queries: [],
    cache: null,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data pentru acum
        setData({
          metrics: {
            averageResponseTime: 245,
            throughput: 850,
            errorRate: 0.2,
            apdex: 0.94
          },
          queries: [
            {
              query: 'SELECT * FROM bookings WHERE...',
              duration: 1250,
              timestamp: new Date().toISOString()
            }
          ],
          cache: {
            hitRate: 94,
            missRate: 6,
            totalRequests: 12500
          },
          loading: false
        });

        Sentry.logger.info("Performance data loaded");
      } catch (error) {
        Sentry.captureException(error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return data;
}
