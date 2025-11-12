/**
 * Notifications Provider
 * Centralizează Realtime subscription pentru notificări
 * UN singur subscribe, distribuit la toate componentele
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { listNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@entities/notification';
import type { NotificationData } from '@entities/notification';

interface NotificationsContextValue {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('🚀 NotificationsProvider - MOUNTING (useEffect START)');
    let channel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;

    const fetchNotifications = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
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
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('⚠️ No user found for Realtime subscription');
        return;
      }

      const channelName = `notifications-provider:${user.id}:${Date.now()}`;
      console.log('🔄 NotificationsProvider - Setting up Realtime subscription');
      console.log('   → Channel name:', channelName);
      console.log('   → User ID:', user.id);
      
      // Subscribe to INSERT events on notifications table
      channel = supabase
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
            console.log('✅ Provider Realtime connected!');
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
      if (channel) {
        console.log('   → Unsubscribing channel');
        channel.unsubscribe();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
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

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationsProvider');
  }
  return context;
}
