/**
 * useProfilePhoto Hook
 * 
 * Business logic for profile photo management
 * Zero UI logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { listDocuments } from '@entities/document';
import { uploadDocument } from '@entities/document/api/uploadDocument';
import { useDriverSession } from '@/shared/hooks/useDriverSession';

interface ProfilePhotoState {
  photoUrl: string | null; // Approved photo
  pendingPhotoUrl: string | null; // Pending photo (if exists)
  status: 'none' | 'approved' | 'pending' | 'rejected';
  isLoading: boolean;
  error: string | null;
  uploadModalOpen: boolean;
}

export function useProfilePhoto() {
  const { driverId, isLoading: sessionLoading } = useDriverSession();
  
  const [state, setState] = useState<ProfilePhotoState>({
    photoUrl: null,
    pendingPhotoUrl: null,
    status: 'none',
    isLoading: true,
    error: null,
    uploadModalOpen: false,
  });

  const loadPhoto = useCallback(async () => {
    if (!driverId) return;
    
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Get ALL profile photos (approved + pending)
      const docs = await listDocuments({
        userId: driverId,
        userType: 'driver',
        type: 'profile_photo',
      });
      
      // Sort by creation date DESC (newest first)
      const sortedDocs = docs.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      // Separate approved and pending photos (take newest of each)
      const approvedPhoto = sortedDocs.find(doc => doc.status === 'approved');
      const pendingPhoto = sortedDocs.find(doc => doc.status === 'pending');
      const rejectedPhoto = sortedDocs.find(doc => doc.status === 'rejected');
      
      // Determine overall status
      let status: 'none' | 'approved' | 'pending' | 'rejected' = 'none';
      if (pendingPhoto) {
        status = 'pending';
      } else if (approvedPhoto) {
        status = 'approved';
      } else if (rejectedPhoto) {
        status = 'rejected';
      }
      
      setState((prev) => ({
        ...prev,
        photoUrl: approvedPhoto?.fileUrl || null,
        pendingPhotoUrl: pendingPhoto?.fileUrl || null,
        status,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load photo',
      }));
    }
  }, [driverId]);

  useEffect(() => {
    loadPhoto();
  }, [loadPhoto]);

  const handleUpload = useCallback(() => {
    setState((prev) => ({ ...prev, uploadModalOpen: true }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setState((prev) => ({ ...prev, uploadModalOpen: false }));
  }, []);

  const handleUploadFile = useCallback(async (file: File, expiryDate?: string) => {
    if (!driverId) return;

    try {
      // Convert file to number[] for server action (Next.js compatible)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const fileData = Array.from(uint8Array);

      const result = await uploadDocument({
        driverId,
        documentType: 'profile_photo',
        fileData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        // profile_photo doesn't need expiry, but included for consistency
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      await loadPhoto();
    } catch (error) {
      throw error;
    }
  }, [driverId, loadPhoto]);

  return {
    photoUrl: state.photoUrl,
    pendingPhotoUrl: state.pendingPhotoUrl,
    status: state.status,
    isLoading: state.isLoading || sessionLoading,
    error: state.error,
    uploadModalOpen: state.uploadModalOpen,
    handleUpload,
    handleCloseModal,
    handleUploadFile,
    reloadPhoto: loadPhoto,
  };
}
