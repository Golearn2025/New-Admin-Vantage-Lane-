/**
 * AppShell Component - Main Application Layout
 *
 * Layout principal cu RBAC navigation. Fără business logic.
 * Responsive cu desktop sidebar și mobile drawer.
 */

'use client';

import React, { useState, useEffect } from 'react';
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

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close drawer when path changes (navigation)
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [currentPath]);

  const router = useRouter();

  // Handle navigation - CLIENT-SIDE (no full reload!)
  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleMenuToggle = () => {
    setIsMobileDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

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
        <Drawer isOpen={isMobileDrawerOpen} onClose={handleDrawerClose}>
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
        <div className={styles.drawerOverlay} onClick={handleDrawerClose} aria-hidden="true" />
      )}
    </BrandBackground>
  );
}
