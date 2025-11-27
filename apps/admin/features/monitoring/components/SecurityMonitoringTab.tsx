/**
 * Security Monitoring Tab
 * 
 * Security overview cu real Sentry alerts + DB monitoring
 * Conform RULES.md: <50 linii, split în componente mici
 */

'use client';

import { Card } from '@vantage-lane/ui-core';
import { SecurityAlerts } from './security/SecurityAlerts';
import { FailedLogins } from './security/FailedLogins';
import { SecurityMetrics } from './security/SecurityMetrics';
import { useSecurityMonitoring } from '../hooks/useSecurityMonitoring';
import styles from './SecurityMonitoringTab.module.css';

export function SecurityMonitoringTab(): JSX.Element {
  const { alerts, loginAttempts, metrics, loading } = useSecurityMonitoring();

  if (loading) {
    return <Card className="p-4">Loading security data...</Card>;
  }

  return (
    <div className={styles.container || ""}>
      <SecurityMetrics metrics={metrics} />
      <SecurityAlerts alerts={alerts} />
      <FailedLogins loginAttempts={loginAttempts} />
    </div>
  );
}
