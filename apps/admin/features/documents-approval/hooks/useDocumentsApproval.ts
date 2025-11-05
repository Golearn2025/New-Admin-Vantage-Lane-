/**
 * Documents Approval Feature - Main Hook
 * Data fetching and state management
 * 
 * MODERN & PREMIUM - Type-safe hook
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { listDocuments, getDocumentCounts } from '@entities/document';
import type { Document, DocumentStatus } from '@entities/document';
import type { DocumentsApprovalFilters, DocumentTab } from '../types';

interface ApiFilters {
  status?: DocumentStatus;
  userType?: 'driver' | 'operator';
  search?: string;
}

export function useDocumentsApproval() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<DocumentsApprovalFilters>({
    tab: 'pending',
    search: '',
  });
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
    expiring_soon: 0,
  });
  
  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters based on active tab
      const apiFilters: ApiFilters = {};
      
      if (filters.tab === 'pending') {
        apiFilters.status = 'pending';
      } else if (filters.tab === 'expiring') {
        apiFilters.status = 'expiring_soon';
      } else if (filters.tab === 'expired') {
        apiFilters.status = 'expired';
      }
      
      if (filters.userType) {
        apiFilters.userType = filters.userType;
      }
      
      if (filters.search) {
        apiFilters.search = filters.search;
      }
      
      const data = await listDocuments(apiFilters);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch counts
  const fetchCounts = async () => {
    try {
      const data = await getDocumentCounts();
      setCounts(data);
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, [filters.tab, filters.userType, filters.search]);
  
  useEffect(() => {
    fetchCounts();
  }, []);
  
  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    if (!filters.search) return documents;
    
    const query = filters.search.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.userName.toLowerCase().includes(query) ||
        doc.userEmail.toLowerCase().includes(query) ||
        doc.name.toLowerCase().includes(query)
    );
  }, [documents, filters.search]);
  
  // Combined refetch function (documents + counts)
  const refetch = async () => {
    await Promise.all([
      fetchDocuments(),
      fetchCounts(),
    ]);
  };
  
  return {
    documents: filteredDocuments,
    loading,
    error,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
    counts,
    refetch,
  };
}
