/**
 * useDriversPending Hook
 * 
 * Fetch pending drivers for verification
 */

'use client';

import { useState, useEffect } from 'react';
import { listPendingDrivers } from '@entities/driver';
import { createClient } from '@/lib/supabase/client';
import type { PendingDriver } from '../types';

export interface UseDriversPendingReturn {
  drivers: PendingDriver[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDriversPending(): UseDriversPendingReturn {
  const [drivers, setDrivers] = useState<PendingDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from database
      const data = await listPendingDrivers();
      
      console.log('[HOOK DEBUG] Raw data from listPendingDrivers:', data);
      console.log('[HOOK DEBUG] First driver vehicle docs:', data[0]?.vehicleDocsApproved, '/', data[0]?.vehicleDocsRequired);
      
      // Map API data to PendingDriver type
      const mappedDrivers: PendingDriver[] = data.map(driver => ({
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        phone: driver.phone,
        profilePhotoUrl: driver.profilePhotoUrl,
        // New separate counts
        driverDocsApproved: driver.driverDocsApproved,
        driverDocsRequired: driver.driverDocsRequired,
        vehicleDocsApproved: driver.vehicleDocsApproved,
        vehicleDocsRequired: driver.vehicleDocsRequired,
        // Legacy fields
        documentsCount: driver.documentsCount,
        requiredDocumentsCount: driver.requiredDocumentsCount,
        verificationStatus: driver.documentsCount === driver.requiredDocumentsCount && driver.approvedDocumentsCount === driver.requiredDocumentsCount
          ? 'docs_uploaded'
          : driver.documentsCount > 0
            ? 'pending'
            : 'not_uploaded',
        createdAt: driver.createdAt,
        uploadedAt: driver.uploadedAt,
      }));
      
      setDrivers(mappedDrivers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pending drivers'));
      console.error('Fetch pending drivers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(() => {
      fetchDrivers();
    }, 30000);
    
    // REAL-TIME: Listen for document changes
    const supabase = createClient();
    const channel = supabase
      .channel('driver-documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_documents',
        },
        () => {
          // Refresh counts when any document is added/updated/deleted
          fetchDrivers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_documents',
        },
        () => {
          // Refresh counts when vehicle documents change
          fetchDrivers();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    drivers,
    loading,
    error,
    refetch: fetchDrivers,
  };
}
