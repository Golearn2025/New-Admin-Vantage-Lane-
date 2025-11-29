/**
 * AppShell Component - Main Application Layout
 *
 * Layout principal cu RBAC navigation. Fără business logic.
 * Responsive cu desktop sidebar și mobile drawer.
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarNav } from './SidebarNav';
import { Topbar } from './Topbar';
import { Drawer } from './Drawer';
import { BrandBackground } from '@admin-shared/ui/composed/BrandBackground';
import { AppShellProps } from './types';
import styles from './AppShell.module.css';

export function AppShell({ role, currentPath, children, user }: AppShellProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Detect mobile viewport - OPTIMIZED with debounce
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 250); // Debounce 250ms
    };

    // Initial check
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close drawer when path changes (navigation)
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [currentPath]);

  const router = useRouter();

  // Handle navigation - MEMOIZED for performance
  const handleNavigate = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const handleMenuToggle = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const handleSidebarCollapse = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  return (
    <BrandBackground variant="shell" className={styles.appShell}>
      {/* Desktop Sidebar - persistent */}
      {!isMobile && (
        <SidebarNav
          role={role}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          collapsible={true}
          expandable={true}
          onToggleCollapse={handleSidebarCollapse}
        />
      )}

      {/* Mobile Drawer - overlay */}
      {isMobile && (
        <Drawer isOpen={isMobileDrawerOpen} onClose={handleCloseDrawer}>
          <SidebarNav role={role} currentPath={currentPath} onNavigate={handleNavigate} />
        </Drawer>
      )}

      {/* Main Content Area */}
      <div className={`${styles.mainArea} ${isSidebarCollapsed ? styles.mainAreaCollapsed : ''}`}>
        {/* Topbar */}
        <Topbar
          role={role}
          onMenuToggle={handleMenuToggle}
          onNavigate={handleNavigate}
          sidebarCollapsed={isSidebarCollapsed}
          {...(user && { user })}
        />

        {/* Page Content */}
        <main id="main-content" className={styles.pageContent} role="main">
          {children}
        </main>
      </div>

      {/* Mobile drawer overlay */}
      {isMobile && isMobileDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={handleCloseDrawer} aria-hidden="true" />
      )}
    </BrandBackground>
  );
}
