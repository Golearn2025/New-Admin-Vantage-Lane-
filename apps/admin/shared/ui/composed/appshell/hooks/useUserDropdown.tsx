/**
 * useUserDropdown Hook
 * 
 * Centralized user dropdown menu logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Settings, User, LogOut } from 'lucide-react';

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
  handleItemClick: (e: React.MouseEvent, itemId: string) => void;
}

export function useUserDropdown({
  onClose,
  onNavigate,
}: UseUserDropdownProps): UseUserDropdownReturn {
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

  // Handle item click with callback
  const handleItemClick = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      const item = menuItems.find((i) => i.id === itemId);
      
      if (item && item.type === 'link' && item.href) {
        // Close dropdown
        onClose();
        
        // Optional custom navigation handler
        if (onNavigate) {
          e.preventDefault();
          onNavigate(item.href);
        }
      }
    },
    [menuItems, onClose, onNavigate]
  );

  return {
    menuItems,
    handleItemClick,
  };
}
