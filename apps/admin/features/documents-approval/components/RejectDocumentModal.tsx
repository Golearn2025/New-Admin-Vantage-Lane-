/**
 * Reject Document Modal
 * Modal for rejecting documents with reason
 * 
 * MODERN & PREMIUM - Uses Modal + Textarea from ui-core
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Textarea } from '@vantage-lane/ui-core';
import { XCircle } from 'lucide-react';
import type { Document } from '@entities/document';
import styles from './RejectDocumentModal.module.css';

export interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  document: Document | null;
  loading?: boolean;
}

export function RejectDocumentModal({
  isOpen,
  onClose,
  onConfirm,
  document,
  loading = false,
}: RejectDocumentModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    onConfirm(reason.trim());
  };

  const handleChange = (value: string) => {
    setReason(value);
    if (error) setError('');
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Document"
      size="md"
      showCloseButton={true}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <XCircle size={24} />
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>Reject {document.type}</h3>
            <p className={styles.subtitle}>
              Driver: {document.userName}
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <Textarea
            label="Rejection Reason"
            placeholder="Please provide a detailed reason for rejecting this document..."
            value={reason}
            onChange={(e) => handleChange(e.target.value)}
            rows={5}
            maxLength={500}
            showCharCount={true}
            error={error}
            hint="The driver will see this reason. Please be specific and helpful."
            required
            disabled={loading}
            size="md"
            resize="vertical"
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !reason.trim()}
          >
            Reject Document
          </Button>
        </div>
      </div>
    </Modal>
  );
}
