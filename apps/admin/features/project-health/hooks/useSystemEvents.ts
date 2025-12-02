/**
 * useSystemEvents Hook
 * 
 * Fetches system events and alerts
 * Conform RULES.md: <200 linii, TypeScript strict
 */

import { useState, useEffect } from 'react';
import { SystemEvent, MonitoringAlert } from '@entities/health';

interface UseSystemEventsReturn {
  events: SystemEvent[];
  alerts: MonitoringAlert[];
  loading: boolean;
}

export function useSystemEvents(): UseSystemEventsReturn {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSystemEvents = (): void => {
      try {
        setLoading(true);

        // Mock events data
        const mockEvents: SystemEvent[] = [
          {
            id: '1',
            type: 'success',
            message: 'System health check passed',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            details: { responseTime: '45ms', status: 'healthy' }
          },
          {
            id: '2',
            type: 'info',
            message: 'Database backup completed successfully',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            details: { backupSize: '2.3GB', duration: '4.2min' }
          },
          {
            id: '3',
            type: 'warning',
            message: 'High response time detected on /api/bookings/list',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            details: { responseTime: '1245ms', threshold: '500ms' }
          },
          {
            id: '4',
            type: 'info',
            message: 'Security scan completed - no issues found',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: { scannedFiles: 1247, vulnerabilities: 0 }
          }
        ];

        // Mock alerts data
        const mockAlerts: MonitoringAlert[] = [
          {
            id: '1',
            severity: 'medium',
            title: 'Database Connection Pool High Usage',
            description: 'Connection pool is at 85% capacity. Consider increasing pool size.',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            resolved: false
          }
        ];

        setEvents(mockEvents);
        setAlerts(mockAlerts);

      } catch (error) {
        console.error('Failed to fetch system events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemEvents();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchSystemEvents, 120000);
    return () => clearInterval(interval);
  }, []);

  return {
    events,
    alerts,
    loading
  };
}
