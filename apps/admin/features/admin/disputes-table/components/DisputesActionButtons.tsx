/**
 * DisputesActionButtons Component
 * 
 * Action buttons for dispute management - focused on dispute-specific operations
 */

'use client';

import React from 'react';
import { ExternalLink, RefreshCw, Upload } from 'lucide-react';
import { ActionButton } from '@vantage-lane/ui-core';
import styles from './DisputesTable.module.css';

interface DisputesActionButtonsProps {
  selectedCount: number;
  onViewInStripe: () => void;
  onSyncWithStripe: () => void;
  onSubmitEvidence: () => void;
}

export function DisputesActionButtons({
  selectedCount,
  onViewInStripe,
  onSyncWithStripe,
  onSubmitEvidence
}: DisputesActionButtonsProps) {
  return (
    <div className={styles.actionButtons}>
      <ActionButton
        variant="primary"
        size="md"
        icon={<ExternalLink size={16} strokeWidth={2} />}
        label="View in Stripe"
        onClick={onViewInStripe}
      />
      <ActionButton
        variant="secondary"
        size="md"
        icon={<RefreshCw size={16} strokeWidth={2} />}
        label="Sync with Stripe"
        onClick={onSyncWithStripe}
      />
      <ActionButton
        variant="primary"
        size="md"
        icon={<Upload size={16} strokeWidth={2} />}
        label="Submit Evidence"
        disabled={selectedCount === 0}
        onClick={onSubmitEvidence}
      />
    </div>
  );
}
