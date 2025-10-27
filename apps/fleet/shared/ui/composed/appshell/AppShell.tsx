/**
 * AppShell Component - Fleet Portal
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from './SidebarNav';
import { Topbar } from './Topbar';
import { Drawer } from './Drawer';
import { BrandBackground } from '../BrandBackground';
import { AppShellProps } from './types';
import styles from './AppShell.module.css';

export function AppShell({ role, currentPath, children, user }: AppShellProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [currentPath]);

  const handleNavigate = (href: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  return (
    <BrandBackground variant="shell" className={styles.appShell}>
      {!isMobile && (
        <SidebarNav
          role={role}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          collapsible={true}
          onToggleCollapse={setIsSidebarCollapsed}
        />
      )}

      {isMobile && (
        <Drawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)}>
          <SidebarNav role={role} currentPath={currentPath} onNavigate={handleNavigate} />
        </Drawer>
      )}

      <div className={`${styles.mainArea} ${isSidebarCollapsed ? styles.mainAreaCollapsed : ''}`}>
        <Topbar
          role={role}
          onMenuToggle={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          sidebarCollapsed={isSidebarCollapsed}
          {...(user && { user })}
        />

        <main id="main-content" className={styles.pageContent}>
          {children}
        </main>
      </div>

      {isMobile && isMobileDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsMobileDrawerOpen(false)} />
      )}
    </BrandBackground>
  );
}
