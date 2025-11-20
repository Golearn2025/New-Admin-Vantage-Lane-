'use client';

import { useState, useEffect } from 'react';

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
        // Fetch operator stats
        const statsResponse = await fetch('/api/operator/stats');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch operator stats');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent drivers
        const driversResponse = await fetch('/api/operator/recent-drivers');
        if (!driversResponse.ok) {
          throw new Error('Failed to fetch recent drivers');
        }
        const driversData = await driversResponse.json();
        setRecentDrivers(driversData);

        // Fetch recent notifications
        const notificationsResponse = await fetch('/api/operator/notifications');
        if (!notificationsResponse.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const notificationsData = await notificationsResponse.json();
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
