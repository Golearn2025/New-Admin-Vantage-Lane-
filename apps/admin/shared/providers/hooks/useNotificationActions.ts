/**
 * Notification Actions Hook
 * Extracted from NotificationsProvider for better separation
 */

import { useCallback } from 'react';
import {
  bulkDelete as apiBulkDelete,
  bulkMarkRead as apiBulkMarkRead,
  bulkMarkUnread as apiBulkMarkUnread,
  deleteNotification as apiDeleteNotification,
  markAllAsRead as apiMarkAllAsRead,
  markAsRead as apiMarkAsRead,
  markAsUnread as apiMarkAsUnread,
  type NotificationData,
} from '@entities/notification';

interface UseNotificationActionsProps {
  userId: string | null;
  updateNotificationById: (id: string, updates: Partial<NotificationData>) => (prev: NotificationData[]) => NotificationData[];
  updateNotificationsByIds: (ids: string[], updates: Partial<NotificationData>) => (prev: NotificationData[]) => NotificationData[];
  markAllNotificationsAsRead: () => (prev: NotificationData[]) => NotificationData[];
  removeNotificationById: (id: string) => (prev: NotificationData[]) => NotificationData[];
  removeNotificationsByIds: (ids: string[]) => (prev: NotificationData[]) => NotificationData[];
  setNotifications: (updater: (prev: NotificationData[]) => NotificationData[]) => void;
  setUnreadCount: (updater: (prev: number) => number) => void;
}

export function useNotificationActions({
  userId,
  updateNotificationById,
  updateNotificationsByIds,
  markAllNotificationsAsRead,
  removeNotificationById,
  removeNotificationsByIds,
  setNotifications,
  setUnreadCount,
}: UseNotificationActionsProps) {

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      await apiMarkAsRead(notificationId);
      setNotifications(updateNotificationById(notificationId, { read: true }));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, updateNotificationById, setNotifications, setUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    try {
      await apiMarkAllAsRead(userId);
      setNotifications(markAllNotificationsAsRead());
      setUnreadCount(() => 0);
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, markAllNotificationsAsRead, setNotifications, setUnreadCount]);

  const markAsUnread = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      await apiMarkAsUnread(notificationId);
      setNotifications(updateNotificationById(notificationId, { read: false }));
      setUnreadCount((prev) => prev + 1);
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, updateNotificationById, setNotifications, setUnreadCount]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      await apiDeleteNotification(notificationId);
      setNotifications(removeNotificationById(notificationId));
      // Count will be updated automatically when notification is removed
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, removeNotificationById, setNotifications]);

  const bulkDelete = useCallback(async (notificationIds: string[]) => {
    if (!userId || notificationIds.length === 0) return;
    
    try {
      await apiBulkDelete(notificationIds);
      setNotifications(removeNotificationsByIds(notificationIds));
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, removeNotificationsByIds, setNotifications]);

  const bulkMarkRead = useCallback(async (notificationIds: string[]) => {
    if (!userId || notificationIds.length === 0) return;
    
    try {
      await apiBulkMarkRead(notificationIds);
      setNotifications(updateNotificationsByIds(notificationIds, { read: true }));
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, updateNotificationsByIds, setNotifications, setUnreadCount]);

  const bulkMarkUnread = useCallback(async (notificationIds: string[]) => {
    if (!userId || notificationIds.length === 0) return;
    
    try {
      await apiBulkMarkUnread(notificationIds);
      setNotifications(updateNotificationsByIds(notificationIds, { read: false }));
      setUnreadCount((prev) => prev + notificationIds.length);
    } catch (error) {
      // Handle error silently or with proper error reporting
    }
  }, [userId, updateNotificationsByIds, setNotifications, setUnreadCount]);

  return {
    markAsRead,
    markAllAsRead,
    markAsUnread,
    deleteNotification,
    bulkDelete,
    bulkMarkRead,
    bulkMarkUnread,
  };
}
