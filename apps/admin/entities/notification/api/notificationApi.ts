/**
 * Notification API
 * CRUD operations for notifications
 */

import { createClient } from '@/lib/supabase/client';
import type { CreateNotificationPayload, NotificationData } from '../model/types';

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

  // Dynamic limit based on user - admin gets more
  const limit = 100; // Increase for all users to handle larger volumes
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('List notifications error:', error);
    throw new Error(error.message);
  }

  const mapped = (data || []).map((n) => ({
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    read: n.read_at !== null,
    createdAt: new Date(n.created_at).toISOString(), // Convert Postgres timestamp to ISO format
  }));

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
    .insert([
      {
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        link: payload.link || null,
        read: false,
        created_at: new Date().toISOString(),
      },
    ])
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
 * Mark notification as unread
 */
export async function markAsUnread(notificationId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: null })
    .eq('id', notificationId);

  if (error) {
    console.error('Mark as unread error:', error);
    throw new Error(`Failed to mark notification as unread: ${error.message}`);
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  console.log('🔥 API DELETE CALL:', notificationId);
  const supabase = createClient();

  // First check if notification exists and user can see it
  const { data: existing, error: selectError } = await supabase
    .from('notifications')
    .select('id, user_id, created_at')
    .eq('id', notificationId)
    .single();

  if (selectError) {
    console.error('❌ CANNOT FIND NOTIFICATION:', selectError);
    throw new Error(`Cannot find notification: ${selectError.message}`);
  }

  if (!existing) {
    console.error('❌ NOTIFICATION NOT FOUND:', notificationId);
    throw new Error('Notification not found or no permission');
  }

  console.log('✅ NOTIFICATION EXISTS:', existing);

  // Now try to delete
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .select();

  if (error) {
    console.error('❌ API DELETE ERROR:', error);
    console.error('❌ Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw new Error(`Failed to delete notification: ${error.message}`);
  }

  console.log('✅ API DELETE SUCCESS:', data);
  console.log('✅ Deleted rows count:', data?.length || 0);

  if (!data || data.length === 0) {
    console.error('❌ NO ROWS DELETED - RLS POLICY ISSUE?');
    throw new Error('Delete operation succeeded but no rows were affected. Check RLS policies.');
  }
}

/**
 * Force delete notification (bypass RLS if needed)
 * Only use if regular delete fails due to RLS issues
 */
export async function forceDeleteNotification(notificationId: string): Promise<void> {
  console.log('🚨 FORCE DELETE CALL:', notificationId);
  
  try {
    const response = await fetch('/api/notifications/force-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown API error' }));
      throw new Error(`API Error ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ FORCE DELETE via API SUCCESS:', result);

  } catch (apiError) {
    console.error('❌ FORCE DELETE via API FAILED:', apiError);
    throw new Error(`Force delete failed: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
  }
}

/**
 * Admin cleanup - delete old notifications (older than X days)
 */
export async function cleanupOldNotifications(daysOld = 30): Promise<{ deletedCount: number }> {
  console.log(`🧹 ADMIN CLEANUP: Deleting notifications older than ${daysOld} days`);
  const supabase = createClient();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select('id');

  if (error) {
    console.error('❌ CLEANUP ERROR:', error);
    throw new Error(`Cleanup failed: ${error.message}`);
  }

  const deletedCount = data?.length || 0;
  console.log(`✅ CLEANUP SUCCESS: Deleted ${deletedCount} old notifications`);

  return { deletedCount };
}

// Re-export bulk operations from dedicated module
export { bulkDelete, bulkMarkRead, bulkMarkUnread, validateBulkOperation } from './bulkOperations';

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
