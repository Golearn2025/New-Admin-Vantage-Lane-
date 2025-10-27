/**
 * Send Notification API
 * Send notifications to individual users
 */

import { createClient } from '@/lib/supabase/client';

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
  const { data: driver } = await supabase
    .from('drivers')
    .select('auth_user_id')
    .eq('id', driverId)
    .single();

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
  const { data: operatorUser } = await supabase
    .from('user_organization_roles')
    .select('user_id')
    .eq('organization_id', operatorId)
    .eq('is_active', true)
    .single();

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
  const { data: customer } = await supabase
    .from('customers')
    .select('auth_user_id')
    .eq('id', customerId)
    .single();

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
