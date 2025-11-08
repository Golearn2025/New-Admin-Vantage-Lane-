/**
 * useOperators Hook
 * 
 * Hook for fetching operators list
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Operator {
  id: string;
  name: string;
  email: string;
}

export function useOperators() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchOperators() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('organizations')
          .select('id, name, code, contact_email')
          .eq('org_type', 'operator')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (queryError) throw queryError;

        const transformedOperators: Operator[] = (data || []).map((op: any) => ({
          id: op.id,
          name: op.name,
          email: op.contact_email || '',
        }));

        setOperators(transformedOperators);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch operators');
        console.error('Error fetching operators:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOperators();
  }, [supabase]);

  return { operators, loading, error };
}
