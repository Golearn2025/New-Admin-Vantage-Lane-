/**
 * Broadcast Notification API
 * Send notifications to groups of users
 */

import { createClient } from '@/lib/supabase/client';

export interface BroadcastNotificationPayload {
  type: string;
  title: string;
  message: string;
  link?: string | undefined;
}

/**
 * Send notification to all admins
 */
export async function sendNotificationToAllAdmins(
  payload: BroadcastNotificationPayload
): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Get all active admin users
  const { data: admins } = await supabase
    .from('admin_users')
    .select('auth_user_id')
    .eq('is_active', true);

  if (!admins || admins.length === 0) {
    return { success: true, count: 0 };
  }

  // Insert notifications for all admins
  const notifications = admins.map((admin) => ({
    user_id: admin.auth_user_id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    target_type: 'admin',
    is_system: true,
    read_at: null,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    console.error('Broadcast to admins error:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }

  return { success: true, count: admins.length };
}

/**
 * Send notification to all operators
 */
export async function sendNotificationToAllOperators(
  payload: BroadcastNotificationPayload
): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Get all active operators via user_organization_roles
  const { data: operators } = await supabase
    .from('user_organization_roles')
    .select('user_id, organizations!inner(org_type, is_active)')
    .eq('is_active', true)
    .eq('organizations.org_type', 'operator')
    .eq('organizations.is_active', true);

  if (!operators || operators.length === 0) {
    return { success: true, count: 0 };
  }

  const notifications = operators.map((op) => ({
    user_id: op.user_id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    target_type: 'operator',
    is_system: true,
    read_at: null,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    console.error('Broadcast to operators error:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }

  return { success: true, count: operators.length };
}

/**
 * Send notification to all drivers
 */
export async function sendNotificationToAllDrivers(
  payload: BroadcastNotificationPayload
): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Get all active drivers
  const { data: drivers } = await supabase
    .from('drivers')
    .select('auth_user_id')
    .eq('is_active', true)
    .not('auth_user_id', 'is', null);

  if (!drivers || drivers.length === 0) {
    return { success: true, count: 0 };
  }

  const notifications = drivers.map((driver) => ({
    user_id: driver.auth_user_id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    target_type: 'driver',
    is_system: true,
    read_at: null,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    console.error('Broadcast to drivers error:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }

  return { success: true, count: drivers.length };
}

/**
 * Send notification to all customers
 */
export async function sendNotificationToAllCustomers(
  payload: BroadcastNotificationPayload
): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Get all active customers
  const { data: customers } = await supabase
    .from('customers')
    .select('auth_user_id')
    .eq('is_active', true)
    .not('auth_user_id', 'is', null);

  if (!customers || customers.length === 0) {
    return { success: true, count: 0 };
  }

  const notifications = customers.map((customer) => ({
    user_id: customer.auth_user_id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    target_type: 'customer',
    is_system: true,
    read_at: null,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    console.error('Broadcast to customers error:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }

  return { success: true, count: customers.length };
}

/**
 * Send notification to specific operator's drivers
 */
export async function sendNotificationToOperatorDrivers(
  operatorId: string,
  payload: BroadcastNotificationPayload
): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Get all active drivers for this operator
  const { data: drivers } = await supabase
    .from('drivers')
    .select('auth_user_id')
    .eq('organization_id', operatorId)
    .eq('is_active', true)
    .not('auth_user_id', 'is', null);

  if (!drivers || drivers.length === 0) {
    return { success: true, count: 0 };
  }

  const notifications = drivers.map((driver) => ({
    user_id: driver.auth_user_id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link || null,
    target_type: 'driver',
    is_system: true,
    read_at: null,
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('notifications').insert(notifications);

  if (error) {
    console.error('Broadcast to operator drivers error:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }

  return { success: true, count: drivers.length };
}
