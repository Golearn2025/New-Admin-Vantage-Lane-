/**
 * UsersModals Component
 * 
 * All modal dialogs for users table (Create, View, Edit, Delete confirmation)
 * Extracted from UsersTableBase for better maintainability
 */

'use client';

import React from 'react';
import { ConfirmDialog } from '@vantage-lane/ui-core';
import { UserCreateModal } from '@features/admin/user-create-modal';
import { UserViewModal } from '@features/admin/user-view-modal';
import { UserEditModal } from '@features/admin/user-edit-modal';
import { bulkUpdateUsers, bulkDeleteUsers } from '@entities/user';
import type { UnifiedUser } from '@entities/user';

interface UsersModalsProps {
  userType: string;
  // Create Modal
  isCreateModalOpen: boolean;
  onCreateModalClose: () => void;
  onUserCreated: () => void;
  
  // View Modal
  viewUser: UnifiedUser | null;
  onViewModalClose: () => void;
  
  // Edit Modal
  editUser: UnifiedUser | null;
  onEditModalClose: () => void;
  onUserUpdated: () => void;
  
  // Delete Confirmation
  deleteUser: UnifiedUser | null;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => Promise<void>;
  
  // Bulk Action Confirmation
  bulkAction: 'activate' | 'deactivate' | 'delete' | null;
  selectedUserIds: string[];
  onBulkCancel: () => void;
  onBulkConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export function UsersModals({
  userType,
  isCreateModalOpen,
  onCreateModalClose,
  onUserCreated,
  viewUser,
  onViewModalClose,
  editUser,
  onEditModalClose,
  onUserUpdated,
  deleteUser,
  onDeleteCancel,
  onDeleteConfirm,
  bulkAction,
  selectedUserIds,
  onBulkCancel,
  onBulkConfirm,
  isProcessing,
}: UsersModalsProps) {
  return (
    <>
      {/* Create User Modal */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        onSuccess={onUserCreated}
      />

      {/* View User Modal */}
      <UserViewModal
        isOpen={!!viewUser}
        user={viewUser}
        onClose={onViewModalClose}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={!!editUser}
        user={editUser}
        onClose={onEditModalClose}
        onSuccess={onUserUpdated}
      />

      {/* Delete Confirmation Dialog */}
      {deleteUser && (
        <ConfirmDialog
          isOpen={!!deleteUser}
          onClose={onDeleteCancel}
          onConfirm={onDeleteConfirm}
          title="Delete User"
          message={`Are you sure you want to delete ${deleteUser.name}? This action cannot be undone.`}
          variant="danger"
        />
      )}

      {/* Bulk Action Confirmation Dialog */}
      {bulkAction && (
        <ConfirmDialog
          isOpen={!!bulkAction}
          onClose={onBulkCancel}
          onConfirm={onBulkConfirm}
          title={`${bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)} Users`}
          message={`Are you sure you want to ${bulkAction} ${selectedUserIds.length} selected user${selectedUserIds.length !== 1 ? 's' : ''}?`}
          variant={bulkAction === 'delete' ? 'danger' : 'warning'}
        />
      )}
    </>
  );
}
