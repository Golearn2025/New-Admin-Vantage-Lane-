/**
 * Events Tab Component
 * 
 * Displays system events timeline
 * Conform RULES.md: <200 linii, ui-core components only
 */

'use client';

import { Card, Badge, DataTable } from '@vantage-lane/ui-core';
import { useSystemEvents } from '../hooks/useSystemEvents';
import { eventsColumns } from '../columns/eventsColumns';
import styles from './EventsTab.module.css';

export function EventsTab(): JSX.Element {
  const { events, alerts, loading } = useSystemEvents();

  if (loading) {
    return (
      <div className={styles.loading || ""}>
        <div className={styles.spinner || ""}></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className={styles.container || ""}>
      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Card className={styles.alertsCard || ""}>
          <h3 className={styles.cardTitle || ""}>Critical Alerts</h3>
          
          <div className={styles.alertsList || ""}>
            {alerts.map((alert) => (
              <div key={alert.id} className={styles.alertItem || ""}>
                <div className={styles.alertHeader || ""}>
                  <Badge color={
                    alert.severity === 'critical' ? 'danger' :
                    alert.severity === 'high' ? 'warning' :
                    alert.severity === 'medium' ? 'info' : 'neutral'
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className={styles.alertTime || ""}>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className={styles.alertTitle || ""}>{alert.title}</h4>
                <p className={styles.alertDescription || ""}>{alert.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Events */}
      <Card className={styles.eventsCard || ""}>
        <h3 className={styles.cardTitle || ""}>Recent System Events</h3>
        
        <DataTable
          data={[]}
          columns={[]}
          pagination={{ 
            pageIndex: 0,
            pageSize: 20,
            totalCount: 0
          }}
        />
      </Card>

      {/* Quick Events Summary */}
      <div className={styles.summaryGrid || ""}>
        <Card className={styles.summaryCard || ""}>
          <h4 className={styles.summaryTitle || ""}>Last 24 Hours</h4>
          <div className={styles.summaryStats || ""}>
            <div className={styles.summaryItem || ""}>
              <span className={styles.summaryValue || ""}>42</span>
              <span className={styles.summaryLabel || ""}>Info Events</span>
            </div>
            <div className={styles.summaryItem || ""}>
              <span className={styles.summaryValue || ""}>3</span>
              <span className={styles.summaryLabel || ""}>Warnings</span>
            </div>
            <div className={styles.summaryItem || ""}>
              <span className={styles.summaryValue || ""}>0</span>
              <span className={styles.summaryLabel || ""}>Errors</span>
            </div>
          </div>
        </Card>

        <Card className={styles.summaryCard || ""}>
          <h4 className={styles.summaryTitle || ""}>System Status</h4>
          <div className={styles.statusList || ""}>
            <div className={styles.statusItem || ""}>
              <Badge color="success">Database</Badge>
              <span className={styles.statusLabel || ""}>Healthy</span>
            </div>
            <div className={styles.statusItem || ""}>
              <Badge color="success">API</Badge>
              <span className={styles.statusLabel || ""}>Operational</span>
            </div>
            <div className={styles.statusItem || ""}>
              <Badge color="warning">Cache</Badge>
              <span className={styles.statusLabel || ""}>High Load</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
