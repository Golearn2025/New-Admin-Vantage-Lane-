/**
 * Notifications Provider
 * Centralizează Realtime subscription pentru notificări
 * Refactorized: Split into focused hooks for better maintainability
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import {
  getUnreadCount,
  listNotifications,
  type NotificationData,
} from '@entities/notification';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotificationOperations } from './hooks/useNotificationOperations';
import { useNotificationRealtime } from './hooks/useNotificationRealtime';
import { useNotificationActions } from './hooks/useNotificationActions';

interface NotificationsContextValue {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  bulkDelete: (notificationIds: string[]) => Promise<void>;
  bulkMarkRead: (notificationIds: string[]) => Promise<void>;
  bulkMarkUnread: (notificationIds: string[]) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Extract utility operations into hook
  const {
    updateNotificationById,
    updateNotificationsByIds,
    markAllNotificationsAsRead,
    replaceNotificationById,
    removeNotificationById,
    removeNotificationsByIds,
  } = useNotificationOperations();

  // Extract actions into hook
  const actions = useNotificationActions({
    userId,
    updateNotificationById,
    updateNotificationsByIds,
    markAllNotificationsAsRead,
    removeNotificationById,
    removeNotificationsByIds,
    setNotifications,
    setUnreadCount,
  });

  // Extract realtime logic into hook
  const { setupRealtimeSubscription, cleanup } = useNotificationRealtime({
    userId,
    onNotificationReceived: (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    onNotificationUpdated: (notification) => {
      setNotifications(replaceNotificationById(notification.id, notification));
    },
    onNotificationDeleted: (notificationId) => {
      setNotifications(removeNotificationById(notificationId));
    },
  });

  // Initial data fetch
  useEffect(() => {
    let mounted = true;
    
    const fetchInitialData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !mounted) {
          setLoading(false);
          return;
        }

        setUserId(user.id);
        
        const [notifs, count] = await Promise.all([
          listNotifications(user.id),
          getUnreadCount(user.id),
        ]);

        if (mounted) {
          setNotifications(notifs);
          setUnreadCount(count);
        }
      } catch (error) {
        // Handle error silently
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Setup realtime subscription when user is available
  useEffect(() => {
    if (userId) {
      setupRealtimeSubscription();
    }
    
    return () => {
      cleanup();
    };
  }, [userId, setupRealtimeSubscription, cleanup]);

  // Context value
  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    loading,
    ...actions,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationsProvider');
  }
  return context;
}
