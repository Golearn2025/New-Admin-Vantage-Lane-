/**
 * UsersTableDialogs Component
 * 
 * Confirmation dialogs for delete and bulk actions - focused on dialog management
 */

'use client';

import React from 'react';
import { ConfirmDialog } from '@vantage-lane/ui-core';
import type { UnifiedUser } from '@entities/user';

interface UsersTableDialogsProps {
  deleteUser: UnifiedUser | null;
  bulkAction: 'activate' | 'deactivate' | 'delete' | null;
  selectedCount: number;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onBulkActionCancel: () => void;
  onBulkActionConfirm: () => void;
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
        title={
          bulkAction === 'delete'
            ? 'Delete Selected Users'
            : bulkAction === 'activate'
              ? 'Activate Selected Users'
              : 'Deactivate Selected Users'
        }
        message={
          bulkAction === 'delete'
            ? `⚠️ Soft delete ${selectedCount} user(s)? They will be marked as deleted but data will be preserved for audit.`
            : bulkAction === 'activate'
              ? `Activate ${selectedCount} user(s)? They will be able to login and use the system.`
              : `Deactivate ${selectedCount} user(s)? They won't be able to login until reactivated.`
        }
        variant={bulkAction === 'delete' ? 'danger' : 'warning'}
      />
    </>
  );
}
