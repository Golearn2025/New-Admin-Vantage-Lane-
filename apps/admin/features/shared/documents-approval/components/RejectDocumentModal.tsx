/**
 * Reject Document Modal
 * Modal for rejecting documents with reason
 * 
 * MODERN & PREMIUM - Uses Modal + Textarea from ui-core
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Textarea } from '@vantage-lane/ui-core';
import { XCircle } from 'lucide-react';
import type { Document } from '@entities/document';
import { REJECTION_REASONS } from '@features/shared/driver-profile/constants/documentTypes';
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
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedReason('');
      setCustomReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // Get final reason
    const finalReason = selectedReason === 'Other (please specify)' 
      ? customReason.trim() 
      : selectedReason;

    if (!finalReason) {
      setError('Rejection reason is required');
      return;
    }

    if (finalReason.length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    onConfirm(finalReason);
  };

  // Memoize reason options to prevent re-creation on every render
  const reasonOptions = useMemo(() => 
    REJECTION_REASONS.map((reason) => (
      <option key={reason} value={reason}>
        {reason}
      </option>
    )), 
    []
  );

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (error) setError('');
  };

  const handleCustomReasonChange = (customReason: string) => {
    setCustomReason(customReason);
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
          <div className={styles.selectWrapper}>
            <label htmlFor="rejection-reason" className={styles.label}>
              Rejection Reason *
            </label>
            <select
              id="rejection-reason"
              className={styles.select}
              value={selectedReason}
              onChange={(e) => handleReasonSelect(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a reason...</option>
              {reasonOptions}
            </select>
          </div>

          {selectedReason === 'Other (please specify)' && (
            <Textarea
              label="Please specify"
              placeholder="Provide a detailed reason..."
              value={customReason}
              onChange={(e) => handleCustomReasonChange(e.target.value)}
              rows={4}
              maxLength={500}
              showCharCount={true}
              error={error}
              hint="The driver will see this reason. Please be specific and helpful."
              required
              disabled={loading}
              size="md"
              resize="vertical"
            />
          )}

          {selectedReason && selectedReason !== 'Other (please specify)' && (
            <div className={styles.selectedReason}>
              <p className={styles.hint}>
                The driver will see this reason. Please be specific and helpful.
              </p>
            </div>
          )}
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
            disabled={loading || !selectedReason || (selectedReason === 'Other (please specify)' && !customReason.trim())}
          >
            Reject Document
          </Button>
        </div>
      </div>
    </Modal>
  );
}
