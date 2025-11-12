/**
 * Driver Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { 
  DriverData, 
  DriverRow, 
  CreateDriverPayload, 
  UpdateDriverPayload,
  DriverProfileData,
  DocumentData,
  VehicleData,
  VehicleServiceTypeData,
  VehicleServiceType,
  DocumentStatus
} from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapDriverRow(row: DriverRow): DriverData {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

/**
 * List all drivers
 */
export async function listDrivers(): Promise<DriverData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  return (data || []).map(mapDriverRow);
}

/**
 * Get driver by ID
 */
export async function getDriverById(id: string): Promise<DriverData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data ? mapDriverRow(data) : null;
}

/**
 * Create new driver
 */
export async function createDriver(
  payload: CreateDriverPayload
): Promise<DriverData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapDriverRow(data);
}

/**
 * Update driver
 */
export async function updateDriver(
  id: string,
  payload: UpdateDriverPayload
): Promise<DriverData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapDriverRow(data);
}

/**
 * Delete driver
 */
export async function deleteDriver(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get driver bookings (job history) with pricing, locations, and services
 */
export async function getDriverBookings(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      pricing:booking_pricing(*),
      segments:booking_segments(*),
      services:booking_services(*)
    `)
    .eq('assigned_driver_id', driverId)
    .order('start_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return data || [];
}

/**
 * Get driver assigned vehicle
 */
export async function getDriverVehicle(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('driver_id', driverId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  return data;
}

/**
 * Get driver stats (calculated from bookings)
 */
export async function getDriverStats(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('assigned_driver_id', driverId);

  if (error) throw error;

  const bookings = data || [];
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  return {
    totalJobs: bookings.length,
    completedJobs: completedBookings.length,
    pendingJobs: bookings.filter(b => b.status === 'pending').length,
    totalEarnings: 0, // TODO: Calculate from payment data
    rating: 4.8, // TODO: Calculate from ratings
  };
}

/**
 * Get driver with all documents and vehicle
 * For driver verification page
 */
export async function getDriverWithDocuments(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select(`
      *,
      documents:driver_documents(*),
      vehicle:vehicles(*)
    `)
    .eq('id', driverId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get all documents for a driver
 */
export async function getDriverDocuments(driverId: string): Promise<DocumentData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('driver_documents')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(doc => ({
    id: doc.id,
    driverId: doc.driver_id,
    documentType: doc.document_type,
    documentCategory: doc.document_category || 'personal',
    fileUrl: doc.file_url,
    fileName: doc.file_name,
    uploadDate: doc.upload_date,
    expiryDate: doc.expiry_date,
    status: doc.status as DocumentStatus,
    reviewedBy: doc.reviewed_by,
    reviewedAt: doc.reviewed_at,
    rejectionReason: doc.rejection_reason,
    replacesDocumentId: doc.replaces_document_id,
    replacementReason: doc.replacement_reason,
  }));
}

/**
 * Approve a document
 */
export async function approveDocument(
  documentId: string,
  adminId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('driver_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  if (error) throw error;
}

/**
 * Reject a document with reason
 */
export async function rejectDocument(
  documentId: string,
  reason: string,
  adminId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('driver_documents')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  if (error) throw error;
}

/**
 * Assign vehicle service types
 * Priority 2 migration feature
 */
export async function assignVehicleServiceTypes(
  vehicleId: string,
  serviceTypes: VehicleServiceType[],
  adminId: string
): Promise<void> {
  const supabase = createClient();

  // Delete existing service types for this vehicle
  await supabase
    .from('vehicle_service_types')
    .delete()
    .eq('vehicle_id', vehicleId);

  // Insert new service types
  const insertData = serviceTypes.map(type => ({
    vehicle_id: vehicleId,
    service_type: type,
    approved_by: adminId,
    approved_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('vehicle_service_types')
    .insert(insertData);

  if (error) throw error;
}

/**
 * Activate driver after document approval
 * Updates driver status and assigns vehicle service types
 */
export async function activateDriver(
  driverId: string,
  vehicleId: string,
  serviceTypes: VehicleServiceType[],
  adminId: string
): Promise<void> {
  const supabase = createClient();

  // Update driver status to active
  const { error: driverError } = await supabase
    .from('drivers')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      is_approved: true,
      is_active: true,
    })
    .eq('id', driverId);

  if (driverError) throw driverError;

  // Assign vehicle service types
  if (serviceTypes.length > 0) {
    await assignVehicleServiceTypes(vehicleId, serviceTypes, adminId);
  }
}

/**
 * Deactivate driver
 */
export async function deactivateDriver(
  driverId: string,
  reason: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('drivers')
    .update({
      status: 'inactive',
      deactivated_at: new Date().toISOString(),
      deactivation_reason: reason,
      is_active: false,
    })
    .eq('id', driverId);

  if (error) throw error;
}
