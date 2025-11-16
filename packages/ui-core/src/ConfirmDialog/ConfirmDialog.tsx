/**
 * ConfirmDialog Component
 * 
 * Confirmation dialog pentru acțiuni destructive (delete, etc.)
 * Premium UI cu variant styling (danger/warning/info)
 */

'use client';

import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return 'trash';
      case 'warning':
        return 'bell';
      case 'info':
        return 'bell';
      default:
        return 'bell';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className={styles.container}>
        <div className={`${styles.iconWrapper} ${styles[variant]}`}>
          <Icon name={getIcon() as any} size="lg" />
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <button
            type="button"
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={(e) => {
              console.log('🔥 RAW BUTTON CLICKED!', e);
              alert('RAW BUTTON WORKS!');
              e.preventDefault();
              e.stopPropagation();
              console.log('🔥 ABOUT TO CALL onConfirm');
              onConfirm();
              console.log('🔥 onConfirm CALLED');
            }}
            disabled={loading}
          >
            TEST DELETE (RAW BUTTON)
          </button>
        </div>
      </div>
    </Modal>
  );
}
