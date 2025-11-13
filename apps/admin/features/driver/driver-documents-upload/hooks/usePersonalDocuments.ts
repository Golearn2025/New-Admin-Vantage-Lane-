/**
 * usePersonalDocuments Hook
 * 
 * Business logic for personal documents management
 * Zero UI logic - pure data management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { listDocuments } from '@entities/document';
import { uploadDocument } from '@entities/document/api/uploadDocument';
import { useDriverSession } from '@/shared/hooks/useDriverSession';
import type { Document, DocumentType } from '@entities/document';

interface PersonalDocumentsState {
  documents: Record<string, Document | undefined>;
  isLoading: boolean;
  error: string | null;
  uploadModalOpen: boolean;
  selectedDocumentType: DocumentType | null;
}

export function usePersonalDocuments() {
  const { driverId, isLoading: sessionLoading } = useDriverSession();
  
  const [state, setState] = useState<PersonalDocumentsState>({
    documents: {},
    isLoading: true,
    error: null,
    uploadModalOpen: false,
    selectedDocumentType: null,
  });

  const loadDocuments = useCallback(async () => {
    if (!driverId) return;
    
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const docs = await listDocuments({
        userId: driverId,
        userType: 'driver',
        category: 'driver',
      });
      
      // Map array to record by document type
      // Prioritize approved documents over pending
      const docsRecord = docs.reduce((acc, doc) => {
        const existing = acc[doc.type];
        // Only replace if no existing doc, or existing is pending and new is approved
        if (!existing || (existing.status === 'pending' && doc.status === 'approved')) {
          acc[doc.type] = doc;
        }
        return acc;
      }, {} as Record<string, Document>);
      
      setState((prev) => ({
        ...prev,
        documents: docsRecord,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load documents',
      }));
    }
  }, [driverId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = useCallback((documentType: DocumentType) => {
    setState((prev) => ({
      ...prev,
      uploadModalOpen: true,
      selectedDocumentType: documentType,
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      uploadModalOpen: false,
      selectedDocumentType: null,
    }));
  }, []);

  const handleUploadFile = useCallback(async (file: File, expiryDate?: string) => {
    if (!driverId || !state.selectedDocumentType) return;

    try {
      // Convert file to Uint8Array for server action (Next.js compatible)
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const result = await uploadDocument({
        driverId,
        documentType: state.selectedDocumentType,
        fileData: Array.from(fileData),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        ...(expiryDate && { expiryDate }),
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Reload documents after successful upload
      await loadDocuments();
    } catch (error) {
      throw error; // Let modal handle error display
    }
  }, [driverId, state.selectedDocumentType, loadDocuments]);

  return {
    documents: state.documents,
    isLoading: state.isLoading || sessionLoading,
    error: state.error,
    uploadModalOpen: state.uploadModalOpen,
    selectedDocumentType: state.selectedDocumentType,
    handleUpload,
    handleCloseModal,
    handleUploadFile,
    reloadDocuments: loadDocuments,
  };
}
