/**
 * User Entity - API Interface
 * TODO: Implement user API functions
 */

import type { User } from '../model/types';
import { createClient } from '@/lib/supabase/client';

export async function listUsers(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as User[];
}

export async function getUser(id: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data as User;
}
