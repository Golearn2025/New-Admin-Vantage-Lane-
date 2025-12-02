/**
 * List Pending Drivers API
 * 
 * Fetch drivers pending verification with document counts
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export interface PendingDriverData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
  // Separate document counts for driver and vehicle
  driverDocsApproved: number;
  driverDocsRequired: number;
  vehicleDocsApproved: number;
  vehicleDocsRequired: number;
  // Legacy fields (for backward compatibility)
  documentsCount: number;
  approvedDocumentsCount: number;
  requiredDocumentsCount: number;
  status: string;
  isApproved: boolean;
  createdAt: string;
  uploadedAt: string | null;
}

export async function listPendingDrivers(): Promise<PendingDriverData[]> {
  // Disable caching for real-time data
  noStore();
  
  try {
    const supabase = createClient();

    // Get drivers who are not yet approved
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        profile_photo_url,
        status,
        is_approved,
        created_at
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: false });

    if (driversError) {
      throw new Error(`Failed to fetch pending drivers: ${driversError.message}`);
    }

    if (!drivers || drivers.length === 0) {
      return [];
    }

    // Get document counts for each driver
    const driverIds = drivers.map(d => d.id);
    
    // 1. Fetch driver personal documents
    const { data: documents, error: docsError } = await supabase
      .rpc('admin_list_driver_documents');

    if (docsError) {
      console.error('Failed to fetch driver documents:', docsError);
    }
    
    // 2. Fetch vehicle documents for these drivers using normal client
    // Note: RLS should be configured to allow access to vehicles based on user permissions
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, driver_id')
      .in('driver_id', driverIds);

    console.log('==========================================');
    console.log('[DEBUG] Vehicles fetch with authenticated client:', { 
      error: vehiclesError, 
      count: vehicles?.length,
      driverIds,
      vehicles: vehicles?.map(v => ({ id: v.id, driver_id: v.driver_id }))
    });

    let vehicleDocuments: any[] = [];
    if (!vehiclesError && vehicles && vehicles.length > 0) {
      const vehicleIds = vehicles.map(v => v.id);
      const { data: vDocs, error: vDocsError } = await supabase
        .from('vehicle_documents')
        .select('vehicle_id, document_type, status, upload_date')
        .in('vehicle_id', vehicleIds)
        .neq('status', 'replaced');

      console.log('[DEBUG] Vehicle docs fetch:', { 
        error: vDocsError, 
        count: vDocs?.length,
        vehicleIds,
        docsPreview: vDocs?.slice(0, 3)
      });
      
      if (vDocsError) {
        console.error('[DEBUG ERROR] Vehicle docs fetch failed:', vDocsError);
      }

      if (!vDocsError && vDocs) {
        // Map vehicle docs to include driver_id
        vehicleDocuments = vDocs.map(doc => {
          const vehicle = vehicles.find(v => v.id === doc.vehicle_id);
          return {
            driver_id: vehicle?.driver_id,
            status: doc.status,
            document_type: doc.document_type,
            document_category: 'vehicle',
            upload_date: doc.upload_date,
          };
        });
        console.log('[DEBUG] Mapped vehicle documents count:', vehicleDocuments.length);
        console.log('[DEBUG] First 3 mapped docs:', vehicleDocuments.slice(0, 3));
        console.log('==========================================');
      }
    }
    
    // Type for document from RPC function
    type DocumentFromRPC = {
      driver_id: string;
      status: string;
      document_type: string;
      document_category: string;
      upload_date: string;
    };
    
    // Filter driver documents to only requested drivers
    const filteredDriverDocs = (documents as DocumentFromRPC[] | null)?.filter(
      (d: DocumentFromRPC) => driverIds.includes(d.driver_id)
    ) || [];

    // Combine driver and vehicle documents
    const filteredDocs = [...filteredDriverDocs, ...vehicleDocuments];

    // Required document types (matching actual DB schema)
    // Note: Both bank_statement and proof_of_address are accepted as proof of address
    // Total REQUIRED: 6 documents (not 7, since bank_statement OR proof_of_address = 1)
    const requiredDriverDocs = [
      'profile_photo',
      'driving_licence',
      'electronic_counterpart',
      'pco_licence',
      'proof_of_identity',
      // Either bank_statement OR proof_of_address (both valid)
      'bank_statement',
      'proof_of_address',
    ];
    const requiredDriverDocsCount = 6; // 5 mandatory + 1 from (bank_statement OR proof_of_address)
    
    const requiredVehicleDocs = [
      'phv_licence',
      'mot_certificate',
      'insurance_certificate',
      'v5c_logbook',
      'hire_agreement',
      'vehicle_schedule',
      'driver_schedule',
    ];

    // Map drivers with document counts
    return drivers.map((driver) => {
      // Filter documents for this driver (already excludes 'replaced' in function)
      const allDocs = filteredDocs.filter(
        (d: DocumentFromRPC) => d.driver_id === driver.id
      );
      
      // Separate driver and vehicle documents
      const driverDocs = allDocs.filter((d: DocumentFromRPC) => d.document_category === 'driver');
      const vehicleDocs = allDocs.filter((d: DocumentFromRPC) => d.document_category === 'vehicle');
      
      // Count uploaded documents by category (pending + approved)
      // For pending drivers table, we want to show "X/Y uploaded" not "X/Y approved"
      const driverDocsApproved = driverDocs.filter((d: DocumentFromRPC) => 
        d.status === 'approved' || d.status === 'pending'
      );
      const vehicleDocsApproved = vehicleDocs.filter((d: DocumentFromRPC) => 
        d.status === 'approved' || d.status === 'pending'
      );
      
      // DEBUG: Log counts for troubleshooting
      if (driver.email === 'exec@vantage-lane.com') {
        console.log('[DEBUG] Razvan Sima - RAW documents from DB:', allDocs);
        console.log('[DEBUG] Razvan Sima - Driver docs:', driverDocs);
        console.log('[DEBUG] Razvan Sima - Vehicle docs:', vehicleDocs);
        console.log('[DEBUG] Razvan Sima document counts:', {
          allDocs: allDocs.length,
          driverDocs: driverDocs.length,
          vehicleDocs: vehicleDocs.length,
          driverApproved: driverDocsApproved.length,
          vehicleApproved: vehicleDocsApproved.length,
          requiredDriver: requiredDriverDocs.length,
          requiredVehicle: requiredVehicleDocs.length,
        });
      }
      
      // Get most recent upload date
      let uploadedAt: string | null = null;
      if (allDocs.length > 0) {
        const sortedDocs = allDocs.sort((a: DocumentFromRPC, b: DocumentFromRPC) => {
          const dateA = a.upload_date ? new Date(a.upload_date).getTime() : 0;
          const dateB = b.upload_date ? new Date(b.upload_date).getTime() : 0;
          return dateB - dateA;
        });
        uploadedAt = sortedDocs[0]?.upload_date || null;
      }

      return {
        id: driver.id,
        firstName: driver.first_name,
        lastName: driver.last_name,
        email: driver.email,
        phone: driver.phone,
        profilePhotoUrl: driver.profile_photo_url,
        // Separate counts for driver and vehicle documents
        driverDocsApproved: driverDocsApproved.length,
        driverDocsRequired: requiredDriverDocsCount, // Use count (6) not array length (7)
        vehicleDocsApproved: vehicleDocsApproved.length,
        vehicleDocsRequired: requiredVehicleDocs.length,
        // Legacy fields (for backward compatibility)
        documentsCount: allDocs.length,
        approvedDocumentsCount: driverDocsApproved.length + vehicleDocsApproved.length,
        requiredDocumentsCount: requiredDriverDocsCount + requiredVehicleDocs.length,
        status: driver.status || 'pending_documents',
        isApproved: driver.is_approved,
        createdAt: driver.created_at,
        uploadedAt,
      };
    });
  } catch (error) {
    console.error('Failed to list pending drivers:', error);
    throw error;
  }
}
