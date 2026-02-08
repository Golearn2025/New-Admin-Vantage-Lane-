/**
 * User Entity - API Interface
 */

import { createClient } from '@/lib/supabase/client';
import type { User, UserRole } from '../model/schema';
import { UserSchema } from '../model/schema';

export async function listUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('drivers').select('id, email, first_name, last_name, status, created_at, updated_at').limit(200);
  if (error) throw error;
  return data.map((item) => UserSchema.parse({
    id: item.id,
    email: item.email || 'no-email@example.com',
    firstName: item.first_name || '',
    lastName: item.last_name || '',
    role: 'driver' as UserRole,
    isActive: item.status === 'active',
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  }));
}

export async function getUser(id: string): Promise<User> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return UserSchema.parse({
    id: data.id,
    email: data.email || 'no-email@example.com',
    firstName: data.first_name || '',
    lastName: data.last_name || '',
    role: 'driver' as UserRole,
    isActive: data.status === 'active',
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  });
}

export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<User> {
  // Note: drivers table doesn't have role field, this is placeholder
  const user = await getUser(id);
  return { ...user, role, updatedAt: new Date().toISOString() };
}
