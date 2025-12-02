/**
 * Notification Array Operations Hook
 * Extracted from NotificationsProvider for better separation
 */

import { useCallback } from 'react';
import { type NotificationData } from '@entities/notification';

export function useNotificationOperations() {
  // Memoized utility functions for notifications array operations
  const updateNotificationById = useCallback((id: string, updates: Partial<NotificationData>) => 
    (prev: NotificationData[]) => 
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n)), 
    []
  );

  const updateNotificationsByIds = useCallback((ids: string[], updates: Partial<NotificationData>) => 
    (prev: NotificationData[]) => 
      prev.map((n) => (ids.includes(n.id) ? { ...n, ...updates } : n)), 
    []
  );

  const markAllNotificationsAsRead = useCallback(() => 
    (prev: NotificationData[]) => 
      prev.map((n) => ({ ...n, read: true })), 
    []
  );

  const replaceNotificationById = useCallback((id: string, updatedNotification: NotificationData) => 
    (prev: NotificationData[]) => 
      prev.map((n) => (n.id === id ? updatedNotification : n)), 
    []
  );

  const removeNotificationById = useCallback((id: string) =>
    (prev: NotificationData[]) =>
      prev.filter((n) => n.id !== id),
    []
  );

  const removeNotificationsByIds = useCallback((ids: string[]) =>
    (prev: NotificationData[]) =>
      prev.filter((n) => !ids.includes(n.id)),
    []
  );

  return {
    updateNotificationById,
    updateNotificationsByIds,
    markAllNotificationsAsRead,
    replaceNotificationById,
    removeNotificationById,
    removeNotificationsByIds,
  };
}
