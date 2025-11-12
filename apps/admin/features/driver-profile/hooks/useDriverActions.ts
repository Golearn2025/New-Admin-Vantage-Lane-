/**
 * useDriverActions Hook
 * 
 * Actions for driver management: activate, approve, document review
 */

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendNotificationToDriver } from '@entities/notification';

interface UseDriverActionsResult {
  isLoading: boolean;
  error: string | null;
  activateDriver: (driverId: string) => Promise<void>;
  deactivateDriver: (driverId: string) => Promise<void>;
  approveDriver: (driverId: string, adminUserId: string) => Promise<void>;
  approveDocument: (documentId: string, adminUserId: string) => Promise<void>;
  rejectDocument: (documentId: string, reason: string, adminUserId: string) => Promise<void>;
}

/**
 * Hook for driver management actions
 */
export function useDriverActions(): UseDriverActionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activateDriver = async (driverId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('drivers')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', driverId);

      if (updateError) throw updateError;

      // Send notification to driver
      try {
        await sendNotificationToDriver(
          driverId,
          '✅ Account Activated',
          'Your account has been activated! You are now online and can receive bookings.'
        );
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
        // Don't throw - activation succeeded
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateDriver = async (driverId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('drivers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', driverId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveDriver = async (driverId: string, adminUserId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('drivers')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: adminUserId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', driverId);

      if (updateError) throw updateError;

      // Send notification to driver
      try {
        await sendNotificationToDriver(
          driverId,
          '🎉 Account Approved!',
          'Congratulations! Your driver account has been approved. You can now receive and accept bookings.'
        );
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
        // Don't throw - approval succeeded
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve driver');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveDocument = async (documentId: string, adminUserId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('driver_documents')
        .update({
          status: 'approved',
          reviewed_by: adminUserId,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectDocument = async (
    documentId: string,
    reason: string,
    adminUserId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('driver_documents')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: adminUserId,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    activateDriver,
    deactivateDriver,
    approveDriver,
    approveDocument,
    rejectDocument,
  };
}
