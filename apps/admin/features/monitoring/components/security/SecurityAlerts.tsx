/**
 * Security Alerts Component
 * 
 * Real-time Sentry security alerts și threats
 * Conform RULES.md: <50 linii, Sentry integration
 */

'use client';

import { useMemo } from 'react';
import { Card, Badge } from '@vantage-lane/ui-core';
import * as Sentry from "@sentry/nextjs";
import styles from './SecurityAlerts.module.css';

interface SecurityAlert {
  id: string;
  type: 'auth_failure' | 'rate_limit' | 'sql_injection' | 'xss_attempt';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  ip?: string;
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const { logger } = Sentry;

export function SecurityAlerts({ alerts }: SecurityAlertsProps): JSX.Element {
  const handleAlertClick = (alert: SecurityAlert) => {
    logger.info("Security alert clicked", { alertId: alert.id, type: alert.type });
  };

  // Memoize alert items to prevent re-creation on every render
  const alertItems = useMemo(() => 
    alerts.map((alert) => (
      <div 
        key={alert.id}
        className={styles.alertItem || ""}
        onClick={() => handleAlertClick(alert)}
      >
        <Badge color={alert.severity === 'high' ? 'danger' : 'warning'}>
          {alert.type.toUpperCase()}
        </Badge>
        <span className={styles.alertMessage || ""}>{alert.message}</span>
        <span className={styles.alertTime || ""}>
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>
    )), 
    [alerts]
  );

  return (
    <Card className={styles.alertsCard || ""}>
      <h3 className={styles.cardTitle || ""}>Security Alerts (Live)</h3>
      
      <div className={styles.alertsList || ""}>
        {alerts.length === 0 ? (
          <div className={styles.noAlerts || ""}>
            <Badge color="success">✓ All Clear</Badge>
            <span>No security threats detected</span>
          </div>
        ) : (
          alertItems
        )}
      </div>
    </Card>
  );
}
