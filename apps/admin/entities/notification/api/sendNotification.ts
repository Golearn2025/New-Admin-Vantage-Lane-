/**
 * Send Notification API
 * Send notifications to individual users
 * Uses SERVER client for server actions
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface SendNotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | undefined;
  targetType: 'admin' | 'operator' | 'driver' | 'customer';
}

/**
 * Send notification to a specific user
 */
export async function sendNotification(
  payload: SendNotificationPayload
): Promise<{ success: boolean; id: string }> {
  // Use admin client to bypass RLS for notification inserts
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        link: payload.link || null,
        target_type: payload.targetType,
        is_system: false,
        read_at: null,
        created_at: new Date().toISOString(),
      },
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Send notification error:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }

  return { success: true, id: data.id };
}

/**
 * Send notification to a specific driver
 */
export async function sendNotificationToDriver(
  driverId: string,
  title: string,
  message: string,
  link?: string
): Promise<{ success: boolean }> {
  const supabase = createClient();

  // Get driver's auth_user_id
  const { data: driver, error } = await supabase
    .from('drivers')
    .select('auth_user_id')
    .eq('id', driverId)
    .maybeSingle();

  if (error) {
    console.error('Get driver error:', error);
    throw new Error(`Failed to get driver: ${error.message}`);
  }

  if (!driver?.auth_user_id) {
    throw new Error('Driver not found or has no auth user');
  }

  await sendNotification({
    userId: driver.auth_user_id,
    type: 'admin_message',
    title,
    message,
    link: link || undefined,
    targetType: 'driver',
  });

  return { success: true };
}

/**
 * Send notification to a specific operator
 */
export async function sendNotificationToOperator(
  operatorId: string,
  title: string,
  message: string,
  link?: string
): Promise<{ success: boolean }> {
  const supabase = createClient();

  // Get operator's user via user_organization_roles
  const { data: operatorUser, error } = await supabase
    .from('user_organization_roles')
    .select('user_id')
    .eq('organization_id', operatorId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Get operator user error:', error);
    throw new Error(`Failed to get operator user: ${error.message}`);
  }

  if (!operatorUser?.user_id) {
    throw new Error('Operator user not found');
  }

  await sendNotification({
    userId: operatorUser.user_id,
    type: 'admin_message',
    title,
    message,
    link: link || undefined,
    targetType: 'operator',
  });

  return { success: true };
}

/**
 * Send notification to a specific customer
 */
export async function sendNotificationToCustomer(
  customerId: string,
  title: string,
  message: string,
  link?: string
): Promise<{ success: boolean }> {
  const supabase = createClient();

  // Get customer's auth_user_id
  const { data: customer, error } = await supabase
    .from('customers')
    .select('auth_user_id')
    .eq('id', customerId)
    .maybeSingle();

  if (error) {
    console.error('Get customer error:', error);
    throw new Error(`Failed to get customer: ${error.message}`);
  }

  if (!customer?.auth_user_id) {
    throw new Error('Customer not found or has no auth user');
  }

  await sendNotification({
    userId: customer.auth_user_id,
    type: 'admin_message',
    title,
    message,
    link: link || undefined,
    targetType: 'customer',
  });

  return { success: true };
}
