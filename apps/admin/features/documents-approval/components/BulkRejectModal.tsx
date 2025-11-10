/**
 * BulkRejectModal Component
 * 
 * Modal for bulk rejecting documents with predefined + custom reasons
 * MODERN & PREMIUM - Reusable component
 */

'use client';

import React, { useState } from 'react';
import { Modal, Button, Select, Input } from '@vantage-lane/ui-core';
import styles from './RejectDocumentModal.module.css';

interface BulkRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  count: number;
  loading?: boolean;
}

const PREDEFINED_REASONS = [
  { value: '', label: 'Select a reason...' },
  { value: 'expired', label: 'Document has expired' },
  { value: 'unclear', label: 'Document is unclear or unreadable' },
  { value: 'invalid', label: 'Invalid or incorrect document type' },
  { value: 'incomplete', label: 'Document is incomplete' },
  { value: 'tampered', label: 'Document appears to be tampered with' },
  { value: 'custom', label: 'Other (specify below)' },
];

export function BulkRejectModal({
  isOpen,
  onClose,
  onConfirm,
  count,
  loading = false,
}: BulkRejectModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');

    // Determine final reason
    let finalReason = '';
    if (selectedReason === 'custom') {
      finalReason = customReason.trim();
    } else if (selectedReason) {
      const reason = PREDEFINED_REASONS.find(r => r.value === selectedReason);
      finalReason = reason?.label || selectedReason;
    }

    // Validate
    if (!finalReason) {
      setError('Please select a rejection reason');
      return;
    }

    if (finalReason.length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    onConfirm(finalReason);
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Reject ${count} Document(s)`} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          You are about to reject <strong>{count} document(s)</strong>. Please select a rejection reason:
        </p>

        {/* Predefined Reasons Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <label style={{ 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)'
          }}>
            Rejection Reason <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <Select
            value={selectedReason}
            options={PREDEFINED_REASONS}
            onChange={(value) => {
              setSelectedReason(value as string);
              setError('');
            }}
            fullWidth
          />
        </div>

        {/* Custom Reason Input (only if "Other" selected) */}
        {selectedReason === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <label style={{ 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)'
            }}>
              Specify Reason <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <Input
              type="text"
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                setError('');
              }}
              placeholder="Enter rejection reason (min 10 characters)"
              fullWidth
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            padding: 'var(--spacing-3)', 
            backgroundColor: 'var(--color-danger-bg)', 
            color: 'var(--color-danger)', 
            borderRadius: 'var(--border-radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', marginTop: 'var(--spacing-2)' }}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Rejecting...' : `Reject ${count} Document(s)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
