/**
 * SidebarNavItem Component
 *
 * Individual navigation item wrapper for SidebarNav.
 * Handles active state calculation and expanded state logic.
 * Performance optimized - extracted from inline map function.
 */

'use client';

import { memo } from 'react';
import { NavItem } from './NavItem';
import type { IconName } from '@vantage-lane/ui-icons';

interface MenuItemType {
  href: string;
  icon: IconName;
  label: string;
  badgeCount?: number;
  children?: string[];
}

export interface SidebarNavItemProps {
  item: MenuItemType;
  currentPath: string;
  expandable: boolean;
  expandedItems: string[];
  onNavigate?: (path: string) => void;
  onToggleExpandHandler?: (href: string) => void;
  isMenuItemActive: (item: MenuItemType, path: string) => boolean;
  isMenuItemExpanded: (item: MenuItemType, path: string) => boolean;
}

function SidebarNavItemComponent({ 
  item,
  currentPath,
  expandable,
  expandedItems,
  onNavigate,
  onToggleExpandHandler,
  isMenuItemActive,
  isMenuItemExpanded
}: SidebarNavItemProps) {
  const isActive = isMenuItemActive(item, currentPath);
  const isExpanded = expandable
    ? expandedItems.includes(item.href)  
    : isMenuItemExpanded(item, currentPath);

  return (
    <NavItem
      href={item.href}
      icon={item.icon}
      label={item.label}
      {...(item.badgeCount && { badgeCount: item.badgeCount })}
      isActive={isActive}
      hasChildren={!!item.children}
      isExpanded={isExpanded}
      subpages={item.children}
      onNavigate={onNavigate || (() => {})}
      {...(expandable && { onToggleExpand: onToggleExpandHandler })}
    />
  );
}

// Memoized for performance - avoids re-renders when parent updates
export const SidebarNavItem = memo(SidebarNavItemComponent);
