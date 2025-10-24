/**
 * User Entity - List All Users API
 * 
 * Fetches all users from DB: customers, drivers, admins, operators
 * Returns unified structure with common fields
 */

import { createClient } from '@/lib/supabase/client';
import type { UnifiedUser } from '../model/types';

/**
 * List all users from all tables (customers, drivers, admins, operators)
 * 
 * @returns Promise<UnifiedUser[]> Array of all users with common fields
 */
export async function listAllUsers(): Promise<UnifiedUser[]> {
  const supabase = createClient();
  
  // Fetch customers
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, email, first_name, last_name, phone, status, created_at')
    .limit(1000);
  
  if (customersError) throw customersError;
  
  // Fetch drivers
  const { data: drivers, error: driversError } = await supabase
    .from('drivers')
    .select('id, email, first_name, last_name, phone, is_active, created_at')
    .limit(1000);
  
  if (driversError) throw driversError;
  
  // Fetch admins
  const { data: admins, error: adminsError } = await supabase
    .from('admin_users')
    .select('id, email, first_name, last_name, phone, is_active, created_at')
    .limit(1000);
  
  if (adminsError) throw adminsError;
  
  // Fetch operators (organizations)
  const { data: operators, error: operatorsError } = await supabase
    .from('organizations')
    .select('id, name, contact_email, contact_phone, is_active, created_at')
    .eq('org_type', 'operator')
    .limit(1000);
  
  if (operatorsError) throw operatorsError;
  
  // Map customers to UnifiedUser
  const customersUnified: UnifiedUser[] = (customers || []).map((c) => ({
    id: c.id,
    userType: 'customer' as const,
    name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'No Name',
    email: c.email,
    phone: c.phone,
    status: c.status === 'active' ? 'active' : 'inactive',
    createdAt: c.created_at,
  }));
  
  // Map drivers to UnifiedUser
  const driversUnified: UnifiedUser[] = (drivers || []).map((d) => ({
    id: d.id,
    userType: 'driver' as const,
    name: `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'No Name',
    email: d.email || 'no-email@example.com',
    phone: d.phone,
    status: d.is_active ? 'active' : 'inactive',
    createdAt: d.created_at,
  }));
  
  // Map admins to UnifiedUser
  const adminsUnified: UnifiedUser[] = (admins || []).map((a) => ({
    id: a.id,
    userType: 'admin' as const,
    name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'No Name',
    email: a.email,
    phone: a.phone,
    status: a.is_active ? 'active' : 'inactive',
    createdAt: a.created_at,
  }));
  
  // Map operators to UnifiedUser
  const operatorsUnified: UnifiedUser[] = (operators || []).map((o) => ({
    id: o.id,
    userType: 'operator' as const,
    name: o.name || 'Unnamed Operator',
    email: o.contact_email || 'no-email@example.com',
    phone: o.contact_phone,
    status: o.is_active ? 'active' : 'inactive',
    createdAt: o.created_at,
  }));
  
  // Combine all users
  const allUsers = [
    ...customersUnified,
    ...driversUnified,
    ...adminsUnified,
    ...operatorsUnified,
  ];
  
  // Sort by created_at descending (newest first)
  allUsers.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return allUsers;
}
