/**
 * UsersTableModals Component
 * 
 * Create, view, and edit modals for user management - focused on modal orchestration
 */

'use client';

import React from 'react';
import { UserCreateModal } from '@features/admin/user-create-modal';
import { UserEditModal } from '@features/admin/user-edit-modal';
import { UserViewModal } from '@features/admin/user-view-modal';
import type { UnifiedUser } from '@entities/user';

interface UsersTableModalsProps {
  showCreateButton: boolean;
  isCreateModalOpen: boolean;
  viewUser: UnifiedUser | null;
  editUser: UnifiedUser | null;
  onCreateClose: () => void;
  onCreateSuccess: () => void;
  onViewClose: () => void;
  onEditClose: () => void;
  onEditSuccess: () => void;
}

export function UsersTableModals({
  showCreateButton,
  isCreateModalOpen,
  viewUser,
  editUser,
  onCreateClose,
  onCreateSuccess,
  onViewClose,
  onEditClose,
  onEditSuccess
}: UsersTableModalsProps) {
  return (
    <>
      {showCreateButton && (
        <UserCreateModal
          isOpen={isCreateModalOpen}
          onClose={onCreateClose}
          onSuccess={onCreateSuccess}
        />
      )}

      {/* View User Modal */}
      <UserViewModal isOpen={!!viewUser} onClose={onViewClose} user={viewUser} />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={!!editUser}
        onClose={onEditClose}
        onSuccess={onEditSuccess}
        user={editUser}
      />
    </>
  );
}
