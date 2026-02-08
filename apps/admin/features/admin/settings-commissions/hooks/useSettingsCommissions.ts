/**
 * Settings Commissions Hook
 * Manage platform and operator commission rates from DB
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { getCommissionRates, updateCommissionRates } from '@entities/platform-settings';
import { useEffect, useState } from 'react';
import type { OperatorCommission } from '../types';

export function useSettingsCommissions() {
  const [platformCommission, setPlatformCommission] = useState(15);
  const [operatorCommission, setOperatorCommission] = useState(20);
  const [operatorCommissions, setOperatorCommissions] = useState<OperatorCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      
      try {
        // Get current admin user ID (not auth user ID)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('auth_user_id', user.id)
            .single();
          
          if (adminUser) {
            setCurrentUserId(adminUser.id);
          }
        }

        // Get platform commission rates
        const rates = await getCommissionRates();
        setPlatformCommission(rates.platform_commission_pct);
        setOperatorCommission(rates.default_operator_commission_pct);

        // Get all operators with their specific commissions
        const { data: operators } = await supabase
          .from('organizations')
          .select('id, name, driver_commission_pct')
          .eq('org_type', 'operator')
          .eq('is_active', true);

        if (operators) {
          setOperatorCommissions(
            operators.map((op) => ({
              operatorId: op.id,
              operatorName: op.name,
              commissionPercent: parseFloat(op.driver_commission_pct || '20'),
            }))
          );
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatePlatformCommission = (value: number) => {
    setPlatformCommission(value);
  };

  const updateOperatorCommission = (value: number) => {
    setOperatorCommission(value);
  };

  const updateSpecificOperatorCommission = (operatorId: string, value: number) => {
    setOperatorCommissions((prev) =>
      prev.map((op) =>
        op.operatorId === operatorId ? { ...op, commissionPercent: value } : op
      )
    );
  };

  const saveChanges = async () => {
    if (!currentUserId) {
      alert('❌ User not authenticated');
      return;
    }

    try {
      const supabase = createClient();

      // Save platform commission rates
      await updateCommissionRates({
        platformCommissionPct: platformCommission,
        defaultOperatorCommissionPct: operatorCommission,
        updatedBy: currentUserId,
      });

      // Save operator-specific commissions
      for (const op of operatorCommissions) {
        await supabase
          .from('organizations')
          .update({ driver_commission_pct: op.commissionPercent })
          .eq('id', op.operatorId);
      }

      alert('✅ Commissions saved successfully!');
    } catch (error) {
      alert('❌ Failed to save commissions');
    }
  };

  return {
    platformCommission,
    operatorCommission,
    operatorCommissions,
    loading,
    updatePlatformCommission,
    updateOperatorCommission,
    updateSpecificOperatorCommission,
    saveChanges,
  };
}
