/**
 * Notification API - Fleet
 */

import { createClient } from '../../../shared/lib/supabase/client';
import type { NotificationData } from '../model/types';

export async function listNotifications(userId: string): Promise<NotificationData[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('target_type', 'operator')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('List notifications error:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return (data || []).map((n: any) => ({
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    read: n.read_at !== null,
    createdAt: n.created_at,
  }));
}

export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    // @ts-expect-error - Supabase types not generated
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('Mark as read error:', error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('notifications')
    // @ts-expect-error - Supabase types not generated
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);

  if (error) {
    console.error('Mark all as read error:', error);
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
}
