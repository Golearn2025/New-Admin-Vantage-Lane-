/**
 * useNotifications Hook
 * Manage notifications for current user
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { listNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@entities/notification';
import type { NotificationData } from '@entities/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null;

    const fetchNotifications = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('🔔 useNotifications - Auth user:', user?.id);
        
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

      console.log('🔄 Setting up Realtime subscription for user:', user.id);

      // Create unique channel name with timestamp to avoid conflicts
      const channelName = `notifications:${user.id}:${Date.now()}`;
      
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
            console.log('🔔 NEW NOTIFICATION (Realtime):', payload.new);
            
            // Add new notification to the list
            const newNotif = payload.new as NotificationData;
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            
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
            console.log('🔔 NOTIFICATION UPDATED (Realtime):', payload.new);
            
            // Update notification in the list
            const updatedNotif = payload.new as NotificationData;
            setNotifications((prev) =>
              prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
            );
            
            // Update unread count if read status changed
            if (updatedNotif.read && !(payload.old as NotificationData).read) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          }
        )
        .subscribe((status, err) => {
          console.log('🔔 Realtime subscription status:', status);
          if (err) {
            console.error('❌ Realtime subscription error:', err);
          }
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime connected successfully!');
          }
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ CHANNEL_ERROR - Retrying connection...');
            // Auto-retry after 5 seconds
            setTimeout(() => {
              if (channel) {
                channel.unsubscribe();
              }
              setupRealtimeSubscription();
            }, 5000);
          }
        });
    };

    fetchNotifications();
    setupRealtimeSubscription();

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
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

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
}
