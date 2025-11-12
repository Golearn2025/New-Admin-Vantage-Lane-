/**
 * useUserDropdown Hook
 *
 * Centralized user dropdown menu logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useLogout } from '@admin-shared/hooks';
import { LogOut, Settings, User } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export interface UseUserDropdownProps {
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export interface DropdownMenuItem {
  id: string;
  type: 'link' | 'action';
  label: string;
  href?: string;
  icon: React.ReactNode;
}

export interface UseUserDropdownReturn {
  menuItems: DropdownMenuItem[];
  handleLinkClick: (e: React.MouseEvent) => void;
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function useUserDropdown({
  onClose,
  onNavigate,
}: UseUserDropdownProps): UseUserDropdownReturn {
  const { isLoggingOut, handleLogout } = useLogout();

  // Memoize menu items structure
  const menuItems = useMemo<DropdownMenuItem[]>(
    () => [
      {
        id: 'profile',
        type: 'link',
        label: 'Profile Settings',
        href: '/settings/profile',
        icon: <User size={20} />,
      },
      {
        id: 'settings',
        type: 'link',
        label: 'Account Settings',
        href: '/settings/account',
        icon: <Settings size={20} />,
      },
      {
        id: 'logout',
        type: 'action',
        label: 'Sign Out',
        icon: <LogOut size={20} />,
      },
    ],
    []
  );

  // Handle link click without dynamic parameters
  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      if (!id) return;

      const item = menuItems.find((i) => i.id === id);
      if (!item || item.type !== 'link' || !item.href) return;

      // Close dropdown
      onClose();

      // Optional custom navigation handler
      if (onNavigate) {
        e.preventDefault();
        onNavigate(item.href);
      }
    },
    [menuItems, onClose, onNavigate]
  );

  return {
    menuItems,
    handleLinkClick,
    handleLogout,
    isLoggingOut,
  };
}
