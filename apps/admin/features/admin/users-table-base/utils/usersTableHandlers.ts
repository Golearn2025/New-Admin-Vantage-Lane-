/**
 * Users Table Handlers Utility
 * 
 * Bulk action handlers for user management - focused on business logic
 */

import { bulkDeleteUsers, bulkUpdateUsers } from '@entities/user';

export interface BulkActionHandlers {
  selectedUserIds: string[];
  userType: string;
  refetch: () => Promise<void>;
  clearSelection: () => void;
}

export async function handleBulkDelete({
  selectedUserIds,
  userType,
  refetch,
  clearSelection
}: BulkActionHandlers): Promise<void> {
  if (userType !== 'all') {
    const validUserType = userType as 'customer' | 'driver' | 'admin' | 'operator';
    await bulkDeleteUsers({ userIds: selectedUserIds, userType: validUserType });
    alert(`✅ ${selectedUserIds.length} user(s) deleted successfully!`);
    await refetch();
    clearSelection();
  } else {
    alert('⚠️ Cannot delete from "All Users" view. Use specific user type pages.');
  }
}

export async function handleBulkActivate({
  selectedUserIds,
  userType,
  refetch,
  clearSelection
}: BulkActionHandlers): Promise<void> {
  const isActive = true;
  if (userType !== 'all') {
    const validUserType = userType as 'customer' | 'driver' | 'admin' | 'operator';
    await bulkUpdateUsers({ userIds: selectedUserIds, isActive, userType: validUserType });
    alert(`✅ ${selectedUserIds.length} user(s) activated successfully!`);
    await refetch();
    clearSelection();
  } else {
    alert('⚠️ Cannot activate from "All Users" view. Use specific user type pages.');
  }
}

export async function handleBulkDeactivate({
  selectedUserIds,
  userType,
  refetch,
  clearSelection
}: BulkActionHandlers): Promise<void> {
  const isActive = false;
  if (userType !== 'all') {
    const validUserType = userType as 'customer' | 'driver' | 'admin' | 'operator';
    await bulkUpdateUsers({ userIds: selectedUserIds, isActive, userType: validUserType });
    alert(`✅ ${selectedUserIds.length} user(s) deactivated successfully!`);
    await refetch();
    clearSelection();
  } else {
    alert('⚠️ Cannot deactivate from "All Users" view. Use specific user type pages.');
  }
}

export async function handleSingleDelete({
  userId,
  userType,
  refetch
}: {
  userId: string;
  userType: string;
  refetch: () => Promise<void>;
}): Promise<void> {
  if (userType !== 'all') {
    const validUserType = userType as 'customer' | 'driver' | 'admin' | 'operator';
    await bulkDeleteUsers({ userIds: [userId], userType: validUserType });
    alert(`✅ User deleted successfully!`);
    await refetch();
  } else {
    alert('⚠️ Cannot delete from "All Users" view. Use specific user type pages.');
  }
}
