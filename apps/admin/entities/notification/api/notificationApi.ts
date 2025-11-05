/**
 * Notification API
 * CRUD operations for notifications
 */

import { createClient } from '@/lib/supabase/client';
import type { NotificationData, CreateNotificationPayload } from '../model/types';

/**
 * Raw notification row from Supabase
 */
interface SupabaseNotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
  target_type?: string;
}

/**
 * List all notifications for current user
 */
export async function listNotifications(userId: string): Promise<NotificationData[]> {
  const supabase = createClient();
  
  console.log('📡 listNotifications - userId:', userId);
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  console.log('📡 listNotifications - data:', data, 'error:', error);

  if (error) {
    console.error('List notifications error:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  const mapped = (data || []).map((n) => ({
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    read: n.read_at !== null,
    createdAt: n.created_at,
  }));
  
  console.log('📡 listNotifications - mapped:', mapped.length, 'notifications');
  
  return mapped;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Get unread count error:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('Mark as read error:', error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Mark all as read error:', error);
    throw new Error(`Failed to mark all as read: ${error.message}`);
  }
}

/**
 * Create notification (for testing/admin)
 */
export async function createNotification(
  payload: CreateNotificationPayload
): Promise<{ success: boolean; id: string }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      link: payload.link || null,
      read: false,
      created_at: new Date().toISOString(),
    }])
    .select('id')
    .single();

  if (error) {
    console.error('Create notification error:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  return {
    success: true,
    id: data.id,
  };
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Delete notification error:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}

/**
 * List sent notifications history
 * Uses API endpoint to bypass RLS
 */
export async function listSentNotifications(limit = 100): Promise<NotificationData[]> {
  try {
    const response = await fetch('/api/notifications/history');
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const { data } = await response.json();

    return (data || []).map((n: SupabaseNotificationRow) => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      read: n.read_at !== null,
      createdAt: n.created_at,
      targetType: n.target_type,
    }));
  } catch (error) {
    console.error('List sent notifications error:', error);
    throw new Error('Failed to fetch sent notifications');
  }
}
