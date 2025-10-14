/**
 * Admin Layout - AppShell Integration
 * 
 * Layout global pentru toate paginile admin.
 * Wraps children în AppShell cu RBAC și navigation.
 */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppShell, UserRole } from '@admin/shared/ui/composed/appshell';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // TODO: Replace with real authentication
  // For demo purposes, assume admin role
  const userRole: UserRole = 'admin';

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <AppShell
      role={userRole}
      currentPath={pathname}
    >
      {children}
    </AppShell>
  );
}
