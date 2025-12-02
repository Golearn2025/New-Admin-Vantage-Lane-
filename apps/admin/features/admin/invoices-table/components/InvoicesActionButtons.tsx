/**
 * InvoicesActionButtons Component
 * 
 * Action buttons for selected invoices - focused on bulk operations
 */

'use client';

import React from 'react';
import { Download, Mail, RefreshCw } from 'lucide-react';
import { ActionButton } from '@vantage-lane/ui-core';
import styles from './InvoicesTable.module.css';

interface InvoicesActionButtonsProps {
  selectedCount: number;
  onDownloadPDFs: () => void;
  onSendEmails: () => void;
  onSyncInvoices: () => void;
}

export function InvoicesActionButtons({
  selectedCount,
  onDownloadPDFs,
  onSendEmails,
  onSyncInvoices
}: InvoicesActionButtonsProps) {
  return (
    <div className={styles.actionButtons}>
      <ActionButton
        variant="primary"
        size="md"
        icon={<Download size={16} strokeWidth={2} />}
        label="Download PDFs"
        disabled={selectedCount === 0}
        onClick={onDownloadPDFs}
      />
      <ActionButton
        variant="secondary"
        size="md"
        icon={<Mail size={16} strokeWidth={2} />}
        label="Send Emails"
        disabled={selectedCount === 0}
        onClick={onSendEmails}
      />
      <ActionButton
        variant="secondary"
        size="md"
        icon={<RefreshCw size={16} strokeWidth={2} />}
        label="Sync Invoices"
        onClick={onSyncInvoices}
      />
    </div>
  );
}
