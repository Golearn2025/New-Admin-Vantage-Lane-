/**
 * Document Upload Modal
 * 
 * Modal for uploading documents with:
 * - File picker
 * - Expiry date (if applicable)
 * - Upload progress
 * 
 * 100% UI-core components
 */

'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Modal, Button, Input } from '@vantage-lane/ui-core';
import { Upload, X, Check } from 'lucide-react';
import { getDocumentLabel, requiresExpiryDate } from '@entities/document';
import type { DocumentType } from '@entities/document';
import styles from './DocumentUploadModal.module.css';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType | null;
  onUpload: (file: File, expiryDate?: string) => Promise<void>;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  documentType,
  onUpload,
}: DocumentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasExpiry = documentType ? requiresExpiryDate(documentType) : false;
  const label = documentType ? getDocumentLabel(documentType) : '';

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;

    if (hasExpiry && !expiryDate) {
      setError('Please select an expiry date');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      await onUpload(selectedFile, hasExpiry ? expiryDate : undefined);
      
      // Reset and close
      setSelectedFile(null);
      setExpiryDate('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setExpiryDate('');
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Upload ${label}`}
      size="md"
    >
      <div className={styles.container}>
        {/* File Picker */}
        <div className={styles.section}>
          <label className={styles.label}>Select File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="md"
            disabled={isUploading}
            leftIcon={<Upload size={16} />}
            className={styles.selectButton}
          >
            {selectedFile ? 'Change File' : 'Choose File'}
          </Button>

          {selectedFile && (
            <div className={styles.selectedFile}>
              <Check />
              <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}
        </div>

        {/* Expiry Date (if applicable) */}
        {hasExpiry && (
          <div className={styles.section}>
            <label htmlFor="expiry-date" className={styles.label}>
              Expiry Date *
            </label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={isUploading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={styles.error}>
            <X />
            <span>{error}</span>
          </div>
        )}

        {/* File Requirements */}
        <div className={styles.requirements}>
          <p className={styles.requirementsTitle}>File Requirements:</p>
          <ul className={styles.requirementsList}>
            <li>Format: JPG, PNG, or PDF</li>
            <li>Maximum file size: 5MB</li>
            <li>Clear and readable document</li>
            {hasExpiry && <li>Valid expiry date required</li>}
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            onClick={handleClose}
            variant="outline"
            size="md"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="primary"
            size="md"
            disabled={!selectedFile || isUploading || (hasExpiry && !expiryDate)}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
