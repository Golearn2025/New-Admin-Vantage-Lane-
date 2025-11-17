/**
 * User Search Hook - REAL Supabase Integration
 */

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'driver' | 'operator' | 'customer';
}

interface UseUserSearchResult {
  users: User[];
  loading: boolean;
  error: Error | null;
  searchUsers: (query: string, type: 'driver' | 'operator' | 'customer') => Promise<void>;
  clearUsers: () => void;
}

export function useUserSearch(): UseUserSearchResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchUsers = useCallback(async (query: string, userType: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      if (query.length < 2) {
        setUsers([]);
        return;
      }
      
      let searchResults: User[] = [];
      
      // Search based on user type
      if (userType === 'driver') {
        const { data, error } = await supabase
          .from('drivers')
          .select(`
            auth_user_id,
            first_name,
            last_name,
            email,
            phone
          `)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
          .limit(10);
        
        if (error) {
          console.error('Driver search error:', error);
          throw new Error(error.message);
        }
        
        searchResults = (data || []).map(driver => ({
          id: driver.auth_user_id,
          name: `${driver.first_name} ${driver.last_name}` || 'Unknown Driver',
          email: driver.email || '',
          type: 'driver' as const
        }));
        
      } else if (userType === 'operator') {
        // Operator table doesn't exist, return empty for now
        searchResults = [];
        
      } else if (userType === 'customer') {
        const { data, error } = await supabase
          .from('customers')
          .select(`
            auth_user_id,
            first_name,
            last_name,
            email
          `)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(10);
        
        if (error) {
          console.error('Customer search error:', error);
          throw new Error(error.message);
        }
        
        searchResults = (data || []).map(customer => ({
          id: customer.auth_user_id,
          name: `${customer.first_name} ${customer.last_name}` || 'Unknown Customer',
          email: customer.email || '',
          type: 'customer' as const
        }));
      }
      
      setUsers(searchResults);
    } catch (err) {
      console.error('User search error:', err);
      setError(err instanceof Error ? err : new Error('Failed to search users'));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUsers = useCallback(() => {
    setUsers([]);
  }, []);

  return {
    users,
    loading,
    error,
    searchUsers,
    clearUsers
  };
}
