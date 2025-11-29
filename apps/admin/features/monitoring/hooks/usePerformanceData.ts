/**
 * usePerformanceData Hook
 * 
 * Performance data din Sentry
 * Conform RULES.md: <50 linii
 */

import { useState, useEffect } from 'react';
import type { PerformanceMetric, SlowQuery } from '../types';

interface PerformanceData {
  metrics: PerformanceMetric[];
  queries: SlowQuery[];
  cache: Record<string, unknown>;
  loading: boolean;
}

export function usePerformanceData(): PerformanceData {
  const [data, setData] = useState<PerformanceData>({
    metrics: [],
    queries: [],
    cache: {},
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data pentru acum
        setData({
          metrics: [{
            id: '1',
            name: 'averageResponseTime',
            value: 245,
            unit: 'ms',
            timestamp: new Date().toISOString()
          }],
          queries: [{
            id: '1',
            query: 'SELECT * FROM users WHERE ...',
            duration: 1250,
            timestamp: new Date().toISOString()
          }],
          cache: {
            hitRate: 85.2,
            size: '2.1GB',
            totalRequests: 12500
          },
          loading: false
        });

      } catch (error) {
        console.error('Performance monitoring error:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return data;
}
