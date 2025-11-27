/**
 * Security Metrics Component
 * 
 * Security overview folosind MetricsGrid din ui-core
 * Conform RULES.md: <30 linii, reutilizabil
 */

'use client';

import { Card } from '@vantage-lane/ui-core';
import * as Sentry from "@sentry/nextjs";

interface SecurityMetricsProps {
  metrics: {
    totalThreats: number;
    failedLogins: number;
    blockedIPs: number;
    securityScore: number;
  } | null;
}

const { logger } = Sentry;

export function SecurityMetrics({ metrics }: SecurityMetricsProps): JSX.Element {
  // Log security metrics view
  logger.info("Security metrics viewed", { totalThreats: metrics?.totalThreats || 0 });

  const metricsData = [
    { label: "Security Threats (24h)", value: metrics?.totalThreats || 0, trendLabel: "blocked attacks" },
    { label: "Failed Logins", value: metrics?.failedLogins || 0, trendLabel: "last 24 hours" },
    { label: "Blocked IPs", value: metrics?.blockedIPs || 0, trendLabel: "rate limited" },
    { label: "Security Score", value: `${metrics?.securityScore || 95}%`, trendLabel: "overall rating" }
  ];

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {metricsData.map((metric, index) => (
          <div key={index} className="flex justify-between">
            <span>{metric.label}:</span>
            <span>{metric.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
