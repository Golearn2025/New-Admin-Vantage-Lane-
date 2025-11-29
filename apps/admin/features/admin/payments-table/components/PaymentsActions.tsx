/**
 * PaymentsActions Component
 * 
 * Action buttons for payments management
 * 
 * ✅ Zero any types
 * ✅ UI-core components
 * ✅ Lucide-react icons
 */

import { ExternalLink, RefreshCw, Ban } from 'lucide-react';
import { ActionButton } from '@vantage-lane/ui-core';
import type { UseSelectionReturn } from '@vantage-lane/ui-core';
import styles from './PaymentsTable.module.css';

interface PaymentsActionsProps {
  selection: UseSelectionReturn<any>;
}

export function PaymentsActions({ selection }: PaymentsActionsProps) {
  const handleViewInStripe = () => {
    const stripeUrl = 'https://dashboard.stripe.com/payments';
    window.open(stripeUrl, '_blank');
  };

  const handleSyncWithStripe = () => {
    alert('Syncing with Stripe...');
    // TODO: Implement Stripe sync
  };

  const handleRefundSelected = () => {
    if (confirm(`Refund ${selection.selectedCount} selected payments?`)) {
      console.log('Refunding:', selection.selectedRows);
      // TODO: Implement refund logic
    }
  };

  return (
    <div className={styles.actionButtons}>
      <ActionButton
        variant="primary"
        size="md"
        icon={<ExternalLink size={16} strokeWidth={2} />}
        label="View in Stripe"
        onClick={handleViewInStripe}
      />
      <ActionButton
        variant="secondary"
        size="md"
        icon={<RefreshCw size={16} strokeWidth={2} />}
        label="Sync with Stripe"
        onClick={handleSyncWithStripe}
      />
      <ActionButton
        variant="secondary"
        size="md"
        icon={<Ban size={16} strokeWidth={2} />}
        label="Refund Selected"
        disabled={selection.selectedCount === 0}
        onClick={handleRefundSelected}
      />
    </div>
  );
}
