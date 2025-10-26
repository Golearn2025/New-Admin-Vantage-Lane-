/**
 * useDocuments Hook
 * 
 * React hook for managing driver documents with real-time updates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  DocumentWithExpiry,
  DocumentType,
  DocumentUploadPayload,
} from '../../../entities/driver-document';
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from '../../../entities/driver-document';

interface UseDocumentsReturn {
  documents: DocumentWithExpiry[];
  loading: boolean;
  error: string | null;
  uploadDocument: (
    driverId: string,
    payload: DocumentUploadPayload
  ) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  refetch: () => Promise<void>;
  getDocumentByType: (type: DocumentType) => DocumentWithExpiry | null;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentWithExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadDocument = useCallback(
    async (driverId: string, payload: DocumentUploadPayload) => {
      try {
        setError(null);
        await uploadDocument(driverId, payload);
        await fetchDocuments();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      }
    },
    [fetchDocuments]
  );

  const handleDeleteDocument = useCallback(
    async (documentId: string) => {
      try {
        setError(null);
        await deleteDocument(documentId);
        await fetchDocuments();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed');
        throw err;
      }
    },
    [fetchDocuments]
  );

  const getDocumentByType = useCallback(
    (type: DocumentType): DocumentWithExpiry | null => {
      return documents.find((doc) => doc.document_type === type) || null;
    },
    [documents]
  );

  return {
    documents,
    loading,
    error,
    uploadDocument: handleUploadDocument,
    deleteDocument: handleDeleteDocument,
    refetch: fetchDocuments,
    getDocumentByType,
  };
}
