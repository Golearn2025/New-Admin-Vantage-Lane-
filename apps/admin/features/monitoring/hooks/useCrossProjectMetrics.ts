/**
 * useCrossProjectMetrics Hook
 * 
 * Hook pentru cross-project metrics din Sentry
 * Conform RULES.md: <50 linii, single responsibility
 */

import { useState, useEffect } from 'react';
import { CrossProjectMetrics } from '@entities/sentry';
import * as Sentry from "@sentry/nextjs";

interface UseCrossProjectMetricsReturn {
  metrics: CrossProjectMetrics | null;
  loading: boolean;
  error: string | null;
}

const { logger } = Sentry;

export function useCrossProjectMetrics(): UseCrossProjectMetricsReturn {
  const [metrics, setMetrics] = useState<CrossProjectMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Mock data pentru acum - va fi înlocuit cu real Sentry API
        const mockMetrics: CrossProjectMetrics = {
          adminDashboard: {
            projectId: 'admin',
            projectName: 'Admin Dashboard',
            errorCount: 2,
            transactionCount: 1250,
            sessionCount: 45,
            crashFreeRate: 99.2,
            apdex: 0.95,
            throughput: 52,
            errorRate: 0.16,
            p95: 180,
            period: '24h'
          },
          landingPage: null,
          backendPrices: null,
          driverApp: null,
          clientApp: null,
          totalErrors: 2,
          totalUsers: 45,
          overallHealth: 'healthy'
        };

        setMetrics(mockMetrics);
        logger.info("Cross-project metrics loaded", { totalErrors: 2 });
      } catch (err) {
        setError('Failed to fetch metrics');
        logger.error("Failed to fetch metrics", { error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}
