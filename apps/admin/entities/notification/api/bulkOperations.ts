/**
 * Bulk Operations API for Notifications
 * 
 * Handles bulk actions like delete, mark read/unread for multiple notifications
 * Enterprise-level operations with proper error handling and validation
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Bulk delete notifications
 */
export async function bulkDelete(notificationIds: string[]): Promise<void> {
  console.log('🔥 API BULK DELETE CALL:', notificationIds);
  
  if (notificationIds.length === 0) {
    throw new Error('No notification IDs provided for bulk delete');
  }

  if (notificationIds.length > 100) {
    throw new Error('Too many notifications for bulk delete (max 100)');
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .in('id', notificationIds)
    .select(); // Add select to see what was deleted

  if (error) {
    console.error('❌ API BULK DELETE ERROR:', error);
    console.error('❌ Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw new Error(`Failed to delete notifications: ${error.message}`);
  }

  console.log('✅ API BULK DELETE SUCCESS:', data);
  console.log('✅ Deleted rows count:', data?.length || 0);
}

/**
 * Bulk mark notifications as read
 */
export async function bulkMarkRead(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) {
    throw new Error('No notification IDs provided for bulk mark read');
  }

  if (notificationIds.length > 100) {
    throw new Error('Too many notifications for bulk mark read (max 100)');
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .in('id', notificationIds);

  if (error) {
    console.error('Bulk mark read error:', error);
    throw new Error(`Failed to mark notifications as read: ${error.message}`);
  }
}

/**
 * Bulk mark notifications as unread
 */
export async function bulkMarkUnread(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) {
    throw new Error('No notification IDs provided for bulk mark unread');
  }

  if (notificationIds.length > 100) {
    throw new Error('Too many notifications for bulk mark unread (max 100)');
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: null })
    .in('id', notificationIds);

  if (error) {
    console.error('Bulk mark unread error:', error);
    throw new Error(`Failed to mark notifications as unread: ${error.message}`);
  }
}

/**
 * Get bulk operation validation
 */
export function validateBulkOperation(
  notificationIds: string[],
  operation: 'delete' | 'mark_read' | 'mark_unread'
): { valid: boolean; error?: string } {
  if (notificationIds.length === 0) {
    return { valid: false, error: `No notification IDs provided for ${operation}` };
  }

  if (notificationIds.length > 100) {
    return { valid: false, error: `Too many notifications for ${operation} (max 100)` };
  }

  // Check for duplicate IDs
  const uniqueIds = new Set(notificationIds);
  if (uniqueIds.size !== notificationIds.length) {
    return { valid: false, error: 'Duplicate notification IDs found' };
  }

  // Validate UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const invalidIds = notificationIds.filter(id => !uuidRegex.test(id));
  if (invalidIds.length > 0) {
    return { valid: false, error: `Invalid notification IDs: ${invalidIds.join(', ')}` };
  }

  return { valid: true };
}
