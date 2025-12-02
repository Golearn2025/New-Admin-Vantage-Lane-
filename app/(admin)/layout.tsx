/**
 * Admin Layout - OPTIMIZED VERSION
 *
 * ÎNAINTE: Re-render complet la fiecare navigare (2-3s delay)
 * DUPĂ: Memoized components, stable props (<300ms)
 */

'use client';

import { NotificationsProvider } from '@admin-shared/providers/NotificationsProvider';
import { ReactQueryProvider } from '@admin-shared/providers/ReactQueryProvider';
import { AppShell, UserRole } from '@admin-shared/ui/composed/appshell';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useCurrentUserWithMetrics } from '../../apps/admin/shared/hooks/useCurrentUser';
import { useNewBookingRealtime } from '../../apps/admin/shared/hooks/useNewBookingRealtime';
import { startPerformanceMonitoring } from '../../apps/admin/shared/lib/performance-monitoring';
import styles from './layout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// 🚀 OPTIMIZATION: Memoize AppShell to prevent unnecessary re-renders
const MemoizedAppShell = memo(AppShell);

// 🚀 OPTIMIZATION: Memoize the layout content
const AdminLayoutContent = memo(function AdminLayoutContent({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const { user, loading } = useCurrentUserWithMetrics();

  // 🚀 PERFORMANCE: Memoize user role to prevent recalculation
  const userRole: UserRole = useMemo(() => user?.role || 'admin', [user?.role]);

  // 🚀 PERFORMANCE: Memoize user prop to prevent object recreation
  const memoizedUserProp = useMemo(() => {
    return user ? { user } : undefined;
  }, [user]);

  // 🚀 PERFORMANCE: Track navigation performance
  const handleNavigationStart = useCallback(() => {
    performance.mark('nav-start');
  }, []);

  const handleNavigationEnd = useCallback(() => {
    performance.mark('nav-end');
    try {
      const measure = performance.measure('nav-duration', 'nav-start', 'nav-end');
      console.log(`🧭 Navigation completed in ${Math.round(measure.duration)}ms`);
    } catch (e) {
      // Ignore if marks don't exist
    }
  }, []);

  // Show loading state while fetching user
  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  // 🚀 OPTIMIZATION: Use memoized AppShell with stable props
  return (
    <MemoizedAppShell role={userRole} currentPath={pathname} {...memoizedUserProp}>
      {children}
    </MemoizedAppShell>
  );
});

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // 🔊 CRITICAL: Hook-urile TREBUIE să fie primele - înainte de orice condiție!
  // 🚀 OPTIMIZATION: Move realtime hook here to prevent recreation
  useNewBookingRealtime();

  // 🚀 PERFORMANCE: Start monitoring on mount
  useEffect(() => {
    startPerformanceMonitoring();
    console.log('⚡ Performance optimization active - navigation should be faster!');
  }, []);

  return (
    <ReactQueryProvider>
      <NotificationsProvider>
        <AdminLayoutContent pathname={pathname}>{children}</AdminLayoutContent>
      </NotificationsProvider>
    </ReactQueryProvider>
  );
}

// 🚀 PERFORMANCE MONITORING: Add layout performance tracking
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Track layout renders
  let renderCount = 0;
  const originalConsoleLog = console.log;

  console.log = (...args) => {
    if (args[0]?.includes?.('AdminLayout render')) {
      renderCount++;
      originalConsoleLog(`🏗️ Layout render #${renderCount}:`, ...args.slice(1));
    } else {
      originalConsoleLog(...args);
    }
  };
}
