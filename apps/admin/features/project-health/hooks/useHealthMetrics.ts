/**
 * useHealthMetrics Hook
 * 
 * Fetches real-time health data from /api/health endpoint
 * Conform RULES.md: TypeScript strict, <200 linii
 */

import { useState, useEffect } from 'react';
import { HealthData, PerformanceMetrics } from '@entities/health';

interface UseHealthMetricsReturn {
  health: HealthData | null;
  metrics: PerformanceMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHealthMetrics(): UseHealthMetricsReturn {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real health data
      const healthResponse = await fetch('/api/health');
      if (!healthResponse.ok) {
        throw new Error(`Health API error: ${healthResponse.status}`);
      }
      
      const healthData = await healthResponse.json();
      setHealth(healthData);

      // Mock metrics data (în production ar veni din monitoring real)
      const mockMetrics: PerformanceMetrics = {
        totalRequests: 12450,
        averageResponseTime: 245,
        errorRate: 0.2,
        activeUsers: 23,
        databaseConnections: 8,
        memoryUsage: 67,
        cpuUsage: 34,
        diskUsage: 45,
        cacheHitRate: 89,
        requestsPerHour: 1240,
        responseTimeTrend: -15,
        requestGrowth: 8
      };
      
      setMetrics(mockMetrics);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch health metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHealthData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    health,
    metrics,
    loading,
    error,
    refetch: fetchHealthData
  };
}
