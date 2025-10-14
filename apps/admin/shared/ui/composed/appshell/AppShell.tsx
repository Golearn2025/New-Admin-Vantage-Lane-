/**
 * AppShell Component - Main Application Layout
 * 
 * Layout principal cu RBAC navigation. Fără business logic.
 * Responsive cu desktop sidebar și mobile drawer.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from './SidebarNav';
import { Topbar } from './Topbar';
import { Drawer } from './Drawer';
import { AppShellProps } from './types';
import styles from './AppShell.module.css';

export function AppShell({
  role,
  currentPath,
  children,
  variant = 'luxe'
}: AppShellProps) {
  
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Handle navigation
  const handleNavigate = (href: string) => {
    // Această funcție va fi implementată de parent component
    // Pentru demo folosim window.location
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  const handleMenuToggle = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  const handleDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className={styles.appShell}>
      {/* Cristi's Carbon Fiber Layers */}
      <div className={styles.carbonHex} />
      <div className={styles.carbonWeave} />
      <div className={styles.metallicReflections} />
      {/* Desktop Sidebar - persistent */}
      {!isMobile && (
        <SidebarNav
          role={role}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      )}

      {/* Mobile Drawer - overlay */}
      {isMobile && (
        <Drawer
          isOpen={isMobileDrawerOpen}
          onClose={handleDrawerClose}
        >
          <SidebarNav
            role={role}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        </Drawer>
      )}

      {/* Main Content Area */}
      <div className={styles.mainArea}>
        {/* Topbar */}
        <Topbar
          role={role}
          onMenuToggle={handleMenuToggle}
        />

        {/* Page Content */}
        <main 
          id="main-content"
          className={styles.pageContent}
          role="main"
        >
          {children}
        </main>
      </div>

      {/* Mobile drawer overlay */}
      {isMobile && isMobileDrawerOpen && (
        <div 
          className={styles.drawerOverlay}
          onClick={handleDrawerClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
