/**
 * Notifications Provider
 * Centralizează Realtime subscription pentru notificări
 * UN singur subscribe, distribuit la toate componentele
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type { NotificationData } from '@entities/notification';
import {
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead,
} from '@entities/notification';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface NotificationsContextValue {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// 🛡️ GLOBAL flag to prevent double subscription (survives React Strict Mode remounts)
let globalIsSubscribed = false;
let globalChannel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;
// 🛡️ Track processed notification IDs to prevent duplicates from Realtime
const processedNotificationIds = new Set<string>();

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('🚀 NotificationsProvider - MOUNTING (useEffect START)');
    console.log('   → globalIsSubscribed:', globalIsSubscribed);
    
    // 🛡️ GLOBAL GUARD: Prevent double subscription across ALL mounts
    if (globalIsSubscribed && globalChannel) {
      console.log('⚠️ Already subscribed GLOBALLY, skipping setup');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log('🔔 NotificationsProvider - Auth user:', user?.id);

        if (!user) {
          console.log('❌ No auth user found');
          return;
        }

        setUserId(user.id);

        const [notifs, count] = await Promise.all([
          listNotifications(user.id),
          getUnreadCount(user.id),
        ]);

        console.log('🔔 Notifications fetched:', notifs.length, 'Unread:', count);

        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error('❌ Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = async () => {
      // 🛡️ CRITICAL: Check AGAIN before async operations
      if (globalIsSubscribed) {
        console.log('⚠️ Already subscribed (checked in setupRealtime), ABORT');
        return;
      }
      
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn('⚠️ No user found for Realtime subscription');
        return;
      }
      
      // 🛡️ CRITICAL: Check AGAIN after async getUser
      if (globalIsSubscribed) {
        console.log('⚠️ Already subscribed (after getUser), ABORT');
        return;
      }

      const channelName = `notifications-provider:${user.id}:${Date.now()}`;
      console.log('🔄 NotificationsProvider - Setting up Realtime subscription');
      console.log('   → Channel name:', channelName);
      console.log('   → User ID:', user.id);
      console.log('   → globalIsSubscribed BEFORE subscribe:', globalIsSubscribed);
      
      // Mark as subscribed IMMEDIATELY before creating channel
      globalIsSubscribed = true;

      // Subscribe to INSERT events on notifications table
      globalChannel = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: user.id },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('🔔🔔 NEW NOTIFICATION RECEIVED (Provider):');
            console.log('   → Channel:', channelName);
            console.log('   → Payload:', payload.new);

            // Map DB payload to NotificationData (snake_case → camelCase)
            const raw = payload.new as any;
            const newNotif: NotificationData = {
              id: raw.id,
              userId: raw.user_id,
              type: raw.type,
              title: raw.title,
              message: raw.message,
              link: raw.link,
              read: raw.read_at !== null,
              createdAt: new Date(raw.created_at).toISOString(),
              targetType: raw.target_type,
            };

            // 🛡️ CRITICAL GUARD: Check if we already processed this notification ID
            if (processedNotificationIds.has(newNotif.id)) {
              console.warn('⚠️⚠️ DUPLICATE REALTIME EVENT for notification:', newNotif.id);
              console.warn('   → This is a Supabase Realtime bug (same event sent twice)');
              return; // ❌ IGNORE duplicate event
            }
            
            // Mark this notification ID as processed
            processedNotificationIds.add(newNotif.id);
            console.log('✅ New notification added:', newNotif.id, newNotif.message);
            
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // 🔊 Play sound for booking notifications
            if (newNotif.type === 'booking_created' && audioRef.current) {
              audioRef.current.volume = 0.8;
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((err) => {
                console.warn('⚠️ Sound play blocked:', err);
              });
            }

            // Optional: Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotif.title || 'New Notification', {
                body: newNotif.message,
                icon: '/brand/logo.png',
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('🔔 NOTIFICATION UPDATED (Provider):', payload.new);

            // Map DB payload to NotificationData
            const raw = payload.new as any;
            const oldRaw = payload.old as any;
            const updatedNotif: NotificationData = {
              id: raw.id,
              userId: raw.user_id,
              type: raw.type,
              title: raw.title,
              message: raw.message,
              link: raw.link,
              read: raw.read_at !== null,
              createdAt: new Date(raw.created_at).toISOString(),
              targetType: raw.target_type,
            };

            setNotifications((prev) =>
              prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
            );

            // Update unread count if read status changed
            const wasRead = oldRaw.read_at !== null;
            if (updatedNotif.read && !wasRead) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe((status, err) => {
          console.log('🔔 Provider Realtime status:', status);
          if (err) {
            console.error('❌ Provider Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            console.log('✅ Provider Realtime GLOBALLY connected! Channel:', channelName);
          }
        });
    };

    // Initialize audio element
    audioRef.current = new Audio('/sounds/notification-good-427346.mp3');
    audioRef.current.preload = 'auto';

    fetchNotifications();
    setupRealtimeSubscription();

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      console.log('🔴 NotificationsProvider - UNMOUNTING (cleanup)');
      // ⚠️ DO NOT unsubscribe in React Strict Mode cleanup
      // Only unsubscribe on real unmount (when component is removed from tree)
      console.log('   → Cleanup called, but keeping subscription (Strict Mode)');
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;

    try {
      await markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;

    try {
      await markAllAsRead(userId);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
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
