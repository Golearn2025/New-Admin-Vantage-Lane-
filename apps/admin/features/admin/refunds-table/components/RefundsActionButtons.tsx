/**
 * RefundsActionButtons Component
 * 
 * Action buttons for refund management - focused on refund-specific operations
 */

'use client';

import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { ActionButton } from '@vantage-lane/ui-core';
import styles from './RefundsTable.module.css';

interface RefundsActionButtonsProps {
  onViewInStripe: () => void;
  onSyncWithStripe: () => void;
}

export function RefundsActionButtons({
  onViewInStripe,
  onSyncWithStripe
}: RefundsActionButtonsProps) {
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
    </div>
  );
}
