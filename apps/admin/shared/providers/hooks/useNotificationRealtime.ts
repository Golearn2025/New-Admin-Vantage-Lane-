/**
 * Notification Realtime Subscription Hook
 * Extracted from NotificationsProvider for better separation
 */

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type NotificationData } from '@entities/notification';

// 🛡️ GLOBAL flag to prevent double subscription (survives React Strict Mode remounts)
let globalIsSubscribed = false;
let globalChannel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;

// 🛡️ Track processed notification IDs to prevent duplicates from Realtime
const processedNotificationIds = new Set<string>();

interface UseNotificationRealtimeProps {
  userId: string | null;
  onNotificationReceived: (notification: NotificationData) => void;
  onNotificationUpdated: (notification: NotificationData) => void;
  onNotificationDeleted: (notificationId: string) => void;
}

export function useNotificationRealtime({
  userId,
  onNotificationReceived,
  onNotificationUpdated,
  onNotificationDeleted,
}: UseNotificationRealtimeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/notification.mp3');
        audioRef.current.volume = 0.3;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch {
      // Ignore audio errors
    }
  }, []);

  const setupRealtimeSubscription = useCallback(async () => {
    // 🛡️ CRITICAL: Check AGAIN before async operations
    if (globalIsSubscribed && globalChannel) {
      return;
    }

    if (!userId) {
      return;
    }

    const supabase = createClient();

    // 🛡️ DOUBLE-CHECK: Another guard to avoid race conditions
    if (globalIsSubscribed && globalChannel) {
      return;
    }

    // 🔒 SET IMMEDIATELY to prevent race conditions
    globalIsSubscribed = true;
    
    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationData;
          
          if (processedNotificationIds.has(newNotification.id)) {
            return;
          }
          processedNotificationIds.add(newNotification.id);

          onNotificationReceived(newNotification);
          playNotificationSound();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as NotificationData;
          onNotificationUpdated(updatedNotification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const deletedNotification = payload.old as NotificationData;
          onNotificationDeleted(deletedNotification.id);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Subscription successful
        } else if (status === 'CLOSED') {
          // Reset global state on close
          globalIsSubscribed = false;
          globalChannel = null;
        }
      });

    globalChannel = channel;
  }, [userId, onNotificationReceived, onNotificationUpdated, onNotificationDeleted, playNotificationSound]);

  const cleanup = useCallback(() => {
    if (globalChannel) {
      globalChannel.unsubscribe();
      globalChannel = null;
    }
    globalIsSubscribed = false;
    processedNotificationIds.clear();
  }, []);

  return {
    setupRealtimeSubscription,
    cleanup,
  };
}
