/**
 * Document Upload Component
 * 
 * Premium drag & drop file upload with expiry date picker.
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { DocumentType } from '../../../entities/driver-document';
import { getDocumentMetadata } from '../../../entities/driver-document';
import styles from './DocumentUpload.module.css';

interface DocumentUploadProps {
  documentType: DocumentType;
  onUpload: (file: File, expiryDate?: string) => Promise<void>;
  disabled?: boolean;
}

export function DocumentUpload({
  documentType,
  onUpload,
  disabled = false,
}: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const metadata = getDocumentMetadata(documentType);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const maxSize = metadata.max_size_mb * 1024 * 1024;
    if (file.size > maxSize) {
      return `File size must be under ${metadata.max_size_mb}MB`;
    }

    // Check file type
    const acceptedTypes = metadata.accept.split(',').map((t) => t.trim());
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(`${category}/`);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return 'Invalid file type';
    }

    return null;
  }, [metadata]);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile, expiryDate || undefined);
      setSelectedFile(null);
      setExpiryDate('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, expiryDate, onUpload]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const dropzoneClass = [
    styles.dropzone,
    isDragging && styles.dropzoneActive,
    disabled && styles.dropzoneDisabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <div
        className={dropzoneClass}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className={styles.icon}>{metadata.icon}</div>
        <div className={styles.title}>Upload {metadata.label}</div>
        <div className={styles.subtitle}>
          Drag & drop or click to browse
        </div>
        <div className={styles.fileTypes}>
          Accepted: {metadata.accept} (max {metadata.max_size_mb}MB)
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept={metadata.accept}
          onChange={handleFileInputChange}
          disabled={disabled}
        />
      </div>

      {selectedFile && (
        <div className={styles.selectedFile}>
          <div className={styles.fileIcon}>📄</div>
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{selectedFile.name}</div>
            <div className={styles.fileSize}>
              {formatFileSize(selectedFile.size)}
            </div>
          </div>
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemoveFile}
            disabled={isUploading}
          >
            ✕
          </button>
        </div>
      )}

      {metadata.has_expiry && selectedFile && (
        <div className={styles.expirySection}>
          <label htmlFor="expiry-date" className={styles.expiryLabel}>
            Expiry Date {metadata.has_expiry && '*'}
          </label>
          <input
            id="expiry-date"
            type="date"
            className={styles.expiryInput}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={isUploading}
          />
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {isUploading && (
        <div className={styles.progress}>Uploading...</div>
      )}

      <button
        type="button"
        className={styles.uploadButton}
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || (metadata.has_expiry && !expiryDate)}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
}
