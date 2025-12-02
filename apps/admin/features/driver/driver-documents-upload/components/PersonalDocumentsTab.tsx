/**
 * Personal Documents Tab
 * 
 * Displays 6 personal documents with upload functionality
 * Zero logic - delegates to hook
 */

'use client';

import React, { useMemo } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentUploadModal } from './DocumentUploadModal';
import { usePersonalDocuments } from '../hooks/usePersonalDocuments';
import styles from './PersonalDocumentsTab.module.css';

const PERSONAL_DOCUMENTS = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'proof_of_identity',
  'bank_statement',
] as const;

export function PersonalDocumentsTab() {
  const {
    documents,
    uploadModalOpen,
    selectedDocumentType,
    handleUpload,
    handleCloseModal,
    handleUploadFile,
  } = usePersonalDocuments();

  // Memoize document cards to prevent re-creation on every render
  const documentCards = useMemo(() => 
    PERSONAL_DOCUMENTS.map((docType) => (
      <DocumentCard
        key={docType}
        documentType={docType}
        document={documents[docType]}
        onUpload={() => handleUpload(docType)}
      />
    )), 
    [documents, handleUpload]
  );

  return (
    <div className={styles.container}>
      
      <div className={styles.grid}>
        {documentCards}
      </div>

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseModal}
        documentType={selectedDocumentType}
        onUpload={handleUploadFile}
      />
    </div>
  );
}
