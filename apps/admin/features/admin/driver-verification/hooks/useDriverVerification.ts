'use client';
import { useState, useEffect } from 'react';
import { 
  getDriverWithDocuments, 
  approveDocument as approveDocumentApi,
  rejectDocument as rejectDocumentApi,
  activateDriver as activateDriverApi,
  deactivateDriver as deactivateDriverApi
} from '@entities/driver';
import type { VehicleServiceType, DocumentData } from '@entities/driver';
import type { DriverVerificationData, DriverDoc } from '../types';

/**
 * Map DocumentData to DriverDoc for component
 */
function mapDocumentToDriverDoc(doc: DocumentData): DriverDoc {
  return {
    id: doc.id,
    type: doc.documentType as DriverDoc['type'],
    url: doc.fileUrl || '',
    verified: doc.status === 'approved',
    uploadedAt: doc.uploadDate,
  };
}

export function useDriverVerification(driverId: string) {
  const [driver, setDriver] = useState<DriverVerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getDriverWithDocuments(driverId);
        
        // Transform API response to component format
        const driverData: DriverVerificationData = {
          id: data.id,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email,
          phone: data.phone || '',
          profilePhoto: data.profile_photo_url || null,
          documents: (data.documents || []).map(mapDocumentToDriverDoc),
          vehicleCategory: [], // Will be loaded from vehicle_service_types
          status: data.status || 'pending',
          operatorId: null,
          createdAt: data.created_at,
          // Extract vehicle info
          vehicleId: data.vehicle?.id,
          vehicle: data.vehicle ? {
            id: data.vehicle.id,
            make: data.vehicle.make,
            model: data.vehicle.model,
            year: data.vehicle.year,
            licensePlate: data.vehicle.license_plate,
            category: data.vehicle.category,
          } : undefined,
        };
        
        setDriver(driverData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load driver data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriverData();
  }, [driverId]);

  /**
   * Activate driver with selected service types
   */
  const verifyDriver = async (serviceTypes: VehicleServiceType[]) => {
    if (!driver) return;
    
    try {
      setLoading(true);
      
      // Get admin ID from session (TODO: replace with actual session)
      const adminId = 'current-admin-id'; // TODO: Get from auth context
      
      // Get vehicle ID from driver data
      const vehicleId = driver.vehicleId || ''; // TODO: Add to DriverVerificationData
      
      if (!vehicleId) {
        throw new Error('No vehicle found for driver');
      }
      
      // Activate driver and assign service types
      await activateDriverApi(driver.id, vehicleId, serviceTypes, adminId);
      
      // Redirect to pending drivers list
      window.location.href = '/users/drivers/pending';
    } catch (err) {
      alert(`❌ Failed to activate driver: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reject driver application
   */
  const rejectDriver = async (reason: string) => {
    if (!driver) return;
    
    try {
      setLoading(true);
      
      // Deactivate driver with reason
      await deactivateDriverApi(driver.id, reason);
      
      // Redirect to pending drivers list
      window.location.href = '/users/drivers/pending';
    } catch (err) {
      alert(`❌ Failed to reject driver: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approve a single document
   */
  const approveDocument = async (documentId: string) => {
    if (!driver) return;
    
    try {
      const adminId = 'current-admin-id'; // TODO: Get from auth context
      
      await approveDocumentApi(documentId, adminId);
      
      // Update local state
      setDriver(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          documents: prev.documents.map(doc => 
            doc.id === documentId 
              ? { ...doc, verified: true }
              : doc
          )
        };
      });
    } catch (err) {
      alert(`❌ Failed to approve document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  /**
   * Reject a single document with reason
   */
  const rejectDocument = async (documentId: string, reason: string) => {
    if (!driver) return;
    
    try {
      const adminId = 'current-admin-id'; // TODO: Get from auth context
      
      await rejectDocumentApi(documentId, reason, adminId);
      
      // Update local state
      setDriver(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          documents: prev.documents.map(doc => 
            doc.id === documentId 
              ? { ...doc, verified: false }
              : doc
          )
        };
      });
    } catch (err) {
      alert(`❌ Failed to reject document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    driver,
    loading,
    error,
    verifyDriver,
    rejectDriver,
    approveDocument,
    rejectDocument,
  };
}
