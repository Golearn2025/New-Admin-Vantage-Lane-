/**
 * Security Alerts Component
 * 
 * Real-time Sentry security alerts și threats
 * Conform RULES.md: <50 linii, Sentry integration
 */

'use client';

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
    Sentry.startSpan({
      op: "ui.click",
      name: "Security Alert Click"
    }, (span) => {
      span.setAttribute("alert_type", alert.type);
      span.setAttribute("alert_severity", alert.severity);
      
      logger.warn("Security alert reviewed", {
        alertId: alert.id,
        alertType: alert.type,
        severity: alert.severity
      });
    });
  };

  return (
    <Card className={styles.alertsCard}>
      <h3 className={styles.cardTitle}>Security Alerts (Real-time)</h3>
      
      <div className={styles.alertsList}>
        {alerts.length === 0 ? (
          <div className={styles.noAlerts}>
            <Badge color="success">✓ All Clear</Badge>
            <span>No security threats detected</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={styles.alertItem}
              onClick={() => handleAlertClick(alert)}
            >
              <Badge color={alert.severity === 'high' ? 'danger' : 'warning'}>
                {alert.type.toUpperCase()}
              </Badge>
              <span className={styles.alertMessage}>{alert.message}</span>
              <span className={styles.alertTime}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
