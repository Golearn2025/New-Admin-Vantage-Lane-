'use client';

import { useState, useEffect } from 'react';
import { fetchAuthedJson } from '../../../../shared/utils/fetchAuthedJson';

interface OperatorStats {
  totalDrivers: number;
  activeDrivers: number;
  pendingDrivers: number;
  totalBookings: number;
  organizationId?: string;
  organizationName?: string;
}

interface RecentDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export function useOperatorDashboard() {
  const [stats, setStats] = useState<OperatorStats>({
    totalDrivers: 0,
    activeDrivers: 0,
    pendingDrivers: 0,
    totalBookings: 0,
  });
  const [recentDrivers, setRecentDrivers] = useState<RecentDriver[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch operator stats with auth
        const statsData = await fetchAuthedJson<OperatorStats>('/api/operator/stats');
        setStats(statsData);

        // Fetch recent drivers with auth
        const driversData = await fetchAuthedJson<RecentDriver[]>('/api/operator/recent-drivers');
        setRecentDrivers(driversData);

        // Fetch recent notifications with auth
        const notificationsData = await fetchAuthedJson<Notification[]>('/api/operator/notifications');
        setNotifications(notificationsData);

      } catch (err) {
        console.error('Error fetching operator dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    stats,
    recentDrivers,
    notifications,
    loading,
    error,
  };
}
