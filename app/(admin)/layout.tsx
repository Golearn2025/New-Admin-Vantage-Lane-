/**
 * Admin Layout - AppShell Integration
 * 
 * Layout global pentru toate paginile admin.
 * Wraps children în AppShell cu RBAC și navigation.
 */

'use client';

import { usePathname } from 'next/navigation';
import { AppShell, UserRole } from '@admin/shared/ui/composed/appshell';
import { useCurrentUser } from '@admin/shared/hooks/useCurrentUser';
import styles from './layout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  // Determine role from user data or fallback to admin
  const userRole: UserRole = user?.role || 'admin';

  // Show loading state while fetching user
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Loading...
      </div>
    );
  }

  return (
    <AppShell
      role={userRole}
      currentPath={pathname}
      {...(user && { user })}
    >
      {children}
    </AppShell>
  );
}
