/**
 * useNotificationCenter Hook
 *
 * Business logic for notification center
 */

'use client';

import {
    deleteNotification as apiDeleteNotification,
    markAllAsRead as apiMarkAllAsRead,
    markAsRead as apiMarkAsRead,
    getUnreadCount,
    listNotifications,
} from '@entities/notification';
import type { NotificationData } from '@entities/notification/model/types';
import { useEffect, useState } from 'react';

export interface UseNotificationCenterReturn {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// TODO: Get from auth context
const CURRENT_USER_ID = 'b99e1183-fd54-4c62-99b1-b3283de298c0'; // Real admin user ID

export function useNotificationCenter(): UseNotificationCenterReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const [notifs, count] = await Promise.all([
        listNotifications(CURRENT_USER_ID),
        getUnreadCount(CURRENT_USER_ID),
      ]);

      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // ⚠️ POLLING DISABLED - Use NotificationsProvider realtime subscription instead
    // Polling was causing 502 errors on Render due to excessive API calls
    // const interval = setInterval(fetchNotifications, 30000);
    // return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiMarkAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiMarkAllAsRead(CURRENT_USER_ID);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      await fetchNotifications(); // Refetch to update count
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}
