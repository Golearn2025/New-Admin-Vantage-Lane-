/**
 * useDriverAssignment Hook
 * 
 * Hook for managing driver-operator assignments
 * Handles Supabase queries and mutations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DriverAssignment, DriverAssignmentCounts, TabId } from '../types';

interface OperatorData {
  id: string;
  name: string;
  code?: string;
  contact_email?: string;
  organization_id?: string;
}

interface DriverData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  organization_id: string | null;
  created_at: string;
  is_active: boolean;
}

export function useDriverAssignment(activeTab: TabId = 'all') {
  const [drivers, setDrivers] = useState<DriverAssignment[]>([]);
  const [counts, setCounts] = useState<DriverAssignmentCounts>({
    all: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch drivers with assignment info
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Query all drivers with their organizations
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('id, first_name, last_name, email, organization_id, created_at, is_active')
        .order('created_at', { ascending: false });

      console.log('🚗 Drivers query:', { driversData, driversError });

      if (driversError) throw driversError;

      // Query all operators
      const { data: operatorsData, error: operatorsError } = await supabase
        .from('organizations')
        .select('id, name, code, contact_email')
        .eq('org_type', 'operator');

      console.log('🏢 Operators query:', { operatorsData, operatorsError });

      // Create operator lookup map
      const operatorMap = new Map(
        (operatorsData || []).map((op: OperatorData) => [op.id, op])
      );

      // Transform data
      const transformedDrivers: DriverAssignment[] = (driversData || []).map((driver: DriverData) => {
        const operator = driver.organization_id ? operatorMap.get(driver.organization_id) : null;
        const driverName = driver.first_name && driver.last_name 
          ? `${driver.first_name} ${driver.last_name}` 
          : driver.email;

        return {
          id: driver.id,
          driver_id: driver.id,
          driver_name: driverName,
          driver_email: driver.email || '',
          operator_id: driver.organization_id || null,
          operator_name: operator?.name || null,
          operator_email: operator?.contact_email || null,
          assigned_at: driver.created_at,
          assigned_by: null,
          status: driver.is_active ? 'active' as const : 'inactive' as const,
          notes: null,
        };
      });

      console.log('✅ Transformed drivers:', transformedDrivers);

      // Filter based on active tab
      let filteredDrivers = transformedDrivers;
      if (activeTab === 'assigned') {
        filteredDrivers = transformedDrivers.filter((d) => d.operator_id !== null);
      } else if (activeTab === 'unassigned') {
        filteredDrivers = transformedDrivers.filter((d) => d.operator_id === null);
      }

      setDrivers(filteredDrivers);

      // Calculate counts
      setCounts({
        all: transformedDrivers.length,
        assigned: transformedDrivers.filter((d) => d.operator_id !== null).length,
        unassigned: transformedDrivers.filter((d) => d.operator_id === null).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, supabase]);

  // Assign driver to operator (update organization_id)
  const assignDriver = useCallback(
    async (driverId: string, operatorId: string, notes: string = '') => {
      try {
        const { error: updateError } = await supabase
          .from('drivers')
          .update({ 
            organization_id: operatorId,
            updated_at: new Date().toISOString()
          })
          .eq('id', driverId);

        if (updateError) throw updateError;

        // Refresh data
        await fetchDrivers();
        return { success: true };
      } catch (err) {
        console.error('Error assigning driver:', err);
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to assign driver',
        };
      }
    },
    [supabase, fetchDrivers]
  );

  // Unassign driver from operator (set organization_id to null)
  const unassignDriver = useCallback(
    async (driverId: string) => {
      try {
        const { error: updateError } = await supabase
          .from('drivers')
          .update({ 
            organization_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', driverId);

        if (updateError) throw updateError;

        // Refresh data
        await fetchDrivers();
        return { success: true };
      } catch (err) {
        console.error('Error unassigning driver:', err);
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to unassign driver',
        };
      }
    },
    [supabase, fetchDrivers]
  );

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    counts,
    loading,
    error,
    assignDriver,
    unassignDriver,
    refetch: fetchDrivers,
  };
}
