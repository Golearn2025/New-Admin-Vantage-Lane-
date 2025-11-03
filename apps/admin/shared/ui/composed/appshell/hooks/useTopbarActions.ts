/**
 * useTopbarActions Hook
 * 
 * Centralized topbar actions logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface UseTopbarActionsReturn {
  isUserDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  handleUserMenuToggle: () => void;
  handleUserMenuClose: () => void;
  handleNavigateToNotifications: () => void;
}

export function useTopbarActions(): UseTopbarActionsReturn {
  const router = useRouter();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUserMenuToggle = useCallback(() => {
    setIsUserDropdownOpen((prev) => !prev);
  }, []);

  const handleUserMenuClose = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, []);

  const handleNavigateToNotifications = useCallback(() => {
    router.push('/admin/notifications');
  }, [router]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isUserDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return {
    isUserDropdownOpen,
    dropdownRef,
    handleUserMenuToggle,
    handleUserMenuClose,
    handleNavigateToNotifications,
  };
}
