/**
 * useSidebarNavigation Hook
 * 
 * Centralized sidebar navigation logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { getMenuForRole, isMenuItemActive, isMenuItemExpanded } from '../menu-config';
import type { UserRole } from '../types';

export interface UseSidebarNavigationProps {
  role: UserRole;
  currentPath: string;
  defaultCollapsed?: boolean;
  expandable?: boolean;
}

export interface UseSidebarNavigationReturn {
  menuItems: ReturnType<typeof getMenuForRole>;
  expandedItems: string[];
  isCollapsed: boolean;
  handleToggleExpand: (href: string) => void;
  handleToggleCollapse: () => void;
  isMenuItemActive: typeof isMenuItemActive;
  isMenuItemExpanded: typeof isMenuItemExpanded;
}

export function useSidebarNavigation({
  role,
  currentPath,
  defaultCollapsed = false,
  expandable = true,
}: UseSidebarNavigationProps): UseSidebarNavigationReturn {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Memoize menu items based on role
  const menuItems = useMemo(() => getMenuForRole(role), [role]);

  // Toggle expand for menu item with submenu
  const handleToggleExpand = useCallback((href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  }, []);

  // Toggle sidebar collapse state
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    menuItems,
    expandedItems,
    isCollapsed,
    handleToggleExpand,
    handleToggleCollapse,
    isMenuItemActive,
    isMenuItemExpanded,
  };
}
