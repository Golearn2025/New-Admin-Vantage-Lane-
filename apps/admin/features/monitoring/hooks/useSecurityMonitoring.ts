/**
 * useSecurityMonitoring Hook
 * 
 * Real security data din Sentry + Supabase auth logs
 * Conform RULES.md: <50 linii, real database queries
 */

import { useState, useEffect } from 'react';
import * as Sentry from "@sentry/nextjs";

interface SecurityData {
  alerts: any[];
  loginAttempts: any[];
  metrics: {
    totalThreats: number;
    failedLogins: number;
    blockedIPs: number;
    securityScore: number;
  } | null;
  loading: boolean;
}

const { logger } = Sentry;

export function useSecurityMonitoring(): SecurityData {
  const [data, setData] = useState<SecurityData>({
    alerts: [],
    loginAttempts: [],
    metrics: null,
    loading: true
  });

  useEffect(() => {
    const fetchSecurityData = async () => {
      return Sentry.startSpan({
        op: "http.client",
        name: "Fetch Security Monitoring Data"
      }, async (span) => {
        try {
          // Real Supabase query for failed login attempts
          const response = await fetch('/api/monitoring/security', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) throw new Error('Security data fetch failed');
          
          const securityData = await response.json();
          
          setData({
            alerts: securityData.alerts || [],
            loginAttempts: securityData.loginAttempts || [],
            metrics: securityData.metrics,
            loading: false
          });

          logger.info("Security monitoring data loaded", {
            alertsCount: securityData.alerts?.length || 0,
            loginAttemptsCount: securityData.loginAttempts?.length || 0
          });

        } catch (error) {
          logger.error("Failed to fetch security data", { error });
          setData(prev => ({ ...prev, loading: false }));
        }
      });
    };

    fetchSecurityData();
  }, []);

  return data;
}
