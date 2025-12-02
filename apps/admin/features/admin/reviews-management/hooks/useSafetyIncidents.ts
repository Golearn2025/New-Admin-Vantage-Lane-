/**
 * useSafetyIncidents Hook
 * 
 * Data fetching pentru safety incidents cu admin actions.
 * Zero fetch în UI - management complet aici.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getSafetyIncidents, 
  updateSafetyIncidentStatus,
  type SafetyIncidentsParams 
} from '@entities/review/api/reviewApi';
import type { SafetyIncident } from '@entities/review';

export interface UseSafetyIncidentsReturn {
  incidents: SafetyIncident[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  updating: boolean;
  refetch: () => void;
  setFilters: (filters: Partial<SafetyIncidentsParams>) => void;
  updateIncidentStatus: (
    incidentId: string, 
    status: SafetyIncident['adminInvestigationStatus'],
    notes?: string
  ) => Promise<void>;
}

export function useSafetyIncidents(params: SafetyIncidentsParams = {}): UseSafetyIncidentsReturn {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFiltersState] = useState<SafetyIncidentsParams>(params);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSafetyIncidents({ ...filters, page });
      
      setIncidents(result.incidents);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch safety incidents';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Fetch data when params change
  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Update filters and reset to page 1
  const setFilters = useCallback((newFilters: Partial<SafetyIncidentsParams>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  // Update incident status
  const updateIncidentStatus = useCallback(async (
    incidentId: string,
    status: SafetyIncident['adminInvestigationStatus'],
    notes?: string
  ) => {
    setUpdating(true);
    setError(null);

    try {
      const updatedIncident = await updateSafetyIncidentStatus(incidentId, status, notes);
      
      // Update local state optimistically
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, ...updatedIncident }
            : incident
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update incident status';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, []);

  // Refetch current data
  const refetch = useCallback(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    loading,
    error,
    total,
    page,
    totalPages,
    updating,
    refetch,
    setFilters,
    updateIncidentStatus
  };
}
