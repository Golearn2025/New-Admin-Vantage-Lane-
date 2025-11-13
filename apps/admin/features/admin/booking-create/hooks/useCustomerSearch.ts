/**
 * useCustomerSearch Hook
 * Handles customer search and selection
 */

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Customer } from '../types';

export function useCustomerSearch() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memoize supabase client to prevent re-creation
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchCustomers() {
      if (searchQuery.length < 2) {
        setCustomers([]);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, first_name, last_name, email, phone')
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        setCustomers(data || []);
      } catch (err) {
        console.error('Customer search error:', err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, supabase]);

  return {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
  };
}
