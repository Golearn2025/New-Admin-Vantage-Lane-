/**
 * Bulk Notifications Hook
 * 
 * Custom hook for managing bulk selection and operations on notifications
 * Handles state management and API calls for bulk actions
 */

import { useState } from 'react';
import { useNotificationsContext } from '@admin-shared/providers/NotificationsProvider';
import { 
  markAsUnread, 
  deleteNotification, 
  bulkDelete, 
  bulkMarkRead, 
  bulkMarkUnread,
  type NotificationData
} from '@entities/notification';

export interface UseBulkNotificationsReturn {
  // Selection state
  selectedIds: Set<string>;
  selectedCount: number;
  isAllSelected: (filteredNotifications: NotificationData[]) => boolean;
  isSomeSelected: boolean;
  
  // Loading state
  loading: boolean;
  loadingAction: { id: string; action: 'read' | 'unread' | 'delete' } | null;
  
  // Selection handlers
  handleSelectAll: (filteredNotifications: NotificationData[]) => void;
  handleSelectNotification: (id: string) => void;
  clearSelection: () => void;
  
  // Individual actions
  handleMarkUnread: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  
  // Bulk actions
  handleBulkDelete: () => Promise<void>;
  handleBulkMarkRead: () => Promise<void>;
  handleBulkMarkUnread: () => Promise<void>;
}

export function useBulkNotifications(): UseBulkNotificationsReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<{
    id: string;
    action: 'read' | 'unread' | 'delete';
  } | null>(null);
  
  // Use provider methods that handle both API calls and state updates
  const { 
    markAsUnread: providerMarkAsUnread,
    deleteNotification: providerDelete,
    bulkDelete: providerBulkDelete,
    bulkMarkRead: providerBulkMarkRead,
    bulkMarkUnread: providerBulkMarkUnread,
  } = useNotificationsContext();

  // Computed values
  const selectedCount = selectedIds.size;
  const isAllSelected = (filteredNotifications: NotificationData[]) => 
    selectedIds.size > 0 && selectedIds.size === filteredNotifications.length;
  const isSomeSelected = selectedIds.size > 0;

  // Selection handlers
  const handleSelectAll = (filteredNotifications: NotificationData[]) => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Individual notification actions
  const handleMarkUnread = async (id: string) => {
    setLoadingAction({ id, action: 'unread' });
    try {
      await providerMarkAsUnread(id);
      // Provider handles both API call and state update
    } catch (error) {
      console.error('Mark unread error:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingAction({ id, action: 'delete' });
    try {
      await providerDelete(id);
      // Provider handles both API call and state update
      console.log('✅ HOOK: Delete successful for:', id);
    } catch (error) {
      console.error('❌ HOOK: Delete notification error:', error);
      // You could also show a toast notification here
      alert(`Failed to delete notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    try {
      await providerBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
      // Provider handles both API call and state update
      console.log('✅ HOOK: Bulk delete successful for:', Array.from(selectedIds));
    } catch (error) {
      console.error('❌ HOOK: Bulk delete error:', error);
      // You could also show a toast notification here
      alert(`Failed to delete notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    try {
      await providerBulkMarkRead(Array.from(selectedIds));
      setSelectedIds(new Set());
      // Provider handles both API call and state update
    } catch (error) {
      console.error('Bulk mark read error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkUnread = async () => {
    if (selectedIds.size === 0) return;
    
    setLoading(true);
    try {
      await providerBulkMarkUnread(Array.from(selectedIds));
      setSelectedIds(new Set());
      // Provider handles both API call and state update
    } catch (error) {
      console.error('Bulk mark unread error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Selection state
    selectedIds,
    selectedCount,
    isAllSelected: isAllSelected,
    isSomeSelected,
    
    // Loading state
    loading,
    loadingAction,
    
    // Selection handlers
    handleSelectAll,
    handleSelectNotification,
    clearSelection,
    
    // Individual actions
    handleMarkUnread,
    handleDelete,
    
    // Bulk actions
    handleBulkDelete,
    handleBulkMarkRead,
    handleBulkMarkUnread,
  };
}
