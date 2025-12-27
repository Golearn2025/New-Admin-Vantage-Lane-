/**
 * usePerformanceMetrics Hook
 * 
 * Fetches performance data and slow requests
 * Conform RULES.md: TypeScript strict, business logic în entities
 */

import { PerformanceMetrics, SlowRequest } from '@entities/health';
import { useEffect, useState } from 'react';

interface UsePerformanceMetricsReturn {
  metrics: PerformanceMetrics;
  recentRequests: SlowRequest[];
  loading: boolean;
}

export function usePerformanceMetrics(): UsePerformanceMetricsReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalRequests: 0,
    averageResponseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    databaseConnections: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    diskUsage: 0,
    cacheHitRate: 0,
    requestsPerHour: 0,
    responseTimeTrend: 0,
    requestGrowth: 0
  });
  
  const [recentRequests, setRecentRequests] = useState<SlowRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPerformanceData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Mock performance data (în production ar veni din monitoring real)
        const mockMetrics: PerformanceMetrics = {
          totalRequests: 24680,
          averageResponseTime: 187,
          errorRate: 0.3,
          activeUsers: 34,
          databaseConnections: 12,
          memoryUsage: 58,
          cpuUsage: 23,
          diskUsage: 67,
          cacheHitRate: 92,
          requestsPerHour: 1840,
          responseTimeTrend: -23,
          requestGrowth: 15
        };

        // Mock slow requests data
        const mockRequests: SlowRequest[] = [
          {
            id: '1',
            method: 'GET',
            path: '/api/bookings/list',
            responseTime: 1245,
            statusCode: 200,
            timestamp: new Date(Date.now() - 300000).toISOString(),
            userAgent: 'Chrome/91.0'
          },
          {
            id: '2',
            method: 'POST',
            path: '/api/users/create',
            responseTime: 987,
            statusCode: 201,
            timestamp: new Date(Date.now() - 600000).toISOString(),
            userAgent: 'Firefox/89.0'
          },
          {
            id: '3',
            method: 'GET',
            path: '/api/dashboard/stats',
            responseTime: 743,
            statusCode: 200,
            timestamp: new Date(Date.now() - 900000).toISOString()
          }
        ];

        setMetrics(mockMetrics);
        setRecentRequests(mockRequests);

      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();

    // ⚠️ POLLING DISABLED - Use manual refresh or implement Supabase Realtime
    // Auto-refresh was causing 502 errors on Render due to excessive API calls
    // const interval = setInterval(fetchPerformanceData, 60000);
    // return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    recentRequests,
    loading
  };
}
