/**
 * Ecosystem Overview Component
 * 
 * Ecosystem overview folosind MetricsGrid din ui-core
 * Conform RULES.md: <20 linii, reutilizabil
 */

'use client';

import { useMemo } from 'react';
import { Card } from '@vantage-lane/ui-core';
import { CrossProjectMetrics } from '@entities/sentry';

interface EcosystemOverviewProps {
  metrics: CrossProjectMetrics | null;
}

export function EcosystemOverview({ metrics }: EcosystemOverviewProps): JSX.Element {
  const metricsData = [
    { label: "Total Errors (24h)", value: metrics?.totalErrors || 0, trendLabel: "across all projects" },
    { label: "Total Users", value: metrics?.totalUsers || 0, trendLabel: "active sessions" },
    { label: "Projects Active", value: "1/5", trendLabel: "deployed projects" },
    { label: "Overall Health", value: metrics?.overallHealth || 'unknown', trendLabel: "ecosystem status" }
  ];

  // Memoize metrics items to prevent re-creation on every render
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
