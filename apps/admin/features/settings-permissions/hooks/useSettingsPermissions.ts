/**
 * useSettingsPermissions Hook
 */

'use client';

import { useState, useEffect } from 'react';
import {
  getRolePermissions,
  getUserPermissions,
  updateRolePermission,
  updateUserPermission,
  type UserRole,
  type PageWithPermission,
} from '@entities/permission';
import type { PermissionView, PermissionState } from '../types';

export function useSettingsPermissions() {
  const [state, setState] = useState<PermissionState>({
    view: 'role',
    selectedRole: 'operator',
    selectedUserId: null,
    pages: [],
    loading: true,
    saving: false,
    error: null,
  });

  const loadRolePermissions = async (role: UserRole) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getRolePermissions(role);
      setState((prev) => ({
        ...prev,
        pages: response.pages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load permissions',
        loading: false,
      }));
    }
  };

  const loadUserPermissions = async (userId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getUserPermissions(userId);
      setState((prev) => ({
        ...prev,
        pages: response.pages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load user permissions',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (state.view === 'role') {
      loadRolePermissions(state.selectedRole);
    } else if (state.selectedUserId) {
      loadUserPermissions(state.selectedUserId);
    }
  }, [state.view, state.selectedRole, state.selectedUserId]);

  const handleViewChange = (view: PermissionView) => {
    setState((prev) => ({ ...prev, view }));
  };

  const handleRoleChange = (role: UserRole) => {
    setState((prev) => ({ ...prev, selectedRole: role }));
  };

  const handleUserChange = (userId: string) => {
    setState((prev) => ({ ...prev, selectedUserId: userId }));
  };

  const handleTogglePermission = async (pageKey: string, enabled: boolean) => {
    setState((prev) => ({ ...prev, saving: true, error: null }));

    try {
      if (state.view === 'role') {
        await updateRolePermission({
          role: state.selectedRole,
          pageKey,
          enabled,
        });
      } else if (state.selectedUserId) {
        await updateUserPermission({
          userId: state.selectedUserId,
          pageKey,
          enabled,
        });
      }

      // Update local state
      setState((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => (p.pageKey === pageKey ? { ...p, enabled } : p)),
        saving: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update permission',
        saving: false,
      }));
    }
  };

  return {
    ...state,
    handleViewChange,
    handleRoleChange,
    handleUserChange,
    handleTogglePermission,
  };
}
