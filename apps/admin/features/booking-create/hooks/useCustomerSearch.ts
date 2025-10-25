/**
 * useCustomerSearch Hook
 * Handles customer search and selection
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Customer } from '../types';

export function useCustomerSearch() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      if (searchQuery.length < 2) {
        setCustomers([]);
        return;
      }

      setLoading(true);
      const supabase = createClient();

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
  }, [searchQuery]);

  return {
    customers,
    loading,
    searchQuery,
    setSearchQuery,
  };
}
