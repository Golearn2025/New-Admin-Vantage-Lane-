/**
 * useMyVehicles Hook
 * 
 * Business logic for vehicles management
 * Zero UI logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createVehicle, listVehicles, uploadVehicleDocument, listVehicleDocuments } from '@entities/vehicle';
import type { DriverVehicle } from '@entities/vehicle';
import { useDriverSession } from '@/shared/hooks/useDriverSession';
import type { DocumentType } from '@entities/document';
import type { VehicleFormData } from '../components/AddVehicleModal';

type Vehicle = DriverVehicle & {
  documents: Record<string, {
    id: string;
    fileUrl: string;
    status: string;
    expiryDate?: string;
    uploadDate?: string;
    rejectionReason?: string;
  } | undefined>;
};

interface MyVehiclesState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  addVehicleModalOpen: boolean;
  uploadModalOpen: boolean;
  selectedVehicleId: string | null;
  selectedDocumentType: DocumentType | null;
}

export function useMyVehicles() {
  const { driverId, organizationId, isLoading: sessionLoading } = useDriverSession();
  
  const [state, setState] = useState<MyVehiclesState>({
    vehicles: [],
    isLoading: true,
    error: null,
    addVehicleModalOpen: false,
    uploadModalOpen: false,
    selectedVehicleId: null,
    selectedDocumentType: null,
  });

  const loadVehicles = useCallback(async () => {
    if (!driverId) return;
    
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const vehiclesList = await listVehicles({ driverId });
      
      const vehiclesWithDocs = await Promise.all(
        vehiclesList.map(async (vehicle) => {
          const docs = await listVehicleDocuments({ vehicleId: vehicle.id });
          const docsRecord = docs.reduce((acc, doc) => {
            acc[doc.type] = {
              id: doc.id,
              fileUrl: doc.fileUrl,
              status: doc.status,
              expiryDate: doc.expiryDate,
              uploadDate: doc.uploadDate,
              rejectionReason: doc.rejectionReason,
            };
            return acc;
          }, {} as Record<string, any>);
          
          return {
            ...vehicle,
            documents: docsRecord,
          };
        })
      );
      
      setState((prev) => ({
        ...prev,
        vehicles: vehiclesWithDocs,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load vehicles',
      }));
    }
  }, [driverId]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleAddVehicle = useCallback(() => {
    setState((prev) => ({ ...prev, addVehicleModalOpen: true }));
  }, []);

  const handleCloseAddVehicle = useCallback(() => {
    setState((prev) => ({ ...prev, addVehicleModalOpen: false }));
  }, []);

  const handleAddVehicleSubmit = useCallback(async (vehicleData: VehicleFormData) => {
    console.log('🚗 handleAddVehicleSubmit called');
    console.log('📍 driverId:', driverId);
    console.log('📍 organizationId:', organizationId);
    console.log('📍 vehicleData:', vehicleData);
    
    if (!driverId || !organizationId) {
      console.error('❌ Missing driverId or organizationId!');
      throw new Error('Driver ID or Organization ID is missing');
    }

    try {
      console.log('✅ Calling createVehicle API...');
      const result = await createVehicle({
        driverId,
        organizationId,
        licensePlate: vehicleData.licensePlate,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color,
      });

      console.log('📊 Result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create vehicle');
      }

      console.log('✅ Vehicle created successfully! Reloading...');
      await loadVehicles();
    } catch (error) {
      console.error('❌ Error in handleAddVehicleSubmit:', error);
      throw error;
    }
  }, [driverId, organizationId, loadVehicles]);

  const handleUploadDocument = useCallback((vehicleId: string, documentType: DocumentType) => {
    setState((prev) => ({
      ...prev,
      uploadModalOpen: true,
      selectedVehicleId: vehicleId,
      selectedDocumentType: documentType,
    }));
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      uploadModalOpen: false,
      selectedVehicleId: null,
      selectedDocumentType: null,
    }));
  }, []);

  const handleUploadFile = useCallback(async (file: File, expiryDate?: string) => {
    if (!state.selectedDocumentType || !state.selectedVehicleId) return;

    try {
      // Convert file to number[] for server action (Next.js compatible)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const fileData = Array.from(uint8Array);

      const result = await uploadVehicleDocument({
        vehicleId: state.selectedVehicleId,
        documentType: state.selectedDocumentType,
        fileData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        ...(expiryDate && { expiryDate }),
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      await loadVehicles();
    } catch (error) {
      throw error;
    }
  }, [state.selectedDocumentType, state.selectedVehicleId, loadVehicles]);

  return {
    vehicles: state.vehicles,
    isLoading: state.isLoading || sessionLoading,
    error: state.error,
    addVehicleModalOpen: state.addVehicleModalOpen,
    uploadModalOpen: state.uploadModalOpen,
    selectedDocumentType: state.selectedDocumentType,
    handleAddVehicle,
    handleCloseAddVehicle,
    handleAddVehicleSubmit,
    handleUploadDocument,
    handleCloseUploadModal,
    handleUploadFile,
    reloadVehicles: loadVehicles,
  };
}
