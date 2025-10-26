/**
 * useDriversPending Hook
 * 
 * Fetch pending drivers for verification
 */

'use client';

import { useState, useEffect } from 'react';
import type { PendingDriver } from '../types';

// Mock data for now - will connect to real API
const mockPendingDrivers: PendingDriver[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+44 7700 900001',
    verificationStatus: 'docs_uploaded',
    documentsCount: 6,
    requiredDocumentsCount: 6,
    profilePhotoUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    uploadedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+44 7700 900002',
    verificationStatus: 'pending',
    documentsCount: 3,
    requiredDocumentsCount: 6,
    profilePhotoUrl: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    uploadedAt: null,
  },
];

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
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // TODO: Replace with real API call
      // const data = await listPendingDrivers();
      setDrivers(mockPendingDrivers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pending drivers'));
      console.error('Fetch pending drivers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    refetch: fetchDrivers,
  };
}
