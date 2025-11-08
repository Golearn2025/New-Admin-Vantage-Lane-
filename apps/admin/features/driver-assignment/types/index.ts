/**
 * Driver Assignment Types
 * 
 * TypeScript types for driver-operator assignment feature
 */

export interface DriverAssignment {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_email: string;
  operator_id: string | null;
  operator_name: string | null;
  operator_email: string | null;
  assigned_at: string | null;
  assigned_by: string | null;
  status: 'active' | 'inactive' | 'pending';
  notes: string | null;
}

export interface AssignDriverPayload {
  driver_id: string;
  operator_id: string;
  notes?: string;
}

export type TabId = 'all' | 'assigned' | 'unassigned';

export interface DriverAssignmentCounts {
  all: number;
  assigned: number;
  unassigned: number;
}
