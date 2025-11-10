/**
 * List Deleted Users API
 * 
 * Fetches all soft-deleted users (deleted_at IS NOT NULL)
 */

import { createClient } from '@/lib/supabase/client';
import type { UnifiedUser } from '../model/types';

/**
 * List all soft-deleted users from all tables
 * 
 * @returns Promise<UnifiedUser[]> Array of deleted users
 */
export async function listDeletedUsers(): Promise<UnifiedUser[]> {
  const supabase = createClient();
  
  // Fetch deleted customers
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, email, first_name, last_name, phone, status, created_at, deleted_at')
    .not('deleted_at', 'is', null)
    .limit(1000);
  
  if (customersError) throw customersError;
  
  // Fetch deleted drivers
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('id, email, first_name, last_name, phone, is_active, created_at, deleted_at')
    .not('deleted_at', 'is', null)
    .limit(1000);
  
  if (driversError) throw driversError;
  
  // Fetch deleted admins
  const { data: admins, error: adminsError } = await supabase
    .from('admin_users')
    .select('id, email, first_name, last_name, phone, is_active, created_at, deleted_at')
    .not('deleted_at', 'is', null)
    .limit(1000);
  
  if (adminsError) throw adminsError;
  
  // Fetch deleted operators
  const { data: operators, error: operatorsError } = await supabase
    .from('organizations')
    .select('id, name, contact_email, contact_phone, is_active, created_at, deleted_at')
    .eq('org_type', 'operator')
    .not('deleted_at', 'is', null)
    .limit(1000);
  
  if (operatorsError) throw operatorsError;
  
  // Map customers to UnifiedUser
  const customersUnified: UnifiedUser[] = (customers || []).map((c) => ({
    id: c.id,
    userType: 'customer' as const,
    name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'No Name',
    email: c.email,
    phone: c.phone,
    status: 'inactive', // All deleted users are inactive
    createdAt: c.created_at,
    deletedAt: c.deleted_at,
  }));
  
  // Map drivers to UnifiedUser
  const driversUnified: UnifiedUser[] = (drivers || []).map((d) => ({
    id: d.id,
    userType: 'driver' as const,
    name: `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'No Name',
    email: d.email || 'no-email@example.com',
    phone: d.phone,
    status: 'inactive',
    createdAt: d.created_at,
    deletedAt: d.deleted_at,
  }));
  
  // Map admins to UnifiedUser
  const adminsUnified: UnifiedUser[] = (admins || []).map((a) => ({
    id: a.id,
    userType: 'admin' as const,
    name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'No Name',
    email: a.email,
    phone: a.phone,
    status: 'inactive',
    createdAt: a.created_at,
    deletedAt: a.deleted_at,
  }));
  
  // Map operators to UnifiedUser
  const operatorsUnified: UnifiedUser[] = (operators || []).map((o) => ({
    id: o.id,
    userType: 'operator' as const,
    name: o.name || 'Unnamed Operator',
    email: o.contact_email || 'no-email@example.com',
    phone: o.contact_phone,
    status: 'inactive',
    createdAt: o.created_at,
    deletedAt: o.deleted_at,
  }));
  
  // Combine all users
  const allDeletedUsers = [
    ...customersUnified,
    ...driversUnified,
    ...adminsUnified,
    ...operatorsUnified,
  ];
  
  // Sort by deleted_at descending (most recently deleted first)
  allDeletedUsers.sort((a, b) => {
    if (!a.deletedAt || !b.deletedAt) return 0;
    return new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime();
  });
  
  return allDeletedUsers;
}
