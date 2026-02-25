/**
 * Safety Incidents Management
 * 
 * Safety incidents filtering, updates, and investigation operations
 */

import { createClient } from '@/lib/supabase/client';
import type { SafetyIncident } from '../model/types';

export interface SafetyIncidentsParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity?: 1 | 2 | 3 | 4;
  reportedByType?: 'driver' | 'customer';
}

/**
 * Get safety incidents with filtering
 */
export async function getSafetyIncidents(params: SafetyIncidentsParams = {}) {
  const {
    page = 1,
    limit = 25,
    status,
    severity,
    reportedByType,
  } = params;

  try {
    const supabase = createClient();
    let query = supabase
      .from('safety_incidents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('admin_investigation_status', status);
    }
    if (severity) {
      query = query.eq('severity_level', severity);
    }
    if (reportedByType) {
      query = query.eq('reported_by_type', reportedByType);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Transform to SafetyIncident type
    const incidents: SafetyIncident[] = (data || []).map(row => ({
      id: row.id,
      reportedById: row.reported_by_id,
      reportedByType: row.reported_by_type,
      reportedAgainstId: row.reported_against_id,
      reportedAgainstType: row.reported_against_type,
      bookingId: row.booking_id,
      incidentType: row.incident_type,
      severityLevel: row.severity_level,
      description: row.description,
      evidenceUrls: row.evidence_urls || [],
      adminInvestigationStatus: row.admin_investigation_status,
      adminInvestigatorId: row.admin_investigator_id,
      adminNotes: row.admin_notes,
      investigationStartedAt: row.investigation_started_at,
      investigationCompletedAt: row.investigation_completed_at,
      penaltyApplied: row.penalty_applied,
      penaltyType: row.penalty_type,
      penaltyDetails: row.penalty_details,
      penaltyAppliedAt: row.penalty_applied_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      incidents,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      page,
      limit
    };

  } catch (error) {
    console.error('Error fetching safety incidents:', error);
    throw new Error('Failed to fetch safety incidents');
  }
}

/**
 * Update safety incident status
 */
export async function updateSafetyIncidentStatus(
  incidentId: string, 
  status: SafetyIncident['adminInvestigationStatus'],
  notes?: string
) {
  try {
    const supabase = createClient();
    const updateData: any = {
      admin_investigation_status: status,
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.admin_notes = notes;
    }

    if (status === 'investigating') {
      updateData.investigation_started_at = new Date().toISOString();
    }

    if (status === 'resolved' || status === 'dismissed') {
      updateData.investigation_completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('safety_incidents')
      .update(updateData)
      .eq('id', incidentId)
      .select()
      .single();

    if (error) throw error;

    return data;

  } catch (error) {
    console.error('Error updating incident status:', error);
    throw new Error('Failed to update incident status');
  }
}
