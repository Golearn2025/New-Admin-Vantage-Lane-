/**
 * Performance Metrics Component
 * 
 * Performance overview folosind MetricsGrid din ui-core
 * Conform RULES.md: <25 linii, reutilizabil
 */

'use client';

import { MetricsGrid } from '@vantage-lane/ui-core';
import * as Sentry from "@sentry/nextjs";

interface PerformanceMetricsProps {
  metrics: {
    averageResponseTime: number;
    throughput: number;
    errorRate: number;
    apdex: number;
  } | null;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps): JSX.Element {
  const metricsData = [
    { label: "Avg Response Time", value: `${metrics?.averageResponseTime || 0}ms`, trendLabel: "last 24 hours" },
    { label: "Throughput", value: `${metrics?.throughput || 0}/min`, trendLabel: "requests per minute" },
    { label: "Error Rate", value: `${metrics?.errorRate || 0}%`, trendLabel: "failed requests" },
    { label: "Apdex Score", value: metrics?.apdex?.toFixed(2) || '0.00', trendLabel: "user satisfaction" }
  ];

  return <MetricsGrid metrics={metricsData} />;
}
