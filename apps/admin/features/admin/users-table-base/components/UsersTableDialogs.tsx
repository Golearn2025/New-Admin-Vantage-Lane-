/**
 * UsersTableDialogs Component
 * 
 * Confirmation dialogs for delete and bulk actions - focused on dialog management
 */

'use client';

import type { UnifiedUser } from '@entities/user';
import { ConfirmDialog } from '@vantage-lane/ui-core';

export type BulkActionType = 'activate' | 'deactivate' | 'delete' | 'set_online' | 'set_offline' | null;

interface UsersTableDialogsProps {
  deleteUser: UnifiedUser | null;
  bulkAction: BulkActionType;
  selectedCount: number;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onBulkActionCancel: () => void;
  onBulkActionConfirm: () => void;
}

function getBulkActionTitle(action: BulkActionType): string {
  switch (action) {
    case 'delete': return 'Delete Selected Users';
    case 'activate': return 'Activate Selected Users';
    case 'deactivate': return 'Deactivate Selected Users';
    case 'set_online': return 'Set Drivers Online';
    case 'set_offline': return 'Set Drivers Offline';
    default: return '';
  }
}

function getBulkActionMessage(action: BulkActionType, count: number): string {
  switch (action) {
    case 'delete': return `⚠️ Soft delete ${count} user(s)? They will be marked as deleted but data will be preserved for audit.`;
    case 'activate': return `Activate ${count} user(s)? They will be able to login and use the system.`;
    case 'deactivate': return `Deactivate ${count} user(s)? They won't be able to login until reactivated.`;
    case 'set_online': return `🟢 Set ${count} driver(s) to ONLINE? They will appear on the live map.`;
    case 'set_offline': return `🔴 Set ${count} driver(s) to OFFLINE? They will disappear from the live map.`;
    default: return '';
  }
}

export function UsersTableDialogs({
  deleteUser,
  bulkAction,
  selectedCount,
  onDeleteCancel,
  onDeleteConfirm,
  onBulkActionCancel,
  onBulkActionConfirm
}: UsersTableDialogsProps) {
  return (
    <>
      {/* Individual Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        title="Delete User"
        message={`⚠️ Soft delete ${deleteUser?.name}? User data will be preserved for audit.`}
        variant="danger"
      />

      {/* Bulk Action Confirmation */}
      <ConfirmDialog
        isOpen={!!bulkAction}
        onClose={onBulkActionCancel}
        onConfirm={onBulkActionConfirm}
        title={getBulkActionTitle(bulkAction)}
        message={getBulkActionMessage(bulkAction, selectedCount)}
        variant={bulkAction === 'delete' ? 'danger' : 'warning'}
      />
    </>
  );
}
