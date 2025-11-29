/**
 * Performance Metrics Component
 * 
 * Performance overview folosind MetricsGrid din ui-core
 * Conform RULES.md: <25 linii, reutilizabil
 */

'use client';

import { useMemo } from 'react';
import { Card } from '@vantage-lane/ui-core';
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

  // Memoize performance metrics items to prevent re-creation on every render
  const metricsItems = useMemo(() => 
    metricsData.map((metric, index) => (
      <div key={index} className="flex justify-between">
        <span>{metric.label}:</span>
        <span>{metric.value}</span>
      </div>
    )), 
    [metricsData]
  );

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {metricsItems}
      </div>
    </Card>
  );
}
